import passport from 'passport';
import PassportLocal from './local';

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
export default passport;