module.exports = {
    "getToken": function (request, response) {
        response.redirect('/closeWindow.html');
    },
    "getUser": function (request, response) {
        console.log(req.query.psid);
    }

}