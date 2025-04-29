import mongoose from "mongoose"

const stockProductsSellingPricesSchema = mongoose.Schema({
    stockProducts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StockProducts',
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    }
})

const StockProductsSellingPrices = mongoose.model('StockProductsSellingPrices', stockProductsSellingPricesSchema)
export default StockProductsSellingPrices