/* ====== Library import ====== */
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import zlib from "zlib";
import fs from "fs";
import cliProgress from 'cli-progress';
import QRCode from "qrcode";

/* ====== Encryption function ====== */
async function encryptText(text, password, algorithm = 'aes-256-gcm') {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const algo = algorithm || 'aes-256-gcm';
  let keyLength;
  if (algo.includes('256')) keyLength = 32;
  else if (algo.includes('192')) keyLength = 24;
  else keyLength = 16;

  const key = crypto.pbkdf2Sync(password, salt, 100000, keyLength, 'sha256');

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const chunkSize = 5;
  let encrypted = '';

  const bar = new cliProgress.SingleBar({
    format: 'Encrypting |{bar}| {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  }, cliProgress.Presets.shades_classic);
  bar.start(text.length, 0);

  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.slice(i, i + chunkSize);
    encrypted += cipher.update(chunk, 'utf8', 'base64');
    bar.update(Math.min(i + chunk.length, text.length));
    await new Promise(r => setTimeout(r, 10));
  }
  encrypted += cipher.final('base64');
  bar.update(text.length);
  bar.stop();

  const authTag = cipher.getAuthTag();

  const finalPayload = `${salt.toString('base64')}:${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  return finalPayload;
}

/* ====== Decryption function ====== */
async function decryptText(payload, password, algorithm = 'aes-256-gcm') {
  const [saltB64, ivB64, authTagB64, encryptedData] = payload.split(':');
  const salt = Buffer.from(saltB64, 'base64');
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const algo = algorithm || 'aes-256-gcm';
  let keyLength;
  if (algo.includes('256')) keyLength = 32;
  else if (algo.includes('192')) keyLength = 24;
  else keyLength = 16;
  
  const key = crypto.pbkdf2Sync(password, salt, 100000, keyLength, 'sha256');

  const decipher = crypto.createDecipheriv(algo, key, iv);
  decipher.setAuthTag(authTag);

  const chunkSize = 5;
  let decrypted = '';

  const encryptedBuffer = Buffer.from(encryptedData, 'base64');

  const bar = new cliProgress.SingleBar({
    format: 'Decrypting |{bar}| {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  }, cliProgress.Presets.shades_classic);
  bar.start(encryptedBuffer.length, 0);

  for (let i = 0; i < encryptedBuffer.length; i += chunkSize) {
    const chunk = encryptedBuffer.slice(i, i + chunkSize);

    decrypted += decipher.update(chunk, null, 'utf8');
    bar.update(Math.min(i + chunk.length, encryptedBuffer.length));
    await new Promise(r => setTimeout(r, 10));
  }
  decrypted += decipher.final('utf8');
  bar.update(encryptedBuffer.length);
  bar.stop();

  return decrypted;
}

/* ====== Hash generation function ====== */
let rounds = 10;
async function createHash(password)
{
  const bar = new cliProgress.SingleBar({
    format: 'Hashing |{bar}| {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  }, cliProgress.Presets.shades_classic);

  bar.start(rounds, 0);
  let hash = password;

  for(let i = 1; i <= rounds; i++)
  {
    hash = await bcrypt.hash(hash, 1);
    bar.update(i);
  }
  bar.stop();

  return hash;
}

/* ====== File encryption function ====== */
async function encryptFile(inputPath, outputPath, password, algorithm = 'aes-256-gcm') {
  return new Promise((resolve, reject) => {
    try {
      const allowedAlgos = ['aes-128-gcm','aes-192-gcm','aes-256-gcm'];
      if (!allowedAlgos.includes(algorithm)) throw new Error('Unsupported algorithm');

      const stats = fs.statSync(inputPath);
      const totalSize = stats.size;
      let processed = 0;

      const bar = new cliProgress.SingleBar({
        format: 'Encrypting |{bar}| {percentage}% || {value}/{total} bytes',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
      });
      bar.start(totalSize, 0);

      const salt = crypto.randomBytes(16);
      const iv = crypto.randomBytes(12);

      const keyLengthMap = {
        'aes-128-gcm': 16,
        'aes-192-gcm': 24,
        'aes-256-gcm': 32
      };
      const keyLength = keyLengthMap[algorithm];

      const key = crypto.pbkdf2Sync(password, salt, 200000, keyLength, 'sha256');

      const cipher = crypto.createCipheriv(algorithm, key, iv);

      const input = fs.createReadStream(inputPath);
      const output = fs.createWriteStream(outputPath);

      // header: salt + iv
      output.write(salt);
      output.write(iv);

      const gzip = zlib.createGzip();
      input.pipe(gzip).pipe(cipher).pipe(output);

      input.on('data', chunk => {
        processed += chunk.length;
        bar.update(processed);
      });

      output.on('finish', () => {
        bar.stop();
        const authTag = cipher.getAuthTag();
        fs.appendFileSync(outputPath, authTag);
        resolve({ iv: iv.toString('hex'), authTag: authTag.toString('hex') });
      });

      input.on('error', reject);
      cipher.on('error', reject);
      gzip.on('error', reject);
      output.on('error', reject);

    } catch (err) {
      reject(err);
    }
  });
}

/* ====== File decryption function ====== */
async function decryptFile(inputPath, outputPath, password, algorithm = 'aes-256-gcm') {
  return new Promise((resolve, reject) => {
    try {
      const allowedAlgos = ['aes-128-gcm','aes-192-gcm','aes-256-gcm'];
      if (!allowedAlgos.includes(algorithm)) throw new Error('Unsupported algorithm');

      const stats = fs.statSync(inputPath);
      const authTagLength = 16;
      const totalSize = stats.size - 28 - authTagLength; 
      let processed = 0;

      const bar = new cliProgress.SingleBar({
        format: 'Decrypting |{bar}| {percentage}% || {value}/{total} bytes',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
      });
      bar.start(totalSize, 0);

      const header = Buffer.alloc(28);
      const fd = fs.openSync(inputPath, 'r');
      fs.readSync(fd, header, 0, 28, 0);
      fs.closeSync(fd);

      const salt = header.slice(0,16);
      const iv = header.slice(16,28);

      const keyLengthMap = {
        'aes-128-gcm': 16,
        'aes-192-gcm': 24,
        'aes-256-gcm': 32
      };
      const keyLength = keyLengthMap[algorithm];
      const key = crypto.pbkdf2Sync(password, salt, 200000, keyLength, 'sha256');

      const tagBuffer = Buffer.alloc(authTagLength);
      const fd2 = fs.openSync(inputPath, 'r');
      fs.readSync(fd2, tagBuffer, 0, authTagLength, stats.size - authTagLength);
      fs.closeSync(fd2);

      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      decipher.setAuthTag(tagBuffer);

      const input = fs.createReadStream(inputPath, { start: 28, end: stats.size - authTagLength - 1 });
      const output = fs.createWriteStream(outputPath);
      const gunzip = zlib.createGunzip();

      input.pipe(decipher).pipe(gunzip).pipe(output);

      input.on('data', chunk => {
        processed += chunk.length;
        bar.update(processed);
      });

      output.on('finish', () => {
        bar.stop();
        resolve({ iv: iv.toString('hex'), authTag: tagBuffer.toString('hex')});
      });

      input.on('error', reject);
      decipher.on('error', reject);
      gunzip.on('error', reject);
      output.on('error', reject);

    } catch (err) {
      reject(err);
    }
  });
}

/* ====== Generate QR function ====== */
function QRcode(txt) {
  QRCode.toString(txt, { type: "terminal" }, (err, qr) => {
    if(err) {
      console.log("❌ An error occurred while generating the QR code. Please try again."); 
      return null;
    }
    console.error('\n' + qr);
  });
}

/* ====== Save QR function ====== */
function QRcodeSave(txt, saveAsImage = false, filename = 'qrcode.png')
{
  if(saveAsImage) {
    QRCode.toFile(filename, txt, {
      color: {
        dark: '#000000',
        light: '#FFFFFF' 
      }
    }, (err) => {
      if(err) {
        console.error("❌ An error occurred while generating the QR image.");
      } else {
        console.log(`\n✅ QR code saved as ${filename}`);
      }
    });
  }
}

/* ====== Get data from file ====== */
function readFile(path)
{
    let data = fs.readFileSync(path, "utf8");
    return data;
}

/* ====== Exporting functions ====== */
export { encryptText, decryptText, createHash, readFile, encryptFile, decryptFile, QRcode, QRcodeSave };