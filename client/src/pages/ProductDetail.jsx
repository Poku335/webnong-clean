import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useEcomStore from "../store/ecom-store";
import { readProduct } from "../api/product";
import { numberFormat } from "../utils/number";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const token = useEcomStore((s) => s.token);
  const actionAddtoCart = useEcomStore((s) => s.actionAddtoCart);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="p-4">กำลังโหลด...</div>;
  if (error) return <div className="p-4 text-red-600">เกิดข้อผิดพลาด: {String(error)}</div>;
  if (!product) return <div className="p-4">ไม่พบสินค้า</div>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <div className="w-64 h-64 bg-gray-100 rounded overflow-hidden">
          {product.images && product.images[0]?.url ? (
            <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-semibold">{numberFormat(product.price)}</p>
          <button
            onClick={() => {
              actionAddtoCart(product);
              toast.success("เพิ่มลงตะกร้าสำเร็จ");
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            <ShoppingCart size={18} /> เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
      {product.images?.length > 1 && (
        <div className="flex gap-2">
          {product.images.slice(1).map((img) => (
            <img key={img.id} src={img.url} alt={product.title} className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;


