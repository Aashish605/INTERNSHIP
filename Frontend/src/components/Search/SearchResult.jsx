// src/pages/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, NavLink } from 'react-router-dom';
import axiosInstance from '../../servies/axiosInstance';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await axiosInstance.get('/search/search', {
                    params: { q: query }
                });
                setProducts(res.data.data || []);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600">Searching...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Search Results
                    </h1>
                    <p className="text-gray-600 mt-2 text-lg">
                        {products.length > 0
                            ? `Found ${products.length} ${products.length === 1 ? 'result' : 'results'} for "${query}"`
                            : `No results found for "${query}"`
                        }
                    </p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                        {products.map((product) => (
                            <NavLink
                                key={product._id}
                                to={`/product/${product._id}`}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
                            >
                                <div className="p-3 sm:p-4">
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
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                        <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="mt-6 text-2xl font-semibold text-gray-900">
                            No products found
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Try adjusting your search terms or browse our categories
                        </p>
                        <NavLink
                            to="/"
                            className="mt-6 inline-block px-6 py-3 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 transition-colors"
                        >
                            Browse All Products
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;