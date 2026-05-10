import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../services/propertyService';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        sold: 0,
        rented: 0,
        totalValue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getProperties();
                
                const calculatedStats = data.reduce((acc, curr) => {
                    acc.total += 1;
                    acc.totalValue += Number(curr.price) || 0;
                    
                    if (curr.status === 'available') acc.available += 1;
                    if (curr.status === 'sold') acc.sold += 1;
                    if (curr.status === 'rented') acc.rented += 1;
                    
                    return acc;
                }, { total: 0, available: 0, sold: 0, rented: 0, totalValue: 0 });
                
                setStats(calculatedStats);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data for dashboard', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin inline-block w-10 h-10 border-4 border-castelia-primary border-t-transparent rounded-full mb-4"></div>
                <p className="font-bold text-castelia-dark tracking-widest uppercase text-sm">Loading system metrics...</p>
            </div>
        );
    }

    return (
        <section className="space-y-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-castelia-dark tracking-tight">System Overview</h2>
                    <p className="text-gray-500 mt-2">Real-time metrics of the real estate catalog.</p>
                </div>
                <Link 
                    to="/properties"
                    className="text-castelia-primary font-bold hover:text-castelia-accent transition-colors flex items-center gap-2"
                >
                    Go to Catalog &rarr;
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-gray-400">Total Properties</p>
                    <p className="text-4xl font-black text-castelia-dark">{stats.total}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 border-l-4 border-l-castelia-primary">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-gray-400">Available</p>
                    <p className="text-4xl font-black text-castelia-dark">{stats.available}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-gray-400">Sold / Rented</p>
                    <p className="text-4xl font-black text-castelia-dark">{stats.sold + stats.rented}</p>
                </div>

                <div className="bg-castelia-primary p-6 rounded-2xl shadow-lg shadow-castelia-primary/20 flex flex-col justify-between h-32 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-white/80">Total Valuation</p>
                    <p className="text-3xl font-black tracking-tighter truncate">
                        ${stats.totalValue.toLocaleString()}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;