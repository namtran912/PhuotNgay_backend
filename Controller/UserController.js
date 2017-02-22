require('../Model/UserDAO')();

module.exports = function(app, firebase) { 
    var userDAO = new UserDAO();
    var url = '/api/user';   

    app.post(url + '/login', function(req, res) {  
        if (!req.body.hasOwnProperty('firebaseUi') || !req.body.hasOwnProperty('fbId') || 
            !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('fcm')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.firebaseUi == "" || req.body.fbId == "" || req.body.email == "" || req.body.fcm == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});
        userDAO.login(firebase, req.body.firebaseUid, req.body.fbId, req.body.email, req.body.fcm, function(result) {
            res.json(result); 
        });
    });

    app.put(url, function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        userDAO.update(firebase, req.headers['authen'], req.body, function(result) {
            res.json(result); 
        });
    });

     app.get(url, function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        userDAO.readUserById(firebase, req.headers['authen'], function(result) {
            res.json(result); 
        });
    });
}
