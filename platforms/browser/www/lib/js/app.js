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
	    if(document.URL.indexOf("http://") === -1 && 
		   document.URL.indexOf("https://") === -1 && 
		   document.URL.indexOf("xampp") === -1 &&
		   document.URL.indexOf("ProLiberty") === -1
		) {
	        window.isphone = true;
	    }
		//alert(window.isphone);
	    if(window.isphone !== true) {
	    	//alert(common.storage.getItem("app_user"));
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
		if(isOpen === false){
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
	
	$(document).mouseup(function(e){
		if(isOpen == true){
			submitIcon.click();
			submitIcon.removeClass('open');
		}
		//Nav Menu
		if(e.target.id != 'user-nav' && !$('#user-nav').find(e.target).length && e.target.className != 'nav-menu-button' && !$('.nav-menu-button').find(e.target).length) {
			if($('#user-nav').hasClass('open')) {
				if($(window).width() <= 368) {
					mright = '-100%';
				}
				else {
					mright = '-310px';
				}
				$('#user-nav').removeClass('open');
				$('#user-nav').animate({
					'right': mright
				}, 'fast');
				$('body').removeClass('noscroll');
			}
		}
		//Alerts Menu
		if(e.target.className != 'nav-alerts' && !$('.nav-alerts').find(e.target).length) {
			if($('.nav-alerts').hasClass('open')) {
				$('.nav-alerts').removeClass('open');
				if($(window).width() <= 368) {
					var mright = '-100%';
				}
				else {
					var mright = '-310px';
				}
				
				$('#alerts_menu').animate({
					'right': mright
				}, 'fast');
				$('body').removeClass('noscroll');
			}
		}
		//Post Meta Popup
		if(e.target.className != 'dropdown-menu' && !$('.dropdown-menu').find(e.target).length && e.target.className != 'showPostMenu' && !$('.showPostMenu').find(e.target).length) {
			$('.dropdown-menu').hide();
			$('.showPostMenu').removeClass('open');
		}
		//Mobile profile nav
        if(e.target.id != 'mobile-profile-nav' && !$('#mobile-profile-nav').find(e.target).length) {
            if($('#profile-nav ul').hasClass('open')) {
                $('#profile-nav ul').hide();
                $('#profile-nav ul').removeClass('open');
            }
        }
		
	});
	
	/* Status Click */
	$(document).on('focus', '#statusFrm input[name="status"]', function(){
		$('#status-extra').show();
	});
	
	/* Status Photo */
	var pic_count = 0;
	$(document).on('click', '.postPhoto', function(){
		navigator.camera.getPicture(
		function(imageURI) {
			$('#statusFrm').append('<input type="hidden" name="status_pic_' + pic_count + '" id="status_pic_' + pic_count + '" value="' + imageURI + '">');
			$('#statusPicPreview').append('<div class="pp_pic" id="pp_pic_' + pic_count + '"><img src="' + imageURI + '"><div class="del-pp-pic" data-id="' + pic_count + '"><i class="fa fa-times"></i></div></div>');
			pic_count++;
		},
		function(message) {
			//alert('get picture failed');
		}, {
		 	quality: 100,
			destinationType: navigator.camera.DestinationType.NATIVE_URI,
		 	//destinationType: navigator.camera.DestinationType.FILE_URI,
			//destinationType: navigator.camera.DestinationType.DATA_URL,
		 	sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
		});
	});
	
	$(document).on('click', '.del-pp-pic', function() {
		var id = $(this).attr('data-id');
		console.log(id);
		$('#pp_pic_' + id).remove();
		$('#status_pic_' + id).remove();
	});
	
	/* Post Status Click */
	$(document).on('click', '.postStatusBtn', function() {
		postStatus();
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
	
	/* Search Click */
	$(document).on('click', '.searchbox-submit', function() {
		searchSubmit();
	});
	
	
	/* Register Button Click */
	$(document).on('click', '.registerBtn', function() {
		userRegistration();
	});
	
	/* Login Button Click */
	$(document).on('click', '.loginBtn', function() {
		userLogin();
	});
	
	/* Click on Alert */
	$(document).on('click', '.note_link', function() {
		var alert_id = $(this).data('id');
		var link = $(this).data('link');
		//mark read, then forward
		notifyClick(alert_id, link);
	});
	
	
	/* Global Page Init */
	$( document ).on( "pagecontainershow", function() {
    	console.log("PAGE LOAD");
	});
	
	
	/* Init of homepage */
	$(document).on("pagebeforeshow", "#home",function(event){
		//console.log('about to show page...');
		loadHomeScreen();
	});
	
	/* Init of Profile */
	$(document).on("pagebeforeshow", "#profile",function(event){
		var user_id = getParameterByName('user_id');
		var user_slug = getParameterByName('user_slug');
//console.log(user_id);		
		$('#global-header').show();
		$.mobile.loading('show');
		
		loadProfile(user_id, user_slug, function(html){
			//console.log('html 2 : ' + html );
			$('#profile-content').html(html);
			$.mobile.loading('hide');
		});
	});
	
	/* Init of Members */
	$(document).on("pagebeforeshow", "#members",function(event){
		var show = getParameterByName('show');
//console.log(show);		
		$('#global-header').show();
		$.mobile.loading('show');
		
		loadMembers(show, function(html){
			//console.log('html 2 : ' + html );
			$('#member-content').html(html);
			$.mobile.loading('hide');
		});
	});
	
	/* Init of Groups */
	$(document).on("pagebeforeshow", "#groups",function(event){
		var show = getParameterByName('show');
//console.log(show);		
		$('#global-header').show();
		$.mobile.loading('show');
		
		loadGroups(show, function(html){
			//console.log('html 2 : ' + html );
			$('#group-content').html(html);
			$.mobile.loading('hide');
		});
	});
	
	/* Init of Group Page */
	$(document).on("pagebeforeshow", "#group",function(event){
		var group_id = getParameterByName('group_id');
		var group_slug = getParameterByName('group_slug');
//console.log(group_id + ' - ' + group_slug);	
		$('#global-header').show();
		$.mobile.loading('show');
		
		loadGroup(group_id, group_slug, function(html){
			//console.log('html 2 : ' + html );
			$('#group-page-content').html(html);
			$.mobile.loading('hide');
		});
	});
	
	/* Like Button */
	$(document).on('click', '.likePostBtn', function() {
		var id = $(this).attr('data-id');
		var user_id = $(this).attr('data-user');
		if($(this).find('i').hasClass('flaticon-thumbs-up')) {
			var _do = 'like';
			var new_html = '<i class="flaticon-thumbs-up-hand-symbol" aria-hidden="true"></i> Liked';
		}
		else {
			var _do = 'unlike';
			var new_html = '<i class="flaticon-thumbs-up" aria-hidden="true"></i> Like';
		}
		var request =  $.ajax({
			data: ({format: 'json', method: 'post', action : _do + '_post', 'id': id, 'user_id': user_id, 'do': _do}),
			type: "POST",
			cache: false,
			crossDomain: true,
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {
				
			}
		});
		request.done(function(data) { 
			//console.log("LIKE  DATA: " + data);
			var obj = $.parseJSON(data);
			//$(this).parent().html('<button class="btn sendFriendRequest" data-user="' . $_SESSION['smUser'] . '" data-id="' . $member['id'] . '">Send Request</button>');
			$('#btn-status').remove();
			$('#like-btn-' + id).html(new_html);
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("LIKE Error: " + textStatus + ' - ' + thrownError + ' - ' + JSON.stringify(jqXHR));
			$.mobile.loading('hide');
		});

		
	});
	
	/* Unlike Button */
	$(document).on('click', '.dislikePostBtn', function() {
		var id = $(this).attr('data-id');
		var user_id = $(this).attr('data-user');
		if($(this).find('i').hasClass('flaticon-thumb-down')) {
			var _do = 'dislike';
			var new_html = '<i class="flaticon-thumbs-down-silhouette" aria-hidden="true"></i> Disliked';
		}
		else {
			var _do = 'un_dislike';
			var new_html = '<i class="flaticon-thumb-down" aria-hidden="true"></i> Dislike';
		}
		$.ajax({
  			type: 'POST',
  			url: common.serviceURL + '?format=json&method=post&action=' + _do + '_post',
  			data: { 'id': id, 'user_id': user_id, 'do': _do},
			dataType: "html",
		})
  		.done(function( data ) {
    		console.log( "Data Saved: " + data );
			var obj = $.parseJSON(data);
			//$(this).parent().html('<button class="btn sendFriendRequest" data-user="' . $_SESSION['smUser'] . '" data-id="' . $member['id'] . '">Send Request</button>');
			$('#btn-status').remove();
			$('#dislike-btn-' + id).html(new_html);
		});
	
	});
	
	/* Edit Panel */
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
			console.log("home DATA: " + data);
			//alert("home DATA: " + data);
			//console.log("G");
			var obj = $.parseJSON(data);
			if(obj.code === 1) {
				$('#home-content').html(obj.html);
				$.mobile.loading('hide');
				loadUserNav();
				loadUserAlerts();
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
				$('.nav-avatar').html('<a href="index.html" data-transition="slide" data-direction="reverse" ><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/' + obj.user.avatar + '&amp;h=45&amp;w=45&amp;zc=1"></a>');
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
	
	function loadProfile(user_id, user_slug, callback) {
		//var user_id = 96;
		//var user_slug = null;
		//console.log(user_id + ' - ' + user_slug);
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'build_profile', user_id : user_id, user_slug : user_slug}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {
				
			}
		});
		request.done(function(data) { 
			console.log("BUILD PROFILE DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				if(obj.html != '') {
					var html = obj.html;
				}	
				else {
					var html = '';
				}	
			}
			//loadUserNav();
			//loadUserAlerts();
			console.log("HTML HERE: " + html);
			//return html;
			callback(html);
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("BUILD PROFILE Error: " + textStatus + ' - ' + thrownError);
		});
		
	}
	
	function loadMembers(show, callback) {
		var user = common.storage.getItem("app_user");
		
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'members_page', user_id : user, show : show}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {
				
			}
		});
		request.done(function(data) { 
			console.log("BUILD MEMBERS DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				if(obj.html != '') {
					var html = obj.html;
				}	
				else {
					var html = '';
				}	
			}
			//loadUserNav();
			//loadUserAlerts();
			console.log("HTML HERE: " + html);
			//return html;
			callback(html);
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("BUILD PROFILE Error: " + textStatus + ' - ' + thrownError);
		});
		
	}
	
	
	function loadGroups(show, callback) {
		var user = common.storage.getItem("app_user");
		
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'groups_page', user_id : user, show : show}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {
				
			}
		});
		request.done(function(data) { 
			console.log("BUILD MEMBERS DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				if(obj.html != '') {
					var html = obj.html;
				}	
				else {
					var html = '';
				}	
			}
			//loadUserNav();
			//loadUserAlerts();
			console.log("HTML HERE: " + html);
			//return html;
			callback(html);
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("BUILD PROFILE Error: " + textStatus + ' - ' + thrownError);
		});
		
	}
	
	function loadGroup(group_id, group_slug, callback) {
		var user = common.storage.getItem("app_user");
		
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'group_page', group_id : group_id, group_slug : group_slug}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {
				
			}
		});
		request.done(function(data) { 
			console.log("BUILD MEMBERS DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				if(obj.html != '') {
					var html = obj.html;
				}	
				else {
					var html = '';
				}	
			}
			//loadUserNav();
			//loadUserAlerts();
			console.log("HTML HERE: " + html);
			//return html;
			callback(html);
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("BUILD PROFILE Error: " + textStatus + ' - ' + thrownError);
		});
		
	}
	
	function postStatus() {
		$('#status-extra').hide();
		var user = common.storage.getItem("app_user");
		var status = $('#statusFrm input[name="status"]').val();
		//Check for images...
		//var arr = $("[name^=status_pic_]");
		var arr = $("input[name^='status_pic_']");
		//alert(arr.length);
		//console.log("STATUS: " + status);
		$('.divOverlay').remove();
		$('.text-danger').remove();
		if(status === '' && arr.length < 1) {
			$('#statusFrm').after('<div class="text-danger">Please enter a message</div>');
			return false;
		}
		$.mobile.loading('show');
		//$(body).prepend('<div class="pageOverlay"></div>')
		//$('#status-input').prepend('<div class="divOverlay white"><div class="loading"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div></div>');
		var formData = new FormData();
		var myform = $('#statusFrm');
		var idata = myform.serializeArray();
		$.each(idata,function(key,input){
			formData.append(input.name,input.value);
		});
		formData.append('action', 'post_status');
		formData.append('post_user_id', user);
		//$('.status_pic').each(function( index ) {
		//	console.log("INDEX: " + index);
		//	formData.append('status_pic[' + index + ']', $('#status_pic_' + index)[0].files[0]);
		//});
		$.ajax({
  			type: 'POST',
  			url: common.serviceURL + '?format=json&method=post&action=post_status',
  			data: formData,
            contentType: false,
            processData: false,
			dataType: "html",
		})
  		.done(function( data ) {
    		console.log( "Data Saved: " + data );
			var obj = $.parseJSON(data);
			var html = obj.html;
			//$('#status-panel').find('.divOverlay').remove();
			if(obj.resp === 'success') {
				$('#statusFrm input[name="status"]').val('');
				$('#statusPicPreview').html('');
				$('#statusFrm .preview_url').remove();
				$('#statusFrm .text-danger').remove();
				$('#statusFrm iframe').remove();
				
				//Images
				var i=0;
				if(arr.length > 0) {
					for(i=0;i<arr.length;i++){     
						//alert($('#status_pic_' + i).val());
						var imgURI = $('#status_pic_' + i).val();
						uploadPhoto(imgURI, obj.id);
					}
					//Get post now....
					setTimeout(function(){ 
						$.getJSON( common.serviceURL + '?format=json&method=get&action=post', { id: obj.id } )
						  .done(function( data ) {
								//alert( "Data Loaded 2: " + data.html );
								//alert( obj.html );
								if(data.html !== '') {
									var html = data.html;
									addNewPost(html);
									
								}
						  })
						  .fail(function( jqxhr, textStatus, error ) {
								var err = textStatus + ", " + error;
								alert( "Request Failed: " + err );
						});
						
					}, 2000);
					
				
				}
				else {
					addNewPost(html);
				}
			}
			else {
				$('#statusFrm').before('<div class="alert alert-danger">' + obj.msg + '</div>');
			}
			$('.divOverlay').remove();
		});
	}
	
	function searchSubmit() {
		var search_term = $('.searchbox-input').val();
		if(search_term === '') {
			return false;
		}
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'search', search_term : search_term}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {
				
			}
		});
		request.done(function(data) { 
			console.log("SEARCh DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				
				if(obj.html != '') {
					$('#search-content').html(obj.html);
				}	
				else {
					var html = '';
				}
				$.mobile.navigate("search.html", {transition: "slide"});
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("SEARCH Error: " + textStatus + ' - ' + thrownError);
		});
		
		
	}
	
	function notifyClick(alert_id, link) {
		console.log(alert_id + ' - ' + link);
		var request =  $.ajax({
			data: ({format: 'json', method: 'post', action : 'note_read', id : alert_id}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {
				
			}
		});
		request.done(function(data) { 
			console.log("NOTE READ DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				$.mobile.navigate(link, {transition: "slide"});
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("NOTE READ Error: " + textStatus + ' - ' + thrownError);
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
	
	function uploadPhoto(imageURI, post_id) {
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
		options.mimeType = "image/jpeg";
		//console.log(options.fileName);
		var params = new Object();
		params.post_id = post_id;
		options.params = params;
		options.chunkedMode = false;

		var ft = new FileTransfer();
		ft.upload(imageURI, common.siteURL + '/lib/inc/upload.inc.php', function(result){
			console.log(JSON.stringify(result));
		}, function(error){
			console.log(JSON.stringify(error));
			alert("ERROR: " + JSON.stringify(error));
		}, options);
 	}
	
	function addNewPost(html) {
		if(html !== '') {
			$.mobile.loading('hide');
			$('#first_post_marker').after('<div id="lt">' + html + '</div>');
			$('#lt').hide().fadeIn();
			$('.no-content-mssg').remove();
		}
		$('body').prepend('<div class="popup-alert">' + obj.msg + '</div>');
		setTimeout(function(){ 
			$('.popup-alert').fadeOut(300, function() { $(this).remove(); });
		}, 3000);
	}
	
	function getParameterByName(name, url) {
		if (!url) { url = window.location.href; }
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) { return null; }
		if (!results[2]) { return ''; }
		return decodeURIComponent(results[2].replace(/\+/g, " "));
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