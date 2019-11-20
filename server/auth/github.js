import { Strategy as GitHubStrategy } from "passport-github";
import { loginGitHub } from './user';

var passport = require('passport');
const GITHUB_API_KEY = '48f91e2d91ac9e4c88b0';
const GITHUB_SECRET_KEY = '7a2de2d0f2441b1b2866fb83ab6054de7ca6c12f';

const githubConfig = {
  clientID: GITHUB_API_KEY,
  clientSecret: GITHUB_SECRET_KEY,
  callbackURL: "http://localhost:4000/auth/github/callback",
  scope: [ 'user:email'],
  passReqToCallback: true
}

const GitHubLocal = new GitHubStrategy(
  githubConfig,
    async (req, accessToken, refreshToken, profile, done) => {
      console.log(profile, user)
      // const GitHubToken = accessToken
      const user = await loginGitHub({
        email: profile.emails[0].value,
        password: profile.id,
        username: profile.displayName,
        first_name: profile.username,
        last_name: profile.username,
      })
      
      if (user)
      return done(null, user)
      else return done(null, false, { message: 'eroro' });
    }
 );
 export default GitHubLocal;

