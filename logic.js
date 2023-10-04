const db = require('./service/datab')

// import jwt
const jwt =require('jsonwebtoken')


// create a function for register logic

register = (acno, uname, psw) => {

    return db.User.findOne({ acno }).then(user => {

        if (user) {

            return {
                message: "user already exist",
                status: false,
                statuscode: 402
            }
        } else {

            newuser = new db.User({

                acno: acno,
                uname: uname,
                psw: psw,
                balance: 0,
                transactions: []
            })
            newuser.save()

            return {
                message: "registered successfully",
                status: true,
                statuscode: 200
            }
        }

    })
}


// log in logic

login = (acno, psw) => {
    return db.User.findOne({ acno, psw }).then(user => {



        if (user) {

            // token generation 
            const token =jwt.sign({currentAcno:acno},"secretkey123")
            return {
                message: "login successfull",
                status: true,
                statusCode: 200,
                currentuser: user.uname,
                currentacno: user.acno,
// toen sent to client
                token
            }
        }
        else {
            return {
                message: "incorrect acno or password",
                status: false,
                statusCode: 401
            }
        }


    })
}

getBalance =acno=> {
  return  db.User.findOne({ acno }).then(user=> {
        if (user) {
            return {
                message: user.balance,
                status: true,
                statusCode: 200
            }
        } else {
            return {
                message: "incorrect acno",
                status: false,
                statusCode: 401
            }
        }
    })
}


getUser=acno=>{
  return  db.User.findOne({acno}).then(user=>{
        if(user){
            return{
                message: user,
                status: true,
                statusCode: 200
            }
        }else{
            return{
                message: "incorrect acno",
                status: false,
                statusCode: 401

            }
        }
    })
}


fundTransfer=(toAcno,fromAcno,amount,psw,date)=>{
    let amnt=parseInt(amount)
    // here this acno is same is db key
    return db.User.findOne({acno:fromAcno,psw}).then(result=>{
        if(result){
            // data is to user details
return db.User.findOne({acno:toAcno}).then(data=>{
    if(data){
        if(amnt>result.balance){
            return{
                message: "insufficient balance",
                status: false,
                statusCode: 404

            }
        }else{
            result.balance-=amnt
            result.transactions.push(
                {
                    type:"Debit",
                    amount:amnt,
                    date
                }
            )
            result.save()

            data.balance+=amnt
            data.transactions.push({
                type:"Credit",
                amount:amnt,
                date
            })
            data.save()
            return {
                message: "transaction success",
                status: true,
                statusCode: 200,
                balance:result.balance

            }
        }
    }
})


        }else{
            return{
                message: "invalid debit credential",
                status: false,
                statusCode: 404            }
        }
    })
}


// transaction history

getTransaction=(acno)=>{
    // key of db and value here are same acno is enough
return db.User.findOne({acno}).then(user=>{

    if(user){
        return{
            message: user.transactions,
            status: true,
            statusCode: 200,
            
        }
    }else{
        return{message: "invalid user",
        status: false,
        statusCode: 404 

        }
    }
})

}


deleteAc=(acno)=>{
 return   db.User.deleteOne({acno}).then(deleteCount =>{

if(deleteCount){
    return{

        message: "user deleted",
            status: true,
            statusCode: 200,
    }
}
else{

    return{

        
        message: "invalid  user ",
            status: true,
            statusCode: 404,
    }
}


    })
}









// export to get called in other component

module.exports = { register, login, getBalance,getUser,fundTransfer,getTransaction,deleteAc }