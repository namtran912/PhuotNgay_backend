require('./Helper')();
require('./UserDAO')();
require('./FCMDAO')();

module.exports = function() { 
	var helper = new Helper();
	var userDAO = new UserDAO();
	var fcmDAO = new FCMDAO();
	
	this.GroupDAO = function() {
		this.ref = 'GROUP/';		
	} 

	GroupDAO.prototype.create = function(firebase, token, avatar, name, members, callback) {
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

				var mems = members.split(",");

				mems.forEach(function(fbId) {
					fcmDAO.getFCM(firebase, fbId, function(fcm) {
						if (fcm == null)
							helper.sendEmail(email, "Welcome to PhuotNgay", "Install PhuotNgay to join group.");
						else
							helper.sendNoti(fcm, {
								message : "Invite"
							}, {
								body : "Invite",
								title : "Invite",
								icon : "Invite"
							});
					})
				})


				var id = firebase.database().ref().child(that.ref).push().key;

				firebase.database().ref(that.ref + id).set({
					avatar : avatar,
					name : name,
					members : [
						decoded.fbId
					]
				});

				callback({
					responseCode : 1,	
					description : "",
					data : id
				});
			});
		});
	}

	GroupDAO.prototype.update = function(firebase, token, id, avatar, name, callback) {
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

				firebase.database().ref(that.ref + id).once('value').then(function(snapshot) {
					if (snapshot.val().members[0] != decoded.fbId)
						return callback({
							responseCode : -1,
							description : "",
							data : ""
						});

					firebase.database().ref(that.ref + id).update({
						avatar : avatar,
						name : name,
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

	GroupDAO.prototype.readDataGroup = function(firebase, token, id, callback) {
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

				firebase.database().ref(that.ref + id).once('value').then(function(snapshot) {
					var group = snapshot.val();
					
					if (group.members[0] != decoded.fbId)
						return callback({
							responseCode : -1,
							description : "",
							data : ""
						});
				
					callback({
						responseCode : 1,	
						description : "",
						data : group
					});
				});
			});
		});
	}
}