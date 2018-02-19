const app = require('./app'),
	http = require('http'),
	port = process.env.PORT || '3333',
	server = http.createServer(app);

server.listen(port, () => {
	console.log('server listening on port ' + port);
});