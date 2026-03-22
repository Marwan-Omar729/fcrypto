
# fcrypto

![Tool's logo](https://res.cloudinary.com/dlmpljxm7/image/upload/v1774138429/fcrypto-logo_lznpux.png)

  

A comprehensive CLI tool for encrypting and decrypting text and files with passwords, featuring a powerful and easy-to-use set of features 🔒✨

 
---

 
## 📖 Table of Contents

  

1. [Features](#features)

2. [Encryption Details](#encryption-details)

3. [Key Derivation](#key-derivation)

4. [Requirements](#requirements)

5. [Installation](#installation)

6. [Usage Examples](#usage-examples)

7. [Errors & Warnings](#errors--warnings)

8. [Contributing](#contributing)

9. [Contact](#contact)

  

---

  

## 🔹 Features

  

* Encrypt and decrypt **text** with passwords

* Encrypt and decrypt **files** with passwords

* Choose any **AES algorithm** you need

* Hash passwords

* Extract passwords from a text file if hashing is performed

* Convert passwords to **QR codes** for easy sharing

* Open source and easy to use
  
* Support for pipes in Unix

  

---

  

## 🔐 Encryption Details

  

* Uses **AES-256-GCM** for both text and files

* Strong 256-bit encryption

* Built-in authentication to detect tampering

* Modern and secure design used in real-world systems

  

---

  

## 🗝 Key Derivation

  

* Passwords are **never used directly** as encryption keys

* fcrypto derives a **256-bit key** from the password to ensure strong and consistent encryption

  

---

  

## ⚙ Requirements

  

* Node.js **20 or higher**

  

---

  

## 💾 Installation

  

### 1. Install as a global tool

  

```bash

npm install -g @marwan-omar/fcrypto

```

  

Now you can run `fcrypto` like any system command.

  

### 2. Run from code (for development)

  

```bash

git clone https://github.com/Marwan-Omar729/fcrypto.git

cd fcrypto

npm install

npm link

```

  

Then you can use it as a CLI tool locally.

  

---

  

## 🛠 Usage Examples

  

### Encrypt Text

  

```bash

fcrypto encrypt "Hello World" -p myPassword

```

  

### Decrypt Text

  

```bash

fcrypto decrypt "EncryptedPayload" -p myPassword

```

  

### Encrypt a File

  

```bash

fcrypto encrypt -i myfile.txt -o Encryptedfile -p myPassword

```

  

### Decrypt a File

  

```bash

fcrypto decrypt -i Encryptedfile.enc -o Decryptedfile.txt -p myPassword

```

  

### Create a Hash of a Password

  

```bash

fcrypto hash  "myPassword"

```
### Create a Hash  a Password from file

  ```bash

fcrypto hash -f  myfile.txt

```

### Generate QR Code for a Password

  

```bash

fcrypto encrypt Mytext -p Mypassword "myPassword" --qr -s

```

- -s: to save QR code

  

---

  

## ⚠ Errors & Warnings

  

| Error | Meaning | Solution |

| -------------------- | ---------------------------- | ------------------------------------------ |

| `Password too short` | Password length insufficient | Use a password with at least 8 characters |

| `File not found` | Input file missing | Check the file path and try again |

| `Invalid command` | Command not recognized | Use `fcrypto --help` to see valid commands |

  

---

  

## 🤝 Contributing

  

* Fork the repository

* Make your changes

* Open a Pull Request with your improvements

* Ensure CLI commands work correctly and test all features

  

---

  

## 📬 Contact

  

**Marwan Omar** – Main programmer and originator of the idea

  

* E-mail: [omarawan724@gmail.com](mailto:omarawan724@gmail.com)

* TikTok: [@kitsune_fire0](https://www.tiktok.com/@kitsune_fire0?_r=1&_t=ZS-94srWcQ26mC)

* GitHub: [Marwan-Omar729](https://github.com/Marwan-Omar729)

  

**Youssef George** – Assistant and originator of file encryption idea

  

> Modifying the tool and sharing it under a different name is permitted, provided you state that the tool is based on fcrypto.

  

---
