require('../Model/SuggestionDAO')();

module.exports = function(app, firebase) { 
    var suggestionDAO = new SuggestionDAO();
    var url = '/api/suggestion';   

    suggestionDAO.updateSuggestList(firebase, function(result) {});

    app.get(url, function(req, res) { 
        if (!req.query.hasOwnProperty('lat') || !req.query.hasOwnProperty('long')) 
            return res.json({
							responseCode : -1,
							description : "Request query is incorrect!"
						});

        if (req.query.lat == "" || req.query.long == "") 
            return res.json({
							responseCode : -1,
							description : "Request query is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});

        suggestionDAO.getSuggestList(firebase, req.headers['authorization'], req.query.lat, req.query.long, function(result) {
            res.json(result); 
        });
    });

    app.post(url, function(req, res) { 
        if (!req.body.hasOwnProperty('address') || !req.body.hasOwnProperty('cover') || !req.body.hasOwnProperty('description') || 
            !req.body.hasOwnProperty('link') || !req.body.hasOwnProperty('location') || !req.body.hasOwnProperty('name') || 
            !req.body.hasOwnProperty('type')) 
            return res.json({
							responseCode : -1,
							description : "Request query is incorrect!"
						});

        if (req.body.address == "" || req.body.cover == "" || req.body.description == "" || req.body.link == "" || 
        req.body.location == "" || req.body.name == "" || req.body.type == "") 
            return res.json({
							responseCode : -1,
							description : "Request query is incorrect!"
						});

        suggestionDAO.addSuggestList(firebase, req.body, function(result) {
            res.json(result); 
        });
    });

    app.put(url, function(req, res) { 
        suggestionDAO.updateSuggestList(firebase, function(result) {
            res.json(result); 
        });
    });
}
