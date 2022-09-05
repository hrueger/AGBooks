cd ../frontend
npm install
npm run build -- --output-path=../docker/frontend
cd ../backend
npm install
npm run build -- --output-path=../docker/backend
cd ../api
npm install
npx @vercel/ncc build src/index.ts -o ../docker/api
cp -r assets ../docker/api/
cd ../docker
PACKAGE_VERSION=$(cat ../frontend/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
docker build -t hrueger/agbooks:v$PACKAGE_VERSION .
rm -r frontend backend api