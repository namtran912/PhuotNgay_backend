var jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var request = require('request');
var config = require('../config');
var kmeans = require('node-kmeans');
var QB = require('quickblox');
var s3 = require('s3');
var removeDiacritics = require('diacritics').remove;

module.exports = function() { 

    this.Helper = function() {
        this.expireTime = 2592000;
        this.security = [];

        this.client = s3.createClient({
            s3Options: {
                accessKeyId: 'AKIAIFU2XLC5PISWJXRA',
                secretAccessKey: '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',
                region: 'ap-southeast-1',
            },
        });

        this.params = {
            s3Params: {
                Bucket: config.bucket
            },
        };
    }

    Helper.prototype.U2A = function(str) {
		return removeDiacritics(str);
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
		var token = jwt.sign(firebaseUid, secrectToken, {
			expiresIn: this.expireTime
		});
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

    Helper.prototype.rad = function(x) {
        return x * Math.PI / 180;
    };

    Helper.prototype.getDistance = function(x1, y1, x2, y2) {
        var R = 6378137;
        var dLat = this.rad(x2 - x1);
        var dLong = this.rad(y2 - y1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.rad(x1)) * Math.cos(this.rad(x2)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; 
    };

    Helper.prototype.isSecured = function(radius, res) {
        for (i in res[0].cluster)
            for (j in res[1].cluster) {
                var x1 = res[0].cluster[i];
                var y1 = res[0].cluster[i];
                var x2 = res[1].cluster[j];
                var y2 = res[1].cluster[j];

                if (this.getDistance(x1, y1, x2, y2) <= radius) 
                    return true;
            }
        return false;
    }

    Helper.prototype.kmeans = function(radius, vectors, callback) {
        var that = this;
        kmeans.clusterize(vectors, {k: 2}, (err,res) => {
            if (err) 
                return callback([]);

            if (that.isSecured(radius, res)) 
                return callback(that.security);

            if (res[0].cluster.length > res[1].cluster.length) {
                that.security = that.security.concat(res[1].clusterInd);
                if (res[0].cluster.length < 2) 
                     return callback(that.security);
                that.kmeans(radius, res[0].cluster, callback);
            }
            else {
                that.security = that.security.concat(res[0].clusterInd);
                if (res[1].cluster.length < 2) 
                    return callback(that.security);
                that.kmeans(radius, res[1].cluster, callback);
            }
        });
    }

    Helper.prototype.checkSecurity = function(radius, vectors, callback) {
        this.security = [];
        if (vectors.length < 2) 
            return callback(this.security);
        this.kmeans(radius, vectors, callback);
    }

    Helper.prototype.quickblox = function(token) {
        QB.init(config.quickblox.appId, config.quickblox.authKey, config.quickblox.authSecret);

        var params = {provider: 'facebook', keys: {token: token}};
        QB.createSession(function(err, result) {
            QB.login(params, function(err, result) {
                console.log(result);
            });
        });
        
    }

     Helper.prototype.upload = function(localFile, key, callback) {
        this.params.localFile = localFile;
        this.params.s3Params.Key = key;

        var uploader = this.client.uploadFile(this.params);  
        uploader.on('end', function() {
            callback(s3.getPublicUrlHttp(config.bucket, key));
        });
    }
}