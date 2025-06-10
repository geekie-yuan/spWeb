import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Radio,
  message,
  Divider,
  Typography
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import type { LoginRequest } from '../types';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/dashboard';

  const onFinish = async (values: LoginRequest) => {
    console.log('开始登录处理:', values);
    setLoading(true);

    try {
      const response = await authAPI.login(values);
      const { user, token } = response.data;

      console.log('登录成功，用户信息:', user);
      login(user, token);
      message.success('登录成功！');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('登录失败:', error);
      const errorMessage = error instanceof Error ? error.message : '登录失败';
      message.error(errorMessage);

      // 确保登录失败时表单状态保持，不重置
      console.log('登录失败，保持表单状态');
    } finally {
      setLoading(false);
      console.log('登录处理结束');
    }
  };

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <Card
        style={{
          width: 400,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px'
        }}
      >        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
            学生信息管理系统
          </Title>
          <Text type="secondary">请选择身份并登录</Text>
        </div>        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ role: 'teacher' }}
          preserve={false}
        >
          <Form.Item
            name="role"
            rules={[{ required: true, message: '请选择登录身份!' }]}
          >
            <Radio.Group
              style={{ width: '100%', textAlign: 'center' }}
              size="large"
            >
              <Radio.Button value="teacher" style={{ flex: 1 }}>
                教师
              </Radio.Button>
              <Radio.Button value="student" style={{ flex: 1 }}>
                学生
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>演示账号</Divider>

        <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
          <div>用户名: admin001</div>
          <div>密码: admin123</div>
          <div style={{ marginTop: 8, color: '#999' }}>
            (教师和学生都可以使用此账号)
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
