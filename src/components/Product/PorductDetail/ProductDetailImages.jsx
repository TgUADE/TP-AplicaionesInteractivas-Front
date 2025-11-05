const ProductDetailImages = ({ product, selectedImageIndex, setSelectedImageIndex, sortedImages, getCurrentImage }) => {
    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-2xl p-8 flex items-center justify-center">
            {getCurrentImage() ? (
                <img
                src={getCurrentImage()}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
                />
            ) : (
                <div className="text-gray-400 text-6xl">📱</div>
            )}
            </div>

            {/* Thumbnail Images */}
            {sortedImages.length > 1 && (
            <div className="flex space-x-4 overflow-x-auto">
                {sortedImages.map((image, index) => (
                <button
                    key={image.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg border-2 p-2 transition-all duration-300 ${
                    selectedImageIndex === index 
                        ? 'border-blue-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <img
                    src={image.imageUrl}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain"
                    />
                </button>
                ))}
            </div>
            )}
        </div>
    )
};
export default ProductDetailImages;