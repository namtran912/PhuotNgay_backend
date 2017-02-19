require('../Model/UserDAO')();

module.exports = function(app, firebase) { 
    var userDAO = new UserDAO();
    var url = '/api/user';   

    app.post(url + '/login', function(req, res) {  
        userDAO.login(firebase, req.body.firebaseUid, req.body.fbId, req.body.email, function(result) {
            res.json(result); 
        });
    });
}
