require('./Helper')();
require('./UserDAO')();
require('./NotificationDAO')();

module.exports = function() { 
    var helper = new Helper();
	var userDAO = new UserDAO();
	var notificationDAO = new NotificationDAO();

	this.MapDAO = function() {
		this.ref = 'MAP/';
		this.tripRef = 'TRIP/';
		this.trackRef = 'TRACK/';
    }

    MapDAO.prototype.checkSecurity = function(firebase, token, tripId, callback) {
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

				firebase.database().ref(that.trackRef + tripId).once('value').then(function(snapshot) {
					if (snapshot.val() == null) 
						return callback({
							responseCode : -1,
							description : "Trip's track is not exist!"
						});

					var track = snapshot.val();

					firebase.database().ref(that.ref + tripId).once('value').then(function(_snapshot) {
						if (_snapshot.val() == null) 
							return callback({
								responseCode : -1,
								description : "Trip's map is not exist!"
							});

						var security = _snapshot.val().security;
						var cores = [];

						for (i in security.core) {
							if (!track.hasOwnProperty(security.core[i]))
								return callback({
									responseCode : -1,
									description : security.core[i] + "Trip's track is not exist!"
								});
							
							var pos = track[security.core[i]].lastGps.split(', ');
							cores.push([pos[0], pos[1], security.core[i]]);
						}

						var result = [];

						for (fbId in track) 
							if (!security.core.includes(fbId) && track[fbId].hasOwnProperty('lastGps')) {
								var pos = track[fbId].lastGps.split(', ');

								var dMin = 0;
								var coreMin = null;
								for (i in cores) {
									var dis = helper.getDistance(parseFloat(pos[0]), parseFloat(pos[1]), 
																parseFloat(cores[i][0]), parseFloat(cores[i][1]));
									if (dis <= security.radius) 
										break;					
									else if (dis < dMin || coreMin == null) {
										dMin = dis;
										coreMin = cores[i][2];
									}

								}

								if (coreMin != null)	
									result.push([fbId, coreMin]);
							}

						if (result.length > 0)	
						firebase.database().ref(that.tripRef + tripId).once('value').then(function(__snapshot) {
							if (__snapshot.val() == null) 
								return callback({
									responseCode : -1,
									description : "Trip is not exist!"
								});

							var trip = __snapshot.val();

							for (i in result) 
								(function() {
									var i = this;
									userDAO.getSignInAndInfo(firebase, result[i][0], function(signIn, name, avatar) {
									userDAO.getSignInAndInfo(firebase, result[i][1], function(signIn, _name, _avatar) {
										var message = [];
										message.push("Bạn đang đi quá xa với nhóm người hướng dẫn. Hãy liên hệ với người gần bạn nhất là <b>" + _name  + "</b>");
										message.push("<b>" + name  + "</b> đang đi quá xa với nhóm người hướng dẫn. Bạn là người hướng dẫn gần nhất có thể giúp đỡ!");
										var names = [name, _name];
										var avatars = [avatar, _avatar];

										for (j = 0; j < 2; j++) 
											(function() {
												var j = this;
												var info = {
													from : {
														fbId : result[i][j],
														name : names[j], 
														avatar : avatars[j]
													},
													trip : {
														tripId : tripId,
														cover : trip.cover,
														name : trip.name
													},
													message : message[j]
												};

												userDAO.getFCM(firebase, result[i][j], function(fcm) {
													notificationDAO.addNoti(firebase, result[i][j], info, 4, function(notiId){
														if (notiId.success == 1) 									
															helper.sendNoti(fcm, {}, {
																			title : "IZIGO",
																			body : message[j],
																			icon : "#"
																		});										
													});			
												});
											}).call(j);
									});
									});
								}).call(i);

							callback({
								responseCode : 1,	
								description : ""
							});
						});
					});
				}); 
			});
		});
	}

	MapDAO.prototype.setSecurity = function(firebase, token, tripId, radius, core, callback) {
		if (isNaN(radius))
			return callback({
				responseCode : -1,
				description : "Radius is not a number!"
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

				firebase.database().ref(that.tripRef + tripId).once('value').then(function(snapshot) {
					if (snapshot.val() == null) 
						return callback({
							responseCode : -1,
							description : "Trip is not exist!"
						});

					if (snapshot.val().from.fbId != decoded.fbId) 
						return callback({
							responseCode : -1,
							description : "User is not Trip's Admin!"
						});

					var trip = snapshot.val();
					var cores = core.split(';'); 
			
					for (i in cores) 
						if (!trip.members.hasOwnProperty(cores[i]) && trip.from.fbId != cores[i]) 
							return callback({
								responseCode : -1,
								description : cores[i] + " is not Trip's member or Trip's admin!"
							});

					firebase.database().ref(that.ref + tripId + '/security').set({ 
						core : cores,
						radius : parseInt(radius)
					}); 

					callback({
						responseCode : 1,	
						description : ""
					});
				}); 
			});
		});
    }
}