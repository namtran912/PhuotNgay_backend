require('../Model/TripDAO')();

module.exports = function(app, firebase) { 
    var tripDAO = new TripDAO();
    var url = '/api/trips';   

    app.get(url, function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "",
							data : ""
						});
        tripDAO.readTripsData(firebase, req.headers['authen'], function(result) {
            res.json(result); 
        });
    });
    
    app.get(url + '/search', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "",
							data : ""
						});
        tripDAO.searchTripsData(firebase, req.headers['authen'], req.query.arrive, req.query.depart, 
        req.query.duration, req.query.transfer, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id', function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "",
							data : ""
						});
        tripDAO.readTripsDataById(firebase, req.headers['authen'], req.params.id, function(result) {
            res.json(result); 
        });
    });

}
