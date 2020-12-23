const { request, response } = require('express')
const express=require('express')
const router=express.Router()
const utils=require('../../utils')
const db=require('../../db')
const config=require('../../config')
const multer=require('multer')
const upload=multer({dest:'image/'})
const fs=require('fs')




router.get('/',(request,response)=>{
    const statement=`select bookedcar.*,cars.carName as carName,cars.plateNo as plateNo,cars.pricePerHour as pricePerHour,cars.image as image from bookedcar
                     inner join cars on bookedcar.carId=cars.id 
                     where userId=${request.userId} order by id desc`

                    //  select product.* ,category.title as categoryTitle,brand.title as brandTitle from product
                    //  inner join brand on product.brandid=brand.id inner join category on category.id=product.categoryid

    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})


router.get('/image/:filename',(request,response)=>{
    const {filename}=request.params

    console.log(`dirname:${__dirname} and filename:${filename}`)
    
    const path=`C:/Users/hp/Desktop/carRentalGit/server/image/${filename}`
    console.log('*********************')
    console.log(`path:${path}`)
    console.log('*********************')
    const data=fs.readFileSync(path)
    response.send(data)
})

router.post('/',upload.single('image'),(request,response)=>{
    console.log(request.file)
    const drivingLicence=request.file.filename
    
    const {carId,toDate,toTime,fromDate,fromTime,destination,startingPoint}=request.body
   
    console.log(`image file:${drivingLicence} `)
    const statement=`insert into bookedcar(userId,carId,toDate,toTime,fromDate,fromTime,drivingLicence,destination,pickPoint) 
    values(${request.userId},${carId},'${toDate}','${toTime}','${fromDate}','${fromTime}','${drivingLicence}','${destination}','${startingPoint}')`

    db.connection.query(statement,(error,data)=>{
        // const statement1=`update user set drivingLisence='${drivingLicence}' where id=${request.userId}`
        // db.connection.query(statement1,(error,data)=>{
        //     response.send(utils.createResult(error,data))
        // })
        response.send(utils.createResult(error,data))
    })
})

// router.post('/withoutLisence',(request,response)=>{
//     const {carId,toDate,toTime,fromDate,fromTime,destination,startingPoint}=request.body
//     const statement=`insert into bookedcar(userId,carId,toDate,toTime,fromDate,fromTime,destination,pickPoint) 
//     values(${request.userId},${carId},'${toDate}','${toTime}','${fromDate}','${fromTime}','${destination}','${startingPoint}')`

//     db.connection.query(statement,(error,data)=>{
//         response.send(utils.createResult(error,data))
//     })
// })

router.delete('/:id',(request,response)=>{
    const {id}=request.params
    const statement=`select * from bookedcar where id=${id}`
    let result={}
    
    db.connection.query(statement,(error,data)=>{
        let bookingDate=data[0].fromDate+'T'+data[0].fromTime
        let currentDate=new Date()
        var msec = Math.abs( currentDate.getTime() - new Date(`${bookingDate}`).getTime() );
        const min = Math.floor((msec/1000)/60);

        const isReturned=data[0].isReturned
        console.log(`isReturned=${isReturned}`)
        //console.log(`data['isReturned']=${data['isReturned']} and jsData=${jsData.isReturned} `)
        
        if((currentDate.getTime() < new Date(`${bookingDate}`).getTime()) && isReturned==2)
        {
            console.log(`in 1st if statement`)
            const statement1=`delete from bookedcar where id=${id}`
            db.connection.query(statement1,(error,data)=>{
                 result=utils.createResult(error,data)
            })
        }
        else if(!(currentDate.getTime() < new Date(`${bookingDate}`).getTime()) && isReturned==2)
        {
            console.log(`in 2nd if statement`)
            const statement1=`delete from bookedcar where id=${id}`
            db.connection.query(statement1,(error,data)=>{
                 result=utils.createResult(error,data)
            })
        }
        else if((currentDate.getTime() < new Date(`${bookingDate}`).getTime()) && isReturned!=2)
        {
            console.log(`in 3rd if statement`)
            const statement1=`delete from bookedcar where id=${id}`
            db.connection.query(statement1,(error,data)=>{
                 result=utils.createResult(error,data)
            })
        }
        else
        {
            console.log(`in else statement`)
            result.status='error'
            result.error=`Cancellation of booking failed.Current time is way beyond booking date and time.`
        }

        response.send(result)
    })
})

module.exports=router
