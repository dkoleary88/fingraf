var data = require('./data');

module.exports = function(app){

	app.get('*', function(req, res){
		res.sendFile(__dirname+'/public/index.html');
	});

	app.post('/api/ticker', function(req, res){
		// var this.quotes;
		data.getQuotes(req.body.symbol, req.body.start, req.body.end)
			.done(function(result){
					res.json(result);
				});
	});
};