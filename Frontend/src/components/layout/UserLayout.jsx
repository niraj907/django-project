import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { userMenuItems } from '../../assets/constants/menuItems';

const UserLayout = () => {
    return (
        <DashboardLayout menuItems={userMenuItems}>
            <Outlet />
        </DashboardLayout>
    );
};

export default UserLayout;
