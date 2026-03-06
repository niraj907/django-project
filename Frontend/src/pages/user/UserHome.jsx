import React from 'react';
import { useAuthStore } from '../../store/authStore';

const UserHome = () => {
    const { user } = useAuthStore();

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
            <p className="text-gray-500 text-sm mb-6">Welcome back, {user?.name}!</p>

            {/* Profile Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-gray-800 font-medium">{user?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium">{user?.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-sm font-medium capitalize">{user?.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
