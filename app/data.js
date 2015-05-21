var	yahooFinance = require('yahoo-finance');

module.exports = {
	getQuotes :   function(symbol, start, end){
				return yahooFinance.historical({
					symbol: symbol.toUpperCase(),
					from: start,
					to: end,
					period: 'd'
				}).then(function(data){
					return data.filter(function(e){
						return data;
					}); 
				});

			}  
};