const passport=require('passport');
const User=require('../models/user');

const LocalStrategy = require('passport-local').Strategy;


//authenticate using passport 
passport.use(new LocalStrategy({
         usernameField: 'email',
         passReqToCallback: true
},
          function(req,email,password,done){
            // find a user and establish the identity
           // here in below line, to use User , user has been imported above 
            User.findOne({email: email},function(err,user){
                if(err){
                    req.flash('error',err);
                   // console.log('Error in finding user--->passsport');
                    return done(err);
                    // done takes two argument
                }
                if(!user || user.password!=password){
                    req.flash('error','Invalid Username or password');
                  //  console.log('Invalid username or password');
                    return done(null,false);
                }
                return done(null,user);
            });

          }
           

 )); 

 // serializing the user to decide which key is to be kept in the 
 passport.serializeUser(function(user,done){
    done(null,user.id);
 });

 // deserializing the user from the key in the cookies
 passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('error in finding user-->passport');
            return done(err);
        }
        return done(null,user);
    });
 });


// check if the user is authenticated 
passport.checkAuthentication= function(req,res,next){
    // if the user is signed in, then pass on the request to the next function(controller's function )
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending it to the locals
        // for views
        res.locals.user=req.user;
    }
    next();
}

 module.exports=passport;