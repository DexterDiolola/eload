reports.factory('func', ['$http', '$route', function($http, $route){
	function adminMainDetails(cond, startDate, endDate){
		return $http({
			method : 'GET',
			url : '/api/adminMainDetails?cond=' + cond + '&startDate=' + startDate + '&endDate=' + endDate
		})
	}
	function adminMainDetailsEach(cond, startDate, endDate, mac){
		return $http({
			method : 'GET',
			url : '/api/adminMainDetailsEach?cond=' + cond + '&startDate=' + startDate + '&endDate=' + 
				endDate + '&mac=' + mac
		})
	}
	function oprMainDetails(cond, startDate, endDate, opr){
		return $http({
			method : 'GET',
			url : '/api/oprMainDetails?cond=' + cond + '&startDate=' + startDate + '&endDate=' +
				endDate + '&opr=' + opr
		})
	}
	function oprMainDetailsEach(cond, startDate, endDate, opr, mac){
		return $http({
			method : 'GET',
			url : '/api/oprMainDetailsEach?cond=' + cond + '&startDate=' + startDate + '&endDate=' +
				endDate + '&opr=' + opr + '&mac=' + mac
		})
	}
	function getCurrentDate(){
		today = new Date();
		dd = String(today.getDate()).padStart(2, '0');
		mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		yyyy = today.getFullYear();

		return yyyy + '-' + mm + '-' + dd;
	}
	function getLastDate(rangeDay){
		day = rangeDay;
		date = new Date();
		var last = new Date(date.getTime() - (day * 24 * 60 * 60 * 1000));
		var dd = String(last.getDate()).padStart(2, '0');
		var mm = String(last.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = last.getFullYear();
	
		return yyyy + '-' + mm + '-' + dd;
	}

	function Get_Balance(userType, user){
		return $http({
			method : 'GET',
			url : '/api/get-balance?userType=' + userType + '&user=' + user 
		})
	}
	function Get_Balance_Each(userType, user){
		return $http({
			method : 'GET',
			url : '/api/get-balance-each?userType=' + userType + '&user=' + user
		})
	}
	function Count_Mac_With_Balance(userType, user){
		return $http({
			method : 'GET',
			url : '/api/count-mac-with-balance?userType=' + userType + '&user=' + user
		})
	}
	function Get_Remaining_Load(userType, user){
		return $http({
			method : 'GET',
			url : '/api/get-remaining-load?userType=' + userType + '&user=' + user
		})
	}
	function Get_Sales(userType, user, occ){
		return $http({
			method : 'GET',
			url : '/api/get-sales?userType=' + userType + '&user=' + user + '&occ=' + occ
		})
	}
	function Get_Earnings(userType, user, occ){
		return $http({
			method : 'GET',
			url : '/api/get-earnings?userType=' + userType + '&user=' + user + '&occ=' + occ
		})
	}

	function Get_Transactions(userType, user, status, occ){
		return $http({
			method : 'GET',
			url : '/api/get-transactions?userType=' + userType + '&user=' + user +
				  '&status=' + status + '&occ=' + occ
		})
	}
	function Periodic_Dates(period){
		return $http({
			method : 'GET',
			url : '/api/get-periodic-dates?period=' + period
		})
	}
	function Get_Periodic_Balance(userType, user, period){
		return $http({
			method : 'GET',
			url : '/api/get-periodic-balance?userType=' + userType + '&user=' + user +
				  '&period=' + period
		})
	}
	function Search_Periodic_Balance(userType, user, period, mac){
		return $http({
			method : 'GET',
			url : '/api/search-periodic-balance?userType=' + userType + '&user=' + user +
				  '&period=' + period + '&mac=' + mac
		})
	}
	function Get_Periodic_Deduction(userType, user, period){
		return $http({
			method : 'GET',
			url : '/api/get-periodic-deduction?userType=' + userType + '&user=' + user +
				  '&period=' + period
		})
	}
	function Search_Periodic_Deduction(userType, user, period, mac){
		return $http({
			method : 'GET',
			url : '/api/search-periodic-deduction?userType=' + userType + '&user=' + user +
				  '&period=' + period + '&mac=' + mac
		})
	}
	function Get_Periodic_Transactions_All(userType, user, period){
		return $http({
			method : 'GET',
			url : '/api/get-periodic-transactions-all?userType=' + userType + '&user=' + user +
				  '&period=' + period 
		})
	}
	function Search_Periodic_Transactions_All(userType, user, period, mac, opr, mob){
		return $http({
			method : 'GET',
			url : '/api/search-periodic-transactions-all?userType=' + userType + '&user=' + user +
				  '&period=' + period + '&mac=' + mac + '&opr=' + opr + '&mob=' + mob
		})
	}
	function Get_Periodic_Transactions_Success(userType, user, period){
		return $http({
			method : 'GET',
			url : '/api/get-periodic-transactions-success?userType=' + userType + '&user=' + user +
				  '&period=' + period 
		})
	}
	function Search_Periodic_Transactions_Success(userType, user, period, mac, opr, mob){
		return $http({
			method : 'GET',
			url : '/api/search-periodic-transactions-success?userType=' + userType + '&user=' + user +
				  '&period=' + period + '&mac=' + mac + '&opr=' + opr + '&mob=' + mob
		})
	}
	function Get_Periodic_Transactions_Failed(userType, user, period){
		return $http({
			method : 'GET',
			url : '/api/get-periodic-transactions-failed?userType=' + userType + '&user=' + user +
				  '&period=' + period 
		})
	}
	function Search_Periodic_Transactions_Failed(userType, user, period, mac, opr, mob){
		return $http({
			method : 'GET',
			url : '/api/search-periodic-transactions-failed?userType=' + userType + '&user=' + user +
				  '&period=' + period + '&mac=' + mac + '&opr=' + opr + '&mob=' + mob
		})
	}
	function Get_Transaction_Logs(userType, user, occ){
		return $http({
			method : 'GET',
			url : '/api/get-transaction-logs?userType=' + userType + '&user=' + user + '&occ=' + occ
		})
	}
	function Search_Transaction_Logs(userType, user, occ, mac, opr, mob){
		return $http({
			method : 'GET',
			url : '/api/search-transaction-logs?userType=' + userType + '&user=' + user + '&occ=' + occ +
				  '&mac=' + mac + '&opr=' + opr + '&mob=' + mob
		})
	}
	function Get_Macs_List(userType, user){
		return $http({
			method : 'GET',
			url : '/api/get-macs-list?userType=' + userType + '&user=' + user
		})
	}
	function Get_Operators_List(){
		return $http({
			method : 'GET',
			url : '/api/get-operators-list'
		})
	}
	function Get_Partners_List(){
		return $http({
			method : 'GET',
			url : '/api/get-partners-list'
		})
	}
	function Add_Topup(mac, value){
		return $http({
			method : 'POST',
			url : '/api/add-topup?mac=' + mac + '&topup=' + value
		})
	}
	function Get_Products(provider, operator){
		return $http({
			method : 'GET',
			url : '/api/get-products?provider=' + provider + '&operator=' + operator
		})
	}
	function Set_Price_Admin(pcode, price){
		return $http({
			method : 'POST',
			url : '/api/set-price-admin?pcode=' + pcode + '&price=' + price
		})
	}
	function Set_Price_Operator(pcode, price, operator){
		return $http({
			method : 'GET',
			url : '/api/set-price-operator?pcode=' + pcode + '&price=' + price + '&operator=' + operator
		})
	}
	function Get_Operator_Balance(operator){
		return $http({
			method : 'GET',
			url : '/api/get-operator-balance?operator=' + operator
		})
	}
	function Topup_Operator(operator, value){
		return $http({
			method : 'POST',
			url : '/api/topup-operator?operator=' + operator + '&topup=' + value
		})
	}
	function Topup_Operator_Mac(operator, mac, value){
		return $http({
			method : 'POST',
			url : '/api/topup-operator-mac?operator=' + operator + '&mac=' + mac + '&topup=' + value
		})
	}
	function Topup_History(operator, occ, mac){
		return $http({
			method : 'GET',
			url : '/api/topup-history?operator=' + operator + '&occ=' + occ + '&mac=' + mac
		})
	}
	function Get_Periodic_Sales(userType, user, period, mac){
		return $http({
			method : 'GET',
			url : '/api/get-periodic-sales?userType=' + userType + '&user=' + user + '&period=' + period + '&mac=' + mac
		})
	}
	function Set_Status(opr, mac, status){
		return $http({
			method : 'GET',
			url : '/api/set-status?opr=' + opr + '&mac=' + mac + '&status=' + status
		})
	}
	function Reset_Password(user){
		return $http({
			method : 'GET',
			url : '/api/reset-password?user=' + user
		})
	}
	function Change_Password(user, pword, new_pass){
		return $http({
			method : 'GET',
			url : '/api/change-password?user=' + user + '&pword=' + pword + '&new_pass=' + new_pass
		})
	}
	function ChangeEmail(user, email){
		return $http({
			method : 'GET',
			url: '/api/change_email?user=' + user + '&email=' + email
		})
	}
	function Init_Service_Charge(cond, opr, scharge){
		return $http({
			method : 'GET',
			url : '/api/init-service-charge?cond=' + cond + '&opr=' + opr + '&scharge=' + scharge
		})
	}
	function Set_Promo_Status(pcode, status){
		return $http({
			method : 'GET',
			url : '/api/set-promo-status?pcode=' + pcode + '&status=' + status
		})
	}

	return{
		adminMainDetails : adminMainDetails,
		adminMainDetailsEach : adminMainDetailsEach,
		oprMainDetails : oprMainDetails,
		oprMainDetailsEach : oprMainDetailsEach,
		getCurrentDate : getCurrentDate,
		getLastDate : getLastDate,


		Get_Balance : Get_Balance,
		Get_Balance_Each : Get_Balance_Each,
		Count_Mac_With_Balance : Count_Mac_With_Balance,
		Get_Remaining_Load : Get_Remaining_Load,
		Get_Sales : Get_Sales,
		Get_Earnings : Get_Earnings,
		Get_Transactions : Get_Transactions,
		Periodic_Dates : Periodic_Dates,
		Get_Periodic_Balance : Get_Periodic_Balance,
		Search_Periodic_Balance : Search_Periodic_Balance,
		Get_Periodic_Deduction : Get_Periodic_Deduction,
		Search_Periodic_Deduction : Search_Periodic_Deduction,
		Get_Periodic_Transactions_All : Get_Periodic_Transactions_All,
		Search_Periodic_Transactions_All : Search_Periodic_Transactions_All,
		Get_Periodic_Transactions_Success : Get_Periodic_Transactions_Success,
		Search_Periodic_Transactions_Success : Search_Periodic_Transactions_Success,
		Get_Periodic_Transactions_Failed : Get_Periodic_Transactions_Failed,
		Search_Periodic_Transactions_Failed : Search_Periodic_Transactions_Failed,
		Get_Transaction_Logs : Get_Transaction_Logs,
		Search_Transaction_Logs : Search_Transaction_Logs,
		Get_Macs_List : Get_Macs_List,
		Get_Operators_List : Get_Operators_List,
		Get_Partners_List : Get_Partners_List,
		Add_Topup : Add_Topup,
		Get_Products : Get_Products,
		Set_Price_Admin : Set_Price_Admin,
		Set_Price_Operator : Set_Price_Operator,
		Get_Operator_Balance : Get_Operator_Balance,
		Topup_Operator : Topup_Operator,
		Topup_Operator_Mac : Topup_Operator_Mac,
		Topup_History : Topup_History,
		Get_Periodic_Sales : Get_Periodic_Sales,
		Set_Status : Set_Status,
		Reset_Password : Reset_Password,
		Change_Password : Change_Password,
		ChangeEmail : ChangeEmail,
		Init_Service_Charge : Init_Service_Charge,
		Set_Promo_Status : Set_Promo_Status
	}
}]);

reports.controller('AdminHomeController', ['$scope', '$http', '$filter', 'events', 
'func', 'charts', function($scope, $http, $filter, events, func, charts){
	$scope.userType = 'admin';
	$scope.currentDate = func.getCurrentDate();
	$scope.prevDate = func.getLastDate(10);
	$('.rp-start-date').val($scope.prevDate);
	$('.rp-end-date').val($scope.currentDate);
	$('.db-info-box-6').hide();

	$scope.init = function(startDate, endDate){
		$('.main').hide().fadeIn();
		func.adminMainDetails('currentBalance', startDate, endDate).then(function(response){
			$scope.currentBalance = response.data[0]['bal'];
		});
		func.adminMainDetails('totalDistributedLoad', startDate, endDate).then(function(response){
			$scope.totalDistributedLoad = response.data[0]['distributedLoad'];
		});
		func.adminMainDetails('totalSales', startDate, endDate).then(function(response){
			$scope.totalSales = response.data[0]['totalSales'];
		});
		func.adminMainDetails('totalCostSales', startDate, endDate).then(function(response){
			$scope.totalCostSales = response.data[0]['totalCostSales'];
		});
		func.Get_Periodic_Transactions_All('admin', 'admin', 'daily').then(function(a){
			var all = a.data;
			func.Get_Periodic_Transactions_Success('admin', 'admin', 'daily').then(function(b){
				var success = b.data;
				func.Get_Periodic_Transactions_Failed('admin', 'admin', 'daily').then(function(c){
					var failed = c.data;
					var list = [all, success, failed];
					charts.Transactions_Chart('daily', list);
				});
			});
		});

		$scope.datePicker = function(){
			start = $('.rp-start-date').val();
			end = $('.rp-end-date').val();
			if(start == '' || end == ''){
				alert('Complete Fields'); 
				return 0;
			}
			$scope.init(start, end);
		}
	}
	// func.Get_Balance('admin', 'admin').then(function(response){
	// 	$scope.balance = response.data[0]['balance'];
	// });
	// func.Count_Mac_With_Balance('admin', 'admin').then(function(response){
	// 	$scope.withBalance = response.data;
	// });
	// func.Get_Remaining_Load('admin', 'admin').then(function(response){
	// 	$scope.remainingLoad = response.data;
	// });
	// $scope.main_info = function(period){
	// 	func.Get_Sales('admin', 'admin', period).then(function(response){
	// 		$scope.sales = response.data[0]['sales'];
	// 	});
	// 	func.Get_Earnings('admin', 'admin', period).then(function(response){
	// 		$scope.earnings = response.data[0]['earnings'];
	// 	});
	// 	func.Get_Transactions('admin', 'admin', 'all', period).then(function(response){
	// 		$scope.all_transactions = response.data[0]['transactions'];

	// 	});
	// 	func.Get_Transactions('admin', 'admin', 'success', period).then(function(response){
	// 		$scope.success_transactions = response.data[0]['transactions'];
	// 	});
	// }
	// $scope.balance_chart = function(period){
	// 	func.Get_Periodic_Balance('admin', 'admin', period).then(function(response){
	// 		charts.Balance_Chart(period, response.data);
	// 	});
	// }
	// $scope.earnings_chart = function(period){
	// 	func.Get_Periodic_Sales('admin', 'admin', period, '').then(function(response){
	// 		charts.Earnings_Chart(period, response.data);
	// 	});
	// }
	// $scope.transactions_chart = function(period){
	// 	func.Get_Periodic_Transactions_All('admin', 'admin', period).then(function(a){
	// 		var all = a.data;
	// 		func.Get_Periodic_Transactions_Success('admin', 'admin', period).then(function(b){
	// 			var success = b.data;
	// 			func.Get_Periodic_Transactions_Failed('admin', 'admin', period).then(function(c){
	// 				var failed = c.data;
	// 				var list = [all, success, failed];
	// 				charts.Transactions_Chart(period, list);
	// 			});
	// 		});
	// 	});
	// }
	// events.db_navigate_main_info();
	// events.db_navigate_bal_chart();
	// events.db_navigate_earn_chart();
	events.db_navigate_trans_chart();
	
}]);
reports.controller('OperatorHomeController', ['$scope', '$http', '$filter', 'events', 
'func', 'charts', function($scope, $http, $filter, events, func, charts){
	$scope.userType = 'operator';
	operator = $('.logged-user').text();
	$scope.currentDate = func.getCurrentDate();
	$scope.prevDate = func.getLastDate(10);
	$('.rp-start-date').val($scope.prevDate);
	$('.rp-end-date').val($scope.currentDate);

	$scope.init = function(startDate, endDate){
		$('.main').hide().fadeIn();
		func.oprMainDetails('currentBalance', startDate, endDate, operator).then(function(response){
			try{
				$scope.currentBalance = response.data[0]['balance'];	
			}
			catch{
				$scope.currentBalance = 0;
			}
		});
		func.oprMainDetails('totalSales', startDate, endDate, operator).then(function(response){
			$scope.totalSales = response.data[0]['totalSales'];
		});
		func.oprMainDetails('totalCostSales', startDate, endDate, operator).then(function(response){
			$scope.totalCostSales = response.data[0]['totalCostSales'];
		});
		func.oprMainDetails('totalServiceCharge', startDate, endDate, operator).then(function(response){
			$scope.totalServiceCharge = response.data[0]['totalServiceCharge'];
		});
		func.Get_Periodic_Transactions_All('operator', operator, 'daily').then(function(a){
			var all = a.data;
			func.Get_Periodic_Transactions_Success('operator', operator, 'daily').then(function(b){
				var success = b.data;
				func.Get_Periodic_Transactions_Failed('operator', operator, 'daily').then(function(c){
					var failed = c.data;
					var list = [all, success, failed];
					charts.Transactions_Chart('daily', list);
				});
			});
		});

		$scope.datePicker = function(){
			start = $('.rp-start-date').val();
			end = $('.rp-end-date').val();
			if(start == '' || end == ''){
				alert('Complete Fields'); 
				return 0;
			}
			$scope.init(start, end);
		}
	}





	
	// func.Get_Balance('operator', operator).then(function(response){
	// 	$scope.balance = response.data[0]['balance'];
	// });
	// func.Count_Mac_With_Balance('operator', operator).then(function(response){
	// 	$scope.withBalance = response.data;
	// });
	// func.Get_Remaining_Load('operator', operator).then(function(response){
	// 	$scope.remainingLoad = response.data;
	// });
	// $scope.main_info = function(period){
	// 	func.Get_Sales('operator', operator, period).then(function(response){
	// 		$scope.sales = response.data[0]['sales'];
	// 	});
	// 	func.Get_Earnings('operator', operator, period).then(function(response){
	// 		$scope.earnings = response.data[0]['earnings'];
	// 	});
	// 	func.Get_Transactions('operator', operator, 'all', period).then(function(response){
	// 		$scope.all_transactions = response.data[0]['transactions'];
	// 	});
	// 	func.Get_Transactions('operator', operator, 'success', period).then(function(response){
	// 		$scope.success_transactions = response.data[0]['transactions'];
	// 	});
	// }
	// $scope.balance_chart = function(period){
	// 	func.Get_Periodic_Balance('operator', operator, period).then(function(response){
	// 		charts.Balance_Chart(period, response.data);
	// 	});
	// }
	// $scope.earnings_chart = function(period){
	// 	func.Get_Periodic_Sales('operator', operator, period, '').then(function(response){
	// 		charts.Earnings_Chart(period, response.data);
	// 	});
	// }
	// $scope.transactions_chart = function(period){
	// 	func.Get_Periodic_Transactions_All('operator', operator, period).then(function(a){
	// 		var all = a.data;
	// 		func.Get_Periodic_Transactions_Success('operator', operator, period).then(function(b){
	// 			var success = b.data;
	// 			func.Get_Periodic_Transactions_Failed('operator', operator, period).then(function(c){
	// 				var failed = c.data;
	// 				var list = [all, success, failed];
	// 				charts.Transactions_Chart(period, list);
	// 			});
	// 		});
	// 	});
	// }
	// events.db_navigate_main_info();
	// events.db_navigate_bal_chart();
	// events.db_navigate_earn_chart();
	events.db_navigate_trans_chart();

}]);




reports.controller('AdministrationController', ['$scope', '$http', '$filter', 'events', 
'func', function($scope, $http, $filter, events, func){
	$('.main').hide().fadeIn();
	func.Get_Macs_List('admin', '').then(function(response){
		$scope.macs = response.data;
		$('.ad-macs-table').tableHeadFixer();
		setTimeout(function(){
			$.each($scope.macs, function(key, val){
				val['status'] == 'Enabled' ? $('.ad-status-btn-mac_'+key).attr('style', 'background-color: #28A745;') :
				$('.ad-status-btn-mac_'+key).attr('style', 'background-color: #DC3545;')
			});
		}, 0);
	});
	func.Get_Operators_List().then(function(response){
		$scope.operators = response.data;
		$('.ad-opr-table').tableHeadFixer();
		setTimeout(function(){
			$.each($scope.operators, function(key, val){
				val['status'] == 'Enabled' ? $('.ad-status-btn-opr_'+key).attr('style', 'background-color: #28A745;') :
				$('.ad-status-btn-opr_'+key).attr('style', 'background-color: #DC3545;')
			});
		}, 0);
		
	});
	func.Get_Partners_List().then(function(response){
		$scope.partners = response.data;
	});

	$scope.mac_status_button = function(idx, macParam){
		if($('.ad-status-btn-mac_'+idx).text() == 'Enabled'){
			$('.ad-status-btn-mac_'+idx).text('Disabled').hide().fadeIn();
			$('.ad-status-btn-mac_'+idx).attr('style', 'background-color: #DC3545;')
			func.Set_Status('', macParam, 'Disabled').then(function(response){});
		}
		else{
			$('.ad-status-btn-mac_'+idx).text('Enabled').hide().fadeIn();
			$('.ad-status-btn-mac_'+idx).attr('style', 'background-color: #28A745;')
			func.Set_Status('', macParam, 'Enabled').then(function(response){});
		}
	}
	$scope.operator_status_button = function(idx, oprParam){
		if($('.ad-status-btn-opr_'+idx).text() == 'Enabled'){
			$('.ad-status-btn-opr_'+idx).text('Disabled').hide().fadeIn();
			$('.ad-status-btn-opr_'+idx).attr('style', 'background-color: #DC3545;')
			func.Set_Status(oprParam, '', 'Disabled').then(function(response){});
		}
		else{
			$('.ad-status-btn-opr_'+idx).text('Enabled').hide().fadeIn();
			$('.ad-status-btn-opr_'+idx).attr('style', 'background-color: #28A745;')
			func.Set_Status(oprParam, '', 'Enabled').then(function(response){});
		}
	}
	$scope.reset_password = function(user){
		func.Reset_Password(user).then(function(response){
			alert(response.data);
		});
	}
	$scope.edit1 = function(idx){
		$('.ad-macs-option_'+idx).prop('disabled', false);
		$('.ad-macs-input_'+idx).prop('disabled', false);
	}
	$scope.apply1 = function(idx, mac){
		var operator = $('.ad-macs-option_'+idx).find(':selected').text();
		var site = $('.ad-macs-input_'+idx).val();
		if($('.ad-macs-option_'+idx).prop('disabled') || $('.ad-macs-input_'+idx).prop('disabled'))
			return 0;
		else{
			$http.post('/api/assign-macs?site=' + site + '&operator=' + operator + '&mac=' + mac)
			.then(function(response){
				$('.ad-macs-option_'+idx).prop('disabled', true);
				$('.ad-macs-input_'+idx).prop('disabled', true);
				alert('Successfully Assigned');
			});
		}
	}
	$scope.edit2 = function(idx){
		$('.ad-opr-option_'+idx).prop('disabled', false);
	}
	$scope.apply2 = function(idx, operator){
		var partner = $('.ad-opr-option_'+idx).find(':selected').text();
		if($('.ad-opr-option_'+idx).prop('disabled'))
			return 0;
		else{
			$http.post('/api/assign-operators?partner=' + partner + '&operator=' + operator)
			.then(function(response){
				$('.ad-opr-option_'+idx).prop('disabled', true);
				alert('Successfully Assigned');
			});
		}
	}
}]);



reports.controller('AdminTopupController', ['$scope', '$http', '$filter', 'events',
'func', '$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.userType = 'admin';
	func.Get_Operators_List().then(function(response){
		$scope.operators = response.data;
		$('.tp-topup-table').tableHeadFixer();
	});
	func.Get_Macs_List('admin', '').then(function(response){
		$scope.macs = response.data;
	});
	func.Topup_History('all', '', '').then(function(response){
		$scope.tp_history = response.data;
	});
	$scope.add_balance_operator = function(idx, operator){
		var topup_value = $('.tp-val-option_'+idx).find(':selected').text();
		if(topup_value == '-----'){
			alert('Invalid Value');
			return 0
		}
		else{
			if(confirm('Are You Sure?') == false)
				return 0;
			func.Topup_Operator(operator, topup_value).then(function(response){
				alert('Successfully Topped Up');
				$route.reload();
			});
		}
	}
	$scope.add_balance_mac = function(idx, mac){
		var topup_value = $('.tp-val-option2_'+idx).find(':selected').text();
		if(topup_value == '-----'){
			alert('Invalid Value');
			return 0
		}
		else{
			if(confirm('Are You Sure?') == false)
				return 0;
			func.Add_Topup(mac, topup_value).then(function(response){
				alert('Successfully Topped Up');
				$route.reload();
			});
		}
	}
	$scope.topup_history = function(occ){
		func.Topup_History('all', occ, '').then(function(response){
			$scope.tp_history = response.data;
		});
	}
	$scope.reload = function(){
		$route.reload();
	}
	events.tp_tab_navigator();
}]);
reports.controller('AdminTopupControllerEach', ['$scope', '$http', '$filter', 'events',
'func', '$route', '$location', function($scope, $http, $filter, events, func, $route, $location){
	$('.main').hide().fadeIn();
	$scope.userType = 'admin';
	macParam = $location.search().mac;
	oprParam = $location.search().opr;
	func.Get_Operators_List().then(function(response){
		$scope.operators = response.data;
		$('.tp-topup-table').tableHeadFixer();
	});
	func.Get_Macs_List('admin', '').then(function(response){
		$scope.macs = response.data;
	});
	if(macParam == ''){
		func.Topup_History(oprParam, '', '').then(function(response){
			$scope.tp_history = response.data;
		});
	}
	else{
		func.Topup_History('', '', macParam).then(function(response){
			$scope.tp_history = response.data;
		});
	}
	$scope.add_balance_operator = function(idx, operator){
		var topup_value = $('.tp-val-option_'+idx).find(':selected').text();
		if(topup_value == '-----'){
			alert('Invalid Value');
			return 0
		}
		else{
			if(confirm('Are You Sure?') == false)
				return 0;
			func.Topup_Operator(operator, topup_value).then(function(response){
				alert('Successfully Topped Up');
				$route.reload();
			});
		}
	}
	$scope.add_balance_mac = function(idx, mac){
		var topup_value = $('.tp-val-option2_'+idx).find(':selected').text();
		if(topup_value == '-----'){
			alert('Invalid Value');
			return 0
		}
		else{
			if(confirm('Are You Sure?') == false)
				return 0;
			func.Add_Topup(mac, topup_value).then(function(response){
				alert('Successfully Topped Up');
				$route.reload();
			});
		}
	}
	$scope.topup_history = function(occ){
		if(macParam == ''){
			func.Topup_History(oprParam, occ, '').then(function(response){
				$scope.tp_history = response.data;
			});
		}
		else{
			func.Topup_History('', occ, macParam).then(function(response){
				$scope.tp_history = response.data;
			});
		}
	}
	$scope.reload = function(){
		$route.reload();
	}
	events.tp_tab_navigator();
}]);

