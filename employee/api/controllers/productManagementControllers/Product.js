import ProductModel from "../../models/productManagementModels/ProductModel.js";
import CategoryModel from "../../models/productManagementModels/CategoryModel.js";
import ProductCategoriesModel from "../../models/productManagementModels/ProductCategoriesModel.js";
import ProductImagesModel from "../../models/productManagementModels/ProductImagesModel.js";

export const createProduct = async (req, res) => {
    const { name, description, categories = [] } = req.body

    try {
        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required." })
        }

        // Create and save the product
        const product = new ProductModel({ name, description })
        await product.save()

        // Process categories: find category IDs from the provided category names
        const categoryIds = await Promise.all(
            categories.map(async (category) => {
                const categoryDoc = await CategoryModel.findOne({ name: category })
                if (!categoryDoc) {
                    return res.status(401).json({ message: `Category ${category} not found.` })
                }
                return categoryDoc._id
            })
        )

        // Remove any null values from categoryIds
        const validCategoryIds = categoryIds.filter(id => id !== null)
        if (validCategoryIds.length === 0) {
            return res.status(402).json({ message: "No valid categories found." })
        } else {
            // Save product-category relationships
            await Promise.all(
                validCategoryIds.map(async (categoryId) => {
                    const productCategory = new ProductCategoriesModel({
                        Product: product._id,
                        Category: categoryId
                    })
                    await productCategory.save()
                })
            )
        }

        if (!req.files || req.files.length === 0) {
            return res.status(404).json({ message: "No images provided." })
        } else {
            await Promise.all(
                req.files.map(async (file) => {
                    const productImage = new ProductImagesModel({
                        product: product._id,
                        url: `/uploads/${file.filename}`
                    })
                    await productImage.save()
                })
            )
        }

        res.status(201).json({ message: "Product created successfully!", product })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the product details
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Fetch the categories associated with the product
        const productCategories = await ProductCategoriesModel.find({ Product: id }).populate('Category');
        const categories = productCategories.map((pc) => pc.Category.name);

        // Fetch the images associated with the product
        const productImages = await ProductImagesModel.find({ product: id });
        const images = productImages.map((pi) => pi.url);

        // Combine all details into a single response
        const productDetails = {
            id: product._id,
            name: product.name,
            description: product.description,
            categories,
            images,
        };

        res.status(200).json({ message: "Product fetched successfully!", product: productDetails });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        // Fetch all products
        const products = await ProductModel.find();
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found." });
        }

        // Fetch categories and images for each product
        const productDetails = await Promise.all(
            products.map(async (product) => {
                // Fetch categories associated with the product
                const productCategories = await ProductCategoriesModel.find({ Product: product._id }).populate('Category');
                const categories = productCategories.map((pc) => pc.Category.name);

                // Fetch images associated with the product
                const productImages = await ProductImagesModel.find({ product: product._id });
                const images = productImages.map((pi) => pi.url);

                // Combine details for the product
                return {
                    id: product._id,
                    name: product.name,
                    description: product.description,
                    categories,
                    images,
                };
            })
        );

        res.status(200).json({ message: "Products fetched successfully!", products: productDetails });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id, name, description, categories = [], images = [] } = req.body;

    try {
        // Fetch the product to update
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Update product details
        if (name) product.name = name;
        if (description) product.description = description;
        await product.save();

        // Update categories
        if (categories.length > 0) {
            // Remove existing categories for the product
            await ProductCategoriesModel.deleteMany({ Product: id });

            // Add new categories
            const categoryIds = await Promise.all(
                categories.map(async (category) => {
                    const categoryDoc = await CategoryModel.findOne({ name: category });
                    if (!categoryDoc) {
                        return res.status(401).json({ message: `Category ${category} not found.` });
                    }
                    return categoryDoc._id;
                })
            );

            const validCategoryIds = categoryIds.filter((id) => id !== null);

            if (validCategoryIds.length > 0) {
                await Promise.all(
                    validCategoryIds.map(async (categoryId) => {
                        const productCategory = new ProductCategoriesModel({
                            Product: id,
                            Category: categoryId,
                        });
                        await productCategory.save();
                    })
                );
            }
        }

        // Update images
        if (images.length > 0) {
            // Remove existing images for the product
            await ProductImagesModel.deleteMany({ product: id });

            // Add new images
            await Promise.all(
                images.map(async (image) => {
                    const productImage = new ProductImagesModel({
                        product: id,
                        url: image,
                    });
                    await productImage.save();
                })
            );
        }

        // Fetch updated product details
        const updatedProduct = await ProductModel.findById(id);
        const productCategories = await ProductCategoriesModel.find({ Product: id }).populate('Category');
        const updatedCategories = productCategories.map((pc) => pc.Category.name);
        const productImages = await ProductImagesModel.find({ product: id });
        const updatedImages = productImages.map((pi) => pi.url);

        // Combine updated details into a single response
        const productDetails = {
            id: updatedProduct._id,
            name: updatedProduct.name,
            description: updatedProduct.description,
            categories: updatedCategories,
            images: updatedImages,
        };

        res.status(200).json({ message: "Product updated successfully!", product: productDetails });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.body;

    try {
        // Fetch the product to delete
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // Delete associated categories
        await ProductCategoriesModel.deleteMany({ Product: id });

        // Delete associated images
        await ProductImagesModel.deleteMany({ product: id });

        // Delete the product
        await ProductModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};