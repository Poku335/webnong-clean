import { useEffect, useMemo, useState } from 'react'
import { getOrdersAdmin } from '../../api/admin'
import useEcomStore from '../../store/ecom-store'
import { numberFormat } from '../../utils/number'

const Dashboard = () => {
  const token = useEcomStore(s=>s.token)
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    if(!token) return
    getOrdersAdmin(token).then(res=> setOrders(res.data)).catch(console.error)
  },[token])

  const totalRevenue = useMemo(()=> orders.reduce((s,o)=> s + (o.amount || 0), 0), [orders])
  const totalOrders = orders.length
  const completed = orders.filter(o=> o.orderStatus === 'Completed').length
  const processing = orders.filter(o=> o.orderStatus === 'Processing').length

  const last7Days = useMemo(()=>{
    const days = [...Array(7)].map((_,i)=>{
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0,0,0,0);
      return d;
    })
    return days.map((d)=>{
      const start = d.getTime();
      const end = start + 24*60*60*1000 - 1;
      const sum = orders
        .filter(o=>{
          const t = new Date(o.createdAt).getTime();
          return t >= start && t <= end;
        })
        .reduce((s,o)=> s + (o.amount || 0), 0)
      return { label: d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' }), value: sum }
    })
  },[orders])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">แผงควบคุม</h1>
        <p className="text-secondary-600">ภาพรวมการขายและสถิติของร้านค้า</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary-600 text-sm font-medium">รายได้รวม</div>
              <div className="text-2xl font-bold text-secondary-900 mt-1">{numberFormat(totalRevenue)}</div>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-primary-600 text-xl">💰</span>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary-600 text-sm font-medium">คำสั่งซื้อทั้งหมด</div>
              <div className="text-2xl font-bold text-secondary-900 mt-1">{totalOrders}</div>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <span className="text-accent-600 text-xl">📦</span>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary-600 text-sm font-medium">เสร็จสมบูรณ์</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{completed}</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-secondary-600 text-sm font-medium">กำลังดำเนินการ</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">{processing}</div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-semibold text-secondary-900">ยอดขาย 7 วันล่าสุด</h3>
          <div className="text-sm text-secondary-600">รายวัน</div>
        </div>
        <div className="flex items-end gap-3 h-48">
          {last7Days.map((d)=>{
            const max = Math.max(1, ...last7Days.map(x=>x.value))
            const h = Math.round((d.value / max) * 100)
            return (
              <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-300 hover:from-primary-600 hover:to-primary-500 cursor-pointer" 
                  style={{ height: `${Math.max(h, 8)}%` }} 
                  title={`${d.label}: ${numberFormat(d.value)}`} 
                />
                <div className="text-xs text-secondary-500 font-medium">{d.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard