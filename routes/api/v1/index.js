const express=require('express');

const router= express.Router();

// this file is root for all inside v1

router.use('/posts',require('./posts'));
router.use('/users',require('./users'));

module.exports=router;