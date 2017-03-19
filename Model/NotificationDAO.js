require('./Helper')();
require('./UserDAO')();

module.exports = function() { 
    var helper = new Helper();
	var userDAO = new UserDAO();

	this.NotificationDAO = function() {
		this.ref = 'NOTIFICATION/';
    }

    NotificationDAO.prototype.addNoti = function(firebase, fbId, data, type) {
        var id = firebase.database().ref().child(this.ref + fbId).push().key;
        firebase.database().ref(this.ref + fbId + '/' + id).set({
            content : data,
            type : type
        });

        return id;
    }

    NotificationDAO.prototype.deleteNoti = function(firebase, fbId, id, callback) {
        var that = this;
        firebase.database().ref(this.ref + fbId + '/' + id).once('value').then(function(snapshot) {
            if (snapshot.val() == null)
                callback(false);
            else {
                firebase.database().ref(that.ref + fbId + '/' + id).set({});
                callback(true);
            }
        });
        
    }

    NotificationDAO.prototype.readNotiById = function(firebase, fbId, id, callback) {
        firebase.database().ref(this.ref + fbId + '/' + id).once('value').then(function(snapshot) {
            callback(snapshot.val());
        });
    }

    NotificationDAO.prototype.readNotiByFbId = function(firebase, token, callback) {
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

				 firebase.database().ref(that.ref + decoded.fbId).once('value').then(function(snapshot) {
                     var noties = [];

                     if (snapshot.val() == null)
                        return callback({
                            responseCode : 1,
                            description : "",
                            data : noties
                        });
                     
                     snapshot.forEach(function(childSnapshot) {
                        var id = childSnapshot.key;
                        var noti = childSnapshot.val();

                        noti.id = id;
                        noties.push(noti)
                     });
                     
                     callback({
						responseCode : 1,
						description : "",
						data : noties
					});
                 });
			});
		});
    }

}