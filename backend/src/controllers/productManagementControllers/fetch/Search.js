import CategoryModel from "../../../models/productManagementModels/CategoryModel.js";
import ProductCategories from "../../../models/productManagementModels/ProductCategoriesModel.js";
import ProductImagesModel from "../../../models/productManagementModels/ProductImagesModel.js";
import Product from "../../../models/productManagementModels/ProductModel.js";
import SupplierModel from "../../../models/productManagementModels/SuplierModel.js";

export const searchProducts = async (req, res) => {
    try {
        const { name, categories = [] } = req.query;

        let categoryProductIds = [];

        if (categories.length > 0) {
            const categoryDocs = await CategoryModel.find({ name: { $in: categories } });

            const categoryIds = categoryDocs.map((category) => category._id);

            const productCategories = await ProductCategories.find({ Category: { $in: categoryIds } });

            categoryProductIds = productCategories.map((pc) => pc.Product);
        }

        const query = {};

        if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        if (categoryProductIds.length > 0) {
            query._id = { $in: categoryProductIds };
        }

        const products = await Product.find(query);

        const productIds = products.map((product) => product._id);
        const images = await ProductImagesModel.find({ product: { $in: productIds } });

        const productCategories = await ProductCategories.find({ Product: { $in: productIds } });

        const categoryNamesMap = {};
        await Promise.all(productCategories.map(async (pc) => {
            const category = await CategoryModel.findById(pc.Category);
            if (category) {
                if (!categoryNamesMap[pc.Product]) {
                    categoryNamesMap[pc.Product] = [];
                }
                categoryNamesMap[pc.Product].push(category.name);
            }
        }));

        const dataToSend = products.map((product) => {
            const productImages = images
                .filter((image) => image.product.toString() === product._id.toString())
                .map((image) => image.url);

            return {
                id: product._id,
                name: product.name,
                description: product.description,
                categories: categoryNamesMap[product._id] || [],
                images: productImages
            };
        });

        res.status(200).json({ products: dataToSend });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchSuppliers = async (req, res) => {
    try {
        const { name } = req.query;

        const query = {};

        // Add name filter if provided
        if (name) {
            query.name = { $regex: name, $options: "i" }; // Case-insensitive partial match
        }

        // Fetch suppliers based on the query
        const suppliers = await SupplierModel.find(query);

        // Format the response
        const dataToSend = suppliers.map((supplier) => ({
            id: supplier._id,
            name: supplier.name,
            address: supplier.address,
            contact: supplier.phoneNumber,
            email: supplier.email
        }));

        res.status(200).json({ suppliers: dataToSend });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};