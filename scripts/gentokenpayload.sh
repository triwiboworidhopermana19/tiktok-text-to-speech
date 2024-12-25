#!/bin/bash

if test -e "./token-payload-generator.ts"; then
    rm -rf ./token-payload-generator.ts
fi

echo "import fs from 'fs';
import moment from 'moment-timezone'
import { Encryptor, LicensePayload } from './lib/license-checker'

const privateKey = fs.readFileSync('./id_rsa', 'utf8')
const encryptor: Encryptor = new Encryptor(privateKey)
const payload: LicensePayload = {
    timezone: 'Asia/Jakarta',
    expiredAt: moment().tz('Asia/Jakarta').add(50, 'years').toDate()
}

const signature = encryptor.encrypt(payload)
console.log(signature);" >> ./token-payload-generator.ts

tsx ./token-payload-generator.ts