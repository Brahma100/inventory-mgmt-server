const express =require('express');
const router =express.Router();
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken')
// User Model

const User=require('../../models/User');

//@route POST api/usesr
//@desc Get All usesr
// @access Public

router.post('/',(req,res)=>{
    // res.send()
    const { name, email, password }=req.body;
    // // SImple Validation
    if(!name || !email || !password) return res.status(400).json({msg:'Please Enter all Fields'});
            // // Check for user Exits or not 
        User.findOne({email})
        .then(user=>{
            if(user) return res.status(400).json({msg:'User Already Exits'});
            const newUser=new User({
                name,email,password
            });
            
            // Create salt & hash
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password=hash;
                    newUser.save()
                    .then(user=>{
                    
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
                    });
                });
            });


            });

    });

module.exports=router;