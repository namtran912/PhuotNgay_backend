require('../Model/MapDAO')();

module.exports = function(app, firebase) { 
    var mapDAO = new MapDAO();
    var url = '/api/map';   

    app.get(url + '/:tripId/security', function(req, res) { 
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        mapDAO.checkSecurity(firebase, req.headers['authorization'], req.params.tripId, function(result) {
            res.json(result); 
        });
    });

    app.post(url + '/:tripId/security', function(req, res) { 
        if (!req.body.hasOwnProperty('radius') || !req.body.hasOwnProperty('core')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.body.radius == "" || req.body.core == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        mapDAO.setSecurity(firebase, req.headers['authorization'], req.params.tripId, req.body.radius, req.body.core, function(result) {
            res.json(result); 
        });
    });
}
