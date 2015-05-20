angular.module('finGrafApp', [])

	// handle data
	.controller('dataCtrl', function($scope, $http, Data){

		// function to be called on input changes on the page
		$scope.change = function(){
			if($scope.input.symbol.length == 4){
				Data.getData($scope.input)
					.success(function(data){
							$scope.quotes = data;
							// emit updated status to directive
							$scope.$emit('quoteUpdate');
					});
			}
		};
		
		// set up initial input data on page load
		$scope.input = Data.init();

		// initial data retrieval
		$scope.change();
	})

	.directive('priceChart', ['ChartService', function(ChartService){
		// actual building of the chart
		
		function link(scope, el, attr){

			// margins, width and height config
	        var margins = {
	        	top: 20,
	        	right: 20,
	        	bottom: 100,
	        	left: 40
	        };
	        var width = 600;
	        var height = 300;

	        // call chart create service
	        ChartService.create(width, height, margins, el);

	        // when quote data is updated, call chart update service
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

				// create svg element
	    		var svg = d3.select(el[0]).append('svg')
		        	.attr('width', width + margins.left + margins.right)
		        	.attr('height', height + margins.top + margins.bottom + 100);
	      		
	      		// create axes elements
	    		svg.append('g')
		        	.attr('class', 'y axis')
		        	.attr('transform', 'translate('+margins.left+','+margins.top+')')
	        	svg.append('g')
		        	.attr('class', 'x axis')
		        	.attr('transform', 'translate('+margins.left+','+(height+margins.top)+')')
			},

			update : function(width, height, data){

				var svg = d3.select('svg');

				// set up scales
		        var xscale = d3.time.scale()
    				.domain(data.map(function(d){
    					return new Date(d.date);
    				}))
    				.range([0,width]);

		        var yscale = d3.scale.linear()
    				.domain([0,d3.max(data, function(d){
    					return d.adjClose;
    				})])
    				.range([height, 0])

    			// set up axes
		    	var xaxis = d3.svg.axis().scale(xscale)
		    		.orient('bottom')
    				.ticks(d3.time.days, 5)
    				.tickFormat(d3.time.format('%a %d'))

		    	var yaxis = d3.svg.axis().scale(yscale)
		    		.orient('left');
		        
		        // transition on update (to axes elements in svg element)
		        var t = svg.transition().duration(600);
		        	t.select('g.y').call(yaxis);
					t.select('g.x').call(xaxis);
			}
		};
	})

	// get data from server
	.factory('Data', function($http){
		return {

			// initial data on page load
			init : function(){ return {
				symbol:	'GOOG',
				start: new Date('2015-05-05T14:00:00.000Z'),
				end: new Date()
			}; },

			// request data from node api
			getData : function(reqInput){
				return $http.post('/api/ticker', reqInput);
			}
		};
	})
;