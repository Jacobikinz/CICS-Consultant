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
    '/html/profile.html',
    checkLoggedIn, // If we are logged in (notice the comma!)...
    (req, res) => {
        // Go to the user's page.
        res.redirect('/html/profile/' + req.user + '.html');
    }
);

app.get(
    '/html/profile/:userID.html',
    checkLoggedIn, // We also protect this route: authenticated...
    (req, res) => {
        // Verify this is the right user.
        if (req.params.userID === req.user) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(`<!doctype html>
            <html lang="en">

            <head>
            <!-- Required meta tags -->
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">

            <link rel="stylesheet" href="..\\..\\css\\profile.css" />
            <script type="module" src="..\\..\\js\\profile.js"></script>

            <script type="module" src="..\\..\\js\\quiz.js"></script>
            <script type="module" src="..\\..\\js\\profileHeader.js"></script>
            <script type="module" src="..\\..\\js\\multiuser.js"></script>


            <!-- Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

            <link rel="icon" href="https://pbs.twimg.com/profile_images/905902678026354688/c_4AcKhd_400x400.jpg">

            <title>CICS Consultant</title>
            </head>

            <body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
                crossorigin="anonymous"></script>

            <div class="container">
                <header
                class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom samesizeheader">
                <a href="/" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                    <img src="https://pbs.twimg.com/profile_images/905902678026354688/c_4AcKhd_400x400.jpg" alt="CICS logo"
                    width="60" height="60">
                    <!-- I do not know if we are allowed to use this photo but it's from a twitter profile so ... -->
                </a>

                <ul class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <li><a href="../home.html" class="nav-link px-2 link-secondary">Home</a></li>
                    <li><a href="../tracks-overview.html" class="nav-link px-2 link-dark">Fields</a></li>
                    <li><a href="../about.html" class="nav-link px-2 link-dark">About Us</a></li>
                </ul>

                <!-- <div class="col-md-3 text-end">
                    <button type="button" class="btn btn-outline-primary me-2" id="signinbutton">Login</button>
                    <button type="button" class="btn btn-primary" id="registerbutton">Sign-up</button>
                </div> -->
                <div class="col-md-4 text-end">
                    <button type="button" class="btn btn-outline-primary me-2 invisible" id="signinbutton">Login</button>
                    <button type="button" class="btn btn-primary invisible" id="registerbutton">Sign-up</button>
                    <button type="button" class="btn btn-primary me-2" id="profilebutton">Profile</button>
                    <button type="button" class="btn btn-outline-primary me-2" id="signoutbutton">Sign Out</button>
                </div>
                </header>

                <div id="accountinfo" class="container">
                <div id="profiletitle" class="text-center">
                    <h1>Welcome to your profile!</h1>
                </div>

                <br>

                <div id="inner-account-info" class="rounded border border-secondary bg-light">
                    <br>
                    <h2 id="emailinfo">Email:</h2>
                    <br>
                    <div class="col-md-11 d-flex justify-content-around">
                    <input type="button" id="deletebutton" class="btn btn-danger" value="Delete Your Profile">
                    </div>

                    <div id="newemailcontainer" class="invisible">
                    <label id="newemaillabel" for="newemail">Enter your new email:</label>
                    <input id="newemail" type="text">
                    <input id="confirm-new-email" type="button" class="btn btn-warning" value="Confirm new info">
                    </div>

                    <h5 id="newinforesponse"></h5>
                </div>
                </div>

            </div>
            </body>

            </html>`);
            res.end();
        } else {
            res.redirect('/html/login.html');
        }
    }
);

// Serves all the html, js, and css
app.use('/html', express.static('html'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/json', express.static('json'));
app.use('/icon.jpg', express.static('icon.jpg'));

app.get('/checkLoggedIn', async (request, response) => {
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
        response.status(200).json('Thanks for signing up');
    } catch (err) {
        console.log(err.stack);
        await client.end();
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
    res.clearCookie('useremail');
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