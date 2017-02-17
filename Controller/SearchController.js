require('../Model/TripDAO')();

module.exports = function(app) { 
    var tripDAO = new TripDAO();
    var url = '/api/trips';   

    app.get(url, function(req, res) {  
        tripDAO.readTripsData(function(result) {
            res.json(result); 
        });
    });
}
