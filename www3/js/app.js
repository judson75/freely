// Initialize app
var App = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var serviceURL = 'http://cbhllc.net/api/v1/';
var storage = window.localStorage;
var siteURL = 'http://cbhllc.net';

// Add view
//var mainView =  App.views.create('.view-main', {
 //   dynamicNavbar: true
//});
//var mainView = App.views.create('.view-main');

setStorage('applogin', 1);
setStorage('user_id', 1);

if(isLoggedIn() !== true) {
	//mainView.router.load({pageName: 'dashboard'});
	mainView.router.navigate('welcome.html');
}
else {
	//displayHomepage();
	getHomepage();
	//displayUserNav();
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

$$(document).on('click', '.loginBtn', function(e) {
	//Validation
	e.preventDefault();
	$$('.alert').remove();
	$$('.helper').remove();
	$$('input').removeClass('error');
	var error_count = 0;
	var email = $$('#loginFrm input[name="email"]').val();
	var password = $$('#loginFrm input[name="password"]').val();
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
	if(error_count > 0) {
		loading('hide');
		return false;
	}
	
	var formData = $('#loginFrm').serializeArray();
	formData.push({name: 'format', value: 'json'});
	formData.push({name: 'method', value: 'post'});
	formData.push({name: 'action', value: 'login'});
	/*
	var request =  $.ajax({
		data: formData,
		type: "POST",
		dataType: "html",
		url: serviceURL,
		beforeSend: function() {

		}
	});
	request.done(function(data) { 
		console.log("Login DATA: " + data);
		var obj = $.parseJSON(data);
		if(obj.resp === 'success') {
			setStorage('user_id', obj.data.id);
			setStorage('email', obj.data.email);
			setStorage('name', obj.data.name);
			setStorage('username', obj.data.username);
			setStorage('applogin', 1);
			$$.mobile.navigate("index.html", {transition: "slide"});
		}
		else {
			$('#registerFrm').prepend('<div class="alert alert-danger">' + obj.data + '</div>');
		}
	});
	request.fail(function(jqXHR, textStatus, thrownError) {			
		console.log("Login Error: " + textStatus + ' - ' + thrownError);
		console.log("Request (error): " + textStatus + " - " + thrownError + " - " + JSON.stringify(jqXHR));
	});
	*/
	
	$$.ajax({
		url : serviceURL,
		type : 'POST',
		crossDomain: true,
		data : {
			'method': 'post',
			'action': 'login',
			'format': 'json',
			'email': email, 
			'password': password
		},
		dataType: 'html',
		beforeSend: function() {
			loading('show');
		},
		success : function(data) {
			console.log('Data: ' + data);
			var obj = $.parseJSON(data);
			/*console.log('Resp: ' + obj.code); */
			if(obj.resp === 'success') {
				setStorage('user_id', obj.data.id);
				setStorage('email', obj.data.email);
				setStorage('name', obj.data.name);
				setStorage('username', obj.data.username);
				setStorage('applogin', 1);
				$$.mobile.navigate("index.html", {transition: "slide"});
			}
			else {
				$$('#registerFrm').prepend('<div class="alert alert-danger">' + obj.data + '</div>');
			}
		},
		error : function(xhr, status, error) {
			//$('.login-screen-title').after('<div class="alert alert-error">An unknown error occured</div>');
			//console.log("Request (error): " + error + " - " + JSON.stringify(request));
			console.log("Request (error): " + status + " - " + error + " - " + JSON.stringify(xhr));
			//var err = eval("(" + xhr.responseText + ")");
			//var err = JSON.parse(xhr.responseText);
  			//console.log(err.Message);
			loading('hide');
		}
	});


});

function loading(method) {
	if(method === 'show' || method === '') {
		$('body').append('<div class="page-overlay"><div class="loading"><span style="width:42px; height:42px" class="preloader preloader-white"></span></div></div>');
	}
	else if(method === 'hide') {
		$('.page-overlay').fadeOut('fast', function() {
			$(this).remove();
		});
	}
}

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
		storage.removeItem('name');
		storage.removeItem('username');
		storage.removeItem('email');
	}
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

