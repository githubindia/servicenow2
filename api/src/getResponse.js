var path = require('path');
const FACEBOOK_ACCESS_TOKEN = 'EAAc6hI7VvPwBAHboQmC66s33wksVxCsAjOZAr5scCnsEFc0P2IrFrOvEO9jip3rjoZBo0PDzTckZAWVPwOZC9POI8GldBEALmpP6q8NTeU4ZA0XIp7ZB96gj0rqcSfYR3HQ6Ue3oTmBUNA6Q6lhELpNmtZAj3ttn23lIXh16kTeqQZDZD';
var deasync = require('deasync');
var request1 = require('request');
var serviceNow = require('./servicenow');
var sendFBResponse = require('./sendFBMessage');
var makeFBResponse = require('./makeResponse');
module.exports = {
    "makeResponse": function(senderId, request, callback) {
        console.log("----------------inside makeResponses");
        if (request.result.metadata.intentName == 'Default Welcome Intent') {
            if(session.length != 0) {
                session.forEach(function(element){
                    if(element.senderId == senderId) {
                        serviceNow.getRecords(element.token, function(err, body){
                            body = JSON.parse(body);
                            var userName = body.result[0].sys_updated_by;
                            var name = " ";
                            var arr = [];
                            arr.forEach(function(element){
                                name = name + element;
                            })
                            var response = `Hello there!${name}, Welcome to Service Desk.`;
                            sendFBResponse.sendResponse(senderId, response, function(err, body) {
                                makeFBResponse.genericResponse(function(res){
                                    callback(null, res);
                                })
                            })
                        })
                    } else {
                        makeFBResponse.loginResponse(senderId, function(res) {
                            callback(null, res);
                        })
                    }
                });
            } else {
                var response = `Hello! Welcome to Service Desk. Please login to continue.`;
                sendFBResponse.sendResponse(senderId, response, function(err, body) {
                    makeFBResponse.loginResponse(senderId, function(res) {
                            callback(null, res);
                        })
                })
            }
        } else if (request.result.metadata.intentName == 'raiseRequest') {

        } else if (request.result.metadata.intentName == 'incident_initialized') {
            var response;
            request.result.fulfillment.messages.forEach(function(element){
                if (element.type == 4){
                    response = element.payload.facebook;
                }
            });
            callback(null, response);
        } else if (request.result.metadata.intentName == 'enter_description') {
            if(request.result.parameters.description != "") {
                var desc = request.result.parameters.description;
                if(session.length != 0) {
                    session.forEach(function(element){
                        if(element.senderId == senderId) {
                            serviceNow.logIncident(element.token, desc, function(err, body) {
                                console.log(body);
                                var id = body.result.number;
                                var desc = body.result.short_description;
                                makeFBResponse.getCardResponse(id, desc, function(res) {
                                    console.log("--------" + res);
                                    sendFBResponse.sendTemplate(senderId, res, function(err, body){
                                        console.log("FB template message sent");
                                    }) 
                                })
                                //var result = `Your incident has been created. with the incident number ${body.result.number}.`
                                
                            })
                        } else {
                            makeFBResponse.loginResponse(senderId, function(res) {
                                callback(null, res);
                            })
                        }
                    })
                } else {
                    var response = `Please login first to continue.`;
                    sendFBResponse.sendResponse(senderId, response, function(err, body) {
                        makeFBResponse.loginResponse(senderId, function(res) {
                                callback(null, res);
                        })
                    })
                }
            } else {
                var response = "Please enter the description to create incident."
                sendFBResponse.sendResponse(senderId, response, function(err, body){
                    console.log("plain FB message sent");
                });
            }
            callback(null, response);
            if(session.length != 0) {
                session.forEach(function(element){
                    if(element.senderId == senderId) {
                        serviceNow.logIncident(element.token, desc, function(err, body) {
                            console.log(body);
                            var result = `Your incident has been created with the incident number ${body.result.number}.`
                        })
                    }
                })
            }
            // let res = {
            //     "attachment":{  
            //         "type":"template",
            //         "payload":{  
            //             "template_type":"button",
            //             "text":"Click the button below to login.",
            //             "buttons":[
            //                 {  
            //                     "type":"web_url",
            //                     "url":"https://servicenow2.herokuapp.com/webhook/close?psid=" + senderId,
            //                     "title":"Login",
            //                     "webview_height_ratio":"tall"
            //                 }
            //             ]
            //         }
            //     }
            // };
            // callback(null, res);
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
    },
    // After getting token this method called.
    "getToken": function (request, response) {
        // After getting token redirect to specific URL
        // response.redirect('/webhook/close');1
        response.redirect('https://www.messenger.com/closeWindow/?display_text=Authenticated');
        // response.status(200).send('Please close this window to return to the conversation thread.');
        console.log(request.session.senderId);
        console.log(request.session.passport.user.accessToken);
        var psid = request.session.senderId;
        var token = request.session.passport.user.accessToken;
        global.session.push({
            "senderId":psid,
            "token":token
        })
        let serviceNowResponse;
        var userName;
        //let serviceNowResponse = deasync(function(callback){
            // serviceNow.logIncident(token, function(err, body){
            //     serviceNowResponse = body;
            //     result = `Your incident has been created with the incident number ${serviceNowResponse.result.number}.`
            //     request1({
            //         url: 'https://graph.facebook.com/v2.6/me/messages',
            //         qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            //         method: 'POST',
            //         json: {
            //             recipient: { id: psid },
            //             message: {"text": result}
            //         }
            //     }, (err, res, body) => {
            //         if (!err) {
            //             console.log('message sent!')
            //         } else {
            //             console.error("Unable to send message:" + err);
            //         }
            //     });
            // });
        //})();
        //console.log(serviceNowResponse); 
        var desc = "Some description";
        serviceNow.logIncident(token, desc, function(err, body) {
            serviceNowResponse = body;
            userName = serviceNowResponse.result.sys_updated_by;
            serviceNow.deleteIncident(serviceNowResponse.result.sys_id, token, function(err, body) {
                console.log(body);
            });
            var result = `Hello! ${userName}. Here you can create or view all your requests.`
            sendFBResponse.sendResponse(psid, result, function(err, body) {
                makeFBResponse.genericResponse(function(res) {
                    sendFBResponse.sendTemplate(psid, res, function(callback){
                        console.log("template sent");
                    })
                })
            })
        })
    },
    // Method to set senderId to passportJS session.
    "getUser": function (request, response) {
        console.log(request.query.psid);
        var psid = request.query.psid;
        response.redirect("/webhook/auth/provider?psid=" + psid);
        // response.redirect('https://www.messenger.com/closeWindow/?display_text=Authenticated');
    }
}