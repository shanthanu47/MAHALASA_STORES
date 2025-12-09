import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='relative mt-24'>
      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black/80"></div>
        <img src={assets.bottom_banner_image} alt="banner" className='w-full hidden md:block object-cover' />
        <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full md:hidden object-cover' />
      </div>

      <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-24'>
        <div>
          <h1 className='text-3xl md:text-5xl font-serif text-tulunad-accent mb-8 drop-shadow-lg'>Why Choose Mahalasa?</h1>
          <div className='bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10'>
            {features.map((feature, index) => (
              <div key={index} className='flex items-start gap-4 mt-6 first:mt-0'>
                <div className="bg-tulunad-primary p-2 rounded-lg shadow-lg rotate-3 group-hover:rotate-0 transition-all">
                  <img src={feature.icon} alt={feature.title} className='md:w-8 w-6 brightness-0 invert' />
                </div>
                <div>
                  <h3 className='text-lg md:text-xl font-serif text-white tracking-wide'>{feature.title}</h3>
                  <p className='text-gray-200/80 text-xs md:text-sm font-light font-sans mt-1'>{feature.description}</p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BottomBanner
