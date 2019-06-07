function finish {
  echo Limpiando mongo
  rm -rf testmongo/diagnostic.data
  rm -rf testmongo/inmem
  rm -rf testmongo/mongod.lock
  rm -f testmongo/storage.bson
}
trap finish EXIT

# https://docs.mongodb.com/manual/administration/install-enterprise/
mongod --storageEngine inMemory --dbpath ./testmongo --port 27018 > /dev/null &

sleep 2

npx ava --watch --timeout 2000 --verbose $1