reports.controller('OperatorTopupController', ['$scope', '$http', '$filter', 'events',
'func', '$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.userType = 'operator';
	operator = $('.logged-user').text();
	func.Get_Operator_Balance(operator).then(function(response){
		$scope.bal = response.data;
		$('.tp-topup-table').tableHeadFixer();
	})
	func.Get_Macs_List('operator', operator).then(function(response){
		$scope.macs = response.data;
	});
	func.Topup_History(operator, '', '').then(function(response){
		$scope.tp_history = response.data;
	});
	$scope.add_balance_mac = function(idx, mac){
		var topup_value = $('.tp-val-option_'+idx).find(':selected').text();
		if(topup_value == '-----'){
			alert('Invalid Value');
			return 0
		}
		else{
			if(confirm('Are You Sure?') == false)
				return 0;
			func.Topup_Operator_Mac(operator, mac, topup_value).then(function(response){
				alert(response.data);
				$route.reload();
			});
		}
	}
	$scope.topup_history = function(occ){
		func.Topup_History(operator, occ, '').then(function(response){
			$scope.tp_history = response.data;
		});
	}
	$scope.reload = function(){
		$route.reload();
	}
	events.tp_tab_navigator();
}]);
reports.controller('OperatorTopupControllerEach', ['$scope', '$http', '$filter', 'events',
'func', '$route', '$location', function($scope, $http, $filter, events, func, $route, $location){
	$('.main').hide().fadeIn();
	$scope.userType = 'operator';
	operator = $('.logged-user').text();
	$scope.mac = $location.search().mac;
	func.Get_Operator_Balance(operator).then(function(response){
		$scope.bal = response.data;
		$('.tp-topup-table').tableHeadFixer();
	})
	func.Get_Macs_List('operator', operator).then(function(response){
		$scope.macs = response.data;
	});
	func.Topup_History(operator, '', $scope.mac).then(function(response){
		$scope.tp_history = response.data;
	});
	$scope.add_balance_mac = function(idx, mac){
		var topup_value = $('.tp-val-option_'+idx).find(':selected').text();
		if(topup_value == '-----'){
			alert('Invalid Value');
			return 0
		}
		else{
			if(confirm('Are You Sure?') == false)
				return 0;
			func.Topup_Operator_Mac(operator, mac, topup_value).then(function(response){
				alert(response.data);
				$route.reload();
			});
		}
	}
	$scope.topup_history = function(occ){
		func.Topup_History(operator, occ, $scope.mac).then(function(response){
			$scope.tp_history = response.data;
		});
	}
	$scope.reload = function(){
		$route.reload();
	}
	events.tp_tab_navigator();
}]);




