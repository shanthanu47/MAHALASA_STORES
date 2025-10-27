import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import { assets } from '../assets/assets'

const AllProducts = () => {

    const {products, searchQuery, setSearchQuery } = useAppContext()
    const [filteredProducts, setFilteredProducts] = useState([])
    const [localSearchQuery, setLocalSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('name')
    const [categoryFilter, setCategoryFilter] = useState('all')

    // Get unique categories from products
    const categories = ['all', ...new Set(products.map(product => product.category.toLowerCase()))]

    useEffect(() => {
        setLocalSearchQuery(searchQuery)
    }, [searchQuery])

    useEffect(() => {
        let filtered = products.filter(product => product.inStock)

        // Apply search filter
        if (localSearchQuery.length > 0) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(localSearchQuery.toLowerCase())
            )
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(product => 
                product.category.toLowerCase() === categoryFilter
            )
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'price-low':
                    return a.price - b.price
                case 'price-high':
                    return b.price - a.price
                case 'category':
                    return a.category.localeCompare(b.category)
                default:
                    return 0
            }
        })

        setFilteredProducts(filtered)
    }, [products, localSearchQuery, sortBy, categoryFilter])

    const handleSearchChange = (e) => {
        const value = e.target.value
        setLocalSearchQuery(value)
        setSearchQuery(value)
    }

    const clearSearch = () => {
        setLocalSearchQuery('')
        setSearchQuery('')
    }

    const clearAllFilters = () => {
        setLocalSearchQuery('')
        setSearchQuery('')
        setCategoryFilter('all')
        setSortBy('name')
    }

  return (
    <div className='mt-8 flex flex-col'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
        <div className='flex flex-col items-start w-max mb-4 sm:mb-0'>
          <p className='text-2xl font-medium uppercase'>All Products</p>
          <div className='w-16 h-0.5 bg-primary rounded-full'></div>
        </div>
        
        {/* Results count */}
        <div className='text-gray-600 text-sm'>
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
        </div>
      </div>

      {/* Search and Filters */}
      <div className='bg-gray-50 p-4 rounded-lg mb-6'>
        <div className='grid gap-4 md:grid-cols-3'>
          {/* Search Input */}
          <div className='relative'>
            <div className='flex items-center gap-2 border border-gray-300 px-3 rounded-md bg-white'>
              <img src={assets.search_icon} alt='search' className='w-4 h-4 text-gray-400'/>
              <input 
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="py-2 flex-1 bg-transparent outline-none placeholder-gray-500" 
                type="text" 
                placeholder="Search products, categories..." 
              />
              {localSearchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>

        {/* Active Filters & Clear All */}
        {(localSearchQuery || categoryFilter !== 'all' || sortBy !== 'name') && (
          <div className='flex items-center justify-between mt-4 pt-4 border-t border-gray-200'>
            <div className='flex items-center gap-2 flex-wrap'>
              {localSearchQuery && (
                <span className='bg-primary text-white px-3 py-1 rounded-full text-sm'>
                  Search: "{localSearchQuery}"
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className='bg-primary text-white px-3 py-1 rounded-full text-sm'>
                  Category: {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                </span>
              )}
              {sortBy !== 'name' && (
                <span className='bg-primary text-white px-3 py-1 rounded-full text-sm'>
                  Sort: {sortBy}
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className='text-primary hover:text-primary-dull underline text-sm'
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5'>
           {filteredProducts.map((product, index)=>(
            <ProductCard key={index} product={product}/>
           ))}
        </div>
      ) : (
        <div className='text-center py-16'>
          <div className='text-gray-500 text-lg mb-2'>No products found</div>
          <p className='text-gray-400 mb-4'>
            {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your search or filters'}
          </p>
          <button
            onClick={clearAllFilters}
            className='bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dull transition-colors'
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  )
}

export default AllProducts
