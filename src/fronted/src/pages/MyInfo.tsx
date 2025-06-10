import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Avatar,
  Typography,
  Alert
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { studentAPI } from '../services/api';
import type { Student } from '../types';

const { Title, Text } = Typography;

const MyInfo: React.FC = () => {
  const [studentInfo, setStudentInfo] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudentInfo();
  }, []); const fetchStudentInfo = async () => {
    try {
      const students = await studentAPI.getStudents();
      const mockStudent = students[0];
      if (mockStudent) {
        setStudentInfo(mockStudent);
      }
    } catch (error) {
      console.error('获取学生信息失败:', error);
    }
  };

  if (!studentInfo) {
    return (
      <Alert
        message="提示"
        description="暂无学生信息，请联系管理员。"
        type="info"
        showIcon
      />
    );
  }

  return (
    <Card>
      <Row gutter={16} align="middle">
        <Col xs={24} sm={8} md={6} lg={4} style={{ textAlign: 'center' }}>
          <Avatar size={100} icon={<UserOutlined />} />
          <div style={{ marginTop: 16 }}>
            <Title level={4} style={{ marginBottom: 4 }}>{studentInfo.student_name}</Title>
            <Text type="secondary">学号: {studentInfo.student_id}</Text>
          </div>
        </Col>
        <Col xs={24} sm={16} md={18} lg={20}>
          <Descriptions title="基本信息" bordered column={1}>
            <Descriptions.Item label="姓名">{studentInfo.student_name}</Descriptions.Item>
            <Descriptions.Item label="学号">{studentInfo.student_id}</Descriptions.Item>
            <Descriptions.Item label="性别">{studentInfo.gender === '男' ? '男' : '女'}</Descriptions.Item>
            <Descriptions.Item label="班级">{studentInfo.class_name}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default MyInfo;