reports.controller('AdminBalanceController', ['$scope', '$http', '$filter', 'events', 'func',
'$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.balance_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('admin', '').then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Balance('admin', 'admin', period).then(function(response){
			$scope.balance = response.data;
		});
		func.Get_Periodic_Deduction('admin', 'admin', period).then(function(response){
			$scope.deduction = response.data;
			$scope._deduction = $scope.deduction.reduce((x, y) => x + y.deduction, 0); // Sum of objects
			$scope._topup = $scope.deduction.reduce((x, y) => x + y.topup, 0);
		});
		
		$scope.reload = function(){
			$route.reload();
		}
		$('.bl-select-mac').change(function(){
			var mac_selected = $('.bl-select-mac').find(':selected').text();
			window.location.replace('/admin/balance/macs?mac=' + mac_selected);
		});
	}
	events.bl_tab_navigator();
	
}]);
reports.controller('AdminBalanceControllerEach', ['$scope', '$http', '$filter', 'events', 'func',
'$route', '$location', function($scope, $http, $filter, events, func, $route, $location){
	$('.main').hide().fadeIn();
	mac = $location.search().mac;
	$scope.balance_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('admin', '').then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Search_Periodic_Balance('admin', 'admin', period, mac).then(function(response){
			$scope.balance = response.data;
		});
		func.Search_Periodic_Deduction('admin', 'admin', period, mac).then(function(response){
			$scope.deduction = response.data;
			$scope._deduction = $scope.deduction.reduce((x, y) => x + y.deduction, 0);
			$scope._topup = $scope.deduction.reduce((x, y) => x + y.topup, 0);
		});
		
		$scope.reload = function(){
			window.location.replace('/admin/balance');
		}
		$('.bl-select-mac').change(function(){
			var mac_selected = $('.bl-select-mac').find(':selected').text();
			window.location.replace('/admin/balance/macs?mac=' + mac_selected);
		});
	}
	events.bl_tab_navigator();
	
}]);

