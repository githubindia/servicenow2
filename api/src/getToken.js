var path = require('path');

module.exports = {
    "getToken": function (request, response) {
        // After getting token redirect to specific URL
        // response.redirect('/webhook/close');1
        response.redirect('https://www.messenger.com/closeWindow/?display_text=Authenticated');
    },
    "getUser": function (request, response) {
        console.log(request.query.psid);
        response.redirect('/webhook/auth/provider');
        // response.redirect('https://www.messenger.com/closeWindow/?display_text=Authenticated');
    }

}