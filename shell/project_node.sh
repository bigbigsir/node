#!/bin/bash
if [ $1 = true ]; then
  echo "<======= nginx -s reload =======>"
  nginx -s reload
fi
if [ $2 = true ]; then
  echo "<======= npm install =======>"
  npm install
fi
echo "<======= pm2 reload all =======>"
pm2 reload all