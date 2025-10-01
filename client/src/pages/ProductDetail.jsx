import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { readProduct } from "../api/product";
import { numberFormat } from "../utils/number";
import { ShoppingCart, Heart, Share2, ArrowLeft, Minus, Plus } from "lucide-react";
// import { toast } from "react-toastify"; // Replaced with window.alert
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useEcomStore((s) => s.token);
  const actionAddtoCart = useEcomStore((s) => s.actionAddtoCart);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await readProduct(token, id);
        setProduct(res.data);
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      actionAddtoCart(product);
    }
    // alert(`เพิ่ม ${quantity} ชิ้นลงตะกร้าสำเร็จ! 🛒`); // ไม่แสดง alert สำหรับการกระทำปกติ
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // alert(isLiked ? "ลบออกจากรายการโปรด" : "เพิ่มในรายการโปรด ❤️"); // ไม่แสดง alert สำหรับการกระทำปกติ
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // alert("คัดลอกลิงก์แล้ว!"); // ไม่แสดง alert สำหรับการกระทำปกติ
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">กำลังโหลด...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">😔</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
      <p className="text-gray-600 mb-6">{String(error)}</p>
      <button onClick={() => navigate(-1)} className="btn-primary">
        กลับ
      </button>
    </div>
  );
  
  if (!product) return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบสินค้า</h3>
      <p className="text-gray-600 mb-6">สินค้านี้อาจถูกลบหรือไม่พร้อมใช้งาน</p>
      <button onClick={() => navigate('/shop')} className="btn-primary">
        ไปร้านค้า
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">กลับ</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-100">
            {product.images && product.images[selectedImage]?.url ? (
              <img
                src={product.images[selectedImage].url}
                alt={product.title}
                className="w-full h-[500px] object-contain transition-all duration-300 hover:scale-105"
              />
            ) : (
              <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-lg">ไม่มีรูปภาพ</span>
              </div>
            )}
            
            {/* Sale Badge */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                SALE
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-orange-500 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
          </div>


          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-orange-600">
                {numberFormat(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-400 line-through">
                  {numberFormat(product.originalPrice)}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-green-600 font-semibold">
                ประหยัด {numberFormat(product.originalPrice - product.price)}!
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <label className="text-lg font-semibold text-gray-900">จำนวน:</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 py-3 text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>เพิ่มลงตะกร้า</span>
              </button>
              <button
                onClick={handleLike}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  isLiked
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-600 transition-all duration-300"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;


