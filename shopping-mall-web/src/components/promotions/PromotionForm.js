import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const PromotionForm = ({ isOpen, onClose, editingPromotion }) => {
  const { addPromotion, updatePromotion } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    discount: '',
    duration: '',
    bannerImage: null,  // Initialize with null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editingPromotion) {
      setFormData({
        ...editingPromotion,
      });
      if (editingPromotion.bannerImage && typeof editingPromotion.bannerImage === 'string') {
        // Set the image URL directly if it's a string (existing image URL)
        setImagePreview(editingPromotion.bannerImage);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ name: '', discount: '', duration: '', bannerImage: null });
      setImagePreview(null);
    }
  }, [editingPromotion]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'bannerImage' && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      setImagePreview(URL.createObjectURL(file));  // Create a URL for the image preview
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promotionData = {
      ...formData,
      bannerImage: formData.bannerImage instanceof File ? formData.bannerImage : null, // Ensure bannerImage is a File or null
    };

    if (editingPromotion) {
      await updatePromotion({ ...editingPromotion, ...promotionData });
    } else {
      await addPromotion(promotionData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border rounded-lg shadow-xl bg-white max-w-md w-full md:w-96 lg:w-[400px] transition-all duration-300 ease-in-out">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}</h2>
          <p className="text-sm text-gray-500">Please fill out the form below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Promotion Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Promotion Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter promotion name"
              aria-label="Promotion Name"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Enter discount percentage"
              aria-label="Discount Percentage"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="Enter promotion duration (e.g., 1 week, 30 days)"
              aria-label="Promotion Duration"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Banner Image */}
          <div>
            <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
            <input
              type="file"
              name="bannerImage"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
              aria-label="Upload banner image"
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required={editingPromotion ? false : true}
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Banner Preview" className="max-w-full h-auto mx-auto" />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between space-x-3">
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 ease-in-out"
            >
              {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionForm;
