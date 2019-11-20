import passport from 'passport';
import PassportLocal from './local';
import LinkedInLocal from "../server/auth/linkedIn";
import GitHubLocal from "../server/auth/github";



passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    imageUrl: user.profile_photo,
  });
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
passport.use('local', PassportLocal);
passport.use("linkedin", LinkedInLocal);
passport.use("github", GitHubLocal);


export default passport;
