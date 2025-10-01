// rafce
import { useState, useEffect } from 'react'
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash, 
  Image as ImageIcon,
  Search,
  Package
} from 'lucide-react'
import { createCategory, removeCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'
// import { toast } from 'react-toastify' // Replaced with window.alert
import CategoryImageUpload from './CategoryImageUpload'
import EditCategoryModal from './EditCategoryModal'

const FormCategory = () => {
    const token = useEcomStore((state) => state.token)
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [editingCategory, setEditingCategory] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const categories = useEcomStore((state)=>state.categories)
    const getCategory = useEcomStore((state)=>state.getCategory)

    useEffect(() => {
        getCategory(token)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name) {
            return alert('กรุณากรอกชื่อหมวดหมู่')
        }
        try {
            // Create new category only
            const res = await createCategory(token, { name, image })
            // alert(`เพิ่ม "${res.data.name}" สำเร็จ`) // ไม่แสดง alert สำหรับการกระทำปกติ
            
            // Clear form
            setName('')
            setImage('')
            getCategory(token)
        } catch (err) {
            console.log(err)
            alert('เพิ่มหมวดหมู่ไม่สำเร็จ')
        }
    }

    const handleRemove = async(id)=>{
        if (!window.confirm('คุณต้องการลบหมวดหมู่นี้หรือไม่?')) return
        
        try{
            const res = await removeCategory(token,id)
            // alert(`ลบ "${res.data.name}" สำเร็จ`) // ไม่แสดง alert สำหรับการกระทำปกติ
            getCategory(token)
        }catch(err){
            console.log(err)
            alert('ไม่สามารถลบหมวดหมู่นี้ได้')
        }
    }

    const handleEdit = (category) => {
        setEditingCategory(category)
        setIsEditModalOpen(true)
    }

    const handleEditSuccess = () => {
        getCategory(token)
    }

    const filteredCategories = categories.filter((category) => {
        return !searchTerm || 
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
    })

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                <Tag className="w-8 h-8 text-orange-500" />
                                จัดการหมวดหมู่
                            </h1>
                            <p className="text-gray-600">เพิ่ม แก้ไข และจัดการหมวดหมู่สินค้าทั้งหมด</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-100 px-4 py-2 rounded-xl">
                                <span className="text-orange-700 font-semibold text-sm">ทั้งหมด: {categories.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Category Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Plus className="w-5 h-5 text-orange-500" />
                                <h2 className="text-xl font-bold text-gray-900">เพิ่มหมวดหมู่ใหม่</h2>
                            </div>
                            
                            <form className='space-y-4' onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Tag className="w-4 h-4 inline mr-1" />
                                        ชื่อหมวดหมู่ *
                                    </label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className='input-field'
                                        type='text'
                                        placeholder='กรอกชื่อหมวดหมู่'
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <ImageIcon className="w-4 h-4 inline mr-1" />
                                        รูปภาพหมวดหมู่
                                    </label>
                                    <CategoryImageUpload image={image} setImage={setImage} />
                                </div>
                                
                                <button
                                    type='submit'
                                    className='w-full btn-primary flex items-center justify-center gap-2'
                                >
                                    <Plus className="w-4 h-4" />
                                    เพิ่มหมวดหมู่
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Categories List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-orange-500" />
                                    รายการหมวดหมู่
                                </h2>
                                
                                {/* Search */}
                                <div className="w-64">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="ค้นหาหมวดหมู่"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="input-field pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {filteredCategories.map((item) => (
                                    <div
                                        key={item.id}
                                        className='flex justify-between items-center bg-gray-100 p-4 rounded-xl border border-gray-200 hover:bg-orange-100 hover:border-orange-200 transition-colors duration-200'
                                    >
                                            <div className='flex items-center gap-4'>
                                                {item.image ? (
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name}
                                                        className='w-12 h-12 rounded-xl object-cover shadow-md'
                                                    />
                                                ) : (
                                                    <div className='w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center shadow-md'>
                                                        <Package className='w-6 h-6 text-orange-600' />
                                                    </div>
                                                )}
                                                <div>
                                                    <span className='text-gray-900 font-semibold text-lg'>{item.name}</span>
                                                    <p className='text-sm text-gray-500'>หมวดหมู่สินค้า</p>
                                                </div>
                                            </div>
                                            <div className='flex gap-2'>
                                                <button
                                                    onClick={()=>handleEdit(item)}
                                                    className='btn-sm bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1 shadow-md hover:shadow-lg transition-colors duration-200'
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    แก้ไข
                                                </button>
                                                <button
                                                    onClick={()=>handleRemove(item.id)}
                                                    className='btn-sm bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 shadow-md hover:shadow-lg transition-colors duration-200'
                                                >
                                                    <Trash className="w-3 h-3" />
                                                    ลบ
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                
                                {filteredCategories.length === 0 && (
                                    <div className="text-center py-8">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">ไม่พบหมวดหมู่ที่ค้นหา</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Category Modal */}
                <EditCategoryModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    category={editingCategory}
                    onSuccess={handleEditSuccess}
                />
            </div>
        </div>
    )
}

export default FormCategory
