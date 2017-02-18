require('../Model/LocationDAO')();

module.exports = function(app, firebase) { 
    var locationDAO = new LocationDAO();
    var url = '/api/location';   

    app.get(url, function(req, res) {  
        locationDAO.readLocationData(firebase, function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/:id', function(req, res) {  
        locationDAO.searchLocationData(firebase, req.params.id, function(result) {
            res.json(result); 
        });
    });
}
