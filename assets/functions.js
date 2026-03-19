import crypto from 'crypto';
import bcrypt from 'bcrypt';
import cliProgress from 'cli-progress';

/* ====== Encrypt Function ====== */
async function encryptText(text, password, algorithm) {
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

/* ====== Decrypt Function ====== */
async function decryptText(payload, password, algorithm = 'aes-255-gcm') {
  const [saltB64, ivB64, authTagB64, encryptedData] = payload.split(':');
  const salt = Buffer.from(saltB64, 'base64');
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(authTagB64, 'base64');
  const algo = algorithm || 'aes-256-gcm';
  let keyLength;
  if (algorithm.includes('256')) keyLength = 32;
  else if (algorithm.includes('192')) keyLength = 24;
  else keyLength = 16;
  
  const key = crypto.pbkdf2Sync(password, salt, 100000, keyLength, 'sha256');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  const chunkSize = 5;
  let decrypted = '';

  const bar = new cliProgress.SingleBar({
    format: 'Decrypting |{bar}| {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  }, cliProgress.Presets.shades_classic);
  bar.start(encryptedData.length, 0);

  for (let i = 0; i < encryptedData.length; i += chunkSize) {
    const chunk = encryptedData.slice(i, i + chunkSize);
    decrypted += decipher.update(chunk, 'base64', 'utf8');
    bar.update(Math.min(i + chunk.length, encryptedData.length));
    await new Promise(r => setTimeout(r, 10));
  }
  decrypted += decipher.final('utf8');
  bar.update(encryptedData.length);
  bar.stop();

  return decrypted;
}

/* ====== Hash Function ====== */
let rounds = 10;
async function createHash(password)
{
  const bar = new cliProgress.SingleBar({
    format: 'Decrypting |{bar}| {percentage}%',
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

export { encryptText, decryptText, createHash };