var	yahooFinance = require('yahoo-finance');

module.exports = {
	// get : function(){ return 'hahaha' } /*
	quotes :   function(body){
				return yahooFinance.historical({
					symbol: body.sym,
					from: body.start,
					to: body.end,
					period: 'd'
				}).then(function(data){ 
					// console.log(data);
					return data; 
				});

			}  
};