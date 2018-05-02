require('dotenv').config()
config = {};

config.instanceURL = process.env.INSTANCE_URL;

// OAuth Configuration 
config.oauth = {};
config.oauth.clientID = SN_CLIENT_ID;
config.oauth.clientSecret = SN_CLIENT_SECRET;
config.oauth.authURL = config.instanceURL + '/oauth_auth.do';
config.oauth.tokenURL = config.instanceURL + '/oauth_token.do';
config.oauth.callbackURL = 'https://servicenow2.herokuapp.com/webhook/auth/provider/callback';

module.exports = config;