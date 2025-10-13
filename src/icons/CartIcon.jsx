const CartIcon = ({ itemCount = 0, isLocalCart = false, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      {itemCount > 0 && (
        <span
          className={`absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
            isLocalCart ? "bg-orange-500" : "bg-red-500"
          }`}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
      {isLocalCart && (
        <span
          className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"
          title="Carrito temporal"
        ></span>
      )}
    </div>
  );
};

export default CartIcon;
