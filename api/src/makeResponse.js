module.exports = {
    "genericResponse": function(callback) {
        var response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Welcome to service now",
                            "image_url": "https://s3.envato.com/files/105583135/customer-outline-22590.jpg",
                            "subtitle": "We have the solution of all your queries. Please login to continue",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "INCIDENT REQUEST",
                                    "payload": "initialize_incident_request"
                                }
                            ]
                        }
                    ]
                }
            }
        }
        callback(response);
    },
    "loginResponse": function(senderId, callback) {
        var response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Welcome to service now",
                            "image_url": "https://s3.envato.com/files/105583135/customer-outline-22590.jpg",
                            "subtitle": "We have the solution of all your queries. Please login to continue",
                            "buttons":[
                                {  
                                    "type":"web_url",
                                    "url":"https://servicenow2.herokuapp.com/webhook/close?psid=" + senderId,
                                    "title":"Login",
                                    "webview_height_ratio":"tall"
                                }
                            ]
                        }
                    ]
                }
            }
        }
        callback(response);
    }
}