var app = angular.module('paperless.reports', ['ngMaterial','ui.tinymce','ngSanitize'])
.config(function($sceProvider) {
  // Completely disable SCE.  For demonstration purposes only!
  // Do not use in new projects.
  $sceProvider.enabled(false);
})
.controller('reports.main', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
	var t = this;
	t.name = "Paperless Reports"

	$scope.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	}; 
 
}])
.controller('reports.editor', ['$scope','$interpolate', function($scope,$interpolate){
	var t = this;

	t.options = [
		{title: "First Name", key: "fname", sample: "Jaco"},
		{title: "Last Name", key: "lname", sample: "Bezuidenhout"},
		{title: "Conditions", key: "conditions", sample: "<p>Headache</p><p>Blisters</p><p>Pain</p>"},
	];

	t.sample = {};
	for (var i = 0; i < t.options.length; i++) {
		t.sample[t.options[i].key] = t.options[i].sample;		
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
		t.body = $interpolate($scope.tinymceModel)(t.sample);
	}	
	t.insertText = function(text) {
		t.editor.insertContent(text);
		// t.body = $interpolate($scope.tinymceModel)($scope);

	}
}]);