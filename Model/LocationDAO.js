module.exports = function() { 
	this.LocationDAO = function() {
		this.ref = 'LOCATION/';		
	} 

	LocationDAO.prototype.readLocationData = function(firebase, id, callback) {
		firebase.database().ref(this.ref + '/' + id).once('value').then(function(snapshot) {
			var location = snapshot.val();
			callback(location);
		});
	}
}