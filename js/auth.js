import passport from 'passport';
import passportLocal from 'passport-local';
import pg from 'pg';

const { Strategy } = passportLocal;

// Passport Configuration
// Create a new LocalStrategy object to handle authentication using username and
// password credentials from the client. The LocalStrategy object is used to
// authenticate a user using a username and password.
const strategy = new Strategy(async (username, password, done) => {
    console.log('here');

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },
    });

    client.connect();

    // const text = 'select * from users where email = \'' + options['email'] + '\' and password = \'' + options['password'] + '\'';
    const text = 'select * from users where email = \'' + username + '\' and password = \'' + password + '\'';
    // async/await
    try {
        const res = await client.query(text);
        if (res.rows[0] === undefined) {
            await client.end();
            // response.status(400).json('Incorrect login information.');
            await new Promise((r) => setTimeout(r, 2000)); // two second delay
            return done(null, false, { message: 'Incorrect login information' });
            
        } else {
            console.log(res.rows[0]);
            await client.end();
            // response.status(200).json({ 'message': 'Logging in...', 'fname': res.rows[0]['fname'], 'lname': res.rows[0]['lname'] });
            return done(null, res.rows[0]['email']);
        }
    } catch (err) {
        console.log(err.stack);
        await client.end();
        // response.status(400).json('Incorrect login information.');
        return done(null, false, { message: 'Incorrect login information' });
    }
});

// Configure passport to use the LocalStrategy object.
// The LocalStrategy object is used to authenticate a user using a username and
// password. There are other strategies available, but this is the simplest.
passport.use(strategy);

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
  done(null, user);
});

// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
  done(null, uid);
});

export default {
  configure: (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
  },

  authenticate: (domain, where) => {
    return passport.authenticate(domain, where);
  },
};