
import Button from "../UI/Button";


const CartProducts = ( { cartProducts , handleProductClick, handleQuantityChange, handleRemoveItem , handleClearCart } ) => {
    return(
        <div className="lg:col-span-2">
            <div className="space-y-4">
                {cartProducts.map((item) => (
                <div
                    key={item.productId}
                    className="bg-gray-50 rounded-lg p-6 flex items-center space-x-4 cursor-pointer"
                    onClick={(e) => handleProductClick(item.productId, e)}
                >
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.product?.images?.[0]?.imageUrl ? (
                        <img
                        src={item.product.images[0].imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <div className="text-2xl">📦</div>
                    )}
                    </div>

                    <div className="flex-1">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                        {item.product?.name || "Loading..."}
                        </h3>
                        <p className="text-gray-600">
                        $
                        {(
                            item.product?.current_price ||
                            item.product?.price ||
                            0
                        ).toFixed(2)}
                        </p>
                    </div>
                    </div>

                    <div className="flex items-center space-x-2">
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(
                            item.productId,
                            item.quantity - 1
                        );
                        }}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                        -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(
                            item.productId,
                            item.quantity + 1
                        );
                        }}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                        +
                    </button>
                    </div>

                    <div className="text-right">
                    <p className="font-semibold">
                        $
                        {(
                        (item.product?.current_price ||
                            item.product?.price ||
                            0) * item.quantity
                        ).toFixed(2)}
                    </p>
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.productId);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                    >
                        Delete
                    </button>
                    </div>
                </div>
                ))}
            </div>
            <div className="mt-6">
                <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-red-600 border-red-600 hover:bg-red-50"
                >
                Empty Cart
                </Button>
            </div>
            </div>
        
    )
};
export default CartProducts;