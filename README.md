# fcrypto
![Tool's logo](https://res.cloudinary.com/dlmpljxm7/image/upload/v1774138429/fcrypto-logo_lznpux.png)

A comprehensive tool for encrypting and decrypting text and files with passwords, featuring a powerful and easy-to-use set of features 🔒✨

---

## Features

1. Encrypt and decrypt text with passwords

2. Encrypt and decrypt files with passwords

3. Choose any AES algorithm you need

4. Uses a powerful algorithm for file encryption

5. Hash passwords

6. Extract passwords from a text file if hashing is performed

7. Easy to use

8. Convert passwords to QR codes for easy sharing

9. Open source

---

## Encryption

fcrypto uses **AES-256-GCM** for encrypting both text and files. This mode provides:

- Strong 256-bit encryption
- Built-in authentication to detect tampering
- Modern and secure design used in real-world security systems

## Key Derivation

User passwords are never used directly as encryption keys.

Instead, fcrypto derives a 256-bit key from the password before encryption to ensure consistent and secure key length.

---

## Requirements

- Node.js 20 or higher

---

## How to Run It

### 1. Run the full tool

```bash

npm install -g marwan-omar@fcrypto

```

Now you can run it like any other system tool.


---

## 2. Running the open code

1. Navigate to the project folder

2. Execute:

```bash

npm install

npm link

```
And that's how you run it like any other tool.

---
### Examples of using the tool:

```bash
fcrypto encrypt TEXT -p Password
```

- Here, the tool encrypts the "TEXT" text. The command means:
- fcrypto: The tool's name
- encrypt: The command to encrypt the text
- TEXT: The text
- -p: Tells the tool that the following text is the password for encryption

Example of decryption:

```bash
fcrypto decrypt Payload -p Password

```

- Payload: The encrypted text

Example of creating a hash:

```bash
fcrypto hash Password
```

- Password: The password you want to use to create the hash

----

- ​​The tool was developed by:

1. Marwan Omar (Main programmer and originator of the idea)

2. Youssef George (Assistant and originator of the file encryption idea)
---

- Social Media:
### Marwan Omar

1. Whatsapp: 01273688106
2. Facebook: https://www.facebook.com/marawan.omar.228383 
3. Tiktok: https://www.tiktok.com/@kitsune_fire0?_r=1&_t=ZS-94srWcQ26mC
---
Modifying the tool and sharing it under a different name is permitted, provided you state that the tool Based on the fcrypto tool.
