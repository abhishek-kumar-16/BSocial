const Like= require('../models/like');
const Post= require('../models/post');
const Comment= require('../models/comment');

module.exports.toggleLike= async function(req,res){
    try{
                 // likes/toggle/?id=abcdfd&type=Post or comment
                 let likeable;
                 let deleted=false; // will serve to keep counting of likes
                 if(req.query.type=='Post'){
                    // in the below line , we are also populating the likes if they already exist
               likeable=await Post.findById(req.query.id).populate('likes');
                 }
                 else{
                      likeable= await Comment.findById(req.query.id).populate('likes');
                 }

          // check if like already exists
          let existingLike=await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
          })
            
          // if a like already exists then we will delete it
          if(existingLike){
              likeable.likes.pull(existingLike._id);
              likeable.save();
              existingLike.remove();
              deleted=true;
          }
          else{
             // we will create one like
             let newLike= await Like.create({
                user: req.user._id,
                likeable : req.query.id,
                onModel: req.query.type
             });
             likeable.likes.push(newLike._id);
             likeable.save();
          }
          
          return res.json(200,{
            message: "Request Successful",
            data:{
                deleted: deleted
            }
          })

    }
    catch(err){
        console.log(err);
        return res.json(500,{
            message:"internal server error"
        });
    }
}