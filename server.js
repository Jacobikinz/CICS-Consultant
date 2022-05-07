import express from 'express';
import expressSession from 'express-session';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import auth from './js/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

dotenv.config();

const app = express();
const port = 3000;
app.use(logger('dev'));

// Session configuration
const sessionConfig = {
    // set this encryption key in Heroku config (never in GitHub)!
    secret: process.env.SECRET || 'SECRET',
    resave: false,
    saveUninitialized: false,
};

app.use(expressSession(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

auth.configure(app);

// Our own middleware to check if the user is authenticated
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // If we are authenticated, run the next route.
        next();
    } else {
        // Otherwise, redirect to the login page.
        res.redirect('/html/login.html');
    }
}

app.get(
    '/profile',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => {
        // Go to the user's page.
        res.redirect('/html/profile.html');
    }
);

// Serves all the html, js, and css
app.use('/html', express.static('html'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/json', express.static('json'));
app.use('/icon.jpg', express.static('icon.jpg'));

app.get('/setLoggedIn', async (request, response) => {
    try {
        if (request.isAuthenticated()) {
            response.status(200).json('true');
        } else {
            response.status(200).json('false');
        }
    } catch (err) {
        response.status(400).json('setLoggedIn login error');
    }
});

app.put('/updateRecommendation', async (request, response) => {
    const options = request.body;

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },

    });

    client.connect();
    const text = 'UPDATE users SET curr_recommendation = \'' + options['recommendation'] + '\' WHERE email = \'' + options['email'] + '\'';
    try {
        await client.query(text);
        await client.end();
        response.status(200).json('Successfully updated information.');
    } catch (err) {
        console.log(err.stack);
        await client.end();
        response.status(500).json('Server error');
    }
});

// Redirect you to home.html when you type /home
app.get('/home', (req, res) => res.redirect('/html/home.html'));

app.get('/', (req, res) => res.redirect('/html/home.html'));

app.post('/signupUser', async (request, response) => {
    // const { username, password } = req.body;
    // if (users.addUser(username, password)) {
    //     res.redirect('/login');
    // } else {
    //     res.redirect('/register');
    // }

    const options = request.body;

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },

    });

    client.connect();

    const text = 'INSERT INTO users(fname, lname, email, password) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [options['fname'], options['lname'], options['email'], options['password']];

    // async/await
    try {
        const res = await client.query(text, values);
        console.log(res.rows[0]);
        await client.end();
        // response.redirect('/html/login.html');
        response.status(200).json('Thanks for signing up');
    } catch (err) {
        console.log(err.stack);
        await client.end();
        // response.redirect('/html/signup.html');
        response.status(400).json({ error: ' An account already exists with the email: ' + options['email'] + '. Please try logging in! Thanks! :) ' });
    }
});

app.post('/loginUser', async (req, res) => {
    auth.authenticate('local', {
        // use username/password authentication
        successRedirect: '/home', // when we login, go to /private
        failureRedirect: '/html/login.html', // otherwise, back to login
    })(req, res);
    console.log(req.body);
    res.cookie('useremail', req.body['username']);
});

app.put('/loadQuiz', async (request, response) => {
    const options = request.body;

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },

    });

    client.connect();

    const text = 'select cs_chosen, curr_recommendation from users where email = \'' + options['email'] + '\'';
    console.log(text);
    // async/await
    try {
        const res = await client.query(text);
        await client.end();
        response.status(200).json(res.rows[0]);
    } catch (err) {
        console.log(err.stack);
        await client.end();
        response.status(400).json('Incorrect login information.');
    }
});

app.put('/updateQuiz', async (request, response) => {
    const options = request.body;

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },

    });

    client.connect();
    console.log(options);
    const colNames = ['cs_chosen'];
    for (let i = 0; i < 1; i++) {
        const currSelected = options['quiz']['questions'][i]['selected'].filter(word => word !== 'undefined');
        let insertList = '';
        for (let j = 0; j < currSelected.length; j++) {
            insertList += '"' + currSelected[j]['text'] + '"';
            if (j !== currSelected.length - 1) {
                insertList += ', ';
            }
        }
        const text = 'UPDATE users SET ' + colNames[i] + ' = \'{' + insertList + '}\' WHERE email = \'' + options['email'] + '\'';
        console.log(text);
        // async/await
        try {
            await client.query(text);
        } catch (err) {
            console.log(err.stack);
            await client.end();
            response.status(500).json('Server error');
            break;
        }
    }
    await client.end();
    response.status(200).json('Successfully updated information.');
});

app.put('/signoutUser', async (request, response) => {
    // response.status(200).json('Successfully signed out.');
    request.logout(); // Logs us out!
    response.clearCookie('useremail');
    response.redirect('/html/login.html'); // back to login
});


app.put('/newInfo', async (request, response) => {
    const options = request.body;

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },

    });

    client.connect();
    console.log(options);
    const text = 'UPDATE users SET email = \'' + options['newemail'] + '\' WHERE email = \'' + options['oldemail'] + '\'';
    console.log(text);
    // async/await
    try {
        await client.query(text);
        await client.end();
        response.status(200).json('Successfully updated information.');
    } catch (err) {
        console.log(err.stack);
        await client.end();
        response.status(500).json('Server error');
    }
});

app.delete('/deleteUser', async (request, response) => {
    const options = request.body;

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        },

    });

    client.connect();
    console.log(options);
    const text = 'DELETE FROM users WHERE email = \'' + options['email'] + '\'';
    console.log(text);
    // async/await
    try {
        await client.query(text);
        await client.end();
        request.logout(); // Logs us out!
        response.clearCookie('useremail');
        response.status(200).json('Your profile has been deleted.');
    } catch (err) {
        console.log(err.stack);
        await client.end();
        response.status(500).json('Server error');
    }
});

app.get('/', (req, res) => res.redirect('/html/home.html'));

app.get('*', function (req, res) {
    console.log(req.path.substring(1));
    res.sendFile(__dirname + req.path);
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server started on port ${port}`);
});