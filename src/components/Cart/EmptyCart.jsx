import Button from "../UI/Button";
const EmptyCart = () => {
    return (
        <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
            Add some products to get started
        </p>
        <Button onClick={() => (window.location.href = "/products")}>
            View Products
        </Button>
        </div>
    );
};
export default EmptyCart;