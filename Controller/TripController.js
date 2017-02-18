require('../Model/TripDAO')();

module.exports = function(app) { 
    var tripDAO = new TripDAO();
    var url = '/api/trips';   

    app.get(url, function(req, res) {  
        tripDAO.readTripsData(function(result) {
            res.json(result); 
        });
    });

    app.get(url + '/search', function(req, res) {  
        tripDAO.searchTripsData(req.query.arrive, req.query.depart, 
        req.query.duration, req.query.transfer, function(result) {
            res.json(result); 
        });
    });
}
