require('../Model/TripDAO')();

module.exports = function(app, firebase, myCache) { 
    var tripDAO = new TripDAO();
    var url = '/api/trips';   

    app.get(url, function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});
        tripDAO.readTripsData(firebase, myCache, req.headers['authorization'], req.query, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/own', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});
        tripDAO.readOwnTripsData(firebase, req.headers['authorization'], req.query, function(result) {
            res.json(result); 
        });
    });
    
    app.get(url + '/search', function(req, res) {  
        if (!req.query.hasOwnProperty('arrive') || !req.query.hasOwnProperty('depart') || 
            !req.query.hasOwnProperty('duration') || !req.query.hasOwnProperty('transfer')) 
            return res.json({
							responseCode : -1,
							description : "Request query is incorrect!",
							data : ""
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
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
							description : "Missing authorization!",
							data : ""
						});
        tripDAO.readTripsDataById_Activity(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id/comment', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});
        tripDAO.readTripsDataById_Comment(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id/members', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});
        tripDAO.readTripsDataById_Members(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});
        tripDAO.readTripsDataById(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.post(url, function(req, res) {  
         if (!req.body.hasOwnProperty('arrive') || !req.body.hasOwnProperty('depart') || 
            !req.body.hasOwnProperty('description') || !req.body.hasOwnProperty('is_published') || !req.body.hasOwnProperty('name') || 
            !req.body.hasOwnProperty('status') || !req.body.hasOwnProperty('transfer')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.arrive == "" || req.body.depart == "" ||  req.body.description == "" ||
            req.body.is_published == "" || req.body.name == "" || req.body.status == "" ||  req.body.transfer == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.create(firebase, myCache, req.headers['authorization'], req.body, function(result) {
            res.json(result); 
        });
    });

    app.post(url + '/:id/activity', function(req, res) {  
         if (!req.body.hasOwnProperty('time') || !req.body.hasOwnProperty('content')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.time == "" || req.body.content == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.add_Activity(firebase, req.headers['authorization'], req.params.id, req.body.time, req.body.content, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/accept', function(req, res) {  
         if ( !req.body.hasOwnProperty('verify') || !req.body.hasOwnProperty('notiId')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.verify == "" || req.body.notiId == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.acceptToJoin(firebase, req.headers['authorization'], req.params.id, req.body.verify, req.body.notiId, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/kick', function(req, res) {  
        if ( !req.body.hasOwnProperty('fbId')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.fbId == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.kickMember(firebase, req.headers['authorization'], req.params.id, req.body.fbId, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/join', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.joinTrip(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/verify', function(req, res) {  
        if (!req.body.hasOwnProperty('verify') || !req.body.hasOwnProperty('notiId')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.verify == "" || req.body.notiId == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.verifyToJoin(firebase, req.headers['authorization'], req.params.id, req.body.verify, req.body.notiId, function(result) {
            res.json(result); 
        });
    });
    
    app.put(url + '/:id/add', function(req, res) {  
        if (!req.body.hasOwnProperty('fbId')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.fbId == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.addMember(firebase, req.headers['authorization'], req.params.id, req.body.fbId, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/activity', function(req, res) {  
         if (!req.body.hasOwnProperty('time') || !req.body.hasOwnProperty('content')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.time == "" || req.body.content == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.update_Activity(firebase, req.headers['authorization'], req.params.id, req.body.time, req.body.content, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id/view', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.update_View(firebase, req.headers['authorization'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/:id', function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.update(firebase, myCache, req.headers['authorization'], req.params.id, req.body, function(result) {
            res.json(result); 
        });
    });

    app.delete(url + '/:id/activity', function(req, res) {  
         if (!req.body.hasOwnProperty('time')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.time == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!",
							data : ""
						});

        tripDAO.delete_Activity(firebase, req.headers['authorization'], req.params.id, req.body.time, function(result) {
            res.json(result); 
        });
    });
}
