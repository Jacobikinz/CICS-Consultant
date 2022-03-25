#  CICS Consultant Milestone 1

## Nic Asnes Fan Club Members
- Pablo Castilla ([@pablocastilla9](https://github.com/pablocastilla9))
- Thomas Callaghan ([@twcallaghan](https://github.com/twcallaghan))
- Hannah Wu ([@hawuter](https://github.com/hawuter))
- Jacob Urisman ([@Jacobikinz](https://github.com/Jacobikinz))

# Data Interactions
- Account creation: Enter credentials like first name, last name, email, and password to create a new account.
- Login: Enter username/email and password to login, which will be authenticated by the database.
- Track catalog: View descriptions of different areas in CS, along with suggested electives and careers.
- Quiz: Answer a variety of different types of questions (multiple choice, numbered scale, etc), and submit them to receive a result to reveal what type of CS student you are. A user may choose to save their progress, in which case the data will be saved as an object in the database.
- Scheduler: After either completing an Interest Profile quiz or selecting a pre-defined track from the Track Catalog, the user enters what graduation requirements they have taken from a checklist to generate a list of recommended courses to take.

# Pages

## Home
Wireframe |Screenshot
:--------:|:--------:
![](wireframes/home.png?raw=true)|![](screenshots/home.png?raw=true)

The home page contains the quiz and track recommendations. This includes dropdowns for the user to select the classes they have taken and a dropdown to select their favorites out of the classes they have taken. It also has an HTML element at the bottom to give reccommendations based on their answers. A user may choose to save their progress, in which case the data will be saved as an object in the database.

A stretch goal is to add a scheduler. After either completing an Interest Profile quiz or selecting a pre-defined track from the Track Catalog, the user enters what graduation requirements they have taken from a checklist to generate a list of recommended courses to take. This could be at the bottom of the home page or on its own page.

## Tracks
Wireframe |Screenshot
:--------:|:--------:
![](wireframes/tracks.png?raw=true)|![](screenshots/tracks.png?raw=true)

On the tracks page, you can view the catalog tracks, including each track's description, their assoicated electives, and possible post-undergrad career paths.

## Login
Wireframe |Screenshot
:--------:|:--------:
![](wireframes/login.png?raw=true)|![](screenshots/login.png?raw=true)

The login page allows users to login by entering thier credentials (username/email and password), which will be authenticated by the database.

## Register
Wireframe |Screenshot
:--------:|:--------:
![](wireframes/register.png?raw=true)|![](screenshots/register.png?raw=true)

Allows users to create an account by enter credentials like first name, last name, email, and password. This data will be stored in a database so they can login with their account later.

## FAQ
Wireframe |Screenshot
:--------:|:--------:
![](wireframes/faq.png?raw=true)|![](screenshots/faq.png?raw=true)

The FAQ page has an accordion body whose titles are questions about the web application's functions. The questions' answers are available by expanding that section of the accordion.


## About
Wireframe |Screenshot
:--------:|:--------:
![](wireframes/about.png?raw=true)|![](screenshots/about.png?raw=true)

The about page will contain basic information about the website's purpose, functions, and the team behind it. 

# Division of Labor
- Pablo Castilla:
  - Took screenshots
  - Added screenshots, wireframes, division of labor to md doc
- Thomas Callaghan:
  - Drew out wireframes
  - Created website header
  - Fleshed out homepage, made dropdowns
  - Added working FAQ accordion
  - Added login/signup buttons, and login/signup code
- Hannah Wu:
  - Moved wireframes to /docs
  - Added data interactions to md doc
- Jacob Urisman: 
  - Added class track information to tracks page
