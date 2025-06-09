# Quaver
A website with discussion forums for music, account personalization, and extra music-related information.

## Development and running

1. Clone the repository
2. Build the docker container
3. Request the .env file information from one of us to put into `backend`
4. Run the backend server using `node backend/server.js`
5. Run the frontend using `node frontend/app.js`
6. Go to http://localhost:3000/ to see the webapp

## Existing features

* Functioning UI with sample users page, posts, replies, etc.
* Responsive website with clean design
* Ability to make new posts, reply to posts, all sent to database(from test account)
* Ability to get posts from the database to load on homepage
* Ability to "sign up" a new user by transfering info from login page to database (password doesn't hash sorry)
* Ability to "log in" a user by validating an existing account with a correct password (again, insecurely, and does nothing)

## Planned to Do
* Secure login/signup (hash passwords, safe sql requests)
* Edit user information
    * Account system and profile page currently pretty useless
* Site recognizes if you are signed in
    * Was working on having log-in return a userID for redirection, but couldn't do anything with it.
    * Login/SignUp/Profile pages only accessible if applicable
* realize image implementation (prompts for image upload don't go to database)

