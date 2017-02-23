require('../Model/GroupDAO')();

module.exports = function(app, firebase) { 
    var groupDAO = new GroupDAO();
    var url = '/api/group';  

    app.get(url + '/:id', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});

        groupDAO.readDataGroup(firebase, req.headers['authen'], req.params.id, function(result) {
            res.json(result); 
        });
    }); 

    app.post(url, function(req, res) {  
        if (!req.body.hasOwnProperty('avatar') || !req.body.hasOwnProperty('name') || 
            !req.body.hasOwnProperty('info') || !req.body.hasOwnProperty('members')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.avatar == "" || req.body.name == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});

        groupDAO.create(firebase, req.headers['authen'], req.body.avatar, req.body.name, req.body.info,  
            req.body.members, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});

        groupDAO.update(firebase, req.headers['authen'], req.params.id, req.body, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/accept/:id', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});

        groupDAO.acceptToJoin(firebase, req.headers['authen'], req.params.id, function(result) {
            res.json(result); 
        });
    });
}