reports.controller('OperatorBalanceController', ['$scope', '$http', '$filter', 'events', 'func',
'$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	operator = $('.logged-user').text();
	$scope.balance_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('operator', operator).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Balance('operator', operator, period).then(function(response){
			$scope.balance = response.data;
		});
		func.Get_Periodic_Deduction('operator', operator, period).then(function(response){
			$scope.deduction = response.data;
			$scope._deduction = $scope.deduction.reduce((x, y) => x + y.deduction, 0);
			$scope._topup = $scope.deduction.reduce((x, y) => x + y.topup, 0);
		});

		$scope.reload = function(){
			$route.reload();
		}
		$('.bl-select-mac').change(function(){
			var mac_selected = $('.bl-select-mac').find(':selected').text();
			window.location.replace('/operator/balance/macs?mac=' + mac_selected);
		});
	}
	events.bl_tab_navigator();

}]);
reports.controller('OperatorBalanceControllerEach', ['$scope', '$http', '$filter', 'events', 'func',
'$route', '$location', function($scope, $http, $filter, events, func, $route, $location){
	$('.main').hide().fadeIn();
	operator = $('.logged-user').text();
	mac = $location.search().mac;
	$scope.balance_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('operator', operator).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Search_Periodic_Balance('operator', operator, period, mac).then(function(response){
			$scope.balance = response.data;
		});
		func.Search_Periodic_Deduction('operator', operator, period, mac).then(function(response){
			$scope.deduction = response.data;
			$scope._deduction = $scope.deduction.reduce((x, y) => x + y.deduction, 0);
			$scope._topup = $scope.deduction.reduce((x, y) => x + y.topup, 0);
		});

		$scope.reload = function(){
			window.location.replace('/operator/balance');
		}
		$('.bl-select-mac').change(function(){
			var mac_selected = $('.bl-select-mac').find(':selected').text();
			window.location.replace('/operator/balance/macs?mac=' + mac_selected);
		});
	}
	events.bl_tab_navigator();

}]);

reports.controller('PartnerBalanceController', ['$scope', '$http', '$filter', 'events', 'func',
'$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	partner = $('.logged-user').text();
	$scope.balance_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('partner', partner).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Balance('partner', partner, period).then(function(response){
			$scope.balance = response.data;
		});
		func.Get_Periodic_Deduction('partner', partner, period).then(function(response){
			$scope.deduction = response.data;
			$scope._deduction = $scope.deduction.reduce((x, y) => x + y.deduction, 0);
			$scope._topup = $scope.deduction.reduce((x, y) => x + y.topup, 0);
		});

		$scope.reload = function(){
			$route.reload();
		}
		$('.bl-select-mac').change(function(){
			var mac_selected = $('.bl-select-mac').find(':selected').text();
			window.location.replace('/partner/balance/macs?mac=' + mac_selected);
		});
	}
	events.bl_tab_navigator();
}]);

reports.controller('PartnerBalanceControllerEach', ['$scope', '$http', '$filter', 'events', 'func',
'$route', '$location', function($scope, $http, $filter, events, func, $route, $location){
	$('.main').hide().fadeIn();
	partner = $('.logged-user').text();
	mac = $location.search().mac;
	$scope.balance_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('partner', partner).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Search_Periodic_Balance('partner', partner, period, mac).then(function(response){
			$scope.balance = response.data;
		});
		func.Search_Periodic_Deduction('partner', partner, period, mac).then(function(response){
			$scope.deduction = response.data;
			$scope._deduction = $scope.deduction.reduce((x, y) => x + y.deduction, 0);
			$scope._topup = $scope.deduction.reduce((x, y) => x + y.topup, 0);
		});

		$scope.reload = function(){
			window.location.replace('/partner/balance');
		}
		$('.bl-select-mac').change(function(){
			var mac_selected = $('.bl-select-mac').find(':selected').text();
			window.location.replace('/partner/balance/macs?mac=' + mac_selected);
		});
	}
	events.bl_tab_navigator();
}]);





reports.controller('AdminEarningsController', ['$scope', '$http', '$filter', 'events', 'func', '$route',
function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.earnings_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';	// occ = occurence
		func.Get_Macs_List('admin', '').then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Sales('admin', 'admin', period, '').then(function(response){
			$scope.sales = response.data
			$scope.totalsales = $scope.sales.reduce((x, y) => x + y.sale, 0);
			$scope.totalrevenue = $scope.sales.reduce((x, y) => x + y.revenue, 0);
		});

		$scope.reload = function(){
			$route.reload();
		}
		$('.ea-select-mac').change(function(){
			var mac_selected = $('.ea-select-mac').find(':selected').text();
			window.location.replace('/admin/earnings/macs?mac=' + mac_selected);
		});
	}
	events.ea_tab_navigator();
}]);
reports.controller('AdminEarningsControllerEach', ['$scope', '$http', '$filter', 'events', 'func', '$location',
function($scope, $http, $filter, events, func, $location){
	$('.main').hide().fadeIn();
	mac = $location.search().mac;
	$scope.earnings_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';	// occ = occurence
		func.Get_Macs_List('admin', '').then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Sales('admin', 'admin', period, mac).then(function(response){
			$scope.sales = response.data
			$scope.totalsales = $scope.sales.reduce((x, y) => x + y.sale, 0);
			$scope.totalrevenue = $scope.sales.reduce((x, y) => x + y.revenue, 0);
		});

		$scope.reload = function(){
			window.location.replace('/admin/earnings');
		}
		$('.ea-select-mac').change(function(){
			var mac_selected = $('.ea-select-mac').find(':selected').text();
			window.location.replace('/admin/earnings/macs?mac=' + mac_selected);
		});
	}
	events.ea_tab_navigator();
}]);

reports.controller('OperatorEarningsController', ['$scope', '$http', '$filter', 'events', 'func', '$route',
function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	operator = $('.logged-user').text();
	$scope.earnings_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('operator', operator).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Sales('operator', operator, period, '').then(function(response){
			$scope.sales = response.data
			$scope.totalsales = $scope.sales.reduce((x, y) => x + y.sale, 0);
			$scope.totalrevenue = $scope.sales.reduce((x, y) => x + y.revenue, 0);
		});

		$scope.reload = function(){
			$route.reload();
		}
		$('.ea-select-mac').change(function(){
			var mac_selected = $('.ea-select-mac').find(':selected').text();
			window.location.replace('/operator/earnings/macs?mac=' + mac_selected);
		});
	}
	events.ea_tab_navigator();
}]);
reports.controller('OperatorEarningsControllerEach', ['$scope', '$http', '$filter', 'events', 'func', '$location',
function($scope, $http, $filter, events, func, $location){
	$('.main').hide().fadeIn();
	operator = $('.logged-user').text();
	mac = $location.search().mac;
	$scope.earnings_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('operator', operator).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Sales('operator', operator, period, mac).then(function(response){
			$scope.sales = response.data
			$scope.totalsales = $scope.sales.reduce((x, y) => x + y.sale, 0);
			$scope.totalrevenue = $scope.sales.reduce((x, y) => x + y.revenue, 0);
		});

		$scope.reload = function(){
			window.location.replace('/operator/earnings');
		}
		$('.ea-select-mac').change(function(){
			var mac_selected = $('.ea-select-mac').find(':selected').text();
			window.location.replace('/operator/earnings/macs?mac=' + mac_selected);
		});
	}
	events.ea_tab_navigator();
}]);

reports.controller('PartnerEarningsController', ['$scope', '$http', '$filter', 'events', 'func', '$route',
function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	partner = $('.logged-user').text();
	$scope.earnings_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('partner', partner).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Sales('partner', partner, period, '').then(function(response){
			$scope.sales = response.data
			$scope.totalsales = $scope.sales.reduce((x, y) => x + y.sale, 0);
			$scope.totalrevenue = $scope.sales.reduce((x, y) => x + y.revenue, 0);
		});

		$scope.reload = function(){
			$route.reload();
		}
		$('.ea-select-mac').change(function(){
			var mac_selected = $('.ea-select-mac').find(':selected').text();
			window.location.replace('/partner/earnings/macs?mac=' + mac_selected);
		});
	}
	events.ea_tab_navigator();
}]);
reports.controller('PartnerEarningsControllerEach', ['$scope', '$http', '$filter', 'events', 'func', '$location',
function($scope, $http, $filter, events, func, $location){
	$('.main').hide().fadeIn();
	partner = $('.logged-user').text();
	mac = $location.search().mac;
	$scope.earnings_table = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('partner', partner).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Sales('partner', partner, period, mac).then(function(response){
			$scope.sales = response.data
			$scope.totalsales = $scope.sales.reduce((x, y) => x + y.sale, 0);
			$scope.totalrevenue = $scope.sales.reduce((x, y) => x + y.revenue, 0);
		});

		$scope.reload = function(){
			window.location.replace('/partner/earnings');
		}
		$('.ea-select-mac').change(function(){
			var mac_selected = $('.ea-select-mac').find(':selected').text();
			window.location.replace('/partner/earnings/macs?mac=' + mac_selected);
		});
	}
	events.ea_tab_navigator();
}]);





