import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Alert
} from 'antd';
import {
  TeamOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { studentAPI } from '../services/api';
import type { Student } from '../types';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

interface DashboardStats {
  totalStudents: number;
  recentUpdates: Student[];
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    recentUpdates: [],
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []); const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const students = await studentAPI.getStudents();
      console.log('学生数据:', students);
      const totalStudents = students.length;
      const recentUpdates = students.slice(0, 5);
      setStats({
        totalStudents,
        recentUpdates
      });
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentColumns: ColumnsType<Student> = [
    {
      title: '学号',
      dataIndex: 'student_id',
      key: 'student_id',
      width: 100,
    },
    {
      title: '姓名',
      dataIndex: 'student_name',
      key: 'student_name',
      width: 100,
    },
    {
      title: '班级',
      dataIndex: 'class_name',
      key: 'class_name',
      width: 150,
    },
  ];

  return (
    <div>
      {/* 欢迎信息 */}
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle">
          <Col flex="auto">
            <Title level={3} style={{ marginBottom: 8 }}>
              欢迎回来，{user?.name}！
            </Title>
            <Text type="secondary">
              {user?.role === 'teacher'
                ? '这里是您的教学管理面板，可以查看学生信息。'
                : '这里是您的学习面板，可以查看你的个人信息。'
              }
            </Text>
          </Col>
        </Row>
      </Card>

      {user?.role === 'teacher' ? (
        // 教师仪表盘
        <>
          {/* 统计卡片 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="学生总数"
                  value={stats.totalStudents}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 最近更新 */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="最近更新的学生" loading={loading}>
                <Table
                  columns={recentColumns}
                  dataSource={stats.recentUpdates}
                  pagination={false}
                  size="small"
                  rowKey="id"
                />
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        // 学生仪表盘
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Alert
              message="学生功能"
              description="学生面板功能正在开发中，敬请期待！您可以在侧边栏查看您的个人信息。"
              type="info"
              showIcon
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
