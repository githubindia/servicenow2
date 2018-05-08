var serviceNow = require('./servicenow');
var sendFBResponse = require('./sendFBMessage');
var makeFBResponse = require('./makeResponse');

module.exports = {
    "logRequest": function (senderId, sysId, desc, callback) {
        if(session.length != 0) {
            session.forEach(function(element){
                if(element.senderId == senderId) {
                    serviceNow.softwareInstallRequest(sysId, element.token, function(err, body) {
                        var reqNumber;
                        if(body.error == undefined) {
                            serviceNow.checkoutRequest(element.token, function(err, body2){
                                console.log(body2);
                                body2 = JSON.parse(body2);
                                reqNumber = body2.result.request_number;
                                var arr = [];
                                var response = `Your request has been created.`;
                                arr.push({
                                    "title": `Request number: ${reqNumber}`,
                                    "subtitle": `Description: ${desc}`,
                                    "buttons":[
                                        {  
                                            "type":"web_url",
                                            "url":`https://dev27552.service-now.com/nav_to.do?uri=/sc_request.do?sys_id=${body2.result.request_id}`,
                                            "title":"View",
                                            "webview_height_ratio":"tall"
                                        }
                                    ]
                                });
                                makeFBResponse.getCorousalResponse(arr, function (res) {
                                    sendFBResponse.sendTemplate(senderId, res, function(body) {
                                        var response;
                                        request.result.fulfillment.messages.forEach(function(element){
                                            if (element.type == 4){
                                                response = element.payload.facebook;
                                                callback(null, response);
                                            }
                                        });
                                    })
                                })
                            })
                        }
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
    }
}