require('./Helper')();
var request = require('request');

module.exports = function() { 
	var helper = new Helper();

	this.UserDAO = function() {
		this.ref = 'USER/';		
		this.property = ['avatar', 'dateOfBirth', 'email', 'fcm', 'firebaseUid', 'firstName', 
						'gender', 'lastName', 'memberShip', 'signIn'];
	} 

	UserDAO.prototype.getFCM = function(firebase, fbId, callback) {
		firebase.database().ref(this.ref + fbId).once('value').then(function(snapshot) {
			if (snapshot.val() == null) 
				return callback(null);
			callback(snapshot.val().fcm);
		});
	}

	UserDAO.prototype.getSignIn = function(firebase, fbId, callback) {
		firebase.database().ref(this.ref + fbId).once('value').then(function(snapshot) {
			if (snapshot.val() == null) 
				return callback(null);
			callback(snapshot.val().signIn);
		});
	}

	UserDAO.prototype.getSignInAndInfo = function(firebase, fbId, callback) {
		firebase.database().ref(this.ref + fbId).once('value').then(function(snapshot) {
			if (snapshot.val() == null) 
				return callback(null);
			callback(snapshot.val().signIn, snapshot.val().firstName, snapshot.val().lastName, snapshot.val().avatar);
		});
	}

	UserDAO.prototype.readUserById = function(firebase, token, callback) {
		var that = this;
		helper.verifyToken(token, function(decoded){
			if (decoded == null) 
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!",
							data : ""
						});

			if (decoded.fbId == null)
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!",
							data : ""
						});

			that.getSignIn(firebase, decoded.fbId, function(signIn) {
				if (signIn == null) 
					return callback({
							responseCode : -1,
							description : "Authen is incorrect!",
							data : ""
						});

				if (signIn != decoded.signIn) 
					return callback({
							responseCode : 0,
							description : "Authen is expired",
							data : ""
						});

				firebase.database().ref(that.ref + decoded.fbId).once('value').then(function(snapshot) {
					callback({
						responseCode : 1,
						description : "",
						data : snapshot.val()
					});
				});
			});
		});
	}

	UserDAO.prototype.login = function(firebase, firebaseUid, fbId, email, fcm, callback) {
		if (!helper.isEmail(email) || !helper.isFbId(fbId))
			return callback({
							responseCode : -1,
							description : "Email or fbId is incorrect",
							data : ""
					});

		var that = this;
		var now = new Date().getTime();
		firebase.database().ref(this.ref + fbId).once('value').then(function(snapshot) {
			if (snapshot.val() != null) {
				if (snapshot.val().firebaseUid != firebaseUid)
					return callback({
							responseCode : -1,
							description : "firebaseUid and fbId are incorrect",
							data : ""
						});

				firebase.database().ref(that.ref + fbId).set({
					avatar : snapshot.val().avatar,
					email : email,
					firebaseUid : firebaseUid,
					firstName : snapshot.val().firstName,
					gender : snapshot.val().gender,
					lastName : snapshot.val().lastName,
					memberShip : snapshot.val().memberShip,
					dateOfBirth : snapshot.val().dateOfBirth,
					signIn : now,
					fcm : fcm
				});
				
				return callback({
					responseCode : 1,
					description : "",
					data : helper.genToken({
							firebaseUid : firebaseUid,
							fbId : fbId,
							signIn : now
						})
				});
			}

			helper.sendEmail(email, "Welcome to PhuotNgay", "Welcome to PhuotNgay");
			
			firebase.database().ref(that.ref + fbId).set({
				avatar : "",
				email : email,
				firebaseUid : firebaseUid,
				firstName : "",
				gender : "",
				lastName : "",
				memberShip : now,
				dateOfBirth : "",
				signIn : now,
				fcm : fcm
			});

			callback({
				responseCode : 1,
				description : "",
				data : helper.genToken({
						firebaseUid : firebaseUid,
						fbId : fbId,
						signIn : now
					})
			});
		});
	}

	UserDAO.prototype.update = function(firebase, token, data, callback) {
		if (data.hasOwnProperty('email') && !helper.isEmail(data.email))
			return callback({
							responseCode : -1,
							description : "Email is incorrect!",
							data : ""
					});

		if (data.hasOwnProperty('dateOfBirth') && !helper.isDayOfBirth(data.dateOfBirth))
			return callback({
							responseCode : -1,
							description : "DateOfBirth is incorrect!",
							data : ""
					});
		for (key in data) 
			if (this.property.indexOf(key) == -1 ||  data[key] == "")
				return callback({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
					});

		var that = this;
		helper.verifyToken(token, function(decoded){
			if (decoded == null) 
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!",
							data : ""
						});

			if (decoded.fbId == null)
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!",
							data : ""
						});

			that.getSignIn(firebase, decoded.fbId, function(signIn) {
				if (signIn == null) 
					return callback({
							responseCode : -1,
							description : "Authen is incorrect!",
							data : ""
						});

				if (signIn != decoded.signIn) 
					return callback({
							responseCode : 0,
							description : "Authen is expired",
							data : ""
						});

				firebase.database().ref(that.ref + decoded.fbId).update(data);

				callback({
					responseCode : 1,
					description : "",
					data : ""
				});
			});
		});
	}

	UserDAO.prototype.getListFriends = function(firebase, token, access_token, callback) {
		var that = this;
		helper.verifyToken(token, function(decoded){
			if (decoded == null) 
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!",
							data : ""
						});

			if (decoded.fbId == null)
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!",
							data : ""
						});

			that.getSignIn(firebase, decoded.fbId, function(signIn) {
				if (signIn == null) 
					return callback({
							responseCode : -1,
							description : "Authen is incorrect!",
							data : ""
						});

				if (signIn != decoded.signIn) 
					return callback({
							responseCode : 0,
							description : "Authen is expired",
							data : ""
						});

				var url = 'https://graph.facebook.com/v2.8/' + decoded.fbId + '/friends?access_token=' + access_token;

				request(url, function (error, response, body) {
					if (response.statusCode != 200)
						return callback({
							responseCode : -1,
							description : "Error Graph API!",
							data : ""
						});
						
					var _body = JSON.parse(body);
					result = [];
					
					for(i in _body.data) 
						firebase.database().ref(that.ref + _body.data[i].id).once('value').then(function(snapshot) {
							result.push({
								fbId : snapshot.key,
								name : snapshot.val().firstName + ' ' + snapshot.val().lastName,
								avatar : snapshot.val().avatar
							});

							if (snapshot.key == _body.data[_body.data.length - 1].id)
								return callback({
									responseCode : 1,
									description : "",
									data : result
								}); 
						});

					if (_body.data.length == 0)
						 callback({
								responseCode : 1,
								description : "",
								data : []
							}); 
					
				});	
			});
		});
	}
}