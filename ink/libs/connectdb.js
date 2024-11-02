const { default: connectMongoDb } = require("./mongodb");

async () => {
    await connectMongoDb()
}