Team Logistics
==============

This is my final project for CMU 67-328.
It is an implementation of a sports team ride coordination application in nodejs and expressjs using mongodb.

To run this application, make sure you have node and mongo installed correctly.
After cloning, run 
```
npm install
```

The current version uses a deployed database, so you do not need to run mongo locally. That will likely change soon.

finally, in the project directory run
```
node app.js
```
OR
 
I include nodemon, so you can use

```
nodemon app.js
```

which will restart the server for you every time you run server side code.

This project uses the node module googlemaps, which can be found here:
https://github.com/moshen/node-googlemaps

async, which can be found here
https://github.com/caolan/async

and bcrypt, which can be found here
https://github.com/ncb000gt/node.bcrypt.js

This assignment was submitted (at 11:59 lol) and the semester has ended. Some isues include 
* Routing issues when the back button is pressed
* Google maps geocoding issues (accessing attributes of 'undefined')
* Terrible signup for team integration
* no photo uploads, but didn't try to integrate that
* deployed database, and I don't deal with connection errors
* no email verification for sign ups

These issues can be dealt with, mainly with more graceful error handling, and I may get to it later, but now I am more interested on other projects.

This scope of this project is significantly larger than it had to be, and was originally designed the way an implementation in rails would be designed.

I am part of a team developing this application further for 67-373. If the project is open source I will post the link to the repo in this README.


:heart: Alex
:octocat:
