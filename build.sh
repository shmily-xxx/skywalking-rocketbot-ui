#! /bin/bash

basepath=$(cd `dirname $0`; pwd)
echo ${bashpath} 
echo "npm config start"
npm config set registry https://repo.huaweicloud.com/repository/npm/
npm config set sass_binary_site https://repo.huaweicloud.com/node-sass
npm -q --cache-min Infinity install
npm run build


if [ ! -d "dist" ]; then
  echo "file is not exist"
fi