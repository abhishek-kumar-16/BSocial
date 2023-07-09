const express=require('express');

const router= express.Router();

console.log("router loaded");

const homeController=require('../controllers/home_controller')

router.get('/',homeController.home)
// if the above is not the required one, then go to following ...
router.get('/profile',require('./users'));
// for any further router access from here
 router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/likes',require('./likes'));


router.use('/api',require('./api'));


module.exports = router;

// this file is root for all routes