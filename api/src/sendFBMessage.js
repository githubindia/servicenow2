var request = require('request');
module.exports = {
    'sendResponse': function (psid, response, callback) {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            method: 'POST',
            json: {
            recipient: { id: psid },
            message: {"text": response}
            }
            }, (err, res, body) => {
            if (!err) {
            console.log('message sent!');
            callback(null, body);
            } else {
            console.error("Unable to send message:" + err);
            }
        });
    }
}