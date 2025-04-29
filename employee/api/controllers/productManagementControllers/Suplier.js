import SupplierModel from "../../models/productManagementModels/SuplierModel.js"

export const createSupplier = async (req, res) => {
    try {
        const { name, address, phoneNumber, email } = req.body
        if (!name || !address || !phoneNumber || !email) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const supplier = new SupplierModel({ name, address, phoneNumber, email })
        await supplier.save()
        res.status(201).json({ message: "Supplier created successfully", supplier })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getSuplierById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Supplier ID is required" })
        }
        const supplier = await SupplierModel.findById(req.params.id)
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" })
        }
        res.status(200).json(supplier)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await SupplierModel.find()
        if (!suppliers || suppliers.length === 0) {
            return res.status(404).json({ message: "No suppliers found" })
        }
        res.status(200).json(suppliers)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateSupplier = async (req, res) => {
    try {
        const { id, name, address, phoneNumber, email } = req.body
        const supplier = await SupplierModel.findByIdAndUpdate(id, { name, address, phoneNumber, email }, { new: true })
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" })
        }
        res.status(200).json({ message: "Supplier updated successfully", supplier })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteSupplier = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(400).json({ message: "Supplier ID is required" })
        }
        const supplier = await SupplierModel.findByIdAndDelete(req.body.id)
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" })
        }
        res.status(200).json({ message: "Supplier deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}