const nodemailer=require("nodemailer");
const ejs= require('ejs');
const path=require('path')

let transporter=nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,                                      // this is the part which define how communication is going to take place
    auth:{
        user: 'abhishekdemo36',
        pass: 'Demo@2023'
    }
    // connectionTimeout: 5 * 60 * 1000, // 5 min
    // tls:{
    //     rejectUnauthorized:false
    // }
});

let renderTemplate= (data,relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){console.log('error in rendering template'); return ;}
             mailHTML=template;
        }
    )
    return mailHTML;
}

module.exports={
    transporter: transporter,
    renderTemplate: renderTemplate
    // we have defined two functions so we are exporting two
}