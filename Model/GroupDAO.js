require('./Helper')();
require('./UserDAO')();

module.exports = function() { 
	var helper = new Helper();
	var userDAO = new UserDAO();
	
	this.GroupDAO = function() {
		this.ref = 'GROUP/';
		this.property = ['id', 'avatar', 'name', 'info', 'now', 'updateTime'];
	} 

	GroupDAO.prototype.create = function(firebase, token, avatar, name, info, members, callback) {
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

				var id = firebase.database().ref().child(that.ref).push().key;
				var now = new Date().getTime();

				firebase.database().ref(that.ref + id).set({
					avatar : avatar,
					name : name,
					info : info,
					createdTime : now,
					updateTime : now,
					members : [{
						fbId : decoded.fbId,
						firstName : firstName,
						lastName : lastName,
						avatar : fbAvatar
					}]
				});

				var mems = members.split(",");

				mems.forEach(function(fbId) {
					userDAO.getFCM(firebase, fbId, function(fcm) {
							helper.sendNoti(fcm, {
								groupId : id
							}, {
								body : "Invite",
								title : "Invite",
								icon : "Invite"
							});
					})
				})

				callback({
					responseCode : 1,	
					description : "",
					data : id
				});
			});
		});
	}

	GroupDAO.prototype.update = function(firebase, token, id, data, callback) {
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
							description : "Group is not exist!",
							data : ""
						});

					if (snapshot.val().members[0].fbId != decoded.fbId)
						return callback({
							responseCode : -1,
							description : "User is not group's admin!",
							data : ""
						});

					data.updateTime = new Date().getTime();
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

	GroupDAO.prototype.readDataGroup = function(firebase, token, id, callback) {
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
					var group = snapshot.val();
				
					callback({
						responseCode : 1,	
						description : "",
						data : group
					});
				});
			});
		});
	}

	GroupDAO.prototype.acceptToJoin = function(firebase, token, id, callback) {
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
							description : "Group is not exist!",
							data : ""
						});
					
					var group = snapshot.val();
					
					for (i in group.members)
						if (group.members[i].fbId == decoded.fbId)
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
						
					firebase.database().ref(that.ref + id + '/members' + '/' + group.members.length).set(member);
				
					callback({
						responseCode : 1,	
						description : "",
						data : ""
					});
				});
			});
		});
	}

	GroupDAO.prototype.kickMember = function(firebase, token, id, fbId, callback) {
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
							description : "Group is not exist!",
							data : ""
						});

					if (snapshot.val().members[0].fbId != decoded.fbId)
						return callback({
							responseCode : -1,
							description : "User is not group's admin!",
							data : ""
						});
					
					var group = snapshot.val();
					for (i in group.members)
						if (group.members[i].fbId == fbId) {
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

	GroupDAO.prototype.joinGroup = function(firebase, token, id, callback) {
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
							description : "Group is not exist!",
							data : ""
						});
					
					var group = snapshot.val();
					userDAO.getFCM(firebase, group.members[0].fbId, function(fcm) {
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

	GroupDAO.prototype.verifyToJoin = function(firebase, token, id, fbId, firstName, lastName, avatar, callback) {
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
							description : "Group is not exist!",
							data : ""
						});

					if (snapshot.val().members[0].fbId != decoded.fbId)
						return callback({
							responseCode : -1,
							description : "User is not group's admin!",
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

	GroupDAO.prototype.addMember = function(firebase, token, id, fbId, callback) {
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
							description : "Group is not exist!",
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

						var group =snapshot.val();

						if (group.members[0].fbId == decoded.fbId)
							firebase.database().ref(that.ref + id + '/members' + '/' + group.members.length).set(member);
						else
							userDAO.getFCM(firebase, group.members[0].fbId, function(fcm) {
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
}