const User=require('../../../models/user');
const jwt= require('jsonwebtoken');
const env= require('../../../config/environment');

module.exports.createSession= async function(req,res){
    // find user and create token

      try{
        let user= await User.findOne({email: req.body.email});
        
      
         
        if(!user || user.password != req.body.password){
          return res.json(422,{
            message: "Invalid username or password"
          });
        }
  
         return res.json(200, {
          message: "sign in successful , here is the token",
          data: {
            // here toJSON is the thing which is encrypting the information for us
            token: jwt.sign(user.toJSON(),env.jwt_secret,{expiresIn: '100000'})
          }
         })
      }
      catch(err){
              console.log('*',err);
              return res.json(500,{
                message: "internal server error"
              });
      }

 


  }