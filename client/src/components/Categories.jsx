import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {

  const { navigate } = useAppContext()

  return (
    <div className='mt-16'>
      <p className='text-3xl md:text-4xl font-serif text-tulunad-secondary text-center mb-8'>Shop by Category</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>

        {categories.map((category, index) => (
          <div key={index}
            className='group cursor-pointer flex flex-col items-center gap-3 transition-transform hover:-translate-y-1'
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0)
            }}
          >
            <div className='w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full shadow-md bg-stone-100 relative'>
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10"></div>
              <img src={category.image} alt={category.text} className='w-full h-full object-cover transition duration-500 group-hover:scale-110' />
            </div>
            <p className='text-base font-serif font-medium text-center text-stone-700 group-hover:text-tulunad-primary transition-colors'>{category.text}</p>
          </div>

        ))}


      </div>
    </div>
  )
}

export default Categories
