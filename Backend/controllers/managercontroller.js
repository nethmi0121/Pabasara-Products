const express = require("express");
const manager = require("../model/managermodel.js");


// data display
const getAllmanager = async (req,res,next)=>{

let managers;
// get all manager
try{
    managers = await manager.find();

}catch (err){
    console.log(err) 
    return res.status(500).json({ message: "Server error" });
}
// not found 
if(managers.length === 0){
    return res.status (404).json({message:"manager not found"});
}

// display all managers 
return res.status(200).json({managers});

};

// data insert 
const addproduct = async(req,res,next)=>{
   
    product_stock:{
        const {product_name,product_price,product_description,product_image,product_stock,product_date}= req.body;

        let products;
    try {
        products = new manager({product_name, product_price, product_description, product_image, product_stock, product_date});
        await products.save();
    } catch (err) {
        console.log(err);
}

    // don't return    
    if(!products){
        return res.status(500).json({message: "Unable to add manager"})
    } 
    return res.status(201).json({ products });

}};

//Get  by id 
const getById = async (req,res,next)=>{
    const id = req.params.id;

    let product;
    try {
        product = await manager.findById(id);
    }catch (err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
// not available products
if(!product){
    return res.status(404).json({message: "not available products"})
} 
return res.status(201).json({ product });

}

// update product details
const updateproduct = async (req,res,next)=>{

    const id = req.params.id;
    const {product_name,product_price,product_description,product_image,product_stock,product_date}= req.body;

    let products;

    try{
        products = await manager.findByIdAndUpdate(id,
            {product_name:product_name,product_price:product_price,product_description:product_description,product_image:product_image,product_stock:product_stock,product_date:product_date}
        );
         products = await manager.save();
        
    }catch(err)
    {
        console.log(err);
    }
   
// not update products
if(!products){
    return res.status(404).json({message: "unable to update product details products"})
} 
return res.status(201).json({ products });

};

// delete productSchema

const deleteproducts = async(req,res,next)=>{
    const id = req.params.id;

    let product;
    try{
        product = await manager.findByIdAndDelete(id)
    }catch(err)
   {
        console.log(err);
   }
   // not delete products
   if(!product){
    return res.status(404).json({message: "unable to delete product details product"})
} 
return res.status(200).json({ message: "Product deleted successfully", product });


};







exports.getAllmanager= getAllmanager;
exports.addproduct = addproduct;
exports.getById = getById;
exports.updateproduct = updateproduct;
exports.deleteproducts=deleteproducts;