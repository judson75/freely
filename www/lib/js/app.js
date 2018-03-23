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
			console.log('Received Device Ready Event');
			console.log('calling setup push');
			common.setupPush();
			//alert("user: " + common.storage.getItem("app_user"));
			//$.mobile.navigate("welcome.html", {transition: "slide"});
			if(common.storage.getItem("app_user") === '' || common.storage.getItem("app_user") === null || common.storage.getItem("app_user") === 'undefined') {
				$.mobile.navigate("welcome.html", {transition: "slide"});
			}
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
		}
	};
	
	//var storage.app_user = 1;
    window.common = common;
	
	$( window ).scroll(function() {
		//Close search 
		if(isOpen == true){
			submitIcon.click();
			submitIcon.removeClass('open');
		}
		
		var p = $('header').offset().top;
		console.log( "scrollTop:" + p );
		var top_m = p - 135;
		//console.log(top_m);
		if(p > 100) {
			if(!$('li.nav-status-btn').hasClass('open')) {
				$('li.nav-status-btn').addClass('open');
			}
			if(!$('#status-bar').hasClass('fixed')) {
				$('#status-bar').addClass('fixed');
			}

		}
		else {
			$('li.nav-status-btn').removeClass('open');
			$('#status-bar').removeClass('fixed');
		}
	});
	
	$(document).on('click', '.nav-status-btn', function() {
		if(!$('#status-bar').hasClass('open')) {
			$('#status-bar').addClass('open');
		}
		else {
			$('#status-bar').removeClass('open');
		}

	});
	
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
	
	$(document).on('click', '#user-alerts-close', function() {
		$('#user-alerts').removeClass('open');
		$('#user-alerts').animate({
			'right' : '-100%',
		}, 200);
	});
	
	
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
	
	$(document).on('click', '#user-nav-close', function() {
		$('#user-nav').removeClass('open');
		$('#user-nav').animate({
			'right' : '-100%',
		}, 200);
	});

	$(document).on('click', '.edit-panel i', function() {
		if($(this).next('.edit-dropdown').hasClass('open')) {
			$(this).next('.edit-dropdown').removeClass('open');
			$(this).next('.edit-dropdown').hide();
			$(this).addClass('flaticon-angle-arrow-down');
			$(this).removeClass('flaticon-up-arrow');
		}
		else {
			$(this).next('.edit-dropdown').addClass('open');
			$(this).next('.edit-dropdown').slideDown();
			$(this).removeClass('flaticon-angle-arrow-down');
			$(this).addClass('flaticon-up-arrow');
		}
	});
	
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
	
	/* Initial Page Load */
	//displayHomepage();
	$(document).ready( function() {
		//setTimeout(function(){
			//$('#splash').fadeOut(); $.mobile.loading('hide');
			//if(common.storage.getItem("app_user") === '' || common.storage.getItem("app_user") === null || common.storage.getItem("app_user") === 'undefined') {
			//	$.mobile.navigate("welcome.html", {transition: "slide"});
			//}
			displayHomepage();
			displayUserNav();
		//}, 1500);
		
		
		
	});
	
	/*
	function displayHomepage() {
		var html = getHomepage();
		console.log("HTML: " + html);
		alert("HTML: " + html);
		$('.home-content').html(html);
	}
	*/
	
	function displayHomepage() {
		//var user = common.storage.getItem("app_user");
		var user = 1;
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
				loading('show');
			}
		});
		request.done(function(data) { 
			//console.log("home DATA: " + data);
			//alert("home DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.code === 1) {
				$('.home-content').html(obj.html);
				loading('hide');
				//return html;
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("home Error: " + textStatus + ' - ' + thrownError + ' - ' + JSON.stringify(jqXHR));
			alert("No");
			loading('hide');
		});
		
	}
	
	function displayUserNav() {
		//var user = common.storage.getItem("app_user");
		var user = 1;
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'user_nav', user : user}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {

			}
		});
		request.done(function(data) { 
			console.log("User Details DATA: " + data);
			var obj = $.parseJSON(data);
			$('#user-nav').find('ul').remove();
			if(obj.resp === 'success') {
				$('.nav-avatar').html('<a href="#profile_menu"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/' + obj.user.avatar + '&amp;h=45&amp;w=45&amp;zc=1"></a>');
				$('#user-nav').append(obj.html);
			}
			else {
				
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("User Details Error: " + textStatus + ' - ' + thrownError);
		});
	}
	
	function setRegistrationId() {
		//var user = common.storage.getItem("app_user");
		var user = 1;
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
	
	function loading(method) {
		if(method == 'show' || method == '') {
			$('body').append('<div class="page-loading"><div class="div-loading"><img src="lib/js/loading.gif"></div></div>');
		}
		else {
			$('.page-loading').remove();
		}
	}
	
	function callbackMethod() {
		alert("BOOM");
	}
	
	function buttonUp(){
		var inputVal = $('.searchbox-input').val();
		inputVal = $.trim(inputVal).length;
		if( inputVal !== 0){
			$('.searchbox-icon').css('display','none');
		} else {
			$('.searchbox-input').val('');
			$('.searchbox-icon').css('display','block');
		}
	}
	
}());