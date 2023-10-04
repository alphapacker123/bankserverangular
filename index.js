const express = require("express")

const logic = require('./logic')
const app = express()

// to convert all incoming data to js
app.use(express.json())

// import jwt

const jwt = require('jsonwebtoken')



const jwtMiddleware = (req, res, next) => {
    console.log("....middlewear");
    // access token from request header
    // can only call with square bracket not dot
    try {
        const token = req.headers["access_token"]
        // verify token

       const data= jwt.verify(token, "secretkey123")

        // alway call next at the end if you use middle wear otherwise server will not take other request
console.log(data);
        next()
    } catch {
       res.status(404).json({
        status:false,
        message:"pleaselogin",
        statusCode:404
       })
    }
}










// integrate front end with server using cors

const cors = require('cors')


app.use(cors({ origin: 'http://localhost:4200' }))





// register

app.post('/register', (req, res) => {
    logic.register(req.body.acno, req.body.uname, req.body.psw).then(result => {
        res.status(result.statuscode).json(result)
    })
})


//  log in

app.post('/login', (req, res) => {
    logic.login(req.body.acno, req.body.psw).then(result => {

        res.status(result.statusCode).json(result)
    })
})
// api regquest send using params to get  balance

app.get('/balance/:acno',jwtMiddleware, (req, res) => {
    // here after colon variable should be same as after params. variable
    logic.getBalance(req.params.acno).then(result => {
        res.status(result.statusCode).json(result)
    })
})


// single user accn details
app.get('/getUser/:acno', (req, res) => {
    // here after colon variable should be same as after params. variable
    logic.getUser(req.params.acno).then(result => {
        res.status(result.statusCode).json(result)
    })
})

// fund transfer
app.post('/transfer', (req, res) => {
    // toAcno,fromAcno,amount,psw,date
    logic.fundTransfer(
        req.body.toAcno,
        req.body.fromAcno,
        req.body.amount,
        req.body.psw,
        req.body.date
    ).then(result => {
        res.status(result.statusCode).json(result)
    })


})




// transation history path

app.get('/transaction/:acno', (req, res) => {

    logic.getTransaction(req.params.acno).then(result => {
        res.status(result.statusCode).json(result)
    })
})






// delete


app.delete('/deleteAc/:acno',jwtMiddleware,(req,res)=>{

logic.deleteAc(req.params.acno).then(result=>{

    res.status(result.statusCode).json(result)
})


})















app.get('/getdata', (req, res) => {
    console.log(req.body.key);

    res.json(req.body.acno)
})

app.listen(3000, () => {
    console.log("server live on port 3000npx  ");

})



