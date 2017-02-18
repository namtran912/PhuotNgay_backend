require('./Helper')();

module.exports = function() { 
	var helper = new Helper();

	this.UserDAO = function() {
		this.ref = 'USER/';		
	} 

	UserDAO.prototype.login = function(firebase, firebaseUid, fbId, email, callback) {
		var that = this;
		firebase.database().ref(this.ref + firebaseUid).once('value').then(function(snapshot) {
			if (snapshot.val() != null)
				return callback({
							responeCode : -1,
							description : "",
							data : ""
						});

			firebase.database().ref(that.ref + firebaseUid).set({
				avatar : "",
				email : email,
				fbId : fbId,
				firstName : "",
				gender : "",
				lastName : "",
				memberShip : new Date().getTime()
			});

			callback({
				responeCode : 1,
				description : "",
				data : {
					authen : helper.genToken(firebaseUid)
				}
			});
		});
	}
}