import React from 'react';
import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onBack?: () => void;
  loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onBack, loading = false }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    await onLogin(values);
  };

  return (
    <Card className="login-card">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div className="login-header">
          {onBack && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className="back-button"
            />
          )}
          <div className="company-branding">
            <div className="company-logo" />
            <Text strong className="company-name">Company</Text>
          </div>
        </div>

        {/* Title */}
        <div className="login-title">
          <Title level={2} className="login-title-text">
            Sign in to your account to continue
          </Title>
        </div>

        {/* Form */}
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              placeholder="Email"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="Password"
              className="login-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="login-button"
              block
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
};

export default LoginForm;
