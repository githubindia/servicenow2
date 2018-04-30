const request = require('request');
const FACEBOOK_ACCESS_TOKEN = 'EAAc6hI7VvPwBAHboQmC66s33wksVxCsAjOZAr5scCnsEFc0P2IrFrOvEO9jip3rjoZBo0PDzTckZAWVPwOZC9POI8GldBEALmpP6q8NTeU4ZA0XIp7ZB96gj0rqcSfYR3HQ6Ue3oTmBUNA6Q6lhELpNmtZAj3ttn23lIXh16kTeqQZDZD';
const API_AI_TOKEN = 'd786ef841ad7471a978e218ca532df82'; // silly-name-maker agent.
const apiAiClient = require('apiai')(API_AI_TOKEN);
const getResponse = require('./getResponse');

const sendTextMessage = (senderId, res) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: res
        }
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
};

module.exports = (event) => {
    console.log('------------------Inside processMessage-------------------');
    console.log(JSON.stringify(event));
    const senderId = event.sender.id;
    //const message = event.message.text;
    var message;
    if (event.message.quick_reply != undefined) {
        message = event.message.quick_reply.payload;
    } else {
        message = event.message.text;
    }
    var apiaiSession = apiAiClient.textRequest(message, {sessionId: senderId});
    //console.log(JSON.stringify(apiaiSession)); 
    apiaiSession.on('response', (response) => {
        console.log(JSON.stringify(response));
        //console.log(JSON.stringify(response));
        // const result = response.result.fulfillment.speech;
        // response.queryResult.fulfillmentMessages.forEach(function(element){
        //     arr.push()
        // })
        getResponse.makeResponse(senderId, response, function(err, res){
            sendTextMessage(senderId, res);
        })
        // if (response.result.metadata.intentName == 'raiseRequest') {
        //     console.log('-------------inside if---------------');
        //     let res = {
        //         "attachment":{  
        //             "type":"template",
        //             "payload":{  
        //                 "template_type":"button",
        //                 "text":"Click the button below to login.",
        //                 "buttons":[  
        //                     {  
        //                         "type":"web_url",
        //                         "url":"https://servicenow2.herokuapp.com/webhook/close?psid=" + senderId,
        //                         "title":"Login",
        //                         "webview_height_ratio":"tall"
        //                     }
        //                 ]
        //             }
        //         }
        //     };
        // sendTextMessage(senderId, res);
        // }
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};
