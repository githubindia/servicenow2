var getToken = require('./getToken');
var serviceNow = require('./servicenow');
var sendFBResponse = require('./sendFBMessage');
var makeFBResponse = require('./makeResponse');
module.exports = {
    "makeResponse": function(senderId, request, callback) {
        console.log("----------------inside makeResponses");
        if (request.result.metadata.intentName == 'Default Welcome Intent') {
            console.log(session);
            if(session.length != 0) {
                session.forEach(function(element){
                    if(element.senderId == senderId) {
                        console.log("senderId found");
                        console.log(element.token);
                        serviceNow.getRecords(element.token, function(err, body){
                            console.log(body);
                            var userName = body.result[0].sys_updated_by;
                            var response = `Hello there! ${userName}, Welcome to Genie+`.
                            sendFBResponse.sendResponse(senderId, response, function(err, body) {
                                makeFBResponse.genericResponse(function(res){
                                    callback(null, res);
                                })
                            })
                        })
                    } else {
                        console.log("senderId not found");
                        makeFBResponse.loginResponse(senderId, function(res) {
                            callback(null, res);
                        })
                    }
                });
            } else {
                var response = `Hello! Welcome to Genie+. Please login to continue.`;
                sendFBResponse.sendResponse(senderId, response, function(err, body) {
                    makeFBResponse.loginResponse(senderId, function(res) {
                            callback(null, res);
                        })
                })
            }
            // var response;
            // request.result.fulfillment.messages.forEach(function(element){
            //     if (element.type == 4){
            //         response = element.payload.facebook;
            //     }
            // });
            // callback(null, response);
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
            console.log(session);
            var token = session[0].token;
            console.log("---------------" + token);
            serviceNow.logIncident(token, desc, function(err, body) {
                console.log(body);
                var result = `Your incident has been created with the incident number ${body.result.number}.`
            })
            callback(null, result);
        }
    }
}