import React from 'react'
import { Outlet } from 'react-router-dom'
import MainNav from '../components/MainNav'

const LayoutUser = () => {
    return (
        <div className="min-h-screen bg-secondary-50">
            <MainNav />
            <main className="container-custom py-8">
                <Outlet />
            </main>
        </div>
    )
}

export default LayoutUser