import HeartIcon from "../../icons/HeartIcon";
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 relative p-5 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/15">
      <div className="absolute top-5 right-5 text-xl cursor-pointer z-10">
        <HeartIcon />
      </div>
      <div className="h-60 flex items-center justify-center mb-5">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-gray-500 text-4xl">📦</div>
        )}
      </div>
      <div className="text-center">
        <h3 className="text-base text-gray-800 m-0 mb-4 font-medium leading-relaxed min-h-10 flex items-center justify-center">
          {product.name || "Unnamed Product"}
        </h3>
        <div className="flex justify-between items-center gap-4 md:flex-col md:gap-2">
          <span className="text-2xl font-bold text-gray-800">
            ${product.price || "0"}
          </span>
          <button 
            onClick={() => onAddToCart && onAddToCart(product)}
            className="bg-gray-800 text-white border-none px-6 py-3 rounded-full font-semibold cursor-pointer transition-all duration-300 text-sm hover:bg-primary-500 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/30 md:w-full"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;