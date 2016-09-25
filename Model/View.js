module.exports = function() {

	this.Location = function(lat, lon) {
		this.lat = lat;
		this.long = long;
	};

	this.View = function(id, name, location, album, comment) {
		this.id = id;
		this.name = name;
		this.location = location;
		this.album = album;
		this.commend = comment;
	}
}