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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* กราฟแท่งยอดขาย 7 วันล่าสุด */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-semibold text-secondary-900">ยอดขาย 7 วันล่าสุด</h3>
            <div className="text-sm text-secondary-600">รายวัน</div>
          </div>
          <div className="flex items-end gap-2 h-48">
            {last7Days.map((d, index)=>{
              const max = Math.max(1, ...last7Days.map(x=>x.value))
              const h = Math.round((d.value / max) * 100)
              const isToday = index === last7Days.length - 1
              return (
                <div key={d.label} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="relative">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg ${
                        isToday 
                          ? 'bg-gradient-to-t from-green-500 to-green-400 hover:from-green-600 hover:to-green-500' 
                          : 'bg-gradient-to-t from-primary-500 to-primary-400 hover:from-primary-600 hover:to-primary-500'
                      }`}
                      style={{ height: `${Math.max(h, 8)}%` }} 
                      title={`${d.label}: ${numberFormat(d.value)} บาท`} 
                    />
                    {d.value > 0 && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {numberFormat(d.value)} บาท
                      </div>
                    )}
                  </div>
                  <div className={`text-xs font-medium ${isToday ? 'text-green-600 font-bold' : 'text-secondary-500'}`}>
                    {d.label}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-secondary-600">
              ยอดขายรวม 7 วัน: <span className="font-semibold text-primary-600">{numberFormat(last7Days.reduce((sum, day) => sum + day.value, 0))} บาท</span>
            </div>
          </div>
        </div>

        {/* กราฟวงกลมแสดงสถานะคำสั่งซื้อ */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-display font-semibold text-secondary-900">สถานะคำสั่งซื้อ</h3>
            <div className="text-sm text-secondary-600">ทั้งหมด {totalOrders} คำสั่ง</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                {/* Completed orders */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={`${(completed / totalOrders) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
                {/* Processing orders */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray={`${(processing / totalOrders) * 251.2} 251.2`}
                  strokeDashoffset={`-${(completed / totalOrders) * 251.2}`}
                  strokeLinecap="round"
                />
                {/* Pending orders */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeDasharray={`${((totalOrders - completed - processing) / totalOrders) * 251.2} 251.2`}
                  strokeDashoffset={`-${((completed + processing) / totalOrders) * 251.2}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-900">{totalOrders}</div>
                  <div className="text-sm text-secondary-600">คำสั่งซื้อ</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-secondary-600">เสร็จสมบูรณ์</span>
              </div>
              <span className="text-sm font-semibold text-secondary-900">{completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-secondary-600">กำลังดำเนินการ</span>
              </div>
              <span className="text-sm font-semibold text-secondary-900">{processing}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-secondary-600">รอดำเนินการ</span>
              </div>
              <span className="text-sm font-semibold text-secondary-900">{totalOrders - completed - processing}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard