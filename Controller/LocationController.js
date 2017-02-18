require('../Model/LocationDAO')();

module.exports = function(app) { 
    var locationDAO = new LocationDAO();
    var url = '/api/location';   

    app.get(url + '/:id', function(req, res) {  
        locationDAO.readLocationData(req.params.id, function(result) {
            res.json(result); 
        });
    });
}
