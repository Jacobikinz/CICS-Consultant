import express, { response } from 'express';
import logger from 'morgan';
import { readFile, writeFile } from 'fs/promises';

let users = [];

const userFile = 'userfile.json';

async function reload(filename) {
  try {
    const data = await readFile(filename, { encoding: 'utf8' });
    users = JSON.parse(data);
  } catch (err) {
    users = [];
  }
}

async function saveUsers() {
  try {
    const data = JSON.stringify(users);
    await writeFile(userFile, data, { encoding: 'utf8' });
  } catch (err) {
    console.log(err);
  }
}

function userExists(email) {
  let index = 0;
  let returnindex = null;
  users.forEach((user) => {
    if (user['email'] === email) {
        returnindex = index;
    } 
    index += 1;
  });

  if (returnindex !== null) {
    return returnindex;
  } else {
    return -1;
  }
}

// async function createCounter(response, name) {
//   if (name === undefined) {
//     // 400 - Bad Request
//     response.status(400).json({ error: 'Counter name is required' });
//   } else {
//     await reload(JSONfile);
//     counters[name] = 0;
//     await saveCounters();
//     response.json({ name: name, value: 0 });
//   }
// }

// async function readCounter(response, name) {
//   await reload(JSONfile);
//   if (counterExists(name)) {
//     response.json({ name: name, value: counters[name] });
//   } else {
//     // 404 - Not Found
//     response.json({ error: `Counter '${name}' Not Found` });
//   }
// }

// async function updateCounter(response, name) {
//   await reload(JSONfile);
//   if (counterExists(name)) {
//     counters[name] += 1;
//     await saveCounters();
//     response.status(200).json({ name: name, value: counters[name] });
//   } else {
//     response.status(404).json({error: `No counter found with name: '${name}' `})
//   }
// }

// async function deleteCounter(response, name) {
//   await reload(JSONfile);
//   if (counterExists(name)) {
//     delete counters[name];
//     await saveCounters();
//     response.status(200).json({ name: name });
//   } else {
//     response.status(404).json({ error: `No counter found with name: '${name}' `})
//   }
// }

// async function dumpCounters(response) {
//   await reload(JSONfile);
//   response.json(counters);
// }

const app = express();
const port = 3000;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/client', express.static('client'));

// app.post('/create', async (request, response) => {
//   const options = request.body;
//   createCounter(response, options.name);
// });

// app.get('/read', async (request, response) => {
//   const options = request.query;
//   readCounter(response, options.name);
// });

// app.put('/update', async (req, res) => {
//   const options = req.body;
//   updateCounter(res, options.name);
// });

// app.delete('/delete', async (req, res) => {
//   const options = req.body;
//   deleteCounter(res, options.name);
// });

// app.get('/dump', async (request, response) => {
//   const options = request.body;
//   dumpCounters(response);
// });

// Serves all the html, js, and css 
app.use('/html', express.static('html'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));

// Redirect you to home.html when you type /home
app.get("/home", (req,res) => res.redirect("/html/home.html"));

// Redirect to tracks, FAQ, About, etc.
app.get("/tracks", (req, res) => res.redirect("/html/tracks-overview.html"));
app.get("/faq", (req, res) => res.redirect("/html/faq.html"));
app.get("/about", (req, res) => res.redirect("/html/about.html"));
app.get("/login", (req, res) => res.redirect("/html/signin.html"));
app.get("/signup", (req, res) => res.redirect("/html/signup.html"));
app.get("/tracks", (req, res) => res.redirect("/html/tracks-overview.html"));

app.post('/signupUser', async (request, response) => {
    await reload(userFile);
    const options = request.body;
    console.log(options);
    console.log(userExists(options['email']));
    if (userExists(options['email']) !== -1) {
        response.status(400).json({error: `An account already exists with the email: '${options.email}'. Please try logging in! Thanks! :) `})
    } else {
        users.push(options);
        response.status(200).json('Thanks for signing up');
        saveUsers();
    }
});

app.get('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});


app.listen(port, () => {
  console.log(`Server started on poart ${port}`);
});
