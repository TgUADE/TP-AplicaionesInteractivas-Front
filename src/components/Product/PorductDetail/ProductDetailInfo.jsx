const ProductDetailInfo =({product})=>{
    return (
        <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
            </h1>
            <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-gray-900">
                {`${product.current_price?.toFixed(2) || "0.00"}`}
                </span>
                {/* Show original price if there's a discount */}
                {product.promotion && (
                <span className="text-2xl text-gray-500 line-through">
                    ${product.original_price?.toFixed(2)}
                </span>
                )}
            </div>
            
              {/* Show discount badge if there's a discount */}
            {product.promotion && (
                <div className="mt-2">
                <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.promotion.type === "PERCENTAGE"
                    ? `${product.promotion.value}% OFF`
                    : `$${product.promotion.value} OFF`}
                </span>
                </div>
            )}

            {/* Product Description */}
            <div>
            <p className="text-gray-700 leading-relaxed">
                {product.description}
            </p>
            </div>    
        </div>
    );
}
export default ProductDetailInfo;