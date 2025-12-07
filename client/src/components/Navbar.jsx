import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
    const [localSearchQuery, setLocalSearchQuery] = useState('')
    const {user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios, products} = useAppContext();

    const logout = async ()=>{
      try {
        const { data } = await axios.get('/api/user/logout')
        if(data.success){
          toast.success(data.message)
          setUser(null);
          navigate('/')
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
        
    }

    const deleteAccount = async ()=>{
      if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.')) {
        return;
      }
      try {
        const { data } = await axios.post('/api/user/delete-account')
        if(data.success){
          toast.success(data.message)
          setUser(null);
          navigate('/')
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchQuery(localSearchQuery)
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [localSearchQuery, setSearchQuery])

    useEffect(()=>{
      if(searchQuery.length > 0){
        navigate("/products")
      }
    },[searchQuery, navigate])

    // Get search suggestions
    const getSearchSuggestions = () => {
        if (!localSearchQuery.trim() || !products.length) return []
        
        const suggestions = products
            .filter(product => 
                product.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(localSearchQuery.toLowerCase())
            )
            .slice(0, 5) // Limit to 5 suggestions
            .map(product => ({
                name: product.name,
                category: product.category,
                id: product._id
            }))
        
        return suggestions
    }

    const handleSearchInputChange = (e) => {
        const value = e.target.value
        setLocalSearchQuery(value)
        setShowSearchSuggestions(value.length > 0)
    }

    const handleSuggestionClick = (suggestion) => {
        setLocalSearchQuery(suggestion.name)
        setSearchQuery(suggestion.name)
        setShowSearchSuggestions(false)
        navigate("/products")
    }

    const clearSearch = () => {
        setLocalSearchQuery('')
        setSearchQuery('')
        setShowSearchSuggestions(false)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (localSearchQuery.trim()) {
            setSearchQuery(localSearchQuery)
            setShowSearchSuggestions(false)
            setOpen(false) // Close mobile menu when searching
            navigate("/products")
        }
    }

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

      <NavLink to='/' onClick={()=> setOpen(false)} className="flex items-center gap-2 md:gap-3">
        <img className="h-14" src={assets.logo} alt="logo" />
        <span className="text-lg md:text-xl font-bold text-primary">
          <span className="hidden sm:inline">Mahalasa Stores</span>
          <span className="sm:hidden flex flex-col leading-tight">
            <span>Mahalasa</span>
            <span>Stores</span>
          </span>
        </span>
      </NavLink>

      <div className="hidden sm:flex items-center gap-8">
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/products'>All Product</NavLink>
        <NavLink to='/contact'>Contact</NavLink>

        {/* Desktop Search - Large screens */}
        <div className="hidden lg:block relative">
          <form onSubmit={handleSearchSubmit} className="flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
            <input 
              value={localSearchQuery}
              onChange={handleSearchInputChange}
              onFocus={() => setShowSearchSuggestions(localSearchQuery.length > 0)}
              onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
              className="py-1.5 w-64 bg-transparent outline-none placeholder-gray-500" 
              type="text" 
              placeholder="Search products..." 
            />
            {localSearchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            )}
            <button type="submit">
              <img src={assets.search_icon} alt='search' className='w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity'/>
            </button>
          </form>
          
          {/* Search Suggestions Dropdown */}
          {showSearchSuggestions && getSearchSuggestions().length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
              {getSearchSuggestions().map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-sm text-gray-800">{suggestion.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{suggestion.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Icon for medium screens */}
        <div className="lg:hidden">
          <button 
            onClick={() => navigate('/products')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img src={assets.search_icon} alt='search' className='w-5 h-5'/>
          </button>
        </div>

        <div onClick={()=> navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80'/>
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
        </div>

      {!user ? ( <button onClick={()=> setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
          Login
        </button>)
        :
        (
          <div className='relative group'>
            <img src={assets.profile_icon} className='w-10' alt="" />
            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-36 rounded-md text-sm z-40'>
              <li onClick={()=> navigate("my-orders")} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
              <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
              <li onClick={deleteAccount} className='p-1.5 pl-3 hover:bg-red-50 text-red-600 cursor-pointer border-t border-gray-200'>Delete Account</li>
            </ul>
          </div>
        )}
      </div>

<div className='flex items-center gap-6 sm:hidden'>
      <div onClick={()=> navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80'/>
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
        </div>
    <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
        <img  src={assets.menu_icon} alt='menu'/>
      </button>
</div>
      

      { open && (
        <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-3 px-5 text-sm md:hidden z-50`}>
        
        {/* Mobile Search */}
        <div className="w-full">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-full">
            <input 
              value={localSearchQuery}
              onChange={handleSearchInputChange}
              className="flex-1 bg-transparent outline-none placeholder-gray-500" 
              type="text" 
              placeholder="Search products..." 
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
            <button type="submit">
              <img src={assets.search_icon} alt='search' className='w-4 h-4'/>
            </button>
          </form>
        </div>
        
        <NavLink to="/" onClick={()=> setOpen(false)}>Home</NavLink>
        <NavLink to="/products" onClick={()=> setOpen(false)}>All Product</NavLink>
        {user && 
        <NavLink to="/my-orders" onClick={()=> setOpen(false)}>My Orders</NavLink>
        }
        <NavLink to="/contact" onClick={()=> setOpen(false)}>Contact</NavLink>

        {!user ? (
          <button onClick={()=>{
            setOpen(false);
            setShowUserLogin(true);
          }} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
          Login
        </button>
        ) : (
          <>
            <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm">
            Logout
            </button>
            <button onClick={()=>{
              setOpen(false);
              deleteAccount();
            }} className="cursor-pointer px-6 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-full text-sm">
            Delete Account
            </button>
          </>
        )}
        
      </div>
      )}

    </nav>
  )
}

export default Navbar
