var request = require("request");
 
module.exports = {
    'logIncident' : function(token, callback){
 
        //console.log("The Final Message Utterance to send POST as Query to Service Now");
       var options = { method: 'POST',
        url: 'https://dev27552.service-now.com/api/now/table/incident',
        headers: 
        { 'content-type': 'application/json',
          authorization: `Bearer ${token}` },
        body: 
        { short_description: 'desc',
          caller_id: 'Shubham Gupta',
          urgency: 2,
          comments: 'Chatbot Testing' },
        json: true };
 
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        callback(null, body)
        // console.log(body);
      });
    },
    'statusIncident' : function(ticketnumber, callback){
 
        console.log("The Final Message Utterance to send GET as Query to Service Now");
        var options = { method: 'GET',
          url: 'https://dev18442.service-now.com/api/now/v1/table/incident',
          qs: { number: ticketnumber },
          headers:
           { 'postman-token': '5441f224-d11a-2f78-69cd-51e58e2fbdb6',
             'cache-control': 'no-cache',
             authorization: 'Basic MzMyMzg6YWJjMTIz' } };
 
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
 
          console.log("Success : "+body);
          callback(null, body);
        });
    }
 
}