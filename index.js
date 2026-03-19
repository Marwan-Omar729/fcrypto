#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import { encryptText, decryptText, createHash, readFile } from './assets/functions.js';

const program = new Command();

program
  .name('fcrypto')
  .description('CLI tool for encrypting/decrypting text with a password only')
  .version('1.0.0');

program
  .command('encrypt')
  .argument('[text]')
  .requiredOption('-p, --password <password>')
  .description('Encrypt text with a password')
  .option('--alg <algo>', 'Encryption algorithm', 'aes-256-gcm')
  .option('-f, --file <path>', 'Select file to get data', '')
  .action(async (text, options) => {
    try {

      if(!options.password)
      {
        console.log('⚠️', chalk.bold.yellow(" Warning: Please enter a Password for encryption"));
        return null;
      }

      if(!options.file && !text || options.file == "" && text == "")
      {
        console.log('⚠️', chalk.bold.yellow(" Warning: Please enter a text or file for encryption"));
        return null;
      }

        if(options.file && !text || options.file && text == "")
        {
          text = readFile(options.file);
        }

        console.log(chalk.bgRed.bold("\n========= fcrypto By Marwan Omar =========\n"));
        const encryptedPayload = await encryptText(text, options.password, options.alg);
        console.log(chalk.bold.green("Encrypted Text (copy this for decryption):"));
        console.log(`< ${encryptedPayload} >`);
        console.log(chalk.bold.blue("Algorithm: ") + options.alg);
        console.log(chalk.bold.yellow("⚠️  Note: ") + "Use the same password to decrypt this text. Encryption Done!");
        console.log(chalk.bold.green("Encryption Done! ✅"));

    }catch(e){
      console.log("❌", chalk.bold.red(e));
      return null;
    }
  });

program
  .command('decrypt')
  .argument('[payload]')
  .requiredOption('-p, --password <password>')
  .description('Decrypt text with the original password')
  .option('--alg <algo>', 'Decryption algorithm', 'aes-256-gcm')
  .option('-f ,--file <path>', 'Select file to get data', '')
  .action(async (payload, options) => {
    try{

        if(!options.password)
        {
          console.log('⚠️', chalk.bold.yellow(" Warning: Please enter a Password for decryption"));
          return null;
        }

        if(!options.file && !payload || options.file == "" && payload == "")
        {
          console.log('⚠️', chalk.bold.yellow(" Warning: Please enter a payload or file for decryption"));
          return null;
        }

        if(options.file && !payload || options.file && payload == "")
        {
          payload = readFile(options.file);
        }

        console.log(chalk.bgBlue.bold("\n========= fcrypto By Marwan Omar =========\n"));
        const decrypted = await decryptText(payload, options.password, options.alg)
        console.log(chalk.bold.bold.green("Decrypted Text: "));
        console.log(`< ${decrypted} >`);
        console.log(chalk.bold.green("Decryption Done! ✅"));

    }catch(e){
      console.log("❌", chalk.bold.red(e));
      return null;
    }
  });

  program
  .command('hash')
  .argument('[password]')
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

      console.log(chalk.bgBlue.bold("\n========= fcrypto By Marwan Omar =========\n"));
      const hash = await createHash(password);
      console.log(chalk.bold.green("Hashed Password: "));
      console.log(`< ${hash} >`);
      console.log(chalk.bold.green("Hash Done! ✅"));
    }catch(e)
    {
      console.log("❌", chalk.bold.red(e));
      return null;
    }

  });
program.parse(process.argv);