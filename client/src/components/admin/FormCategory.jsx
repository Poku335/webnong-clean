// rafce
import React, { useState, useEffect } from 'react'
import { createCategory, listCategory, removeCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'
import CategoryImageUpload from './CategoryImageUpload'
import EditCategoryModal from './EditCategoryModal'

const FormCategory = () => {
    const token = useEcomStore((state) => state.token)
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [editingCategory, setEditingCategory] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const categories = useEcomStore((state)=>state.categories)
    const getCategory = useEcomStore((state)=>state.getCategory)

    useEffect(() => {
        getCategory(token)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name) {
            return toast.warning('กรุณากรอกชื่อหมวดหมู่')
        }
        try {
            // Create new category only
            const res = await createCategory(token, { name, image })
            toast.success(`เพิ่ม "${res.data.name}" สำเร็จ`)
            
            // Clear form
            setName('')
            setImage('')
            getCategory(token)
        } catch (err) {
            console.log(err)
            toast.error('เพิ่มหมวดหมู่ไม่สำเร็จ')
        }
    }

    const handleRemove = async(id)=>{
        if (!window.confirm('คุณต้องการลบหมวดหมู่นี้หรือไม่?')) return
        
        try{
            const res = await removeCategory(token,id)
            toast.success(`ลบ "${res.data.name}" สำเร็จ`)
            getCategory(token)
        }catch(err){
            console.log(err)
            toast.error('ไม่สามารถลบหมวดหมู่นี้ได้')
        }
    }

    const handleEdit = (category) => {
        setEditingCategory(category)
        setIsEditModalOpen(true)
    }

    const handleEditSuccess = () => {
        getCategory(token)
    }

    return (
        <div className='container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-md'>
            <h1 className='text-2xl font-bold mb-4 text-gray-800'>Category Management</h1>

            <form className='space-y-4 mb-6' onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ชื่อหมวดหมู่ *
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                        type='text'
                        placeholder='กรอกชื่อหมวดหมู่'
                    />
                </div>
                
                <CategoryImageUpload image={image} setImage={setImage} />
                
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md'
                >
                    เพิ่มหมวดหมู่
                </button>
            </form>

            <hr className='my-4 border-gray-200' />

            <ul className='space-y-3'>
                {categories.map((item, index) => (
                    <li
                        key={index}
                        className='flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-150'
                    >
                        <div className='flex items-center gap-3'>
                            {item.image ? (
                                <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className='w-10 h-10 rounded-lg object-cover'
                                />
                            ) : (
                                <div className='w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center'>
                                    <span className='text-blue-600 text-lg'>📦</span>
                                </div>
                            )}
                            <span className='text-gray-700 font-medium'>{item.name}</span>
                        </div>
                        <div className='flex gap-2'>
                            <button
                                onClick={()=>handleEdit(item)}
                                className='bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm'
                            >
                                แก้ไข
                            </button>
                            <button
                                onClick={()=>handleRemove(item.id)}
                                className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm'
                            >
                                ลบ
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Edit Category Modal */}
            <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                category={editingCategory}
                onSuccess={handleEditSuccess}
            />
        </div>
    )
}

export default FormCategory
