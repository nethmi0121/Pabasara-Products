const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_name:{
        type:String,// data type 
        required:true,//validation
    },
    product_price:{
        type:Number,// data type 
        required:true,//validation
    },
    product_description:{
        type:String,// data type 
        required:true,//validation
    },
    product_image:{
        type:String,// data type 
        required:true,//validation
    },
    product_stock:{
        type:Number,// data type 
        required:true,//validation
    },
    product_date:{
        type:Date,// data type 
        required:true,//validation
    }

});

 module.exports = mongoose.model (
    "product",
    productSchema // file name 
     // funtion name 
)
