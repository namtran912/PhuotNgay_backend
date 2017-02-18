require('./Helper')();
var config = require('../config');
var firebase = require('firebase');

module.exports = function() { 
	var helper = new Helper();

	this.TripDAO = function() {
		firebase.initializeApp(config);
		this.database = firebase.database();

		this.ref = 'TRIP/';
		
	} 

	TripDAO.prototype.readTripsData = function(callback) {
		firebase.database().ref(this.ref).once('value').then(function(snapshot) {
			var trips = snapshot.val();
			callback(trips);
		});
	}

	TripDAO.prototype.searchTripsData = function(arrive, depart, duration, transfer, callback) {
		firebase.database().ref(this.ref).once('value').then(function(snapshot) {
			arrive = helper.U2A(arrive.toLowerCase());
			depart = helper.U2A(depart.toLowerCase());
			transfer = helper.U2A(transfer.toLowerCase());
			//console.log(arrive, depart);
			var result = [];

			snapshot.forEach(function(childSnapshot) {
				var childKey = childSnapshot.key;
				var childData = childSnapshot.val();
				
				var name = childData.name.split(' - ');
				var _arrive = helper.U2A(name[0].toLowerCase());
				var _depart = helper.U2A(name[1].toLowerCase());
				var _transfer = childData.transfer;

				var timeArrive = parseInt(childData.arrive.split('_')[1]);
				var timeDepart = parseInt(childData.depart.split('_')[1]);
				var _duration = Math.floor((timeDepart - timeArrive) / (24 * 60 * 60 * 1000) + 1);
				
				if (helper.compare(arrive, _arrive) && helper.compare(depart, _depart) && 
					(transfer == "" || transfer == _transfer) &&
					(duration == "" || parseInt(duration) == _duration)) 
                	result.push(childData);

			});
			callback(result);
		});
	}
}