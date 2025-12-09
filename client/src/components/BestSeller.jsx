import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext';

const BestSeller = () => {
  const { products } = useAppContext();
  return (
    <div className='mt-16'>
      <p className='text-3xl md:text-4xl font-serif text-tulunad-secondary text-center mb-4'>Our Best Sellers</p>
      <p className='text-center text-gray-500 max-w-2xl mx-auto mb-10'>Customer favorites that bring the authentic taste of the coast to your kitchen.</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {products.filter((product) => product.inStock).slice(0, 5).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}

      </div>
    </div>
  )
}

export default BestSeller
