#!/bin/bash
if [ $1 = true ]; then
  echo "<======= npm install =======>"
  npm install
fi
echo "<======= npm run build =======>"
npm run build
echo "<======= rm -rf ../node/public/web && cp -r web ../node/public =======>"
rm -rf ../node/public/web && cp -r web ../node/public