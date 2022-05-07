# Final Documentation

## Title: Nic Asnes Fan Club

## Subtitle: CICS Consultant

## Semester: Spring 2022

## Link to project: https://cics-consultant.herokuapp.com/

## Overview:

Our application seeks to better inform CICS students on what courses they might enjoy based on courses that they have enjoyed previously. It uses our proprietary classification of CICS courses into 8 relatively distinct fields.

## Team Members:

A list of your team members, with names and GitHub aliases.

Thomas Callaghan, Github: twcallaghan  

Jacob Urisman, Github: jacobikinz

Pablo Castilla, Github: pablocastilla9

Hannah Wu, Github: hawuter

## User Interface:

1. Homepage
  - The homepage of our application is a quiz, which asks users to input all classes they have taken. There is then a button which locks in a user's answers and sends them to the database.png
![image](https://user-images.githubusercontent.com/48579535/167269058-25ac8179-8414-45bd-9d9e-f3e4fee95674.png)
  - Then, the next part of the quiz appears, which asks users to rank each class they have taken. There is another button at the bottom of this, which sends the class enjoyment information for the users to the database, as well as computing the final step.
![image](https://user-images.githubusercontent.com/48579535/167269066-99ee5b61-7fba-4b5e-861d-e6391843a7ce.png)
  - The final step is taking the information from the quiz and determining which field most likely suits the user best. The information is sent to the database and then displayed on the screen.
![image](https://user-images.githubusercontent.com/48579535/167269072-3f495b13-da67-44ed-a888-8c807024096f.png)
2. Fields
  - This page contains 8 cards, one for each field. Each card contains every class which we have placed in said field. Each class is an accordion which displays course id and title when collapsed, and course description in the accordion dropdown.
![image](https://user-images.githubusercontent.com/48579535/167269037-4187fc9f-794b-4c2c-9e3a-78d96a49bd5d.png)
3. About Us
  - The about us page contains information on the application and each of our group members.
![image](https://user-images.githubusercontent.com/48579535/167269024-9a4141bd-d0e2-4667-813d-3df9a340a41a.png)
4. Sign-up
  - The sign-up page features a simple registration page for creating a user, with fields for first and last name, email, and password. The user is created in the database upon registration.
![image](https://user-images.githubusercontent.com/48579535/167269118-bf322714-cadf-4584-9525-64f176a9640e.png)
5. Login
  - The login page works fairly straightforwardly and allows a user to login to their account to update their preferences, which are stored in the database.
![image](https://user-images.githubusercontent.com/48579535/167269089-1c6dfd05-c3f0-43c3-a977-57459eacc3a0.png)
6. Profile
  - The profile page can only be accessed if a user is logged in.
![image](https://user-images.githubusercontent.com/48579535/167269100-a9fb7165-8063-4323-bdca-b707245d694f.png)

## APIs:

### Create:

Users can be created by clicking on the blue "Sign-up" button in the top right of any page on the website. This brings them to the sign-up page which has the user enter their first name, last name, email, and a password. They then click the green "Sign-up" button that is in the form they just filled out which causes the client to throw out a create to the server via `/signupUser`

`POST /signupUser`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({ fname: fname, lname: lname, email: email, password: password })`  

This will respond with either a `status 400` if a user already exists with the inputted email, or a `status 200` if the user is successfully created. In the backend, a new row will be added to the DB for this user. This will also cause the user to go to the profile page and the headers will change to **allow access to the user's profile and a sign-out button.**

### Read:

#### Getting the logged-in-user's profile
`GET /html/profile.html`  

This is going to call the checkLoggedIn function which is going to call req.isAuthenticated() that will check if there is a user who is currently logged in and authenticated with passport. If so, then this will call `res.redirect('/html/profile/' + req.user + '.html')` which is going to load a custom, private page for that user's profile.

`GET /html/profile/:userID.html`

This has a bunch of HTML that is being injected for this page to be created for the user with a custom URL. 

#### Checking if a user is logged in

Whenever a page is loaded on the website, there needs to be a check to see if there is currently a user logged in in order to serve the correct HTML files with the correct headers.

`GET /checkLoggedIn`  
`headers: {'Content-Type': 'application/json'}`  

This is going to check with req.isAuthenticated() to see if there is currently a user who is authenticated with passport and has a running session. If this is true then it will return a `status 200` along with JSON giving a true or false response respectively. 

#### Login
Users can Login by clicking the "Login" button in the top right of any page on the website. This brings them to the login page which has the user enter their email and password that is then checked against the database for authentication. If they are valid, the user will then be logged in, and be redirected to the profile page. Also, the headers will change to **allow access to the user's profile and a sign-out button.**

`GET /loginUser`  
`headers: {'Content-Type': 'application/json', 'email': email, 'password': password}`  

There is no body because GET requests cannot contain a body.

This will respond with either a `status 400` if there is no account with that email, or if the password is incorrect for the account with that email. If the email and password are valid and match, the server will respond with a `status 200` and the user will be redirected to the home page. This is authenticated through passport with the `auth.authenticate` method using the local strategy which is querying the DB to check the username and password that are provided. 

### Update:

#### User Signing Out

Users can sign-out of their account at any time by clicking the "Sign Out" button in the top right corner.

`PUT /signoutUser`  

This contains no headers or body because it is just trying to signal to the server that the user wants to signout

The server calls the request.logout() function provided to it through passport to log the user out of the current session. It also clears the cookies and redirects the user to the login page.

#### User Updating A User's Quiz Answers

When a user clicks any of the buttons (aka classes) on the home page (aka the quiz page) then their selected classes are saved to the database in the respective column.

`PUT /updateQuiz`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({email: document.cookie.split('=')[1].split(';')[0], quiz: quiz.json}),`  

Here, quiz.json is an class that we are using in the backend to render the homepage with buttons that form a "quiz" that the user can take. This will eventually be used to determine which path a user should most likely take in their career both academically and profesionally. The cookie is taking the email of the currently logged in user from the document's cookie to pass it along to the server.

This will respond with a `status 500` along with the error if there was a server error, or a `status 200` if it was successful. The user's responses are updated in the database in realtime when they are selecting things in the "quiz".

#### Loading a User's Quiz Answers On Page Load

When a user loads the home page then their quiz answers need to be loaded in from the database.

`PUT /loadQuiz`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({email: document.cookie.split('=')[1].split(';')[0]}),`  

This will respond with a `status 500` along with the error if there was a server error, or a `status 200` if the data was successfully loaded from the DB. The response will also include the appropriate data from the DB.

#### User Updating A User's Recommended Field

When a user clicks on the button after ranking all of the classes that they have taken, their recommended field is computed and if the user is logged in, this is inserted into their row in the database.

`PUT /updateRecommendation`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({email: document.cookie.split('=')[1].split(';')[0], recommendation: topField}),`  

This is sending the cookie with the user who is currently logged in's email and their "top field" which was the field that had the highest score after the user's rankings. If the user is not logged in athen there will be no cookie to send which will then have no database action taken.

This will respond with a `status 500` along with the error if there was a server error, or a `status 200` if it was successful. The user's recommendation is updated in the database after they click the button to get their reommended field.

### Delete:

Users can delete their profile by clicking on the "Profile" button and then the red "Delete Your Profile" button. This will delete the user from the database (local storage).

`DELETE /deleteUser`  
`headers: {'Content-Type': 'application/json'}`  
`body: JSON.stringify({ email: userEmailCookie })`

userEmailCookie is the current user's email that is being stored inside of the website's cookies

This will respond with a `status 500` along with the error if there was a server error while trying to delete the user, or a `status 200` if the user was successfully deleted.

## Database:

![](https://user-images.githubusercontent.com/23635947/167011915-d0f7e2ab-236e-4ea7-b636-b13164ccfd8d.png)

### Entities

- Username/Password
  - Stored as strings in database where the username is an email 
- Classes
  - Stored as json file. Each course contains department id, course number, course title, number of credits, semesters offered, and the description of the course.
- Fields
  - Stored as json file. Each field contains a name, an array of course numbers as strings, and a full name for the field.
  - Courses can be taken from class json using the course number.
- Class enjoyment ranking
  - Stored as an array of classes for each enjoyment level (1-5).
  - Checks fields json for which field contains which classes to then calculate the best recommendation for a user.
- Recommended field
  - Stored as a string in DB, calculated from class enjoyment rankings.

## URL Routes/Mappings:

- html/about.html
  - This is the about us page
- html/home.html
  - This is the homepage which houses the main quiz
- html/login.html
  - Page where users can log in to their accounts
- html/profile.html
  - Login authentication required (email and password)
  - Page that displays user information
- html/signup.html
  - Page where users can register and create an account
- html/fields.html
  - This is the fields overview page

## Authentication/Authorization:

A user cannot access a profile page unless they are logged in. They can only access their own profile page, which has a unique url. Users are authenticated using sessions with passport, very similarly to the in-class example where each user gets a session with each sessions starting when the user logs in. The passport local plan takes the user's email and password, checks them against the database, and if they're both correct then their session starts. Otherwise, they're redirected to the login page.

## Division of Labor:

**Thomas Callaghan**: For milestone 1, I drew out the wireframes, created the website's first iteration of the header, wrote the HTML for the homepage and created dropdowns which was our first iteration of the "quiz", added the FAQ page that had accordions that has since been scrapped as a whole page, and added login/signup buttons along with some basic code to make the logging/signing in work.

For milestone 2, I wrote the large majority of the documentation that was needed for the submission, created all API endpoints surrounding the authentication of user's (/signupUser, /loginUser, /newInfo, /signoutUser, and /deleteUser), implemented the Heroku Postgres DB and then implemented the code my teammates wrote for the homepage "quiz" with the DB by creating more API endpoints (/updateQuiz and /loadQuiz), tested it all, deployed it, and assisted in the planning of this milestone.

For this final milestone, (I had skipped ahead a bit on milestone 2 by already implementing the heroku postgres DB, so I don't want to double-count that) I wrote the JS to dynamically create buttons on the home page from the classes JSON, wrote the JS that would then take those selected classes and produce radio buttons when the user was finished selecting classes, wrote the JS for calculating which field the user should pursue given their selections throughout the "quiz" through comparing this to the fields JSON, linted all the JS, validated all the HTML, cleaned up all the code, refactored all the code to use authentication with passport, configured and tested all the code with passport, and started this final documentation by writing the API section and most of the Database section.

**Jacob Urisman**: For milestone 1, I created a preliminary fields page with a division of courses based on Ben Marlin's spreadsheet of interest fields and which classes were in them.

For milestone 2, I assisted in the planning of the milestone. I also set up the Heroku application, including connecting it to GitHub, setting up the CLI and making it secure.

For this final milestone, I wrote almost all of the final documentation, created the fields json which most parts of the project rely on for dynamic updating. I also created the fields overview page dynamically.

**Pablo Castilla**: For milestone 1, I took screenshots of the UI of our initial app. I also made the ideas.md document, which included said screenshots, wireframes, and the outlines for our division of labor.

For milestone 2, I helped give feedback throughout the milestone, and helped with planning for the more ML/AI related activities as mentioned with Jacob. I did the work to turn Hannah's home page/quiz code into a much more functional interface with buttons. I also Made a lot of code around the "quiz" class that enabled it to be utilized with the Express API endpoints.

For this final milestone, I decided which classes to include, which fields are added, and which classes belong in which fields (in conjunction w/ Jacob). I scraped data from CICS website, and created classes.json. I also recorded and edited the final video.

**Hannah Wu**: For milestone 1, I helped with the planning of the data interactions and helped write the milestone doc. 

For milestone 2, I created the quiz class and its CRUD operations. I also integrated it into the UI.

For this final milestone, I finalized the CSS for the quiz buttons and cleaned up the HTML.

## Conclusion:

Our experiences with the UI and backend parts of the project were fun and straightforward. The biggest thing we learned that was not taught in class was how to use bootstrap. Our biggest difficulties came when setting up the server on Heroku and configuring the database with authentication/authorization via passport. A longer introduction to that in class would be very welcome and appreciated. Finally, we think that the project milestone documents outlining what we are expected to produce could be a bit more streamlined.
