const passport=require('passport');
const JWTStrategy= require('passport-jwt').Strategy;
const ExtractJWT= require('passport-jwt').ExtractJwt;
const env=require('./environment');

const User=require('../models/user');
const { ExtractJwt } = require('passport-jwt');

let opts={
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : env.jwt_secret
}
// header payload signature    this is the formate of JWT strategy
// payload contains the information of user
passport.use(new JWTStrategy(opts,function(jwtPayLoad,done){
                // done is callback function
                User.findById(jwtPayLoad._id,function(err,user){
                    if(err) {console.log('err in finding user'); return ;}
                     if(user){
                        return done(null,user);
                     }
                     else{
                        return done(null,false);
                     }
                });
})); 

module.exports=passport;