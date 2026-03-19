#!/usr/bin/env node
import chalk from 'chalk';
import { Command } from 'commander';
import { encryptText, decryptText, createHash } from './assets/functions.js';

const program = new Command();

program
  .name('fcrypto')
  .description('CLI tool for encrypting/decrypting text with a password only')
  .version('1.0.0');

program
  .command('encrypt <txt> <password>')
  .description('Encrypt text with a password')
  .option('--alg <algo>', 'Encryption algorithm', 'aes-256-gcm')
  .action(async (txt, password, options) => {
    try {

        const encryptedPayload = await encryptText(txt, password, options.alg);

        console.log(chalk.bgRed.bold("\n========= fcrypto By Marwan Omar =========\n"));
        console.log(chalk.bold.green("Encrypted Text (copy this for decryption):"));
        console.log(`< ${encryptedPayload} >`);
        console.log(chalk.bold.blue("Algorithm: ") + options.alg);
        console.log(chalk.bold.yellow("⚠️  Note: ") + "Use the same password to decrypt this text. Encryption Done!");
        console.log(chalk.green("Encryption Done! ✅"));

    }catch(e){console.log("❌", chalk.bold.red(e))}
  });

program
  .command('decrypt <payload> <password>')
  .description('Decrypt text with the original password')
  .option('--alg <algo>', 'Decryption algorithm', 'aes-256-gcm')
  .action(async (payload, password, options) => {
    try{

        const decrypted = await decryptText(payload, password, options.alg);

        console.log(chalk.bgBlue.bold("\n========= fcrypto By Marwan Omar =========\n"));
        console.log(chalk.bold.green("Decrypted Text: ") + decrypted);
        console.log(chalk.green("Decryption Done! ✅"));

    }catch(e){console.log("❌", chalk.bold.red(e))}
  });

  program
  .command('hash <password>')
  .description('Create password hash')
  .action(async (password) => {

    try{
      const hash = await createHash(password);
      console.log(chalk.bgBlue.bold("\n========= fcrypto By Marwan Omar =========\n"));
      console.log(`< ${hash} >`);
      console.log(chalk.green("Hash Done! ✅"));
    }catch(e)
    {
      console.log("❌", chalk.bold.red(e));
    }

  });
program.parse(process.argv);