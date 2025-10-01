// rafce
import React, { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import {
    createProduct,
    readProduct,
    listProduct,
    updateProduct
} from '../../api/product'
// import { toast } from 'react-toastify' // Replaced with window.alert
import Uploadfile from './Uploadfile'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Package, 
  Edit, 
  DollarSign,
  Hash,
  Filter,
  Image as ImageIcon,
  ArrowLeft,
  Save
} from 'lucide-react'

const initialState = {
    title: "Core i7",
    description: "desc",
    price: 200,
    quantity: 20,
    categoryId: '',
    images: []
}
const FormEditProduct = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const token = useEcomStore((state) => state.token)
    const getCategory = useEcomStore((state) => state.getCategory)
    const categories = useEcomStore((state) => state.categories)

    const [form, setForm] = useState(initialState)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // code
        getCategory()
        fetchProduct(token, id, form)
    }, [])

    const fetchProduct = async (token, id, form) => {
        try {
            setLoading(true)
            const res = await readProduct(token, id, form)
            console.log('res from backend', res)
            setForm(res.data)
        } catch (err) {
            console.log('Err fetch data', err)
            alert('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า')
        } finally {
            setLoading(false)
        }
    }
    console.log(form)

    const handleOnChange = (e) => {
        console.log(e.target.name, e.target.value)
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await updateProduct(token, id, form)
            console.log(res)
            // alert(`แก้ไขข้อมูลสินค้า "${res.data.title}" สำเร็จ`) // ไม่แสดง alert สำหรับการกระทำปกติ
            navigate('/admin/product')
        } catch (err) {
            console.log(err)
            alert('เกิดข้อผิดพลาดในการแก้ไขสินค้า')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">กำลังโหลดข้อมูลสินค้า...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                                <Edit className="w-8 h-8 text-orange-500" />
                                แก้ไขสินค้า
                            </h1>
                            <p className="text-gray-600">แก้ไขข้อมูลสินค้า: <span className="font-semibold text-orange-600">{form.title}</span></p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4" />
                                    ราคา: {form.price} บาท
                                </span>
                                <span className="flex items-center gap-1">
                                    <Hash className="w-4 h-4" />
                                    จำนวน: {form.quantity} ชิ้น
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/product')}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                กลับ
                            </button>
                        </div>
                    </div>
                </div>

                {/* Current Product Info */}
                {form.images && form.images.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <ImageIcon className="w-5 h-5 text-orange-500" />
                            <h2 className="text-xl font-bold text-gray-900">รูปภาพปัจจุบัน</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {form.images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Edit Product Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Package className="w-5 h-5 text-orange-500" />
                        <h2 className="text-xl font-bold text-gray-900">แก้ไขข้อมูลสินค้า</h2>
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
                                    <DollarSign className="w-4 h-4 inline mr-1" />
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
                                    <Hash className="w-4 h-4 inline mr-1" />
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
                                    <Package className="w-4 h-4 inline mr-1" />
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
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="text-sm text-gray-600 mb-3">อัปโหลดรูปภาพใหม่ (รูปภาพเดิมจะถูกแทนที่)</p>
                                <Uploadfile form={form} setForm={setForm} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/product')}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                ยกเลิก
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                บันทึกการแก้ไข
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default FormEditProduct