# Simple-auth-task

This is a simple node js app that has 3 services:

#### 1- UserLogin
it validates the given fields by user and verify them against the
SystemUsers table in the database, if correct create a new session for the user with
expiration time 1 hour, and stores the login date in redis.
- Fields
  - Email
  - Password
- Content-Type: application/json
- Method: POST
- Endpoint: /login

#### 2- UserRegistration
it validates the given fields by user and verify them against the
SystemUsers table in the database, if valid create a new user in the system and redirect him
to the login page.

- Fields
  - FirstName
  - LastName
  - Username   **unique**
  - Email   **unique**
  - Password
  - City
  - DateOfBirth
- Content-Type: application/json
- Method: POST
- Endpoint: /signup


#### 3- GetUserLastLogin
it validate the given fields by user and verify them against the
SystemUsers table in the database, if correct return a list of all last login dates for this user from redis
- Fields
  - Username
- Method: GET
- Endpoint: /user/:username

## To run this app you should do the following
1. After downloading the app, go to the app's directory and in the terminal 
run ```npm i``` or ```npm install``` to download the app's node modules
2. Copy the **_config.json.example_** and rename it to **_config.json_** and change the 
data in the file based on your credentials and database name
3. Run ```npm start``` to start the app
