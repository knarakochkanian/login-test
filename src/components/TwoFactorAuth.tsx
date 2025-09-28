import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';

const { Title, Text } = Typography;

interface TwoFactorAuthProps {
  onVerify: (code: string) => void;
  onBack: () => void;
  onGetNewCode: () => void;
  loading?: boolean;
  error?: string;
}

const TwoFactorAuth: React.FC<TwoFactorAuthProps> = ({ 
  onVerify, 
  onBack, 
  onGetNewCode, 
  loading = false,
  error 
}) => {
  const [form] = Form.useForm();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(InputRef | null)[]>([]);

  useEffect(() => {
    if (error) {
      setCode(['', '', '', '', '', '']);
    }
  }, [error]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (i < 6 && /^\d$/.test(char)) {
          newCode[i] = char;
        }
      });
      setCode(newCode);
      
      const nextIndex = Math.min(pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else if (/^\d$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      onVerify(fullCode);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');
  const isFormValid = isCodeComplete && !error;

  return (
    <Card className="two-fa-card">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div className="two-fa-header">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            className="back-button"
          />
          <div className="company-branding">
            <div className="company-logo" />
            <Text strong className="company-name">Company</Text>
          </div>
        </div>

        {/* Title and Instructions */}
        <div className="two-fa-content">
          <Title level={2} className="two-fa-title">
            Two-Factor Authentication
          </Title>
          <Text className="two-fa-instructions">
            Enter the 6-digit code from the Google Authenticator app
          </Text>
        </div>

        {/* Code Input */}
        <Form form={form} onFinish={handleSubmit}>
          <div className="code-input-container">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`code-input ${error ? 'error' : ''}`}
                maxLength={1}
                autoComplete="off"
              />
            ))}
          </div>
          
          {error && (
            <div className="error-message">
              <Text type="danger">{error}</Text>
            </div>
          )}

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={!isFormValid}
              className="continue-button"
              block
            >
              Continue
            </Button>
            
            <Button
              type="link"
              onClick={onGetNewCode}
              className="get-new-button"
              block
            >
              Get new
            </Button>
          </Space>
        </Form>
      </Space>
    </Card>
  );
};

export default TwoFactorAuth;
