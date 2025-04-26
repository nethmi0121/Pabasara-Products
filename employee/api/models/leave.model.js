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
    l_type : {
        type: String,
        required: true,
        trim: true
    },
    s_date : {
        type: String,
        required: true,
        trim: true
    },
    e_date:{
        type: String,
        required: true,
        trim: true
    },
    reason : {
        type: String,
        required: true,
        trim: true
    },
    
   
  
  
}, { timestamps: true });

const Leave = mongoose.model("Leave", itemSchema);

export default Leave;
