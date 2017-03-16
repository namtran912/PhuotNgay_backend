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
}
