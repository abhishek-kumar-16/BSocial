const express = require('express');
const env=require('./config/environment');

const cookieParser=require('cookie-parser');
const app=express();
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const cors=require('cors');

// used for session cookie and authentication
const session=require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const crypto = require('crypto');

const MongoStore= require('connect-mongo');
const sassMiddleware=require('node-sass-middleware');
const flash = require('connect-flash')
const customMware= require('./config/middleware');

// here setting chat server 
const chatServer= require('http').Server(app);
const chatSockets= require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path=require('path');


app.use(sassMiddleware({
    //dp// src: './assets/scss', 
    src: path.join(__dirname,env.asset_path,'scss'), 
   //dp// dest: './assets/css',
   dest: path.join(__dirname,env.asset_path,'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))







app.use(express.urlencoded());
app.use(cookieParser());



app.use(express.static(env.asset_path));
// make the uploads path are available to the browser
// __dirname means /codeial which is the current directory
app.use('/uploads', express.static(__dirname + '/uploads'));





app.use(expressLayouts);
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

const port=8000;



// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');


// mongo store is used to store the session cookie in db
app.use(session({
    name:'codeial',
    // TO DO change the secret  before deployment in production mode
    secret:env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create(
        {
        
           // mongooseConnection: db,
           mongoUrl: 'mongodb://0.0.0.0:27017/codeial_development' 
         //  autoRemove: 'disabled'

        
    },{
        mongooseConnection:db,
        autoRemove: 'disabled'

    },
    function(err){
        console.log(err || 'connect-mongodb setup ok');
    }
    )
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash()); // since this uses session cookies therefore it has been used later
app.use(customMware.setFlash);

app.use('/',require('./routes'));



// use express router



app.listen(port,function(err){
    if(err){
        console.log(`error is running the port ${err}`);
        return;
    }
    console.log(`server is running successfully on port : ${port}`);

})