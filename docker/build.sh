cd ../frontend
npm install
npm run build -- --outputPath=../docker/frontend
cd ../backend
npm install
npm run build -- --outputPath=../docker/backend
cd ../api
npm install
npx @zeit/ncc build src/index.ts -o ../docker/api
cd ../docker
PACKAGE_VERSION=$(cat ../frontend/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
docker build -t hrueger/agbooks:v$PACKAGE_VERSION .
rm -r frontend backend api