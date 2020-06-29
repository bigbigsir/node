const config = {
  dbPath: 'mongodb://127.0.0.1:27017/node',
  dbName: 'node',
  dbOptions: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
  }
}

module.exports = config
