import { useEffect, useState } from "react";
import { listCategory } from "../../api/Category";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await listCategory();
        setCategories(res.data || []);
      } catch (err) {
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onClickCategory = (categoryId) => {
    navigate(`/shop?category=${categoryId}`);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      <span className="ml-3 text-secondary-600">กำลังโหลดหมวดหมู่สินค้า...</span>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-500 text-lg">เกิดข้อผิดพลาด: {String(error)}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onClickCategory(cat.id)}
          className="card p-4 text-center group hover:shadow-large transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-full h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg mb-3 flex items-center justify-center text-primary-600 group-hover:from-primary-200 group-hover:to-accent-200 transition-all duration-300 overflow-hidden">
            {cat.image ? (
              <img 
                src={cat.image} 
                alt={cat.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
            )}
          </div>
          <div className="font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">
            {cat.name}
          </div>
        </button>
      ))}
    </div>
  );
};

export default Categories;


