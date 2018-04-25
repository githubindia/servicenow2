var path = require('path');

module.exports = {
    "getToken": function (request, response) {
        response.redirect((path.resolve(__dirname + '/../../closeWindow.html')));
    },
    "getUser": function (request, response) {
        console.log(req.query.psid);
    }

}