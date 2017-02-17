require('../Model/AdminDAO')();

module.exports = function(app) { 
    var adminDAO = new AdminDAO();
  
    app.get(url + '/flights', function(req, res) {
        if (req.headers['x-access-token'] == null) {
            res.statusCode = 401;
            return res.send('Error 401: Missing token.');
        }

        adminDAO.checkExpireToken(req.headers['x-access-token'], function(result, userId) {
            if (result == -1) {
                res.statusCode = 500;
                return res.send('Error 500: Server error.');
            }

            if (!result) {
                res.statusCode = 401;
                return res.send('Error 401: Token expries.');
            }

            flightDAO.getAll(function(result) {
                if (result == -1) {
                    res.statusCode = 500;
                    return res.json({
                        error : 'Error 500: Server error.'
                    });
                }

                res.json(result); 
            });
        });
    });

    app.get(url + '/bookings', function(req, res) {
        if (req.headers['x-access-token'] == null) {
            res.statusCode = 401;
            return res.send('Error 401: Missing token.');
        }

        adminDAO.checkExpireToken(req.headers['x-access-token'], function(result, userId) {
            if (result == -1) {
                res.statusCode = 500;
                return res.send('Error 500: Server error.');
            }

            if (!result) {
                res.statusCode = 401;
                return res.send('Error 401: Token expries.');
            }

            bookingDAO.getAll(function(bookings) {
                if (bookings == -1) {
                    res.statusCode = 500;
                    return res.json({
                        error : 'Error 500: Server error.'
                    });
                }

                flightDetailDAO.getAll(function(details) {
                    if (details == -1) {
                        res.statusCode = 500;
                        return res.json({
                            error : 'Error 500: Server error.'
                        });
                    }

                    var result = {
                        bookings : []
                    }

                    for (var i = 0; i < bookings.length; i++) {
                        var booking = {};
                        for(field in bookings[i])
                            booking[field] = bookings[i][field];

                        for(field in details[bookings[i].bookingId])
                            booking[field] = details[bookings[i].bookingId][field];

                        result.bookings.push(booking)
                    }

                    res.json(result); 
                });
            });
        });
    });

    app.get(url + '/bookings/:bookingId', function(req, res) {
        if (req.headers['x-access-token'] == null) {
            res.statusCode = 401;
            return res.send('Error 401: Missing token.');
        }

        adminDAO.checkExpireToken(req.headers['x-access-token'], function(result, userId) {
            if (result == -1) {
                res.statusCode = 500;
                return res.send('Error 500: Server error.');
            }

            if (!result) {
                res.statusCode = 401;
                return res.send('Error 401: Token expries.');
            }

            bookingDAO.getBookingById(req.params.bookingId, function(booking) {
                if (booking == -1) {
                    res.statusCode = 500;
                    return res.json({
                        error : 'Error 500: Server error.'
                    });
                }

                flightDetailDAO.getFlightDetailById(req.params.bookingId, function(detail) {
                    if (detail == -1) {
                        res.statusCode = 500;
                        return res.json({
                            error : 'Error 500: Server error.'
                        });
                    }

                   for(field in detail)
                        booking[field] = detail[field];

                    res.json(booking); 
                });
            });
        });
    });

    app.put(url + '/login', function(req, res) {
        if(!req.body.hasOwnProperty('userId') || !req.body.hasOwnProperty('password')) {
            res.statusCode = 401;
            return res.json({
                error : 'Error 400: Syntax incorrect.'
            });
        }
        adminDAO.login(req.body.userId, req.body.password, function(result) {
            if (result == -1) {
                res.statusCode = 500;
                return res.json({
                    error : 'Error 500: Server error.'
                });
            }

            if (result == null) {
                res.statusCode = 401;
                return res.json({
                    error : 'Error 401: Token expries.'
                });
            }

            res.json(result); 
        });
    });

    app.post(url + '/flights', function(req, res) {
        if (req.headers['x-access-token'] == null) {
            res.statusCode = 401;
            return res.send('Error 401: Missing token.');
        }

        adminDAO.checkExpireToken(req.headers['x-access-token'], function(result, userId) {
            if (result == -1) {
                res.statusCode = 500;
                return res.send('Error 500: Server error.');
            }

            if (!result) {
                res.statusCode = 401;
                return res.send('Error 401: Token expries.');
            }

            if(!req.body.hasOwnProperty('flightId') || !req.body.hasOwnProperty('departure') ||
                !req.body.hasOwnProperty('destination') || !req.body.hasOwnProperty('time') ||
                !req.body.hasOwnProperty('grade') || !req.body.hasOwnProperty('number') ||
                !req.body.hasOwnProperty('price')) {
                res.statusCode = 400;
                return res.json({
                    error : 'Error 400: Syntax incorrect.'
                });
            }

            flightDAO.addFlight(req.body.flightId, req.body.departure, req.body.destination, 
                                req.body.time, req.body.grade, req.body.number, req.body.price, 
                                function(result) {
                if (result == -1) {
                    res.statusCode = 500;
                    return res.json({
                        error : 'Error 500: Server error.'
                    });
                }

                res.json(result); 
            });
        });
    });

    app.put(url + '/flights', function(req, res) {
        if (req.headers['x-access-token'] == null) {
            res.statusCode = 401;
            return res.send('Error 401: Missing token.');
        }

        adminDAO.checkExpireToken(req.headers['x-access-token'], function(result, userId) {
            if (result == -1) {
                res.statusCode = 500;
                return res.send('Error 500: Server error.');
            }

            if (!result) {
                res.statusCode = 401;
                return res.send('Error 401: Token expries.');
            }

            if(!req.body.hasOwnProperty('flightId') || !req.body.hasOwnProperty('departure') ||
                !req.body.hasOwnProperty('destination') || !req.body.hasOwnProperty('time1') ||
                !req.body.hasOwnProperty('grade1') || !req.body.hasOwnProperty('price1') ||
                !req.body.hasOwnProperty('time2') || !req.body.hasOwnProperty('number2') ||
                !req.body.hasOwnProperty('grade2') || !req.body.hasOwnProperty('price2')) {
                res.statusCode = 400;
                return res.json({
                    error : 'Error 400: Syntax incorrect.'
                });
            }

            flightDAO.updateFlight(req.body.flightId, req.body.departure, req.body.destination, 
                                req.body.time1, req.body.grade1, req.body.price1, req.body.time2, 
                                req.body.grade2, req.body.number2, req.body.price2,
                                function(result) {
                if (result == -1) {
                    res.statusCode = 500;
                    return res.json({
                        error : 'Error 500: Server error.'
                    });
                }

                res.json(result); 
            });
        });
    });

    app.delete(url + '/flights', function(req, res) {
        if (req.headers['x-access-token'] == null) {
            res.statusCode = 401;
            return res.send('Error 401: Missing token.');
        }

        adminDAO.checkExpireToken(req.headers['x-access-token'], function(result, userId) {
            if (result == -1) {
                res.statusCode = 500;
                return res.send('Error 500: Server error.');
            }

            if (!result) {
                res.statusCode = 401;
                return res.send('Error 401: Token expries.');
            }

            /*if(!req.body.hasOwnProperty('flightId') || !req.body.hasOwnProperty('time') ||
                !req.body.hasOwnProperty('grade') || !req.body.hasOwnProperty('price')) {
                res.statusCode = 400;
                return res.json({
                    error : 'Error 400: Syntax incorrect.'
                });
            }*/

            flightDAO.deleteFlight(req.query.flightId, parseInt(req.query.time), req.query.grade, 
                parseInt(req.query.price), function(result) {
                if (result == -1) {
                    res.statusCode = 500;
                    return res.json({
                        error : 'Error 500: Server error.'
                    });
                }

                res.json(result); 
            });
        });
    });
}
