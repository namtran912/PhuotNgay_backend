var config = require('../config');
var firebase = require('firebase');

module.exports = function() { 

	this.TripDAO = function() {
		firebase.initializeApp(config);
		this.database = firebase.database();

		this.ref = 'TRIP/';
	} 

	TripDAO.prototype.readTripsData = function(callback) {
		return firebase.database().ref(this.ref).once('value').then(function(snapshot) {
			var trips = snapshot.val();
			callback(trips);
		});
	}
}