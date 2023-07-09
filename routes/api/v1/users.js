const express=require('express');

const router= express.Router();
const userApi= require('../../../controllers/api/v1/users_api');

// this file is root for all inside v1

router.post('/create-session',userApi.createSession);

module.exports=router;