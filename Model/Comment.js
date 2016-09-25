module.exports = function() {

	this.Content = function(text, time) {
		this.lat = lat;
		this.long = long;
	};

	this.View = function(userId, userAvatar, content) {
		this.userId = userId;
		this.userAvatar = userAvatar;
		this.content = content;
	}
}