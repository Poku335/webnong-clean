import { useEffect, useMemo, useState } from 'react'
import { 
  Package, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { getOrdersAdmin } from '../../api/admin'
import useEcomStore from '../../store/ecom-store'
import { numberFormat } from '../../utils/number'

const Dashboard = () => {
  const token = useEcomStore(s=>s.token)
  const user = useEcomStore(s=>s.user)
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    if(!token) {
      console.log('No token found, user needs to login')
      return
    }
    getOrdersAdmin(token).then(res=> setOrders(res.data)).catch(err => {
      console.error('Error fetching orders:', err)
      if(err.response?.status === 401) {
        console.log('Token expired or invalid, user needs to login again')
      }
    })
  },[token])

  const totalRevenue = useMemo(()=> orders.reduce((s,o)=> s + (o.amount || 0), 0), [orders])
  const totalOrders = orders.length
  const completed = orders.filter(o=> o.orderStatus === 'ชำระเงินแล้ว').length
  const processing = orders.filter(o=> o.orderStatus === 'รอดำเนินการ').length

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


  // ถ้าไม่มี token หรือ user แสดงข้อความให้ login
  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">กรุณาเข้าสู่ระบบ</h2>
          <p className="text-gray-600 mb-6">คุณต้องเข้าสู่ระบบเพื่อดูข้อมูล Dashboard</p>
          <a 
            href="/login" 
            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors duration-200"
          >
            เข้าสู่ระบบ
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-orange-500" />
                แผงควบคุม
              </h1>
              <p className="text-gray-600">ภาพรวมการขายและสถิติของร้านค้า</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 px-4 py-2 rounded-xl">
                <span className="text-orange-700 font-semibold text-sm">รายได้รวม: {numberFormat(totalRevenue)} บาท</span>
              </div>
              <div className="bg-blue-100 px-4 py-2 rounded-xl">
                <span className="text-blue-700 font-semibold text-sm">คำสั่งซื้อ: {totalOrders}</span>
              </div>
            </div>
          </div>
        </div>
      
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium flex items-center gap-1">
                  รายได้รวม
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{numberFormat(totalRevenue)} บาท</div>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">฿</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  คำสั่งซื้อทั้งหมด
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</div>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  เสร็จสมบูรณ์
                </div>
                <div className="text-2xl font-bold text-green-600 mt-1">{completed}</div>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  กำลังดำเนินการ
                </div>
                <div className="text-2xl font-bold text-yellow-600 mt-1">{processing}</div>
              </div>
              <div className="w-12 h-12 bg-yellow-200 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Sales Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ยอดขาย 7 วันล่าสุด - Card Layout */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                ยอดขาย 7 วันล่าสุด
              </h3>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">รายวัน</div>
            </div>
            
            <div className="space-y-3">
              {last7Days.map((day, index) => {
                const isToday = index === last7Days.length - 1;
                const isYesterday = index === last7Days.length - 2;
                const maxValue = Math.max(...last7Days.map(d => d.value));
                const percentage = maxValue > 0 ? (day.value / maxValue) * 100 : 0;
                
                return (
                  <div
                    key={day.label}
                    className={`p-4 rounded-xl border-2 transition-shadow duration-200 hover:shadow-md ${
                      isToday 
                        ? 'bg-green-100 border-green-200' 
                        : isYesterday
                        ? 'bg-blue-100 border-blue-200'
                        : 'bg-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isToday 
                            ? 'bg-green-500 text-white' 
                            : isYesterday
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-400 text-white'
                        }`}>
                          <span className="text-sm font-bold">{day.label}</span>
                        </div>
                        <div>
                          <p className={`font-semibold ${isToday ? 'text-green-800' : isYesterday ? 'text-blue-800' : 'text-gray-800'}`}>
                            {day.value > 0 ? numberFormat(day.value) : 'ไม่มียอดขาย'}
                          </p>
                          <p className="text-xs text-gray-500">บาท</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${isToday ? 'text-green-600' : isYesterday ? 'text-blue-600' : 'text-gray-600'}`}>
                          {percentage.toFixed(1)}%
                        </div>
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              isToday 
                                ? 'bg-green-500' 
                                : isYesterday
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-orange-100 rounded-xl border border-orange-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">ยอดขายรวม 7 วัน</p>
                <p className="text-2xl font-bold text-orange-600">
                  {numberFormat(last7Days.reduce((sum, day) => sum + day.value, 0))} บาท
                </p>
              </div>
            </div>
          </div>

          {/* สถานะคำสั่งซื้อ - Card Layout */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                สถานะคำสั่งซื้อ
              </h3>
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">ทั้งหมด {totalOrders} คำสั่ง</div>
            </div>
            
            <div className="space-y-4">
              {/* Completed Orders */}
              <div className="p-4 bg-green-100 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">เสร็จสมบูรณ์</p>
                      <p className="text-sm text-green-600">คำสั่งซื้อที่เสร็จสิ้นแล้ว</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{completed}</p>
                    <p className="text-xs text-green-500">
                      {totalOrders > 0 ? ((completed / totalOrders) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Processing Orders */}
              <div className="p-4 bg-yellow-100 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-800">กำลังดำเนินการ</p>
                      <p className="text-sm text-yellow-600">คำสั่งซื้อที่กำลังดำเนินการ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">{processing}</p>
                    <p className="text-xs text-yellow-500">
                      {totalOrders > 0 ? ((processing / totalOrders) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Pending Orders */}
              <div className="p-4 bg-red-100 rounded-xl border border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">รอดำเนินการ</p>
                      <p className="text-sm text-red-600">คำสั่งซื้อที่รอการดำเนินการ</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{totalOrders - completed - processing}</p>
                    <p className="text-xs text-red-500">
                      {totalOrders > 0 ? (((totalOrders - completed - processing) / totalOrders) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard