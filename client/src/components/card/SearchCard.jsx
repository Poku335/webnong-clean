import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchCard = () => {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (text.trim()) {
      params.set('query', text.trim());
    }
    // นำไปหน้า shop พร้อม query (หรือเคลียร์ query เพื่อแสดงสินค้าทั้งหมด)
    if (location.pathname === '/shop') {
      navigate(`/shop?${params.toString()}`, { replace: true });
    } else {
      navigate(`/shop?${params.toString()}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center bg-white rounded-full overflow-hidden shadow-soft border border-secondary-200 focus-within:border-primary-300 focus-within:shadow-medium transition-all duration-200"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ค้นหาสินค้า..."
        className="px-4 py-3 w-full bg-transparent focus:outline-none text-secondary-900 placeholder:text-secondary-400"
      />
      <button
        type="submit"
        className="px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-all duration-200 hover:shadow-medium"
      >
        <Search className="w-4 h-6" />
      </button>
    </form>
  );
};

export default SearchCard;
