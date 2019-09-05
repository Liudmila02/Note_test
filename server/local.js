import { Strategy as LocalStrategy } from 'passport-local';
import Users from './controllers/user';
const PassportLocal = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    if (!email || !password) {
      return done(null, false, { message: 'Invalid data format.' });
    }
    try {
      const user = await Users.login(email, password);
      return done(null, user);
    } catch (err) {
      let message = err.message || 'An error occurred. Please try again later.';
      return done(null, false, { message });
    }
  }
);
export default PassportLocal;