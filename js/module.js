var reports = angular.module('reports', ['ngRoute']);

var path_to_views = '/static/views/'

reports.config(['$routeProvider', '$locationProvider',
				function($routeProvider, $locationProvider){

	$locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);
	$routeProvider

	.when('/admin/home', {
		templateUrl : path_to_views + 'all-dashboard.html',
		controller : 'AdminHomeController'
	})
	.when('/admin/balance',{
		templateUrl : path_to_views + 'all-balance.html',
		controller : 'AdminBalanceController'
	})
	.when('/admin/balance/macs',{
		templateUrl : path_to_views + 'all-balance.html',
		controller : 'AdminBalanceControllerEach'
	})
	.when('/admin/earnings', {
		templateUrl : path_to_views + 'all-earnings.html',
		controller : 'AdminEarningsController'
	})
	.when('/admin/earnings/macs', {
		templateUrl : path_to_views + 'all-earnings.html',
		controller : 'AdminEarningsControllerEach'
	})
	.when('/admin/transactions', {
		templateUrl : path_to_views + 'all-transactions.html',
		controller : 'AdminTransactionsController'
	})
	.when('/admin/transactions/macs', {
		templateUrl : path_to_views + 'all-transactions.html',
		controller : 'AdminTransactionsControllerEach'
	})
	.when('/admin/administration', {
		templateUrl : path_to_views + 'administration.html',
		controller : 'AdministrationController'
	})
	.when('/admin/load_wallet', {
		templateUrl : path_to_views + 'topup.html',
		controller : 'AdminTopupController'
	})
	.when('/admin/load_wallet/macs', {
		templateUrl : path_to_views + 'topup.html',
		controller : 'AdminTopupControllerEach'
	})
	.when('/admin/products_services', {
		templateUrl : path_to_views + 'all-products-services.html',
		controller : 'AdminProdServController'
	})
	.when('/admin/news_ads', {
		templateUrl : path_to_views + 'all-news-ads.html',
		controller : 'AdminNewsAdsController'
	})
	.when('/admin/settings', {
		templateUrl : path_to_views + 'all-settings.html',
		controller : 'AdminSettingsController'
	})
	.when('/admin/reports', {
		templateUrl : path_to_views + 'all-reports.html',
		controller : 'AdminReportsController'
	})
	.when('/admin/reports/macs', {
		templateUrl : path_to_views + 'all-reports.html',
		controller : 'AdminReportsControllerEach'
	})
	.when('/admin/reports/operators', {
		templateUrl : path_to_views + 'all-reports.html',
		controller : 'AdminReportsControllerOpr'
	})


	.when('/operator/home', {
		templateUrl : path_to_views + 'all-dashboard.html',
		controller : 'OperatorHomeController'
	})
	.when('/operator/balance',{
		templateUrl : path_to_views + 'all-balance.html',
		controller : 'OperatorBalanceController'
	})
	.when('/operator/balance/macs',{
		templateUrl : path_to_views + 'all-balance.html',
		controller : 'OperatorBalanceControllerEach'
	})
	.when('/operator/earnings', {
		templateUrl : path_to_views + 'all-earnings.html',
		controller : 'OperatorEarningsController'
	})
	.when('/operator/earnings/macs', {
		templateUrl : path_to_views + 'all-earnings.html',
		controller : 'OperatorEarningsControllerEach'
	})
	.when('/operator/transactions', {
		templateUrl : path_to_views + 'all-transactions.html',
		controller : 'OperatorTransactionsController'
	})
	.when('/operator/transactions/macs', {
		templateUrl : path_to_views + 'all-transactions.html',
		controller : 'OperatorTransactionsControllerEach'
	})
	.when('/operator/load_wallet', {
		templateUrl : path_to_views + 'topup-operator.html',
		controller : 'OperatorTopupController'
	})
	.when('/operator/load_wallet/macs', {
		templateUrl : path_to_views + 'topup-operator.html',
		controller : 'OperatorTopupControllerEach'
	})
	.when('/operator/products_services', {
		templateUrl : path_to_views + 'all-products-services.html',
		controller : 'OperatorProdServController'
	})
	.when('/operator/news_ads', {
		templateUrl : path_to_views + 'all-news-ads.html',
		controller : 'OperatorNewsAdsController'
	})
	.when('/operator/settings', {
		templateUrl : path_to_views + 'all-settings.html',
		controller : 'OperatorSettingsController'
	})
	.when('/operator/reports', {
		templateUrl : path_to_views + 'all-reports.html',
		controller : 'OperatorReportsController'
	})
	.when('/operator/reports/macs', {
		templateUrl : path_to_views + 'all-reports.html',
		controller : 'OperatorReportsControllerEach'
	})







	.when('/partner/home', {
		templateUrl : path_to_views + 'all-dashboard.html',
		controller : 'PartnerHomeController'
	})
	.when('/partner/balance',{
		templateUrl : path_to_views + 'all-balance.html',
		controller : 'PartnerBalanceController'
	})
	.when('/partner/balance/macs',{
		templateUrl : path_to_views + 'all-balance.html',
		controller : 'PartnerBalanceControllerEach'
	})
	.when('/partner/earnings', {
		templateUrl : path_to_views + 'all-earnings.html',
		controller : 'PartnerEarningsController'
	})
	.when('/partner/earnings/macs', {
		templateUrl : path_to_views + 'all-earnings.html',
		controller : 'PartnerEarningsControllerEach'
	})
	.when('/partner/transactions', {
		templateUrl : path_to_views + 'all-transactions.html',
		controller : 'PartnerTransactionsController'
	})
	.when('/partner/transactions/macs', {
		templateUrl : path_to_views + 'all-transactions.html',
		controller : 'PartnerTransactionsControllerEach'
	})
	.when('/partner/settings', {
		templateUrl : path_to_views + 'all-settings.html',
		controller : 'PartnerSettingsController'
	})


}]);