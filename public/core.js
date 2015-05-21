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
	        	bottom: 30,
	        	left: 100
	        };
	        var width = 600;
	        var height = 300;

	        // call chart create service
	        ChartService.create(width, height, margins, el);

	        // when quote data is updated, call chart update service
	        scope.$on('quoteUpdate', function() {
		        	ChartService.update(width, height, margins, scope.quotes);
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
		        	.attr('height', height + margins.top + margins.bottom);
	      		
	      		// create axes elements
	    		svg.append('g')
		        	.attr('class', 'x axis')
		        	.attr('transform', 'translate(0,'+(height+margins.top)+')')

				svg.append('g')
		        	.attr('class', 'y axis')
		        	.attr('transform', 'translate('+margins.left+',0)')

		        // create line element
		        svg.append('path')
		        	.attr('class', 'priceLine')
			},

			update : function(width, height, margins, data){
				var barHeight = height * 0.35;
				var svg = d3.select('svg');

				// set up scales
		        var xScale = d3.time.scale()
    				.domain([
    					new Date(data[0].date),
    					new Date(data[data.length-1].date)
    					])
    				.range([margins.left,width+margins.left]);

		        var yScalePrice = d3.scale.linear()
    				.domain([
    					d3.min(data, function(d){
	    					return d.adjClose;
	    				}),
    					d3.max(data, function(d){
    						return d.adjClose;
	    				})
    				])
    				.range([height+margins.top, margins.top])
    				.nice();

    			var yScaleVolume = d3.scale.linear()
    				.domain([
    					0,
    					d3.max(data, function(d){
    						return d.volume;
	    				})
    				])
    				.range([(margins.top+height), (margins.top+height-barHeight)])

    			// set up price axes
		    	var xAxis = d3.svg.axis().scale(xScale)
		    		.orient('bottom')
    				// .ticks(d3.time.days, 5)
    				.ticks(6)
    				.tickFormat(d3.time.format('%d-%m-%y'));

		    	var yAxis = d3.svg.axis().scale(yScalePrice)
		    		.orient('left');

		        // set up price chart line
		        var priceLine = d3.svg.line()
		        	.x(function(d){
		        		return xScale(new Date(d.date));
		        	})
		        	.y(function(d){
		        		return yScalePrice(d.adjClose);
		        	})
		        	.interpolate('monotone');

		        // set up and update volume bars
		        var bar = svg.selectAll('.bar')
		        	.data(data, function(d){ return d.date; }); //.transition().duration(200);

		        bar.enter().append('rect')
		        	.attr('class','bar');

		        bar.exit().remove();

		        bar.transition().duration(200)
		        	.attr('x',function(d){ return xScale(new Date(d.date));})
		        	.attr('y',function(d){ return yScaleVolume(d.volume);})
		        	.attr('height',function(d){ return (height+margins.top)- yScaleVolume(d.volume);})
		        	.attr('width',function(d){ return width*0.5/data.length; });

		        // transition on update (to axes elements in svg element)
		        var t = svg.transition().duration(200);
		        	t.select('g.y').call(yAxis);
					t.select('g.x').call(xAxis);
					t.select('path.priceLine').attr('d', priceLine(data));
			}
		};
	})

	// get data from server
	.factory('Data', function($http){
		return {

			// initial data on page load
			init : function(){ return {
				symbol:	'AAPL',
				start: new Date('2014-05-05T14:00:00.000Z'),
				end: new Date()
			}; },

			// request data from node api
			getData : function(reqInput){
				return $http.post('/api/ticker', reqInput);
			}
		};
	})
;