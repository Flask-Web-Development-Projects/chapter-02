# Plan for User Interactions

As a user, I...
- should be able to see the homepage whether I'm logged in or not
- should be able to register for a new account on the website
- should be able to login with an existing account if I have one
  - if the username supplied doesn't match an existing account, return a 404
  - if the password supplied doesn't match the password for the account, return a 400
  - if the username and password match, return a 200 and the user object with token
- should be able to delete my own account at any time
  - if the account of the authenticated user doesn't match the account being deleted, a 401 is returned
- should be able to change my password
  - if the new password doesn't match the verify password, 400
  - if the old password doesn't match existing password, 400
  - if the new password matches existing password, 400
  - if the user trying to change passwords isn't the authenticated user, 401
  - if good password change, 200
- should be able to see my account details and posts
- should be able to see how long ago I created my account
- should be able to see the last few posts I made
- should be able to see the most recent N posts, where I can choose what N is
- should be able to see who authored what articles
- should be able to see all the articles for a given author
- should be able to create new posts at any time
- should be able to edit or delete any of my posts
- shouldn't be able to edit or delete anyone else's post
- should be able to leave a comment on any post
- should be able to edit or delete any of my comments
- should still have my posts and comments in existence even if I delete my account