reports.controller('AdminTransactionsController', ['$scope', '$http', '$filter', 'events', 'func',
'$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.userType = 'admin';
	$scope.hideServiceCharge = true;
	$scope.render_transactions = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('admin', '').then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Transactions_All('admin', 'admin', period).then(function(response){
			$scope.all = response.data;
			$scope._all = $scope.all.reduce((x, y) => x + y.transactions, 0);	// Sum of Objects
		});
		func.Get_Periodic_Transactions_Success('admin', 'admin', period).then(function(response){
			$scope.success = response.data;
			$scope._success = $scope.success.reduce((x, y) => x + y.transactions, 0);
		});
		func.Get_Periodic_Transactions_Failed('admin', 'admin', period).then(function(response){
			$scope.failed = response.data;
			$scope._failed = $scope.failed.reduce((x ,y) => x + y.transactions, 0);
		});
		func.Get_Transaction_Logs('admin', 'admin', period).then(function(response){
			$scope.logs = response.data;
			$('.tr-logs-table').tableHeadFixer();
		});

		$scope.reload = function(){
			$route.reload();
		}
		
		// Select mac in dropdown
		$('.tr-select-mac').change(function(){
			var mac_selected = $('.tr-select-mac').find(':selected').text();
			window.location.replace('/admin/transactions/macs?mac=' + mac_selected + '&opr=&mob=');
		});
	}
	events.tr_tab_navigator();
}]);
reports.controller('AdminTransactionsControllerEach', ['$scope', '$http', '$filter', 'events', 'func',
'$route', '$location', function($scope, $http, $filter, events, func, $route, $location){
	$('.main').hide().fadeIn();
	$scope.userType = 'admin';
	$scope.hideServiceCharge = true;
	mac = $location.search().mac;
	opr = $location.search().opr;
	mob = $location.search().mob;
	$scope.render_transactions = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('admin', '').then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Search_Periodic_Transactions_All('admin', 'admin', period, mac, opr, mob).then(function(response){
			$scope.all = response.data;
			$scope._all = $scope.all.reduce((x, y) => x + y.transactions, 0);
		});
		func.Search_Periodic_Transactions_Success('admin', 'admin', period, mac, opr, mob).then(function(response){
			$scope.success = response.data;
			$scope._success = $scope.success.reduce((x, y) => x + y.transactions, 0);
		});
		func.Search_Periodic_Transactions_Failed('admin', 'admin', period, mac, opr, mob).then(function(response){
			$scope.failed = response.data;
			$scope._failed = $scope.failed.reduce((x ,y) => x + y.transactions, 0);
		});
		func.Search_Transaction_Logs('admin', 'admin', period, mac, opr, mob).then(function(response){
			$scope.logs = response.data;
			$('.tr-logs-table').tableHeadFixer();
		});

		$scope.reload = function(){
			window.location.replace('/admin/transactions');
		}

		// Select mac in dropdown
		$('.tr-select-mac').change(function(){
			var mac_selected = $('.tr-select-mac').find(':selected').text();
			window.location.replace('/admin/transactions/macs?mac=' + mac_selected + '&opr=&mob=');
		});
	}
	events.tr_tab_navigator();
}]);

reports.controller('OperatorTransactionsController', ['$scope', '$http', '$filter', 'events', 'func',
'$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.userType = 'operator';
	operator = $('.logged-user').text();
	$scope.hideAdminBalance = true, $scope.hideAdmProdCost = true, $scope.hideAdmPubPrice = true,
	$scope.hideAdmProCostEarning = true, $scope.hideAdmRev = true, $scope.hideOwner = true;
	$scope.render_transactions = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('operator', operator).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Transactions_All('operator', operator, period).then(function(response){
			$scope.all = response.data;
			$scope._all = $scope.all.reduce((x, y) => x + y.transactions, 0);
		});
		func.Get_Periodic_Transactions_Success('operator', operator, period).then(function(response){
			$scope.success = response.data;
			$scope._success = $scope.success.reduce((x, y) => x + y.transactions, 0);
		});
		func.Get_Periodic_Transactions_Failed('operator', operator, period).then(function(response){
			$scope.failed = response.data;
			$scope._failed = $scope.failed.reduce((x ,y) => x + y.transactions, 0);
		});
		func.Get_Transaction_Logs('operator', operator, period).then(function(response){
			$scope.logs = response.data;
			$('.tr-logs-table').tableHeadFixer();
		});

		$scope.reload = function(){
			$route.reload();
		}

		// Select mac in dropdown
		$('.tr-select-mac').change(function(){
			var mac_selected = $('.tr-select-mac').find(':selected').text();
			window.location.replace('/operator/transactions/macs?mac=' + mac_selected + '&opr=&mob=');
		});
	}
	events.tr_tab_navigator();
}]);
reports.controller('OperatorTransactionsControllerEach', ['$scope', '$http', '$filter', 'events', 'func',
'$route', '$location', function($scope, $http, $filter, events, func, $route, $location){
	$('.main').hide().fadeIn();
	$scope.userType = 'operator';
	operator = $('.logged-user').text();
	$scope.hideAdminRevenue = true, $scope.hideAdminBalance = true, $scope.hideOwner = true;
	mac = $location.search().mac;
	opr = $location.search().opr;
	mob = $location.search().mob;
	$scope.render_transactions = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('operator', operator).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Search_Periodic_Transactions_All('operator', operator, period, mac, opr, mob).then(function(response){
			$scope.all = response.data;
			$scope._all = $scope.all.reduce((x, y) => x + y.transactions, 0);
		});
		func.Search_Periodic_Transactions_Success('operator', operator, period, mac, opr, mob).then(function(response){
			$scope.success = response.data;
			$scope._success = $scope.success.reduce((x, y) => x + y.transactions, 0);
		});
		func.Search_Periodic_Transactions_Failed('operator', operator, period, mac, opr, mob).then(function(response){
			$scope.failed = response.data;
			$scope._failed = $scope.failed.reduce((x ,y) => x + y.transactions, 0);
		});
		func.Search_Transaction_Logs('operator', operator, period, mac, opr, mob).then(function(response){
			$scope.logs = response.data;
			$('.tr-logs-table').tableHeadFixer();
		});

		$scope.reload = function(){
			window.location.replace('/operator/transactions');
		}

		// Select mac in dropdown
		$('.tr-select-mac').change(function(){
			var mac_selected = $('.tr-select-mac').find(':selected').text();
			window.location.replace('/operator/transactions/macs?mac=' + mac_selected + '&opr=&mob=');
		});
	}
	events.tr_tab_navigator();
}]);

reports.controller('PartnerTransactionsController', ['$scope', '$http', '$filter', 'events', 'func',
'$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.userType = 'partner';
	partner = $('.logged-user').text();
	$scope.hide_admin_bal = true;
	$scope.render_transactions = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('partner', partner).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Get_Periodic_Transactions_All('partner', partner, period).then(function(response){
			$scope.all = response.data;
			$scope._all = $scope.all.reduce((x, y) => x + y.transactions, 0);
		});
		func.Get_Periodic_Transactions_Success('partner', partner, period).then(function(response){
			$scope.success = response.data;
			$scope._success = $scope.success.reduce((x, y) => x + y.transactions, 0);
		});
		func.Get_Periodic_Transactions_Failed('partner', partner, period).then(function(response){
			$scope.failed = response.data;
			$scope._failed = $scope.failed.reduce((x ,y) => x + y.transactions, 0);
		});
		func.Get_Transaction_Logs('partner', partner, period).then(function(response){
			$scope.logs = response.data;
		});

		$scope.reload = function(){
			$route.reload();
		}

		// Select mac in dropdown
		$('.tr-select-mac').change(function(){
			var mac_selected = $('.tr-select-mac').find(':selected').text();
			window.location.replace('/partner/transactions/macs?mac=' + mac_selected + '&opr=&mob=');
		});
	}
	events.tr_tab_navigator();
}]);
reports.controller('PartnerTransactionsControllerEach', ['$scope', '$http', '$filter', 'events', 'func',
'$route', '$location', function($scope, $http, $filter, events, func, $route, $location){
	$('.main').hide().fadeIn();
	$scope.userType = 'partner';
	partner = $('.logged-user').text();
	$scope.hide_admin_bal = true;
	mac = $location.search().mac;
	opr = $location.search().opr;
	mob = $location.search().mob;
	$scope.render_transactions = function(period){
		period == 'daily' ? $scope.occ = 'Days' : period == 'weekly' ? $scope.occ = 'Weeks' : $scope.occ = 'Months';
		func.Get_Macs_List('partner', partner).then(function(response){
			$scope.macs = response.data;
		});
		func.Periodic_Dates(period).then(function(response){
			$scope.dates = response.data;
		});
		func.Search_Periodic_Transactions_All('partner', partner, period, mac, opr, mob).then(function(response){
			$scope.all = response.data;
			$scope._all = $scope.all.reduce((x, y) => x + y.transactions, 0);
		});
		func.Search_Periodic_Transactions_Success('partner', partner, period, mac, opr, mob).then(function(response){
			$scope.success = response.data;
			$scope._success = $scope.success.reduce((x, y) => x + y.transactions, 0);
		});
		func.Search_Periodic_Transactions_Failed('partner', partner, period, mac, opr, mob).then(function(response){
			$scope.failed = response.data;
			$scope._failed = $scope.failed.reduce((x ,y) => x + y.transactions, 0);
		});
		func.Search_Transaction_Logs('partner', partner, period, mac, opr, mob).then(function(response){
			$scope.logs = response.data;
		});

		$scope.reload = function(){
			window.location.replace('/partner/transactions');
		}

		// Select mac in dropdown
		$('.tr-select-mac').change(function(){
			var mac_selected = $('.tr-select-mac').find(':selected').text();
			window.location.replace('/partner/transactions/macs?mac=' + mac_selected + '&opr=&mob=');
		});
	}
	events.tr_tab_navigator();
}]);




reports.controller('AdminSettingsController', ['$scope', 'events', 'func', 
function($scope, events, func){
	$('.main').hide().fadeIn();
	user = $('.logged-user').text();
	$scope.change_password = function(){
		curr_pass = $('.sett-password').val();
		new_pass = $('.sett-new-password').val();
		confirm_pass = $('.sett-confirm-password').val();
		err_msg = "<font><b>Error: </b>Passwords didn't matched</font>"

		if(new_pass != confirm_pass){
			$('.sett-changepass-err').empty().append(err_msg);
			return $('.sett-password, .sett-new-password, .sett-confirm-password').val('');
		}
		func.Change_Password(user, curr_pass, new_pass).then(function(response){
			if(response.data == 'Failed, password not matched'){
				$('.sett-changepass-err').empty().append(err_msg);
				$('.sett-password, .sett-new-password, .sett-confirm-password').val('');
			}
			else{
				alert(response.data);
				window.location.replace('/admin/home');
			}
		});
	}
	$scope.change_email = function(){
		new_email = $('.sett-email').val();
		func.ChangeEmail(user, new_email).then(function(response){
			if(response.data != 'Success'){
				$('.sett-changeemail-err').text(response.data);
			}
			else{
				alert('Email address successfully changed.');
				window.location.replace('/admin/home');
			}
		});
	}
	function getUrlVars(){
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){
			vars[key] = value;
		});
		return vars;
	}
	upload_status = getUrlVars()['msg']
	upload_status != undefined ? (alert(upload_status.split('%20').join(' ')), window.location.replace('/admin/settings')) : 0
}]);
reports.controller('OperatorSettingsController', ['$scope', 'events', 'func', 
function($scope, events, func){
	$('.main').hide().fadeIn();
	$scope.hideUploadCarousel = true;
	user = $('.logged-user').text();
	$scope.change_password = function(){
		curr_pass = $('.sett-password').val();
		new_pass = $('.sett-new-password').val();
		confirm_pass = $('.sett-confirm-password').val();
		err_msg = "<font><b>Error: </b>Passwords didn't matched</font>"

		if(new_pass != confirm_pass){
			$('.sett-changepass-err').empty().append(err_msg);
			return $('.sett-password, .sett-new-password, .sett-confirm-password').val('');
		}
		func.Change_Password(user, curr_pass, new_pass).then(function(response){
			if(response.data == 'Failed, password not matched'){
				$('.sett-changepass-err').empty().append(err_msg);
				$('.sett-password, .sett-new-password, .sett-confirm-password').val('');
			}
			else{
				alert(response.data);
				window.location.replace('/operator/home');
			}
		});
	}
	$scope.change_email = function(){
		new_email = $('.sett-email').val();
		func.ChangeEmail(user, new_email).then(function(response){
			if(response.data != 'Success'){
				$('.sett-changeemail-err').text(response.data);
			}
			else{
				alert('Email address successfully changed.');
				window.location.replace('/operator/home');
			}
		});
	}
}]);
reports.controller('PartnerSettingsController', ['$scope', 'events', 'func', 
function($scope, events, func){
	$('.main').hide().fadeIn();
	user = $('.logged-user').text();
	$scope.change_password = function(){
		curr_pass = $('.sett-password').val();
		new_pass = $('.sett-new-password').val();
		confirm_pass = $('.sett-confirm-password').val();
		err_msg = "<font><b>Error: </b>Passwords didn't matched</font>"

		if(new_pass != confirm_pass){
			$('.sett-changepass-err').empty().append(err_msg);
			return $('.sett-password, .sett-new-password, .sett-confirm-password').val('');
		}
		func.Change_Password(user, curr_pass, new_pass).then(function(response){
			if(response.data == 'Failed, password not matched'){
				$('.sett-changepass-err').empty().append(err_msg);
				$('.sett-password, .sett-new-password, .sett-confirm-password').val('');	
			}
			else{
				alert(response.data);
				window.location.replace('/partner/home');
			}
		});
	}
}]);




