// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import axiosInstance from '../../servies/axiosInstance';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [debouncedSearch] = useDebounce(searchTerm, 300);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search when user types
    useEffect(() => {
        const searchProducts = async () => {
            if (debouncedSearch.trim().length < 1) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            try {
                setLoading(true);
                const res = await axiosInstance.get('/search/search', {
                    params: { q: debouncedSearch }
                });
                
                setResults(res.data.data || []);
                setIsOpen(true);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        searchProducts();
    }, [debouncedSearch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            setIsOpen(false);
        }
    };

    const handleSelectProduct = () => {
        setSearchTerm('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={searchRef} className="relative w-full mx-auto max-w-2xl">
            {/* Search Input */}
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => results.length > 0 && setIsOpen(true)}
                        placeholder="Search products..."
                        className="w-full px-5 py-3 pl-12 pr-12 text-base border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                        autoComplete="off"
                    />
                    
                    {/* Search Icon */}
                    <svg 
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>

                    {/* Clear Button */}
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('');
                                setResults([]);
                                setIsOpen(false);
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </form>

            {/* Search Results Dropdown */}
            {isOpen && searchTerm && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
                            <p className="mt-3 text-gray-500">Searching...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="py-2">
                            {results.map((product) => (
                                <NavLink
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    onClick={handleSelectProduct}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group"
                                >
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                                            {product.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 truncate">
                                            {product.category_name}
                                        </p>
                                    </div>
                                    <svg className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </NavLink>
                            ))}
                            
                            {/* View All Button */}
                            <div className="border-t border-gray-100 p-3">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                    View all results for "{searchTerm}"
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="mt-3 text-gray-500 font-medium">
                                No products found
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                                Try different keywords
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;