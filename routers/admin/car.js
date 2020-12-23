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


router.get('/',(request,response)=>{
    // const {userId}=request.params
    const token=request.headers['token']
    const data=jwt.verify(token,config.secret)
    console.log(data)
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

router.post('/',upload.single('image'),(request,response)=>{
    
    console.log(request.file)
    const image=request.file.filename
     const {userId}=request.params
    const token=request.headers.token
    const {carName,noOfSeats,plateNo,pricePerHour,model,description,transmission,fuel}=request.body
    const data=jwt.verify(token,config.secret)
    console.log(`image file:${image} `)
    const statement=`insert into cars(carName,noOfSeats,plateNo,pricePerHour,model,image,description,transmission,fuel) 
    value('${carName}',${noOfSeats},'${plateNo}',${pricePerHour},'${model}','${image}','${description}','${transmission}','${fuel}')`
    // try{
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
    // }catch(ex){
    //     response.status(401)
    //     response.send(utils.createResult('Invalid token'))
    // }
})

router.put('/:id',upload.single('image'),(request,response)=>{
    const {id}=request.params
    const image=request.file.filename
    const token=request.headers.token
    const {carName,noOfSeats,plateNo,pricePerHour,model,description,transmission,fuel,isAvailable}=request.body
    const data=jwt.verify(token,config.secret)
    console.log(`image file:${image} `)
    const statement=`update cars set carName='${carName}',noOfSeats=${noOfSeats},plateNo='${plateNo}',pricePerHour='${pricePerHour}',
                                     model='${model}',description='${description}',transmission='${transmission}',fuel='${fuel}',image='${image}',isAvailable=${isAvailable} where id=${id}`
    // try{
    
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})


router.put('/withoutImage/:id',(request,response)=>{
    const {id}=request.params
    const token=request.headers.token
    const {carName,noOfSeats,plateNo,pricePerHour,model,description,transmission,fuel,isAvailable}=request.body
    const data=jwt.verify(token,config.secret)
    //console.log(`image file:${image} `)
    console.log(`id=${id} , carname:'${carName}',no of seats=${noOfSeats},plate no='${plateNo}',price/hour='${pricePerHour}',model=${model},description=${description},transmission=${transmission},fuel=${fuel}`)
    const statement=`update cars set carName='${carName}',noOfSeats=${noOfSeats},plateNo='${plateNo}',pricePerHour='${pricePerHour}',
                                     model='${model}',description='${description}',transmission='${transmission}',fuel='${fuel}',isAvailable=${isAvailable} where id=${id}`
    // try{
    
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})
// router.put('/:id',(request,response)=>{
//     const {title,description}=request.body
//     const {id}=request.params
//     const statement=`update category set title='${title}',description='${description}' where id='${id}'`
//     db.connection.query(statement,(error,data)=>{
//         response.send(utils.createResult(error,data))
//     })
// })

router.delete('/:id',(request,response)=>{
    const {id}=request.params
    console.log(`in delete product api with id=${id}`)
    const statement=`delete from cars where id='${id}' `
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})

// router.delete('/all/delete',(request,response)=>{
//     console.log('IN delete all api')
//     // const {userId}=request.params
//     const token=request.headers['token']
//     const dta=jwt.verify(token,config.secret)
//     console.log(dta)
//     console.log('after logging data')
//     const statement=`truncate table category`
//     // try{
//     db.connection.query(statement,(error,data)=>{
//         response.send(utils.createResult(error,data))
//     })
//     // }catch(ex){
//     //     response.status(401)
//     //     response.send(utils.createResult('Invalid token'))
//     // }
// })

module.exports=router