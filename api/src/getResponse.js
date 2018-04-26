module.exports = {
    "makeResponse": function(request, callback) {
        if (request.result.metadata.intentName == 'Default Welcome Intent') {
            response = request.fulfillment.payload.facebook;
            callback(null, response);
        } else if (request.result.metadata.intentName == 'raiseRequest') {

         } //else if () {

        // }
    }
}