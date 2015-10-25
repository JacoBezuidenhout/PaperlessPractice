var app = angular.module('paperless.reports', ['ngMaterial','ui.tinymce','ngSanitize','ngRoute'])
.config(['$sceProvider','$routeProvider',
  function($sceProvider,$routeProvider) {
  	$sceProvider.enabled(false);
    $routeProvider.
      when('/reports', {
        templateUrl: 'js/partials/reports.html',
        controller: 'reports.all'
      }).
      when('/reports/:reportId', {
        templateUrl: 'js/partials/report.html',
        controller: 'reports.editor'
      }).
      otherwise({
        redirectTo: '/reports'
      });
  }])
.controller('reports.main', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
	var t = this;
	t.name = "Paperless Reports"

	$scope.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	}; 
 
}])
.controller('reports.all', ['$scope', '$routeParams', function($scope, $routeParams, $mdSidenav){
	var t = this;
	t.reports = [];
}])
.controller('reports.editor', ['$scope','$routeParams','$interpolate', function($scope,$routeParams,$interpolate){
	var t = this;
	var MAX_DEPTH = 10;
 	t.params = $routeParams;

 	if (t.params.reportId == -1)
 	{

 	}

	t.options = [
		{title: "First Name", key: "fname", value: "{{fname}}", sample: "Jaco"},
		{title: "Last Name", key: "lname", value: "{{lname}}", sample: "Bezuidenhout"},
		{title: "Conditions", key: "conditions", value: "{{conditions}}", sample: "<p>Headache</p><p>Blisters</p><p>Pain</p>"}
	];

	t.commons = [
		{title: "Signature", key: "signature", value: "{{signature}}", sample: "<p>Kind regards</p><b><p>Dr. John Dough</p></b>"},
		{title: "Greeting", key: "greeting", value: "{{greeting}}", sample: "Dear {{fname}} {{lname}},"},
		{title: "Contact Info", key: "contactInfo", value: "{{contactInfo}}", sample: "<table><tr><td>Tel:</td><td>012 345 6789</td></tr><tr><td>Cel:</td><td>082 345 6789</td></tr></table>"},
		{title: "Template", value: "{{greeting}}<br/><br/>{{signature}}{{contactInfo}}"}
	];

	t.sample = {};
	for (var i = 0; i < t.options.length; i++) {
		if (t.options[i].key)
			t.sample[t.options[i].key] = t.options[i].sample;		
	};
	for (var i = 0; i < t.commons.length; i++) {
		if (t.commons[i].key)
			t.sample[t.commons[i].key] = t.commons[i].sample;		
	};

	$scope.tinymceModel = "";
	t.tinymceOptions = {
	    onChange: function(e) {
	    	console.log(e);
	    },
	    setup: function(editor) {
        	t.editor = editor; //Save editor to var or execCommand here.
    	},
	    inline: false,
	    plugins : 'advlist autolink link image lists charmap print preview',
	    skin: 'lightgray',
	    theme : 'modern'
	};
    t.reportBody = "";
	
	t.update = function(text) {
		t.body = $interpolate(t.editorBody)(t.sample);
		var counter = 0;
		while (t.body.indexOf("{{") > 0 && t.body.indexOf("}}") > 0 && counter < MAX_DEPTH)
		{
			t.body = $interpolate(t.body)(t.sample);
			console.log(t.body);
			counter++;
		}
	}	
	t.insertText = function(text) {
		t.editor.insertContent(text);
		// t.body = $interpolate($scope.tinymceModel)($scope);

	}
}]);