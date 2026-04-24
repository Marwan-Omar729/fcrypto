/* ====== Libraries import ====== */
import  express from "express";
import path from "node:path"
import { fileURLToPath } from "url";
import { encryptText, decryptText, createHash, readFile, encryptFile, decryptFile, QRcode, QRcodeSave } from '../assets/core.js';
const app = express();

/* ====== dirname ====== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

/* ====== End points ====== */
app.get('/', (req, res) => {
    try{
        res.sendFile(path.join(__dirname, "../public", "index.html"));
    }catch(error){
        return error;
    }
});

app.post('/encryptText', async (req, res) => {
    let { Text, Password } = req.body;
    
    if(Text !== "" && Password !== "")
    {
        let Encrypt = await encryptText(Text, Password);
        document.getElementById("TEXTENCRYPT_result").innerHTML = Encrypt;
    }
    
});

/* ====== Listen Server ====== */
export function ServerListen(port = 8080)
{
    try{
        app.listen(port);
        return port;
    }catch(e)
    {
        if(e.code == 'EACCES')
        {
            console.log('This port used already');
        }
    }
}