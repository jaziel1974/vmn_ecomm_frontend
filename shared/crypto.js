//import CryptoJs from 'crypto-js';

const cryptoProps = {
    enc: 'vOVH6qtSWrUqGbJQPEwVeQ',
    //iv: CryptoJs.lib.WordArray.random(128 / 8)
}

export function encrypt(text) {
    return "";//CryptoJs.AES.encrypt(JSON.stringify(text), cryptoProps.enc);
}

export function decrypt(text) {
    //const bytes =  CryptoJs.AES.decrypt(text, cryptoProps.enc)
    return ""; JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
}