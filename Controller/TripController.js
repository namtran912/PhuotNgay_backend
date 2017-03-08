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

    app.get(url + '/activity/:id', function(req, res) {  
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

    app.get(url + '/album/:id', function(req, res) {  
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

    app.get(url + '/comment/:id', function(req, res) {  
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

    app.get(url + '/members/:id', function(req, res) {  
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

}
