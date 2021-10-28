---
to: app/services/<%= name %>/model.js
---
const { db: Base } = require('../../../app');

class <%= h.inflection.capitalize(name) %>Model extends Base.Model {
  schema() {
    return {
      title: {
        type: String,
        required: true,
      },
    };
  }
}

module.exports = <%= h.inflection.capitalize(name) %>Model;
