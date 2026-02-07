import React, { useEffect } from 'react'

const Pagina = ({ products, currentPage, setCurrentPage, pageSize, setPageSize }) => {


    useEffect(() => {
        const updatePageSize = () => {
            if (window.innerWidth < 640) {
                setPageSize(4)
            } else if (window.innerWidth < 1024) {
                setPageSize(6)
            } else {
                setPageSize(8)
            }
        }
        updatePageSize()
        window.addEventListener('resize', updatePageSize)
        return () => window.removeEventListener('resize', updatePageSize)
    }, [setPageSize])


    if (products.length <= pageSize) return null

    const totalPages = Math.ceil(products.length / pageSize)

    return (
        <div className="flex items-end justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div></div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-white border text-sm disabled:opacity-50"
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md text-sm ${i + 1 === currentPage ? 'bg-emerald-700 text-white' : 'bg-white border text-gray-700'}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-white border text-sm disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Pagina