reports.controller('AdminProdServController', ['$scope', '$http', '$filter', 'events',
'func', '$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.userType = 'admin';
	$scope.hideServiceChargeMenu = true;

	func.Get_Products('', '').then(function(response){
		$scope.products = response.data;
		$('.tp-topup-table').tableHeadFixer({head:true});
		setTimeout(function(){
			$.each($scope.products, function(key, val){
				val['status'] == 'Enabled' ? $('.tp-promo-status-btn_'+key).attr('style', 'background-color: #28A745;') :
				$('.tp-promo-status-btn_'+key).attr('style', 'background-color: #DC3545;')
			});
		}, 0);
	});

	$scope.set_price = function(idx, pcode){
		var price = $('.tp-price-input_'+idx).val();
		if(price == ''){
			alert('Invalid Value');
			return 0;
		}
		else{
			if(confirm('Are You Sure?') == false)
				return 0
			func.Set_Price_Admin(pcode, price).then(function(response){
				$('.tp-price-input_'+idx).val('').attr('placeholder', 'P'+price);
				alert(response.data);
			});
		}	
	}
	$scope.promo_status = function(idx, pcodeParam){
		if($('.tp-promo-status-btn_'+idx).text() == 'Enabled'){
			$('.tp-promo-status-btn_'+idx).text('Disabled').hide().fadeIn();
			$('.tp-promo-status-btn_'+idx).attr('style', 'background-color: #DC3545;');
			func.Set_Promo_Status(pcodeParam, 'Disabled').then(function(){});
		}
		else{
			$('.tp-promo-status-btn_'+idx).text('Enabled').hide().fadeIn();
			$('.tp-promo-status-btn_'+idx).attr('style', 'background-color: #28A745;');
			func.Set_Promo_Status(pcodeParam, 'Enabled').then(function(){});
		}
	}
	$scope.downloadCsvPrices = function(){
		window.location.replace('/admin/download_prices')
	}
	$scope.reload = function(){
		$route.reload();
	}
	$('.tp-select-provider').change(function(){
		var provider = $('.tp-select-provider').find(':selected').text();
		func.Get_Products(provider, '').then(function(response){
			$scope.products = response.data;
			setTimeout(function(){
				$.each($scope.products, function(key, val){
					val['status'] == 'Enabled' ? $('.tp-promo-status-btn_'+key).attr('style', 'background-color: #28A745;') :
					$('.tp-promo-status-btn_'+key).attr('style', 'background-color: #DC3545;')
				});
			}, 0);
		});
	});
	form = "<form action = '/admin/upload_prices' method = 'POST' " +
				"enctype = 'multipart/form-data'>" +
				"<input type='hidden' name='operator' value='{{operator}}'>" +
				"<input class='ps-choose-file' type = 'file' name = 'file' />" +
				"<input type = 'submit'/>" +
			"</form>"
	$('.ps-upload-form').append(form);	

	function getUrlVars(){
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){
			vars[key] = value;
		});
		return vars;
	}
	upload_status = getUrlVars()['msg']
	upload_status != undefined ? (alert(upload_status.split('%20').join(' ')), window.location.replace('/admin/products_services')) : 0

}]);
reports.controller('OperatorProdServController', ['$scope', '$http', '$filter', 'events',
'func', '$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.userType = 'operator';
	operator = $('.logged-user').text();
	$scope.hideEnableDisable = true;

	func.Get_Products('', operator).then(function(response){
		$scope.products = response.data;
		$('.tp-topup-table').tableHeadFixer();
	});
	func.Init_Service_Charge('get', operator, '').then(function(response){
		$scope.service_charge = response.data;
	});

	$scope.set_price = function(idx, pcode){
		var price = $('.tp-price-input_'+idx).val();
		if(price == ''){
			alert('Invalid Value');
			return 0;
		}
		else{
			if(confirm('Are You Sure?') == false)
				return 0
			func.Set_Price_Operator(pcode, price, operator).then(function(response){
				$('.tp-price-input_'+idx).val('').attr('placeholder', 'P'+price);
				alert(response.data);
			});
		}	
	}
	$scope.set_service_charge = function(){
		val = $('.service_charge').val();
		if(val<=0){
			alert('Invalid value');
			return 0;
		}
		func.Init_Service_Charge('set', operator, val).then(function(response){
			$scope.service_charge = val;
			alert(response.data);
		});
	}
	$scope.downloadCsvPrices = function(){
		window.location.replace('/operator/download_prices?operator=' + operator);
	}
	$scope.reload = function(){
		$route.reload();
	}
	$('.tp-select-provider').change(function(){
		var provider = $('.tp-select-provider').find(':selected').text();
		func.Get_Products(provider, operator).then(function(response){
			$scope.products = response.data;
		});
	});
	form = "<form action = '/operator/upload_prices' method = 'POST' " +
				"enctype = 'multipart/form-data'>" +
				"<input type='hidden' name='operator' value='" + operator + "'>" +
				"<input class='ps-choose-file' type = 'file' name = 'file' />" +
				"<input type = 'submit'/>" +
			"</form>"
	$('.ps-upload-form').append(form);

	function getUrlVars(){
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value){
			vars[key] = value;
		});
		return vars;
	}
	upload_status = getUrlVars()['msg']
	upload_status != undefined ? (alert(upload_status.split('%20').join(' ')), window.location.replace('/operator/products_services')) : 0
}]);




reports.controller('AdminNewsAdsController', ['$scope', '$http', '$filter', 'events',
'func', '$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.userType = 'admin';

	
}]);
reports.controller('OperatorNewsAdsController', ['$scope', '$http', '$filter', 'events',
'func', '$route', function($scope, $http, $filter, events, func, $route){
	$('.main').hide().fadeIn();
	$scope.userType = 'operator';

	
}]);




reports.controller('AdminReportsController', ['$scope', '$http', '$filter', 'events',
'func', 'charts', '$route', function($scope, $http, $filter, events, func, charts, $route){
	$scope.userType = 'admin';
	$scope.currentDate = func.getCurrentDate();
	$scope.prevDate = func.getLastDate(10);
	$('.rp-start-date').val($scope.prevDate);
	$('.rp-end-date').val($scope.currentDate);

	$scope.init = function(startDate, endDate){
		$('.main').hide().fadeIn();
		$('.rp-totalTransactions-cont').fadeIn();
		$('.rp-totalOprBalance-cont, .rp-totalRemLoad-cont').hide();
		func.adminMainDetails('currentBalance', startDate, endDate).then(function(response){
			$scope.currentBalance = response.data[0]['bal'];
			$('.rp-details-table, .rp-transactionLogs-table').tableHeadFixer();
		});
		func.adminMainDetails('totalSalesEarnings', startDate, endDate).then(function(response){
			$scope.totalSales = response.data[0]['sales'];
			$scope.totalEarnings = response.data[0]['earnings'];
		});
		func.adminMainDetails('totalTransAll', startDate, endDate).then(function(response){
			$scope.totalTransAll = response.data[0]['transactions'];
		});
		func.adminMainDetails('totalTransSuccess', startDate, endDate).then(function(response){
			$scope.totalTransSuccess = response.data[0]['transactions'];
		});
		func.adminMainDetails('totalTransFailed', startDate, endDate).then(function(response){
			$scope.totalTransFailed = response.data[0]['transactions'];
		});
		func.adminMainDetails('totalOperatorBalance', startDate, endDate).then(function(response){
			$scope.totalOperatorBalance = response.data[0]['balance'];
		});
		func.adminMainDetails('totalRemainingLoad', startDate, endDate).then(function(response){
			$scope.totalRemainingLoad = response.data[0]['balance'];
		});
		func.adminMainDetails('countMacWithBalance', startDate, endDate).then(function(response){
			$scope.countMacWithBalance = response.data[0]['withBalance'];
		});
		func.adminMainDetails('operatorsBalance', startDate, endDate).then(function(response){
			$scope.operatorsBalance = response.data;
		});
		func.adminMainDetails('datedTopupDeduction', startDate, endDate).then(function(response){
			$scope.totalDeduction = response.data.reduce((x, y) => x + y.deduction, 0);
		});
		func.adminMainDetails('datedTransAll', startDate, endDate).then(function(response){
			arr1 = response.data;
			func.adminMainDetails('datedTransSuccess', startDate, endDate).then(function(response){
				arr2 = response.data;
				func.adminMainDetails('datedTransFailed', startDate, endDate).then(function(response){
					arr3 = response.data;
					charts.totalTransChart(arr1, arr2, arr3);
				});
			});
		});
		func.adminMainDetails('transactionLogs', startDate, endDate).then(function(response){
			$scope.transactionLogs = response.data;
		});

		

		$scope.datePicker = function(){
			start = $('.rp-start-date').val();
			end = $('.rp-end-date').val();
			if(start == '' || end == ''){
				alert('Complete Fields'); 
				return 0;
			}
			$scope.init(start, end);
		}
		$scope.currentBalanceChart = function(){
			func.adminMainDetails('datedCurrentBalance', startDate, endDate).then(function(response){
				charts.currentBalanceChart(response.data);
			});
		}
		$scope.totalSalesChart = function(){
			func.adminMainDetails('datedSalesEarnings', startDate, endDate).then(function(response){
				charts.totalSalesChart(response.data);
			});
		}
		$scope.totalEarningsChart = function(){
			func.adminMainDetails('datedSalesEarnings', startDate, endDate).then(function(response){
				charts.totalEarningsChart(response.data);
			});
		}
		$scope.totalOprBalanceClicked = function(){
			func.adminMainDetails('operatorsBalance', startDate, endDate).then(function(response){
				$scope.operatorsBalance = response.data;
			});
		}
		$scope.totalRemainingLoadClicked = function(){
			func.adminMainDetails('macsRemainingLoad', startDate, endDate).then(function(response){
				$scope.macsRemainingLoad = response.data;
				$scope.totalLoad = response.data.reduce((x, y) => x + parseFloat(y['balance']), 0);	
			});
		}
		$scope.totalVendoLoadClicked = function(){
			func.adminMainDetails('macsWithLoad', startDate, endDate).then(function(response){
				$scope.macsRemainingLoad = response.data;
			});
		}
		$scope.downloadTransactionLogs = function(){
			window.location.replace('/api/downloadTransactionLogs?userType=admin&startDate=' +
				startDate + '&endDate=' + endDate + '&opr=&mac=')
		}

		$('.rp-selectOpr').change(function(){
			var selectedOperator = $('.rp-selectOpr').find(':selected').text();
			func.adminMainDetails('macsOfOperator', selectedOperator, '').then(function(response){
				$scope.macsRemainingLoad = response.data;
				$scope.totalLoad = response.data.reduce((x, y) => x + parseFloat(y['balance']), 0);
				$('.rp-totalRemLoad-cont').hide().fadeIn();
			})
		});
	}
	events.currentBalanceClicked();
	events.totalSalesClicked();
	events.totalEarningsClicked();
	events.totalTransClicked();
	events.totalOprBalanceClicked();
	events.totalRemainingLoadClicked();
	events.totalVendoLoadClicked();
	
}]);

