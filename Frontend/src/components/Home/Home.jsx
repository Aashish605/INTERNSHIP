import React, { useEffect, useState } from 'react';
import axiosInstance from '../../servies/axiosInstance';
import { NavLink } from 'react-router-dom';
import Pagina from '../Pagina';
import SearchBar from '../Search/SearchBar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';


const Home = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [type, setType] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await axiosInstance.get(`/category`);
                setCategories(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        getCategories();
    }, []);

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get('/product', {
                    params: {
                        category: type
                    }
                });
                setProducts(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, [type]);

    // Reset to page 1 when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [type]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12">
                <SearchBar/>
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-2">
                        Our Menu
                    </h1>
                    <div className='flex gap-4 items-center mt-3'>
                        <NavLink className='px-4 py-2 rounded-2xl bg-gray-300' to='/upload/product'> Add Product</NavLink>
                        <NavLink className='px-4 py-2 rounded-2xl bg-gray-300' to='/upload/category'> Add Category</NavLink>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                        Categories
                    </h2>
                    
                    <div className="-mx-4 sm:mx-0">
                        <div className="px-4 sm:px-0">
                            <Swiper
                                modules={[FreeMode, Mousewheel]}
                                spaceBetween={8}
                                slidesPerView="auto"
                                freeMode={true}
                                grabCursor={true}
                                mousewheel={{
                                    forceToAxis: true,
                                }}
                                breakpoints={{
                                    640: {
                                        spaceBetween: 12,
                                    },
                                    1024: {
                                        spaceBetween: 16,
                                    }
                                }}
                                className="!pb-2"
                            >
                                <SwiperSlide style={{ width: 'auto' }}>
                                    <button
                                        onClick={() => setType()}
                                        className={`
                                            group relative flex items-center gap-2 
                                            px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 lg:py-3.5 
                                            rounded-full transition-all duration-300 
                                            font-semibold text-sm sm:text-base
                                            whitespace-nowrap
                                            transform hover:scale-105 active:scale-95
                                            ${!type
                                                ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                                                : 'bg-white text-gray-700 shadow-sm hover:shadow-md border border-gray-200 hover:border-emerald-300'
                                            }
                                        `}
                                    >
                                        <span className="relative z-10">All</span>
                                    </button>
                                </SwiperSlide>

                                {/* Category Buttons */}
                                {categories.map((category) => (
                                    <SwiperSlide key={category._id} style={{ width: 'auto' }}>
                                        <button
                                            onClick={() => setType(category._id)}
                                            className={`
                                                group relative flex items-center gap-2 
                                                px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 lg:py-3.5 
                                                rounded-full transition-all duration-300 
                                                font-semibold text-sm sm:text-base
                                                whitespace-nowrap
                                                transform hover:scale-105 active:scale-95
                                                ${category._id === type
                                                    ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                                                    : 'bg-white text-gray-700 shadow-sm hover:shadow-md border border-gray-200 hover:border-emerald-300'
                                                }
                                            `}
                                        >
                                            <span className="relative z-10">{category.name}</span>
                                        </button>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                            {type 
                                ? categories.find(c => c._id === type)?.name || 'Products'
                                : 'All Products'
                            }
                            <span className="ml-2 text-sm text-gray-500 font-normal">
                                ({products.length} items)
                            </span>
                        </h2>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                                    <div className="p-3 sm:p-4">
                                        <div className="aspect-square w-full bg-gray-200 rounded-xl mb-3"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Products Grid */
                        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                            {(() => {
                                const start = (currentPage - 1) * pageSize;
                                const end = start + pageSize;
                                const pageItems = products.slice(start, end);
                                
                                if (pageItems.length === 0) {
                                    return (
                                        <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-24">
                                            <svg 
                                                xmlns="http://www.w3.org/2000/svg" 
                                                className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mb-4"
                                                fill="none" 
                                                viewBox="0 0 24 24" 
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p className="text-lg sm:text-xl text-gray-500 font-medium">
                                                No products found
                                            </p>
                                            <p className="text-sm text-gray-400 mt-2">
                                                Try selecting a different category
                                            </p>
                                        </div>
                                    );
                                }
                                
                                return pageItems.map((product) => (
                                    <NavLink
                                        to={`/product/${product._id}`}
                                        key={product.id || product._id}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
                                    >
                                        <div className="p-3 sm:p-4">
                                            {/* Image Container */}
                                            <div className="relative mb-3 sm:mb-4 overflow-hidden rounded-xl bg-gray-100">
                                                <div className="aspect-square w-full">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                
                                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="bg-white rounded-full p-2 shadow-lg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-700" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg line-clamp-2 group-hover:text-emerald-700 transition-colors">
                                                    {product.name}
                                                </h3>
                                                
                                                {product.category_name && (
                                                    <p className="text-xs sm:text-sm text-gray-500">
                                                        {product.category_name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </NavLink>
                                ));
                            })()}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && products.length > 0 && (
                    <Pagina
                        products={products}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;