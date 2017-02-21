require('../Model/GroupDAO')();

module.exports = function(app, firebase) { 
    var groupDAO = new GroupDAO();
    var url = '/api/group';  

    app.get(url + '/:id', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "",
							data : ""
						});

        groupDAO.readDataGroup(firebase, req.headers['authen'], req.params.id, function(result) {
            res.json(result); 
        });
    }); 

    app.post(url, function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "",
							data : ""
						});

        groupDAO.create(firebase, req.headers['authen'], req.body.avatar,  req.body.name,  req.body.members, 
            function(result) {
            res.json(result); 
        });
    });

    app.put(url, function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "",
							data : ""
						});

        groupDAO.update(firebase, req.headers['authen'], req.body.id, req.body.avatar, req.body.name, 
            function(result) {
            res.json(result); 
        });
    });
}
