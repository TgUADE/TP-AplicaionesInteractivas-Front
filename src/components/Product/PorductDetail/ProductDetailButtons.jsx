import HeartIcon from "../../../icons/HeartIcon";

const ProductDetailButtons = ({ product,handleAddToCart, handleAddToFavorites, isFavorite, favLoading, isAdding }) => {
    return (
            <div className="flex gap-4">
            <button
                onClick={handleAddToFavorites}
                disabled={favLoading}
                className={`flex-1 border-2 px-6 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                isFavorite(product?.id) 
                    ? 'bg-red-50 text-red-600 border-red-300 hover:border-red-500' 
                    : 'bg-white text-gray-800 border-gray-300 hover:border-gray-800'
                }`}
                >
                <HeartIcon filled={isFavorite(product?.id)} />
                <span>{isFavorite(product?.id) ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>
                <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white px-6 py-4 rounded-lg font-medium transition-all duration-300 hover:bg-gray-800"
                >
                {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
                
                </button>
            </div>
            
    );
};
export default ProductDetailButtons;    