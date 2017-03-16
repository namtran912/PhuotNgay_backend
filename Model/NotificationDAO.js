module.exports = function() { 

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

    NotificationDAO.prototype.deleteNoti = function(firebase, fbId, id) {
        firebase.database().ref(this.ref + fbId + '/' + id).set({});
    }

    NotificationDAO.prototype.readNotiById = function(firebase, fbId, id, callback) {
        firebase.database().ref(this.ref + fbId + '/' + id).once('value').then(function(snapshot) {
            callback(snapshot.val());
        });
    }

}