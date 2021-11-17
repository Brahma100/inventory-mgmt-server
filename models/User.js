const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema(
    {
        fname:{
            type:String,
            required:true,
        },
        lname:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique=true
        },
        password:{
            type:String,
            required:true,
        },

    }
)
// fname,lname,email, password,img,city,state,postal,country,ip