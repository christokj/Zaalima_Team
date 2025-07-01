import React from 'react'

function DashboardCard({ title, count, color }) {
    return (
        <div className={`p-5 rounded-xl shadow-lg ${color}`}>
            <h2 className="text-xl">{title}</h2>
            <p className="text-4xl font-bold">{count}</p>
        </div>

    )
}

export default DashboardCard