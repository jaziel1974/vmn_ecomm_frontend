const cryptoProps = {
    algorithm: 'aes256',
    password: 'vOVH6qtSWrUqGbJQPEwVeQ',
    type: 'hex'
}

export function encrypt(text) {
    const crypto = require('crypto');
    const cipher = crypto.createCipher(cryptoProps.algorithm, cryptoProps.password);
    cipher.update(text);
    return cipher.final(cryptoProps.type);
}