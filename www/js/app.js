// Initialize app
var App = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var serviceURL = 'http://cbhllc.net/api/v1/';
var storage = window.localStorage;
var siteURL = 'http://cbhllc.net';

// Add view
var mainView =  App.addView('.view-main', {
    dynamicNavbar: true
});

if(isLoggedIn() !== true) {
	//mainView.router.load({pageName: 'dashboard'});
	mainView.router.loadPage('welcome.html');
}
else {
	displayHomepage();
	displayUserNav();
	$('.toolbar').show();
}

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
	//Push...
	var push = PushNotification.init({
		"android": {
			"senderID": "116213951273"
		},
		"browser": {},
		"ios": {
			"sound": true,
			"vibration": true,
			"badge": true
		},
		"windows": {}
	});
	console.log('after init');

	push.on('registration', function(data) {
		console.log('registration event: ' + data.registrationId);

		var oldRegId = localStorage.getItem('registrationId');
		if (oldRegId !== data.registrationId) {
			// Save new registration ID
			localStorage.setItem('registrationId', data.registrationId);
			// Post registrationId to your app server as the value has changed
		}

		var parentElement = document.getElementById('registration');
		var listeningElement = parentElement.querySelector('.waiting');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');
	});

	push.on('error', function(e) {
		console.log("push error = " + e.message);
	});

	push.on('notification', function(data) {
		console.log('notification event');
		navigator.notification.alert(
			data.message,         // message
			null,                 // callback
			data.title,           // title
			'Ok'                  // buttonName
		);
   });
});


$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;
	
	if (page.name === 'index') {
        
    }
	
    if (page.name === 'welcome') {
        
    }
});

 

/*
App.onPageInit('index', function (page) {
    // Do something here for "about" page
	App.alert('Here comes index page');
})

$$(document).on('pageInit', '.page[data-page="index"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
     App.alert('Here comes Home page');
});
*/


function isLoggedIn() {
	//var logged_in = getStorage('dllogin');
	//console.log(getStorage('user_id'));
	if(getStorage('applogin') !== '' && getStorage('applogin') !== null && getStorage('user_id') != null) {
		return true;
	}
	return false;	
}

function setStorage(name, value) {
	storage.setItem(name, value);
}

function getStorage(name) {
	var val = storage.getItem(name);
	return val;
}

function deleteStorage(name) {
	//alert("DELETED");
	storage.removeItem(name);
	if(name === 'applogin') {
		storage.removeItem('id');
		storage.removeItem('user_id');
		storage.removeItem('first_name');
		storage.removeItem('last_name');
		storage.removeItem('email');
	}
}
