require('./Helper')();
require('./UserDAO')();

module.exports = function() { 
	var helper = new Helper();
	var userDAO = new UserDAO();

	this.TripDAO = function() {
		this.ref = 'TRIP/';
		
	} 

	TripDAO.prototype.readTripsData = function(firebase, token, callback) {
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


				firebase.database().ref(that.ref).once('value').then(function(snapshot) {
					var trips = snapshot.val();
					callback({
						responseCode : 1,
						description : "",
						data : {
							trips : trips
						}
					});
				});
			});
		});
	}

	TripDAO.prototype.searchTripsData = function(firebase, arrive, depart, duration, transfer, callback) {
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


				firebase.database().ref(that.ref).once('value').then(function(snapshot) {
					arrive = helper.U2A(arrive.toLowerCase());
					depart = helper.U2A(depart.toLowerCase());
					transfer = helper.U2A(transfer.toLowerCase());
					//console.log(arrive, depart);
					var result = [];

					snapshot.forEach(function(childSnapshot) {
						var childKey = childSnapshot.key;
						var childData = childSnapshot.val();
						
						var name = childData.name.split(' - ');
						var _arrive = helper.U2A(name[0].toLowerCase());
						var _depart = helper.U2A(name[1].toLowerCase());
						var _transfer = childData.transfer;

						var timeArrive = parseInt(childData.arrive.split('_')[1]);
						var timeDepart = parseInt(childData.depart.split('_')[1]);
						var _duration = Math.floor((timeDepart - timeArrive) / (24 * 60 * 60 * 1000) + 1);
						
						if (helper.compare(arrive, _arrive) && helper.compare(depart, _depart) && 
							(transfer == "" || transfer == _transfer) &&
							(duration == "" || parseInt(duration) == _duration)) 
							result.push(childData);

					});
					callback({
						responseCode : 1,
						description : "",
						data : {
							trips : result
						}
					});
				});
			});
		});
	}
}