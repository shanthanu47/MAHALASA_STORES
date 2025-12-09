import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const MainBanner = () => {
  const [searchInput, setSearchInput] = useState('')
  const { setSearchQuery, navigate } = useAppContext()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchQuery(searchInput)
      navigate('/products')
    }
  }

  return (
    <div className='relative w-full md:min-h-[500px] flex flex-col md:flex-row items-center overflow-hidden rounded-2xl my-8 bg-tulunad-secondary/5'>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-tulunad-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-tulunad-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      {/* Left Content */}
      <div className='relative z-10 w-full md:w-1/2 flex flex-col items-center md:items-start justify-center p-8 md:p-16 lg:p-24 text-center md:text-left'>
        <span className="text-tulunad-primary font-medium tracking-widest text-sm uppercase mb-4">Authentic Flavors of Tulunad</span>
        <h1 className='text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-tulunad-secondary leading-tight mb-6'>
          Bring the Coast <br /> <span className="text-tulunad-primary italic">Home.</span>
        </h1>
        <p className="text-gray-600 max-w-md mb-8 text-lg">
          Handpicked spices, grains, and essentials from Udupi, Mangalore, and Kundapura. Delivered fresh to your door.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className='w-full max-w-md relative'>
          <div className='flex items-center bg-white rounded-full border border-stone-200 shadow-lg hover:shadow-xl transition-shadow p-1.5 focus-within:border-tulunad-primary/50'>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for 'Kori Rotti'..."
              className="flex-1 px-5 py-3 rounded-full outline-none text-gray-700 placeholder-gray-400 font-sans"
            />
            <button
              type="submit"
              className="bg-tulunad-secondary hover:bg-green-900 w-12 h-12 flex items-center justify-center rounded-full transition-colors text-white"
            >
              <img src={assets.search_icon} alt="search" className="w-5 h-5 filter invert opacity-90" />
            </button>
          </div>
        </form>

        <div className='flex items-center gap-4 mt-8'>
          <Link to={"/products"} className="text-tulunad-secondary font-medium hover:text-tulunad-primary transition underline underline-offset-4 decoration-2 decoration-tulunad-primary/30 hover:decoration-tulunad-primary">
            Explore Collections
          </Link>
        </div>
      </div>

      {/* Right Image */}
      <div className='relative w-full md:w-1/2 h-64 md:h-full min-h-[400px]'>
        <img src={assets.main_banner_bg} alt="Coastal Karnataka" className='w-full h-full object-cover hidden md:block mask-image-gradient' style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <img src={assets.main_banner_bg_sm} alt="Coastal Karnataka" className='w-full h-full object-cover md:hidden' />
      </div>
    </div>
  )
}

export default MainBanner
