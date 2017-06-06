require('../Model/TrendingDAO')();

module.exports = function(app, firebase) { 
    var trendingDAO = new TrendingDAO();
    var url = '/api/trending';   

    app.get(url, function(req, res) { 
       if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        trendingDAO.getListTrending(firebase, req.headers['authorization'], function(result) {
            res.json(result); 
        });
    });
}
