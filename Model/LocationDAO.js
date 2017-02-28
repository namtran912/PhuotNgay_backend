require('./Helper')();
require('./UserDAO')();

module.exports = function() { 
	var helper = new Helper();
	var userDAO = new UserDAO();
	
	this.LocationDAO = function() {
		this.ref = 'LOCATION/';		
	} 

	LocationDAO.prototype.searchLocationData = function(firebase, token, id, callback) {
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

			userDAO.getSignIn(firebase, decoded.fbId, function(signIn) {
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

				firebase.database().ref(that.ref + id).once('value').then(function(snapshot) {
					var location = snapshot.val();
					callback({
						responseCode : 1,
						description : "",
						data :  location
					});
				});
			});
		});
	}

	LocationDAO.prototype.readLocationData = function(firebase, token, callback) {
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

			userDAO.getSignIn(firebase, decoded.fbId, function(signIn) {
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

				firebase.database().ref(that.ref).once('value').then(function(snapshot) {
					var locations = snapshot.val();
					callback({
						responseCode : 1,	
						description : "",
						data : locations
					});
				});
			});
		});
	}
}