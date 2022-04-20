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
<h3>Create:</h3>
<h4><code>POST /signupUser</code> </h4>
<img src="https://user-images.githubusercontent.com/23635947/164306535-b9a82f8d-0321-496d-99ea-a3e1a770c323.png"/>
Click Sign Up and it will then refresh the page and redirect you to the profile page...
<br>
<img src="https://user-images.githubusercontent.com/23635947/164306671-8437b116-14a0-4548-abfb-58f808e6c5a8.png"/>
As you can see, it now has an update your information button, delete your profile button, and the header has been changed to get back to this page or Sign Out.

<h3>Read:</h3>
<h4><code>GET /loginUser</code> </h4>
<img src="https://user-images.githubusercontent.com/23635947/164307258-35d282b4-5896-4d0f-b006-1adf7972d899.png"/>
Click the login button and it will redirect you to the profile page...
<br>
<img src="https://user-images.githubusercontent.com/23635947/164307389-6433109f-d446-4818-b342-952e9217d54d.png"/>
It's the same page you get when you sign-up, except this time it was through the login page meaning that all this information was found through the database!

<h3>Update:</h3>
<h4><code>PUT /newInfo</code></h4>
<img src="https://user-images.githubusercontent.com/23635947/164307568-4e23b974-747e-4e51-8516-2ef59cd5bdc7.png"/>
After clicking the update your information button you get an input and another button to confirm you new email.
<br>
<img src="https://user-images.githubusercontent.com/23635947/164307684-94bb7cee-b2d6-4328-99ae-40cded629c6e.png"/>
After clicking the "Confirm new info" button you can see it gives you a confirmation message of "Successfully updated information" and in the backend, the email of the user is then updated in the database.

<h4><code>PUT /signoutUser</code></h4>
When you click the "Sign Out" button that is shown in the header of some of the screenshots above, the page will then be refreshed to its original state that gives you access to the Login and Sign Up buttons.
<img src="https://user-images.githubusercontent.com/23635947/164308037-da800084-f5f3-4008-a4a2-cc43b396db05.png"/>

<h4><code>PUT /updateQuiz</code></h4>
When you are signed in and click any of the buttons on the front page that correspond to classes, the buttons will move to the "selected" side and it will also update the database in the backend. This is what it looks like from the front and backend:
Front-end with classes selected:
<img src="https://user-images.githubusercontent.com/23635947/164308371-034248b0-7a42-4df5-950b-c6ba4d53936f.png"/>
Back-end in the database (done in real-time after every single class that is selected)
<img src="https://user-images.githubusercontent.com/23635947/164308475-611558b0-8b1e-43f6-9eac-3581376a29d8.png"/>

<h4><code>PUT /loadQuiz</code></h4>
Say you logout or want to finish the quiz later. Maybe even update the classes while you take them throughout your semesters at UMass. If you're logged in, then all these responses are saved, and will be automatically reloaded with the home page. I will use the above example of classes being selected BUT it will be in an incognito mode where there are no cookies thus displaying that it is indeed dynamically reloading the classes selected with the page.
<img src="https://user-images.githubusercontent.com/23635947/164308981-7ac31ff7-dfcb-4df2-9ca5-d8e5d8b5739f.png"/>
As you can see, it has all the same things selected from before. DB's are truly magical sometimes.

<h3>Delete:</h3>
<h4><code>DELETE /deleteUser</code></h4>
If you wish to delete your profile, all you have to do is press the big red "Delete Your Profile" button on the profile page. This will delete the row in the database with the corresponding email.
<img src="https://user-images.githubusercontent.com/23635947/164309222-2e1f2f32-aff6-4043-b9d7-d61f6a18995b.png"/>
The website displays a response as "Your profile has been deleted."
<img src="https://user-images.githubusercontent.com/23635947/164309319-cc522db6-287b-42e7-aec0-bdcb3cda5709.png"/>
Just to prove that it is actually deleting the row in the database, here is a query that I ran directly after clicking the delete button.
<img src="https://user-images.githubusercontent.com/23635947/164309444-33102326-e406-4525-a5e9-0382e803a617.png"/>
An empty result as it should be.
