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

const app = express();
const port = 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serves all the html, js, and css
// app.use('/html', express.static('html'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));

app.put('/setLoggedIn', async(request, response) => {
    const options = request.body;
    try {
        if (options['cookies'] === '' || JSON.stringify(options['cookies']) === JSON.stringify({})) {
            response.status(200).json('false');
        } else {
            response.status(200).json('true');
        }
    } catch (err) {
        response.status(400).json('setLoggedIn login error');
    }
});

// Redirect you to home.html when you type /home
app.get("/home", (req, res) => res.redirect("/html/home.html"));
app.get("/", (req, res) => res.redirect("/html/home.html"));

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
        response.status(200).json('Thanks for signing up');
    } catch (err) {
        console.log(err.stack);
        await client.end();
        response.status(400).json({ error: ' An account already exists with the email: ' + options['email'] + '. Please try logging in! Thanks! :) ' });
    }
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
            response.status(400).json('Incorrect login information.');
        } else {
            console.log(res.rows[0]);
            await client.end();
            response.status(200).json({"message": "Logging in...", "fname": res.rows[0]['fname'], "lname": res.rows[0]['lname']});
        }
    } catch (err) {
        console.log(err.stack);
        await client.end();
        response.status(400).json('Incorrect login information.');
    }
});

app.put('/loadQuiz', async(request, response) => {
    const options = request.body;

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        },
    
    });

    client.connect();

    const text = 'select cs_chosen from users where email = \'' + options['email'] + '\'';
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

app.put('/updateQuiz', async(request, response) => {
    const options = request.body;

    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        },
    
    });

    client.connect();
    console.log(options);
    const colNames = ['cs_chosen']
    for (let i = 0; i < 1; i++) {
        const currSelected = options['quiz']['questions'][i]['selected'].filter(word => word !== "undefined");
        let insertList = '';
        for (let j = 0; j < currSelected.length; j++) {
            insertList += '\"' + currSelected[j]['text'] + "\""
            if (j !== currSelected.length - 1) {
                insertList += ", "
            }
        }
        const text = 'UPDATE users SET ' + colNames[i] + ' = \'{' + insertList + '}\' WHERE email = \'' + options['email'] + '\'';
        console.log(text);
        // async/await
        try {
            const res = await client.query(text);
        } catch (err) {
            console.log(err.stack);
            await client.end();
            response.status(500).json('Server error');
            break;
        }
    }
    await client.end();
    response.status(200).json("Successfully updated information.");
});

app.put('/signoutUser', async(request, response) => {
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
});

app.get("/", (req, res) => res.redirect("/html/home.html"));

app.get('*', function(req, res) {
    console.log(req.path.substring(1));
    res.sendFile(__dirname + req.path);
});

// app.get('*', async (request, response) => {
//   response.status(404).send(`Not found: ${request.path}`);
// });

app.listen(process.env.PORT || port, () => {
  console.log(`Server started on port ${port}`);
});
