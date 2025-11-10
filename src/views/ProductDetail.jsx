import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../hook/useCart";
import { useFavoritesContext } from "../context/FavoritesContext";
import { useAuth } from "../hook/useAuth";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ProductDetailImages from "../components/Product/PorductDetail/ProductDetailImages";
import ProductDetailInfo from "../components/Product/PorductDetail/ProductDetailInfo";
import ProductDetailButtons from "../components/Product/PorductDetail/ProductDetailButtons";
import ProductDetailQuantitySelector from "../components/Product/PorductDetail/ProductDetailQuantitySelector";
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(id);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite, isLoading: favLoading } = useFavoritesContext();
  const { isLoggedIn } = useAuth();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    if (!isLoading && !product && !error) {
      navigate('/products');
    }
  }, [product, isLoading, error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="large" text="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  

  // Ordenar imágenes por displayOrder
  const getSortedImages = () => {
    if (!product.images || product.images.length === 0) {
      return [];
    }

    // Crear una copia del array para no mutar el original
    const images = [...product.images];

    // Ordenar por displayOrder
    return images.sort((a, b) => {
      // Si ambas tienen displayOrder, ordenar por ese valor
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      
      // Si solo una tiene displayOrder, va primero
      if (a.displayOrder !== undefined) return -1;
      if (b.displayOrder !== undefined) return 1;
      
      // Si ninguna tiene displayOrder, mantener orden original
      return 0;
    });
  };

  const sortedImages = getSortedImages();

  const getCurrentImage = () => {
    if (sortedImages.length > 0) {
      return sortedImages[selectedImageIndex].imageUrl;
    }
    return null;
  };


  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleAddToFavorites = async () => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }

    if (!product?.id) {
      return;
    }

    await toggleFavorite(product.id);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side - Images */}
          <ProductDetailImages
            product={product}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
            sortedImages={sortedImages}
            getCurrentImage={getCurrentImage}
          />

          {/* Right Side - Product Info */}
          <div className="space-y-8">
            
            {/* Product Info */}
            <ProductDetailInfo product={product} />

            {/* Quantity and Actions */}
            <ProductDetailQuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
            />

              
              {/* Action Buttons */}
                <ProductDetailButtons
                  handleAddToCart={handleAddToCart}
                  handleAddToFavorites={handleAddToFavorites}
                  isFavorite={isFavorite}
                  favLoading={favLoading}
                  product={product}
                />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
