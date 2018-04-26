var getToken = require('./getToken');
var serviceNow = require('./servicenow');
module.exports = {
    "makeResponse": function(senderId, request, callback) {
        if (request.result.metadata.intentName == 'Default Welcome Intent') {

            var response;
            request.result.fulfillment.messages.forEach(function(element){
                if (element.type == 4){
                    response = element.payload.facebook;
                }
            });
            callback(null, response);
        } else if (request.result.metadata.intentName == 'raiseRequest') { 

        } else if (request.result.metadata.intentName == 'incident_initialized') {
            var response;
            request.result.fulfillment.messages.forEach(function(element){
                if (element.type == 4){
                    response = element.payload.facebook;
                }
            });
            callback(null, response);
        } else if (request.result.metadata.intentName == 'create_new_incident') {
            let res = {
                "attachment":{  
                    "type":"template",
                    "payload":{  
                        "template_type":"button",
                        "text":"Click the button below to login.",
                        "buttons":[
                            {  
                                "type":"web_url",
                                "url":"https://servicenow2.herokuapp.com/webhook/close?psid=" + senderId,
                                "title":"Login",
                                "webview_height_ratio":"tall"
                            }
                        ]
                    }
                }
            };
            callback(null, res);
        } else if (request.result.metadata.intentName == 'incident_description') {
            var desc = request.result.parameters.any;
            var token = global.session.token;
            serviceNow.logIncident(token, desc, function(err, body) {
                var result = `Your incident has been created with the incident number ${serviceNowResponse.result.number}.`
            })
            callback(null, result);
        }
    }
}