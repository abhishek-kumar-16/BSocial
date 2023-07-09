const mongoose= require('mongoose');

const likeSchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId
    },
    // to keep id of the object of liked object
    likeable:{
        type:mongoose.Schema.ObjectId,
        require: true,
        refPath: 'onModel'           // decides other properties of type
    },
    // to keep type of the liked object 
    onModel:{
        type: String,
        required: true,
        enum: ['Post','Comment']
    }
    },
    {
        timestamps: true
    
});

const Like=mongoose.model('Like',likeSchema);
module.exports=Like;