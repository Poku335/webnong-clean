// rafce
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Resize from 'react-image-file-resizer'
import { removeFiles, uploadFiles } from '../../api/product'
import useEcomStore from '../../store/ecom-store'
import { Loader, X } from 'lucide-react';

const CategoryImageUpload = ({ image, setImage }) => {
    const token = useEcomStore((state) => state.token)
    const [isLoading, setIsLoading] = useState(false)

    const handleOnChange = (e) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setIsLoading(true)
            const file = files[0]

            // Validate
            if (!file.type.startsWith('image/')) {
                toast.error('กรุณาเลือกไฟล์รูปภาพ')
                setIsLoading(false)
                return
            }

            // Image Resize 
            Resize.imageFileResizer(
                file,
                400,
                400,
                "JPEG",
                100,
                0,
                (data) => {
                    // Upload to backend
                    uploadFiles(token, data)
                        .then((res) => {
                            console.log(res)
                            setImage(res.data.url)
                            setIsLoading(false)
                            toast.success('อัปโหลดรูปภาพสำเร็จ')
                        })
                        .catch((err) => {
                            console.log(err)
                            setIsLoading(false)
                            toast.error('อัปโหลดรูปภาพไม่สำเร็จ')
                        })
                },
                "base64"
            )
        }
    }

    const handleDelete = () => {
        if (image) {
            // Extract public_id from URL if needed
            const urlParts = image.split('/')
            const publicId = urlParts[urlParts.length - 1].split('.')[0]
            
            removeFiles(token, publicId)
                .then((res) => {
                    setImage('')
                    toast.success('ลบรูปภาพสำเร็จ')
                })
                .catch((err) => {
                    console.log(err)
                    // Even if delete fails, clear the image from form
                    setImage('')
                    toast.success('ลบรูปภาพสำเร็จ')
                })
        }
    }

    return (
        <div className='my-4'>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                รูปภาพหมวดหมู่ (ไม่บังคับ)
            </label>
            
            <div className='flex items-center gap-4'>
                {isLoading && <Loader className='w-8 h-8 animate-spin text-blue-500'/>}
                
                {/* Image Preview */}
                {image && (
                    <div className='relative'>
                        <img
                            className='w-24 h-24 object-cover rounded-lg border-2 border-gray-200'
                            src={image}
                            alt="Category preview"
                        />
                        <button
                            onClick={handleDelete}
                            className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors'
                        >
                            <X className='w-4 h-4' />
                        </button>
                    </div>
                )}

                {/* Upload Button */}
                <div className="flex-1">
                    <input
                        onChange={handleOnChange}
                        type='file'
                        accept="image/*"
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CategoryImageUpload
