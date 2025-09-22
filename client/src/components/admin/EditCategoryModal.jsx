// rafce
import React, { useState, useEffect } from 'react'
import { updateCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'
import CategoryImageUpload from './CategoryImageUpload'
import { X } from 'lucide-react'

const EditCategoryModal = ({ isOpen, onClose, category, onSuccess }) => {
    const token = useEcomStore((state) => state.token)
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (category) {
            setName(category.name || '')
            setImage(category.image || '')
        }
    }, [category])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) {
            return toast.warning('กรุณากรอกชื่อหมวดหมู่')
        }

        setLoading(true)
        try {
            const res = await updateCategory(token, category.id, { name: name.trim(), image })
            toast.success(`แก้ไข "${res.data.name}" สำเร็จ`)
            onSuccess()
            onClose()
        } catch (err) {
            console.log(err)
            toast.error('แก้ไขหมวดหมู่ไม่สำเร็จ')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setName('')
        setImage('')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">แก้ไขหมวดหมู่</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                            required
                        />
                    </div>
                    
                    <CategoryImageUpload image={image} setImage={setImage} />
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            type='submit'
                            disabled={loading}
                            className='flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                        </button>
                        <button
                            type='button'
                            onClick={handleClose}
                            className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200'
                        >
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditCategoryModal
