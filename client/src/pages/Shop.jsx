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
    <div className='flex gap-6'>

      {/* Sidebar Categories */}
      <aside className='w-1/4 p-6 bg-white rounded-xl shadow-soft h-fit sticky top-24 hidden lg:block'>
        <h3 className='text-xl font-display font-semibold mb-6 text-secondary-900'>หมวดหมู่สินค้า</h3>
        <div className='space-y-2'>
          <button
            onClick={()=> navigate('/shop')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              !params.get('category') 
                ? 'bg-primary-500 text-white shadow-medium' 
                : 'hover:bg-primary-50 hover:text-primary-600 text-secondary-700'
            }`}
          >
            ทั้งหมด
          </button>
          {categories.map((c)=> (
            <button
              key={c.id}
              onClick={()=> navigate(`/shop?category=${c.id}`)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                params.get('category')===String(c.id) 
                  ? 'bg-primary-500 text-white shadow-medium' 
                  : 'hover:bg-primary-50 hover:text-primary-600 text-secondary-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Product */}
      <div className='flex-1'>
        {/* Sort Controls */}
        <div className='bg-white rounded-xl shadow-soft p-6 mb-6'>
          <div className='flex flex-wrap items-center gap-3'>
            <span className='text-secondary-600 font-medium'>เรียงโดย:</span>
            <div className='flex flex-wrap gap-2'>
              <button 
                onClick={()=>setSort('relevant')} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  sort==='relevant'
                    ? 'bg-primary-500 text-white shadow-medium' 
                    : 'bg-secondary-100 hover:bg-primary-50 hover:text-primary-600 text-secondary-700'
                }`}
              >
                เกี่ยวข้อง
              </button>
              <button 
                onClick={()=>setSort('latest')} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  sort==='latest'
                    ? 'bg-primary-500 text-white shadow-medium' 
                    : 'bg-secondary-100 hover:bg-primary-50 hover:text-primary-600 text-secondary-700'
                }`}
              >
                ล่าสุด
              </button>
              <button 
                onClick={()=>setSort('bestseller')} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  sort==='bestseller'
                    ? 'bg-primary-500 text-white shadow-medium' 
                    : 'bg-secondary-100 hover:bg-primary-50 hover:text-primary-600 text-secondary-700'
                }`}
              >
                สินค้าขายดี
              </button>
              <button 
                onClick={()=> setSort(sort==='price-asc'?'price-desc':'price-asc')} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  sort.startsWith('price')
                    ? 'bg-primary-500 text-white shadow-medium' 
                    : 'bg-secondary-100 hover:bg-primary-50 hover:text-primary-600 text-secondary-700'
                }`}
              >
                ราคา {sort==='price-asc'?'▲':'▼'}
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {displayProducts.map((item,index)=>
            <ProductCard key={index} item={item}/>
          )}
        </div>
      </div>

    </div>
  )
}

export default Shop