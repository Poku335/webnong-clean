// rafce
import React, { useState, useEffect } from 'react'
import { createCategory, listCategory, removeCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'

const FormCategory = () => {
    const token = useEcomStore((state) => state.token)
    const [name, setName] = useState('')
    const categories = useEcomStore((state)=>state.categories)
    const getCategory = useEcomStore((state)=>state.getCategory)

    useEffect(() => {
        getCategory(token)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name) {
            return toast.warning('Please fill data')
        }
        try {
            const res = await createCategory(token, { name })
            toast.success(`เพิ่ม "${res.data.name}" สำเร็จ`)
            setName('') // clear input
            getCategory(token)
        } catch (err) {
            console.log(err)
            toast.error('Failed to add category')
        }
    }

    const handleRemove = async(id)=>{
        try{
            const res = await removeCategory(token,id)
            toast.success(`ลบ "${res.data.name}" สำเร็จ`)
            getCategory(token)
        }catch(err){
            console.log(err)
            toast.error('ไม่สามลบ ประเภทสินค้านี้')
        }
    }

    return (
        <div className='container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-md'>
            <h1 className='text-2xl font-bold mb-4 text-gray-800'>Category Management</h1>

            <form className='flex gap-2 mb-6' onSubmit={handleSubmit}>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    type='text'
                    placeholder='กรอกชื่อ ประเภทสินค้า'
                />
                <button
                    type='submit'
                    className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md'
                >
                    Add
                </button>
            </form>

            <hr className='my-4 border-gray-200' />

            <ul className='space-y-3'>
                {categories.map((item, index) => (
                    <li
                        key={index}
                        className='flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-150'
                    >
                        <span className='text-gray-700 font-medium'>{item.name}</span>
                        <button
                            onClick={()=>handleRemove(item.id)}
                            className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200'
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FormCategory
