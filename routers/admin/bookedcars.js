
const { request, response } = require('express')
const express=require('express')
const router=express.Router()
const utils=require('../../utils')
const db=require('../../db')
const config=require('../../config')
const multer=require('multer')
const upload=multer({dest:'image/'})
const fs=require('fs')
const mailer=require('../../mailer')
const { dirname } = require('path')


//select distinct(year(created_on)) from bookedcar;
//select distinct(month(created_on)) from bookedcar where year(created_on)=2020;
//select * from bookedcar where year(created_on)=2020 and month(created_on)=11;

router.get('/yearreport',(request,response)=>{
    const statement=`select distinct(year(created_on)) as year from bookedcar`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})

router.get('/monthreport/:year',(request,response)=>{
    const {year}=request.params
    const statement=`select distinct(month(created_on)) as month from bookedcar where year(created_on)=${year}`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})

router.get('/carreport',(request,response)=>{
    const statement=`select * from cars`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})

// select bookedcar.*,cars.carName as carName,cars.plateNo as plateNo,cars.pricePerHour as pricePerHour,
//                     cars.image as carImage,user.firstname as userFirstName,user.lastname as userLastName,user.phone as userPhone 
//                     from bookedcar
//                     inner join cars on bookedcar.carId=cars.id
//                     inner join user on bookedcar.userId=user.id
//                     where year(bookedcar.created_on)=2020 and month(bookedcar.created_on)=11 
router.post('/monthlyreport',(request,response)=>{
    const {year,month,carId}=request.body
    let yearClause=''
    let monthClause=''
    let carClause=''
    let whereClause=''
    if(year==0)
    {
        whereClause=''
        if(carId==0)
        {
            carClause='' 
            whereClause=''
        }
        else{
            carClause=`carId=${carId}`
            whereClause=`where ${carClause}`
        }
    }
    else{
        yearClause=`year(bookedcar.created_on)=${year}`
        if(month==0)
        {
            //whereClause=` where `+yearClause
            if(carId==0)
            {
                carClause='' 
                whereClause=`where ${yearClause}`
            }
            else{
                carClause=`carId=${carId}`
                whereClause=`where ${carClause} and ${yearClause}`
            }

        }
        else{
            monthClause=`month(bookedcar.created_on)=${month}`
            
            if(carId==0)
            {
                carClause='' 
                whereClause=` where `+yearClause + ` and ` + monthClause
            }
            else{
                carClause=`carId=${carId}`
                whereClause=`where ${carClause} and ${yearClause} and ${monthClause}`
            }
        }
    }
    
    const statement=`select bookedcar.*,cars.carName as carName,cars.plateNo as plateNo,cars.pricePerHour as pricePerHour,
                    cars.image as carImage,user.firstname as userFirstName,user.lastname as userLastName,user.phone as userPhone 
                    from bookedcar
                    inner join cars on bookedcar.carId=cars.id
                    inner join user on bookedcar.userId=user.id
                    ${whereClause} order by id desc`

                    db.connection.query(statement,(error,data)=>{
                        response.send(utils.createResult(error,data))
                    })
})

router.get('/',(request,response)=>{
    const statement=`select bookedcar.*,cars.carName as carName,cars.plateNo as plateNo,cars.pricePerHour as pricePerHour,
                     cars.image as carImage,user.firstname as userFirstName,user.lastname as userLastName,user.phone as userPhone,
                     user.email as userEmail 
                     from bookedcar
                     inner join cars on bookedcar.carId=cars.id
                     inner join user on bookedcar.userId=user.id
                     where NOT isReturned=3 and NOT isReturned=1`

    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})

