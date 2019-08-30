reports.factory('events', [function(){
	function db_navigate_trans_chart(){
		rp_navigateChart('#rp-canvas7', '#rp-canvas8');
	}
	function tp_tab_navigator(){
		$('body').on('click', '.tp-show-daily, .tp-show-weekly, .tp-show-monthly', function(){
			$('.tp-history').hide().fadeIn(800);
		});
	}


	function rp_navigateChart(canvas1, canvas2){
		$('body').on('click', '.rp-details-line', function(){
			$(canvas1).attr("style", "display:block !important; width:100%; height:100%;");
			$(canvas2).hide();
		});
		$('body').on('click', '.rp-details-bar', function(){
			$(canvas2).attr("style", "display:block !important; width:100%; height:100%;");
			$(canvas1).hide();
		});
	}
	function currentBalanceClicked(){
		$('body').on('click', '.rp-infoBox-label1', function(){
			$('.rp-currentWalletBalance-cont').fadeIn();
			$('.rp-totalSales-cont, .rp-totalEarnings-cont, .rp-totalTransactions-cont,' + 
			  '.rp-totalOprBalance-cont, .rp-totalRemLoad-cont, .rp-totalVendoLoad-cont').hide();
		});
		rp_navigateChart('#rp-canvas1', '#rp-canvas2');
	}
	function totalSalesClicked(){
		$('body').on('click', '.rp-infoBox-label2', function(){
			$('.rp-totalSales-cont').fadeIn();
			$('.rp-currentWalletBalance-cont, .rp-totalEarnings-cont, .rp-totalTransactions-cont,' + 
			  '.rp-totalOprBalance-cont, .rp-totalRemLoad-cont,.rp-totalVendoLoad-cont').hide();
		});
		rp_navigateChart('#rp-canvas3', '#rp-canvas4');
	}
	function totalEarningsClicked(){
		$('body').on('click', '.rp-infoBox-label3', function(){
			$('.rp-totalEarnings-cont').fadeIn();
			$('.rp-currentWalletBalance-cont, .rp-totalSales-cont, .rp-totalTransactions-cont,' + 
			  '.rp-totalOprBalance-cont, .rp-totalRemLoad-cont, .rp-totalVendoLoad-cont').hide();
		});
		rp_navigateChart('#rp-canvas5', '#rp-canvas6');
	}
	function totalTransClicked(){
		$('body').on('click', '.rp-infoBox-label4', function(){
			$('.rp-totalTransactions-cont').fadeIn();
			$('.rp-currentWalletBalance-cont, .rp-totalSales-cont, .rp-totalEarnings-cont,' + 
			  '.rp-totalOprBalance-cont, .rp-totalRemLoad-cont, .rp-totalVendoLoad-cont').hide();
		});
		rp_navigateChart('#rp-canvas8', '#rp-canvas7');
	}
	function totalOprBalanceClicked(){
		$('body').on('click', '.rp-infoBox-label5', function(){
			$('.rp-totalOprBalance-cont').fadeIn();
			$('.rp-currentWalletBalance-cont, .rp-totalSales-cont, .rp-totalEarnings-cont,' + 
			  '.rp-totalTransactions-cont, .rp-totalRemLoad-cont, .rp-totalVendoLoad-cont').hide();
		});
		rp_navigateChart();
	}
	function totalRemainingLoadClicked(){
		$('body').on('click', '.rp-infoBox-label6', function(){
			$('.rp-totalRemLoad-cont').hide().fadeIn();
			$('.rp-currentWalletBalance-cont, .rp-totalSales-cont, .rp-totalEarnings-cont,' + 
			  '.rp-totalTransactions-cont, .rp-totalOprBalance-cont, .rp-totalVendoLoad-cont').hide();
		});
		rp_navigateChart();
	}
	function totalVendoLoadClicked(){
		$('body').on('click', '.rp-infoBox-label7', function(){
			$('.rp-totalVendoLoad-cont').hide().fadeIn();
			$('.rp-currentWalletBalance-cont, .rp-totalSales-cont, .rp-totalEarnings-cont,' + 
			  '.rp-totalTransactions-cont, .rp-totalOprBalance-cont, .rp-totalRemLoad-cont').hide();
		});
		rp_navigateChart();
	}

	return{
		db_navigate_trans_chart : db_navigate_trans_chart,
		tp_tab_navigator : tp_tab_navigator,

		currentBalanceClicked : currentBalanceClicked,
		totalSalesClicked : totalSalesClicked,
		totalEarningsClicked : totalEarningsClicked,
		totalTransClicked : totalTransClicked,
		totalOprBalanceClicked : totalOprBalanceClicked,
		totalRemainingLoadClicked : totalRemainingLoadClicked,
		totalVendoLoadClicked : totalVendoLoadClicked
	};
}]);

reports.directive('datePicker1', [function(){
	return {
		template : "<input class='rp-start-date' readonly></input>",
		link : function(){
			$('.rp-start-date').datepicker({
				language : 'en',
				dateFormat : 'yyyy-mm-dd'
			});
		}
	}
}]);
reports.directive('datePicker2', [function(){
	return {
		template : "<input class='rp-end-date' readonly></input>",
		link : function(){
			$('.rp-end-date').datepicker({
				language : 'en',
				dateFormat : 'yyyy-mm-dd'
			});
		}
	}
}]);



$(document).ready(function() {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});

