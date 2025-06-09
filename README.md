# 学生管理系统后端说明

## 项目简介

本项目为基于 Spring Boot + MyBatis 的学生管理系统后端，支持学生信息管理、学生用户登录验证以及管理员登录验证。数据存储于 MySQL 数据库，接口采用 RESTful 风格，适合前后端分离开发。

项目特点：
- 采用Spring Boot框架，易于开发和部署
- 使用MyBatis作为ORM框架，灵活操作数据库
- RESTful API设计，便于前端调用
- 支持跨域请求处理
- 提供完整的学生信息CRUD操作

---

## 数据库结构

- **students 表**
  - `id` INT AUTO_INCREMENT, (主键，自增)
  - `student_id` CHAR(20) NOT NULL, (学号, 唯一)
  - `student_name` CHAR(20) NOT NULL, (姓名)
  - `gender` CHAR(5), (性别)
  - `class_name` CHAR(20), (班级)
  - PRIMARY KEY (`id`),
  - UNIQUE KEY (`student_id`)

- **admins 表**
  - `admin_id` CHAR(20) NOT NULL, (管理员账号，主键)
  - `password` CHAR(20) NOT NULL, (明文密码)
  - PRIMARY KEY (`admin_id`)

- **users 表**
  - `student_id` CHAR(20) NOT NULL, (学号，主键)
  - `password` CHAR(20) NOT NULL, (明文密码)
  - PRIMARY KEY (`student_id`)

---

## 主要功能接口

### 1. 管理员相关接口 (`/admin`)

#### a. 管理员登录验证

- **接口**：`POST /admin/login`
- **请求体**（JSON）：
  ```json
  {
    "admin_id": "admin账号",
    "password": "密码"
  }
  ```
- **成功响应** (200 OK)：
  ```json
  {
    "success": true,
    "message": "登录成功",
    "adminId": "admin账号"
  }
  ```
- **失败响应** (401 Unauthorized)：
  ```json
  {
    "success": false,
    "message": "用户名或密码错误"
  }
  ```

#### b. 查询所有管理员

- **接口**：`GET /admin/all`
- **返回**：所有管理员信息的 JSON 数组 (不含密码，或根据实际情况调整)

#### c. 查询所有学生 (管理员权限)

- **接口**：`GET /admin/students/all`
- **返回**：所有学生信息的 JSON 数组

#### d. 新增学生 (管理员权限)

- **接口**：`POST /admin/students`
- **请求体**（JSON）：
  ```json
  {
    "student_id": "学号",
    "student_name": "姓名

# 部署指南

## 方法一：直接部署JAR包

1. **准备服务器环境**：

   * 在服务器上安装JDK 17或更高版本：

     ```bash
     # Ubuntu/Debian
     sudo apt update && sudo apt install -y default-jdk
     
     ```

   * 安装MySQL数据库：

     ```bash
     # Ubuntu/Debian
     sudo apt install mysql-server
     
     ```

2. **配置数据库**：

   * 登录MySQL并创建数据库：

     ```bash
     mysql -u root -p
     CREATE DATABASE student_info;
     USE student_info;
     ```

   * 创建必要的表结构：

     ```sql
     CREATE TABLE students (
       id INT AUTO_INCREMENT PRIMARY KEY,
       student_id CHAR(20) NOT NULL UNIQUE,
       student_name CHAR(20) NOT NULL,
       gender CHAR(5),
       class_name CHAR(20)
     );
     
     CREATE TABLE admins (
       admin_id CHAR(20) NOT NULL PRIMARY KEY,
       password CHAR(20) NOT NULL
     );
     
     CREATE TABLE users (
       student_id CHAR(20) NOT NULL PRIMARY KEY,
       password CHAR(20) NOT NULL
     );
     ```

   * 插入初始管理员账号：

     ```sql
     INSERT INTO admins (admin_id, password) VALUES ('admin001', 'admin123');
     ```

   * 开启数据库远程访问

     ~~~sql
     sudo mysql -u root -p	//登录数据库
     CREATE USER 'root'@'%' IDENTIFIED BY 'yourpassword';
     GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
     FLUSH PRIVILEGES;		//添加远程用户 记得替换 yourpassword
     
     
     ~~~

     

3. **上传并配置项目**：

   * 使用SCP或SFTP将生成的JAR文件上传到服务器：

     ```bash
     scp target/spWeb-0.0.1-SNAPSHOT.jar username@server_ip:/path/to/deploy/
     ```

   * 创建application.yml配置文件（与JAR同目录），修改数据库连接配置：

     ```yaml
     server:
       port: 8081
     spring:
       datasource:
         driver-class-name: com.mysql.cj.jdbc.Driver
         url: jdbc:mysql://databaseip:3306/student_info?user=root	//databaseIp替换数据库Ip
         username: databaseName	//databaseName替换数据库名字
         password: databasePassword	//databasePassword替换数据库密码
       mvc:
         cors:
           allowed-origins: "*"
           allowed-methods: "*"
           allowed-headers: "*"
           allow-credentials: true
           max-age: 18000
     
     mybatis:
       mapper-locations: classpath:mapper/*.xml
       # type-aliases-package: com.example.demo.model
     ```

4. **启动应用**：

   * 直接运行JAR文件：

     ```bash
     java -jar spWeb-0.0.1-SNAPSHOT.jar
     ```

   * 或使用nohup在后台运行：

     ```bash
     nohup java -jar spWeb-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
     ```
