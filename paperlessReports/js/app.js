var app = angular.module('paperless.reports', ['ngMaterial','ui.tinymce','ngSanitize','ngRoute'])
.config(['$sceProvider','$routeProvider', function($sceProvider,$routeProvider) {
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
	t.reports = reports().get();
}])
.controller('reports.editor', ['$scope','$routeParams','$interpolate','$location', function($scope,$routeParams,$interpolate,$location){
	var t = this;
	var MAX_DEPTH = 10;
 	t.params = $routeParams;

	t.sample = {};

	t.models = [
		{model: "Debtor", description: "Debtor Fields", options: [{title: "First Name", key: "fname", value: "{{fname}}", sample: "Jaco"},{title: "Last Name", key: "lname", value: "{{lname}}", sample: "Bezuidenhout"},{title: "Patients", key: "patients", value: "{{patients}}", sample: "<ul><li>Jaco Bez</li><li>John Dough</li><li>Sannie Botha</li></ul>"}]},
		{model: "Patient", description: "Patient Fields", options: [{title: "First Name", key: "fname", value: "{{fname}}", sample: "Jaco"},{title: "Last Name", key: "lname", value: "{{lname}}", sample: "Bezuidenhout"},{title: "Conditions", key: "conditions", value: "{{conditions}}", sample: "<p>Headache</p><p>Blisters</p><p>Pain</p>"}]},
		{model: "Other", description: "Other Fields", options: []},
		{model: "None", description: "No Model Selected", options: []}
	]

 	if (t.params.reportId == -1)
 	{
 		//new
 	}
	else
	{
		if (t.params.reportId)
		{	
			t.report = reports({___id:t.params.reportId}).get()[0];
			t.title = t.report.title;
			t.editorBody = t.report.body;
			t.body = t.report.sample;
			for (var i = 0; i < t.models.length; i++) {
				if (t.models[i].model == t.report.model)
					$scope.selectedItem = t.models[i];
			};
		}
	}

	t.commons = [
		{title: "Signature", key: "signature", value: "{{signature}}", sample: "<p>Kind regards</p><b><p>Dr. John Dough</p></b>", model:["Debtor","Patient","Other"]},
		{title: "Greeting", key: "greeting", value: "{{greeting}}", sample: "Dear {{fname}} {{lname}},", model:["Debtor","Patient"]},
		{title: "Contact Info", key: "contactInfo", value: "{{contactInfo}}", sample: "<table><tr><td>Tel:</td><td>012 345 6789</td></tr><tr><td>Cel:</td><td>082 345 6789</td></tr></table>", model:["Debtor","Patient","Other"]},
		{title: "Template", value: "{{greeting}}<br/><br/>{{signature}}{{contactInfo}}", model:["Debtor","Patient"]}
	];


	$scope.tinymceModel = "";
	$scope.selectedItem = {model: "None", description: "No Model Selected", options: []};
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
	
    t.print = function()
    {
    	var opts = {
	        printMode: 'popup',
	        pageTitle: 'Paperless Reports - ' + t.title,
	        templateString: ''
    	};
		var PE = PrintElement();
		PE.printHtml( t.body, opts );
    }	

    t.save = function()
    {
    	if (t.params.reportId == -1)
    		console.log(reports.insert({title:t.title,sample:t.body,body:t.editorBody,model:($scope.selectedItem.model||"")}).get());
    	else
    		console.log(reports({___id:t.params.reportId}).update({title:t.title,sample:t.body,body:t.editorBody,model:($scope.selectedItem.model||"")}).get());
    	$location.url("/reports");
    }

    t.cancel = function()
    {
    	$location.url("/reports");
    }

    t.delete = function()
    {
    	reports({___id:t.params.reportId}).remove();
    	$location.url("/reports");
    }

	t.updateOptions = function() {
		if ($scope.selectedItem)
		{
			t.sample = {};
			for (var i = 0; i < $scope.selectedItem.options.length; i++) {
				if ($scope.selectedItem.options[i].key)
					t.sample[$scope.selectedItem.options[i].key] = $scope.selectedItem.options[i].sample;		
			};
			for (var i = 0; i < t.commons.length; i++) {
				if (t.commons[i].key)
				{
					if (t.commons[i].model)
					{
						if (t.commons[i].model.indexOf($scope.selectedItem.model) >= 0)
							t.sample[t.commons[i].key] = t.commons[i].sample;		
					}
					else
					{
						t.sample[t.commons[i].key] = t.commons[i].sample;		
					}
				}
			};
		}
	}

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