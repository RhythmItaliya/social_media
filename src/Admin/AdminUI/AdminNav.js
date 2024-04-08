import { Layout, Menu, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import logoImage from '../../assets/vortex.png';
import './admin.css';

const { Header } = Layout;

const AdminNav = () => {
    return (
        <Header className='admin-nav p-0'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
                <Link to="/home">
                    <img src={logoImage} alt="Logo" style={{ width: '150px', height: 'auto', borderRadius: '5px', margin: '0' }} />
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Avatar icon={<UserOutlined />} />
                    <span className="username">Username</span>
                </div>
            </div>
        </Header>
    );
};

export default AdminNav;
