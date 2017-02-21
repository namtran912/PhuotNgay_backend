require('./Helper')();

module.exports = function() { 
	var helper = new Helper();
	
	this.FCMDAO = function() {
		this.ref = 'FCM/';		
	} 

	FCMDAO.prototype.getFCM = function(firebase, fbId, callback) {
		firebase.database().ref(this.ref + fbId).once('value').then(function(snapshot) {;
			callback(snapshot.val());
		});
	}
}