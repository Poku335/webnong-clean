import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/card/ProductCard'
import useEcomStore from '../store/ecom-store'
// import SearchCard from '../components/card/SearchCard'
import { searchFilters } from '../api/product'
// import CartCard from '../components/card/CartCard'

const Shop = () => {
  const getProduct = useEcomStore((state)=>state.getProduct)
  const setProducts = (items)=>useEcomStore.setState({ products: items })
  const products = useEcomStore((state)=>state.products)
  const getCategory = useEcomStore((state)=>state.getCategory)
  const categories = useEcomStore((state)=>state.categories)
  const [params] = useSearchParams()
  const [sort, setSort] = useState('relevant')
  const navigate = useNavigate()
  
  useEffect(()=>{
    const categoryId = params.get('category')
    const query = params.get('query')
    if (categoryId) {
      // filter by category
      searchFilters({ category: [categoryId] })
        .then(res => setProducts(res.data))
        .catch(err => console.log(err))
      return
    }
    if (query && query.trim()) {
      // filter by query
      searchFilters({ query })
        .then(res => setProducts(res.data))
        .catch(err => console.log(err))
      return
    }
    getProduct()
  },[params, getProduct])

  // โหลดหมวดหมู่ไว้แสดงใน Sidebar
  useEffect(()=>{ getCategory() }, [getCategory])

  const displayProducts = useMemo(()=>{
    const data = [...products]
    switch (sort) {
      case 'latest':
        return data.sort((a,b)=> new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      case 'bestseller':
        return data.sort((a,b)=> (b.sold||0) - (a.sold||0))
      case 'price-asc':
        return data.sort((a,b)=> (a.price||0) - (b.price||0))
      case 'price-desc':
        return data.sort((a,b)=> (b.price||0) - (a.price||0))
      default:
        return data
    }
  },[products, sort])

  return (
    <div className='flex gap-8 animate-fade-in'>

      {/* Sidebar Categories */}
      <aside className='w-1/4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200/50 h-fit sticky top-24 hidden lg:block'>
        <h3 className='text-2xl font-bold mb-8 text-gray-900 gradient-text'>หมวดหมู่สินค้า</h3>
        <div className='space-y-3'>
          <button
            onClick={()=> navigate('/shop')}
            className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
              !params.get('category') 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'hover:bg-orange-100 hover:text-orange-600 text-gray-700 border border-gray-200 hover:border-orange-200'
            }`}
          >
            <span className="font-semibold">ทั้งหมด</span>
          </button>
          {categories.map((c)=> (
            <button
              key={c.id}
              onClick={()=> navigate(`/shop?category=${c.id}`)}
              className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
                params.get('category')===String(c.id) 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'hover:bg-orange-100 hover:text-orange-600 text-gray-700 border border-gray-200 hover:border-orange-200'
              }`}
            >
              <span className="font-semibold">{c.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Product */}
      <div className='flex-1'>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ร้านค้า</h1>
          <p className="text-gray-600 text-lg">ค้นหาสินค้าที่คุณต้องการ</p>
        </div>

        {/* Sort Controls */}
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200/50 p-6 mb-8'>
          <div className='flex flex-wrap items-center gap-4'>
            <span className='text-gray-700 font-semibold text-lg'>เรียงโดย:</span>
            <div className='flex flex-wrap gap-3'>
              <button 
                onClick={()=>setSort('relevant')} 
                className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  sort==='relevant'
                    ? 'bg-orange-500 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-orange-100 hover:text-orange-600 text-gray-700 border border-gray-200 hover:border-orange-200'
                }`}
              >
                <span className="font-medium">เกี่ยวข้อง</span>
              </button>
              <button 
                onClick={()=>setSort('latest')} 
                className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  sort==='latest'
                    ? 'bg-orange-500 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-orange-100 hover:text-orange-600 text-gray-700 border border-gray-200 hover:border-orange-200'
                }`}
              >
                <span className="font-medium">ล่าสุด</span>
              </button>
              <button 
                onClick={()=>setSort('bestseller')} 
                className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  sort==='bestseller'
                    ? 'bg-orange-500 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-orange-100 hover:text-orange-600 text-gray-700 border border-gray-200 hover:border-orange-200'
                }`}
              >
                <span className="font-medium">สินค้าขายดี</span>
              </button>
              <button 
                onClick={()=> setSort(sort==='price-asc'?'price-desc':'price-asc')} 
                className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  sort.startsWith('price')
                    ? 'bg-orange-500 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-orange-100 hover:text-orange-600 text-gray-700 border border-gray-200 hover:border-orange-200'
                }`}
              >
                <span className="font-medium">ราคา {sort==='price-asc'?'▲':'▼'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            พบสินค้า <span className="font-bold text-orange-600">{displayProducts.length}</span> รายการ
          </p>
        </div>

        {/* Products Grid */}
        <div className='product-grid'>
          {displayProducts.map((item,index)=>
            <ProductCard key={index} item={item}/>
          )}
        </div>

        {/* No Products Message */}
        {displayProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบสินค้า</h3>
            <p className="text-gray-600 mb-6">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</p>
            <button
              onClick={() => navigate('/shop')}
              className="btn-primary"
            >
              ดูสินค้าทั้งหมด
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Shop