#!/usr/bin/env node

/* ====== Libraries import ====== */
import chalk from 'chalk';
import { Command } from 'commander';
import { encryptText, decryptText, createHash, readFile, encryptFile, decryptFile, QRcode, QRcodeSave } from '../assets/core.js';
import { ServerListen } from "../server/server.js";
import open from "open";

/* ====== Read from pipe ====== */
function readStdin() {
  return new Promise(resolve => {
    let data = '';
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', chunk => {
      data += chunk;
    });

    process.stdin.on('end', () => {
      resolve(data.trim());
    });
  });
}

const program = new Command();

/* ====== Show banner function ====== */
function showBanner() {
  if (process.stderr.isTTY) {
    console.error(chalk.bold.cyan("\n🔐 ———————— Fcrypto Tool v2.1.1 ———————— 🔐"));
    console.error(chalk.hex("#8B4513")(" Developed by open-source tool enthusiasts. Primary developer Marwan Omar (Kitsune)"));
    console.error(chalk.bold.cyan("               ———————————————\n"));
  }
}

/* ====== Preparing the tool ====== */
program
  .name('fcrypto')
  .description('Encrypting and decrypting texts and files using only a password, and performing hashing of passwords and words from files.')
  .version('2.1.1')
  .usage('[commands] [options]');

/* ====== Encryption command ====== */
program
  .command('encrypt [text]')
  .usage('[text] [option]')
  .description('Encrypt text with a password')
  .requiredOption('-p, --password <password>')
  .option('-a, --alg <algorithm>', 'Encryption algorithm', 'aes-256-gcm')
  .option('-i, --input <filepath>', 'Input file for encrypt')
  .option('-o, --output <filename>', 'Output file for encrypt')
  .option('--qr', 'Generate QR code for password')
  .option('-s ,--sqr <Imgname>', 'Save QR code for password')
  .action(async (text, options) => {
    try {

      if (!text && !options.input && !process.stdin.isTTY) {
        text = await readStdin();
      }

      let encrypted = "";

      showBanner();

      if(!options.password) {
        console.error(chalk.bold.yellow("⚠️ Warning: Please enter a Password for encryption"));
        return null;
      }

      if (!text && !options.input) {
        console.error(chalk.bold.yellow("⚠️ Warning: Please enter a text or file for encryption"));
        return null;
      }

      if (text && options.input) {
        console.log("❌ You cannot use text and file input at the same time.");
        return null;
      }

      if(options.input) {
        encrypted = await encryptFile(options.input, options.output || `${options.input}.enc`, options.password, options.alg);
        console.error(chalk.bold.blue(" [+] Algorithm: ") + options.alg);
        console.error(chalk.bold.yellow(" [+] Note: Use the same password to decrypt this text."));
        console.error(chalk.bold.green(" Encryption Done! ✅"));
      } else {
        encrypted = await encryptText(text, options.password, options.alg);
        console.error(chalk.bold.green("\n [+] Encrypted Text (copy this for decryption):"));
        process.stdout.write(' ' + encrypted + "\n");
        console.error(chalk.bold.blue(" [+] Algorithm: ") + options.alg);
        console.error(chalk.bold.yellow(" [+] Note: Use the same password to decrypt this text."));
        console.error(chalk.bold.green(" Encryption Done! ✅"));
      }

      if (options.qr && process.stderr.isTTY) {
        QRcode(options.password);
        console.error(chalk.bold.green("A password has been generated. Share it with whomever you want to decrypt it."));
      }

      if(options.sqr)
      {
        QRcodeSave(options.password, true, `${options.sqr}.png`);
      }

    } catch(e) {
      console.error(chalk.bold.red("❌ " + e));
      return null;
    }
  });

/* ====== Decryption command ====== */
program
  .command('decrypt [payload]')
  .usage('[payload] [option]')
  .requiredOption('-p, --password <password>')
  .description('Decrypt text with a password')
  .option('-a ,--alg <algorithm>', 'Decryption algorithm', 'aes-256-gcm')
  .option('-i, --input <filepath>', 'Input file for decrypt')
  .option('-o, --output <filename>', 'Output file for decrypt')
  .action(async (payload, options) => {
    try {
      if (!payload && !options.input && !process.stdin.isTTY) {
        payload = await readStdin();
      }

      let decrypted = "";

      showBanner();

      if(!options.password) {
        console.error(chalk.bold.yellow('⚠️ ' + "Warning: Please enter a key for decryption"));
        return null;
      }

      if (payload && options.input) {
        console.log("❌ You cannot use text and file input at the same time.");
        return null;
      }

      if(options.input) {
        decrypted = await decryptFile(options.input, options.output || `${options.input}.dec`, options.password, options.alg);
        console.error(chalk.bold.green("Decryption Done! ✅"));
      } else {
        decrypted = await decryptText(payload, options.password, options.alg);
        console.error(chalk.bold.green(" [+] Decrypted Text:"));
        process.stdout.write(' ' + decrypted + "\n");
        console.error(chalk.bold.green(" Decryption Done! ✅"));
      }

    } catch(e) {
      console.error(chalk.bold.red("❌ " + e));
      return null;
    }
  });

/* ====== Hash command ====== */
program
  .command('hash [password]')
  .description('Password hashing creation')
  .usage('[password] [option]')
  .option('-f, --file <fileinput>', 'Extract password from a file')
  .option('-s, --salt <salt>', 'Determining the Salt value for a hash operation', '12')
  .action(async (password, options) => {
    try {
      if (!password && !options.file && !process.stdin.isTTY) {
        password = await readStdin();
      }

      if(options.file) {
        password = readFile(options.file);
      }

      if(!password) {
        console.error(chalk.bold.yellow("⚠️ Warning: Please enter a password or file for hash"));
        return null;
      }

      showBanner();

      const hash = await createHash(password, options.salt);
      console.error(chalk.bold.green(" [+] Hashed Password:"));
      process.stdout.write(' ' + hash + "\n");
      console.error(chalk.bold.blue(" [+] Salt:") + options.salt);
      console.error(chalk.bold.green(" Hash Done! ✅"));
    } catch(e) {
      console.error(chalk.bold.red("❌ " + e));
      return null;
    }
  });

  /* ====== GUI command ====== */
  program
  .command('web')
  .description('Run the tool as a graphical interface (GUI)')
  .usage('[option]')
  .option('-s, --port [port]', 'Specify the server interface port')
  .action(async (options) => {

    try{

      showBanner();
      let Server = ServerListen(options.port);
      let link = `http://localhost:${Server}`;
      console.log(chalk.green("💻 Server:"), chalk.cyan('Please wait...'));

      if(Server === options.port)
      {
        setTimeout(() => {
          console.log(chalk.green("💻 Server:"), chalk.cyan(`GUI is running at `) + chalk.blue(link));
        }, 1000);
      }
    
    }catch(e){

      if(e.code == 'EACCES')
      {
          console.log(chalk.bold.red("❌ " + 'This port used already'));
          return null;
      }else{
        console.error(chalk.bold.red("❌ " + e));
        return null;
      }
    }

  });

program.parse(process.argv);