reports.controller('AdminReportsControllerEach', ['$scope', '$http', '$filter', 'events',
'func', 'charts', '$location', function($scope, $http, $filter, events, func, charts, $location){
	$scope.userType = 'admin';
	$scope.currentDate = func.getCurrentDate();
	$scope.prevDate = func.getLastDate(10);
	$('.rp-start-date').val($scope.prevDate);
	$('.rp-end-date').val($scope.currentDate);
	macParam = $location.search().mac;
	$('.rep').append('Reference MAC Address: ' + macParam);

	$scope.init = function(startDate, endDate){
		$('.main').hide().fadeIn();
		$('.rp-totalTransactions-cont').fadeIn();
		$('.rp-totalOprBalance-cont, .rp-totalRemLoad-cont').hide();
		$('.rp-infoBox5, .rp-infoBox6, .rp-infoBox7').hide();

		func.adminMainDetailsEach('currentBalance', startDate, endDate, macParam).then(function(response){
			$scope.currentBalance = response.data[0]['balance'];
			$('.rp-details-table, .rp-transactionLogs-table').tableHeadFixer();
		});
		func.adminMainDetailsEach('totalSalesEarnings', startDate, endDate, macParam).then(function(response){
			$scope.totalSales = response.data[0]['sales'];
			$scope.totalEarnings = response.data[0]['earnings'];
		});
		func.adminMainDetailsEach('totalTransAll', startDate, endDate, macParam).then(function(response){
			$scope.totalTransAll = response.data[0]['transactions'];
		});
		func.adminMainDetailsEach('totalTransSuccess', startDate, endDate, macParam).then(function(response){
			$scope.totalTransSuccess = response.data[0]['transactions'];
		});
		func.adminMainDetailsEach('totalTransFailed', startDate, endDate, macParam).then(function(response){
			$scope.totalTransFailed = response.data[0]['transactions'];
		});
		func.adminMainDetailsEach('datedTopupDeduction', startDate, endDate, macParam).then(function(response){
			$scope.totalDeduction = response.data.reduce((x, y) => x + y.deduction, 0);
		});
		func.adminMainDetailsEach('datedTransAll', startDate, endDate, macParam).then(function(response){
			arr1 = response.data;
			func.adminMainDetailsEach('datedTransSuccess', startDate, endDate, macParam).then(function(response){
				arr2 = response.data;
				func.adminMainDetailsEach('datedTransFailed', startDate, endDate, macParam).then(function(response){
					arr3 = response.data;
					charts.totalTransChart(arr1, arr2, arr3);
				});
			});
		});
		func.adminMainDetailsEach('transactionLogs', startDate, endDate, macParam).then(function(response){
			$scope.transactionLogs = response.data;
		});

		$scope.datePicker = function(){
			start = $('.rp-start-date').val();
			end = $('.rp-end-date').val();
			if(start == '' || end == ''){
				alert('Complete Fields'); 
				return 0;
			}
			$scope.init(start, end);
		}
		$scope.currentBalanceChart = function(){
			func.adminMainDetailsEach('datedCurrentBalance', startDate, endDate, macParam).then(function(response){
				charts.currentBalanceChart(response.data);
			});
		}
		$scope.totalSalesChart = function(){
			func.adminMainDetailsEach('datedSalesEarnings', startDate, endDate, macParam).then(function(response){
				charts.totalSalesChart(response.data);
			});
		}
		$scope.totalEarningsChart = function(){
			func.adminMainDetailsEach('datedSalesEarnings', startDate, endDate, macParam).then(function(response){
				charts.totalEarningsChart(response.data);
			});
		}
		$scope.downloadTransactionLogs = function(){
			window.location.replace('/api/downloadTransactionLogs?userType=adminEach&startDate=' +
				startDate + '&endDate=' + endDate + '&opr=&mac=' + macParam)
		}
	}


	events.currentBalanceClicked();
	events.totalSalesClicked();
	events.totalEarningsClicked();
	events.totalTransClicked();
	events.totalOprBalanceClicked();
	events.totalRemainingLoadClicked();
	events.totalVendoLoadClicked();
}]);

reports.controller('AdminReportsControllerOpr', ['$scope', '$http', '$filter', 'events',
'func', 'charts', '$location', function($scope, $http, $filter, events, func, charts, $location){
	$scope.userType = 'admin';
	$scope.currentDate = func.getCurrentDate();
	$scope.prevDate = func.getLastDate(10);
	$('.rp-start-date').val($scope.prevDate);
	$('.rp-end-date').val($scope.currentDate);
	operator = $location.search().opr;
	$('.rep').append('Reference Operator: ' + operator);

	$scope.init = function(startDate, endDate){
		$('.main').hide().fadeIn();
		$('.rp-totalTransactions-cont').fadeIn();
		$('.rp-totalOprBalance-cont, .rp-totalRemLoad-cont').hide();
		$('.rp-infoBox5, .rp-selectOpr-cont').hide();

		func.oprMainDetails('currentBalance', startDate, endDate, operator).then(function(response){
			$scope.currentBalance = response.data[0]['balance'];
			$('.rp-details-table, .rp-transactionLogs-table').tableHeadFixer();
		});
		func.oprMainDetails('totalSalesEarnings', startDate, endDate, operator).then(function(response){
			$scope.totalSales = response.data[0]['sales'];
			$scope.totalEarnings = response.data[0]['earnings'];
		});
		func.oprMainDetails('totalTransAll', startDate, endDate, operator).then(function(response){
			$scope.totalTransAll = response.data[0]['transactions'];
		});
		func.oprMainDetails('totalTransSuccess', startDate, endDate, operator).then(function(response){
			$scope.totalTransSuccess = response.data[0]['transactions'];
		});
		func.oprMainDetails('totalTransFailed', startDate, endDate, operator).then(function(response){
			$scope.totalTransFailed = response.data[0]['transactions'];
		});
		func.oprMainDetails('totalRemainingLoad', startDate, endDate, operator).then(function(response){
			$scope.totalRemainingLoad = response.data[0]['balance'];
		});
		func.oprMainDetails('countMacWithBalance', startDate, endDate, operator).then(function(response){
			$scope.countMacWithBalance = response.data[0]['withBalance'];
		});
		func.oprMainDetails('datedTopupDeduction', startDate, endDate, operator).then(function(response){
			$scope.totalDeduction = response.data.reduce((x, y) => x + y.deduction, 0);
		});
		func.oprMainDetails('datedTransAll', startDate, endDate, operator).then(function(response){
			arr1 = response.data;
			func.oprMainDetails('datedTransSuccess', startDate, endDate, operator).then(function(response){
				arr2 = response.data;
				func.oprMainDetails('datedTransFailed', startDate, endDate, operator).then(function(response){
					arr3 = response.data;
					charts.totalTransChart(arr1, arr2, arr3);
				});
			});
		});
		func.oprMainDetails('transactionLogs', startDate, endDate, operator).then(function(response){
			$scope.transactionLogs = response.data;
		});

		$scope.datePicker = function(){
			start = $('.rp-start-date').val();
			end = $('.rp-end-date').val();
			if(start == '' || end == ''){
				alert('Complete Fields'); 
				return 0;
			}
			$scope.init(start, end);
		}
		$scope.currentBalanceChart = function(){
			func.oprMainDetails('datedCurrentBalance', startDate, endDate, operator).then(function(response){
				charts.currentBalanceChart(response.data);
			});
		}
		$scope.totalSalesChart = function(){
			func.oprMainDetails('datedSalesEarnings', startDate, endDate, operator).then(function(response){
				charts.totalSalesChart(response.data);
			});
		}
		$scope.totalEarningsChart = function(){
			func.oprMainDetails('datedSalesEarnings', startDate, endDate, operator).then(function(response){
				charts.totalEarningsChart(response.data);
			});
		}
		$scope.totalRemainingLoadClicked = function(){
			func.oprMainDetails('macsRemainingLoad', startDate, endDate, operator).then(function(response){
				$scope.macsRemainingLoad = response.data;
				$scope.totalLoad = response.data.reduce((x, y) => x + parseFloat(y['balance']), 0);	
			});
		}
		$scope.totalVendoLoadClicked = function(){
			func.oprMainDetails('macsWithLoad', startDate, endDate, operator).then(function(response){
				$scope.macsRemainingLoad = response.data;
			});
		}
		$scope.downloadTransactionLogs = function(){
			window.location.replace('/api/downloadTransactionLogs?userType=operator&startDate=' +
				startDate + '&endDate=' + endDate + '&opr=' + operator + '&mac=')
		}
	}
	
	events.currentBalanceClicked();
	events.totalSalesClicked();
	events.totalEarningsClicked();
	events.totalTransClicked();
	events.totalOprBalanceClicked();
	events.totalRemainingLoadClicked();
	events.totalVendoLoadClicked();
}]);

