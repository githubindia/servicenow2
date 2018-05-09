var serviceNow = require('./servicenow');
var sendFBResponse = require('./sendFBMessage');
var makeFBResponse = require('./makeResponse');
var moment = require('moment');

module.exports = {
    "logRequest": function (request, senderId, sysId, callback) {
        if(request.result.parameters.description != "") {
            var desc = request.result.parameters.description
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
                                            makeFBResponse.getDfResponse(request, function(err, res){
                                                callback(null, res);
                                            })
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
        } else {
            var response = "Please enter the description to create request."
            sendFBResponse.sendResponse(senderId, response, function(err, body){
                console.log("plain FB message sent");
            });
        }
    },
    "showLatest": function (request, senderId, callback) {
        if(session.length != 0) {
            session.forEach(function(element){
                if(element.senderId == senderId) {
                    if (request.result.metadata.intentName == "latest_incident") {
                        serviceNow.getRecords(element.token, function(err, body) {
                            body = JSON.parse(body);
                            var arr = [];
                            var result = body.result[body.result.length-1];
                            var id = result.number;
                            var desc = result.short_description;
                            var sysId = result.sys_id;
                            var dt = moment(new Date(result.opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                            var active = result.active;
                            var category = result.category;
                            category = category.charAt(0).toUpperCase() + category.slice(1);
                            arr.push({
                                "title": `Incident: ${id}`,
                                "subtitle": `Category: ${category} \nDate: ${dt} \nStatus: ${active ? "Not resolved": "Resolved"}`,
                                "buttons":[
                                    {  
                                        "type":"web_url",
                                        "url":`https://dev27552.service-now.com/nav_to.do?uri=/incident.do?sys_id=${sysId}`,
                                        "title":"View",
                                        "webview_height_ratio":"tall"
                                    }
                                ]
                            });
                            this.sendAllResponse(request, arr, senderId, function(err, res){
                                callback(null, res);
                            })

                        })
                    } else {
                        serviceNow.getUserRequests(element.token, function(err,body) {
                            body = JSON.parse(body);
                            var arr = [];
                            var result = body.records[body.records.length-1];
                            var id = result.number;
                            var approval = result.approval;
                            var dt = moment(new Date(result.opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                            var sysId = result.sys_id;
                            arr.push({
                                "title": `Requests Number: ${id}`,
                                "subtitle": `Approval: ${approval} \nDate: ${dt}`,
                                "buttons":[
                                    {  
                                        "type":"web_url",
                                        "url":`https://dev27552.service-now.com/nav_to.do?uri=/sc_request.do?sys_id=${sysId}`,
                                        "title":"View",
                                        "webview_height_ratio":"tall"
                                    }
                                ]
                            });
                            module.exports.sendAllResponse(request, arr, senderId, function(err, res){
                                callback(null, res);
                            })
                        })
                    }
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
    },
    "showLastFive": function (request, senderId, callback) {
        if(session.length != 0) {
            session.forEach(function(element){
                if(element.senderId == senderId) {
                    if (request.result.metadata.intentName == "last_five_incidents") {
                        serviceNow.getRecords(element.token, function(err, body) {
                            body = JSON.parse(body);
                            var arr = [];
                            var length = body.result.length;
                            for (i = length - 1; i >= length - 5; i--) {
                                var id = body.result[i].number;
                                var desc = body.result[i].short_description;
                                var sysId = body.result[i].sys_id;
                                var dt = moment(new Date(body.result[i].opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                                var category = body.result[i].category;
                                var active = body.result[i].active;
                                category = category.charAt(0).toUpperCase() + category.slice(1);
                                    arr.push({
                                        "title": `Incident: ${id}`,
                                        "subtitle": `Category: ${category} \nDate: ${dt} \nStatus: ${active ? "Not resolved": "Resolved"}`,
                                        "buttons":[
                                            {  
                                                "type":"web_url",
                                                "url":`https://dev27552.service-now.com/nav_to.do?uri=/incident.do?sys_id=${sysId}`,
                                                "title":"View",
                                                "webview_height_ratio":"tall"
                                            }
                                        ]
                                    });
                            }
                            module.exports.sendAllResponse(request, arr, senderId, function(err, res){
                                callback(null, res);
                            })
                        })
                    } else {
                        serviceNow.getUserRequests(element.token, function(err,body) {
                            body = JSON.parse(body);
                            var arr = [];
                            var length = body.records.length;
                            for (i = length - 1; i >= length - 5; i--) {
                                var id = body.records[i].number;
                                var sysId = body.records[i].sys_id;
                                var dt = moment(new Date(body.records[i].opened_at)).format('MMMM Do YYYY, h:mm:ss A');
                                var approval = body.records[i].approval;
                                    arr.push({
                                        "title": `Request Number: ${id}`,
                                        "subtitle": `Approval: ${approval} \nDate: ${dt}`,
                                        "buttons":[
                                            {  
                                                "type":"web_url",
                                                "url":`https://dev27552.service-now.com/nav_to.do?uri=/incident.do?sys_id=${sysId}`,
                                                "title":"View",
                                                "webview_height_ratio":"tall"
                                            }
                                        ]
                                    });
                            }
                            module.exports.sendAllResponse(request, arr, senderId, function(err, res){
                                callback(null, res);
                            })
                        })
                    }
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
    },
    "sendAllResponse": function(request, arr, senderId, callback) {
        makeFBResponse.getCorousalResponse(arr, function (res) {
            sendFBResponse.sendTemplate(senderId, res, function(body) {
                makeFBResponse.getDfResponse(request, function(err, res){
                    callback(null, res);
                })
            })
        })
    }
}