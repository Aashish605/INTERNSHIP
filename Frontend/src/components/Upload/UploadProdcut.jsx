import React, { useEffect, useState } from 'react'
import axios from 'axios'
import axiosInstance from '../../servies/axiosInstance'

const UploadProdcut = () => {
    const [payload, setPayload] = useState({
        productName: '',
        image: '',
        category_id: '',
        category_name: ''
    })
    const [img, setImg] = useState();
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [messageType, setMessageType] = useState('')

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axiosInstance.get('/category')
                setCategories(res.data || [])
            } catch (err) {
                console.error('Failed to fetch categories', err)
            }
        }
        getCategories()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'category_id') {
            const selectedCategory = categories.find(c => c._id === value);
            setPayload({ 
                ...payload, 
                category_id: value,
                category_name: selectedCategory ? selectedCategory.name : ''
            });
        } else {
            setPayload({ ...payload, [name]: value });
        }
    }

    // Handle the upload of the img from the form
    const handleUpload = async () => {
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "image_preset");

        try {
            const api = import.meta.env.VITE_CLOUDINARY_URL;
            const res = await axios.post(api, data);
            const imageUrl = res.data.secure_url;
            console.log(imageUrl);
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error.response?.data || error.message);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        try {
            const imgUrl = await handleUpload()
            payload.image = imgUrl
            await axiosInstance.post('/product', payload)
            setMessage('Product created successfully')
            setMessageType('success')
            setImg(null)
            const fileInput = document.getElementById('img');
            if (fileInput) fileInput.value = '';
            setPayload({
                productName: '',
                image: '',
                category_id: '',
                category_name: ''
            })
        } catch (err) {
            console.error(err)
            setMessage('Failed to create product')
            setMessageType('error')
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Product</h2>
                    <p className="text-gray-600">Add a new product to your inventory</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {message && (
                        <div className={`px-6 py-4 ${messageType === 'success'
                            ? 'bg-green-50 border-b border-green-100'
                            : 'bg-red-50 border-b border-red-100'
                            }`}>
                            <div className="flex items-center">
                                {messageType === 'success' ? (
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <p className={`text-sm font-medium ${messageType === 'success' ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {message}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Name
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={payload.productName}
                                    onChange={handleChange}
                                    name="productName"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none placeholder-gray-400"
                                    placeholder="Enter product name"
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Product Image
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            
                            {!img ? (
                                <label 
                                    htmlFor="img" 
                                    className="flex flex-col items-center justify-center w-full h-64 bg-gray-50 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 hover:border-emerald-400 transition duration-200"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="mb-4 p-4 bg-emerald-50 rounded-full">
                                            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <p className="mb-2 text-sm font-semibold text-gray-700">
                                            <span className="text-emerald-600">Click to upload</span> or drag and drop
                                        </p>
                                    </div>
                                    <input 
                                        id="img" 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => setImg(e.target.files[0])} 
                                        className="hidden"
                                        required
                                    />
                                </label>
                            ) : (
                                <div className="relative group">
                                    <div className="relative overflow-hidden rounded-xl border-2 border-gray-200">
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt="Product preview"
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200"></div>
                                    </div>
                                    
                                    {/* Remove Image Button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImg(null)
                                            document.getElementById('img').value = ''
                                        }}
                                        className="absolute top-3 right-3 bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all duration-200 z-10"
                                        title="Remove image"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    
                                    {/* Change Image Button */}
                                    <label 
                                        htmlFor="img"
                                        className="absolute bottom-3 right-3 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 z-10"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm font-medium">Change</span>
                                    </label>
                                    
                                    <input 
                                        id="img" 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => setImg(e.target.files[0])} 
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={payload.category_id}
                                    onChange={handleChange}
                                    name="category_id"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Upload Product</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        All fields marked with <span className="text-red-500">*</span> are required
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UploadProdcut