<h2>Part 0: Project API Planning</h2>
You will need to write out all APIs the server will provide with a brief description for each. You can also include examples of input and output. 
Alternatively, you can draw out a flow-chart with the information.

<h3>Users / Authentication API:</h3>
<h4>Create:</h4>
<p>Users can be created by clicking on the blue "Sign-up" button in the top right of any page on the website. This brings them to the sign-up page which has the user enter 
their first name, last name, email, and a password. They then click the green "Sign-up" button that is in the form they just filled out which causes the client to throw 
out a create to the server via <code>/signupUser</code></p>
<code>POST /signupUser</code> <br>
<code>  headers: {'Content-Type': 'application/json'} </code> <br>
<code>  body: JSON.stringify({ fname: fname, lname: lname, email: email, password: password }) </code> 
<br> <br>
<p> This will respond with either a <code>status 400</code> if a user already exists with the inputted email, or a <code>status 200</code> if the user is successfully created.
This will also cause the user to go to the home page and the headers will change to <strong>allow access to the user's profile and a sign-out button.</strong></p>

  
<h4>Read:</h4>
<p>Users can Login by clicking the "Login" button in the top right of any page on the website. This brings them to the login page which has the user enter their email and 
  password that is then checked against the database (local file) for authentication. If they are valid, the user will then be logged in, and be redirected to the home page. 
  This will also cause the user to go to the home page and the headers will change to <strong>allow access to the user's profile and a sign-out button.</strong></p>
<code>GET /loginUser</code> <br>
<code> headers: {'Content-Type': 'application/json', 'email': email, 'password': password} </code> <br>
<p>There is no body because GET requests cannot contain a body. </p>
<p> This will respond with either a <code>status 400</code> if there is no account with that email, or if the password is incorrect for the account with that email.
  If the email and password are valid and match, the server will respond with a <code>status 200</code> and the user will be redirected to the home page.</p>
