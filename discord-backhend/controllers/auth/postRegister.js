const User= require('../../models/user');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');


const postRegister=async (req,res) =>{
    try{
 const {username,mail,password}=req.body;
        // check if user exist
        const userExist= await User.exists({mail:mail.toLowerCase()});

        if (userExist) {
           return res.status(409).send("Email already im use") 
        }

        // encrypt password
        const encryptedPassword= await bcrypt.hash(password,10)
        // create user document and in save
        const user= await await User.create({
            username,
            mail:mail.toLowerCase(),
           password: encryptedPassword
        })

        // create JWT token 
        const token=jwt.sign({
            userId:user._id,
            mail
        },
        process.env.TOKEN_KEY,
        {
            expiresIn: '24h'
        }
        );

      return    res.status(201).json({
            userDetails:{
              mail:user.mail,
              token:token,
               username:user.username 
            }
        })
    }catch(err){
        return res.status(500).send("Error occured.please try again")
    }
};

module.exports=postRegister;


