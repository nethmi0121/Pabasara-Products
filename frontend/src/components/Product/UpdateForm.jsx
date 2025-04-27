import { useState, useEffect } from 'react';
import { ImagePlus, X, CandyCane } from 'lucide-react';

const UpdateForm = ({ product, onUpdate, onClose }) => {
  const [productName, setProductName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState(product.images);

<<<<<<< HEAD
  // NEW: State for input field error messages
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

=======
>>>>>>> 5fb6f9f (Initial commit)
  useEffect(() => {
    setProductName(product.name);
    setCategory(product.category);
    setDescription(product.description);
    setPreviewImages(product.images);
    setImages([]);
  }, [product]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewImages.length > 5) {
      alert('You can upload maximum 5 images');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviewImages = [
      ...previewImages,
      ...newImages.map((file) => URL.createObjectURL(file)),
    ];
    setPreviewImages(newPreviewImages);
  };

  const removeImage = (index) => {
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);

    if (index >= product.images.length) {
      const newImages = [...images];
      newImages.splice(index - product.images.length, 1);
      setImages(newImages);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!productName || !category || !description) {
      alert('Please fill all required fields');
      return;
    }

    const updatedProduct = {
      ...product,
      name: productName,
      category,
      description,
      images: previewImages,
    };

    onUpdate(updatedProduct);
  };

  return (
    <div className="fixed inset-0 bg-[#00000095] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-orange-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 border-b border-orange-100 pb-2">
            <h2 className="text-xl font-semibold text-orange-600 flex items-center gap-2">
              <CandyCane className="w-5 h-5" />
              Update Product
            </h2>
            <button
              onClick={onClose}
              className="text-orange-500 hover:text-orange-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
<<<<<<< HEAD
                onInput={(e) => setNameError(e.target.validationMessage)}
                className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
              {/* NEW: Display error message in red when typing */}
              {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
=======
                className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
>>>>>>> 5fb6f9f (Initial commit)
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="Cakes">Cakes</option>
                <option value="Cupcakes">Cupcakes</option>
                <option value="Cookies">Cookies</option>
                <option value="Chocolates">Chocolates</option>
                <option value="Ice Cream">Ice Cream</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
<<<<<<< HEAD
                onInput={(e) => setDescriptionError(e.target.validationMessage)}
=======
>>>>>>> 5fb6f9f (Initial commit)
                className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows="3"
                required
              />
<<<<<<< HEAD
              {/* NEW: Display error message in red when typing */}
              {descriptionError && <p className="mt-1 text-sm text-red-500">{descriptionError}</p>}
=======
>>>>>>> 5fb6f9f (Initial commit)
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-700 mb-1">
                Product Images (Max 5)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImagePlus className="w-8 h-8 text-orange-500" />
                    <p className="text-sm text-orange-500 mt-2">
                      Click to upload additional images
                    </p>
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

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-orange-300 text-orange-700 rounded-md hover:bg-orange-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default UpdateForm;
=======
export default UpdateForm;
>>>>>>> 5fb6f9f (Initial commit)
