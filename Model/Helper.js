var jwt = require('jsonwebtoken');

module.exports = function() { 
    var SecrectToken = 'phuotngay';
    this.Helper = function() {
    }

    Helper.prototype.U2A = function(str) {
		var reserved = '';
		var code = str.match(/&#(d+);/g);

		if (code === null) {
			return str;
		}

		for (var i = 0; i < code.length; i++) {
			reserved += String.fromCharCode(code[i].replace(/[&#;]/g, ''));
		}
       
		return reserved;
	}

    Helper.prototype.compare = function(item, _item) {
		if (item == "") {
            return true;
        }
                   
        item = item.split('.').join(" ");
        item = item.split(',').join(" ");
        _item = _item.split('.').join(" ");
        _item = _item.split(',').join(" ");
        var itemWord = item.split(" ");
        var _itemWord = _item.split(" ");

        for (i in itemWord) 
            for (_i in _itemWord) 
                if (itemWord[i] == _itemWord[_i]) 
                    return true;
        
        return false;
	}

    Helper.prototype.genToken = function(firebaseUid) {
		var secrectToken = new Buffer(SecrectToken, 'base64').toString('ascii');
		var token = jwt.sign(firebaseUid, secrectToken/*, {
			expiresIn: 86400
		}*/);
		return token;
	}

    Helper.prototype.verifyToken = function(token, callback) {
        var secrectToken = new Buffer(SecrectToken, 'base64').toString('ascii');
		jwt.verify(token, secrectToken, function(err, decoded) {
            if (err)
                return callback(null);

            callback(decoded.firebaseUid);
        });
    }
}