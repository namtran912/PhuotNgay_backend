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
							description : "",
							data : ""
						});

			if (decoded.firebaseUid == null)
				return callback({
							responseCode : -1,
							description : "",
							data : ""
						});
			userDAO.getSignIn(decoded.firebaseUid, function(signIn) {
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

				firebase.database().ref(that.ref + '/' + id).once('value').then(function(snapshot) {
					var location = snapshot.val();
					callback({
						responseCode : 1,
						description : "",
						data : {
							locations : location
						}
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
							description : "",
							data : ""
						});

			if (decoded.firebaseUid == null)
				return callback({
							responseCode : -1,
							description : "",
							data : ""
						});
			userDAO.getSignIn(decoded.firebaseUid, function(signIn) {
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


				firebase.database().ref(that.ref).once('value').then(function(snapshot) {
					var locations = snapshot.val();
					callback({
						responseCode : 1,	
						description : "",
						data : {
							locations : locations
						}
					});
				});
			});
		});
	}
}