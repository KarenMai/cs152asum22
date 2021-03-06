# cs152asum22

This project is for: web Application Development (COSI-152A)

- This app is focused on getting people a list of charities that is focused on youth. People can then save these places to their list of interest and hopefully they can come back to this and want to help these charities out after discovering it on this app. I used mongodb to store the data for the list. There was an API to get the charities. Then I also had authentication to make sure people were only adding to their own list.


<h4> How to install this app: </h4>
1) Need to get all the dependancies by installing the packages: 

```
npm install
```

2) To let the website run: 
```
nodemon
```


* Do note that when you are directly pulling from github in app.js there is process.env.CHARITY_API_KEY and I have stored this key in my .env which I had added in my gitignore that I would share because there is a limit to my API. 


<h4> Here are the dependancies and they can also be found in the package.json  </h4> 

```
{
  "name": "app03",
  "version": "0.0.0",
  "scripts": {
    "start": "node ./bin/www"
  },
  "private": true,
  "dependencies": {
    "axios": "^0.27.2",
    "bcrypt": "^5.0.1",
    "connect-mongodb-session": "^3.1.1",
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "dotenv": "^16.0.1",
    "ejs": "~2.6.1",
    "express": "~4.16.1",
    "express-ejs-layouts": "^2.5.1",
    "express-session": "^1.17.3",
    "http-errors": "~1.6.3",
    "mongoose": "^6.3.8",
    "morgan": "~1.9.1"
  }
}
```


<h6> I mastered the following for this project: </h6>
Running Express Apps: running it through nodemon
Core HTML and Bootstrap: check out BIO
API access times: see app.js
EJS control flow times: check some fo the views
Spoken Communication times: recorded several times
Database Interaction: look at the views to see the part that saves the list
Authentication times: look into the routes with the auth
Written Communication: currently demonstrating it here