router.get('/search/:text',(request,response)=>{
    const {text}=request.params
    const statement=`select bookedcar.*,cars.carName as carName,cars.plateNo as plateNo,cars.pricePerHour as pricePerHour,
                    cars.image as carImage,user.firstname as userFirstName,user.lastname as userLastName,user.phone as userPhone 
                    from bookedcar
                    inner join cars on bookedcar.carId=cars.id
                    inner join user on bookedcar.userId=user.id
                    where cars.carName like '%${text}%' or user.firstName like '%${text}%' or user.lastName like '%${text}%'
                    order by id desc
                    `
                    db.connection.query(statement,(error,data)=>{
                        response.send(utils.createResult(error,data))
                    })               
})


router.post('/filter',(request,response)=>{
    const {returnStatus}=request.body
    let whereClause=''
    if(returnStatus==-1)
    {
        whereClause=''
    }
    else{
        whereClause=`where isReturned=${returnStatus}`
    }
    const statement=`select bookedcar.*,cars.carName as carName,cars.plateNo as plateNo,cars.pricePerHour as pricePerHour,
                     cars.image as carImage,user.firstname as userFirstName,user.lastname as userLastName,user.phone as userPhone 
                     from bookedcar
                     inner join cars on bookedcar.carId=cars.id
                     inner join user on bookedcar.userId=user.id
                     ${whereClause} order by id desc
                     `

    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})





router.get('/image/:filename',(request,response)=>{
    const {filename}=request.params

    console.log(`dirname:${__dirname} and filename:${filename} and imageFOlderPAth=${dirname}`)
    const path=`C:/Users/hp/Desktop/carRentalGit/server/image/${filename}`
    console.log('*********************')
    console.log(`path:${path}`)
    console.log('*********************')
    const data=fs.readFileSync(path)
    response.send(data)
})


router.put('/deny/:id',(request,response)=>{
    const {id}=request.params
    const statement=`update bookedcar set isReturned=3 where id=${id}`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})

router.put('/confirm/:id',(request,response)=>{
    const {id}=request.params
    const statement=`update bookedcar set isReturned=0 where id=${id}`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})

router.put('/returned/:id',(request,response)=>{
    const {id}=request.params
    const {totalRent,returnOn,rideDuration,bookingTime,userEmail,pricePerHour,carName}=request.body
    const pricePerMin=pricePerHour/60
    const body=`
        <h1> We have got our ${carName} back.Here is your car rent<br>
      <h2>Total Min= ${rideDuration} </h2> <br>
      <h2>From Date= ${bookingTime} </h2> <br>
      <h2>Return Date= ${returnOn} </h2> <br>
      <h2>Price/Hour= Rs. ${pricePerHour} </h2> <br>
      <h2>Total Bill= Total Min * Price/Min <br > <h2 style="margin-left:80px;"> = ${rideDuration} * ${pricePerMin} </h2> </h2>
      <h2>Total Bill= Rs. ${totalRent} </h2>`


      mailer.sendEmail(userEmail,`Journey's total Bill`,body,
        (mailError,mailResult)=>{
            response.send(utils.createResult(error,result))
            console.log('success111')
        }
        )


    const statement=`update bookedcar set isReturned=1,returnOn='${returnOn}',totalRent='${totalRent}',rideDuration='${rideDuration}' where id=${id}`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
        
    })
})

router.post('/',upload.single('image'),(request,response)=>{
    console.log(request.file)
    const drivingLicence=request.file.filename
    
    const {carId,toDate,toTime,fromDate,fromTime,destination}=request.body
   
    console.log(`image file:${drivingLicence} `)
    const statement=`insert into bookedcar(userId,carId,toDate,toTime,fromDate,fromTime,drivingLicence,destination) 
    values(${request.userId},${carId},'${toDate}','${toTime}','${fromDate}','${fromTime}','${drivingLicence}','${destination}')`

    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})


router.delete('/:id',(request,response)=>{
    const {id}=request.params
    const statement=`delete from bookedcar where id=${id}`
    db.connection.query(statement,(error,data)=>{
        response.send(utils.createResult(error,data))
    })
})

// router.get('/rent/:id',(request,response)=>{
//     const {id}=request.params
//     const statement=``
// })

module.exports=router