reports.controller('OperatorReportsController', ['$scope', '$http', '$filter', 'events',
'func', 'charts', function($scope, $http, $filter, events, func, charts){
	$scope.userType = 'operator';
	operator = $('.logged-user').text();
	$scope.hideAdminBalance = true, $scope.hideAdmProdCost = true, $scope.hideAdmPubPrice = true,
	$scope.hideAdmProCostEarning = true, $scope.hideAdmRev = true, $scope.hideOwner = true;
	$scope.currentDate = func.getCurrentDate();
	$scope.prevDate = func.getLastDate(10);
	$('.rp-start-date').val($scope.prevDate);
	$('.rp-end-date').val($scope.currentDate);

	$scope.init = function(startDate, endDate){
		$('.main').hide().fadeIn();
		$('.rp-totalTransactions-cont').fadeIn();
		$('.rp-currentWalletBalance-cont, .rp-totalSales-cont, .rp-totalEarnings-cont,' + 
			  '.rp-totalOprBalance-cont, .rp-totalRemLoad-cont').hide();
		$('.rp-infoBox5, .rp-selectOpr-cont').hide();

		// func.oprMainDetails('currentBalance', startDate, endDate, operator).then(function(response){
		// 	$scope.currentBalance = response.data[0]['balance'];
		// 	$('.rp-details-table, .rp-transactionLogs-table').tableHeadFixer();
		// });
		func.oprMainDetails('totalSalesEarnings', startDate, endDate, operator).then(function(response){
			$scope.totalSales = response.data[0]['sales'];
			$scope.totalEarnings = response.data[0]['earnings'];
			$('.rp-details-table, .rp-transactionLogs-table').tableHeadFixer();
		});
		func.oprMainDetails('totalTransAll', startDate, endDate, operator).then(function(response){
			$scope.totalTransAll = response.data[0]['transactions'];
		});
		func.oprMainDetails('totalTransSuccess', startDate, endDate, operator).then(function(response){
			$scope.totalTransSuccess = response.data[0]['transactions'];
		});
		func.oprMainDetails('totalTransFailed', startDate, endDate, operator).then(function(response){
			$scope.totalTransFailed = response.data[0]['transactions'];
		});
		func.oprMainDetails('totalRemainingLoad', startDate, endDate, operator).then(function(response){
			$scope.totalRemainingLoad = response.data[0]['balance'];
		});
		func.oprMainDetails('countMacWithBalance', startDate, endDate, operator).then(function(response){
			$scope.countMacWithBalance = response.data[0]['withBalance'];
		});
		func.oprMainDetails('datedTopupDeduction', startDate, endDate, operator).then(function(response){
			$scope.totalDeduction = response.data.reduce((x, y) => x + y.deduction, 0);
		});
		func.oprMainDetails('datedTransAll', startDate, endDate, operator).then(function(response){
			arr1 = response.data;
			func.oprMainDetails('datedTransSuccess', startDate, endDate, operator).then(function(response){
				arr2 = response.data;
				func.oprMainDetails('datedTransFailed', startDate, endDate, operator).then(function(response){
					arr3 = response.data;
					charts.totalTransChart(arr1, arr2, arr3);
				});
			});
		});
		func.oprMainDetails('transactionLogs', startDate, endDate, operator).then(function(response){
			$scope.transactionLogs = response.data;
		});

		$scope.datePicker = function(){
			start = $('.rp-start-date').val();
			end = $('.rp-end-date').val();
			if(start == '' || end == ''){
				alert('Complete Fields'); 
				return 0;
			}
			$scope.init(start, end);
		}
		$scope.currentBalanceChart = function(){
			func.oprMainDetails('datedCurrentBalance', startDate, endDate, operator).then(function(response){
				charts.currentBalanceChart(response.data);
			});
		}
		$scope.totalSalesChart = function(){
			func.oprMainDetails('datedSalesEarnings', startDate, endDate, operator).then(function(response){
				charts.totalSalesChart(response.data);
			});
		}
		$scope.totalEarningsChart = function(){
			func.oprMainDetails('datedSalesEarnings', startDate, endDate, operator).then(function(response){
				charts.totalEarningsChart(response.data);
			});
		}
		$scope.totalRemainingLoadClicked = function(){
			func.oprMainDetails('macsRemainingLoad', startDate, endDate, operator).then(function(response){
				$scope.macsRemainingLoad = response.data;
				$scope.totalLoad = response.data.reduce((x, y) => x + parseFloat(y['balance']), 0);	
			});
		}
		$scope.totalVendoLoadClicked = function(){
			func.oprMainDetails('macsWithLoad', startDate, endDate, operator).then(function(response){
				$scope.macsRemainingLoad = response.data;
			});
		}
		$scope.downloadTransactionLogs = function(){
			window.location.replace('/api/downloadTransactionLogs?userType=operator&startDate=' +
				startDate + '&endDate=' + endDate + '&opr=' + operator + '&mac=')
		}
	}
	
	events.currentBalanceClicked();
	events.totalSalesClicked();
	events.totalEarningsClicked();
	events.totalTransClicked();
	events.totalOprBalanceClicked();
	events.totalRemainingLoadClicked();
	events.totalVendoLoadClicked();
}]);

reports.controller('OperatorReportsControllerEach', ['$scope', '$http', '$filter', 'events',
'func', 'charts', '$location', function($scope, $http, $filter, events, func, charts, $location){
	$scope.userType = 'operator';
	operator = $('.logged-user').text();
	$scope.hideAdminBalance = true, $scope.hideAdmProdCost = true, $scope.hideAdmPubPrice = true,
	$scope.hideAdmProCostEarning = true, $scope.hideAdmRev = true, $scope.hideOwner = true;
	$scope.currentDate = func.getCurrentDate();
	$scope.prevDate = func.getLastDate(10);
	$('.rp-start-date').val($scope.prevDate);
	$('.rp-end-date').val($scope.currentDate);
	macParam = $location.search().mac;
	$('.rep').append('Reference MAC Address: ' + macParam);

	$scope.init = function(startDate, endDate){
		$('.main').hide().fadeIn();
		$('.rp-totalTransactions-cont').fadeIn();
		$('.rp-currentWalletBalance-cont, .rp-totalSales-cont, .rp-totalEarnings-cont,' + 
			  '.rp-totalOprBalance-cont, .rp-totalRemLoad-cont').hide();
		$('.rp-infoBox5, .rp-infoBox6, .rp-infoBox7, .rp-selectOpr-cont').hide();

		// func.oprMainDetailsEach('currentBalance', startDate, endDate, operator, macParam).then(function(response){
		// 	$scope.currentBalance = response.data[0]['balance'];
		// 	$('.rp-details-table, .rp-transactionLogs-table').tableHeadFixer();
		// });
		func.oprMainDetailsEach('totalSalesEarnings', startDate, endDate, operator, macParam).then(function(response){
			$scope.totalSales = response.data[0]['sales'];
			$scope.totalEarnings = response.data[0]['earnings'];
			$('.rp-details-table, .rp-transactionLogs-table').tableHeadFixer();
		});
		func.oprMainDetailsEach('totalTransAll', startDate, endDate, operator, macParam).then(function(response){
			$scope.totalTransAll = response.data[0]['transactions'];
		});
		func.oprMainDetailsEach('totalTransSuccess', startDate, endDate, operator, macParam).then(function(response){
			$scope.totalTransSuccess = response.data[0]['transactions'];
		});
		func.oprMainDetailsEach('totalTransFailed', startDate, endDate, operator, macParam).then(function(response){
			$scope.totalTransFailed = response.data[0]['transactions'];
		});
		func.oprMainDetailsEach('datedTopupDeduction', startDate, endDate, operator, macParam).then(function(response){
			$scope.totalDeduction = response.data.reduce((x, y) => x + y.deduction, 0);
		});
		func.oprMainDetailsEach('datedTransAll', startDate, endDate, operator, macParam).then(function(response){
			arr1 = response.data;
			func.oprMainDetailsEach('datedTransSuccess', startDate, endDate, operator, macParam).then(function(response){
				arr2 = response.data;
				func.oprMainDetailsEach('datedTransFailed', startDate, endDate, operator, macParam).then(function(response){
					arr3 = response.data;
					charts.totalTransChart(arr1, arr2, arr3);
				});
			});
		});
		func.oprMainDetailsEach('transactionLogs', startDate, endDate, operator, macParam).then(function(response){
			$scope.transactionLogs = response.data;
		});

		$scope.datePicker = function(){
			start = $('.rp-start-date').val();
			end = $('.rp-end-date').val();
			if(start == '' || end == ''){
				alert('Complete Fields'); 
				return 0;
			}
			$scope.init(start, end);
		}
		$scope.currentBalanceChart = function(){
			func.oprMainDetailsEach('datedCurrentBalance', startDate, endDate, operator, macParam).then(function(response){
				charts.currentBalanceChart(response.data);
			});
		}
		$scope.totalSalesChart = function(){
			func.oprMainDetailsEach('datedSalesEarnings', startDate, endDate, operator, macParam).then(function(response){
				charts.totalSalesChart(response.data);
			});
		}
		$scope.totalEarningsChart = function(){
			func.oprMainDetailsEach('datedSalesEarnings', startDate, endDate, operator, macParam).then(function(response){
				charts.totalEarningsChart(response.data);
			});
		}
		$scope.downloadTransactionLogs = function(){
			window.location.replace('/api/downloadTransactionLogs?userType=operatorEach&startDate=' +
				startDate + '&endDate=' + endDate + '&opr=' + operator + '&mac=' + macParam)
		}
	}
	
	events.currentBalanceClicked();
	events.totalSalesClicked();
	events.totalEarningsClicked();
	events.totalTransClicked();
	events.totalOprBalanceClicked();
	events.totalRemainingLoadClicked();
	events.totalVendoLoadClicked();
}]);





// function counter(){
	// 	$('.count1').each(function(){
	// 		$(this).prop('Counter', 0).animate({
	// 			Counter : $(this).text()
	// 		},
	// 			{
	// 		        duration: 4000,
	// 		        easing: 'swing',
	// 		        step: function (now) {
	// 		           $(this).text(this.Counter.toFixed(2));
	// 		    }
	//         });
	// 	});
	// }
	// $('body').on('click', '.reports-xx', function(){
	// 	xx = $('.my-datepicker').val();
	// 	alert(xx);
	// })