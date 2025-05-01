# Quaver
A website with discussion forums for music, account personalization, and extra music-related information.

## Learning Goals
* Website functionality for user contribution (account personalization, forum posting) (i.e. not hardcoded)
* Facilitate the creation of personalized user accounts
  * Signup system with verification, multiples checking, stored password encryption
  * Login system with authentication (figure out how to pull from Google API?)
  * User information stored for extended use of website

## Feature Goals
### Essential
* Account creation
  * Ability for user to upload a profile picture
  * Ability for user to create a username
  * Ability for user to put a summary
  * 2FA and/or email verification
* Account personalization
  * Ability to update profile picture/summary/and username later if they want
* Settings
  * Access to profile
  * Delete account
* Ability to post to a forum
* Ability to search by tag

### Nice-to-have
* Tags and filtering
* Threads/replies
* Post/reply history in profile
* Ability to save posts to look at later
* In settings, be able to change the theme (i.e. Dark mode, Light mode, some other colors)
* You can’t post/reply within 15 minutes of when your account was made
* Moderation
  * Us being able to delete posts
  * Us being able to ban people

### Stretch
* Allowing other people to become mods
* Ability to time people out (rather than just deleting posts or banning people)
* Hook up to Spotify
* Music parties
  * Similar to a watch party but instead everyone listens to music

## Architecture:
* Frontend
  * Profile page
  * Post feed
  * Post creation page
* Backend
  * Profiles (connects to sql database)
    * Creation
    * Editing
  * Posts (connects to sql database)
    * Creation of a post
    * Creation of a comment
    * Deletion of a post or comment

## Development Schedule
1. Start with group work on account creation, login in system, loading into a homepage (logged in)
2. Move into more asynchronous work on separate functionality of site
    1. Forum
        1. Organize layout
        2. Allow posting from accounts, have these show up for every other accounts
        3. Set up tags system with filtering possibilities
    2. Accounts/Profile
        1. Build profile page that pulls from account info
        2. Allow personalization of look
        3. Add to features of accounts (favorite band, favorite song, link to spotify, etc.)
    4. Music Information
        1. Connect to Spotify API or some database of albums info (songs, band names, album covers)
        2. Implement hyperlinking of music to Spotify
        3. Pull chart/new music data and possibly music news

## Worries
* Hard to store account information securely without a solid encryption system or some 3rd party tool
* Personalized experience by account means pulling a lot of data on the fly while loading pages
* Account info and forum posts require an open-ended amount of storage

## Communication Goals
* Good meeting time 3-5pm Thursdays. Plan to meet as group every week
* Possible other group work time Sunday afternoons. Plan to meet as a group tbd weekly based on what is needed
* We have a texting groupchat for easy communication day to day and asynchronous work

## Group Work Goals
* While the skeleton base of the website (account creation, homepage) is something we’d like to get started on as a group, once we have enough to start on more specific functionality we have enough ideas we can break-up the work a bit (e.g. Hanane works on the posting forum, Lucie works on account page and personalization, Jonathan works on pulling music data and information) 

