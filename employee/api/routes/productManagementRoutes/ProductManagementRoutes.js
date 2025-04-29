import axios from 'axios'
import express from 'express'
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../../controllers/productManagementControllers/Category.js'
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../../controllers/productManagementControllers/Product.js'
import { createSupplier, getSuplierById, getAllSuppliers, updateSupplier, deleteSupplier } from '../../controllers/productManagementControllers/Suplier.js'
import { createStock, getStockById, getAllStocks, updateStock, deleteStock, removeProductsFromStock, addProductsToStock } from '../../controllers/productManagementControllers/Stock.js'
import { searchProducts, searchSuppliers } from '../../controllers/productManagementControllers/fetch/Search.js'
import generateStockSummaryReport from '../../controllers/productManagementControllers/reports/StockSummeryReport.js'
import GenerateSupplierStockReport from '../../controllers/productManagementControllers/reports/SuppliesSummeryReport.js'

import upload from '../../controllers/middleware/upload.js'

const router = express.Router()

//Category routes
router.post('/category', createCategory)
router.get('/category/:id', getCategoryById)
router.get('/category', getAllCategories)
router.put('/category', updateCategory)
router.delete('/category', deleteCategory)

//Product routes
router.post('/product', upload.array('images', 5), createProduct)
router.get('/product/:id', getProductById)
router.get('/product', getAllProducts)
router.put('/product', upload.array('images', 5), updateProduct)
router.delete('/product', deleteProduct)

//Supplier routes
router.post('/supplier', createSupplier)
router.get('/supplier/:id', getSuplierById)
router.get('/supplier', getAllSuppliers)
router.put('/supplier', updateSupplier)
router.delete('/supplier', deleteSupplier)

//Stock routes
router.post('/stock', createStock)
router.get('/stock/:id', getStockById)
router.get('/stock', getAllStocks)
router.put('/stock', updateStock)
router.delete('/stock', deleteStock)
router.post('/stock/product', addProductsToStock)
router.delete('/stock/product', removeProductsFromStock)

//Search query routes
router.get('/q/product', searchProducts)
router.get('/q/supplier', searchSuppliers)

//Report routes
router.get('/report/stock-summary', generateStockSummaryReport)
router.get('/report/supplier-stock', GenerateSupplierStockReport)

export default router