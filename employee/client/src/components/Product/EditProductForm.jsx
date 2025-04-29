import { useState, useEffect, useRef } from 'react'
import { X, Plus, Camera, Tag, Edit3 } from 'lucide-react'
import axios from 'axios'

const EditProductForm = ({ product, onSubmit, onClose }) => {
    // Initialize state with the product details
    const [productName, setProductName] = useState(product.name || '')
    const [selectedCategories, setSelectedCategories] = useState([])
    const [description, setDescription] = useState(product.description || '')
    const [images, setImages] = useState([])
    const [previewImages, setPreviewImages] = useState([])
    const [price, setPrice] = useState(product.price || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)
    const [nameError, setNameError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')

    // For category suggestions
    const [allCategories, setAllCategories] = useState([])
    const [categoryInput, setCategoryInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [filteredCategories, setFilteredCategories] = useState([])

    const suggestionsRef = useRef(null)

    // Fetch all categories when component mounts
    useEffect(() => {
        axios
            .get('http://localhost:5000/api/product-management/category')
            .then((response) => {
                if (response.data && Array.isArray(response.data)) {
                    setAllCategories(response.data)
                }
            })
            .catch((error) => {
                console.error('Error fetching categories:', error)
            })
    }, [])

    // Initialize selected categories and images when product changes
    useEffect(() => {
        // Handle categories conversion from array of strings to objects
        if (product.categories && Array.isArray(product.categories)) {
            const categoryObjects = product.categories.map((catName) => {
                // Find matching category object from allCategories if possible
                const matchingCat = allCategories.find((c) => c.name === catName)
                if (matchingCat) return matchingCat
                // If not found, create a temporary object with the name
                return { _id: catName, name: catName }
            })
            setSelectedCategories(categoryObjects)
        }

        // Handle images
        if (product.images && Array.isArray(product.images)) {
            const imageUrls = product.images.map((img) =>
                img.startsWith('http') ? img : `http://localhost:5000${img}`
            )
            setPreviewImages(imageUrls)
        }
    }, [product, allCategories])

    // Filter categories based on input
    useEffect(() => {
        if (categoryInput) {
            const filtered = allCategories.filter(
                (category) =>
                    category.name.toLowerCase().includes(categoryInput.toLowerCase()) &&
                    !selectedCategories.some((selected) => selected._id === category._id)
            )
            setFilteredCategories(filtered)
            setShowSuggestions(filtered.length > 0)
        } else {
            setShowSuggestions(false)
        }
    }, [categoryInput, allCategories, selectedCategories])

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleNameChange = (e) => {
        const newValue = e.target.value
        // Allow only letters and spaces; disallow numbers and special characters
        if (/^[A-Za-z\s]*$/.test(newValue)) {
            setProductName(newValue)
        }
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const handlePriceChange = (e) => {
        setPrice(e.target.value)
    }

    const handleCategoryInputChange = (e) => {
        setCategoryInput(e.target.value)
        setShowSuggestions(true)
    }

    const handleSelectCategory = (category) => {
        if (!selectedCategories.some((cat) => cat._id === category._id)) {
            setSelectedCategories([...selectedCategories, category])
        }
        setCategoryInput('')
        setShowSuggestions(false)
    }

    const handleRemoveCategory = (categoryId) => {
        setSelectedCategories(selectedCategories.filter((cat) => cat._id !== categoryId))
    }

    const handleImageChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)

            // Create preview URLs for the new files
            const newPreviewURLs = newFiles.map((file) => URL.createObjectURL(file))

            setImages([...images, ...newFiles])
            setPreviewImages([...previewImages, ...newPreviewURLs])
        }
    }

    const handleRemoveImage = (index) => {
        const updatedImages = [...images]
        const updatedPreviews = [...previewImages]

        updatedImages.splice(index, 1)
        updatedPreviews.splice(index, 1)

        setImages(updatedImages)
        setPreviewImages(updatedPreviews)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const imageFilenames = previewImages.map((url) => {
                if (url.includes('/uploads/')) {
                    return url.split('/uploads/')[1]
                } else if (url.startsWith('blob:')) {
                    // Extracts the portion after the last slash from the blob URL
                    return url.split('/').pop()
                }
                return url
            })

            const updatedProduct = {
                id: product.id,
                name: productName,
                description,
                categories: selectedCategories.map((cat) => cat.name),
                images: imageFilenames,
            }

            console.log(imageFilenames)

            // Send update request to backend
            const response = await axios.put(
                'http://localhost:5000/api/product-management/product',
                updatedProduct
            )

            if (response.status === 200) {
                // Call the onSubmit callback with the updated product from response
                onSubmit(response.data.product)
                onClose()
            }
        } catch (error) {
            console.error('Error updating product:', error)
            setError(error.response?.data?.message || 'Failed to update product')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white rounded-lg overflow-hidden w-full">
            {/* Product Image Gallery */}
            <div className="relative bg-amber-50 p-4">
                <button
                    onClick={onClose}
                    type="button"
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-1 shadow-md text-amber-500 hover:text-amber-700"
                >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-amber-800 mb-4">Edit Product</h2>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    {previewImages.map((image, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
                            <img
                                src={image}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="p-1 bg-red-500 rounded-full"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <label className="border-2 border-dashed border-amber-300 rounded-lg flex items-center justify-center cursor-pointer aspect-square hover:bg-amber-100 transition-colors">
                        <div className="flex flex-col items-center">
                            <Camera className="w-8 h-8 text-amber-400" />
                            <span className="text-xs text-amber-600 mt-1">Add Image</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Product ID (non-editable) */}
                <div>
                    <label className="block text-sm font-medium text-amber-700 mb-1">Product ID</label>
                    <input
                        type="text"
                        value={product.id}
                        className="w-full px-3 py-2 bg-gray-100 border border-amber-200 rounded-md"
                        disabled
                    />
                </div>

                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-amber-700 mb-1">Product Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={productName}
                            onChange={handleNameChange}
                            onInput={(e) => setNameError(e.target.validationMessage)}
                            onInvalid={(e) => {
                                e.preventDefault()
                                setNameError(e.target.validationMessage)
                            }}
                            className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                            placeholder="Enter product name"
                        />
                        <Edit3 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
                    </div>
                    {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
                </div>

                {/* Categories */}
                <div>
                    <label className="block text-sm font-medium text-amber-700 mb-1">Categories</label>
                    <div className="relative" ref={suggestionsRef}>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {selectedCategories.map((category) => (
                                <div
                                    key={category._id}
                                    className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-sm flex items-center"
                                >
                                    <span>{category.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCategory(category._id)}
                                        className="ml-1 text-amber-600 hover:text-amber-800"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={categoryInput}
                                onChange={handleCategoryInputChange}
                                placeholder="Type to search categories"
                                className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
                        </div>

                        {showSuggestions && (
                            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-amber-200 rounded-md shadow-lg">
                                {filteredCategories.map((category) => (
                                    <div
                                        key={category._id}
                                        className="px-3 py-2 hover:bg-amber-50 cursor-pointer"
                                        onClick={() => handleSelectCategory(category)}
                                    >
                                        {category.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-amber-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={handleDescriptionChange}
                        onInput={(e) => setDescriptionError(e.target.validationMessage)}
                        onInvalid={(e) => {
                            e.preventDefault()
                            setDescriptionError(e.target.validationMessage)
                        }}
                        className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows="3"
                        required
                        placeholder="Describe your product"
                    />
                    {descriptionError && <p className="mt-1 text-sm text-red-500">{descriptionError}</p>}
                </div>

                {/* Error message display */}
                {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-md transition-all duration-300 ${
                            isSubmitting
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500'
                        }`}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditProductForm