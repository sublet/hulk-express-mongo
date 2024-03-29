const { uuid } = require('uuidv4');

class BaseService {
  constructor(model) {
    this._model = model
    this._mongodb = model.build()
  }

  async create(data) {
    if (!data) throw new Error('Data is required')
    return await this._mongodb.create(data)
  }

  async createMany() {
    return await this._mongodb.insertMany(...arguments)
  }

  async readOne(id) {
    if (!id) throw new Error('id is required')

    const query = {
      _id: id
    }

    let results = await this._mongodb.findOne(query).exec()

    if (!results) {
      throw new Error('Not found.')
    }
    return results
  }

  async readMany(query, { isLean = false, limit = 50, select = null, populate = null, sort = null, skip = null } = {}) {
    let cursor = null
    if (isLean) {
      cursor = this._mongodb.find(query).lean()
    } else {
      cursor = this._mongodb.find(query)
    }
    if (limit) cursor.limit(+limit)
    if (populate) {
      populate.forEach(itm => {
        cursor = cursor.populate(itm)
      })
    }
    if (sort) cursor = cursor.sort(sort)
    if (select) cursor = cursor.select(select)
    if (skip) cursor = cursor.skip(+skip)
    let results = await cursor.exec()
    return results.map(obj => (obj && obj.toClient) ? obj.toClient() : obj)
  }

  // https://davidburgos.blog/return-updated-document-mongoose/
  async updateAndReturn(query, updates, options={}) {
    if (!query) throw new Error('Query is invalid')
    if (!updates) throw new Error('Update are invalid')

    // updates.modifiedAt = Date.now()

    options.new = true
    options.upsert = false
    options.runValidators = true

    return this._mongodb.findOneAndUpdate(query, updates, options)
  }

  async createOrUpdate(query, data) {
    if (!query) throw new Error('query is required')
    if (!data) throw new Error('data is required')

    // data.modifiedAt = Date.now()

    const insertData = {
      _id: uuid(),
      createdAt: Date.now(),
      deleted: false
    }

    return await this._mongodb
      .findOneAndUpdate(
        query,
        { $set: data, $setOnInsert: insertData },
        { new: true, upsert: true }
      )
      .exec()
  }

  async findOne(query, { isLean = false, select = null, populate = null } = {}) {
    let cursor = null
    if (isLean) {
      cursor = this._mongodb.findOne(query).lean()
    } else {
      cursor = this._mongodb.findOne(query)
    }

    if (populate) {
      populate.forEach(itm => {
        cursor = cursor.populate(itm)
      })
    }
    if (select) cursor = cursor.select(select)

    let results = await cursor.exec()
    return (results && results.toClient) ? results.toClient() : results
  }
  
  async count() {
    return await this._mongodb.countDocuments(...arguments).exec()
  }
  
  async update() {
    return await this._mongodb.updateOne(...arguments).exec()
  }

  async updateMany() {
    return await this._mongodb.updateMany(...arguments).exec()
  }

  async delete() {
    return await this._mongodb.deleteOne(...arguments).exec()
  }

  async deleteMany() {
    return await this._mongodb.deleteMany(...arguments).exec()
  }

  aggregate(params) {
    return this._mongodb.aggregate(params).exec()
  }

}

module.exports = BaseService