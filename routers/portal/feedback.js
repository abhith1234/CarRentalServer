const { request, response } = require('express')
const express=require('express')
const router=express.Router()
const utils=require('../../utils')
const db=require('../../db')
const jwt=require('jsonwebtoken')
const config=require('../../config')
const multer=require('multer')
const upload=multer({dest:'image/'})
const fs=require('fs')



// to show the feedback
router.get('/:id',(request,response)=>{
    const {id}=request.params
    const statement=`select feedback.*,user.firstname as userFirstname,user.lastname as userLastname,user.image as userImage from feedback inner join user on feedback.userId=user.id where carId=${id}`
    console.log(`()()()()() id=${id}`)
    db.connection.query(statement,(error,data)=>{
    response.send(utils.createResult(error,data))
     })
})

//to add the feedback
router.post('/:id',(request,response)=>{
    const {id}=request.params
    const {content,rating}=request.body
    const statement =`insert into feedback(carId,userId,content,rating) values(${id},${request.userId},'${content}',${rating})`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
        })
})















module.exports=router