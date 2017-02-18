var config = require('../config');
var firebase = require('firebase');

module.exports = function() { 
	this.LocationDAO = function() {
		firebase.initializeApp(config);
		this.database = firebase.database();

		this.ref = 'LOCATION/';		
	} 

	LocationDAO.prototype.readLocationData = function(id, callback) {
		firebase.database().ref(this.ref + '/' + id).once('value').then(function(snapshot) {
			var location = snapshot.val();
			callback(location);
		});
	}
}