require('../Model/NotificationDAO')();

module.exports = function(app, firebase) { 
    var notificationDAO = new NotificationDAO();
    var url = '/api/notification';   

    app.get(url, function(req, res) {  
        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        notificationDAO.readNotiByFbId(firebase, req.headers['authen'], function(result) {
            res.json(result); 
        });
    });

    app.post(url, function(req, res) { 
        if (!req.body.hasOwnProperty('tripId') || !req.body.hasOwnProperty('fbId') || !req.body.hasOwnProperty('title') ||
            !req.body.hasOwnProperty('message')) 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.body.tripId == "" || req.body.fbId == "" || req.body.title == "" || req.body.message == "") 
            return res.json({
							responseCode : -1,
							description : "Request body is incorrect!",
							data : ""
						});

        if (req.headers['authen'] == null) 
            return res.json({
							responseCode : -1,
							description : "Missing authen!",
							data : ""
						});
        notificationDAO.sendNoti(firebase, req.headers['authen'], req.body.tripId, req.body.fbId, req.body.title,
            req.body.message, function(result) {
            res.json(result); 
        });
    });
}
