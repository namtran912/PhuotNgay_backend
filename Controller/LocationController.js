require('../Model/LocationDAO')();

module.exports = function(app, firebase) { 
    var locationDAO = new LocationDAO();
    var url = '/api/location';   

    app.get(url, function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "",
							data : ""
						});

        locationDAO.readLocationData(firebase, req.headers['authen'], function(result) {
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

        locationDAO.searchLocationData(firebase, req.headers['authen'], req.params.id, function(result) {
            res.json(result); 
        });
    });
}
