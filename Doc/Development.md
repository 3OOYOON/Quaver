# Development
This document will provide instrunctions on the development process for the web project. Note that this project uses Docker.

## Set up Docker
1. Make sure to have Docker installed
2. Pull the directory using `git clone https://github.com/3OOYOON/Quaver.git`
3. Open the Quaver folder in VSCode
4. A prompt should pop up in the bottom-right to "enter container." Do so if it shows up. Otherwise:
   *  Run: `docker build -t quaver .`.
   *  Then, run `docker run -p 3000:3000 quaver`
6. This may take several minutes to load

## Set up database
Note: The database is not yet hooked up with anything on the website directly. It is purely being used for testing right now.
1. Email wolfl@carleton.edu asking to be invited to the database
2. You should get an invite to join the TiDB database, click the link to make an account
3. On the left sidebar, hit "Clusters," then "Quaver," then "connect" in the top right
4. Change the database to "quaver," then choose to connect with ".env" 
5. Create password, write it down
6. Copy the information it gives you, then paste it into a new ".env" file in the adding_to_database folder (this file is in the .gitignore)