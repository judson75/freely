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
				//$.mobile.navigate("welcome.html", {transition: "slide"});
			}
			document.addEventListener("backbutton", onBackKeyDown, false);  
			
			//document.addEventListener("backbutton", function (e) {
			//	e.preventDefault();
			//	alert("T");
			//}, false );

			//BackButton.override(); 
    		//document.addEventListener("backKeyDown", backKeyDown, true);
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
	
	$(window).resize( function() {
		$('.screen').page();
	});
	
	$('.content').scroll(function() {
		//Close search 
		if(isOpen == true){
			submitIcon.click();
			submitIcon.removeClass('open');
		}
		
		var p = $('.page').offset().top;
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
			
			$('.screen').page();
			
	});
	
	window.addEventListener('popstate', function(event) {
		// The popstate event is fired each time when the current history entry changes.

		var r = confirm("You pressed a Back button! Are you sure?!");

		if (r == true) {
			// Call Back button programmatically as per user confirmation.
			history.back();
			// Uncomment below line to redirect to the previous page instead.
			// window.location = document.referrer // Note: IE11 is not supporting this.
		} else {
			// Stay on the current page.
			history.pushState(null, null, window.location.pathname);
		}

		history.pushState(null, null, window.location.pathname);

	}, false);

	$(document).bind("keydown keypress mouse", function(e){
		//alert(e.which);
        if( e.which == 8 ){ // 8 == backspace
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                e.preventDefault();
            }
        }
    });
	
	
	$(document).on('click', 'a', function(event) {
		event.preventDefault();
		//Get data type...
		
		//get href
		var href = $(this).attr('href');
console.log(href);
		//does it have a hash, or other vars...
		//transitions, left or right ... slide-in-from-right
		//$.get('profile.html', function (content) {
		//			alert(content);
		//		});
		//click
		
		
		//href
		//var href = $(this).attr('href');
		$('html,body').scrollTop(0);
		
		var page = 'right';
		if(href === '#') {
			//do nothing????
			
		}
		else if(href.match('index.html')) {
			loading('show');
			var trans = 'slide-in-from-left';
			$('.nav-avatar a').attr('href', '#');
			displayHomepage();
			loading('hide');
		}
		else {
			loading('show');
			$('.nav-avatar a').attr('href', 'index.html');
			//Need to populate some pages, do some house keeping
			if(href.match('profile.html')) {
				var user_id = getParameterByName('user', href);
				var user_slug = getParameterByName('user_slug', href);
console.log('USER: ' + user_id + ' - Sluf: ' + user_slug);
				//Get user profile
				buildProfile(user_id, user_slug, function(html){
				  // here you use the output
				  //console.log('html 2 : ' + html );
					$('*[data-jquery-page-name="' + page + '"]').html(html);
					loading('hide');
				});
				//var html = buildProfile(user_id, user_slug);
//console.log('html : ' + html );
				
			}
			var trans = 'slide-in-from-right';
		}
		
		$('.screen').page.transition(page, trans);

		//});
		//$(".screen").page().transition("11", "none");
		//$(".remove-button").click(function () {
		//	var id = $(".remove-input").val();
	//		$(".screen").page().remove(id);
	//	});
	//	$(".shake-button").click(function () {
	//		$(".screen").page().shake();
	//	});
		/*
		$.ajax({
            type: "GET",
            dataType: "html",
            cache: false,
            url: 'profile.html',
            data: '',
            crossDomain: true,
            success: function (data) {
                ATSJBAjax = null;
                if (callback != null) callback(data);
            }
        });
		*/
	});
	
	
	$(document).on('click', '.postStatusBtn', function() {
		var user = 1;
		var status = $('#statusFrm input[name="status"]').val();
		//console.log("STATUS: " + status);
		$('.divOverlay').remove();
		$('.text-danger').remove();
		if(status === '') {
			$('#statusFrm').after('<div class="text-danger">Please enter a message</div>');
			return false;
		}
		//$(body).prepend('<div class="pageOverlay"></div>')
		$('#status-input').prepend('<div class="divOverlay white"><div class="loading"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div></div>');
		var formData = new FormData();
		var myform = $('#statusFrm');
		var idata = myform.serializeArray();
		$.each(idata,function(key,input){
			formData.append(input.name,input.value);
		});
		formData.append('action', 'post_status');
		formData.append('post_user_id', user);
		$('.status_pic').each(function( index ) {
			console.log("INDEX: " + index);
			formData.append('status_pic[' + index + ']', $('#status_pic_' + index)[0].files[0]);
		});
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
			$('#status-panel').find('.divOverlay').remove();
			if(obj.resp === 'success') {
				$('#statusFrm input[name="status"]').val('');
				$('#statusPicPreview').html('');
				$('#statusFrm .preview_url').remove();
				$('#statusFrm .text-danger').remove();
				$('#statusFrm iframe').remove();
				//$('#statusFrm textarea[name="status"]').before('<div class="alert alert-success">' + obj.msg + '</div>');
				if(obj.html !== '') {					
					$('#first_post_marker').after('<div id="lt">' + obj.html + '</div>');
					$('#lt').hide().fadeIn();
					$('.no-content-mssg').remove();
				}
				$('body').prepend('<div class="popup-alert">' + obj.msg + '</div>');
				setTimeout(function(){ 
					$('.popup-alert').fadeOut(300, function() { $(this).remove(); });
				}, 3000);
			}
			else {
				$('#statusFrm').before('<div class="alert alert-danger">' + obj.msg + '</div>');
			}
			$('.divOverlay').remove();
		});
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
			//console.log("G");
			var obj = $.parseJSON(data);
			if(obj.code === 1) {
				$('.home-content').html(obj.html);
				loading('hide');
				//return html;
			}
			else {
				loading('hide');
				
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
				//$('.nav-avatar').html('<a href="#profile_menu"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/' + obj.user.avatar + '&amp;h=45&amp;w=45&amp;zc=1"></a>');
				$('#user-nav').append(obj.html);
			}
			else {
				
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("User Details Error: " + textStatus + ' - ' + thrownError);
		});
	}
	
	function buildProfile(user_id, user_slug, callback) {
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
			//console.log("BUILD PROFILE DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				if(obj.html != '') {
					var html = obj.html;
				}	
				else {
					var html = '';
				}	
			}
			console.log("HTML HERE: " + html);
			//return html;
			callback(html);
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("BUILD PROFILE Error: " + textStatus + ' - ' + thrownError);
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
	
	function getParameterByName(name, url) {
		if (!url) { url = window.location.href; }
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) { return null; }
		if (!results[2]) { return ''; }
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	
	//function backKeyDown() {
	//	alert('go back!');
	//}
	
	function onBackKeyDown(e) { 
	   e.preventDefault(); 
	   alert('Back Button is Pressed!'); 
	}
	
	//Begin pickup...
	$.fn.page = function() {
console.log(this.selector);
		var $this = $(this.selector);
		$this.each(function( index ) {
			$(this).addClass('page-container');
		});
		
		//Resize page...
		var sw = $('.device').width();
		var sl = 0;
		$('.page-container .page').each(function( index ) {
			$(this).css('width', sw);
			$(this).css('left', sl);
			sl = sl + sw;
//console.log( index + ": " + $( this ).text() );
		});
		
		var transition = function (event) {
		// @todo Do something on event
		};
		
	};
	
	$.fn.page.transition = function(page, trans) {
		console.log(page + ' ' + trans);
		//
		var sw = $('.device').width();
		if(trans == 'slide-in-from-right') {
			$('.page-container .page').each(function( index ) {
				var tl = $(this).css('left');
				var nl = parseInt(tl) - parseInt(sw);
				$(this).animate({
					'left' : nl,
				}, 200);
			});
		}
		else if(trans == 'slide-in-from-left') {
			$('.page-container .page').each(function( index ) {
				var tl = $(this).css('left');
				var nl = parseInt(tl) + parseInt(sw);
				$(this).animate({
					'left' : nl,
				}, 200);
			});
		}
	};
	
}());

//(function ( $ ) {
	
//}( jQuery ));