module.exports = function() { 

	this.ViewController = function() {

		this.url = '/phuotngay/view';
		this.redisKey = 'View'
	} 

	ViewController.prototype.getAll = function() {
		var views = null;

		try {
		    client.hvals(this.redisKey, function (err, obj) {
				if (err != null)
					throw err;
				console.log(obj);
				views = obj;
			});
		}
		catch(err) {
		    console.log(err)
		}
		views = {id:"123"};

		return views;
	};
}
