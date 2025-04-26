import User from "../models/user.model.js";
import Leave from "../models/leave.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'



//item register
export const Leavestore=async(req,res,next)=>{
    const {userId,
        emp_id,
        l_type,
        s_date,
        e_date,
        reason,
   
        }=req.body;

    //create auto id for orderid
    function idGen(userId){
        const randomString=Math.random().toString(36).substring(2,10);
        const id='ORD'+randomString+userId;
        return id;
    }
    const petId=idGen(userId)
   

    const newItem=new Leave({petId,userId,
        emp_id,
        l_type,
        s_date,
        e_date,
        reason,
   
        });
    try{
        await newItem.save();
        res.status(202).json({message:"item created successfully"});
    }catch(error){
        next(error);
    }
   
}





//get items by userid
export const LeavegetOrdersByCustomerId = async (req, res, next) => {
    try{
       const customerId=req.params.id;
        const orders=await Leave.find({userId:customerId})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};


//all items
export const Leavellitems = async (req, res, next) => {
    try{
    
        const orders=await Leave.find({})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};



export const google=async(req,res,next)=>{
    try{
        const user=await User.findOne({email:req.body.email})

        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
            const {password:hashedPassword, ...rest}=user._doc;
            const expiryDate=new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(rest);
       
        }else{
            const generatedPassword=
            Math.random().toString(36).slice(-8)+
            Math.random().toString(36).slice(-8)

            const hashedPassword=bcryptjs.hashSync
            (generatedPassword,10);

            const newUser=new User({username:req.body.name.split(' ').join('').toLowerCase()+
                Math.random().toString(36).slice(-8),
                email:req.body.email,password:hashedPassword,profilePicture:req.body.photo,
            });
            await newUser.save();
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:hashedPassword2, ...rest}=newUser._doc;
            const expiryDate=new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(rest);


        }
    }catch(error){
        next(error)
    }
}


 // Adjust the path as needed
//images
export const google1 = async (req, res, next) => {
    try {
        const user = await Item.findOne({ email: req.body.itemId });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                .status(200)
                .json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new Item({
                username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
                email: req.body.itemId,
                password: hashedPassword,
                profilePicture: req.body.photo
            });
            
            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};




