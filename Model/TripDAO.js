require('./Helper')();
require('./UserDAO')();

module.exports = function() { 
	var helper = new Helper();
	var userDAO = new UserDAO();

	this.TripDAO = function() {
		this.ref = 'TRIP/';
		this.property = ['arrive', 'cover', 'depart', 'description', 'is_published', 'name', 
						'numberOfView', 'status', 'transfer'];
		this.transfer = ['Đi bộ', 'Xe đạp', 'Xe máy', 'Xe du lịch', 'Tàu hỏa', 'Tàu thuyền']
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

						if (childData.is_published == 1)
							result.push({
								id : childKey,
								arrive : childData.arrive,
								depart : childData.depart,
								name : childData.name,
								cover : childData.cover,
								numberOfView : childData.numberOfView,
								status : childData.status
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

	TripDAO.prototype.readOwnTripsData = function(firebase, token, callback) {
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

						
						if (childData.from.fbId == decoded.fbId) {
							result.push({
								id : childKey,
								arrive : childData.arrive,
								depart : childData.depart,
								name : childData.name,
								cover : childData.cover,
								numberOfView : childData.numberOfView,
								status : childData.status
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
						if (childSnapshot.val().is_published == 1) {
							var childKey = childSnapshot.key;
							var childData = childSnapshot.val();
							
							var _arrive = helper.U2A(childData.arrive.name.toLowerCase());
							var _depart = helper.U2A(childData.depart.name.toLowerCase());
							var _transfer = childData.transfer;

							var timeArrive = parseInt(childData.arrive.time);
							var timeDepart = parseInt(childData.depart.time);
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
									numberOfView : childData.numberOfView,
									status : childData.status
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

					var role = 0;
					if (decoded.fbId == trip.from.fbId)
						role = 2;
					else 
						for (i in trip.members)
							if (trip.members[i].fbId == decoded.fbId) {
								role = 1;
								break;
							}

					var album = [];

					for (key in trip.album) {
						album.push({
							id : key,
							url : trip.album[key]
						});
					}

					callback({
						responseCode : 1,
						description : "",
						data : {
							arrive : trip.arrive,
							depart : trip.depart,
							name : trip.name,
							cover : trip.cover,
							description : trip.description,
							from : trip.from,
							is_published : trip.is_published,
							status : trip.status,
							numberOfView : trip.numberOfView,
							createdTime : trip.createdTime,
							transfer : trip.transfer,
							album : album,
							numberOfActivities : (trip.activity == null) ? 0 : Object.keys(trip.activity).length,				
							numberOfComments : (trip.comment == null) ? 0 : Object.keys(trip.comment).length,
							numberOfMembers : (trip.members == null) ? 0 : Object.keys(trip.members).length,
							role : role
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

					var activity = [];

					for (key in trip.activity) {
						activity.push({
							time : key,
							content : trip.activity[key].content
						});
					}

					callback({
						responseCode : 1,
						description : "",
						data : activity,
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

					var comment = [];

					for (key in trip.comment) {
						comment.push({
							createdTime : key,
							content : trip.comment[key].content,
							from : trip.comment[key].from
						});
					}

					callback({
						responseCode : 1,
						description : "",
						data : comment,
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
					var members = [];

					if (trip.members.hasOwnProperty(decoded.fbId)) {
						for (key in trip.members) 
							members.push({
								fbId : key,
								avatar : trip.members[key].avatar,
								name : trip.members[key].name
							});
					}

					callback({
						responseCode : 1,
						description : "",
						data : members,
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

			userDAO.getSignInAndInfo(firebase, decoded.fbId, function(signIn, firstName, lastName, avatar) {
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
					
					if (trip.members.hasOwnProperty(decoded.fbId))
						return callback({
							responseCode : 1,	
							description : "",
							data : ""
						});

					var member = {
						name : firstName + lastName,
						avatar : avatar
					};
						
					firebase.database().ref(that.ref + id + '/members' + '/' + decoded.fbId).set(member);
				
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
					if (tríp.members.hasOwnProperty(fbId)) 
						firebase.database().ref(that.ref + id + '/members' + '/' + fbId).set({});
									
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

			userDAO.getSignInAndInfo(firebase, decoded.fbId, function(signIn, firstName, lastName, avatar) {
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

					if (snapshot.val().is_published == 0) 
						return callback({
							responseCode : -1,
							description : "Trip is not published!",
							data : ""
						});
					
					var trip = snapshot.val();
					userDAO.getFCM(firebase, trip.from.fbId, function(fcm) {
						helper.sendNoti(fcm, {
											fbId : decoded.fbId,
											firstName : firstName, 
											lastName : lastName, 
											avatar : avatar
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
						name : firstName + lastName, 
						avatar : avatar
					};

					firebase.database().ref(that.ref + id + '/members' + '/' + fbId).set(member);
									
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
							name : firstName + lastName, 
							avatar : avatar
						}

						var trip = snapshot.val();

						if (trip.from.fbId == decoded.fbId)
							firebase.database().ref(that.ref + id + '/members' + '/' + fbId).set(member);
						else
							userDAO.getFCM(firebase, trip.from.fbId, function(fcm) {
								helper.sendNoti(fcm,  {
													fbId : fbId,
													firstName : firstName, 
													lastName : lastName, 
													avatar : avatar
												}, {
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

					if (data.hasOwnProperty('arrive')) {
						var info = data.arrive.split(';');
						data.arrive = {
							lat : info[0],
							lng : info[1],
							name : info[2],
							time : info[3]
						}
					}

					if (data.hasOwnProperty('depart')) {
						var info = data.depart.split(';');
						data.depart = {
							lat : info[0],
							lng : info[1],
							name : info[2],
							time : info[3]
						}
					}
					
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

	TripDAO.prototype.create = function(firebase, token, data, callback) {
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

			userDAO.getSignInAndInfo(firebase, decoded.fbId, function(signIn, firstName, lastName, avatar) {
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

				var info = data.arrive.split(';');
				data.arrive = {
					lat : info[0],
					lng : info[1],
					name : info[2],
					time : info[3]
				}

				info = data.depart.split(';');
				data.depart = {
					lat : info[0],
					lng : info[1],
					name : info[2],
					time : info[3]
				}
				
				data.createdTime = new Date().getTime();
				data.from = {
					avatar : avatar,
					fbId : decoded.fbId,
					name : firstName + lastName
				}

				var id = firebase.database().ref().child(that.ref).push().key;
				firebase.database().ref(that.ref + id).set(data);
			
				callback({
					responseCode : 1,	
					description : "",
					data : id
				});
			});
		});
	}

	TripDAO.prototype.add_Activity = function(firebase, token, id, time, content, callback) {
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

					firebase.database().ref(that.ref + id + '/activity' + '/' + time).set({
						content : content
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

	TripDAO.prototype.update_Activity = function(firebase, token, id, time, content, callback) {
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

					firebase.database().ref(that.ref + id + '/activity' + '/' + time).update({
						content : content
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

	TripDAO.prototype.delete_Activity = function(firebase, token, id, time, callback) {
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

					firebase.database().ref(that.ref + id + '/activity' + '/' + time).set({});
				
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