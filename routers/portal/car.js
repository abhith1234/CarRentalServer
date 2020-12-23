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


router.get('/car-info/:id',(request,response)=>{
    const {id}=request.params
    const statement=`select * from cars where id=${id}`
    console.log(`()()()()() id=${id}`)
    db.connection.query(statement,(error,data)=>{
    response.send(utils.createResult(error,data))
     })
})


router.get('/',(request,response)=>{
    // const {userId}=request.params
    // const token=request.headers['token']
    // const data=jwt.verify(token,config.secret)
    // console.log(data)
    // try{
    //const statement=`select id,title,price,categoryid,brandid,description,imagefile from product`
    const statement=`select * from cars`
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
    const path=`C:/Users/hp/Desktop/carRentalGit/server/image/${filename}`
    console.log('*********************')
    console.log(`path:${path}`)
    console.log('*********************')
    const data=fs.readFileSync(path)
    response.send(data)
})


// router.get('/search/:text',(request,response)=>{
//     const {text}=request.params
//     const statement=`select product.* ,category.title as categoryTitle,brand.title as brandTitle from product
//     inner join brand on product.brandid=brand.id inner join category on category.id=product.categoryid 
//     where product.title like '%${text}%' or product.description like '%${text}%'`
//     db.connection.query(statement,(error,data)=>{
//         response.send(utils.createResult(error,data))
//     })
// })


router.post('/filter',(request,response)=>{
    const {pricePerHour,noOfSeats}=request.body
    let whereClause=''
    let priceClause=''
    let seatsClause=''
    if (pricePerHour!=0)
    {
        priceClause=`pricePerHour <= ${pricePerHour}`
    }
    if (noOfSeats!=0)
    {
        seatsClause=`noOfSeats <= ${noOfSeats}`
    }

    if((priceClause.length>0) || (seatsClause.length>0))
    {
        whereClause=priceClause
        if(seatsClause.length>0)
        {
            if(whereClause.length>0){whereClause=whereClause +' and '}
            whereClause+=seatsClause
        }
        whereClause= 'where ' + whereClause
    }
    const statement=`select * from cars ${whereClause}`

    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })

})



module.exports=router