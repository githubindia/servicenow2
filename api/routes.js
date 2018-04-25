var express = require('express');
var app = express();
var router = express.Router();
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var path = require('path');

const verificationController = require('./src/verification');
const messageWebhookController = require('./src/messageWebhook');
const getTokenController = require('./src/getToken')

router.route('/')

  .get(verificationController)

  .post(messageWebhookController);

router.route('/auth/provider')

  .get(passport.authenticate('provider'));

router.route('/auth/provider/callback')

  .get(passport.authenticate('provider', { successRedirect: '/webhook/success', failureRedirect: '/login'}));

app.use(router);

router.route('/success')

  .get(getTokenController.getToken);

router.route('/postback')

  .get(getTokenController.getUser)

router.route('/close')

  .get(function(req, res){
    res.sendFil(path.resolve(__dirname + '/../closeWindow.html'))
  })



module.exports = router;