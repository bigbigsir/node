#!/bin/bash
if [ "$1" = true ]; then
  echo "<======= npm install =======>"
  npm install
fi

if [ "$2" = true ]; then
  echo "<======= nginx -t =======>"
  nginx -t
  echo "<======= nginx -s reload =======>"
  nginx -s reload
fi

echo "<======= pm2 restart port3030 =======>"
pm2 restart port3030
