import mongoose from "mongoose"
import StockModel from "../../models/productManagementModels/StockModel.js";
import StockProducts from "../../models/productManagementModels/StockProductsModel.js";
import StockProductsSellingPrices from "../../models/productManagementModels/StockProductsSellingPricesModel.js";

export const createStock = async (req, res) => {
    try {
        const { products = [], supplierId } = req.body;

        if (!supplierId || products.length === 0) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const stock = new StockModel({ Supplier: supplierId });
        await stock.save();

        const stockProductsPromises = products.map(async (product) => {
            const stockProductData = {
                product: product.id,
                stock: stock._id,
                quantity: Number(product.quantity),
                price: Number(product.price),
                manufactureDate: new Date(product.manufactureDate),
                expirationDate: new Date(product.expirationDate),
                starRatings: 0,
                textReview: product.textReview || null,
                customer: product.customer || null
            };

            const stockProductDoc = new StockProducts(stockProductData);
            const savedStockProduct = await stockProductDoc.save();

            const sellingPriceData = {
                stockProducts: savedStockProduct._id,
                sellingPrice: Number(product.sellingPrice) || 0
            };

            const stockProductSellingPriceDoc = new StockProductsSellingPrices(sellingPriceData);
            await stockProductSellingPriceDoc.save();

            return savedStockProduct;
        });

        await Promise.all(stockProductsPromises);

        return res.status(201).json({ message: "Stock created successfully", stock });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const getStockById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the stock details
        const stock = await StockModel.findById(id);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found." });
        }

        // Fetch the products associated with the stock
        const stockProducts = await StockProducts.find({ stock: id });

        // Fetch selling prices for each stock product
        const stockProductsDetails = await Promise.all(
            stockProducts.map(async (stockProduct) => {
                const sellingPriceDoc = await StockProductsSellingPrices.findOne({ stockProducts: stockProduct._id });
                return {
                    id: stockProduct._id,
                    product: stockProduct.product,
                    quantity: stockProduct.quantity,
                    price: stockProduct.price,
                    manufactureDate: stockProduct.manufactureDate,
                    expirationDate: stockProduct.expirationDate,
                    sellingPrice: sellingPriceDoc ? sellingPriceDoc.sellingPrice : null,
                };
            })
        );

        // Combine all details into a single response
        const stockDetails = {
            id: stock._id,
            supplierId: stock.Supplier,
            products: stockProductsDetails,
        };

        res.status(200).json({ message: "Stock fetched successfully!", stock: stockDetails });
    } catch (error) {
        console.error("Error fetching stock:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getAllStocks = async (req, res) => {
    try {
        // Fetch all stocks
        const stocks = await StockModel.find();
        if (stocks.length === 0) {
            return res.status(404).json({ message: "No stocks found." });
        }

        // Fetch products and selling prices for each stock
        const allStockDetails = await Promise.all(
            stocks.map(async (stock) => {
                // Fetch the products associated with the stock
                const stockProducts = await StockProducts.find({ stock: stock._id });

                // Fetch selling prices for each stock product
                const stockProductsDetails = await Promise.all(
                    stockProducts.map(async (stockProduct) => {
                        const sellingPriceDoc = await StockProductsSellingPrices.findOne({ stockProducts: stockProduct._id });
                        return {
                            id: stockProduct._id,
                            product: stockProduct.product,
                            quantity: stockProduct.quantity,
                            price: stockProduct.price,
                            manufactureDate: stockProduct.manufactureDate,
                            expirationDate: stockProduct.expirationDate,
                            sellingPrice: sellingPriceDoc ? sellingPriceDoc.sellingPrice : null,
                        };
                    })
                );

                // Combine details for the stock
                return {
                    id: stock._id,
                    supplierId: stock.Supplier,
                    products: stockProductsDetails,
                };
            })
        );

        res.status(200).json({ message: "Stocks fetched successfully!", stocks: allStockDetails });
    } catch (error) {
        console.error("Error fetching stocks:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const updateStock = async (req, res) => {
    const { id, products = [], supplierId } = req.body;

    try {
        // Fetch the stock to update
        const stock = await StockModel.findById(id);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found." });
        }

        // Update supplier ID if provided
        if (supplierId) {
            stock.Supplier = supplierId;
            await stock.save();
        }

        // Update stock products if provided
        if (products.length > 0) {
            for (const product of products) {
                if (!product.id) {
                    return res.status(400).json({ message: "Product ID is required." });
                }

                const existingStockProduct = await StockProducts.findOne({ _id: product.id, stock: id });

                if (existingStockProduct) {
                    // ✅ Update existing stock product
                    existingStockProduct.quantity = Number(product.quantity) || existingStockProduct.quantity;
                    existingStockProduct.price = Number(product.price) || existingStockProduct.price;
                    existingStockProduct.manufactureDate = product.manufactureDate ? new Date(product.manufactureDate) : existingStockProduct.manufactureDate;
                    existingStockProduct.expirationDate = product.expirationDate ? new Date(product.expirationDate) : existingStockProduct.expirationDate;

                    await existingStockProduct.save();

                    // ✅ Update or insert selling price
                    const existingSellingPrice = await StockProductsSellingPrices.findOne({ stockProducts: existingStockProduct._id });

                    if (existingSellingPrice) {
                        existingSellingPrice.sellingPrice = Number(product.sellingPrice);
                        await existingSellingPrice.save();
                    } else {
                        // If no existing selling price, create one
                        const newSellingPrice = new StockProductsSellingPrices({
                            stockProducts: existingStockProduct._id,
                            sellingPrice: Number(product.sellingPrice)
                        });
                        await newSellingPrice.save();
                    }
                } else {
                    return res.status(404).json({ message: `Stock product ${product.id} not found for stock ${id}.` });
                }
            }
        }

        // Fetch updated stock details
        const updatedStockProducts = await StockProducts.find({ stock: id });
        const updatedStockProductsDetails = await Promise.all(
            updatedStockProducts.map(async (stockProduct) => {
                const sellingPriceDoc = await StockProductsSellingPrices.findOne({ stockProducts: stockProduct._id });
                return {
                    id: stockProduct._id,
                    product: stockProduct.product,
                    quantity: stockProduct.quantity,
                    price: stockProduct.price,
                    manufactureDate: stockProduct.manufactureDate,
                    expirationDate: stockProduct.expirationDate,
                    sellingPrice: sellingPriceDoc ? sellingPriceDoc.sellingPrice : null
                };
            })
        );

        // Combine updated details into a single response
        const updatedStockDetails = {
            id: stock._id,
            supplierId: stock.Supplier,
            products: updatedStockProductsDetails
        };

        return res.status(200).json({ message: "Stock updated successfully!", stock: updatedStockDetails });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const addProductsToStock = async (req, res) => {
    const { stockId, products = [] } = req.body;

    try {
        // Validate input
        if (!stockId || products.length === 0) {
            return res.status(400).json({ message: "Stock ID and products are required." });
        }

        // Check if the stock exists
        const stock = await StockModel.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found." });
        }

        // Add products to StockProducts and store selling prices
        const stockProductsPromises = products.map(async (product) => {
            const stockProductData = {
                product: product.id,
                stock: stock._id,
                quantity: Number(product.quantity),
                price: Number(product.price),
                manufactureDate: new Date(product.manufactureDate),
                expirationDate: new Date(product.expirationDate),
                starRatings: 0,
                textReview: product.textReview || null,
                customer: product.customer || null
            };

            const stockProductDoc = new StockProducts(stockProductData);
            const savedStockProduct = await stockProductDoc.save();

            // Use product.sellingPrice instead of stockProductData.sellingPrice
            const sellingPriceData = {
                stockProducts: savedStockProduct._id,
                sellingPrice: Number(product.sellingPrice) || 0  // ✅ Fix here
            };

            const stockProductSellingPriceDoc = new StockProductsSellingPrices(sellingPriceData);
            await stockProductSellingPriceDoc.save();

            return savedStockProduct;
        });

        const addedProducts = await Promise.all(stockProductsPromises);

        return res.status(201).json({
            message: "Products added successfully to stock.",
            addedProducts
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


export const removeProductsFromStock = async (req, res) => {
    const { stockId, productIds = [] } = req.body;

    try {
        // Validate input
        if (!stockId || productIds.length === 0) {
            return res.status(400).json({ message: "Stock ID and at least one product ID are required." });
        }

        // Check if the stock exists
        const stock = await StockModel.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found." });
        }

        // Find products to remove
        const errors = [];
        const removedProductIds = [];

        for (let productId of productIds) {
            if (!productId) {
                errors.push("Invalid product ID.");
                continue;
            }

            const product = await StockProducts.findOne({
                product: productId,
                stock: stockId
            });

            if (!product) {
                errors.push(`Product with ID ${productId} not found in this stock.`);
                continue;
            }

            // Remove the product
            await StockProducts.findByIdAndDelete(product._id);

            // Optionally delete associated selling price data
            await StockProductsSellingPrices.deleteMany({ stockProducts: product._id });

            removedProductIds.push(productId);
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: "Some products could not be removed.", errors, removedProductIds });
        }

        return res.status(200).json({
            message: "Products removed successfully from stock.",
            removedProductIds
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};




export const deleteStock = async (req, res) => {
    const { id } = req.body;

    try {
        // Fetch the stock to delete
        const stock = await StockModel.findById(id);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found." });
        }

        // Remove associated stock products
        const stockProducts = await StockProducts.find({ stock: id });
        const stockProductIds = stockProducts.map((stockProduct) => stockProduct._id);

        await StockProducts.deleteMany({ stock: id });

        // Remove associated selling prices
        await StockProductsSellingPrices.deleteMany({ stockProducts: { $in: stockProductIds } });

        // Delete the stock
        await StockModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Stock deleted successfully!" });
    } catch (error) {
        console.error("Error deleting stock:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};