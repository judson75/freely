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
			console.log("home DATA: " + data);
			//alert("home DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.code === 1) {
				$('.home-content').html(obj.html);
				loading('hide');
				return html;
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("home Error: " + textStatus + ' - ' + thrownError + ' - ' + JSON.stringify(jqXHR));
			alert("No");
			loading('hide');
		});
		
	}
	
	function displayUserNav() {
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
			if(obj.resp === 'success') {
				$('.nav-avatar').html('<a href="#profile_menu"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/' + obj.user.avatar + '&amp;h=45&amp;w=45&amp;zc=1"></a>');
				/*
				var profile_nav = '<ul>';
				profile_nav += '<li>';
				profile_nav += '<div class="nav-profile-link">';
				profile_nav += '' + obj.user.name + '';
				profile_nav += '<a href="#inner-pages?page=profile&user_slug=' + obj.user.username + '" data-transition="slide">My Profile</a>';
				profile_nav += '<span class="pull-right nav-profile-edit"><a href="/edit-profile.html" data-transition="slide">Edit Profile</a></span>';
				profile_nav += '</div>';
				profile_nav += '</li>';
				profile_nav += '<li class="li-seperator"></li>';
				//console.log('FREINDS: ' + obj.user.friends);
				//console.log(obj.user.friend_count);
				if(obj.user.friends !== '') {
					profile_nav += '<li class="li-header">Friends</li>';
					$.each( obj.user.friends, function( key, friend ) {
					 	profile_nav += '';
						profile_nav += '<li class="user-li">';
						profile_nav += '<div class="media-left">';
						profile_nav += '<a href="#inner-pages?page=profile&user_slug=' + friend.username + '" data-transition="slide">';
						profile_nav += '<img src="' + common.siteURL +'/lib/php/timthumb.php?src=' + common.siteURL + '/' + friend.avatar + '&h=25&w=25&zc=1" class="media-object">';
						profile_nav += '</a>';
						//if($main->is_online($fid)) {
						//	echo '<span class="online-dot user-online-' . $fid . '"></span>';
						//}
						profile_nav += '</div>';
						profile_nav += '<div class="media-body">';
						profile_nav += '<a href="#inner-pages?page=profile&user_slug=' + friend.username + '" data-transition="slide">' + friend.name + '</a>';
						profile_nav += '</div>';
						profile_nav += '<div class="clr"></div>';
						profile_nav += '</li>';
					});
				}
				profile_nav += '<li class="see-all-link"><a href="my-friends.html">See All Friends</a></li>';
				profile_nav += '<li><a href="members.html" data-transition="slide"><i class="fa fa-search" aria-hidden="true"></i> Find Friends</a></li>';
				profile_nav += '<li class="li-seperator"></li>';
				//console.log('GROUPS: ' + obj.user.groups);
				if(obj.user.groups !== '') {
					profile_nav += '<li class="li-header">My Groups</li>';
					$.each( obj.user.groups, function( key, group ) {
						profile_nav += '<li class="user-li">';
						profile_nav += '<div class="media-left">';
						profile_nav += '<a href="group.html?group=' +  group.slug + '" data-transition="slide">';
						profile_nav += '<img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/' + group.group_avatar + '&h=25&w=25&zc=1" class="media-object">';
						profile_nav += '</a>';
						profile_nav += '</div>';
						profile_nav += '<div class="media-body">';
						profile_nav += '<a href="group.html?group=' + group.slug + '" data-transition="slide">' + group.name + '</a>';
						profile_nav += '</div>';
						profile_nav += '<div class="clr"></div>';
						profile_nav += '</li>';
					});
					profile_nav += '';
				}
				profile_nav += '<li class="see-all-link"><a href="my-groups.html" data-transition="slide">See All Groups</a></li>';
				profile_nav += '<li><a href="groups.html" data-transition="slide"><i class="fa fa-users" aria-hidden="true"></i> Find Groups</a></li>';
				profile_nav += '<li><a href="create-group.html" data-transition="slide"><i class="fa fa-plus" aria-hidden="true"></i> Create Group</a></li>';
				profile_nav += '<li class="li-seperator"></li>';
				profile_nav += '<li><a href="logout.html"><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</a></li>';
				profile_nav += '</ul>';
				*/
				//console.log("HTML: " + profile_nav);
				$('#profile_menu').html(obj.html);
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
	
}());