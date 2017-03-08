require('../Model/TripDAO')();

module.exports = function(app, firebase) { 
    var tripDAO = new TripDAO();
    var url = '/api/trips';   

    app.get(url, function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        tripDAO.readTripsData(firebase, req.headers['authen'], function(result) {
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

        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        tripDAO.searchTripsData(firebase, req.headers['authen'], req.query.arrive, req.query.depart, 
        req.query.duration, req.query.transfer, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id/activity', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        tripDAO.readTripsDataById_Activity(firebase, req.headers['authen'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id/album', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        tripDAO.readTripsDataById_Album(firebase, req.headers['authen'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id/comment', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        tripDAO.readTripsDataById_Comment(firebase, req.headers['authen'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id/members', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        tripDAO.readTripsDataById_Members(firebase, req.headers['authen'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        tripDAO.readTripsDataById(firebase, req.headers['authen'], req.params.id, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/accept', function(req, res) {  
        if (!req.body.hasOwnProperty('id')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.id == "") 
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

        tripDAO.acceptToJoin(firebase, req.headers['authen'], req.body.id, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/kick', function(req, res) {  
        if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('fbId')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.id == "" || req.body.fbId == "") 
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

        tripDAO.kickMember(firebase, req.headers['authen'], req.body.id, req.body.fbId, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/join', function(req, res) {  
        if (!req.body.hasOwnProperty('id')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.id == "") 
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

        tripDAO.joinTrip(firebase, req.headers['authen'], req.body.id, function(result) {
            res.json(result); 
        });
    });

    app.put(url + '/verify', function(req, res) {  
        if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('fbId') || !req.body.hasOwnProperty('firstName') || 
            !req.body.hasOwnProperty('lastName') || !req.body.hasOwnProperty('avatar')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.id == "" || req.body.fbId == "" || req.body.firstName == "" || 
            req.body.lastName == "" || req.body.avatar == "") 
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

        tripDAO.verifyToJoin(firebase, req.headers['authen'], req.body.id, req.body.fbId, req.body.firstName, req.body.lastName, 
            req.body.avatar, function(result) {
            res.json(result); 
        });
    });
    
    app.put(url + '/add', function(req, res) {  
        if (!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('fbId')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.id == "" || req.body.fbId == "") 
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

        tripDAO.addMember(firebase, req.headers['authen'], req.body.id, req.body.fbId, function(result) {
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

        tripDAO.update(firebase, req.headers['authen'], req.params.id, req.body, function(result) {
            res.json(result); 
        });
    });
}
