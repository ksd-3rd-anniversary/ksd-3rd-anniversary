require 'webrick'

srv = WEBrick::HTTPServer.new({
  DocumentRoot:   './',
  BindAddress:    '0.0.0.0',
  Port:           8080,
})

srv.start
