module.exports = {
    "makeResponse": function(request, callback) {
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
        }
    }
}