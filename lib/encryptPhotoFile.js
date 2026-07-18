const fs = require('fs');
const crypto = require('crypto');
const { pipeline } = require('stream/promises');

async function encryptPhotoFile(inputPath, outputPath, password) {
  if (typeof password !== 'string' || password.length < 8) {
    return false;
  }

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  try {
    const inputStream = fs.createReadStream(inputPath);
    const outputStream = fs.createWriteStream(outputPath);
    outputStream.write(Buffer.concat([salt, iv]));
    await pipeline(inputStream, cipher, outputStream, { end: false });
    await new Promise((resolve, reject) => outputStream.end(cipher.getAuthTag(), err => err ? reject(err) : resolve()));
    return true;
  } catch {
    try { fs.unlinkSync(outputPath); } catch {}
    return false;
  }
}

module.exports = { encryptPhotoFile };
