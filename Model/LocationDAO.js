require('./Helper')();

module.exports = function() { 
	var helper = new Helper();
	
	this.LocationDAO = function() {
		this.ref = 'LOCATION/';		
	} 

	LocationDAO.prototype.searchLocationData = function(firebase, token, id, callback) {
		var that = this;
		helper.verifyToken(token, function(firebaseUid){
			if (firebaseUid == null)
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
	}

	LocationDAO.prototype.readLocationData = function(firebase, token, callback) {
		var that = this;
		helper.verifyToken(token, function(firebaseUid){
			if (firebaseUid == null)
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
	}
}