@echo off

node "-e" "
const fs = require('fs');
const crypto = require('crypto');

const { writeFileSync } = fs;
const { generateKeyPairSync } = crypto;

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,  // Key size in bits
  publicKeyEncoding: {
    type: 'spki',       // Recommended to use 'spki' for public key
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',      // Recommended to use 'pkcs8' for private key
    format: 'pem'
  }
});

writeFileSync('./example_id_rsa.pub', publicKey, 'utf-8')
writeFileSync('./example_id_rsa', privateKey, 'utf-8')
"