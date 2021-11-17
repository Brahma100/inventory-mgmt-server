
const express =require('express');
const router =express.Router();
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken')
const auth =require('../../middleware/auth');

// User Model

const User=require('../../models/User');

//@route POST api/usesr
//@desc Get All usesr
// @access Public

router.post('/',(req,res)=>{
    // res.send()
    const { name, email, password }=req.body;
    // // SImple Validation
    if(!email || !password) return res.status(400).json({msg:'Please Enter all Fields'});
            // // Check for user Exits or not 
            // User.findByIdAndUpdate()
            User.findOne({email})
            .then(user=>{
            if(!user) return res.status(400).json({msg:'User Not Exits'});
            // validate password
            bcrypt.compare(password,user.password)
            .then(isMatch=>{
                if(!isMatch) return res.status(400).json({msg:"Invalid Credential"})
// JWT start
                jwt.sign(
                    {id:user.id},
                    config.get('jwtSecret'),
                    {expiresIn:3600 },(err,token)=>{
                        if(err) throw err
                        res.json(
                            {
                                token,
                                user:{
                                    _id:user.id,
                                    name:user.name,
                                    email:user.email,
                                    password:user.password
                                }
                            });
                    }
                )
            })



            });

    });

// @route GET api/auth/user/
// @desc get user data
// @access Private

router.get("/user",auth, (req,res)=>{
    User.findById(req.user.id)
    .select('-password')
    .then(user=>res.json(user))
});

router.post("/remove",auth,function(req,res){   
    User.remove({ _id: req.body.id })
        .then(user=>{
            res.json(user);
        });
   });  

router.post("/update",auth,function(req,res){  
     
    const { name, email }=req.body;
    console.log(name+email);
    User.findByIdAndUpdate(req.body.id, { name: req.body.name,email:req.body.email })
    .then((user,err)=>{  
        if(err) return res.status(400).json({msg:'Something ERROR'});
    // // SImple Validation
    if(!email || !name) return res.status(400).json({msg:'Please Enter all Fields'});
    if(name===user.name && email===user.email) return res.status(400).json({msg:'Entered Data is Same as Previous One'});
    if(!user) return res.status(400).json({msg:'User Not Exits'});
        res.json(user);
    });
    });



module.exports=router;





// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmNWM3NDRkZGViMTU1MGMzMDY2NDQ1YiIsImlhdCI6MTYwMDA4NDE1NSwiZXhwIjoxNjAwMDg3NzU1fQ.PEP_nrITJrhCSUzGHeJ4ukENo0RJ2nym6Wo4k7ecRRg",
//     "user": {
//         "id": "5f5c744ddeb1550c3066445b",
//         "email": "brahma@gmail.com",
//         "password": "$2a$10$WZrkkaQfi5oRmu1MGya7Aumh/PaRc19JM9R3AVd5jn3I/OsRsIgba"
//     }
// }

// app.post("/api/Removedata",function(req,res){   
//     model.remove({ _id: req.body.id }, function(err) {  
//                if(err){  
//                    res.send(err);  
//                }  
//                else{    
//                       res.send({data:"Record has been Deleted..!!"});             
//                   }  
//            });  
//    })  