import CategoryModel from "../../models/productManagementModels/CategoryModel.js"

export const createCategory = async (req, res) => {
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: "Category name is required." });
        }

        const category = new CategoryModel({ name });
        await category.save();

        return res.status(201).json({ message: "Category created successfully." });
    } catch (error) {
        return res.status(500).json({ message: `Error creating category: ${error.message}` });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params

        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(400).json({ message: "Category not found." });
        }

        const categoryDataToSent = {
            id: category._id,
            name: category.name,
        }

        return res.status(200).json({ category: categoryDataToSent });
    } catch (error) {
        return res.status(500).json({ message: `Error fetching category: ${error.message}` });
    }
}

export const getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find()
        if (!categories) {
            return res.status(400).json({ message: "No categories found." });
        }

        return res.status(200).json(categories)
    } catch (error) {
        return res.status(500).json({ message: `Error fetching categories: ${error.message}` });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id, name } = req.body

        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(400).json({ message: "Category not found." });
        }

        category.name = name || category.name
        await category.save()

        return res.status(200).json({ message: "Category updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: `Error updating category: ${error.message}` });
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body

        const category = await CategoryModel.findById(id)
        if (!category) {
            return res.status(400).json({ message: "Category not found." });
        }

        await category.remove()

        return res.status(200).json({ message: "Category deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: `Error deleting category: ${error.message}` });
    }
}