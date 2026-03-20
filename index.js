#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import { encryptText, decryptText, createHash, readFile, encryptFile, decryptFile } from './assets/functions.js';

const cwd = process.cwd();
const program = new Command();

/* ====== Init Tool ====== */
program
  .name('fcrypto')
  .description('CLI tool for encrypting/decrypting text, file and hash password, file')
  .version('1.0.0');

  program.usage('fcrypto [commands] [options]')

/* ====== Encrypt command ====== */
program
  .command('encrypt [text]')
  .description('Encrypt text with a password')
  .usage('[text] [options]')
  .requiredOption('-p, --password <password>')
  .option('-a, --alg <algo>', 'Encryption algorithm', 'aes-256-gcm')
  .option('-i, --input <filepath>', 'Input file for encrypt', '')
  .option('-o, --output <filepath>', 'Output file for encrypt')
  .action(async (text, options) => {
    try {
      let encrypted = "";

      console.log(chalk.bold.cyan("\n🔐 ———————— Fcrypto Tool v1.0.0 ———————— 🔐"));
      console.log(chalk.hex("#8B4513")(" Developed by open-source tool enthusiasrs"));
      console.log(chalk.bold.cyan("               ————————————————\n"))

      if(!options.password)
      {
        console.log('⚠️', chalk.bold.yellow(" Warning: Please enter a Password for encryption"));
        return null;
      }

      if(!options.input && !options.output && !text || options.input == "" && options.output == "" && text == "")
      {
        console.log('⚠️', chalk.bold.yellow(" Warning: Please enter a text or file for encryption"));
        return null;
      }

        if(options.input && options.output && !text || options.input !== "" && options.output !== "" && text == "")
        {
          encrypted = await encryptFile(options.input, options.output, options.password, options.alg);
          console.log(chalk.bold.blue("Algorithm: ") + options.alg);
          console.log(chalk.bold.yellow("⚠️  Note: ") + "Use the same password to decrypt this text. Encryption Done!");
          console.log(chalk.bold.green("Encryption Done! ✅"));
        }else{
          encrypted = await encryptText(text, options.password, options.alg);
          console.log(chalk.bold.green("\nEncrypted Text (copy this for decryption):"));
          console.log(chalk.bold.hex('#FFD700') (`< ${encrypted}`));
          console.log(chalk.bold.blue("Algorithm: ") + options.alg);
          console.log(chalk.bold.yellow("⚠️  Note: ") + "Use the same password to decrypt this text. Encryption Done!");
          console.log(chalk.bold.green("Encryption Done! ✅"));
        }

    }catch(e){
      console.log("❌", chalk.bold.red(e));
      return null;
    }
  });

/* ====== Decrypt command ====== */
program
  .command('decrypt [payload]')
  .requiredOption('-p, --password <password>')
  .description('Decrypt text with the decrypt key')
  .usage('[payload] [options]')
  .option('--alg <algorithm>', 'Decryption algorithm')
  .option('-i, --input <filepath>', 'Input file for encrypt', '')
  .option('-o, --output <filepath>', 'Output file for encrypt')
  .action(async (payload, options) => {
    try{

        let decrypted = "";

        console.log(chalk.bold.cyan("\n🔐 ———————— Fcrypto Tool v1.0.0 ———————— 🔐"));
        console.log(chalk.hex("#8B4513")(" Developed by open-source tool enthusiasrs"));
        console.log(chalk.bold.cyan("               ————————————————\n"));

        if(!options.password)
        {
          console.log('⚠️', chalk.bold.yellow(" Warning: Please enter a key for decryption"));
          return null;
        }

        if(!options.input && !options.output && !payload || options.input == "" && options.output == "" && payload == "")
        {
          console.log('⚠️', chalk.bold.yellow(" Warning: Please enter a payload or file for decryption"));
          return null;
        }

        if(options.input && options.output && !payload || options.input && options.output && payload == "")
        {
          decrypted = await decryptFile(options.input, options.output, options.password, options.algo);
        }else{
          decrypted = await decryptText(payload, options.password, options.alg);
        }

        console.log(chalk.bold.bold.green("Decrypted Text: "));
        console.log(chalk.bold.hex('#FFD700') (`< ${decrypted} >`));
        console.log(chalk.bold.green("Decryption Done! ✅"));

    }catch(e){
      console.log("❌", chalk.bold.red(e));
      return null;
    }
  });

 /* ====== Hash command ====== */
  program
  .command('hash [password]')
  .usage('[password] [options]')
  .option('-f, --file <path>', 'Select file to get data', '')
  .description('Create password hash')
  .action(async (password, options) => {

    try{

      if(options.file && !password || options.file && password == "")
      {
        password = readFile(options.file);
      }

      if(!options.file && !password || options.file == "" && password == "")
      {
        console.log('⚠️', chalk.bold.yellow(" Warning: Please enter a password or file for hash"));
        return null;
      }

      console.log(chalk.bold.cyan("\n🔐 ———————— Fcrypto Tool v1.0.0 ———————— 🔐"));
      console.log(chalk.hex("#8B4513")(" Developed by open-source tool enthusiasrs"));
      console.log(chalk.bold.cyan("               ————————————————\n"))
      const hash = await createHash(password);
      console.log(chalk.bold.green("Hashed Password: "));
      console.log(chalk.bold.hex('#FFD700') (`< ${hash} >`));
      console.log(chalk.bold.green("Hash Done! ✅"));
    }catch(e)
    {
      console.log("❌", chalk.bold.red(e));
      return null;
    }

  });
  
program.parse(process.argv);