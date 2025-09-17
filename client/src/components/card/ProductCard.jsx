// rafce
import { ShoppingCart } from "lucide-react";
import useEcomStore from "../../store/ecom-store";
import { numberFormat } from "../../utils/number";
import { motion } from "framer-motion";

const ProductCard = ({ item }) => {
  const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart);
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <div className="card p-4 group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg mb-4">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0].url}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              alt={item.title}
            />
          ) : (
            <div className="w-full h-48 bg-secondary-100 rounded-lg flex items-center justify-center">
              <span className="text-secondary-400 text-sm">ไม่มีรูปภาพ</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-secondary-600 line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-orange-600">
            {numberFormat(item.price)}
          </span>
          <button
            onClick={() => actionAddtoCart(item)}
            className="btn-primary p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