/*
function displayHomepage() {
	var html = getHomepage();
	console.log("HTML: " + html);
	$('.ui-content').html(html);
}
*/

function getHomepage() {
	var user = getStorage("user_id");
	var registrationId = getStorage("registrationId");
	if(registrationId !== '' && registrationId !== null) {
		setRegistrationId();
	}
//	console.log("USER: " + user);
//	return false;
	//$.support.cors = true;
	//loading('show');
	App.preloader.show();
	App.request.get(serviceURL, { format: 'json', method: 'get', action : 'home_feed', user : user }, function (data) {
	  //$$('.articles').html(data);
	  	console.log('Load was performed');
	}, function (xhr, status) {
		console.log("home Error: " + status + ' - ' +  JSON.stringify(xhr));
	});
	/*
	var request =  $.ajax({
		data: ({format: 'json', method: 'get', action : 'home_feed', user : user}),
		type: "GET",
		crossDomain: true,
		dataType: "json",
		url: serviceURL,
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
			loading('hide');
			//return html;
			$('.ui-content').html(html);
		}
	});
	request.fail(function(jqXHR, textStatus, thrownError) {			
		console.log("home Error: " + textStatus + ' - ' + thrownError + " - " +  JSON.stringify(jqXHR));
		
	});
	*/
}

function displayUserNav() {
	var user = getStorage("user_id");
	var request =  $.ajax({
		data: ({format: 'json', method: 'get', action : 'user_details', user : user}),
		type: "GET",
		dataType: "html",
		url: serviceURL,
		beforeSend: function() {

		}
	});
	request.done(function(data) { 
		//console.log("User Details DATA: " + data);
		var obj = $.parseJSON(data);
		if(obj.resp === 'success') {
			$('.nav-avatar').html('<a href="#profile_menu"><img src="' + siteURL + '/lib/php/timthumb.php?src=' + siteURL + '/' + obj.user.avatar + '&amp;h=45&amp;w=45&amp;zc=1"></a>');
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
					profile_nav += '<img src="' + common.siteURL +'/lib/php/timthumb.php?src=' + siteURL + '/' + friend.avatar + '&h=25&w=25&zc=1" class="media-object">';
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
					profile_nav += '<img src="' + common.siteURL + '/lib/php/timthumb.php?src=' + siteURL + '/' + group.group_avatar + '&h=25&w=25&zc=1" class="media-object">';
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
	var user = getStorage("user_id");
	var registrationId = getStorage("registrationId");
	var request =  $.ajax({
		data: ({format: 'json', method: 'post', action : 'push_token', user : user, token : registrationId}),
		type: "POST",
		dataType: "html",
		url: common.serviceURL,
		beforeSend: function() {

		}
	});
	request.done(function(data) { 
		console.log("Push Token DATA: " + data);
		//alert("Push Token DATA: " + data);
		var obj = $.parseJSON(data);
	});
	request.fail(function(jqXHR, textStatus, thrownError) {			
		console.log("Push Token Error: " + textStatus + ' - ' + thrownError);
	});
}

function postDisplay(post, user) {
	var html = '';
	//console.log(post.id);
	if(post.is_ad === true) {
		///echo '<pre>';print_r($post); echo '</pre>';
		html += '<div class="timeline-block">';
		html += '<div class="panel panel-default post-container-' + post.id + '" id="panel-body-' + post.id + '">';
		html += '<div class="panel-preheader"><i class="fa fa-newspaper-o" aria-hidden="true"></i> <b>Sponsored Ad</b></div>';
		html += '<img src="' + siteURL + '/lib/images/ad_images/' + post.ad_media + '" style="display: block; width: 100%;">';
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
				if(user_id === user) {
					liked_it = true;
					like_html = '<i class="fa fa-thumbs-up" aria-hidden="true"></i>';
					show_likes[i].name = 'You';
				}
			}

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
