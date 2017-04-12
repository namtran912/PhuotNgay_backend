require('../Model/UserDAO')();

module.exports = function(app, firebase) { 
    var userDAO = new UserDAO();
    var url = '/api/user';   

    app.post(url + '/login', function(req, res) {  
        if (req.headers['fbtoken'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing facebook token!"
						});

        if (!req.body.hasOwnProperty('firebaseUid') || !req.body.hasOwnProperty('fbId') || 
            !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('fcm')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.body.firebaseUid == "" || req.body.fbId == "" || req.body.email == "" || req.body.fcm == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});
        userDAO.login(firebase, req.headers['fbtoken'], req.body.firebaseUid, req.body.fbId, req.body.email, req.body.fcm, function(result) {
            res.json(result); 
        });
    });

    app.put(url, function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        userDAO.update(firebase, req.headers['authorization'], req.body, function(result) {
            res.json(result); 
        });
    });

     app.get(url, function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        userDAO.readUserById(firebase, req.headers['authorization'], function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/friends', function(req, res) {  
        if (req.headers['fbtoken'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing facebook token!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        userDAO.getListFriends(firebase, req.headers['authorization'], req.headers['fbtoken'], function(result) {
            res.json(result); 
        });
    });
}
