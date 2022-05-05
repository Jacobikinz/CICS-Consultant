<h1>Final Documentation</h1>
<h2>Title: nic-asnes-fan-club</h2> 
<h2>Subtitle: CICS Consultant</h2>
<h2>Semester: Spring 2022</h2>
<h2>Overview: </h2>A brief overview of your application. This will be based on what you are submitting as your final web application artifact. You should also mention why your application is innovative.


<h2>Team Members: </h2>A list of your team members, with names and GitHub aliases.
Thomas Callaghan, Github: twcallaghan
Jacob Urismam, Github:
Pablo Castilla, Github: 
Hannah Wu, Github: 

<h2>User Interface: </h2> A final up-to-date list/table describing your application’s user interface. This should include the name of the UI view and its purpose. You should include a screenshot of each of your UI views.

<h2>APIs: </h2>A final up-to-date list/table describing your application’s API
<h3>Create:</h3>
<p>Users can be created by clicking on the blue "Sign-up" button in the top right of any page on the website. This brings them to the sign-up page which has the user enter 
their first name, last name, email, and a password. They then click the green "Sign-up" button that is in the form they just filled out which causes the client to throw 
out a create to the server via <code>/signupUser</code></p>
<code>POST /signupUser</code> <br>
<code>  headers: {'Content-Type': 'application/json'} </code> <br>
<code>  body: JSON.stringify({ fname: fname, lname: lname, email: email, password: password }) </code> 
<br> <br>
<p> This will respond with either a <code>status 400</code> if a user already exists with the inputted email, or a <code>status 200</code> if the user is successfully created. In the backend, a new row will be added to the DB for this user. 
This will also cause the user to go to the profile page and the headers will change to <strong>allow access to the user's profile and a sign-out button.</strong></p>

  
<h3>Read:</h3>
<p>Users can Login by clicking the "Login" button in the top right of any page on the website. This brings them to the login page which has the user enter their email and 
  password that is then checked against the database for authentication. If they are valid, the user will then be logged in, and be redirected to the profile page. 
  Also, the headers will change to <strong>allow access to the user's profile and a sign-out button.</strong></p>
<code>GET /loginUser</code> <br>
<code> headers: {'Content-Type': 'application/json', 'email': email, 'password': password} </code> <br>
<p>There is no body because GET requests cannot contain a body. </p>
<p> This will respond with either a <code>status 400</code> if there is no account with that email, or if the password is incorrect for the account with that email.
  If the email and password are valid and match, the server will respond with a <code>status 200</code> and the user will be redirected to the profile page.</p>


<h3>Update:</h3>
<h4>User Updating Their Information (email)</h4>
<p>Users can update the email associated with their account by clicking on the "Profile" button and then the "Update your information" button. This allows the user to 
  enter in a new email for their account and then by clicking the "Confirm new info" button, their email will be updated via a PUT request sent to the server.</p>
<code>PUT /newInfo</code> <br>
<code>headers: {'Content-Type': 'application/json'} </code> <br>
<code>body: JSON.stringify({ oldemail: userEmailCookie, newemail: newemail }) </code> <br>
<br>
<p> This will respond with a <code>status 500</code> along with the error if there was a server error while trying to update the email, or a <code>status 200</code>
  if the email was successfully updated.</p>
  
<h4> User Signing Out</h4>
<p> Users can sign-out of their account at any time by clicking the "Sign Out" button in the top right corner. </p>
<code>PUT /signoutUser</code> <br>
<p>This contains no headers or body because it is just trying to signal to the server that the user wants to signout</p>
<p>The server always returns with a <code>status 200</code> for this API request because all it is doing is setting the <code>loggedIn</code> variable in the server code to false.</p>

<h4>User Updating A User's Quiz Answers </h4>
<p>When a user clicks any of the buttons (aka classes) on the home page (aka the quiz page) then their selected classes are saved to the database in the respective column. </p>
<code>PUT /updateQuiz</code> <br>
<code>headers: {'Content-Type': 'application/json'} </code> <br>
<code>body: JSON.stringify({email: JSON.parse(document.cookie)['useremail'], quiz: quiz.json}), </code> <br>
<p> Here, quiz.json is an class that we are using in the backend to render the homepage with buttons that form a "quiz" that the user can take. This will eventually be used to determine which path a user should most likely take in their career both academically and profesionally. The cookie is taking the email of the currently logged in user from the document's cookie to pass it along to the server. </p>
<br>
<p> This will respond with a <code>status 500</code> along with the error if there was a server error, or a <code>status 200</code>
  if it was successful. The user's responses are updated in the database in realtime when they are selecting things in the "quiz".</p>
  
