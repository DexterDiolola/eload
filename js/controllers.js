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
	function Get_Periodic_Transactions_All(userType, user, period){
		return $http({
			method : 'GET',
			url : '/api/get-periodic-transactions-all?userType=' + userType + '&user=' + user +
				  '&period=' + period 
		})
	}
	function Get_Periodic_Transactions_Success(userType, user, period){
		return $http({
			method : 'GET',
			url : '/api/get-periodic-transactions-success?userType=' + userType + '&user=' + user +
				  '&period=' + period 
		})
	}
	function Get_Periodic_Transactions_Failed(userType, user, period){
		return $http({
			method : 'GET',
			url : '/api/get-periodic-transactions-failed?userType=' + userType + '&user=' + user +
				  '&period=' + period 
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


		Get_Periodic_Transactions_All : Get_Periodic_Transactions_All,
		Get_Periodic_Transactions_Success : Get_Periodic_Transactions_Success,
		Get_Periodic_Transactions_Failed : Get_Periodic_Transactions_Failed,
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
	urlPath = window.location.pathname;
	mainPath = urlPath.split('/');
	mainPath = mainPath[1];
	form = "<form action = '/" + mainPath + "/upload_prices' method = 'POST' " +
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
	upload_status != undefined ? (alert(upload_status.split('%20').join(' ')), window.location.replace('/' + mainPath + '/products_services')) : 0
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