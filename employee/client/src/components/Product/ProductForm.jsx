import { useState, useEffect } from 'react'
import { ImagePlus, X, Plus } from 'lucide-react'
import axios from 'axios'

const ProductForm = ({ onSubmit }) => {
    const [productName, setProductName] = useState('')
    const [categories, setCategories] = useState([])
    const [description, setDescription] = useState('')
    const [images, setImages] = useState([])
    const [previewImages, setPreviewImages] = useState([])

    // For category autocomplete
    const [availableCategories, setAvailableCategories] = useState([])
    const [categoryInput, setCategoryInput] = useState('')
    const [filteredCategories, setFilteredCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // State for input field error messages
    const [nameError, setNameError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')

    // Fetch categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await axios.get('/api/product-management/category')
                // Handle the API response format - extract category names from objects
                if (Array.isArray(response.data)) {
                    const categoryNames = response.data.map((category) => category.name)
                    setAvailableCategories(categoryNames)
                } else {
                    setError('Unexpected response format from API')
                }
            } catch (err) {
                setError('Failed to fetch categories. Please try again later.')
                console.error('Error fetching categories:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    // Filter categories based on input
    useEffect(() => {
        if (!availableCategories || !Array.isArray(availableCategories)) {
            setFilteredCategories([])
            return
        }

        if (categoryInput.trim() === '') {
            setFilteredCategories([])
            return
        }

        const filtered = availableCategories.filter((category) =>
            category.toLowerCase().includes(categoryInput.toLowerCase())
        )
        setFilteredCategories(filtered)
    }, [categoryInput, availableCategories])

    const handleNameChange = (e) => {
        const value = e.target.value
        // Only allow letters, spaces, and basic punctuation
        if (/^[a-zA-Z\s.,'\-]*$/.test(value)) {
            setProductName(value)
        }
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length + images.length > 5) {
            alert('You can upload maximum 5 images')
            return
        }

        const newImages = [...images, ...files]
        setImages(newImages)

        const newPreviewImages = newImages.map((file) => URL.createObjectURL(file))
        setPreviewImages(newPreviewImages)
    }

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index)
        const newPreviewImages = previewImages.filter((_, i) => i !== index)
        setImages(newImages)
        setPreviewImages(newPreviewImages)
    }

    const handleCategorySelect = (category) => {
        if (!categories.includes(category)) {
            setCategories([...categories, category])
        }
        setCategoryInput('')
    }

    const removeCategory = (category) => {
        setCategories(categories.filter((cat) => cat !== category))
    }

    const addCustomCategory = async () => {
        const newCats = categoryInput
            .split(',')
            .map((cat) => cat.trim())
            .filter((cat) => cat !== '')
        let newCategoriesToAdd = []
        for (const cat of newCats) {
            if (!categories.includes(cat)) {
                // If the category is not in the suggestions, add it via backend
                if (!availableCategories.includes(cat)) {
                    try {
                        await axios.post('/api/product-management/category', { name: cat })
                        console.log('New category created:', cat)
                    } catch (err) {
                        console.error('Error creating new category:', err)
                    }
                }
                newCategoriesToAdd.push(cat)
            }
        }
        if (newCategoriesToAdd.length) {
            setCategories([...categories, ...newCategoriesToAdd])
        }
        setCategoryInput('')
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()
        // Basic validations...

        const formData = new FormData()
        formData.append('name', productName)
        formData.append('description', description)
        categories.forEach((category) => formData.append('categories[]', category))
        images.forEach((file) => formData.append('images', file))

        axios
            .post('/api/product-management/product', formData)
            .then((response) => {
                console.log('Data posted successfully', response.data)
            })
            .catch((error) => {
                console.error('Error posting data', error)
            })

        onSubmit({ name: productName, description, categories, images: previewImages })
        resetForm()
    }

    const resetForm = () => {
        setProductName('')
        setCategories([])
        setDescription('')
        setImages([])
        setPreviewImages([])
        setCategoryInput('')
    }

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={productName}
                    onChange={handleNameChange}
                    onInput={(e) => setNameError(e.target.validationMessage)}
                    className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="e.g., Chocolate Cupcake"
                    required
                    pattern="[a-zA-Z\s.,'\-]+"
                    title="Only letters, spaces, and basic punctuation allowed"
                />
                <p className="mt-1 text-sm text-gray-500">
                    Only letters, spaces, and basic punctuation (.,'-) allowed
                </p>
                {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                    Categories <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                    <div className="flex">
                        <input
                            type="text"
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            className="w-full px-3 py-2 border border-amber-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Search or add category..."
                        />
                        <button
                            type="button"
                            onClick={addCustomCategory}
                            className="bg-amber-500 text-white px-3 py-2 rounded-r-md hover:bg-amber-600"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {isLoading && <div className="mt-1 text-sm text-amber-600">Loading categories...</div>}

                    {error && <div className="mt-1 text-sm text-red-500">{error}</div>}

                    {filteredCategories.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-amber-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredCategories.map((category) => (
                                <div
                                    key={category}
                                    className="px-3 py-2 hover:bg-amber-100 cursor-pointer"
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <div key={category} className="flex items-center bg-amber-100 px-2 py-1 rounded-md">
                                <span className="text-sm text-amber-700">{category}</span>
                                <button
                                    type="button"
                                    onClick={() => removeCategory(category)}
                                    className="ml-1 text-amber-500 hover:text-amber-700"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-amber-700 mb-1">
                    Description <span className="text-orange-500">*</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onInput={(e) => setDescriptionError(e.target.validationMessage)}
                    className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    rows="3"
                    placeholder="Describe your sweet product..."
                    required
                />
                {descriptionError && <p className="mt-1 text-sm text-red-500">{descriptionError}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-orange-700 mb-1">
                    Product Images (Max 5)
                </label>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImagePlus className="w-8 h-8 text-amber-500" />
                            <p className="text-sm text-amber-500 mt-2">Click to upload images</p>
                        </div>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {previewImages.length > 0 && (
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            {previewImages.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img}
                                        alt={`Preview ${index}`}
                                        className="h-20 w-20 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200"
                >
                    Add Product
                </button>
            </div>
        </form>
    )
}

export default ProductForm