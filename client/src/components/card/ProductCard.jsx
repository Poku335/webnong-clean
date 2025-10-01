// rafce
import { useState } from "react";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import useEcomStore from "../../store/ecom-store";
import { numberFormat } from "../../utils/number";
import { motion } from "framer-motion";
// import { toast } from "react-toastify"; // Replaced with window.alert

const ProductCard = ({ item }) => {
  const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart);
  const [isLiked, setIsLiked] = useState(false);
  
  const handleAddToCart = () => {
    actionAddtoCart(item);
      // alert("เพิ่มลงตะกร้าสำเร็จ! 🛒"); // ไม่แสดง alert สำหรับการกระทำปกติ
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // alert(isLiked ? "ลบออกจากรายการโปรด" : "เพิ่มในรายการโปรด ❤️"); // ไม่แสดง alert สำหรับการกระทำปกติ
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="card-hover p-3 relative overflow-hidden h-80 flex flex-col">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all duration-300 ${
            isLiked 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white shadow-md'
          }`}
        >
          <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <div className="relative overflow-hidden rounded-xl mb-2 h-32">
          <Link to={`/product/${item.id}`}>
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0].url}
                className="w-full h-32 object-cover transition-all duration-500 group-hover:scale-110"
                alt={item.title}
              />
            ) : (
              <div className="w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-gray-400 text-sm">ไม่มีรูปภาพ</span>
              </div>
            )}
          </Link>
          
          {/* Overlay with Quick Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Link
                to={`/product/${item.id}`}
                className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </Link>
              <button
                onClick={handleAddToCart}
                className="p-2 bg-orange-500/90 rounded-full shadow-lg hover:bg-orange-500 transition-all duration-300 transform hover:scale-110"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-1 flex-1">
          <Link to={`/product/${item.id}`}>
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
              {item.title}
            </h3>
          </Link>
          <p className="text-xs text-gray-600 line-clamp-1 leading-tight">
            {item.description}
          </p>
        </div>

        {/* Price and Add to Cart - Bottom Section */}
        <div className="flex justify-between items-center mt-auto pt-3">
          <div>
            <span className="text-base font-bold text-orange-600">
              {numberFormat(item.price)}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-xs text-gray-400 line-through ml-2">
                {numberFormat(item.originalPrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="btn-primary p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Sale Badge */}
        {item.originalPrice && item.originalPrice > item.price && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
