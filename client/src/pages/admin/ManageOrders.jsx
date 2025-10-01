// rafce
import React from 'react'
import { motion } from 'framer-motion'
import TableOrders from '../../components/admin/TableOrders'

const ManageOrders = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 p-6"
    >
      <TableOrders />
    </motion.div>
  )
}

export default ManageOrders