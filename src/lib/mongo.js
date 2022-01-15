const mongoose = require('mongoose')
const { uuid } = require('uuidv4');
const Promise = require('bluebird')
const logger = require('../app/logger')
const configLib = require('../app/config')
const { MongoClient } = require('mongodb')
const autopopulate = require('mongoose-autopopulate')
const encrypt = require('mongoose-encryption')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const { mongo } = configLib(process.env.APP_FOLDER_PATH)

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

/*
 * Notes:
 * https://hackernoon.com/building-a-serverless-rest-api-with-node-js-and-mongodb-2e0ed0638f47
 * https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id
*/

class Mongo {
  constructor() {
    this.isConnected = false

    mongoose.Promise = Promise

    if (mongo && mongo.uri) this.connectToDatabase()
  }

  async connectToDatabase() {
    if (!this.isConnected) {
      if (process.env.NODE_ENV === 'local') logger.info('## using new database connection')
      if (process.env.NODE_ENV === 'local' && mongo.ssl) {
        logger.warn('####################################')
        logger.warn('####################################')
        logger.warn('##### WARNING: SSL is currently on!')
        logger.warn('####################################')
        logger.warn('####################################')
      }
      
      const db = await mongoose.connect(mongo.uri, this._getOptions())
      this.isConnected = db.connections[0].readyState
    } else {
      if (process.env.NODE_ENV === 'local') logger.info('=> using existing database connection')
      return Promise.resolve()
    }
  }

  _getOptions() {
    return {
      dbName: mongo.db,
      ssl: mongo.ssl,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }

  _getEncryptionOptions(fields) {
    let params = {
      encryptionKey: process.env.MONGO_ENCRYPTION_KEY,
      signingKey: process.env.MONGO_SIGNATURE_KEY,
      encryptedFields: fields
    }
    if (fields.length) params.encryptedFields = fields
    return params
  }

  buildModel(name, structure, methods = null, preHooks = null, postHooks = null) {
    let schema = new mongoose.Schema(structure, { autoIndex: process.env.DISABLE_AUTO_INDEX })

    schema.plugin(autopopulate)

    let autoIncremenentCount = 0
    let autoIncerementField = null
    Object.keys(structure).forEach(key => {
      if (structure[key].autoIncrement) {
        autoIncerementField = key
        autoIncremenentCount++
      }
    })
    if (autoIncerementField) {
      if (autoIncremenentCount !== 1) throw new Error('You can only have one Auto Increment Field.')
      if (!structure[autoIncerementField].startSeqence) throw new Error('You must include a start sequence.')
      schema.plugin(AutoIncrement, { inc_field: autoIncerementField, start_seq: structure[autoIncerementField].startSeqence })
    }

    schema.method('toClient', function() {
      let obj = this.toObject()
      obj.id = obj._id
      delete obj._id
      delete obj.deleted
      delete obj.__v
      return obj
    })

    schema.set('toObject', { getters: true })
    schema.set('toJSON', { getters: true })

    // Look for Encrypted fields...
    const encryptedFields = Object.keys(structure).filter(key => !!structure[key].encrypted).filter(key => key)
    if (encryptedFields && encryptedFields.length && process.env.MONGO_ENCRYPTION_KEY && process.env.MONGO_SIGNATURE_KEY) {
      schema.plugin(encrypt, this._getEncryptionOptions(encryptedFields));
    }

    if (methods) schema.methods = { ...schema.methods, ...methods }

    if (preHooks) {
      preHooks.forEach(itm => {
        schema.pre(itm.type, itm.method);
      })
    }

    if (postHooks) {
      postHooks.forEach(itm => {
        schema.post(itm.type, itm.method);
      })
    }

    return mongoose.model(name, schema)
  }

  getId() {
    return {
      type: String,
      default: uuid,
      required: true
    }
  }

  async quickConnect() {
    let client = new MongoClient(mongo.uri, { promiseLibrary: Promise, useNewUrlParser: true, useUnifiedTopology: true })
    await client.connect()
    return { client, db: client.db(mongo.db) }
  }
}

module.exports = new Mongo()