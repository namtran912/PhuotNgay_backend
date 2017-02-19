require('./Helper')();

module.exports = function() { 
	var helper = new Helper();

	this.UserDAO = function() {
		this.ref = 'USER/';		
	} 

	UserDAO.prototype.getSignIn = function(firebase, firebaseUid, callback) {
		firebase.database().ref(this.ref + firebaseUid).once('value').then(function(snapshot) {
			if (snapshot.val() == null) 
				return callback(null);
			callback(snapshot.val().signIn);
		});
	}

	UserDAO.prototype.login = function(firebase, firebaseUid, fbId, email, callback) {
		if (!helper.isEmail(email) || !helper.isFbId(fbId))
			return callback({
							responseCode : -1,
							description : "",
							data : ""
					});

		var that = this;
		var now = new Date().getTime();
		firebase.database().ref(this.ref + firebaseUid).once('value').then(function(snapshot) {
			if (snapshot.val() != null) {
				if (snapshot.val().fbId != fbId)
					return callback({
							responseCode : -1,
							description : "",
							data : ""
						});

				firebase.database().ref(that.ref + firebaseUid).set({
					avatar : snapshot.val().avatar,
					email : email,
					fbId : fbId,
					firstName : snapshot.val().firstName,
					gender : snapshot.val().gender,
					lastName : snapshot.val().lastName,
					memberShip : snapshot.val().memberShip,
					signIn : now
				});
				
				return callback({
					responseCode : 1,
					description : "",
					data : {
						authen : helper.genToken({
							firebaseUid : firebaseUid,
							fbId : fbId,
							signIn : now
						})
					}
				});
			}
			
			firebase.database().ref(that.ref + firebaseUid).set({
				avatar : "",
				email : email,
				fbId : fbId,
				firstName : "",
				gender : "",
				lastName : "",
				memberShip : now,
				signIn : now
			});

			callback({
				responseCode : 1,
				description : "",
				data : {
					authen : helper.genToken({
						firebaseUid : firebaseUid,
						fbId : fbId,
						signIn : now
					})
				}
			});
		});
	}
}