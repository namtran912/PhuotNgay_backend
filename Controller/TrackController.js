require('../Model/TrackDAO')();

module.exports = function(app, firebase) { 
    var trackDAO = new TrackDAO();
    var url = '/api/track';   

    app.get(url + '/:tripId', function(req, res) { 
        if (!req.query.hasOwnProperty('radius')) 
            return res.json({
							responseCode : -1,
							description : "Request query is incorrect!"
						});

        if (req.query.radius == "" || isNaN(req.query.radius)) 
            return res.json({
							responseCode : -1,
							description : "Request query is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        trackDAO.checkSecurity(firebase, req.headers['authorization'], req.params.tripId, req.query.radius, function(result) {
            res.json(result); 
        });
    });
}
