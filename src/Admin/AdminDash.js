import React from 'react';
import AdminNav from "./AdminUI/AdminNav";
import AdminSidebar from "./AdminUI/AdminSidebar";
import '../Admin/AdminUI/admin.css';

const AdminDash = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <AdminNav />
            <div style={{ display: 'flex', flex: 1 }}>
                <AdminSidebar />
            </div>
        </div>
    );
};

export default AdminDash;