const { request } = require("express");
const mailer=require('nodemailer')

function sendEmail(email,subject,body,callback){
const transport=mailer.createTransport({
    service:'gmail',
    auth:{
        user:'clickandgo07@gmail.com',
        pass:'click&go'
    }
})

transport.sendMail({
    from:'noreply@Click&Go.com',
    to:email,
    subject:subject,
    html:body

},callback)
}

function sendEmailToAdmin(email,password,subject,body,callback){
    const transport=mailer.createTransport({
        service:'gmail',
        auth:{
            user:email,
            pass:password
        }
    })
    console.log(`email=${email} password=${password}`)
    transport.sendMail({
        from:email,
        to:'clickandgo07@gmail.com',
        subject:subject,
        html:body
    
    },callback)
}
    

module.exports={
    sendEmail:sendEmail,
    sendEmailToAdmin:sendEmailToAdmin
}