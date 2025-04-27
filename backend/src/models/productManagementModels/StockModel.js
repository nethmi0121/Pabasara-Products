import mongoose from "mongoose"

const stockSchema = new mongoose.Schema({
    Supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }
})

const StockModel = mongoose.model('Stock', stockSchema)
export default StockModel