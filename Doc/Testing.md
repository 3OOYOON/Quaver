# Testing 
This document will provide instrunctions on how to test the web project.

### For the website
* Gulp will be used to test the website along with
    * Lint HTMl
    * Lint CSS
    * Lint JS
    * Autoprefix CSS
    * Transpile JS
* We move the folders we want to test into the Node_test folder
    * In this folder is the gulpfile.mjs where the tests are written
    * assuming you have already instralled gulp and the other packages:
        * you write in the terminal **npx gulp** which will output the results of the tests of your files
        * should your files have any errors, they will be written out in the terminal

### For the Database
* Using unit tests
* Using unit tests every time we merge to the main branch