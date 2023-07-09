
const User = require('../models/user');
const fs=require('fs');
const path=require('path');

const bcrypt = require('bcrypt');
module.exports.profile = function(req, res) {
     User.findById(req.params.id,function(err,user){
      return res.render('profile', {
        title: 'User Profile',
        profile_user: user
    });
     });

    // res.end('<h1>User Profile <h1>');
      
    // to allow to come to this page only after authentication
    // if(req.cookies.user_id){
    //   const existingUser= User.findById(req.cookies.user_id);
    //   if(existingUser){
        
    //     return res.render('profile',{
    //       title:"User Profile",
    //       user: existingUser
    //   })
    // }
    // else{
    //   return res.redirect('/users/sign-in');
    // }
    // }
    // else{
    //   return res.redirect('/users/sign-in');
    // }
      
  //   User.findById(req.params.id,function(err,user){
  //     return res.render('profile',{
  //       title:"User Profile",
  //      // user: user
  // });
  //   });
   

    // return res.render('profile', {
    //     title: "User"
    // });
}
//render the sign up page

module.exports.update=async function(req,res){
  // if(req.user.id== req.params.id){
  //   User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
  //     return res.redirect('back');
  //   });
  // }
  // else{
  //  return res.status(401).send('Unauthorized');
  // }
  
  if(req.user.id == req.params.id){
    try{
                 let user=await User.findById(req.params.id);
                 User.uploadedAvatar(req,res,function(err){
                   if(err){
                    console.log('Multer error',err);
                   }
                  user.name=req.body.name;
                  user.email=req.body.email;
                  // here need to chek whether file exists or not because user might not change profile pic

                  if(req.file){
                     
                            if(user.avatar){
                              fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                            }

                      // saving the path of the uploaded file into the avatar field in the user
                      user.avatar=User.avatarPath + '/' + req.file.filename;
                  }
                  user.save();
                 return res.redirect('back');
                 });
                 
    }
    catch(err){
           req.flash('error',err);
           return res.redirect('back');
    }
  }
  else{
    req.flash('error','Unauthorized');
    return res.status(401).send('Unauthorized');
  }

}

module.exports.signUp = function (req, res) {


if(req.isAuthenticated()){
 return res.redirect('/users/profile');
}


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
}
//render the sign in page
module.exports.signIn = function (req, res) {
  if(req.isAuthenticated()){
   return res.redirect('/users/profile');
  }
  

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
}

//get the sign up data

module.exports.create=function(req,res){
  if(req.body.password!=req.body.confirm_password){
    return res.redirect('back');
  }
        User.findOne({email:req.body.email},function(err,user){
          if(err){
            console.log('error in finding user in signup ');
            return
          }
          if(!user){
            User.create(req.body,function(err,user){
              if(err){
                console.log('error in creating use while signing up');
                return
              }
              return res.redirect('/users/sign-in');
            })

          }
          else{
            return res.redirect('back');
          }
        });
      


}
  
  
  
  
module.exports.createSession=function(req,res){
  req.flash('success','Logged in Successfully');
  return res.redirect('/');
}

module.exports.destroySession= function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success','You have logged out !');
    res.redirect('/');
  });
 

// req.logout(); // this is inbuilt function in passport
// return res.redirect('/');
}
  
  

/*
module.exports.create = async function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    
    }

// chat gpt code

    // error 1 here , findone no longer accepts call back
 const existingUser=await User.findOne({ email: req.body.email });


 if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword
      });
  
      // Save the user to the database
      await newUser.save();
  
      // Sign up successful
      // You can generate a token or perform any other necessary actions here
      return res.status(201).json({ message: 'Sign up successful' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }

   //function (err, user) {
       // if (err) {
        //    console.log('error in finding user while signing up');
       //   return
       // }

       // if user is not found
      //  if (!user) {
        //     User.create(req.body, function (err, user) {
        //         if (err) {
        //             console.log('error in creating user while signing up');
        //             return
        //         }

        //    // return res.redirect('back');
        //    return res.status(201).json({ message: 'Sign up successful' });
        //     });

        // }
        // if the user already exists
       // else {
       //    return res.redirect('back');
       // }


   // });


//}

*/
//  code from chat gpt


// signing in

// module.exports.createSession = async function signInController(req, res) {
//     // steps to authenticate
//     // find the user
//   //  const {email, password } = req.body;

//     try {
//       // Check if a user with the provided email already exists
      
//       const existingUser = await User.findOne({ email :req.body.email});
//       if (existingUser) {


//         const hashedPasswordFromDB = existingUser.password;

//         if (hashedPasswordFromDB) {
//           // Compare the provided password with the hashed password from the database
//           bcrypt.compare(req.body.password, hashedPasswordFromDB, (err, result) => {
//             if (result) {
//               // Passwords match, user is authenticated
//               console.log('Sign in successful!');
//               res.cookie('user_id',existingUser.id);
//               // in such cases always use redirect, render again send it to router so avoid that
//               return res.redirect('/users/profile');
//               // Proceed with sign-in logic, such as redirecting to a success page
//              // handleSuccessfulSignIn();
//             } else {
//               // Passwords do not match, show an error message
//               res.redirect('back');
//               console.log('Invalid email or password.');
//             }
//           });
//         } else {
//           // User not found in the database, show an error message
//           res.redirect('back');
//           console.log('Invalid email or password.');
//         }
//         /*
//         if (existingUser.password != req.body.password) {
//          console.log('returning from here');
//           return res.redirect('back');
//       }
//              else{
//       res.cookie('user_id',User.id);
//       return res.redirect('/users/profile');
//              }

//         //return res.status(409).json({ error: 'Email already registered' });
//       }
//       */
//     }
//       else{
//         res.redirect('back');
//       }
    
  
//     }
  

//     catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }

// /*
//     User.findOne({ email: req.body.email }, function (err, user) {
//         if (err) {
//             console.log('error in finding user while signing in');
//             return
//         }
//         // handle the user found case
//         if (user) {
//             // if found , handle the password not matching case
//             if (user.password != req.body.password) {
//                 return res.redirect('back');
//             }
//             // handle session creation case   

//               res.cookie('user_id',user.id);
//               return res.render('/users/profile');


//         }
//         else{
//  // handle the user not found case


//          res.render('users/sign-in');
//         }

//     })



// */
// }


// sign in and create a session for the user
