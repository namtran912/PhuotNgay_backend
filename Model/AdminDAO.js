var config = require('../config');
var jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');

module.exports = function() { 

	this.AdminDAO = function() {
		this.collection = 'Admin';
	} 

	AdminDAO.prototype.genToken = function(user) {
		var secrectToken = new Buffer(config.SecrectToken, 'base64').toString('ascii');
		var token = jwt.sign(user, secrectToken, {
			expiresIn: 86400
		});
		return token;
	}

	AdminDAO.prototype.login = function(userId, password, callback) {
		var that = this;
	    database.collection(this.collection).findOne({ userId : userId}, 
	    	{ _id : false, password : true }, function(err, reply) {
	    	try {
				if (err)
					throw err;

				if (reply == null) {
					callback(null);
					return;
				}

				if (passwordHash.verify(password, reply.password)) {
					var token = that.genToken({ 
						userId : userId, 
						password : password
					});
					callback({
	            		token : token
	            	});
				}
				else 
					callback(null);
            }
			catch(err) {
				console.log(err);
			    callback(-1);
			}
        });
	};

	AdminDAO.prototype.checkExpireToken = function(token, callback) {
		var secrectToken = new Buffer(config.SecrectToken, 'base64').toString('ascii');
		jwt.verify(token, secrectToken, function(err, decoded) {	
		   	try{
		   		if (err) 
		   			throw err;
		   		callback(true, decoded.userId);
			}
			catch(err) {
				console.log(err);
				if (err.name == 'TokenExpiredError' || err.name == 'JsonWebTokenError')
					callback(false, null);
				else
					callback(-1, null);
			}
		});
	};
}