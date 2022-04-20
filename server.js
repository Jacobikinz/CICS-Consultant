import express, { response } from 'express';
import logger from 'morgan';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import { Quiz } from './js/quiz.js';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(
    import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);

dotenv.config();

// let users = [];
let loggedIn = false;
// let currUser = undefined;

// const userFile = 'userfile.json';

// async function reload(filename) {
//     try {
//         const data = await readFile(filename, { encoding: 'utf8' });
//         users = JSON.parse(data);
//     } catch (err) {
//         users = [];
//     }
// }

// async function saveUsers() {
//     try {
//         const data = JSON.stringify(users);
//         await writeFile(userFile, data, { encoding: 'utf8' });
//     } catch (err) {
//         console.log(err);
//     }
// }

// function userExists(email) {
//     let index = 0;
//     let returnindex = null;
//     users.forEach((user) => {
//         if (user['email'] === email) {
//             returnindex = index;
//         }
//         index += 1;
//     });

//     if (returnindex !== null) {
//         return returnindex;
//     } else {
//         return -1;
//     }
// }


// function checkPass(email, pass) {
//     let index = 0;
//     let returnIndex = null;
//     users.forEach((user) => {
//         if (user['email'] === email && user['password'] === pass) {
//             returnIndex = index;
//         }
//         index += 1;
//     });

//     if (returnIndex !== null) {
//         return returnIndex;
//     } else {
//         return -1;
//     }
// }

const app = express();
const port = 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serves all the html, js, and css
// app.use('/html', express.static('html'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));

// Need to load different HTML headers depending on if the user is logged in or not
app.get("/html/home.html", (req, res) => {
    // console.log(req.cookies);
    // if (req.cookies !== undefined) {
    if (loggedIn) {
        res.sendFile(__dirname + "/html/home_loggedin.html");
    } else {
        res.sendFile(__dirname + "/html/home.html");
    }
});

app.get("/html/about.html", (req, res) => {
    // if (req.cookies !== undefined) {

    if (loggedIn) {
        res.sendFile(__dirname + "/html/about_loggedin.html");
    } else {
        res.sendFile(__dirname + "/html/about.html");
    }
});

app.get("/html/faq.html", (req, res) => {
    // if (req.cookies !== undefined) {
    if (loggedIn) {
        res.sendFile(__dirname + "/html/faq_loggedin.html");
    } else {
        res.sendFile(__dirname + "/html/faq.html");
    }
});

app.get("/html/tracks-overview.html", (req, res) => {
    // if (req.cookies !== undefined) {
    if (loggedIn) {
        res.sendFile(__dirname + "/html/tracks-overview_loggedin.html");
    } else {
        res.sendFile(__dirname + "/html/tracks-overview.html");
    }
});

// Redirect you to home.html when you type /home
app.get("/home", (req, res) => res.redirect("/html/home.html"));
app.get("/", (req, res) => res.redirect("/html/home.html"));

// // Redirect to tracks, FAQ, About, etc.
// app.get("/tracks", (req, res) => res.redirect("/html/tracks-overview.html"));
// app.get("/faq", (req, res) => res.redirect("/html/faq.html"));
// app.get("/about", (req, res) => res.redirect("/html/about.html"));
// app.get("/login", (req, res) => res.redirect("/html/signin.html"));
// app.get("/signup", (req, res) => res.redirect("/html/signup.html"));
// app.get("/tracks", (req, res) => res.redirect("/html/tracks-overview.html"));


app.post('/signupUser', async(request, response) => {
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
        loggedIn = true;
        response.status(200).json('Thanks for signing up');
    } catch (err) {
        console.log(err.stack);
        await client.end();
        response.status(400).json({ error: ' An account already exists with the email: ' + options['email'] + '. Please try logging in! Thanks! :) ' });
    }


    // await reload(userFile);
    // if (userExists(options['email']) !== -1) {
        // response.status(400).json({ error: ' An account already exists with the email: ' + options['email'] + '. Please try logging in! Thanks! :) ' })
    // } else {
        // options['quiz'] = new Quiz(options.email);
        // users.push(options);
    // response.status(200).json('Thanks for signing up');
        // saveUsers();
        // loggedIn = true;
        // currUser = options['email'];
        // sessionStorage.setItem('status', 'loggedIn');
    // }
});

