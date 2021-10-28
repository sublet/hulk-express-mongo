const { 
  api: _api, 
  config: _config,
  logger: _logger,
  server: _server,
  service: _service, 
} = require('./app')

class Server {

  constructor(config) {
    this._config = config
    this._buildConfig = _config(this._config.appFolder)
    _server.setWrapAsync(this._config.wrapAsync)
    
    process.env.APP_FOLDER_PATH = this._config.appFolder
  }

  get api() {
    return _api
  }

  get config() {
    return this._buildConfig
  }

  get logger() {
    return _logger
  }

  get router() {
    return _server
  }

  get service() {
    return _service
  }

  setupAndCreate() {
    _server.setup()
    _server.create()
  }

  setup() {
    _server.setup()
  }

  create() {
    _server.create()
  }

  getServer() {
    this._build()
    return _server.app
  }

  start() {
    var port = this._normalizePort(this._config.port || '3000');
    var bind = this._config.bind

    this._build()

    _api.start(port, bind)
      .then(() => console.log(`Node Server Started on port ${port}!`))
  }

  // Private

  _build() {
    _api.build(this._config.appFolder)
    _service.build(this._config.appFolder)
  }

  _normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
  }
}

module.exports = config => new Server(config)