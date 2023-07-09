const Comment =  require('../models/comment');
const Post= require('../models/post');
// const commentsMailer= require('../mailers/comments_mailer');
const queue = require('../config/kue');
// const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function(req, res){

  try{
      let post = await Post.findById(req.body.post);

      if (post){
          let comment = await Comment.create({
              content: req.body.content,
              post: req.body.post,
              user: req.user._id
          });
          
          // -------------- this below 3 lines added by me additionally-----------------

if (!post.comments) {
  // If the comments array doesn't exist, initialize it as an empty array
  post.comments = [];
}


          post.comments.push(comment);
          post.save();
          // console.log('comment',comment.user);




          comment = await comment.populate('user').execPopulate();
          // commentsMailer.newComment(comment.user);
          if (req.xhr){
              
  
              return res.status(200).json({
                  data: {
                      comment: comment
                  },
                  message: "Post created!"
              });
          }


          req.flash('success', 'Comment published!');

         res.redirect('/');
      }
  }catch(err){
      req.flash('error', err);
      return;
  }
  
}



// module.exports.create = function(req, res) {
//     Post.findById(req.body.post, function(err, post) {
//       if (post) {
//         Comment.create({
//           content: req.body.content,
//           post: req.body.post,
//           user: req.user._id
//         }, function(err, comment) {
//           if (err) {
//             console.log('Error in adding comment', err);
//             return;
//           }
  
//           if (!post.comments) {
//             // If the comments array doesn't exist, initialize it as an empty array
//             post.comments = [];
//           }
  
//           post.comments.push(comment);

        

//           commentsMailer.newComment(comment);
//           post.save(function(err) {
//             if (err) {
//               console.log('Error in saving post', err);
//               return;
//             }

//             req.flash('success','comments added');
//             res.redirect('/');
//           });
//         });
//       }
//     });
//   };
  



  // module.exports.destroy= function(req,res){
  //   Comment.findById(req.params.id,function(err,comment){
  //     if(comment.user == req.user.id){

  //       let postId = comment.post;

  //       comment.remove();
 
  //       Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}},function(err,post){
  //         return res.redirect('back');
  //       })
  //     }
  //     else{
  //       return res.redirect('back');
  //     }
  //   });
  // }

  module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}