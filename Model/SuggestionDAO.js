require('./Helper')();
require('./UserDAO')();

module.exports = function() { 
    var helper = new Helper();
	var userDAO = new UserDAO();

	this.SuggestionDAO = function() {
		this.ref = 'SUGGESTION/';
		this.radius = 5000;
		this.list = {};
    }

	SuggestionDAO.prototype.addSuggestList = function(firebase, data, callback) {
		var id = firebase.database().ref().child(this.ref).push().key;
		firebase.database().ref(this.ref + id).set(data);
		callback({
			responseCode : 1,
			description : ""
		});
	}

	SuggestionDAO.prototype.updateSuggestList = function(firebase, callback) {
		var that = this;
		firebase.database().ref(this.ref).once('value').then(function(snapshot) {
			if (snapshot.val() == null) 
				return callback({
					responseCode : -1,
					description : "Suggest is not exist!"
				});

			that.list = [];

			snapshot.forEach(function(childSnapshot) {
				var childKey = childSnapshot.key;
				var childData = childSnapshot.val();
				childData.id = childKey;

				that.list.push(childData);
			});

			callback({
				responseCode : 1,
				description : ""
			});
		});
	}

    SuggestionDAO.prototype.getSuggestList = function(firebase, token, lat, long, callback) {
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

				
					var result = [];
					for (i in that.list) {
						var pos = that.list[i].location.split(', ');
						if (helper.getDistance(parseFloat(lat), parseFloat(long), parseFloat(pos[0]), parseFloat(pos[1])) <= that.radius)
							result.push(that.list[i]);
					}

					callback({
						responseCode : 1,
						description : "",
						data : result
					});
			});
		});
    }
}