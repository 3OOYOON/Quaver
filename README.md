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
* Ability to get and send posts from the TiDB database
* Ability to check if a user already exists in the database or if username is not unique

## Todo
* Implement tags for posts in the databse
* Sign up users
* Edit user information
* Be signed in or signed out as a user