<h4>Loading a User's Quiz Answers On Page Load </h4>
<p>When a user loads the home page then their quiz answers need to be loaded in from the database. </p>
<code>PUT /loadQuiz</code> <br>
<code>headers: {'Content-Type': 'application/json'} </code> <br>
<code>body: JSON.stringify({email: JSON.parse(document.cookie)['useremail']}), </code> <br>
<br>
<p> This will respond with a <code>status 500</code> along with the error if there was a server error, or a <code>status 200</code>
  if the data was successfully loaded from the DB. The response will also include the appropriate data from the DB.</p>

<h4>User Updating A User's Recommended Field </h4>
<p>When a user clicks on the button after ranking all of the classes that they have taken, their recommended field is computed and if the user is logged in, this is inserted into their row in the database.</p>
<code>PUT /updateRecommendation</code> <br>
<code>headers: {'Content-Type': 'application/json'} </code> <br>
<code>body: JSON.stringify({email: JSON.parse(document.cookie)['useremail'], recommendation: topField}), </code> <br>
<p> This is sending the cookie with the user who is currently logged in's email and their "top field" which was the field that had the highest score after the user's rankings. If the user is not logged in athen there will be no cookie to send which will then have no database action taken. </p>
<br>
<p> This will respond with a <code>status 500</code> along with the error if there was a server error, or a <code>status 200</code>
  if it was successful. The user's recommendation is updated in the database after they click the button to get their reommended field.</p>
  
<h4>Checking if there is a logged in user </h4>
<p>Whenever a page is loaded on the website, there needs to be a check to see if there is currently a user logged in in order to serve the correct HTML files with the correct headers.</p>
<code>PUT /setLoggedIn</code> <br>
<code>headers: {'Content-Type': 'application/json'} </code> <br>
<code>body: JSON.stringify({email: JSON.parse(document.cookie)}), </code> <br>
<p> This needs to send the document's cookie in order to determine if there is currently a user logged in to the website, and if there is then it will be serving back a boolean in JSON that will determine what header to use on that page.</p>
<br>
<p> This will respond with a <code>status 500</code> along with the error if there was a server error, or a <code>status 200</code>
  if it was successful. The header is then successfully loaded with the correct bottons.</p>

<h3>Delete:</h3>
<p>Users can delete their profile by clicking on the "Profile" button and then the red "Delete Your Profile" button. This will delete the user from the database (local storage).</p>
<code>DELETE /deleteUser</code> <br>
<code>headers: {'Content-Type': 'application/json'} </code> <br>
<code>body: JSON.stringify({ email: userEmailCookie })</code> <p> userEmailCookie is the current user's email that is being stored inside of the website's cookies </p><br>
<p>This will respond with a <code>status 500</code> along with the error if there was a server error while trying to delete the user, or a <code>status 200</code> if the user was successfully deleted.</p>

<h2>Database: </h2>A final up-to-date representation of your database including a brief description of each of the entities in your data model and their relationships if any.

<h2>URL Routes/Mappings: </h2>A final up-to-date table of all the URL routes that your application supports and a short description of what those routes are used for. You should also indicate any authentication and permissions on those routes.

<h2>Authentication/Authorization: </h2>A final up-to-date description of how users are authenticated and any permissions for specific users (if any) that you used in your application. You should mention how they relate to which UI views are accessible.

<h2>Division of Labor: </h2>A breakdown of the division of labor for each team member — that is, saying who did what, for the entire project. Remember that everyone is expected to contribute roughly equally to each phase of the project. We expect to see similar numbers and kinds of GitHub commits by each student.

<h2>Conclusion: </h2>A conclusion describing your team’s experience in working on this project. This should include what you learned through the design and implementation process, the difficulties you encountered, what your team would have liked to know before starting the project that would have helped you later, and any other technical hurdles that your team encountered.
