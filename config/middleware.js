module.exports.setFlash= function(req,res,next){
    // middleware takes three argument
    // this middlware fethches everything from req flash and stores to locals
    res.locals.flash={
        'success': req.flash('success'),
        'error':req.flash('error')
    }
    next();
}