const express=require('express');

const router= express.Router();

// this file is root for all apis

router.use('/v1',require('./v1'));

module.exports=router;