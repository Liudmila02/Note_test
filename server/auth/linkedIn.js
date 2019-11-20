import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import {loginLinkedIn} from './user';

var passport = require('passport');
const LINKEDIN_API_KEY = '86lo0sj7fe1fa7';
const LINKEDIN_SECRET_KEY = 'sLFrrGtQOM2cpc9N';

const linkedinConfig = {
  clientID: LINKEDIN_API_KEY,
  clientSecret: LINKEDIN_SECRET_KEY,
  callbackURL: "http://localhost:4000/auth/linkedin/callback",
  scope: ['r_liteprofile', 'r_emailaddress'],
  passReqToCallback: true
}

const LinkedInLocal = new LinkedInStrategy(
  linkedinConfig,
    async (req, accessToken, refreshToken, profile, done) => {
      const linkedinToken = accessToken
      const user = await loginLinkedIn({
        email: profile.emails[0].value,
        password: profile.id,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName
      })
      if (user)
      return done(null, user)
      else return done(null, false, { message: 'eroro' });
    }
 );
 export default LinkedInLocal;

