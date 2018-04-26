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

// 2nd route
router.route('/auth/provider')

  .get(function (req, res, next) {
    req.session.senderId = req.query.psid;
    next();
  }, passport.authenticate('provider'));

// 3rd route managed by passportJS
router.route('/auth/provider/callback')

  .get(passport.authenticate('provider', { successRedirect: '/webhook/success', failureRedirect: '/login'}));

app.use(router);

// 4th route redirect URL
router.route('/success')

  .get(getTokenController.getToken);

router.route('/postback')

  .get(getTokenController.getUser)

// 1st route
router.route('/close')

  .get(getTokenController.getUser);



module.exports = router;