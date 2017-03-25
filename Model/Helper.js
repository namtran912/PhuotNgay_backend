var jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var request = require('request');
var config = require('../config');

module.exports = function() { 

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
		var secrectToken = new Buffer(config.SecrectToken, 'base64').toString('ascii');
		var token = jwt.sign(firebaseUid, secrectToken/*, {
			expiresIn: 86400
		}*/);
		return token;
	}

    Helper.prototype.verifyToken = function(token, callback) {
        var secrectToken = new Buffer(config.SecrectToken, 'base64').toString('ascii');
		jwt.verify(token, secrectToken, function(err, decoded) {
            if (err)
                return callback(null);

            callback(decoded);
        });
    }

    Helper.prototype.isEmail = function(email) {
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    Helper.prototype.isFbId = function(fbId) {
        return /^\d+$/.test(fbId);
    }

     Helper.prototype.isDayOfBirth = function(dayOfBirth) {
        var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
        return pattern.test(dayOfBirth);
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

    Helper.prototype.sendNoti = function(token, data, notification) {
        request.post({
            url : 'https://fcm.googleapis.com/fcm/send',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : config.fcm},
            json : { 
                data  : data,
                notification : notification,
                to : token,
            }
        }, function(error, response, body){
            console.log(body);
        });
    }
}