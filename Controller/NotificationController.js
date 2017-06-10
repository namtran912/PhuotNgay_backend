require('../Model/NotificationDAO')();

module.exports = function(app, firebase) { 
    var notificationDAO = new NotificationDAO();
    var url = '/api/notification';   

    app.get(url, function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        notificationDAO.readNotiByFbId(firebase, req.headers['authorization'], req.query.type, req.query.tripId, function(result) {
            res.json(result); 
        });
    });

    app.post(url, function(req, res) { 
        if (!req.body.hasOwnProperty('tripId') || !req.body.hasOwnProperty('fbId') || !req.body.hasOwnProperty('title') ||
            !req.body.hasOwnProperty('message')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.body.tripId == "" || req.body.fbId == "" || req.body.title == "" || req.body.message == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!"
						});

        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        notificationDAO.sendNoti(firebase, req.headers['authorization'], req.body.tripId, req.body.fbId, req.body.title,
            req.body.message, function(result) {
            res.json(result); 
        });
    });

    app.delete(url, function(req, res) {  
        if (req.headers['authorization'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authorization!"
						});
        notificationDAO.deleteNotiByFbId(firebase, req.headers['authorization'], req.body.tripId, function(result) {
            res.json(result); 
        });
    });
}
