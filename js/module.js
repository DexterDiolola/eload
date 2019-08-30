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


	.when('/eload/home', {
		templateUrl : path_to_views + 'all-dashboard.html',
		controller : 'OperatorHomeController'
	})
	.when('/eload/load_wallet', {
		templateUrl : path_to_views + 'topup-operator.html',
		controller : 'OperatorTopupController'
	})
	.when('/eload/load_wallet/macs', {
		templateUrl : path_to_views + 'topup-operator.html',
		controller : 'OperatorTopupControllerEach'
	})
	.when('/eload/products_services', {
		templateUrl : path_to_views + 'all-products-services.html',
		controller : 'OperatorProdServController'
	})
	.when('/eload/news_ads', {
		templateUrl : path_to_views + 'all-news-ads.html',
		controller : 'OperatorNewsAdsController'
	})
	.when('/eload/settings', {
		templateUrl : path_to_views + 'all-settings.html',
		controller : 'OperatorSettingsController'
	})
	.when('/eload/reports', {
		templateUrl : path_to_views + 'all-reports.html',
		controller : 'OperatorReportsController'
	})
	.when('/eload/reports/macs', {
		templateUrl : path_to_views + 'all-reports.html',
		controller : 'OperatorReportsControllerEach'
	})

}]);