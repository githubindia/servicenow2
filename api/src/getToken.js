var path = require('path');

module.exports = {
    "getToken": function (request, response) {
        response.redirect('/webhook/close');
    },
    "getUser": function (request, response) {
        console.log(request.query.psid);
    }

}