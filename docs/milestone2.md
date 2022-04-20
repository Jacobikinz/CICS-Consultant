<h2>Part 0: Project API Planning</h2>

<h3>Users / Authentication API:</h3>
<h4>Create:</h4>
<p>Users can be created by clicking on the blue "Sign-up" button in the top right of any page on the website. This brings them to the sign-up page which has the user enter 
their first name, last name, email, and a password. They then click the green "Sign-up" button that is in the form they just filled out which causes the client to throw 
out a create to the server via <code>/signupUser</code></p>
<code>POST /signupUser</code> <br>
<code>  headers: {'Content-Type': 'application/json'} </code> <br>
<code>  body: JSON.stringify({ fname: fname, lname: lname, email: email, password: password }) </code> 
<br> <br>
<p> This will respond with either a <code>status 400</code> if a user already exists with the inputted email, or a <code>status 200</code> if the user is successfully created. In the backend, a new row will be added to the DB for this user. 
This will also cause the user to go to the profile page and the headers will change to <strong>allow access to the user's profile and a sign-out button.</strong></p>

  
<h4>Read:</h4>
<p>Users can Login by clicking the "Login" button in the top right of any page on the website. This brings them to the login page which has the user enter their email and 
  password that is then checked against the database for authentication. If they are valid, the user will then be logged in, and be redirected to the profile page. 
  Also, the headers will change to <strong>allow access to the user's profile and a sign-out button.</strong></p>
<code>GET /loginUser</code> <br>
<code> headers: {'Content-Type': 'application/json', 'email': email, 'password': password} </code> <br>
<p>There is no body because GET requests cannot contain a body. </p>
<p> This will respond with either a <code>status 400</code> if there is no account with that email, or if the password is incorrect for the account with that email.
  If the email and password are valid and match, the server will respond with a <code>status 200</code> and the user will be redirected to the profile page.</p>


<h4>Update:</h4>
<h5>User Updating Their Information (email)</h5>
<p>Users can update the email associated with their account by clicking on the "Profile" button and then the "Update your information" button. This allows the user to 
  enter in a new email for their account and then by clicking the "Confirm new info" button, their email will be updated via a PUT request sent to the server.</p>
<code>PUT /newInfo</code> <br>
<code>headers: {'Content-Type': 'application/json'} </code> <br>
<code>body: JSON.stringify({ oldemail: userEmailCookie, newemail: newemail }) </code> <br>
<br>
<p> This will respond with a <code>status 500</code> along with the error if there was a server error while trying to update the email, or a <code>status 200</code>
  if the email was successfully updated.</p>
  
<h5> User Signing Out</h5>
<p> Users can sign-out of their account at any time by clicking the "Sign Out" button in the top right corner. </p>
<code>PUT /signoutUser</code> <br>
<p>This contains no headers or body because it is just trying to signal to the server that the user wants to signout</p>
<p>The server always returns with a <code>status 200</code> for this API request because all it is doing is setting the <code>loggedIn</code> variable in the server code to false.</p>

<h5>User Updating A User's Quiz Answers </h5>
<p>When a user clicks any of the buttons (aka classes) on the home page (aka the quiz page) then their selected classes are saved to the database in the respective column. </p>
<code>PUT /updateQuiz</code> <br>
<code>headers: {'Content-Type': 'application/json'} </code> <br>
<code>body: JSON.stringify({email: JSON.parse(document.cookie)['useremail'], quiz: quiz.json}), </code> <br>
<p> Here, quiz.json is an class that we are using in the backend to render the homepage with buttons that form a "quiz" that the user can take. This will eventually be used to determine which path a user should most likely take in their career both academically and profesionally. The cookie is taking the email of the currently logged in user from the document's cookie to pass it along to the server. </p>
<br>
<p> This will respond with a <code>status 500</code> along with the error if there was a server error, or a <code>status 200</code>
  if it was successful. The user's responses are updated in the database in realtime when they are selecting things in the "quiz".</p>
  
<h5>Loading a User's Quiz Answers On Page Load </h5>
<p>When a user loads the home page then their quiz answers need to be loaded in from the database. </p>
<code>PUT /loadQuiz</code> <br>
<code>headers: {'Content-Type': 'application/json'} </code> <br>
<code>body: JSON.stringify({email: JSON.parse(document.cookie)['useremail']}), </code> <br>
<br>
<p> This will respond with a <code>status 500</code> along with the error if there was a server error, or a <code>status 200</code>
  if the data was successfully loaded from the DB. The response will also include the appropriate data from the DB.</p>


<h4>Delete:</h4>
<p>Users can delete their profile by clicking on the "Profile" button and then the red "Delete Your Profile" button. This will delete the user from the database (local storage).</p>
<code>DELETE /deleteUser</code> <br>
<code>headers: {'Content-Type': 'application/json'} </code> <br>
<code>body: JSON.stringify({ email: userEmailCookie })</code> <p> userEmailCookie is the current user's email that is being stored inside of the website's cookies </p><br>
<p>This will respond with a <code>status 500</code> along with the error if there was a server error while trying to delete the user, or a <code>status 200</code> if the user was successfully deleted.</p>

<h2>Part 2: Front-end Implementation Screenshots</h2>
<h3>Users / Authentication API:</h3>
<h4>Create <code>POST /signupUser</code>

