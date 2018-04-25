module.exports = {
    "getToken": function (request, response) {
        response.redirect('https://servicenow2.herokuapp.com/closeWindow.html');
    },
    "getUser": function (request, response) {
        console.log(req.query.psid);
    }

}