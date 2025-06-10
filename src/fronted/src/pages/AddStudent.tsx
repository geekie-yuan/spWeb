import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Divider,
  message,
  Space
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { studentAPI } from '../services/api';
import type { StudentForm } from '../types';

const { Option } = Select;

const AddStudent: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMetadata();
  }, []);  // fetchMetadata 只获取班级列表
  const fetchMetadata = async () => {
    try {
      const classes = await studentAPI.getClasses();
      setClasses(classes);
    } catch (error) {
      console.error('获取元数据失败:', error);
    }
  };

  const handleSubmit = async (values: StudentForm) => {
    setLoading(true);
    try {
      await studentAPI.createStudent(values);
      message.success('添加学生成功！');
      navigate('/students/list');
    } catch (error) {
      message.error('添加学生失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div>
      {/* 页面头部 */}
      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/students/list')}
              >
                返回学生列表
              </Button>
              <Divider type="vertical" />
              <h2 style={{ margin: 0 }}>添加新学生</h2>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 表单卡片 */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            gender: '男'
          }}
        >
          {/* 基本信息 */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16, color: '#1890ff' }}>基本信息</h3>
            <Row gutter={24}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="student_id"
                  label="学号"
                  rules={[
                    { required: true, message: '请输入学号' },
                    { pattern: /^\d{7}$/, message: '学号应为7位数字' }
                  ]}
                >
                  <Input
                    placeholder="请输入7位学号"
                    maxLength={7}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="student_name"
                  label="姓名"
                  rules={[
                    { required: true, message: '请输入姓名' },
                    { min: 2, max: 10, message: '姓名长度应在2-10个字符之间' }
                  ]}
                >
                  <Input placeholder="请输入学生姓名" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="gender"
                  label="性别"
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Select placeholder="请选择性别">
                    <Option value="男">男</Option>
                    <Option value="女">女</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="class_name"
                  label="班级"
                  rules={[{ required: true, message: '请选择班级' }]}
                >
                  <Select
                    placeholder="请选择班级"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {classes.map(cls => (
                      <Option key={cls} value={cls}>{cls}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          {/* 操作按钮 */}
          <Row justify="center" gutter={16}>
            <Col>
              <Button
                size="large"
                onClick={handleReset}
              >
                重置表单
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                保存学生信息
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default AddStudent;
