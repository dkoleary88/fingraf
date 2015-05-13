var data = require('./data');

module.exports = function(app){

	app.get('*', function(req, res){
		res.sendfile('./public/index.html');
	});

	app.post('/api/ticker', function(req, res){
		// var this.quotes;
		data.quotes(req.body).done(function(result){
			res.json(result);
			});
	});
};