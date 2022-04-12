import express from 'express';
import logger from 'morgan';
import { readFile, writeFile } from 'fs/promises';

let counters = {};

const userFile = 'userfile.json';

// async function reload(filename) {
//   try {
//     const data = await readFile(filename, { encoding: 'utf8' });
//     counters = JSON.parse(data);
//   } catch (err) {
//     counters = {};
//   }
// }

// async function saveCounters() {
//   try {
//     const data = JSON.stringify(counters);
//     await writeFile(JSONfile, data, { encoding: 'utf8' });
//   } catch (err) {
//     console.log(err);
//   }
// }

// function counterExists(name) {
//   return name in counters;
// }

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
app.get("/tracks", (req, res) => res.redirect("/html/tracks-overview.html"));


app.get('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});


app.listen(port, () => {
  console.log(`Server started on poart ${port}`);
});
