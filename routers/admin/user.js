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

// router.post('/signup',(request,response)=>{
    
//     const {firstname,lastname,email,phone,password}=request.body
//     const activationToken=uuid.v1()
//     const body=`<h1>Welcome to the mystore application</h1><div>Please activate your mystore account</div><a href="http://localhost:4100/user/activate/${activationToken}">click here for activation</a>`
//     console.log('in user signup api activationToken:'+activationToken)
//     console.log()
//     const statement=`insert into user(firstname,lastname,email,phone,password,activationToken) values('${firstname}','${lastname}','${email}','${phone}','${crypto.SHA256(password)}','${activationToken}')`
//     db.connection.query(statement,(error,result)=>{
//         mailer.sendEmail(email,'Activate your account',body,
//         (mailError,mailResult)=>{
//             response.send(utils.createResult(error,result))
//             console.log('success111')
//         }
//         )
//     })
// })


// router.post('/signin',(request,response)=>{
//     const{email,password}=request.body
//     const statement=`select id,firstname,lastname,phone,status from user where email='${email}' and password='${crypto.SHA256(password)}'`
//     const result={}
//     db.connection.query(statement,(error,users)=>{
//         if(error)
//         {
//             result.status='error'
//             result.error=error
//         }
//         else{
//             if(users.length==0)
//             {
//                 result.status='error'
//                 result.error='Invalid user!!'
//             }
//             else{
//                 const user=users[0]
//                 console.log(user)
//                 if(user.status==0)
//                 {
//                     console.log('in condition')
//                     result.status='error'
//                     result.data='your account is not active,please activate your account'
//                 }
//                 else if(user.status==1)
//                 {
//                     const authToken=jwt.sign({id:user.id},config.secret)
//                     result.status='success'
//                     result.data={
//                         firstname:user.firstname,
//                         lastname:user.lastname,
//                         phone:user.phone,
//                         authToken:authToken
//                     }
//                 }
//                 else if(user.status==2)
//                 {
//                     result.status='error'
//                     result.data='your account is Blocked,please get in touch with Admin/company'
//                 }
//             }
//         }
//         response.send(result)    
//     })
    
// })


router.get('/',(request,response)=>{
    console.log('in get user api')
    //const {token}=request.params
    const statement=`select id,firstname,lastname,status,email,phone from user`
    db.connection.query(statement,(error,data)=>{
    response.send(utils.createResult(error,data))
    })
})

router.put('/suspend/:id',(request,response)=>{
    const {id}=request.params
    console.log(`id:${id}`)
    const statement=`update user set status=2 where id=${id}`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})


router.put('/activate/:id',(request,response)=>{
    const {id}=request.params
    console.log(`id:${id}`)
    const statement=`update user set status=1 where id=${id}`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})
// router.get('/profile/',(request,response)=>{
//     // const {id}=request.params
//     const token=request.headers['token']
//     const data=jwt.verify(token,config.secret)
//     // try{
//     const statement=`select id,name,email,phone,address from user where id='${data.id}'`
//     db.connection.query(statement,(error,data)=>{
//         response.send(utils.createResult(error,data))
//     })
//     // }catch(ex){
//     //     response.status(401)
//     //     response.send(utils.createResult('Invalid token'))
//     // }
// })

module.exports=router