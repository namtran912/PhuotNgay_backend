require('./Helper')();
require('./UserDAO')();

module.exports = function() { 
	var helper = new Helper();
	var userDAO = new UserDAO();

	this.TripDAO = function() {
		this.ref = 'TRIP/';
		this.property = ['arrive', 'cover', 'depart', 'description', 'from', 'is_published', 'name', 'ranking', 'status', 'transfer'];
		
	} 

	TripDAO.prototype.readTripsData = function(firebase, token, callback) {
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
					var result = [];

					snapshot.forEach(function(childSnapshot) {
						var childKey = childSnapshot.key;
						var childData = childSnapshot.val();

						if (childData.is_published == 'true')
							result.push({
								id : childKey,
								arrive : childData.arrive,
								depart : childData.depart,
								name : childData.name,
								cover : childData.cover,
								ranking : childData.ranking,
								createdTime : childData.createdTime
							});
					});

					callback({
							responseCode : 1,
							description : "",
							data : result
						});
				});
			});
		});
	}

	TripDAO.prototype.searchTripsData = function(firebase, token, arrive, depart, duration, transfer, callback) {
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
					arrive = helper.U2A(arrive.toLowerCase());
					depart = helper.U2A(depart.toLowerCase());
					transfer = helper.U2A(transfer.toLowerCase());
					var result = [];

					snapshot.forEach(function(childSnapshot){ 
						if (childSnapshot.val().is_published == 'true') {
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
								result.push({
									id : childKey,
									arrive : childData.arrive,
									depart : childData.depart,
									name : childData.name,
									cover : childData.cover,
									ranking : childData.ranking,
									createdTime : childData.createdTime
								});
						}
					});
					callback({
						responseCode : 1,
						description : "",
						data : result
					});
				});
			});
		});
	}

	TripDAO.prototype.readTripsDataById = function(firebase, token, id, callback) {
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
					var trip = snapshot.val();
					if (trip == null)
						return callback({
							responseCode : 1,
							description : "",
							data : null
						});
					callback({
						responseCode : 1,
						description : "",
						data : {
							arrive : trip.arrive,
							depart : trip.depart,
							name : trip.name,
							cover : trip.cover,
							ranking : trip.ranking,
							createdTime : trip.createdTime,
							description : trip.description
						}
					});
				});
			});
		});
	}

	TripDAO.prototype.readTripsDataById_Activity = function(firebase, token, id, callback) {
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
					var trip = snapshot.val();
					if (trip == null)
						return callback({
							responseCode : 1,
							description : "",
							data : null
						});
					callback({
						responseCode : 1,
						description : "",
						data : trip.activity,
					});
				});
			});
		});
	}

	TripDAO.prototype.readTripsDataById_Album = function(firebase, token, id, callback) {
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
					var trip = snapshot.val();
					if (trip == null)
						return callback({
							responseCode : 1,
							description : "",
							data : null
						});
					callback({
						responseCode : 1,
						description : "",
						data : trip.album,
					});
				});
			});
		});
	}

	TripDAO.prototype.readTripsDataById_Comment = function(firebase, token, id, callback) {
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
					var trip = snapshot.val();
					if (trip == null)
						return callback({
							responseCode : 1,
							description : "",
							data : null
						});
					callback({
						responseCode : 1,
						description : "",
						data : trip.comment,
					});
				});
			});
		});
	}

	TripDAO.prototype.readTripsDataById_Members = function(firebase, token, id, callback) {
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
					var trip = snapshot.val();
					if (trip == null)
						return callback({
							responseCode : 1,
							description : "",
							data : null
						});
					callback({
						responseCode : 1,
						description : "",
						data : trip.members,
					});
				});
			});
		});
	}

	TripDAO.prototype.acceptToJoin = function(firebase, token, id, callback) {
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

			userDAO.getSignInAndInfo(firebase, decoded.fbId, function(signIn, firstName, lastName, fbAvatar) {
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
					if (snapshot.val() == null) 
						return callback({
							responseCode : -1,
							description : "Trip is not exist!",
							data : ""
						});
					
					var trip = snapshot.val();
					
					for (i in trip.members)
						if (trip.members[i].fbId == decoded.fbId)
							return callback({
								responseCode : 1,	
								description : "",
								data : ""
							});

					var member = {
						fbId : decoded.fbId,
						firstName : firstName,
						lastName : lastName,
						avatar : fbAvatar
					};
						
					firebase.database().ref(that.ref + id + '/members' + '/' + trip.members.length).set(member);
				
					callback({
						responseCode : 1,	
						description : "",
						data : ""
					});
				});
			});
		});
	}

	TripDAO.prototype.kickMember = function(firebase, token, id, fbId, callback) {
		if (!helper.isFbId(fbId))
			return callback({
							responseCode : -1,
							description : "FbId is incorrect",
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
					if (snapshot.val() == null) 
						return callback({
							responseCode : -1,
							description : "Trip is not exist!",
							data : ""
						});

					if (snapshot.val().from != decoded.fbId)
						return callback({
							responseCode : -1,
							description : "User is not Trip's admin!",
							data : ""
						});
					
					var tríp = snapshot.val();
					for (i in tríp.members)
						if (tríp.members[i].fbId == fbId) {
							firebase.database().ref(that.ref + id + '/members' + '/' + i).set({});
							break;
						}
									
					callback({
						responseCode : 1,	
						description : "",
						data : ""
					});
				});
			});
		});
	}

	TripDAO.prototype.joinTrip = function(firebase, token, id, callback) {
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

			userDAO.getSignInAndInfo(firebase, decoded.fbId, function(signIn, firstName, lastName, fbAvatar) {
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
					if (snapshot.val() == null) 
						return callback({
							responseCode : -1,
							description : "Trip is not exist!",
							data : ""
						});
					
					var trip = snapshot.val();
					userDAO.getFCM(firebase, trip.from, function(fcm) {
						helper.sendNoti(fcm, {
											fbId : decoded.fbId,
											firstName : firstName, 
											lastName : lastName, 
											fbAvatar : fbAvatar
										}, {
											body : "Join",
											title : "Join",
											icon : "Join"
										});
					});
				
					callback({
						responseCode : 1,	
						description : "",
						data : ""
					});
				});
			});
		});
	}

	TripDAO.prototype.verifyToJoin = function(firebase, token, id, fbId, firstName, lastName, avatar, callback) {
		if (!helper.isFbId(fbId))
			return callback({
							responseCode : -1,
							description : "FbId is incorrect",
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
					if (snapshot.val() == null) 
						return callback({
							responseCode : -1,
							description : "Trip is not exist!",
							data : ""
						});

					if (snapshot.val().from != decoded.fbId)
						return callback({
							responseCode : -1,
							description : "User is not Trip's admin!",
							data : ""
						});
					
					var member = {
						fbId : fbId,
						firstName : firstName, 
						lastName : firstName, 
						avatar : avatar,
					};

					firebase.database().ref(that.ref + id + '/members' + '/' + snapshot.val().members.length).set(member);
									
					callback({
						responseCode : 1,	
						description : "",
						data : ""
					});
				});
			});
		});
	}

	TripDAO.prototype.addMember = function(firebase, token, id, fbId, callback) {
		if (!helper.isFbId(fbId))
			return callback({
							responseCode : -1,
							description : "FbId is incorrect",
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
					if (snapshot.val() == null) 
						return callback({
							responseCode : -1,
							description : "Trip is not exist!",
							data : ""
						});

					userDAO.getSignInAndInfo(firebase, fbId, function(signIn, firstName, lastName, avatar) {
						if (signIn == null) 
							return callback({
									responseCode : -1,
									description : "User is not exist!",
									data : ""
								});	

						var member = {
							fbId : fbId, 
							firstName : firstName, 
							lastName : lastName, 
							avatar : avatar
						}

						var trip = snapshot.val();

						if (trip.from == decoded.fbId)
							firebase.database().ref(that.ref + id + '/members' + '/' + trip.members.length).set(member);
						else
							userDAO.getFCM(firebase, trip.from, function(fcm) {
								helper.sendNoti(fcm, member, {
													body : "Add",
													title : "Add",
													icon : "Add"
												});
							});
										
						callback({
							responseCode : 1,	
							description : "",
							data : ""
						});
					});	
				});
			});
		});
	}

	TripDAO.prototype.update = function(firebase, token, id, data, callback) {
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
					if (snapshot.val() == null) 
						return callback({
							responseCode : -1,
							description : "Trip is not exist!",
							data : ""
						});

					if (snapshot.val().from != decoded.fbId)
						return callback({
							responseCode : -1,
							description : "User is not Trip's admin!",
							data : ""
						});

					//data.updateTime = new Date().getTime();
					firebase.database().ref(that.ref + id).update(data);
				
					callback({
						responseCode : 1,	
						description : "",
						data : ""
					});
				});
			});
		});
	}
}