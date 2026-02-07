import React, { useEffect, useState } from 'react';
import axiosInstance from '../../servies/axiosInstance';
import { useParams } from 'react-router-dom';

const CoffeeProductPage = () => {
    const [selectedSize, setSelectedSize] = useState('Medium');
    const sizes = ['Small', 'Medium', 'Large'];
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const getProduct = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/product/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:min-h-screen">
                    {/* Image Section - Sticky on large screens */}
                    <div className="lg:w-1/2 lg:sticky lg:top-0 lg:h-screen">
                        <div className="relative h-[50vh] sm:h-[60vh] lg:h-full p-4 sm:p-6 lg:p-8">
                            <div className="w-full h-full bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
                                <img
                                    src={product?.image}
                                    alt={product?.name || "Product"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 py-8 sm:py-12 lg:py-20">
                        {/* Header */}
                        <div className="mb-8 sm:mb-12">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-emerald-800 font-bold mb-4 text-xs sm:text-sm">
                                <span className="bg-emerald-100 px-3 py-1.5 rounded-lg">Best Seller</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:inline">Premium Selection</span>
                            </div>
                            
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 sm:mb-4 tracking-tight leading-tight">
                                {product?.name}
                            </h1>
                            
                            {product?.category_name && (
                                <p className="text-lg sm:text-xl text-emerald-700 font-semibold mb-3">
                                    {product.category_name}
                                </p>
                            )}
                            
                            <p className="text-base sm:text-lg lg:text-xl text-gray-500 leading-relaxed">
                                Experience the perfect blend of rich flavors and aromatic excellence in every cup
                            </p>
                        </div>

                        {/* Rating & Tags */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                            <div className="flex items-center bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-bold text-base sm:text-lg">4.7</span>
                                <span className="ml-2 text-gray-400 text-xs sm:text-sm">(2.5k)</span>
                            </div>
                            
                            {['Single Origin', 'Eco-Friendly'].map(tag => (
                                <span 
                                    key={tag} 
                                    className="border-2 border-gray-200 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8 sm:mb-12">
                            <h3 className="text-gray-900 text-xs sm:text-sm uppercase tracking-widest font-bold mb-4 sm:mb-6">
                                Select Size
                            </h3>
                            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-4 sm:py-5 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold border-2 transition-all duration-300 ${
                                            selectedSize === size
                                                ? 'bg-emerald-900 border-emerald-900 text-white shadow-xl scale-105'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700 active:scale-95'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-auto">
                            <button className="w-full sm:w-auto sm:min-w-[400px] bg-emerald-900 hover:bg-emerald-800 active:bg-emerald-950 text-white py-5 sm:py-6 px-6 sm:px-12 rounded-2xl sm:rounded-3xl flex items-center justify-between transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[0_10px_40px_rgba(6,78,59,0.25)] hover:shadow-[0_20px_50px_rgba(6,78,59,0.35)]">
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold">Add to Order</span>
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="w-px h-6 sm:h-8 bg-white/30"></div>
                                    <span className="text-2xl sm:text-3xl font-black">
                                        ${product?.price?.toFixed(2) || '5.12'}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoffeeProductPage;