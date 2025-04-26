import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    petId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
    emp_id : {
        type: String,
        required: true,
        trim: true
    },
    name : {
        type: String,
        required: true,
        trim: true
    },
    position : {
        type: String,
        required: true,
        trim: true
    },
    u_email:{
        type: String,
        required: true,
        trim: true
    },
    p_no : {
        type: String,
        required: true,
        trim: true
    },
    address : {
        type: String,
        required: true,
        trim: true
    },
   
   
    statues: {
        type: String,
        required: true,
      
        trim: true
    },
   





    
    salary: {
        type: String,
        required: true,
      
        trim: true
    },
   
    allowances: {
        type: String,
        required: true,
      
        trim: true
    },
   
    deductions: {
        type: String,
        required: true,
      
        trim: true
    },
   
    bankAccount: {
        type: String,
        required: true,
      
        trim: true
    },
    bankName: {
        type: String,
        required: true,
      
        trim: true
    },
    bankBranch: {
        type: String,
        required: true,
      
        trim: true
    },
    payrollStatus:{
        type: String,
        required: true,
      
        trim: true
    }
   
   
  
  
}, { timestamps: true });

const Raiting = mongoose.model("EmployessNew", itemSchema);

export default Raiting;
