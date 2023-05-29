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


To provide better undesrtanding of <b>/back-end</b> this description presents information about controllers, routers and functions directories and its subfiles giving you a better understanding of their purpose and functionality:

### controllers

- friends.js: This file is a controller file responsible for handling requests related to friends functionality. 
It contains functions and route handlers for managing interactions with other users: adding friends, removing etc.

- init.js: The init.js file is a controller file that handles initialization tasks. 
It includes functions and route handlers initialize the server, register users, signin users and checking jwt stored in the browser memory.

- profile.js: The profile.js file is a controller file that handles requests related to user profiles. 
It contains functions and route handlers for managing user profiles, such as fetching user profile information, updating profile details, uploading profile pictures, retrieving user posts, and performing other profile-related operations.

- universal.js: The universal.js file is a controller file that contains common or utility functions used throughout the application. 

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


### models

db models are based on User Schema and Comment Schem
Here is breakdow of the schema for <b>User</b> fields:
- info: An object containing the user's personal information.
  - firstName: The user's first name. (required)
  - lastName: The user's last name. (required)
  - residence: The user's residence.
  - education: The user's education.
  - workplace: The user's workplace.
- email: The user's email address. (required)
- password: The user's password - bcrypted (required)
- tokens: An array of tokens associated with the user.
  - token: A token string - jwt
- avatar: The user's avatar object.
  - date: The date of the avatar added/changed.
  - data: The avatar data (Buffer).
  - description: Description of the avatar(meta) - this data are not displayed in the app.
- profilePic: The user's profile picture object.
  - date: The date of the profile picture.
  - data: The profile picture data (Buffer).
  - description: Description of the profile picture(meta) - this data are not displayed in the app.
- pictures: An array of picture objects associated with the user.
  - picture: The picture object.
    - data: The picture data (Buffer).
- invitationsSent: An array of invitation IDs sent by the user.
  - _id: The ID of the invitation that has been sent by user (account owner).
- invitationsReceived: An array of invitation IDs received by the user.
  - _id: The ID of User that sent invitation.
- friends: An array of friend IDs associated with the user.
  - _id: The ID of the friend.
- blocked: An array of user IDs blocked by the user.
  - _id: The ID of the blocked user.
- restrictedInfo: A boolean indicating if the user's info is restricted. (default: false)
- restrictedPhotos: A boolean indicating if the user's photos are restricted. (default: false)
- posts: An array of post objects created by the user.
  - post: The post object.
    - user_id: The ID of the user who created the post.
    - userFirstName: The first name of the user who created the post.
    - userLastName: The last name of the user who created the post.
    - userAvatar: The avatar object of the user who created the post.
      - data: The avatar data (Buffer).
    - type: The type of the post (it can be: post added, profile picture updated, picture added ).
    - date: The date of the post.
    - photos: An array of photo objects associated with the post.
      - data: The photo data (Buffer).
    - description: The description of the post.
    - commentsId: The ID of the comments associated with the post while post is added new comments object is created -> see comment section is this docs.
    - title: The title of the post.
    - range: The range of the post.
 
Note: The schema includes nested objects and arrays to represent complex data structures associated with a user, such as pictures, posts, friends, and invitations.


Here is breakdow of the schema for <b>Comment</b> fields:
- commentsId: The ID of the comments associated with the document.
- comments: An array of comment objects.
  - comment: The comment object.
    - firstName: The first name of the commenter.
    - lastName: The last name of the commenter.
    - avatar: The avatar object of the commenter.
      - data: The avatar data (Buffer).
    - text: The comment text.
    - date: The date of the comment.
- hearts: An array of strings representing users Ids who hearted the comment.
- thumbsup: An array of strings representing users Ids who gave a thumbs-up to the comment.
