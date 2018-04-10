'use strict';

(function() {
	var common = {
		serviceURL: 'http://cbhllc.net/api/v1/',
		siteURL: 'http://cbhllc.net',
		storage: window.localStorage,
		initialize: function() {
			this.bindEvents();
		},
		bindEvents: function() {
			document.addEventListener('deviceready', this.onDeviceReady, false);
		},
		onDeviceReady: function() {
			common.setupPush();
			displayHomePage();
		},
		setupPush: function() {
			console.log('calling push init');
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
			//console.log('after init');

			push.on('registration', function(data) {
				console.log('registration event: ' + data.registrationId);
				var oldRegId = localStorage.getItem('registrationId');
				if (oldRegId !== data.registrationId) {
					// Save new registration ID
					localStorage.setItem('registrationId', data.registrationId);
					// Post registrationId to your app server as the value has changed
				}
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
		}
	};
	
	//var storage.app_user = 1;
    window.common = common;
	
	/* Document Ready -- Should Mimic DeviceReady */
	$(document).ready( function() {
		window.isphone = false;
	    if(document.URL.indexOf("http://") === -1 
	        && document.URL.indexOf("https://") === -1
	        && document.URL.indexOf("xampp") === -1
	        && document.URL.indexOf("phonegap") === -1
		) {
	        window.isphone = true;
	    }
		//alert(window.isphone);
	    if(window.isphone !== true) {
	    	//common.storage.removeItem("app_user");
			displayHomePage();
		}
		else {
		
		}
	});
	
	/* Search Box -- Top Nav */
	var submitIcon = $('.searchbox-icon');
	var inputBox = $('.searchbox-input');
	var searchBox = $('.searchbox');
	var isOpen = false;
	submitIcon.click(function(){
		if(isOpen == false){
			searchBox.addClass('searchbox-open');
			inputBox.focus();
			isOpen = true;
			submitIcon.addClass('open');
			$('li.nav-status-btn').css('margin-right', '5px');
		} else {
			searchBox.removeClass('searchbox-open');
			inputBox.focusout();
			isOpen = false;
			submitIcon.removeClass('open');
			$('li.nav-status-btn').css('margin-right', '-15px');
		}
	});  
	 
	submitIcon.mouseup(function(){
		return false;
	});
	
	searchBox.mouseup(function(){
		return false;
	});
	
	$(document).mouseup(function(){
		if(isOpen == true){
			submitIcon.click();
			submitIcon.removeClass('open');
		}
		
	});
	
	/* Status Click */
	$(document).on('focus', '#statusFrm input[name="status"]', function(){
		$('#status-extra').show();
	});
	
	/* Status Photo */
	$(document).on('click', '.postPhoto', function(){
		$('#status-photo').click();
	});

	/* Nav Menu */
	$(document).on('click', '.nav-menu-button', function() {
		if($('#user-nav').hasClass('open')) {
			$('#user-nav').removeClass('open');
			$('#user-nav').animate({
				'right' : '-100%',
			}, 200);
		}
		else {
			$('#user-nav').addClass('open');
			$('#user-nav').animate({
				'right' : '0',
			}, 200);
		}
	});
	
	$(document).on('click', '#user-nav-close', function() {
		$('#user-nav').removeClass('open');
		$('#user-nav').animate({
			'right' : '-100%',
		}, 200);
	});
	
	/* Nav Alerts */
	$(document).on('click', '.nav-alerts-button', function() {
		if($('#user-alerts').hasClass('open')) {
			$('#user-alerts').removeClass('open');
			$('#user-alerts').animate({
				'right' : '-100%',
			}, 200);
		}
		else {
			$('#user-alerts').addClass('open');
			$('#user-alerts').animate({
				'right' : '0',
			}, 200);
		}
	});
	
	$(document).on('click', '#user-alerts-close', function() {
		$('#user-alerts').removeClass('open');
		$('#user-alerts').animate({
			'right' : '-100%',
		}, 200);
	});
	
	
	/* Register Button Click */
	$(document).on('click', '.registerBtn', function() {
		userRegistration();
	});
	
	/* Login Button Click */
	$(document).on('click', '.loginBtn', function() {
		userLogin();
	});
	
	/* Init of homepage */
	$(document).on("pageinit", "#home",function(event){
		//console.log('about to show page...');
	});
	
	/* Handle Initial Screen, by checking login */
	function displayHomePage() {
//alert(common.storage.getItem("app_user"));
//alert(document.location.href.match(/[^\/]+$/)[0]);
		var user = common.storage.getItem("app_user");
		if(user === null) {
			$('#global-header').hide();
			loadLoginScreen();
			return false;
		}
		else {
			loadHomeScreen();
			loadUserNav();
			loadUserAlerts();
			return true;
		}
	}
	
	/* Load Login Screen */
	function loadLoginScreen() {
		$.mobile.navigate("login.html", {transition: "slide"});
	}
	
	/* Load Home Screen */
	
	function loadHomeScreen() {
		$('#global-header').show();
		var user = common.storage.getItem("app_user");
		var registrationId = common.storage.getItem("registrationId");
		if(registrationId !== '' && registrationId !== null) {
			setRegistrationId();
		}
		
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'home_feed', user : user}),
			type: "GET",
			cache: false,
			crossDomain: true,
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {
				$.mobile.loading('show');
			}
		});
		request.done(function(data) { 
			//console.log("home DATA: " + data);
			//alert("home DATA: " + data);
			//console.log("G");
			var obj = $.parseJSON(data);
			if(obj.code === 1) {
				$('#home-content').html(obj.html);
				$.mobile.loading('hide');
			}
			else {
				$.mobile.loading('hide');
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("home Error: " + textStatus + ' - ' + thrownError + ' - ' + JSON.stringify(jqXHR));
			alert("No");
			$.mobile.loading('hide');
		});
	}
	
	/* User Nav*/
	function loadUserNav() {
		var user = common.storage.getItem("app_user");
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'user_nav', user : user}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {

			}
		});
		request.done(function(data) { 
			//console.log("User Details DATA: " + data);
			var obj = $.parseJSON(data);
			$('#user-nav').find('ul').remove();
			if(obj.resp === 'success') {
				$('.nav-avatar').html('<a href="index.html"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/' + obj.user.avatar + '&amp;h=45&amp;w=45&amp;zc=1"></a>');
				$('#user-nav').append(obj.html);
			}
			else {
				
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("User Details Error: " + textStatus + ' - ' + thrownError);
		});
	}
	
	/* User Alerts */
	function loadUserAlerts() {
		var user = common.storage.getItem("app_user");
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'user_alerts', user : user}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {

			}
		});
		request.done(function(data) { 
			console.log("User Details DATA: " + data);
			var obj = $.parseJSON(data);
			$('#user-alerts').find('ul').remove();
			if(obj.resp === 'success') {
				if(obj.count > 0) {
					$('.nav-alerts-button').append('<div class="user-alert-count">' + obj.count + '</div>')
				}
				$('#user-alerts').append(obj.html);
			}
			else {
				
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("User Details Error: " + textStatus + ' - ' + thrownError);
		});	
	}
	
	function userRegistration() {
		//Validation
		$('#registerError').html('');
		$('.alert').remove();
		$('.helper').remove();
		$('input').removeClass('error');
		var error_count = 0;
		var first_name = $('#registerFrm input[name="first_name"]').val();
		var last_name = $('#registerFrm input[name="last_name"]').val();
		var email = $('#registerFrm input[name="email"]').val();
		var password = $('#registerFrm input[name="password"]').val();
		var password_confirm = $('#registerFrm input[name="password_confirm"]').val();
		if(first_name === '') {
			$('#registerFrm input[name="first_name"]').addClass('error');
			$('#registerFrm input[name="first_name"]').after('<div class="helper error">Please enter first name</div>');
			error_count++;
		}
		if(last_name === '') {
			$('#registerFrm input[name="last_name"]').addClass('error');
			$('#registerFrm input[name="last_name"]').after('<div class="helper error">Please enter last name</div>');
			error_count++;
		}
		if(email === '') {
			$('#registerFrm input[name="email"]').addClass('error');
			$('#registerFrm input[name="email"]').after('<div class="helper error">Please enter email</div>');
			error_count++;
		}
		else {
			if(ValidateEmail(email) === false) {
				$('#registerFrm input[name="email"]').after('<div class="helper error">Please enter a valid email</div>');
				error_count++;
			}
		}
		if(password === '') {
			$('#registerFrm input[name="password"]').addClass('error');
			$('#registerFrm input[name="password"]').after('<div class="helper error">Please enter password</div>');
			error_count++;
		}
		else if (password !== password_confirm) {
			$('#registerFrm input[name="password"]').addClass('error');
			$('#registerFrm input[name="password"]').after('<div class="helper error">Passwords do not match</div>');
			error_count++;
		}
		if(error_count > 0) {
			return false;
		}
		var formData = $('#registerFrm').serializeArray();
		formData.push({name: 'format', value: 'json'});
		formData.push({name: 'method', value: 'post'});
		formData.push({name: 'action', value: 'register'});
		var request =  $.ajax({
			data: formData,
			type: "POST",
			dataType: "html",
			url: common.serviceURL + '?format=json&method=post&action=register',
			beforeSend: function() {
				$.mobile.loading('show');
			}
		});
		request.done(function(data) { 
			console.log("Register DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				//Set User and forward to homepage
				common.storage.setItem('app_user', obj.data.id);
				$.mobile.navigate("index.html", {transition: "slide", direction : "reverse"});
				loadHomeScreen();
			}
			else {
				$('#registerError').html('<div class="alert alert-danger">' + obj.data + '</div>');
				$.mobile.loading('hide');
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("Register Error: " + textStatus + ' - ' + thrownError);
			$.mobile.loading('hide');
		});
	}
	
	function userLogin() {
		//Validation
		$('#loginError').html('');
		$('.alert').remove();
		$('.helper').remove();
		$('input').removeClass('error');
		var error_count = 0;
		var email = $('#loginFrm input[name="email"]').val();
		var password = $('#loginFrm input[name="password"]').val();
		if(email === '') {
			$('#loginFrm input[name="email"]').addClass('error');
			$('#loginFrm input[name="email"]').parent('div').after('<div class="helper error">Please enter email</div>');
			error_count++;
		}
		else {
			if(ValidateEmail(email) === false) {
				$('#loginFrm input[name="email"]').after('<div class="helper error">Please enter a valid email</div>');
				error_count++;
			}
		}
		if(password === '') {
			$('#loginFrm input[name="password"]').addClass('error');
			$('#loginFrm input[name="password"]').parent('div').after('<div class="helper error">Please enter password</div>');
			error_count++;
		}
		
		var formData = $('#loginFrm').serializeArray();
		formData.push({name: 'format', value: 'json'});
		formData.push({name: 'method', value: 'post'});
		formData.push({name: 'action', value: 'login'});
		var request =  $.ajax({
			data: formData,
			type: "POST",
			dataType: "html",
			url: common.serviceURL + '?format=json&method=post&action=register',
			beforeSend: function() {
				$.mobile.loading('show');
			}
		});
		request.done(function(data) { 
			console.log("Login DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				common.storage.setItem('app_user', obj.data.id);
				$.mobile.navigate("index.html", {transition: "slide", direction : "reverse"});
				loadHomeScreen();
			}
			else {
				$('#loginError').html('<div class="alert alert-danger">' + obj.data + '</div>');
				$.mobile.loading('hide');
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("Login Error: " + textStatus + ' - ' + thrownError);
			$.mobile.loading('hide');
		});
	}
	
	function setRegistrationId() {
		var user = common.storage.getItem("app_user");
		var registrationId = common.storage.getItem("registrationId");
		var request =  $.ajax({
			data: ({format: 'json', method: 'post', action : 'push_token', user : user, token : registrationId}),
			type: "POST",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {

			}
		});
		request.done(function(data) { 
			//console.log("Push Token DATA: " + data);
			//alert("Push Token DATA: " + data);
			var obj = $.parseJSON(data);
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("Push Token Error: " + textStatus + ' - ' + thrownError);
		});
	}
	
	function ValidURL(str) {
	  	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
		  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
		  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
		  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
		  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
		  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		  return pattern.test(str);
  	}
	
	function ValidateEmail(mail)  {
 		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    		return (true)
  		}
    	//alert("You have entered an invalid email address!")
    	return (false)
	}
	
}());