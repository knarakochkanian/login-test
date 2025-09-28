import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface DashboardProps {
  onLogout: () => void;
  user?: {
    email: string;
    name?: string;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {
  return (
    <div className="dashboard-container">
      <Card className="dashboard-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="dashboard-header">
            <Title level={2}>Welcome to Dashboard</Title>
            <Text type="secondary">
              {user?.name || user?.email || 'User'}
            </Text>
          </div>
          
          <div className="dashboard-content">
            <Text>
              You have successfully logged in! This is your dashboard where you can manage your account and access various features.
            </Text>
          </div>
          
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={onLogout}
            className="logout-button"
          >
            Logout
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Dashboard;
