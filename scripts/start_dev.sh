#!/bin/bash

echo "Generating Key Pair Encrypt/Decrypt"
if test -e "./id_rsa"; then
    echo "Skip generating Key Pair. Reason: Key pair already exists."
else
    sh "./scripts/genkeypair.sh"
fi

echo ""

echo "Generating Token Payload"
sh "./scripts/gentokenpayload.sh"

echo ""

echo "Installing dependencies & Starting an application in development mode"
npm install && npm run dev
if [ $? -ne 0 ]; then
  echo "Error installing dependencies or Starting an application"
  exit 1
fi