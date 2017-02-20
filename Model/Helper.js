var jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

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

            callback(decoded);
        });
    }

    Helper.prototype.isEmail = function(email) {
        return email.indexOf('@') > 0 && email.indexOf('@') < email.length - 1;
    }

    Helper.prototype.isFbId = function(fbId) {
        return fbId.length == 15 && /^\d+$/.test(fbId);
    }

    Helper.prototype.sendEmail = function(receiver, subject, text) {
        var transport = nodemailer.createTransport(smtpTransport({
            service: "gmail", 
            auth: {
                user: "yostajsc@gmail.com",
                pass: "nphau@1995"
            }
        }));

        transport.sendMail({  
                from : "Phượt ngay <yostajsc@gmail.com>",
                to : receiver,
                subject : subject, 
                text : text 
            }, function(error, response){ 
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }
        
            transport.close(); 
        });
    }
}