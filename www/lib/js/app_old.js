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
	
	var processHash = function( url ) {
		var parsed = $.mobile.path.parseUrl( url ),
			hashQuery = parsed.hash.split( "?" );
		return {
			parsed: parsed,
			cleanHash: ( hashQuery.length > 0 ? hashQuery[ 0 ] : "" ),
			queryParameters: ( hashQuery.length > 1 ? hashQuery[ 1 ] : "" )
		};
	};

	$( document ).bind( 'mobileinit', function(){
	  	$.mobile.loader.prototype.options.text = "loading";
	  	$.mobile.loader.prototype.options.textVisible = false;
	  	$.mobile.loader.prototype.options.theme = "a";
	  	$.mobile.loader.prototype.options.html = "";
		//alert(common.storage.getItem("app_user"));
		if(common.storage.getItem("app_user") === '' || common.storage.getItem("app_user") === null || common.storage.getItem("app_user") === 'undefined') {
			$.mobile.navigate("welcome.html", {transition: "slide"});
		}
	});
	
	$.mobile.loading( 'show', {
		text: 'foo',
		textVisible: true,
		theme: 'z',
		html: ""
	});

//	document.addEventListener("online", onDeviceOnline, false);
//	document.addEventListener("offline", onDeviceOffline, false);
//	document.addEventListener("resign", onDeviceBackground, false);
//	document.addEventListener("active", onDeviceActive, false);
	
	$(document).ready(function () {
		//Splash screen
		$.mobile.loading('show');
		//console.log(common.storage.getItem("app_user"));
		setTimeout(function(){
			$('#splash').fadeOut(); $.mobile.loading('hide');
			if(common.storage.getItem("app_user") === '' || common.storage.getItem("app_user") === null || common.storage.getItem("app_user") === 'undefined') {
				$.mobile.navigate("welcome.html", {transition: "slide"});
			}
		}, 1500);
		
	});
	
	common.showAlert = function(message, title) {
		
		//$('body').append(dialogue);
		//$.mobile.changePage("#dialogPage", { 'data-transition': "pop", 'overlayTheme': "e"});
		$( "#popupBox #popupHeader" ).html('<h2>' + title + '</h2>');
		$( "#popupBox #popupBody" ).html('' + message + '');
		$( "#popupBox" ).popup('open');
		//$(dialogue).on('load', function() {
		//	$("#dialogPage").popup("option", { 'transition': "pop"});
		//}).appendTo("body");
	};
	
	common.test = function() {
		common.showAlert('message one', 'Header');
		
	};
	
	$(document).on('click', 'a[href^="#"]', function(e) {
		//e.preventDefault();
		//console.log('works');
		//alert(e);
		//all data tags
		//$(this + "[attr^='data-']").each(function(index, value){
		//	console.log(index + ' - ' + value	);
		//})
	});
	
	$(document).on('click', '.registerBtn', function() {
		//Validation
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
			$('#registerFrm input[name="first_name"]').parent('div').after('<div class="helper error">Please enter first name</div>');
			error_count++;
		}
		if(last_name === '') {
			$('#registerFrm input[name="last_name"]').addClass('error');
			$('#registerFrm input[name="last_name"]').parent('div').after('<div class="helper error">Please enter last name</div>');
			error_count++;
		}
		if(email === '') {
			$('#registerFrm input[name="email"]').addClass('error');
			$('#registerFrm input[name="email"]').parent('div').after('<div class="helper error">Please enter email</div>');
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
			$('#registerFrm input[name="password"]').parent('div').after('<div class="helper error">Please enter password</div>');
			error_count++;
		}
		else if (password !== password_confirm) {
			$('#registerFrm input[name="password"]').addClass('error');
			$('#registerFrm input[name="password"]').parent('div').after('<div class="helper error">Passwords do not match</div>');
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

			}
		});
		request.done(function(data) { 
			console.log("Register DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				
			}
			else {
				$('#registerFrm').prepend('<div class="alert alert-danger">' + obj.data + '</div>');
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("Register Error: " + textStatus + ' - ' + thrownError);
		});
	});
	
	$(document).on('click', '.loginBtn', function() {
		//Validation
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

			}
		});
		request.done(function(data) { 
			console.log("Login DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {
				common.storage.setItem('app_user', obj.data.id);
				$.mobile.navigate("index.html", {transition: "slide"});
			}
			else {
				$('#registerFrm').prepend('<div class="alert alert-danger">' + obj.data + '</div>');
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("Login Error: " + textStatus + ' - ' + thrownError);
		});
	});
	
	$(document).on('click', '.postStatusBtn', function() {
		var status = $('#statusFrm textarea[name="status"]').val();
		$('.text-danger').remove();
		if(status === '') {
			$('#statusFrm textarea[name="status"]').after('<div class="text-danger">Please enter a message</div>');
			return false;
		}
		//$(body).prepend('<div class="pageOverlay"></div>')
		$('#status-panel').prepend('<div class="divOverlay white"><div class="loading"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div></div>');
		var formData = new FormData();
		var myform = $('#statusFrm');
		var idata = myform.serializeArray();
		$.each(idata,function(key,input){
			formData.append(input.name,input.value);
		});
		formData.append('action', 'post_status');
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
				$('#statusFrm textarea[name="status"]').val('');
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
				$('#statusFrm textarea[name="status"]').before('<div class="alert alert-danger">' + obj.msg + '</div>');
			}
		});
	});
	
	
	$(document).on('click', '.likePostBtn', function() {
		var id = $(this).attr('data-id');
		var user_id = $(this).attr('data-user');
		if($(this).find('i').hasClass('fa-thumbs-o-up')) {
			var _do = 'like';
			var new_html = '<i class="fa fa-thumbs-up" aria-hidden="true"></i> Liked';
		}
		else {
			var _do = 'unlike';
			var new_html = '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i> Like';
		}
		$.ajax({
  			type: 'POST',
  			url: common.serviceURL + '?format=json&method=post&action=' + _do + '_post',
  			data: { 'id': id, 'user_id': user_id, 'do': _do },
			dataType: "html",
		})
  		.done(function( data ) {
    		console.log( "Data Saved: " + data );
			var obj = $.parseJSON(data);
			//$(this).parent().html('<button class="btn sendFriendRequest" data-user="' . $_SESSION['smUser'] . '" data-id="' . $member['id'] . '">Send Request</button>');
			$('#btn-status').remove();
			$('#like-btn-' + id).html(new_html);
		});
	});
	
	$(document).on('click', '.dislikePostBtn', function() {
		var id = $(this).attr('data-id');
		var user_id = $(this).attr('data-user');
		if($(this).find('i').hasClass('fa-thumbs-o-down')) {
			var _do = 'dislike';
			var new_html = '<i class="fa fa-thumbs-down" aria-hidden="true"></i> Disliked';
		}
		else {
			var _do = 'un_dislike';
			var new_html = '<i class="fa fa-thumbs-o-down" aria-hidden="true"></i> Dislike';
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
	
	var pic_count = 0;
	$(document).on('click', '.postPhoto', function() {
		var id = pic_count;
		$('.share-text').after('<input type="file" class="status_pic" name="status_pic[]" id="status_pic_' + id + '" style="display: none;" accept="image/*">');
		$('#status_pic_' + id).click();
		$('#status_pic_' + id).on('change', function() {
			handleStatusPics(id);
		});
		pic_count++;
	});
	
	$(document).on('click', '.del-pp-pic', function() {
		var id = $(this).attr('data-id');
		//console.log(id);
		$('#pp_pic_' + id).remove();
		$('#status_pic_' + id).remove();
	});
	
	$(document).on('click', '.postVideo', function() {
		$('#status_video').click();
	});
	
	$(document).on('blur', 'input[name="group_name"]', function() {
		if($('input[name="group_username"]').val() === '' && $('input[name="group_name"]').val() !== '') {
			var slug = convertToSlug($('input[name="group_name"]').val());
			$('input[name="group_username"]').val(slug);
		}
	});
	
	$(document).on('click', '#gp_upload_btn', function() {
		$('#group_pic').click();
	});
	
	$(document).on('click', '.uploadCommentImgBtn', function() {
		var id = $(this).attr('data-id');
		$('#comment_pic_' + id).click();
	});
	
	window.URL    = window.URL || window.webkitURL;
	var useBlob   = false && window.URL;
	
	function handleStatusPics(id) {		
		var file = document.getElementById('status_pic_' + id).files[0];
		//console.log(file);
		if ( (/\.(png|jpeg|jpg|gif)$/i).test(file.name) ) {
			//readStatusImage( file, id ); 
			var reader = new FileReader();
			reader.addEventListener('load', function () {
				//$('#statusPicPreview').html('');
				var image  = new Image();
				image.src = useBlob ? window.URL.createObjectURL(file) : reader.result;
				//console.log(image.src);
				$('#statusPicPreview').append('<div class="pp_pic" id="pp_pic_' + id + '"><img src="' + image.src + '"><div class="del-pp-pic" data-id="' + id + '"><i class="fa fa-times"></i></div></div>');
			});
			reader.readAsDataURL(file);
		} else {
			errors += file.name +" Unsupported Image extension\n";  
		}
	}
	
	function handleUpdatePics(id, post_id) {
		var file = document.getElementById('status_pic_' + id).files[0];
		//console.log(file);
		if ( (/\.(png|jpeg|jpg|gif)$/i).test(file.name) ) {
			//readStatusImage( file, id ); 
			var reader = new FileReader();
			reader.addEventListener('load', function () {
				//$('#statusPicPreview').html('');
				var image  = new Image();
				image.src = useBlob ? window.URL.createObjectURL(file) : reader.result;
				//console.log(image.src);
				$('#comment_pic_preview_' + post_id).append('<div class="pp_pic" id="pp_pic_' + id + '"><img src="' + image.src + '"><div class="del-pp-pic" data-id="' + id + '"><i class="fa fa-times"></i></div></div>');
			});
			reader.readAsDataURL(file);
		} 
		else {
			errors += file.name +" Unsupported Image extension\n";  
		}

	}
	
	/* Comment Pic Upload */
	if($('.comment-form').length) {
		window.URL    = window.URL || window.webkitURL;
		var useBlob   = false && window.URL; // Set to `true` to use Blob instead of Data-URL
		function readCommentImage (file, id) {
			var reader = new FileReader();

			// Once a file is successfully readed:
			reader.addEventListener("load", function () {
				$('#comment_pic_preview_' + id).html('');
				var image  = new Image();
				image.addEventListener("load", function () {
					var imageInfo = file.name    +' '+ // get the value of `name` from the `file` Obj
					image.width  +'×'+ // But get the width from our `image`
					image.height +' '+
					file.type    +' '+
					Math.round(file.size/1024) +'KB';
					//spPreview.appendChild( this );
					$('#comment_pic_preview_' + id).html(image);
					if (useBlob) {
						// Free some memory for optimal performance
						window.URL.revokeObjectURL(image.src);
					}
				});

				image.src = useBlob ? window.URL.createObjectURL(file) : reader.result;

			});

			reader.readAsDataURL(file);  
		}

		$('.comment_pic').on("change", function() {
			var id = $(this).attr('data-id');
			var this_id = $('#comment_pic_' + id);
			var files  = this.files;
			var errors = "";
			if (!files) {
				errors += "File upload not supported by your browser.";
			}
			if (files && files[0]) {
				for(var i=0; i<files.length; i++) {
					var file = files[i];
					if ( (/\.(png|jpeg|jpg|gif)$/i).test(file.name) ) {
						readCommentImage( file, id ); 
					} else {
						errors += file.name +" Unsupported Image extension\n";  
					}
				}
			}

			if (errors) {
				alert(errors); 
			}
		});
	}
	
	$(document).on('click', '.sharePostBtn', function() {
		var id = $(this).attr('data-id');
		var user_id = $(this).attr('data-user');
		$.ajax({
  			type: 'POST',
  			url: common.serviceURL + '?format=json&method=post&action=share_post',
  			data: { 'id': id, 'user_id': user_id},
			dataType: "html",
		})
  		.done(function( data ) {
    		console.log( "Data Saved: " + data );
			var obj = $.parseJSON(data);
			if(obj.resp === 'success') {	
				$('body').prepend('<div class="popup-alert">' + obj.msg + '</div>');
				setTimeout(function(){ 
					$('.popup-alert').fadeOut(300, function() { $(this).remove(); });
				}, 3000);
			}
			
		});
	});
	
	
	$(document).on("pageinit", "#home",function(event){
		console.log('about to show page...');
		//get Homepage data and nav...
		displayHomepage();
		displayUserNav();
	});
	
	function displayHomepage() {
		var html = getHomepage();
		console.log("HTML: " + html);
		$('.ui-content').html(html);
	}
	
	function getHomepage() {
		var user = common.storage.getItem("app_user");
		var registrationId = common.storage.getItem("registrationId");
		if(registrationId !== '' && registrationId !== null) {
			setRegistrationId();
		}
		$.mobile.loading('show');
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'home_feed', user : user}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {

			}
		});
		request.done(function(data) { 
			console.log("home DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.code === 1) {
				//$('#home-post').html(obj.html);
				var html = '';
				html += '<!-- Share texts -->';
				html += '<div class="panel panel-default share clearfix-xs" id="status-panel">';
				html += '<div class="panel-body">';
				html += '<form method="post" id="statusFrm" enctype="multipart/form-data" multiple="">';
				html += '<input name="post_user_id" value="1" type="hidden">';
				html += '<input name="posted_url" value="" type="hidden">';
				html += '<textarea name="status" class="form-control share-text" rows="3" placeholder="Share your status..." data-role="none"></textarea>';
				html += '<input name="status_video" id="status_video" data-role="none" accept="video/*" type="file">';
				html += '<div id="statusPicPreview"></div>';
				html += '</form>';
				html += '</div>';
				html += '<div class="panel-footer share-buttons">';
				html += '<!-- <span class="postLocation"><i class="fa fa-map-marker"></i></span>-->';
				html += '<span class="postPhoto"><i class="fa fa-camera-retro"></i></span>';
				html += '<!--<span class="postVideo"><i class="fa fa-video-camera"></i></span>-->';
				html += '<button type="button" class="btn btn-primary btn-xs pull-right postStatusBtn" data-role="none">Post</button>';
				html += '</div>';
				html += '</div>';
				html += '<div id="first_post_marker"></div>';
				$.each(obj.posts, function( index, post ){
					html += postDisplay(post, user);
				});
			//	$('.ui-content').html(html, user);
			//	console.log("HTML: " + html);
				$.mobile.loading('hide');
				return html;
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			//console.log("home Error: " + textStatus + ' - ' + thrownError);
		});
		
	}
	
	
	
	function displayUserNav() {
		var user = common.storage.getItem("app_user");
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'user_details', user : user}),
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
				//console.log("HTML: " + profile_nav);
				$('#profile_menu').html(profile_nav);
			}
			else {
				
			}
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("User Details Error: " + textStatus + ' - ' + thrownError);
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
	
	/*
	
	$.mobile.document.on( "pagecontainerbeforetransition", function( event, data ) {	
		//var user_id = getParameterByName('user_id');
		var queryParameters = {},
            processedHash = processHash( data.absUrl );
		//console.log(processedHash.queryParameters);
		if ( processedHash.queryParameters ) {
			$.each( processedHash.queryParameters.split( "&" ),
				function( index, value ) {
					var pair = value.split( "=" );
					if ( pair.length > 0 && pair[0] ) {
						queryParameters[ pair[0] ] =
							( pair.length > 1 ? pair[ 1 ] : true );
						console.log("QP: " + pair[ 0 ] + " - " + pair[1]);
						common.storage.removeItem('page_' + pair[0]);
						common.storage.setItem('page_' + pair[0], pair[1]);
						localStorage.firstname=pair[1];
					}
				});
			//console.log("QP: " + queryParameters);
		}
		//Get profile
		var user = common.storage.getItem("app_user");
		/*
		for (var i = 0; i < localStorage.length; i++){
			// do something with localStorage.getItem(localStorage.key(i));
			//console.log(localStorage.getItem(localStorage.key(i)));
			 console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
		}

		console.log(user);
		*\/
		
		
		
		
	});
	*/
	
	
	// Listen for any attempts to call changePage().
	$(document).bind( "pagebeforechange", function( e, data ) {
		// We only want to handle changePage() calls where the caller is
		// asking us to load a page by URL.
		if ( typeof data.toPage === "string" ) {
			//console.log(data.toPage);
			var u = $.mobile.path.parseUrl( data.toPage ),
				re = /^#inner-pages/;
			if ( u.hash.search(re) !== -1 ) {
				displayPage(u, data.options);
				e.preventDefault();
			}
		}
	});
	
	function displayPage(urlObj, options) {
	//	console.log(urlObj);
	//	console.log(options);
		var pageName = 'home';
		if(options.pageData !== null && options.pageData !== undefined) {
			pageName = options.pageData.page;
		}

		//console.log("PageName: " + pageName);
		var pageSelector = urlObj.hash.replace( /\?.*$/, "" );
		//console.log(pageSelector);
		if ( pageName ) {
			var html = '';
			
			var $page = $( pageSelector ),
				$header = $page.children( ":jqmData(role=header)" ),
				$content = $page.children( ":jqmData(role=content)" ),
				markup = getHomepage(),
				cItems = "NAME",
				numItems = cItems.length;
			
			//Get Markup ....
			switch(pageName) {
				case 'home':
					//markup += getHomepage();
					console.log("TEST " + html);
					pageSelector = '#home';
				break;
			}
			console.log("PAGE SELECT: " + pageSelector + " - MARKUP: " + markup);
			// Find the h1 element in our header and inject the name of
			// the category into it.
			$header.html($('#global-header').html());
			
			// Inject the category items markup into the content element.
			$content.html( markup );

			// Pages are lazily enhanced. We call page() on the page
			// element to make sure it is always enhanced before we
			// attempt to enhance the listview markup we just injected.
			// Subsequent calls to page() are ignored since a page/widget
			// can only be enhanced once.
			$page.page();

			// Enhance the listview we just injected.
			$content.find( ":jqmData(role=listview)" ).listview();

			// We don't want the data-url of the page we just modified
			// to be the url that shows up in the browser's location field,
			// so set the dataUrl option to the URL for the category
			// we just loaded.
			options.dataUrl = urlObj.href;

			// Now call changePage() and tell it to switch to
			// the page we just modified.
			$.mobile.changePage( $page, options );
		}
	}
	
	
	//$(document).on("pageinit", "#home",function(event){
	//	alert('about to show page...');
	//});
	
	/*
	$('#home, index.html').on( "pageinit", function( event ) { 
		
	});
	
	$('#post-page').on( "pagebeforeshow", function( event ) {
		
		console.log("POST");
		
	});
	
	$('#post-page').on( "pagecontainerbeforetransition", function( event ) {
		
		console.log("POST LOAD");
		
	});
	
	$( document ).on( "pagecreate", "post.html", function( event ) {
  		console.log( "This page was just enhanced by jQuery Mobile!" );
	});
	//pagecontainerbeforetransition
	
	*/
	
	
	$('#profile, profile.html').on( "pagebeforeshow", function( event ) {
		var user = common.storage.getItem("app_user"); 
		//var user_id = common.storage.getItem("page_user_id");
		//console.log(getParameterByName('user_slug'));
		var user_id = getParameterByName('user_id');
		var user_slug = getParameterByName('user_slug');
		//console.log(user_slug);
		//$('#profile-content-header').html('');
		//$('#profile-content').html('');
		//$('#profile-content-header').html('');
		//$('#profile-content').html('');
		
		for (var i = 0; i < localStorage.length; i++){
			// do something with localStorage.getItem(localStorage.key(i));
			//console.log(localStorage.getItem(localStorage.key(i)));
			 console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
		}
		
		
		$.mobile.loading('show');
		//Ajax to get Profile
		var request =  $.ajax({
			data: ({format: 'json', method: 'get', action : 'profile', user_id : user_id, user_slug : user_slug}),
			type: "GET",
			dataType: "html",
			url: common.serviceURL,
			beforeSend: function() {

			}
		});
		request.done(function(data) { 
			console.log("Profile DATA: " + data);
			var obj = $.parseJSON(data);
			if(obj.code === 1) {
				//Get user part
				var header_html = '';
				
				header_html += '<div id="profile-header">';
				header_html += '<div id="profile-cover">';
				header_html += '<div class="image" style="background-image: url(\'http://cbhllc.net/images/eaglevfd_mini.jpg\');"></div>';
				header_html += '</div>';
				header_html += '<div id="profile-body">';
				header_html += '<div id="profile-avatar-wrapper" class="">';
				header_html += '<div id="profile-avatar">';
				/* Media */
				//http://cbhllc.net/profile/judsonc75/media/5a43d6d1dba2f.jpg
				header_html += '<a href="' + common.siteURL + '"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/' + obj.profile.user.avatar + '&amp;h=110&amp;w=110&amp;zc=1"></a>';
				header_html += '</div>';
				header_html += '<span class="online-dot user-online-' + obj.profile.user.id + '"></span>';
				header_html += '</div>';
				header_html += '<div id="profile-name">';
				header_html += obj.profile.user.name;
				header_html += '<div id="profile-username">@' + obj.profile.user.username + '</div>';
				header_html += '</div>';
				header_html += '<div id="profile-nav">';
				header_html += '<ul>';
				header_html += '<li onclick="location.href=\'http://cbhllc.net/profile/judsonc75/about\'"><i class="fa fa-user-circle-o" aria-hidden="true"></i> About</li>';
				header_html += '<li onclick="location.href=\'http://cbhllc.net/edit-profile\'"><i class="fa fa-cogs" aria-hidden="true"></i> Edit</li>';
				header_html += '</ul>';
				header_html += '<div id="mobile-profile-nav"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></div>';
				header_html += '</div>';
				header_html += '</div>';
				header_html += '</div>';
				
				$('#profile-content-header').html(header_html);
				
				//Timeline
				//console.log(obj.profile.timeline);
				var html = '';
				$.each(obj.profile.timeline, function( index, post ){
					//console.log(post);
					html += postDisplay(post, user);
				});
				
				$('#profile-content').html(html);
				$.mobile.loading('hide');
			}
			
		});
		request.fail(function(jqXHR, textStatus, thrownError) {			
			console.log("Profile Error: " + textStatus + ' - ' + thrownError);
		});
	});
	
	function getParameterByName(name, url) {
		if (!url) { url = window.location.href; }
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) { return null; }
		if (!results[2]) { return ''; }
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	
	
	/*
	function profileMenuDisplay() {
		
		var menu = '';
		menu += '<div id="close-profile-menu" data-rel="close"><i class="fa fa-times"></i></div>';
		menu += '<ul>';
		menu += '<li>';
		menu += '<div class="nav-profile-link">';
		menu += 'Judson Cooper';
		menu += '<a href="http://cbhllc.net/profile/judsonc75">My Profile</a>';
		menu += '<span class="pull-right nav-profile-edit"><a href="http://cbhllc.net/edit-profile">Edit Profile</a></span>';
		menu += '</div>';
		menu += '</li>';
		menu += '<li class="li-seperator"></li>';
		menu += '<li class="li-header">Friends</li><li class="user-li"><div class="media-left">';
		menu += '<a href="http://cbhllc.net/profile/jordan ">';
		menu += '<img src="http://cbhllc.net/lib/php/timthumb.php?src=http://cbhllc.net/lib/images/avatar-placeholder.png&amp;h=25&amp;w=25&amp;zc=1" class="media-object">';
		menu += '</a></div>';
		menu += '<div class="media-body">';
		menu += '<a href="http://cbhllc.net/profile/jordan ">Jordan</a>';
		/*
		menu += '</div>
								  <div class="clr"></div></li><li class="user-li"><div class="media-left"> 
									<a href="http://cbhllc.net/profile/Stevesmitty">
										<img src="http://cbhllc.net/lib/php/timthumb.php?src=http://cbhllc.net/lib/images/user_images/20171117_170842_1.jpg&amp;h=25&amp;w=25&amp;zc=1" class="media-object">
									</a></div>
								  <div class="media-body">
										<a href="http://cbhllc.net/profile/Stevesmitty">Steve smitty</a>

								  </div>
								  <div class="clr"></div></li><li class="user-li"><div class="media-left"> 
									<a href="http://cbhllc.net/profile/gary">
										<img src="http://cbhllc.net/lib/php/timthumb.php?src=http://cbhllc.net/lib/images/user_images/20171125_174825.jpg&amp;h=25&amp;w=25&amp;zc=1" class="media-object">
									</a></div>
								  <div class="media-body">
										<a href="http://cbhllc.net/profile/gary">Gary Cooper</a>

								  </div>
								  <div class="clr"></div></li>			<li class="see-all-link"><a href="http://cbhllc.net/my-friends">See All</a></li>
				<li><a href="http://cbhllc.net/members"><i class="fa fa-search" aria-hidden="true"></i> Find Friends</a></li>
				<li class="li-seperator"></li>
				<li class="li-header">My Groups</li><li class="user-li"><div class="media-left"> 
								<a href="http://cbhllc.net/group/south-ms-gun-trader">
									<img src="http://cbhllc.net/lib/php/timthumb.php?src=http://cbhllc.net//lib/images/avatar-placeholder.png&amp;h=25&amp;w=25&amp;zc=1" class="media-object">
								</a></div>
							  <div class="media-body">
									<a href="http://cbhllc.net/group/south-ms-gun-trader">South MS Gun Trader</a>
							  </div>
							  <div class="clr"></div></li><li class="user-li"><div class="media-left"> 
								<a href="http://cbhllc.net/group/beta-testers">
									<img src="http://cbhllc.net/lib/php/timthumb.php?src=http://cbhllc.net//lib/images/group_images/software-Testing.jpg&amp;h=25&amp;w=25&amp;zc=1" class="media-object">
								</a></div>
							  <div class="media-body">
									<a href="http://cbhllc.net/group/beta-testers">Beta Testers</a>
							  </div>
							  <div class="clr"></div></li><li class="user-li"><div class="media-left"> 
								<a href="http://cbhllc.net/group/dirty-harry">
									<img src="http://cbhllc.net/lib/php/timthumb.php?src=http://cbhllc.net//lib/images/group_images/2017-12-21-12-31-51-.jpg&amp;h=25&amp;w=25&amp;zc=1" class="media-object">
								</a></div>
		menu += '<div class="media-body">
		menu += '<a href="http://cbhllc.net/group/dirty-harry">Dirty Harry</a>
		menu += '</div>
		menu += '<div class="clr"></div></li>
		*\/
		menu += '<li class="see-all-link"><a href="http://cbhllc.net/my-groups">See All</a></li>';
		menu += '<li><a href="http://cbhllc.net/groups"><i class="fa fa-users" aria-hidden="true"></i> Find Groups</a></li>';
		menu += '<li><a href="http://cbhllc.net/create-group"><i class="fa fa-plus" aria-hidden="true"></i> Create Group</a></li>';
		menu += '<li class="li-seperator"></li>';
		menu += '<li><a href="http://cbhllc.net/logout"><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</a></li>';
		menu += '</ul>';
		
		$('#profile_menu').html(menu);
	}
	*/
	
	
	function postDisplay(post, user) {
		var html = '';
		//console.log(post.id);
		if(post.is_ad === true) {
			///echo '<pre>';print_r($post); echo '</pre>';
			html += '<div class="timeline-block">';
			html += '<div class="panel panel-default post-container-' + post.id + '" id="panel-body-' + post.id + '">';
			html += '<div class="panel-preheader"><i class="fa fa-newspaper-o" aria-hidden="true"></i> <b>Sponsored Ad</b></div>';
			html += '<img src="' + common.siteURL + '/lib/images/ad_images/' + post.ad_media + '" style="display: block; width: 100%;">';
			html += '<div class="news-body" style="padding: 10px;">';
			html += '<div class="news-title" style="font-size: 15px; font-weight: bold; margin: 0 0 5px 0;"><a href="' + post.ad_url + '">' + post.ad_title + '</a></div>';
			html += '<div class="news-excerpt" style="font-size: 12px; color: #666; margin: 0 0 10px 0;">' + post.ad_description + '</div>';
			html += '<div class="news-url" style="font-size: 10px; color: #999;">' + post.news_url + '</div>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
		}
		else if(post.news_url) {
			//echo '<pre>';print_r($post); echo '</pre>';
			html += '<div class="timeline-block">';
			html += '<div class="panel panel-default post-container-' + post.id + '" id="panel-body-' + post.id + '">';
			html += '<div class="panel-preheader"><i class="fa fa-newspaper-o" aria-hidden="true"></i> <b>News from ' + post.source + '</b></div>';
			html += '<img src="' + common.siteURL + '/lib/images/news_images/' + post.media + '" style="display: block; width: 100%;">';
			html += '<div class="news-body" style="padding: 10px;">';
			html += '<div class="news-title" style="font-size: 15px; font-weight: bold; margin: 0 0 5px 0;"><a href="' + post.news_url + '">' + post.title + '</a></div>';
			html += '<div class="news-excerpt" style="font-size: 12px; color: #666; margin: 0 0 10px 0;">' + post.excerpt + '</div>';
			html += '<div class="news-url" style="font-size: 10px; color: #999;">' + post.news_url + '</div>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
		}
		else {
			html += '<div class="timeline-block">';
			html += '<div class="panel panel-default post-container-' + post.id + '" id="panel-body-' + post.id + '">';
			/* Any Comments */
			if(post.pre_header !== '' && post.pre_header !== null && post.pre_header !== undefined) {
				html += '<div class="panel-preheader">' + post.pre_header + '</div>';
			}
			html += '<div class="panel-heading">';
			html += '<div class="media">';
			html += '<div class="media-left">';
			html += '<a href="#inner-pages?page=profile&user_id=' + post.user_id + '" data-transition="slide" data-id="' + post.user_id + '"><img src="' + post.poster_avatar + '" class="media-object"></a>';
			html += '</div>';
			html += '<div class="media-body"><a href="#inner-pages?page=profile&user_id=' + post.user_id + '" data-transition="slide" data-id="' + post.user_id + '"> ' + post.poster_name + '</a>';
			if(post.reply_to) {
				//console.log(post.reply_to);
				//html += post.reply_to;
				html += ' <i class="fa fa-caret-right" aria-hidden="true"></i>  <a href="#inner-pages?page=profile&user_id=' + post.reply_to.user_id + '" data-transition="slide">' + post.reply_to.name + '</a> ';
			}
			html += '<span class="comment-date">' + post.time_ago + '</span>';
			html += '</div>';
			html += '<div class="clr"></div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="panel-body" id="">';
			html += '<div class="media-post">';
			var style = 'font-size: 15px;';
			if(post.message.length < 26) {
				style = 'font-size: 26px;';
			}
			else if(post.message.length < 36) {
				style = 'font-size: 20px;';
			}

			html += '<div class="media-message" style="' + style + '" id="post-container-' + post.id + '">' + post.message + '</div>';

			if(post.media !== '' && post.media !== null && post.media !== undefined) {
				//console.log(post.media.length);
				if(post.media.length > 3) {
					html += '<div class="img-blk-full" id="img-' + post.media[0].id + '"><a href="' + common.siteURL + '/post/' + post.id + '#img-' + post.media[0].id +'"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/lib/images/status_images/' + post.media[0].file_name +  '&h=300&w=400&zc=1" class="img-responsive"></a></div>';
					html += '<div class="img-blk-third" id="img-' + post.media[1].id + '" style="margin-bottom: 5px;"><a href="' + common.siteURL + '/post/' + post.id + '#img-' + post.media[1].id +'"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/lib/images/status_images/' + post.media[1].file_name +  '&h=148&w=210&zc=1" class="img-responsive"></a></div>';
					html += '<div class="img-blk-third" id="img-' + post.media[2].id + '"><a href="' + common.siteURL + '/post/' + post.id + '#img-' + post.media[2].id +'"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/lib/images/status_images/' + post.media[2].file_name +  '&h=148&w=210&zc=1" class="img-responsive"></a></div>';
					html += '<div class="img-blk-third" id="img-' + post.media[3].id + '"><a href="' + common.siteURL + '/post/' + post.id + '#img-' + post.media[3].id +'"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/lib/images/status_images/' + post.media[3].file_name +  '&h=148&w=210&zc=1" class="img-responsive">';
					if(post.media.length > 4) {
						var count_o = post.media.length - 4;
						html += '<div class="img-blk-overlay"><div class="img-blk-overlay-number">' + count_o + '+</div></div>';
					}
					html += '</a></div>';
					html += '<div class="clr"></div>';
				}
				else if(post.media.length > 2) {
					html += '<div class="img-blk-two-thirds" id="img-' + post.media[0].id + '"><a href="' + common.siteURL + '/post/' + post.id + '#img-' + post.media[0].id + '"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/lib/images/status_images/' + post.media[0].file_name +  '&h=300&w=400&zc=1" class="img-responsive"></a></div>';
					html += '<div class="img-blk-one-thirds" id="img-' + post.media[1].id + '" style="margin-bottom: 5px;"><a href="' + common.siteURL + '/post/' + post.id + '#img-' + post.media[1].id +'"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/lib/images/status_images/' + post.media[1].file_name +  '&h=150&w=210&zc=1" class="img-responsive"></a></div>';
					html += '<div class="img-blk-one-thirds" id="img-' + post.media[2].id + '"><a href="' + common.siteURL + '/post/' + post.id + '#img-' + post.media[2].id +'"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/lib/images/status_images/' + post.media[2].file_name +  '&h=150&w=210&zc=1" class="img-responsive"></a></div>';
					html += '<div class="clr"></div>';
				}
				else if(post.media.length > 1) {
					html += '<div class="img-blk-half" id="img-' + post.media[0].id + '"><a href="' + common.siteURL + '/post/' + post.id + '#img-' + post.media[0].id +'"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/lib/images/status_images/' + post.media[0].file_name +  '&h=300&w=400&zc=1" class="img-responsive"></a></div>';
					html += '<div class="img-blk-half" id="img-' + post.media[1].id + '" style="margin-bottom: 5px;"><a href="' + common.siteURL + '/post/' + post.id + '#img-' + post.media[1].id +'"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/lib/images/status_images/' + post.media[1].file_name +  '&h=300&w=400&zc=1" class="img-responsive"></a></div>';
					html += '<div class="clr"></div>';
				}
				else {
					//if($ext == 'jpg' || $ext == 'gif') {
						html += '<div class="media-img" id="img-' + post.media[0].id + '"><a href="' + common.siteURL + '/post/' + post.id + '"><img src="' + common.siteURL + '/lib/images/status_images/' + post.media[0].file_name + '" class="img-responsive"></a></div>';
					//}
				}
			}
			html += '</div>';
			/* Interactions */
			html += '<div class="media-actions">';
			var liked_it = false;
			var like_html = '<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>';
			if(post.likes !== '' && post.likes !== null && post.likes !== undefined ) {				
				var show_likes = {};    
				for (var i = 0; i < post.likes.length; i++) {
				   	var username = post.likes[i].username,
					   name = post.likes[i].name,
					   user_id = post.likes[i].user_id;
				   	if(!show_likes[i]) {
						show_likes[i] = {};  //Create arr[type] if it doesn't exist
					}
				   	show_likes[i].username = username;
				   	show_likes[i].name = name;
				   	show_likes[i].user_id = user_id;
//console.log("USERID: " + user_id + " - USER: " + user);
					if(user_id === user) {
						liked_it = true;
						like_html = '<i class="fa fa-thumbs-up" aria-hidden="true"></i>';
						show_likes[i].name = 'You';
					}
				}
//console.log(show_likes);
				
				html += '<div class="wholiked">';
				if(post.likes.length === 1) {
					html += '<a href="#inner-pages?page=profile&user_id=' + post.likes[0].user_id + '" data-transition="slide" data-user="' + post.likes[0].username + '">' + show_likes[0].name + '</a>';
				}
				else if(post.likes.length === 2) {
					html += '<a href="#inner-pages?page=profile&user_id=' + post.likes[0].user_id + '" data-transition="slide" data-user="' + post.likes[0].username + '">' + show_likes[0].name + '</a> and <a href="#inner-pages?page=profile&user_id=' + post.likes[1].user_id + '" data-transition="slide" data-user="' + post.likes[1].username + '">'  + show_likes[1].name + '</a>';
				}
				else {
					var liked_remainder = post.likes.length - 2;
					html += '<a href="#inner-pages?page=profile&user_id=' + post.likes[0].user_id + '" data-transition="slide" data-user="' + post.likes[0].username + '">' + show_likes[0].name + '</a>, <a href="#inner-pages?page=profile&user_id=' + post.likes[1].user_id + '" data-transition="slide" data-user="' + post.likes[1].username + '">'  + show_likes[1].name + '</a> and ' + liked_remainder + ' others';
				}
				html += ' liked this post</div>';
			}

			html += '<span class="media-action-btn likePostBtn" data-id="' + post.id + '" data-user="' + user + '" id="like-btn-' + post.id + '">' + like_html + '</i>';
			
			if(post.likes !== '' && post.likes !== null && post.likes !== undefined && post.likes.length > 0) {
				html += ' (' + post.likes.length + ')';
			}
			html += '</span>';
			html += '<span class="media-action-btn dislikePostBtn" data-id="' + post.id + '" data-user="' + user + '" id="dislike-btn-' + post.id + '"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i>';
			if(post.dislikes !== '' && post.dislikes !== null && post.dislikes !== undefined && post.dislikes.length > 0) {
				html += ' (' + post.dislikes.length + ')';
			}
			html += '</span>';
			html += '<span class="media-action-btn commentPostBtn" data-id="' + post.id + '" data-user="' + user + '" id="comment-btn-' + post.id + '"><a href="post.html?post_id=' + post.id + '" data-transition="slide" data-id="' + post.id + '" data-user="' + user + '"><i class="fa fa-comments-o" aria-hidden="true"></i> Comment';
			if(post.comments !== '' && post.comments !== null && post.comments !== undefined && post.comments.length > 0) {
				html += ' (' + post.comments.length + ')';
			}
			html += '</a></span>';
			html += '<span class="media-action-btn sharePostBtn" data-id="' + post.id + '" data-user="' + user + '" id="share-btn-' + post.id + '"><i class="fa fa-share" aria-hidden="true"></i> Share';
			if(post.shares !== '' && post.shares !== null && post.shares !== undefined && post.shares.length > 0) {
				html += ' (' + post.shares.length + ')';
			}
			html += '</span>';
			html += '</div>';
			html += '</div>';
		}
		if(post.comments !== '' && post.comments !== null && post.comments !== undefined ) {	
			html += '<ul class="comments" id="comments-' + post.id + '">';
			for (var j = 0; j < post.comments.length; j++) {
				html += '<li class="media post-container-' + post.comments[j].id + '" id="panel-body-' + post.comments[j].id + '">';
				html += '<div class="media-left">';
				html += '<a href="http://cbhllc.net/profile/gary"><img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + common.siteURL + '/' + post.comments[j].avatar + '&amp;h=40&amp;w=40&amp;zc=1" class="media-object"></a></div>';
				html += '<div class="media-body"><a href="http://cbhllc.net/profile/gary" class="comment-author">' + post.comments[j].name + '</a>';
				html += '<span class="comment-date">' + post.comments[j].time_ago + '</span>';
				html += '</div>';
				html += '<div class="clr"></div>';
				html += '<div class="comments-reply" id="post-container-T">' + post.comments[j].message + '</div></li>';
			}
			html += '</ul>';
		}
		html += '</div>';
		html += '</div>';
		return html;
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
	
	var close = document.getElementsByClassName("closebtn");
	var i;

	// Loop through all close buttons
	for (i = 0; i < close.length; i++) {
		// When someone clicks on a close button
		close[i].onclick = function(){

			// Get the parent of <span class="closebtn"> (<div class="alert">)
			var div = this.parentElement;

			// Set the opacity of div to 0 (transparent)
			div.style.opacity = "0";

			// Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
			setTimeout(function(){ div.style.display = "none"; }, 600);
		};
	}
	
}());

/*
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
        console.log('calling setup push');
        app.setupPush();
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "XXXXXXXX"
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
*/