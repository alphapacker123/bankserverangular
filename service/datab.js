const mongoose=require('mongoose')
// import mongose


mongoose.connect('mongodb://127.0.0.1:27017/bankServer'),{userNewurlparser:true}
// connect string


const User=mongoose.model('User',{

    

    acno:Number,
    
    uname:String,
    
    psw:String,
    
    balance:Number,

    
    transactions:[]
    


})
// model








module.exports={User}