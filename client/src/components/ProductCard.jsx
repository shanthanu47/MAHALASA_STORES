import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";


const ProductCard = ({ product }) => {
    const { currency, addToCart, removeFromCart, cart, navigate } = useAppContext()


    return product && (
        <div onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0) }} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 w-full cursor-pointer border border-transparent hover:border-tulunad-primary/20">
            <div className="relative flex items-center justify-center h-64 bg-tulunad-cream/30 group-hover:bg-tulunad-cream/50 transition-colors p-6">
                <img className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-in-out" src={product.image[0]} alt={product.name} />
                {/* Quick Add Button Overlay */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button onClick={(e) => { e.stopPropagation(); addToCart(product._id) }} className="bg-white p-2.5 rounded-full shadow-lg text-tulunad-primary hover:bg-tulunad-primary hover:text-white transition-colors border border-tulunad-primary/10">
                        <img src={assets.cart_icon} alt="add" className="w-5 h-5" style={{ filter: 'none' }} />
                    </button>
                </div>
            </div>

            <div className="p-5">
                <p className="text-xs font-bold text-tulunad-secondary/80 uppercase tracking-widest mb-2">{product.category}</p>
                <p className="text-stone-800 font-serif font-semibold text-xl truncate w-full mb-3 group-hover:text-tulunad-primary transition-colors">{product.name}</p>

                <div className="flex items-end justify-between mt-2 border-t border-stone-100 pt-3">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400 line-through mb-0.5">Rs.{product.price}</span>
                        <span className="text-2xl font-bold text-tulunad-primary font-serif">Rs.{product.offerPrice}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1 bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                        <img className="w-3.5" src={assets.star_icon} alt="" />
                        <span className="text-xs text-yellow-700 font-bold ml-0.5">4.5</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;