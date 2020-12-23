const { request, response } = require('express')
const express =require('express')
const app=express()
//const categoryRouter=require('./routers/portal/category')
const bodyParser=require('body-parser')
const carRouter=require('./routers/portal/car')
// const orderRouter=require('./routers/admin/orders')
// const userRouter=require('./routers/admin/user')
const bookedCarRouter=require('./routers/portal/bookedcar')
//const brandRouter=require('./routers/portal/brand')
const userRouter=require('./routers/portal/user')
const jwt=require('jsonwebtoken')
const config=require('./config')
const cors=require('cors')
const morgan=require('morgan')
const feedbackRouter=require('./routers/portal/feedback')

function authorizeUser(request,response,next){
    const token=request.headers.token
    if(
        (request.url=='/user/signin' || request.url=='/') ||
        (request.url.startsWith('/car/image')) ||
        (request.url=='/user/signup') ||
       // (request.url=='/user/profile') ||
        (request.url.startsWith('/user/activate')) ||
        (request.url.startsWith('/car/search/')) ||
        (request.url.startsWith('/bookedcar/image')) ||
        (request.url=='/car/filter') ||
        (request.url.startsWith('/user/image')) ||
        (request.url=='/user/faq')
    )
    {
        next()
    }
    else{
        if(!token){
            response.status(401)
            response.send(`token is misssing`)
        }
        else{
            try{
                const data=jwt.verify(token,config.secret)
                request.userId=data.id;
                next()
            }catch(ex){
                response.status(401)
                response.send(utils.createResult('Invalid token'))
            }
        }
    }
    
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cors('*'))
//app.use(morgan('combined'))
app.use(authorizeUser)
//app.use('/brand',brandRouter)
app.use('/user',userRouter)
app.use('/bookedcar',bookedCarRouter)
//app.use('/category',categoryRouter)
//app.use('/orders',orderRouter)
app.use('/car',carRouter)
app.use('/feedback',feedbackRouter)
app.get('/',(request,response)=>{
    response.send('<h1>welcome to mystore</h1>')
})

app.listen(process.env.PORT || 4100,'0.0.0.0',()=>{
    console.log('server started running at port 4100')
})


