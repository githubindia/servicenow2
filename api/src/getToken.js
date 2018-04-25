var path = require('path');
var serviceNow = require('./servicenow.js');
const FACEBOOK_ACCESS_TOKEN = 'EAAc6hI7VvPwBAHboQmC66s33wksVxCsAjOZAr5scCnsEFc0P2IrFrOvEO9jip3rjoZBo0PDzTckZAWVPwOZC9POI8GldBEALmpP6q8NTeU4ZA0XIp7ZB96gj0rqcSfYR3HQ6Ue3oTmBUNA6Q6lhELpNmtZAj3ttn23lIXh16kTeqQZDZD';
var deasync = require('deasync');

module.exports = {
    "getToken": function (request, response) {
        // After getting token redirect to specific URL
        // response.redirect('/webhook/close');1
        response.redirect('https://www.messenger.com/closeWindow/?display_text=Authenticated');
        console.log(request.session.senderId);
        console.log(request.session.passport.user.accessToken);
        var psid = request.session.senderId;
        var token = request.session.passport.user.accessToken;
        console.log("done");
        let serviceNowResponse = deasync(function(callback){
            serviceNow.logIncident(token, callback);
        })();
        console.log(serviceNowResponse);
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id: psid },
                message: {"text": serviceNowResponse}
            }
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
            } else {
                console.error("Unable to send message:" + err);
            }
    });


    },
    "getUser": function (request, response) {
        console.log(request.query.psid);
        var psid = request.query.psid;
        response.redirect("/webhook/auth/provider?psid=" + psid);
        // response.redirect('https://www.messenger.com/closeWindow/?display_text=Authenticated');
    }

}