# Quaver
A website with discussion forums for music, account personalization, and extra music-related information.

## Development and running

1. Clone the repository
2. Build the docker container
3. Request the .env file information from one of us to put into `backend`
4. Run the backend server using `node backend/server.js`
5. Run the frontend using `node backend/server.js`
6. Go to http://localhost:3000/ to see the webapp

## Existing features

* Functioning UI with sample users page, posts, replies, etc.
* Responsive website with clean design
* Ability to get (hardcoded) posts from the database
* Ability to "sign up" a new user by transfering info from login page to database (albeit insecurely)
* Ability to "log in" a user by validating an existing account with a correct password (again, insecurely, and does nothing)

## Todo
* Post forum posts/replies to the database
* secure login/signup (hash passwords, safe sql requests)
* Edit user information
* Site recognizes if you are signed in
* Login/SignUp/Profile pages only accessible if applicable

## Note

We just made HUGE progress on sending info between frontend and backend to actually use our database and were able to then make huge progress on the signup and login system. These systems are now working in very basic fashion, but it seems like a foundation for more leaps of progress soon. However, having already spent a majority of our time prepping for alpha release just getting the basics down we do not have time to flesh out the rest of it.

Also didn't know where to say it but part of the shanky "signup" system is using a random int as the userid, since we forgot to set up the auto increment in TiDB and thought we'd focus on that later.