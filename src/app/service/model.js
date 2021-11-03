const _ = require('lodash')
const mongo = require('../../lib/mongo')

class BaseModel {
  constructor(name) {
    this._name = name
  }

  schema() {
    throw new Error('must override in subclass')
  }

  methods() {
    return null
  }

  preHooks() {
    return null
  }

  postHooks() {
    return null
  }

  defaultSchema() {
    return {
      _id: mongo.getId(),
      createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
      },
      modifiedAt: {
        type: Date,
        default: Date.now,
        required: true
      },
      deleted: {
        type: Boolean,
        default: false,
        required: true
      }
    }
  }

  build() {
    let structure = _.extend(this.defaultSchema(), this.schema())
    return mongo.buildModel(this._name, structure, this.methods(), this.preHooks(), this.postHooks())
  }

}

module.exports = BaseModel