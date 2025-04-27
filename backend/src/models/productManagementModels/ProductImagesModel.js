import mongoose from "mongoose"

const productImagesSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        req: true
    },
    url: {
        type: String,
        required: true
    }
})

const ProductImagesModel = mongoose.model('ProductImages', productImagesSchema)
export default ProductImagesModel