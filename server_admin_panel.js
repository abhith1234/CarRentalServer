const { request, response } = require('express')
const express =require('express')
const app=express()
// const categoryRouter=require('./routers/admin/category')
 const bodyParser=require('body-parser')
const carRouter=require('./routers/admin/car')
// const orderRouter=require('./routers/admin/orders')
const userRouter=require('./routers/admin/user')
//const brandRouter=require('./routers/admin/brand')
const adminRouter=require('./routers/admin/admin')
const jwt=require('jsonwebtoken')
const config=require('./config')
const cors=require('cors')
//const morgan=require('morgan')
const bookedCarRouter=require('./routers/admin/bookedcars')

function authorizeUser(request,response,next){
    const token=request.headers.token
    if(
        (request.url=='/admin/login' || request.url=='/') ||
        (request.url.startsWith('/car/image')) ||
        (request.url.startsWith('/bookedcars/image')) ||
        (request.url.startsWith('/user/suspend/')) ||
        (request.url.startsWith('/user/activate/')) ||
        (request.url.startsWith('/bookedcars/deny')) ||
        (request.url.startsWith('/bookedcars/confirm')) ||
        (request.url.startsWith('/bookedcars/returned')) 
        // ||
        // (request.url.startsWith('/bookedcar/search/'))
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
app.use('/user',userRouter)
//app.use('/brand',brandRouter)
app.use('/bookedcars',bookedCarRouter)
app.use('/admin',adminRouter)
// app.use('/category',categoryRouter)
// app.use('/orders',orderRouter)
app.use('/car',carRouter)

app.get('/',(request,response)=>{
    response.send('<h1>welcome to evernote</h1>')
})

app.listen( process.env.PORT || 4000,'0.0.0.0',()=>{
    console.log('server started running at port 4000')
})
