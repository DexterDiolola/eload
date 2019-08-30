reports.factory('charts', [function(){
	var balance, balance2, earnings, earnings2, trans, trans2;
	
	function Balance_Chart(period, data){
		$.getJSON('/api/get-periodic-dates?period=' + period, function(result){
			var _date = [], _balance = [];
			if(period == 'daily' || period == 'weekly'){
				for(var x=0; x<result.length; x++){
					_date.unshift(result[x]['date']);
				}
				for(var y=0; y<data.length; y++){
					_balance.unshift(data[y]['balance']);
				}
			}
			else{
				for(var x=0; x<result.length; x++){
					_date.push(result[x]['date']);
				}
				for(var y=0; y<data.length; y++){
					_balance.push(data[y]['balance']);
				}
			}

			if(balance || balance2){
				balance.destroy();
				balance2.destroy();
			}
			var ctx = document.getElementById('canvas1').getContext('2d');
			var ctx2 = document.getElementById('canvas2').getContext('2d');

			balance = new Chart(ctx, {
				type : 'line',
				data : {
					labels : _date,
					datasets : [{
						label : 'Wallet Balance',
						data : _balance,
						backgroundColor: '#FFE7BD',
						borderColor: '#ED7D31',
						borderWidth: "2",
						lineTension: 0.3,
		        		fill: true,
		        		pointBackgroundColor: '#ED7D31',
		        		pointRadius: 2
					}]
				},
				options : {
					maintainAspectRatio: false,
					title: {
						display: true,
					},
					scales:{
						yAxes:[{
							ticks:{
								beginAtZero: true,
								max: Math.max(..._balance) + 1
							}
						}],
						xAxes:[{
							display: false
						}]
					},
					tooltips : {
						callbacks : {
							label: function(tooltipItem, data) {
			                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

			                    if (label) {
			                        label += ': ';
			                    }
			                    label += Math.round(tooltipItem.yLabel * 100) / 100;
			                    return label;
			                }
						}
					}
				}
			});
			balance2 = new Chart(ctx2, {
				type : 'bar',
				data: {
					labels : _date,
					datasets : [{
						label : 'Wallet Balance',
						data : _balance,
						backgroundColor: '#FFE7BD',
						borderColor: '#ED7D31',
						borderWidth: "2"
					}]
				},
				options : {
					maintainAspectRatio: false,
					title: {
						display: true,
					},
					scales:{
						yAxes:[{
							ticks:{
								beginAtZero: true,
								max: Math.max(..._balance) + 1
							}
						}],
						xAxes:[{
							display: false
						}]
					},
					tooltips : {
						callbacks : {
							label: function(tooltipItem, data) {
			                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

			                    if (label) {
			                        label += ': ';
			                    }
			                    label += Math.round(tooltipItem.yLabel * 100) / 100;
			                    return label;
			                }
						}
					}
				}
			});

		});
	}


	function Earnings_Chart(period, data){
		$.getJSON('/api/get-periodic-dates?period=' + period, function(result){
			var _date = [], _earnings = [];
			if(period == 'daily' || period == 'weekly'){
				for(var x=0; x<result.length; x++){
					_date.unshift(result[x]['date']);
				}
				for(var y=0; y<data.length; y++){
					_earnings.unshift(data[y]['revenue']);
				}
			}
			else{
				for(var x=0; x<result.length; x++){
					_date.push(result[x]['date']);
				}
				for(var y=0; y<data.length; y++){
					_earnings.push(data[y]['revenue']);
				}
			}

			if(earnings || earnings2){
				earnings.destroy();
				earnings2.destroy();
			}
			var ctx = document.getElementById('canvas3').getContext('2d');
			var ctx2 = document.getElementById('canvas4').getContext('2d');

			earnings = new Chart(ctx, {
				type : 'line',
				data : {
					labels : _date,
					datasets : [{
						label : 'Earnings',
						data : _earnings,
						backgroundColor: '#A9D18E',
						borderColor: '#70AD47',
						borderWidth: "2",
						lineTension: 0.3,
		        		fill: true,
		        		pointBackgroundColor: '#5B9BD5',
		        		pointRadius: 2
					}]
				},
				options : {
					maintainAspectRatio: false,
					title: {
						display: true,
					},
					scales:{
						yAxes:[{
							ticks:{
								beginAtZero: true,
								max: Math.max(..._earnings) + 1
							}
						}],
						xAxes:[{
							display: false
						}]
					},
					tooltips : {
						callbacks : {
							label: function(tooltipItem, data) {
			                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

			                    if (label) {
			                        label += ': ';
			                    }
			                    label += Math.round(tooltipItem.yLabel * 100) / 100;
			                    return label;
			                }
						}
					}
				}
			});
			earnings2 = new Chart(ctx2, {
				type : 'bar',
				data: {
					labels : _date,
					datasets : [{
						label : 'Earnings',
						data : _earnings,
						backgroundColor: '#A9D18E',
						borderColor: '#70AD47',
						borderWidth: "2"
					}]
				},
				options : {
					maintainAspectRatio: false,
					title: {
						display: true,
					},
					scales:{
						yAxes:[{
							ticks:{
								beginAtZero: true,
								max: Math.max(..._earnings) + 1
							}
						}],
						xAxes:[{
							display: false
						}]
					},
					tooltips : {
						callbacks : {
							label: function(tooltipItem, data) {
			                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

			                    if (label) {
			                        label += ': ';
			                    }
			                    label += Math.round(tooltipItem.yLabel * 100) / 100;
			                    return label;
			                }
						}
					}
				}
			});
		});
	}


	function Transactions_Chart(period, data){
		var all = data[0], success = data[1], failed = data[2];
		$.getJSON('/api/get-periodic-dates?period=' + period, function(result){
			var _date = [], _all = [], _success = [], _failed = [];
			if(period == 'daily' || period == 'weekly'){
				for(var x=0; x<result.length; x++){
					_date.unshift(result[x]['date']);
				}
				for(var x=0; x<all.length; x++){
					_all.unshift(all[x]['transactions']);
				}
				for(var x=0; x<success.length; x++){
					_success.unshift(success[x]['transactions']);
				}
				for(var x=0; x<failed.length; x++){
					_failed.unshift(failed[x]['transactions']);
				}
			}
			else{
				for(var x=0; x<result.length; x++){
					_date.push(result[x]['date']);
				}
				for(var x=0; x<all.length; x++){
					_all.push(all[x]['transactions']);
				}
				for(var x=0; x<success.length; x++){
					_success.push(success[x]['transactions']);
				}
				for(var x=0; x<failed.length; x++){
					_failed.push(failed[x]['transactions']);
				}
			}

			if(trans || trans2){
				trans.destroy();
				trans2.destroy();
			}
			var ctx = document.getElementById('canvas5').getContext('2d');
			var ctx2 = document.getElementById('canvas6').getContext('2d');

			trans = new Chart(ctx, {
				type : 'line',
				data : {
					labels : _date,
					datasets : [{
						label : 'Success Transactions',
						data : _success,
						backgroundColor: 'rgba(0, 0, 0, 0)',
						borderColor: '#44546A',
						borderWidth: "2",
						lineTension: 0.3,
		        		fill: true,
		        		pointBackgroundColor: '#44546A',
		        		pointRadius: 2
					},
					{
						label : 'Failed Transactions',
						data : _failed,
						backgroundColor: 'rgba(0, 0, 0, 0)',
						borderColor: '#7C7C7C',
						borderWidth: "2",
						lineTension: 0.3,
		        		fill: true,
		        		pointBackgroundColor: '#7C7C7C',
		        		pointRadius: 2
					},
					{
						label : 'All Transactions',
						data : _all,
						backgroundColor: 'rgba(0, 0, 0, 0)',
						borderColor: '#70AD47',
						borderWidth: "2",
						lineTension: 0.3,
		        		fill: true,
		        		pointBackgroundColor: '#70AD47',
		        		pointRadius: 2
					}]
				},
				options : {
					maintainAspectRatio: false,
					title: {
						display: true,
					},
					scales:{
						yAxes:[{
							ticks:{
								beginAtZero: true,
								max: Math.max(..._all) + 1
							}
						}],
						xAxes:[{
							display: false
						}]
					},
				}
			});
			trans2 = new Chart(ctx2, {
				type : 'bar',
				data: {
					labels : _date,
					datasets : [{
						label : 'Success Transactions',
						data : _success,
						backgroundColor: '#8497B0',
						borderColor: '#44546A',
						borderWidth: "2"
					},
					{
						label : 'Failed Transactions',
						data : _failed,
						backgroundColor: '#AFABAB',
						borderColor: '#7C7C7C',
						borderWidth: "2"
					},
					{
						label : 'All Transactions',
						data : _all,
						backgroundColor: '#A9D18E',
						borderColor: '#70AD47',
						borderWidth: "2"
					}]
				},
				options : {
					maintainAspectRatio: false,
					title: {
						display: true,
					},
					scales:{
						yAxes:[{
							ticks:{
								beginAtZero: true,
								max: Math.max(..._all) + 1
							}
						}],
						xAxes:[{
							display: false
						}]
					},
				}
			});

		});
	}

	var rpChartLine, rpChartBar;
	function currentBalanceChart(arr){
		date = [], data = [];
		for(x=0; x<arr.length; x++){
			date.push(arr[x]['dateCreated']);
			data.push(arr[x]['balance']);
		}

		if(rpChartLine || rpChartBar){
			rpChartLine.destroy();
			rpChartBar.destroy();
		}
		var ctx = document.getElementById('rp-canvas1').getContext('2d');
		var ctx2 = document.getElementById('rp-canvas2').getContext('2d');

		rpChartLine = new Chart(ctx, {
			type : 'line',
			data : {
				labels : date,
				datasets : [{
					label : 'Current Wallet Balance',
					data : data,
					backgroundColor: '#FFE7BD',
					borderColor: '#ED7D31',
					borderWidth: "2",
					lineTension: 0.3,
	        		fill: true,
	        		pointBackgroundColor: '#ED7D31',
	        		pointRadius: 2
				}]
			},
			options : {
				maintainAspectRatio: false,
				title: {
					display: true,
				},
				scales:{
					yAxes:[{
						ticks:{
							beginAtZero: true,
							max: Math.max(...data) + 1
						}
					}],
					xAxes:[{
						display: false
					}]
				},
				tooltips : {
					callbacks : {
						label: function(tooltipItem, data) {
		                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

		                    if (label) {
		                        label += ': ';
		                    }
		                    label += Math.round(tooltipItem.yLabel * 100) / 100;
		                    return label;
		                }
					}
				},
				legend: {
					labels: {
						fontColor : 'black'
					}
				}
			}
		});
		rpChartBar = new Chart(ctx2, {
			type : 'bar',
			data: {
				labels : date,
				datasets : [{
					label : 'Current Wallet Balance',
					data : data,
					backgroundColor: '#FFE7BD',
					borderColor: '#ED7D31',
					borderWidth: "2"
				}]
			},
			options : {
				maintainAspectRatio: false,
				title: {
					display: true,
				},
				scales:{
					yAxes:[{
						ticks:{
							beginAtZero: true,
							max: Math.max(...data) + 1
						}
					}],
					xAxes:[{
						display: false
					}]
				},
				tooltips : {
					callbacks : {
						label: function(tooltipItem, data) {
		                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

		                    if (label) {
		                        label += ': ';
		                    }
		                    label += Math.round(tooltipItem.yLabel * 100) / 100;
		                    return label;
		                }
					}
				},
				legend: {
					labels: {
						fontColor : 'black'
					}
				}
			}
		});

	}

	function totalSalesChart(arr){
		date = [], data = [];
		for(x=0; x<arr.length; x++){
			date.push(arr[x]['dateCreated']);
			data.push(arr[x]['sale']);
		}

		if(rpChartLine || rpChartBar){
			rpChartLine.destroy();
			rpChartBar.destroy();
		}
		var ctx = document.getElementById('rp-canvas3').getContext('2d');
		var ctx2 = document.getElementById('rp-canvas4').getContext('2d');

		rpChartLine = new Chart(ctx, {
			type : 'line',
			data : {
				labels : date,
				datasets : [{
					label : 'Total Sales',
					data : data,
					backgroundColor: '#A3CDF8',
					borderColor: '#5B9BD5',
					borderWidth: "2",
					lineTension: 0.3,
	        		fill: true,
	        		pointBackgroundColor: '#5B9BD5',
	        		pointRadius: 2
				}]
			},
			options : {
				maintainAspectRatio: false,
				title: {
					display: true,
				},
				scales:{
					yAxes:[{
						ticks:{
							beginAtZero: true,
							max: Math.max(...data) + 1
						}
					}],
					xAxes:[{
						display: false
					}]
				},
				tooltips : {
					callbacks : {
						label: function(tooltipItem, data) {
		                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

		                    if (label) {
		                        label += ': ';
		                    }
		                    label += Math.round(tooltipItem.yLabel * 100) / 100;
		                    return label;
		                }
					}
				},
				legend: {
					labels: {
						fontColor : 'black'
					}
				}
			}
		});
		rpChartBar = new Chart(ctx2, {
			type : 'bar',
			data: {
				labels : date,
				datasets : [{
					label : 'Total Sales',
					data : data,
					backgroundColor: '#A3CDF8',
					borderColor: '#5B9BD5',
					borderWidth: "2"
				}]
			},
			options : {
				maintainAspectRatio: false,
				title: {
					display: true,
				},
				scales:{
					yAxes:[{
						ticks:{
							beginAtZero: true,
							max: Math.max(...data) + 1
						}
					}],
					xAxes:[{
						display: false
					}]
				},
				tooltips : {
					callbacks : {
						label: function(tooltipItem, data) {
		                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

		                    if (label) {
		                        label += ': ';
		                    }
		                    label += Math.round(tooltipItem.yLabel * 100) / 100;
		                    return label;
		                }
					}
				},
				legend: {
					labels: {
						fontColor : 'black'
					}
				}
			}
		});

	}

	function totalEarningsChart(arr){
		date = [], data = [];
		for(x=0; x<arr.length; x++){
			date.push(arr[x]['dateCreated']);
			data.push(arr[x]['earnings']);
		}

		if(rpChartLine || rpChartBar){
			rpChartLine.destroy();
			rpChartBar.destroy();
		}
		var ctx = document.getElementById('rp-canvas5').getContext('2d');
		var ctx2 = document.getElementById('rp-canvas6').getContext('2d');

		rpChartLine = new Chart(ctx, {
			type : 'line',
			data : {
				labels : date,
				datasets : [{
					label : 'Total Earnings',
					data : data,
					backgroundColor: '#A9D18E',
					borderColor: '#70AD47',
					borderWidth: "2",
					lineTension: 0.3,
	        		fill: true,
	        		pointBackgroundColor: '#70AD47',
	        		pointRadius: 2
				}]
			},
			options : {
				maintainAspectRatio: false,
				title: {
					display: true,
				},
				scales:{
					yAxes:[{
						ticks:{
							beginAtZero: true,
							max: Math.max(...data) + 1
						}
					}],
					xAxes:[{
						display: false
					}]
				},
				tooltips : {
					callbacks : {
						label: function(tooltipItem, data) {
		                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

		                    if (label) {
		                        label += ': ';
		                    }
		                    label += Math.round(tooltipItem.yLabel * 100) / 100;
		                    return label;
		                }
					}
				},
				legend: {
					labels: {
						fontColor : 'black'
					}
				}
			}
		});
		rpChartBar = new Chart(ctx2, {
			type : 'bar',
			data: {
				labels : date,
				datasets : [{
					label : 'Total Sales',
					data : data,
					backgroundColor: '#A9D18E',
					borderColor: '#70AD47',
					borderWidth: "2"
				}]
			},
			options : {
				maintainAspectRatio: false,
				title: {
					display: true,
				},
				scales:{
					yAxes:[{
						ticks:{
							beginAtZero: true,
							max: Math.max(...data) + 1
						}
					}],
					xAxes:[{
						display: false
					}]
				},
				tooltips : {
					callbacks : {
						label: function(tooltipItem, data) {
		                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

		                    if (label) {
		                        label += ': ';
		                    }
		                    label += Math.round(tooltipItem.yLabel * 100) / 100;
		                    return label;
		                }
					}
				},
				legend: {
					labels: {
						fontColor : 'black'
					}
				}
			}
		});

	}

	function totalTransChart(arr1, arr2, arr3){
		date = [], comb = [], all = [], success = [], failed = [];

		for(x in arr1){
			date1 = arr1[x]['dateCreated'].split(' ');
			date1 = date1[0];
			
			for(a in arr2){
				date2 = arr2[a]['dateCreated'].split(' ');
				date2 = date2[0]
				if(date2 == date1){
					comb.push({'dateCreated' : arr1[x]['dateCreated'],
							'allTransactions' : arr1[x]['transactions'],
							'successTransactions' : arr2[a]['transactions'],
							'failedTransactions' : 0})
				}
			}
			
			for(b in arr3){
				date3 = arr3[b]['dateCreated'].split(' ');
				date3 = date3[0]
				if(date3 == date1){
					try{
						comb[x]['failedTransactions'] = arr3[b]['transactions']
					}
					catch{
						comb.push({'dateCreated' : arr1[x]['dateCreated'],
							'allTransactions' : arr1[x]['transactions'],
							'successTransactions' : 0,
							'failedTransactions' : arr3[b]['transactions']})
					}
					
				}
			}	
		}

		for(x in comb){
			date.push(comb[x]['dateCreated']);
			all.push(comb[x]['allTransactions']);
			success.push(comb[x]['successTransactions']);
			failed.push(comb[x]['failedTransactions']);
		}
		
		if(rpChartLine || rpChartBar){
			rpChartLine.destroy();
			rpChartBar.destroy();
		}
		var ctx = document.getElementById('rp-canvas7').getContext('2d');
		var ctx2 = document.getElementById('rp-canvas8').getContext('2d');

		rpChartLine = new Chart(ctx, {
			type : 'line',
			data : {
				labels : date,
				datasets : [{
					label : 'Success Transactions',
					data : success,
					backgroundColor: 'rgba(0, 0, 0, 0)',
					borderColor: '#70AD47',
					borderWidth: "2",
					lineTension: 0.3,
	        		fill: true,
	        		pointBackgroundColor: '#70AD47',
	        		pointRadius: 2
				},
				{
					label : 'Failed Transactions',
					data : failed,
					backgroundColor: 'rgba(0, 0, 0, 0)',
					borderColor: '#7C7C7C',
					borderWidth: "2",
					lineTension: 0.3,
	        		fill: true,
	        		pointBackgroundColor: '#7C7C7C',
	        		pointRadius: 2
				},
				{
					label : 'All Transactions',
					data : all,
					backgroundColor: 'rgba(0, 0, 0, 0)',
					borderColor: '#44546A',
					borderWidth: "2",
					lineTension: 0.3,
	        		fill: true,
	        		pointBackgroundColor: '#44546A',
	        		pointRadius: 2
				}]
			},
			options : {
				maintainAspectRatio: false,
				title: {
					display: true,
				},
				scales:{
					yAxes:[{
						ticks:{
							beginAtZero: true,
							max: Math.max(...all) + 1
						}
					}],
					xAxes:[{
						display: false
					}]
				},
				tooltips : {
					callbacks : {
						label: function(tooltipItem, data) {
		                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

		                    if (label) {
		                        label += ': ';
		                    }
		                    label += Math.round(tooltipItem.yLabel * 100) / 100;
		                    return label;
		                }
					}
				},
				legend: {
					labels: {
						fontColor : 'black'
					}
				}
			}
		});
		rpChartBar = new Chart(ctx2, {
			type : 'bar',
			data: {
				labels : date,
				datasets : [{
					label : 'Success Transactions',
					data : success,
					backgroundColor: '#A9D18E',
					borderColor: '#70AD47',
					borderWidth: "2"
				},
				{
					label : 'Failed Transactions',
					data : failed,
					backgroundColor: '#AFABAB',
					borderColor: '#7C7C7C',
					borderWidth: "2"
				},
				{
					label : 'All Transactions',
					data : all,
					backgroundColor: '#8497B0',
					borderColor: '#44546A',
					borderWidth: "2"
				}]
			},
			options : {
				maintainAspectRatio: false,
				title: {
					display: true,
				},
				scales:{
					yAxes:[{
						ticks:{
							beginAtZero: true,
							max: Math.max(...all) + 1
						}
					}],
					xAxes:[{
						display: false
					}]
				},
				tooltips : {
					callbacks : {
						label: function(tooltipItem, data) {
		                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

		                    if (label) {
		                        label += ': ';
		                    }
		                    label += Math.round(tooltipItem.yLabel * 100) / 100;
		                    return label;
		                }
					}
				},
				legend: {
					labels: {
						fontColor : 'black'
					}
				}
			}
		});


	}

	return{
		Balance_Chart : Balance_Chart,
		Earnings_Chart : Earnings_Chart,
		Transactions_Chart : Transactions_Chart,
		currentBalanceChart : currentBalanceChart,
		totalSalesChart : totalSalesChart,
		totalEarningsChart : totalEarningsChart,
		totalTransChart : totalTransChart
	}

}]);