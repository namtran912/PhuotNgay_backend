require('./Helper')();
require('./UserDAO')();

module.exports = function() { 
    var helper = new Helper();
	var userDAO = new UserDAO();

	this.NotificationDAO = function() {
		this.ref = 'NOTIFICATION/';
        this.tripRef = 'TRIP/';
    }

    NotificationDAO.prototype.addNoti = function(firebase, fbId, data, type, callback) {
		var that = this;
		var noti = {
            content : data,
            type : type
        };
		var id = null;
        firebase.database().ref(this.ref + fbId).once('value').then(function(snapshot) {
            if (snapshot.val() != null)
			 	snapshot.val().forEach(function(childSnapshot){
					var childKey = childSnapshot.key;
					var childData = childSnapshot.val();

					if (childData == noti) {
						id = childKey;
						return callback(id);
					}
				});

			if (id == null) {
				var id = firebase.database().ref().child(that.ref + fbId).push().key;
				firebase.database().ref(that.ref + fbId + '/' + id).set(noti);
				callback(id);
			}
        });
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

    NotificationDAO.prototype.sendNoti = function (firebase, token, tripId, fbIds, title, message, callback) {
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

				firebase.database().ref(that.tripRef + tripId).once('value').then(function(snapshot) {
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

					if (snapshot.val().from.fbId != decoded.fbId && (snapshot.val().members == null || !snapshot.val().members.hasOwnProperty(decoded.fbId)))
						return callback({
							responseCode : -1,
							description : "User is not Trip's member or Trip's admin!",
							data : ""
						});

                    var trip = snapshot.val();
					
                    fbIds.split(';').forEach(function(fbId){
                        if (trip.members != null && trip.members.hasOwnProperty(fbId))
                            userDAO.getFCM(firebase, fbId, function(fcm) {
                                helper.sendNoti(fcm, {}, {
                                                    body : message,
                                                    title : title,
                                                    icon : "noti"
                                                });		
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
}