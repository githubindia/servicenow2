var path = require('path');
var serviceNow = require('./servicenow.js');
const FACEBOOK_ACCESS_TOKEN = 'EAAc6hI7VvPwBAHboQmC66s33wksVxCsAjOZAr5scCnsEFc0P2IrFrOvEO9jip3rjoZBo0PDzTckZAWVPwOZC9POI8GldBEALmpP6q8NTeU4ZA0XIp7ZB96gj0rqcSfYR3HQ6Ue3oTmBUNA6Q6lhELpNmtZAj3ttn23lIXh16kTeqQZDZD';
var deasync = require('deasync');
var request1 = require('request');

module.exports = {
    "getToken": function (request, response) {
        // After getting token redirect to specific URL
        // response.redirect('/webhook/close');1
        response.send('https://www.messenger.com/closeWindow/?display_text=Authenticated');
        // response.status(200).send('Please close this window to return to the conversation thread.');
        console.log(request.session.senderId);
        console.log(request.session.passport.user.accessToken);
        var psid = request.session.senderId;
        var token = request.session.passport.user.accessToken;
        console.log("done");
        let serviceNowResponse;
        //let serviceNowResponse = deasync(function(callback){
            serviceNow.logIncident(token, function(err, body){
                serviceNowResponse = body;
                result = `Your incident has been created with the incident number ${serviceNowResponse.result.number}.`
                request1({
                    url: 'https://graph.facebook.com/v2.6/me/messages',
                    qs: { access_token: FACEBOOK_ACCESS_TOKEN },
                    method: 'POST',
                    json: {
                        recipient: { id: psid },
                        message: {"text": result}
                    }
                }, (err, res, body) => {
                    if (!err) {
                        console.log('message sent!')
                    } else {
                        console.error("Unable to send message:" + err);
                    }
                });
            });
        //})();
        //console.log(serviceNowResponse);

    },
    "getUser": function (request, response) {
        console.log(request.query.psid);
        var psid = request.query.psid;
        response.redirect("/webhook/auth/provider?psid=" + psid);
        // response.redirect('https://www.messenger.com/closeWindow/?display_text=Authenticated');
    }

}