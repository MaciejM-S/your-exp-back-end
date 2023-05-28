# your-exp-back-end
This repository contains back-end/api application for Your-Exp, a FullStack networking web application. The application is deployed at:

# https://your-exp.onrender.com
Main features of this app has been describe in the front-end repository: https://github.com/MaciejM-S/your-exp-front-end


The application has been deployed on Render as a node Web Service

This app has been created with the following tech-stack:

+  node
+  express
+  mongoDB whith mongoose (ODM) library
+  REST API
+  JWT
+  bcrypt
+  SendGrid - for password restoring


To provide better undesrtanding of <b>/back-end</b> this description presents information about each file and subfile giving you a better understanding of their purpose and functionality:

### controllers

- friends.js: This file is a controller file responsible for handling requests related to friends functionality. 
It contains functions and route handlers for managing interactions with other users: sdding friends, removing etc.

- init.js: The init.js file is a controller file that handles initialization tasks or setup procedures for the backend application. 
It includes functions and route handlers initialize the server, register users, signin users and checking jwt stored in the browser memory.

- profile.js: The profile.js file is a controller file that handles requests related to user profiles. 
It contains functions and route handlers for managing user profiles, such as fetching user profile information, updating profile details, uploading profile pictures, 
retrieving user posts, and performing other profile-related operations.

- universal.js: The universal.js file is a controller file that contains common or utility functions used throughout the application. 
These functions may provide general-purpose functionality or shared logic used across different modules or controllers. 


### routers

- friends.js
- init.js
- profile.js
- universal.js


### functions

- addPost.js: Contains the function responsible for adding a new post to db and additionaly adding it to the other users main wall
- generateAuthToken.js: Contains the function for generating an authentication token with jwt
- generateResult.js: Contains the function for generating a list of users according to passed arguments (criterions)
- personsGenerator.js: Contains the function for generating persons according to passed arguments (criterions)
- pushInvitation.js: Contains the function for pushing an invitation adding invitation to invited profile and additionaly to the user that sent invitation
- resetingPasswordEmail.js: Contains the function for sending a password reset email with Send Grid
- validate.js: Contains the function for validating email and password
