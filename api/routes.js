var express = require('express');
var app = express();
var router = express.Router();
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

const verificationController = require('./src/verification');
const messageWebhookController = require('./src/messageWebhook');

router.route('/')

  .get(verificationController)

  .post(messageWebhookController);

router.route('/auth/provider')

  .get(passport.authenticate('provider'));

router.route('auth/provider/callback')

  .get(passport.authenticate('provider', { successRedirect: '/success', failureRedirect: '/login'}));

app.use(router);



module.exports = router;