const ProductDetailQuantitySelector = ({ quantity, setQuantity }) => {
    return (
        
        
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-900">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
            <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
            >
                -
            </button>
            <span className="px-4 py-2 border-l border-r border-gray-300">
                {quantity}
            </span>
            <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
            >
                +
            </button>
            </div>
        </div>
        
    );
}
export default ProductDetailQuantitySelector;       