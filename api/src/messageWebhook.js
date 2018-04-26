const processMessage = require('./processMessage');
const processPayload = require('./processPayload');
var db = require('../db/mysql.js');

module.exports = (req, res) => {
    console.log(req.body.object);
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                console.log(event);
                if (event.message && event.message.text) {
                    //db.insertRecord(event, function(res){})
                    processMessage(event);
                } else if (event.postback && event.postback.payload) {
                    processPayload(event);
                }
            });
        });
        res.status(200).end();
    }
};