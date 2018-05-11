var express = require('express');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var fs = require('fs');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var route = require('./api/routes')
var config = require('./config');
var taskDispatcher = require('./dispatcher/taskDispatcher');
var getAuthorization = require('./dispatcher/getAuth');
var snTask = require('./serviceNowAPI/task');
var session = require('client-sessions');
global.session = [];

var port = process.env.PORT || 3000;

app.use(session({
    cookieName: 'session',
    secret: 'af*asdf+_)))==asdf afcmnoadfadf',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

app.use(passport.initialize());

passport.use('provider', new OAuth2Strategy({authorizationURL: config.oauth.authURL,tokenURL:config.oauth.tokenURL,clientID:config.oauth.clientID,clientSecret:config.oauth.clientSecret,callbackURL:config.oauth.callbackURL}, function(accessToken, refreshToken, profile, done) {
    var tokenInfo = {};
    tokenInfo.accessToken = accessToken;
    tokenInfo.refreshToken = refreshToken;
    tokenInfo.profile = profile;
    console.log(tokenInfo);
    done(null, tokenInfo);
    })
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    done(null, id);
});
app.set('snTask', snTask);

/**
 * To support JSON-encoded bodies.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Routing to routes.js file
 */
app.use('/webhook', route);

setTimeout(function(){
    console.log("function is running")
}, 1000);

app.listen(port);
console.log("Server Running Successfully at port " + port);

module.exports = app;