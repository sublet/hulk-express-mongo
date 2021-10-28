---
to: app/services/<%= name %>/index.js
---
const Model = require('./model');
const Service = require('./service');

module.exports = new Service(new Model('<%= h.inflection.capitalize(name) %>'), '<%= h.changeCase.noCase(name) %>Service');
