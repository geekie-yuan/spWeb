import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Card,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Row,
  Col
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { studentAPI } from '../services/api';
import type { Student, StudentForm } from '../types';

const { Search } = Input;
const { Option } = Select;

const StudentList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10); const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>();
  const [selectedGender, setSelectedGender] = useState<'男' | '女'>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [form] = Form.useForm();

  // 过滤学生数据
  const filteredStudents = students.filter(student => {
    const matchesKeyword = !searchKeyword ||
      student.student_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      student.student_id.includes(searchKeyword);
    const matchesClass = !selectedClass || student.class_name === selectedClass;
    const matchesGender = !selectedGender || student.gender === selectedGender;
    return matchesKeyword && matchesClass && matchesGender;
  });  // 获取学生列表
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const students = await studentAPI.getStudents();
      setStudents(students);
    } catch (error) {
      message.error('获取学生列表失败');
      console.error('获取学生列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);// 获取班级和科目列表
  const fetchMetadata = useCallback(async () => {
    try {
      const classes = await studentAPI.getClasses();
      setClasses(classes);
    } catch (error) {
      console.error('获取元数据失败:', error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  // 表格列定义
  const columns: ColumnsType<Student> = [
    {
      title: '学号',
      dataIndex: 'student_id',
      key: 'student_id',
      width: 120,
    },
    {
      title: '姓名',
      dataIndex: 'student_name',
      key: 'student_name',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: string) => (
        <Tag color={gender === '男' ? 'blue' : 'pink'}>
          {gender}
        </Tag>
      ),
    },
    {
      title: '班级',
      dataIndex: 'class_name',
      key: 'class_name',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个学生吗？"
            onConfirm={() => handleDelete(record.student_id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 处理添加学生
  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理编辑学生
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    form.setFieldsValue(student);
    setModalVisible(true);
  };

  // 处理删除学生
  const handleDelete = async (id: string) => {
    try {
      await studentAPI.deleteStudent(id);
      message.success('删除成功');
      fetchStudents();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的学生');
      return;
    }

    try {
      await studentAPI.batchDeleteStudents(selectedRowKeys as string[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      fetchStudents();
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: StudentForm) => {
    try {
      if (editingStudent) {
        await studentAPI.updateStudent(editingStudent.student_id, values);
        message.success('更新成功');
      } else {
        await studentAPI.createStudent(values);
        message.success('添加成功');
      }
      setModalVisible(false);
      fetchStudents();
    } catch (error) {
      message.error(editingStudent ? '更新失败' : '添加失败');
    }
  };

  // 表格选择配置
  const rowSelection: TableProps<Student>['rowSelection'] = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Search
              placeholder="搜索学号或姓名"
              onSearch={setSearchKeyword}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择班级"
              allowClear
              style={{ width: '100%' }}
              onChange={setSelectedClass}
            >
              {classes.map(cls => (
                <Option key={cls} value={cls}>{cls}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择性别"
              allowClear
              style={{ width: '100%' }}
              onChange={setSelectedGender}
            >
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchStudents}
              >
                刷新
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              添加学生
            </Button>
          </Col>
          <Col>
            <Popconfirm
              title="确定要删除选中的学生吗？"
              onConfirm={handleBatchDelete}
              disabled={selectedRowKeys.length === 0}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={selectedRowKeys.length === 0}
              >
                批量删除
              </Button>
            </Popconfirm>
          </Col>
          <Col>
            <Button
              icon={<ExportOutlined />}
              onClick={() => message.info('导出功能待实现')}
            >
              导出数据
            </Button>
          </Col>
        </Row>        <Table
          columns={columns}
          dataSource={filteredStudents}
          rowKey="student_id"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{
            current,
            pageSize,
            total: filteredStudents.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size || 10);
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingStudent ? '编辑学生' : '添加学生'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="student_id"
                label="学号"
                rules={[{ required: true, message: '请输入学号' }]}
              >
                <Input placeholder="请输入学号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="student_name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item
                name="class_name"
                label="班级"
                rules={[{ required: true, message: '请选择班级' }]}
              >
                <Select placeholder="请选择班级">
                  {classes.map(cls => (
                    <Option key={cls} value={cls}>{cls}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingStudent ? '更新' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentList;
