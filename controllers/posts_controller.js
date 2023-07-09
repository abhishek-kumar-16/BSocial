
const Post = require('../models/post')
const Comment= require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function(req, res){

    try{
    let post=    await Post.create({
            content: req.body.content,
            user: req.user._id
        });

// request sent by ajax is of xhr type
         if(req.xhr){

         post =await post.populate('user','name').execPopulate();

            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post Created !"
             });
         }

        req.flash('success','Post Created');
        // return res.redirect('back');
        return ;
    }
    catch(err){
            console.log('Erro',err);
            return res.redirect('back');
    }
 
}

module.exports.destroy= async function(req,res){

    try{
        let post= await Post.findById(req.params.id);
        //.id means converting the object id into string
        if(post.user == req.user.id){
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});


            post.remove();
             
            // deleting comment also
           await Comment.deleteMany({post: req.params.id});


      if(req.xhr){
        return res.status(200).json({
            data:{
                post_id: req.params.id
            },
            message:"post deleted successfully"
        })
      }


              req.flash('success','post deleted');
           return res.redirect('back');
           
    }
    else{
        req.flash('error','you can not delete this post');
        return res.redirect('back');
    }
    }
    catch(err){
        console.log('Err',err);
        return res.redirect('back');
    }
 

}