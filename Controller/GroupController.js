require('../Model/GroupDAO')();

module.exports = function(app, firebase) { 
    var groupDAO = new GroupDAO();
    var url = '/api/group';   

    app.post(url, function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "",
							data : ""
						});

        groupDAO.createGroup(firebase, req.headers['authen'], req.body.avatar,  req.body.name,  req.body.members, 
            function(result) {
            res.json(result); 
        });
    });
}
