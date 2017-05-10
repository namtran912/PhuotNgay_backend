require('./Helper')();
var request = require('request');

module.exports = function() { 
	var helper = new Helper();

	this.UserDAO = function() {
		this.ref = 'USER/';		
		this.property = ['avatar', 'dateOfBirth', 'email', 'fcm', 'firebaseUid', 'name', 
						'gender', 'memberShip', 'signIn'];
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
			callback(snapshot.val().signIn, snapshot.val().name, snapshot.val().avatar);
		});
	}

	UserDAO.prototype.readUserById = function(firebase, token, callback) {
		var that = this;
		helper.verifyToken(token, function(decoded){
			if (decoded == null) 
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!"
						});

			if (decoded.fbId == null)
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!"
						});

			that.getSignIn(firebase, decoded.fbId, function(signIn) {
				if (signIn == null) 
					return callback({
							responseCode : -1,
							description : "Authen is incorrect!"
						});

				if (signIn != decoded.signIn) 
					return callback({
							responseCode : 0,
							description : "Authen is expired"
						});

				firebase.database().ref(that.ref + decoded.fbId).once('value').then(function(snapshot) {
					var user = snapshot.val();
					callback({
						responseCode : 1,
						description : "",
						data : {
							avatar : user.avatar,
							dateOfBirth : user.dateOfBirth,
							name : user.name,
							gender : user.gender,
							memberShip : user.memberShip,
							email : user.email
						}
					});
				});
			});
		});
	}

	UserDAO.prototype.login = function(firebase, fbToken, firebaseUid, fbId, email, fcm, name, avatar, gender, callback) {
		if (!helper.isEmail(email) || !helper.isFbId(fbId))
			return callback({
							responseCode : -1,
							description : "Email or fbId is incorrect"
					});

		var that = this;

		var url = 'https://graph.facebook.com/v2.8/me?access_token=' + fbToken;
		request(url, function (error, response, body) {
			if (response.statusCode != 200)
				return callback({
					responseCode : -1,
					description : "FacebookToken incorrect!"
				});

			var _body = JSON.parse(body);
			if (_body.id != fbId) 
				return callback({
					responseCode : -1,
					description : "FacebookId does not match!"
				});

			var now = new Date().getTime();
			var expireTime = now + helper.expireTime * 1000;

			firebase.database().ref(that.ref + fbId).once('value').then(function(snapshot) {
				if (snapshot.val() != null) {
					if (snapshot.val().firebaseUid != firebaseUid)
						return callback({
								responseCode : -1,
								description : "firebaseUid and fbId are incorrect"
							});

					firebase.database().ref(that.ref + fbId).set({
						avatar : avatar,
						email : email,
						firebaseUid : firebaseUid,
						name : name,
						gender : gender,
						memberShip : snapshot.val().memberShip,
						dateOfBirth : snapshot.val().dateOfBirth,
						signIn : now,
						fcm : fcm
					});
					
					return callback({
						responseCode : 1,
						description : "",
						data : {
								token : helper.genToken({
									firebaseUid : firebaseUid,
									fbId : fbId,
									signIn : now
								}),
								expired : expireTime
						}
					});
				}

				helper.sendEmail(email, "Welcome to PhuotNgay", "Welcome to PhuotNgay");
				
				firebase.database().ref(that.ref + fbId).set({
					avatar : avatar,
					email : email,
					firebaseUid : firebaseUid,
					name : name,
					gender : gender,
					memberShip : now,
					dateOfBirth : "--/--/----",
					signIn : now,
					fcm : fcm
				});

				callback({
					responseCode : 1,
					description : "",
					data : {
							token : helper.genToken({
								firebaseUid : firebaseUid,
								fbId : fbId,
								signIn : now
							}),
							expired : expireTime
					}
				});
			});
		});
	}

	UserDAO.prototype.update = function(firebase, token, data, callback) {
		if (data.hasOwnProperty('email') && !helper.isEmail(data.email))
			return callback({
							responseCode : -1,
							description : "Email is incorrect!"
					});

		if (data.hasOwnProperty('dateOfBirth') && !helper.isDayOfBirth(data.dateOfBirth))
			return callback({
							responseCode : -1,
							description : "DateOfBirth is incorrect!"
					});
		for (key in data) 
			if (this.property.indexOf(key) == -1 ||  data[key] == "")
				return callback({
							responseCode : -1,
							description : "Request body is incorrect!"
					});

		var that = this;
		helper.verifyToken(token, function(decoded){
			if (decoded == null) 
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!"
						});

			if (decoded.fbId == null)
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!"
						});

			that.getSignIn(firebase, decoded.fbId, function(signIn) {
				if (signIn == null) 
					return callback({
							responseCode : -1,
							description : "Authen is incorrect!"
						});

				if (signIn != decoded.signIn) 
					return callback({
							responseCode : 0,
							description : "Authen is expired"
						});

				firebase.database().ref(that.ref + decoded.fbId).update(data);

				callback({
					responseCode : 1,
					description : ""
				});
			});
		});
	}

	UserDAO.prototype.getListFriends = function(firebase, token, fbToken, callback) {
		var that = this;
		helper.verifyToken(token, function(decoded){
			if (decoded == null) 
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!"
						});

			if (decoded.fbId == null)
				return callback({
							responseCode : -1,
							description : "Authen is incorrect!"
						});

			that.getSignIn(firebase, decoded.fbId, function(signIn) {
				if (signIn == null) 
					return callback({
							responseCode : -1,
							description : "Authen is incorrect!"
						});

				if (signIn != decoded.signIn) 
					return callback({
							responseCode : 0,
							description : "Authen is expired"
						});

				var url = 'https://graph.facebook.com/v2.8/' + decoded.fbId + '/friends?access_token=' + fbToken;

				request(url, function (error, response, body) {
					if (response.statusCode != 200)
						return callback({
							responseCode : -1,
							description : "Error Graph API!"
						});
						
					var _body = JSON.parse(body);
					result = [];
					
					for(i in _body.data) 
						firebase.database().ref(that.ref + _body.data[i].id).once('value').then(function(snapshot) {
							result.push({
								fbId : snapshot.key,
								name : snapshot.val().name,
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