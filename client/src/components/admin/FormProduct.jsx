// rafce
import { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
// import { toast } from "react-toastify"; // Replaced with window.alert
import Uploadfile from "./Uploadfile";
import { Link } from "react-router-dom";
import { 
  Pencil, 
  Trash, 
  Package, 
  Plus, 
  Image as ImageIcon,
  Calendar,
  Search,
  Filter,
  Edit
} from "lucide-react";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const initialState = {
  title: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: "",
  images: [],
};

const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);

  const [form, setForm] = useState(initialState);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    getCategory();
    getProduct(100);
  }, [getCategory, getProduct]);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct(token, form);
      setForm(initialState);
      getProduct();
      // alert(`เพิ่มข้อมูล "${res.data.title}" สำเร็จ`); // ไม่แสดง alert สำหรับการกระทำปกติ
    } catch (err) {
      console.log(err);
      alert("เพิ่มสินค้าล้มเหลว");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("จะลบจริงๆ หรอ?")) {
      try {
        await deleteProduct(token, id);
        // alert("Deleted สินค้าเรียบร้อยแล้ว"); // ไม่แสดง alert สำหรับการกระทำปกติ
        getProduct();
      } catch (err) {
        console.log(err);
        alert("ลบสินค้าล้มเหลว");
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || 
      product.categoryId === parseInt(categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Package className="w-8 h-8 text-orange-500" />
                จัดการสินค้า
              </h1>
              <p className="text-gray-600">เพิ่ม แก้ไข และจัดการสินค้าทั้งหมด</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 px-4 py-2 rounded-xl">
                <span className="text-orange-700 font-semibold text-sm">ทั้งหมด: {products.length}</span>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-xl">
                <span className="text-green-700 font-semibold text-sm">หมวดหมู่: {categories.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-4">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">เพิ่มสินค้าใหม่</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  ชื่อสินค้า
                </label>
                <input
                  className="input-field"
                  value={form.title}
                  onChange={handleOnChange}
                  placeholder="ชื่อสินค้า"
                  name="title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ราคา
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={form.price}
                  onChange={handleOnChange}
                  placeholder="ราคา"
                  name="price"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  จำนวน
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={form.quantity}
                  onChange={handleOnChange}
                  placeholder="จำนวน"
                  name="quantity"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-1" />
                  หมวดหมู่
                </label>
                <select
                  className="input-field"
                  name="categoryId"
                  onChange={handleOnChange}
                  required
                  value={form.categoryId}
                >
                  <option value="" disabled>
                    เลือกหมวดหมู่สินค้า
                  </option>
                  {categories.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Edit className="w-4 h-4 inline mr-1" />
                  รายละเอียด
                </label>
                <input
                  className="input-field"
                  value={form.description}
                  onChange={handleOnChange}
                  placeholder="รายละเอียดสินค้า"
                  name="description"
                  required
                />
              </div>
            </div>

            {/* Upload file */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                รูปภาพสินค้า
              </label>
              <Uploadfile form={form} setForm={setForm} />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                เพิ่มสินค้า
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-1" />
                ค้นหา
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อหรือรายละเอียด"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                หมวดหมู่
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="ALL">ทั้งหมด</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-orange-100">
                <tr>
                  <th className="px-2 py-3 text-center text-xs font-bold text-gray-900 w-12">#</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-gray-900 w-20">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    รูปภาพ
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-900 w-40">
                    <Package className="w-4 h-4 inline mr-1" />
                    ชื่อสินค้า
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-bold text-gray-900 w-48">รายละเอียด</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-gray-900 w-24">
                    ราคา
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-gray-900 w-20">
                    จำนวน
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-gray-900 w-20">ขายแล้ว</th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-gray-900 w-28">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    อัปเดต
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-bold text-gray-900 w-32">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-orange-100/50 transition-colors duration-200"
                  >
                      <td className="px-2 py-3 text-xs font-semibold text-gray-900 text-center">
                        {index + 1}
                      </td>
                      <td className="px-2 py-3 text-center">
                        {item.images.length > 0 ? (
                          <img
                            className="w-12 h-12 rounded-lg shadow-md object-cover mx-auto"
                            src={item.images[0].url}
                            alt={item.title}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center shadow-sm text-gray-500 text-xs mx-auto">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-2 py-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-xs truncate">{item.title}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {categories.find(cat => cat.id === item.categoryId)?.name || 'ไม่มีหมวดหมู่'}
                          </p>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <p className="text-xs text-gray-700 line-clamp-2">{item.description}</p>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <span className="font-semibold text-orange-600 text-xs">
                          {numberFormat(item.price)}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <span className="text-xs text-gray-700">{item.quantity}</span>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <span className="text-xs text-green-600 font-semibold">{item.sold}</span>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <span className="text-xs text-gray-500">{dateFormat(item.updatedAt)}</span>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={"/admin/product/" + item.id}
                            className="btn-sm bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1 shadow-md hover:shadow-lg transition-colors duration-200 text-xs px-2 py-1"
                          >
                            <Pencil className="w-3 h-3" />
                            แก้ไข
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn-sm bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 shadow-md hover:shadow-lg transition-colors duration-200 text-xs px-2 py-1"
                          >
                            <Trash className="w-3 h-3" />
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormProduct;