app.get('/loginUser', async(request, response) => {
    const options = request.headers;

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        },
    
    });

    client.connect();

    const text = 'select * from users where email = \'' + options['email'] + '\' and password = \'' + options['password'] + '\'';
    // async/await
    try {
        const res = await client.query(text);
        if (res.rows[0] === undefined) {
            await client.end();
            loggedIn = false;
            response.status(400).json('Incorrect login information.');
        } else {
            console.log(res.rows[0]);
            await client.end();
            loggedIn = true;
            response.status(200).json({"message": "Logging in...", "fname": res.rows[0]['fname'], "lname": res.rows[0]['lname']});
        }
    } catch (err) {
        console.log(err.stack);
        await client.end();
        response.status(400).json('Incorrect login information.');
    }

    // await reload(userFile);
    // const options = request.headers;
    // if (userExists(options['email']) !== -1 && checkPass(options['email'], options['password']) !== -1) {
    //     response.status(200).json('Logging in...');
    //     loggedIn = true;
    //     // currUser = options['email'];
    //     // sessionStorage.setItem('status', 'loggedIn');
    // } else if (userExists(options['email']) === -1) {
    //     response.status(400).json('No account with the email: ' + options['email'] + ' exists. Please register! ');
    // } else if (userExists(options['password']) === -1) {
    //     response.status(400).json('Incorrect password.');
    // }
});

// !!!!!!!!!!!!!!!!!!!!!!!!!
// TODO: REWRITE THIS (BELOW)

// !!!!!!!!!!!!!!!!!!!!!!!!!

// app.get('/getUser', async(request, response) => {
//     await reload(userFile);
//     if (userExists(currUser) !== -1) {
//         response.send(users[userExists(currUser)]);
//         response.status(200);
//     } else if (userExists(users[currUser]) === -1) {
//         response.status(400).json('No account with the email: ' + currUser + ' exists. Please register! ');
//     }
// });

app.put('/signoutUser', async(request, response) => {
    loggedIn = false;
    // currUser = null;
    // sessionStorage.clear();
    response.status(200).json('Successfully signed out.');
});


app.put('/newInfo', async(request, response) => {
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
        const res = await client.query(text);
        await client.end();
        response.status(200).json("Successfully updated information.");
    } catch (err) {
        console.log(err.stack);
        await client.end();
        response.status(500).json('Server error');
    }
    // await reload(userFile);
    // try {
    //     const options = request.body;
    //     const currUserIndex = userExists(options.oldemail);
    //     users[currUserIndex]['email'] = options.newemail;
    //     users[currUserIndex]['quiz'] = options.quiz;
    //     saveUsers();
    //     response.status(200).json('Successfully updated information.');
    // } catch (err) {
    //     response.status(500).json({ "error": err });
    // }
});

app.delete('/deleteUser', async(request, response) => {
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
        const res = await client.query(text);
        await client.end();
        response.status(200).json("Your profile has been deleted.");
    } catch (err) {
        console.log(err.stack);
        await client.end();
        response.status(500).json('Server error');
    }
    
    // await reload(userFile);
    // try {
    //     const options = request.body;
    //     const currUserIndex = userExists(options.email);
    //     users.splice(currUserIndex, 1);
    //     saveUsers();
    //     // loggedIn = false;
    //     response.status(200).json('Deleted user with email: ' + options.email);
    // } catch (err) {
    //     response.status(500).json({ "error": err });
    // }
});

app.get("/", (req, res) => res.redirect("/html/home.html"));

app.get('*', function(req, res) {
    console.log(req.path.substring(1));
    res.sendFile(__dirname + req.path);
});

// app.get('*', async (request, response) => {
//   console.log(loggedIn);
//   response.status(404).send(`Not found: ${request.path}`);
// });

app.listen(process.env.PORT || port, () => {
  console.log(`Server started on port ${port}`);
});
