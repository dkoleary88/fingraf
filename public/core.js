angular.module('finGrafApp', [])

	// handle data
	.controller('dataCtrl', function($scope, $http, Data){
		$scope.input = Data.init();
		$scope.change = function(){
			if($scope.input.symbol.length == 4){
				Data.getData($scope.input)
					.success(function(data){
							$scope.quotes = data;
							$scope.$emit('quoteUpdate');
					});
			}
		};
		
		$scope.change();
	})

	.directive('priceChart', ['ChartService', function(ChartService){
		// actual building of the chart
		
		function link(scope, el, attr){

	        var margins = {
	        	top: 20,
	        	right: 20,
	        	bottom: 100,
	        	left: 40
	        };
	        var width = 600;
	        var height = 300;

	        ChartService.create(width, height, margins, el);

	        scope.$on('quoteUpdate', function() {
		        	ChartService.update(width, height, scope.quotes);
	        }, true);

	    }
		
		return {
			link: link,
			restrict: 'A'
		};
	}])
	
	// create and update D3 chart
	.factory('ChartService', function(){
		return {
			create : function(width, height, margins, el){

	    		var svg = d3.select(el[0]).append('svg')
		        	.attr('width', width + margins.left + margins.right)
		        	.attr('height', height + margins.top + margins.bottom + 100);
	      
	    		svg.append('g')
		        	.attr('class', 'y axis')
		        	.attr('transform', 'translate('+margins.left+','+margins.top+')')
	        	svg.append('g')
		        	.attr('class', 'x axis')
		        	.attr('transform', 'translate('+margins.left+','+(height+margins.top)+')')
			},

			update : function(width, height, data){

				var svg = d3.select('svg');

		        var xscale = d3.time.scale()
    				.domain(data.map(function(d){
    					return d.date;
    				}))
    				.range([0,width]);

		        var yscale = d3.scale.linear()
    				.domain([0,d3.max(data, function(d){
    					return d.adjClose;
    				})])
    				.range([height, 0])

		    	var xaxis = d3.svg.axis().scale(xscale)
		    		.orient('bottom')
    				.ticks(d3.time.days, 5)
    				.tickFormat(d3.time.format('%a %d'))

		    	var yaxis = d3.svg.axis().scale(yscale)
		    		.orient('left');
		        
		        var t = svg.transition().duration(600);
		        	t.select('g.y').call(yaxis);
					t.select('g.x').call(xaxis);
			}
		};
	})

	// get data from server
	.factory('Data', function($http){
		return {
			init : function(){ return {
				symbol:	'GOOG',
				start: new Date('2015-05-05T14:00:00.000Z'),
				end: new Date()
			}; },

			getData : function(reqInput){
				return $http.post('/api/ticker', reqInput);
			}
		};
	})
;