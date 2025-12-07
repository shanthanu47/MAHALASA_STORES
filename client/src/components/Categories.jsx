import React from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {

    const {navigate} = useAppContext()

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>

        {categories.map((category, index)=>(
            <div key={index} className='group cursor-pointer py-5 px-3 rounded-lg flex flex-col justify-between items-center h-44'
            style={{backgroundColor: category.bgColor}}
            onClick={()=>{
                navigate(`/products/${category.path.toLowerCase()}`);
                scrollTo(0,0)
            }}
            >
                <div className='flex-1 flex items-center justify-center w-full'>
                  <div className='w-24 h-24 overflow-hidden rounded-md bg-transparent flex items-center justify-center'>
                    <img src={category.image} alt={category.text} className='w-full h-full object-cover transition group-hover:scale-105'/>
                  </div>
                </div>
                <p className='text-sm font-medium text-center h-10 flex items-center justify-center px-2 break-words'>{category.text}</p>
            </div>
                    
        ))}

        
      </div>
    </div>
  )
}

export default Categories
