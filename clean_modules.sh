
rm -rf backend/node_modules
rm -rf frontend/web/node_modules
rm -rf frontend/mobile/node_modules

rm -f backend/package-lock.json
rm -f frontend/web/package-lock.json
rm -f frontend/mobile/package-lock.json

cd backend
npm i

cd ../frontend/web
npm i

cd ../mobile
npm i
