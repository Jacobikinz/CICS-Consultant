# Final Documentation

## Title: Nic Asnes Fan Club

## Subtitle: CICS Consultant

## Semester: Spring 2022

## Overview:

A brief overview of your application. This will be based on what you are submitting as your final web application artifact. You should also mention why your application is innovative.

## Team Members:

A list of your team members, with names and GitHub aliases.
Thomas Callaghan, Github: twcallaghan  
Jacob Urisman, Github: jacobikinz
Pablo Castilla, Github: pablocastilla9
Hannah Wu, Github: hawuter

## User Interface:

A final up-to-date list/table describing your application’s user interface. This should include the name of the UI view and its purpose. You should include a screenshot of each of your UI views.

## APIs:

A final up-to-date list/table describing your application’s API

### Create:

Users can be created by clicking on the blue "Sign-up" button in the top right of any page on the website. This brings them to the sign-up page which has the user enter their first name, last name, email, and a password. They then click the green "Sign-up" button that is in the form they just filled out which causes the client to throw out a create to the server via `/signupUser`

`POST /signupUser`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({ fname: fname, lname: lname, email: email, password: password })`  

This will respond with either a `status 400` if a user already exists with the inputted email, or a `status 200` if the user is successfully created. In the backend, a new row will be added to the DB for this user. This will also cause the user to go to the profile page and the headers will change to **allow access to the user's profile and a sign-out button.**

### Read:

Users can Login by clicking the "Login" button in the top right of any page on the website. This brings them to the login page which has the user enter their email and password that is then checked against the database for authentication. If they are valid, the user will then be logged in, and be redirected to the profile page. Also, the headers will change to **allow access to the user's profile and a sign-out button.**

`GET /loginUser`  
`headers: {'Content-Type': 'application/json', 'email': email, 'password': password}`  

There is no body because GET requests cannot contain a body.

This will respond with either a `status 400` if there is no account with that email, or if the password is incorrect for the account with that email. If the email and password are valid and match, the server will respond with a `status 200` and the user will be redirected to the profile page.

### Update:

#### User Updating Their Information (email)

Users can update the email associated with their account by clicking on the "Profile" button and then the "Update your information" button. This allows the user to enter in a new email for their account and then by clicking the "Confirm new info" button, their email will be updated via a PUT request sent to the server.

`PUT /newInfo`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({ oldemail: userEmailCookie, newemail: newemail })`  

This will respond with a `status 500` along with the error if there was a server error while trying to update the email, or a `status 200` if the email was successfully updated.

#### User Signing Out

Users can sign-out of their account at any time by clicking the "Sign Out" button in the top right corner.

`PUT /signoutUser`  

This contains no headers or body because it is just trying to signal to the server that the user wants to signout

The server always returns with a `status 200` for this API request because all it is doing is setting the `loggedIn` variable in the server code to false.

#### User Updating A User's Quiz Answers

When a user clicks any of the buttons (aka classes) on the home page (aka the quiz page) then their selected classes are saved to the database in the respective column.

`PUT /updateQuiz`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({email: JSON.parse(document.cookie)['useremail'], quiz: quiz.json}),`  

Here, quiz.json is an class that we are using in the backend to render the homepage with buttons that form a "quiz" that the user can take. This will eventually be used to determine which path a user should most likely take in their career both academically and profesionally. The cookie is taking the email of the currently logged in user from the document's cookie to pass it along to the server.

This will respond with a `status 500` along with the error if there was a server error, or a `status 200` if it was successful. The user's responses are updated in the database in realtime when they are selecting things in the "quiz".

#### Loading a User's Quiz Answers On Page Load

When a user loads the home page then their quiz answers need to be loaded in from the database.

`PUT /loadQuiz`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({email: JSON.parse(document.cookie)['useremail']}),`  

This will respond with a `status 500` along with the error if there was a server error, or a `status 200` if the data was successfully loaded from the DB. The response will also include the appropriate data from the DB.

#### User Updating A User's Recommended Field

When a user clicks on the button after ranking all of the classes that they have taken, their recommended field is computed and if the user is logged in, this is inserted into their row in the database.

`PUT /updateRecommendation`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({email: JSON.parse(document.cookie)['useremail'], recommendation: topField}),`  

This is sending the cookie with the user who is currently logged in's email and their "top field" which was the field that had the highest score after the user's rankings. If the user is not logged in athen there will be no cookie to send which will then have no database action taken.

This will respond with a `status 500` along with the error if there was a server error, or a `status 200` if it was successful. The user's recommendation is updated in the database after they click the button to get their reommended field.

#### Checking if there is a logged in user

Whenever a page is loaded on the website, there needs to be a check to see if there is currently a user logged in in order to serve the correct HTML files with the correct headers.

`PUT /setLoggedIn`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({email: JSON.parse(document.cookie)}),`  

This needs to send the document's cookie in order to determine if there is currently a user logged in to the website, and if there is then it will be serving back a boolean in JSON that will determine what header to use on that page.

This will respond with a `status 500` along with the error if there was a server error, or a `status 200` if it was successful. The header is then successfully loaded with the correct bottons.

### Delete:

Users can delete their profile by clicking on the "Profile" button and then the red "Delete Your Profile" button. This will delete the user from the database (local storage).

`DELETE /deleteUser`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({ email: userEmailCookie })`

userEmailCookie is the current user's email that is being stored inside of the website's cookies

This will respond with a `status 500` along with the error if there was a server error while trying to delete the user, or a `status 200` if the user was successfully deleted.

## Database:

A final up-to-date representation of your database including a brief description of each of the entities in your data model and their relationships if any. There is only one table in our database and that is the users table that is storing the data about users once they have registered along with their activity when they are logged in. ![](https://user-images.githubusercontent.com/23635947/167011915-d0f7e2ab-236e-4ea7-b636-b13164ccfd8d.png)

# TODO: ADD THE ENTITIES IN DATA MODEL AND THEIR RELATIONSHIPS

## URL Routes/Mappings:

A final up-to-date table of all the URL routes that your application supports and a short description of what those routes are used for. You should also indicate any authentication and permissions on those routes.

## Authentication/Authorization:

A final up-to-date description of how users are authenticated and any permissions for specific users (if any) that you used in your application. You should mention how they relate to which UI views are accessible.

## Division of Labor:

A breakdown of the division of labor for each team member — that is, saying who did what, for the entire project. Remember that everyone is expected to contribute roughly equally to each phase of the project. We expect to see similar numbers and kinds of GitHub commits by each student. Thomas Callaghan:  
Jacob Urisman:  
Pablo Castilla:  
Hannah Wu:  

## Conclusion:

A conclusion describing your team’s experience in working on this project. This should include what you learned through the design and implementation process, the difficulties you encountered, what your team would have liked to know before starting the project that would have helped you later, and any other technical hurdles that your team encountered.
