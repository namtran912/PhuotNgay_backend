require('./Helper')();
require('./UserDAO')();

module.exports = function() { 
    var helper = new Helper();
	var userDAO = new UserDAO();

	this.TrackDAO = function() {
		this.ref = 'TRACK/';
    }

    TrackDAO.prototype.checkSecurity = function(firebase, token, tripId, radius, callback) {
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

			userDAO.getSignIn(firebase, decoded.fbId, function(signIn) {
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

				firebase.database().ref(that.ref + tripId).once('value').then(function(snapshot) {
					if (snapshot.val() == null) 
						return callback({
							responseCode : -1,
							description : "Trip's track is not exist!"
						});

					var vectors = [];
					var fbIds = [];
					var track = snapshot.val();

					for (fbId in track) {
						var geo = Object.keys(track[fbId].geo);
						var pos = track[fbId].geo[geo[geo.length - 1]].split(", ");
						vectors.push([pos[0], pos[1]]);
						fbIds.push(fbId);
					}

					helper.checkSecurity(radius, vectors, function(cluster){
						for(i in cluster)
							console.log(fbIds[cluster[i]]);
					});
				}); 
			});
		});
    }
}