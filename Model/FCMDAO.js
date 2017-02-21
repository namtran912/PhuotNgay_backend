require('./Helper')();
require('./UserDAO')();

module.exports = function() { 
	var helper = new Helper();
	var userDAO = new UserDAO();
	
	this.FCMDAO = function() {
		this.ref = 'FCM/';		
	} 

	FCMDAO.prototype.getFCM = function(firebase, fbId, callback) {
		firebase.database().ref(this.ref + fbId).once('value').then(function(snapshot) {;
			callback(snapshot.val());
		});
	}

	FCMDAO.prototype.update = function(firebase, token, fcm, callback) {
		var that = this;
		helper.verifyToken(token, function(decoded){
			if (decoded == null) 
				return callback({
							responseCode : -1,
							description : "",
							data : ""
						});

			if (decoded.firebaseUid == null)
				return callback({
							responseCode : -1,
							description : "",
							data : ""
						});
			userDAO.getSignIn(firebase, decoded.firebaseUid, function(signIn) {
				if (signIn == null) 
					return callback({
							responseCode : -1,
							description : "",
							data : ""
						});

				if (signIn != decoded.signIn) 
					return callback({
							responseCode : -1,
							description : "",
							data : ""
						});

				firebase.database().ref(that.ref + decoded.fbId).set(fcm);

				callback({
					responseCode : 1,
					description : "",
					data : ""
				});
			});
		});
	}
}