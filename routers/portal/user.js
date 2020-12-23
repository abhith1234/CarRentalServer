const { request, response } = require("express");

const express=require('express')
const router=express.Router()
const db=require('../../db')
//const utils=require('../utils')
const crypto=require('crypto-js')
const uuid=require('uuid')
const mailer=require('../../mailer')
//const mailer=require('../mailer')
const jwt=require('jsonwebtoken')
const config=require('../../config')
const utils=require('../../utils')
const multer=require('multer')
const upload=multer({dest:'image/'})
//const multer=require('multer')
//const upload=multer({dest:'image/'})
const fs=require('fs')



router.post('/faq',(request,response)=>{
    const {name,email,password,subject,message}=request.body
    console.log(`${name} ${email} ${password} ${subject} ${message}`)
    const statement=`select * from user where email='${email}'`
    let result={}
    let status=''
    db.connection.query(statement,(error,users)=>{
        if(error)
        {
            result.status='error'
            result.error=error
            console.log(`error`)
        }
        else{
            if(users.length==0)
            {
                status='inactive'
                console.log(`inactive`)
            }
            else{
                const user=users[0]
                if(user.status==1)
                {
                    status='active'
                    console.log(`active`)
                    result.status='success'
                    result.data='Please check mail box'
                }
                else if(user.status==0){
                    status='inactive'
                    console.log(`inactive`)
                }
                else if(user.status==2){
                    status='Suspended'
                    console.log(`suspended`)
                }
            }
            const mailSubject=`<h1>${subject}</h1>`
            const body=`<h4>${message} <br> status=${status}</h4>`
            const statement1=`insert into faq(name,email,subject,message,status) values('${name}','${email}','${subject}','${message}','${status}')`
            db.connection.query(statement1,(error,data)=>{
                mailer.sendEmailToAdmin(email+'',password+'',mailSubject+'',body,
                    (mailError,mailResult)=>{
                        if(mailError){
                            result.status='error'
                            result.error=mailError
                            console.log(mailError)
                            response.send(result)
                        }
                        else{
                            result.status='success'
                            result.data=mailResult
                            response.send(result)
                        }
                    
                    console.log('success111')
                })
                
                //response.send(utils.createResult(error,data))
            })
        }
    })

})

router.post('/signup',(request,response)=>{
    
    const {firstname,lastname,email,phone,password}=request.body
    const activationToken=uuid.v1()
    const body=`<h1>Welcome to the Click&Go application</h1><div>Please activate your Click&Go account</div><a href="http://localhost:4100/user/activate/${activationToken}">click here for activation</a>`
    console.log('in user signup api activationToken:'+activationToken)
    console.log()
    const statement=`insert into user(firstname,lastname,email,phone,password,activationToken) values('${firstname}','${lastname}','${email}','${phone}','${crypto.SHA256(password)}','${activationToken}')`
    db.connection.query(statement,(error,result)=>{
        mailer.sendEmail(email,'Activate your account',body,
        (mailError,mailResult)=>{
            response.send(utils.createResult(error,result))
            console.log('success111')
        }
        )
    })
})


router.post('/signin',(request,response)=>{
    const{email,password}=request.body
    const statement=`select id,firstname,lastname,phone,status,email from user where email='${email}' and password='${crypto.SHA256(password)}'`
    const result={}
    db.connection.query(statement,(error,users)=>{
        if(error)
        {
            result.status='error'
            result.error=error
        }
        else{
            if(users.length==0)
            {
                result.status='error'
                result.error='Invalid user!!'
            }
            else{
                const user=users[0]
                console.log(user)
                if(user.status==0)
                {
                    console.log('in condition')
                    result.status='error'
                    result.error='your account is not active,please activate your account'
                }
                else if(user.status==1)
                {
                    const authToken=jwt.sign({id:user.id},config.secret)
                    result.status='success'
                    result.data={
                        firstname:user.firstname,
                        lastname:user.lastname,
                        phone:user.phone,
                        authToken:authToken,
                        email:user.email,
                        drivingLisence:user.drivingLisence
                    }
                }
                else if(user.status==2)
                {
                    result.status='error'
                    result.error='your account is Blocked,please get in touch with Admin/company'
                }
            }
        }
        response.send(result)    
    })
    
})


router.get('/activate/:token',(request,response)=>{
    const {token}=request.params
    const statement=`update user set status=1 where activationToken='${token}'`
    db.connection.query(statement,(error,data)=>{
        let result=''
        if(error)
        {
            result=`something went wrong .May be server error`
        }
        else{
            result=`Congrats!! you are now member of our Click&Go family.Welcome home`
        }
        response.send(result)

    })

})



//
 router.get('/profile',(request,response)=>{
     const {id}=request.userId
    const token=request.headers['token']
    const data=jwt.verify(token,config.secret)
     //try{
    const statement=`select id,firstname,lastname,email,phone,Address,image from user where id='${data.id}'`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
    // }catch(ex){
    //     response.status(401)
    //     response.send(utils.createResult('Invalid token'))
    // }
})

router.get('/image/:filename',(request,response)=>{
    const {filename}=request.params

    console.log(`dirname:${__dirname} and filename:${filename}`)
    //const data=fs.readFile('/images'+filename)
    //const path=__dirname+`/../../image/ ${filename}`
    const path=`C:/Users/hp/Desktop/carRental/server/image/${filename}`
    console.log('*********************')
    console.log(`path:${path}`)
    console.log('*********************')
    const data=fs.readFileSync(path)
    response.send(data)
})

router.put('/profile',upload.single('image'),(request,response)=>{
    const {phone,Address}=request.body
    const image=request.file.filename
     const statement=`update user set phone='${phone}',Address='${Address}',image='${image}' where id=${request.userId}`
     db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
    })

    router.put('/profile/withoutimage',(request,response)=>{
        const {phone,Address}=request.body
        //const image=request.file.filename
         const statement=`update user set phone='${phone}',Address='${Address}' where id=${request.userId}`
         db.connection.query(statement,(error,data)=>{
            response.send(utils.createResult(error,data))
        })
        })

module.exports=router