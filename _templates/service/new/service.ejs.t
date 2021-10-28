---
to: app/services/<%= name %>/service.js
---
const { db: Base } = require('../../../app');

class <%= h.inflection.capitalize(name) %>Service extends Base.Service {

  map(data) {
    delete data._id
    delete data.createdAt
    delete data.modifiedAt
    return data
  }

}

module.exports = <%= h.inflection.capitalize(name) %>Service