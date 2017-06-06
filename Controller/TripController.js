require('../Model/TripDAO')();

module.exports = function(app, firebase, myCache) { 
    var tripDAO = new TripDAO();
    var url = '/api/trips';   

    app.get(url, function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        tripDAO.readTripsData(firebase, myCache, req.headers['authorization'], req.query, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/own', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        tripDAO.readOwnTripsData(firebase, req.headers['authorization'], req.query, req.query.type, function(result) {
            res.json(result); 
        });
    });
    
    app.get(url + '/search', function(req, res) {  
        if (!req.query.hasOwnProperty('arrive') || !req.query.hasOwnProperty('depart') || 
            !req.query.hasOwnProperty('duration') || !req.query.hasOwnProperty('transfer')) 
            return res.json({
							responseCode : -1,
							description : "Request query is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        tripDAO.searchTripsData(firebase, req.headers['authorization'], req.query.arrive, req.query.depart, 
        req.query.duration, req.query.transfer, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id/activity', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        tripDAO.readTripsDataById_Activity(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id/comment', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        tripDAO.readTripsDataById_Comment(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id/members', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        tripDAO.readTripsDataById_Members(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id/album', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        tripDAO.readTripsDataById_Album(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        tripDAO.readTripsDataById(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.post(url, function(req, res) {  
         if (!req.body.hasOwnProperty('arrive') || !req.body.hasOwnProperty('depart') || 
            !req.body.hasOwnProperty('description') || !req.body.hasOwnProperty('name') || 
            !req.body.hasOwnProperty('transfer')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});
        
        if (req.body.description == "")
            req.body.description == " ";

        if (req.body.arrive == "" || req.body.depart == "" ||  req.body.description == "" ||
            req.body.name == "" || req.body.transfer == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.create(firebase, myCache, req.headers['authorization'], req.body, function(result) {
            res.json(result); 
        });
    });

    app.post(url + '/:id/activity', function(req, res) {  
         if (!req.body.hasOwnProperty('time') || !req.body.hasOwnProperty('content')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.body.time == "" || req.body.content == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.add_Activity(firebase, req.headers['authorization'], req.params.id, req.body.time, req.body.content, function(result) {
            res.json(result); 
        });
    });

    app.post(url + '/:id/comment', function(req, res) {  
         if (!req.body.hasOwnProperty('content')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if ( req.body.content == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.add_Comment(firebase, req.headers['authorization'], req.params.id, req.body.content, function(result) {
            res.json(result); 
        });
    });

    app.post(url + '/:id/album', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.add_Album(firebase, req.headers['authorization'], req.params.id, req.files, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/accept', function(req, res) {  
         if ( !req.body.hasOwnProperty('verify') || !req.body.hasOwnProperty('notiId')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.body.verify == "" || req.body.notiId == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.acceptToJoin(firebase, req.headers['authorization'], req.params.id, req.body.verify, req.body.notiId, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/kick', function(req, res) {  
        if ( !req.body.hasOwnProperty('fbId')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.body.fbId == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.kickMember(firebase, req.headers['authorization'], req.params.id, req.body.fbId, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/join', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.joinTrip(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/verify', function(req, res) {  
        if (!req.body.hasOwnProperty('verify') || !req.body.hasOwnProperty('notiId')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.body.verify == "" || req.body.notiId == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.verifyToJoin(firebase, req.headers['authorization'], req.params.id, req.body.verify, req.body.notiId, function(result) {
            res.json(result); 
        });
    });
    
    app.put(url + '/:id/add', function(req, res) {  
        if (!req.body.hasOwnProperty('fbId')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.body.fbId == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.addMember(firebase, req.headers['authorization'], req.params.id, req.body.fbId, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/activity', function(req, res) {  
         if (!req.body.hasOwnProperty('time') || !req.body.hasOwnProperty('content')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.body.time == "" || req.body.content == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.update_Activity(firebase, req.headers['authorization'], req.params.id, req.body.time, req.body.content, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/view', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.update_View(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/cover', function(req, res) {  
        if (!req.files.hasOwnProperty('cover')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.update_Cover(firebase, req.headers['authorization'], req.params.id, req.files.cover, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.update(firebase, myCache, req.headers['authorization'], req.params.id, req.body, function(result) {
            res.json(result); 
        });
    });

    app.delete(url + '/:id/activity', function(req, res) {  
         if (!req.body.hasOwnProperty('time')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.body.time == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.delete_Activity(firebase, req.headers['authorization'], req.params.id, req.body.time, function(result) {
            res.json(result); 
        });
    });

    app.delete(url + '/:id/comment', function(req, res) {  
         if (!req.body.hasOwnProperty('id')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if ( req.body.id == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        tripDAO.delete_Comment(firebase, req.headers['authorization'], req.params.id, req.body.id, function(result) {
            res.json(result); 
        });
    });

    app.delete(url + '/:id/album', function(req, res) {  
         if (!req.body.hasOwnProperty('id')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if ( req.body.id == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        tripDAO.delete_Album(firebase, req.headers['authorization'], req.params.id, req.body.id, function(result) {
            res.json(result); 
        });
    });
}
