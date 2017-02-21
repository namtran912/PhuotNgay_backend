require('../Model/FCMDAO')();

module.exports = function(app, firebase) { 
    var fcmDAO = new FCMDAO();
    var url = '/api/fcm';   

    app.put(url, function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "",
							data : ""
						});

        fcmDAO.update(firebase, req.headers['authen'], req.body.fcm, function(result) {
            res.json(result); 
        });
    });
}
