import mongoose from "mongoose"

const productCategoriesSchema = new mongoose.Schema({
    Product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
})

const ProductCategories = mongoose.model('ProductCategories', productCategoriesSchema)
export default ProductCategories