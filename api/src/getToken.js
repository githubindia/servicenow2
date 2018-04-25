var path = require('path');

module.exports = {
    "getToken": function (request, response) {
        // After getting token redirect to specific URL
        // response.redirect('/webhook/close');1
        console.log(request.session.senderId);
        console.log(request.session.passport.user.accessToken);
        response.redirect('https://www.messenger.com/closeWindow/?display_text=Authenticated');
    },
    "getUser": function (request, response) {
        console.log(request.query.psid);
        var psid = request.query.psid;
        response.redirect("/webhook/auth/provider?psid=" + psid);
        // response.redirect('https://www.messenger.com/closeWindow/?display_text=Authenticated');
    }

}