# 学生管理系统后端说明

## 项目简介

本项目为基于 Spring Boot + MyBatis 的学生管理系统后端，支持学生信息、管理员信息的查询与管理员登录验证。数据存储于 MySQL 数据库，接口采用 RESTful 风格，适合前后端分离开发。

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
    "student_name": "姓名",
    "gender": "性别",
    "class_name": "班级"
  }
  ```
- **成功响应** (201 Created)：
  ```json
  {
    "success": true,
    "message": "学生信息添加成功",
    "student_id": "学号"
  }
  ```
- **失败响应** (400 Bad Request / 500 Internal Server Error)：
  ```json
  {
    "success": false,
    "message": "错误信息"
  }
  ```
  *注意：新增学生时，默认不会在 `users` 表中创建对应的登录账号。如需此功能，需要额外实现。*

#### e. 查询指定学号的学生 (管理员权限)

- **接口**：`GET /admin/students/{student_id}` (例如: `/admin/students/S001`)
- **成功响应** (200 OK)：返回学生信息的 JSON 对象
  ```json
  {
    "id": "1", 
    "student_id": "S001",
    "student_name": "张三",
    "gender": "男",
    "class_name": "计算机一班"
  }
  ```
- **失败响应** (404 Not Found)：
  ```json
  {
    "success": false,
    "message": "未找到学号为 S001 的学生"
  }
  ```

#### f. 修改指定学号的学生信息 (管理员权限)

- **接口**：`PUT /admin/students/{student_id}` (例如: `/admin/students/S001`)
- **请求体**（JSON），包含要更新的字段：
  ```json
  {
    "student_name": "张三丰",
    "gender": "男",
    "class_name": "武当一班"
  }
  ```
  *注意：`student_id` 在路径中指定，请求体中的 `student_id` 会被路径参数覆盖或应与路径参数一致。`id` 字段通常不由客户端指定。*
- **成功响应** (200 OK)：
  ```json
  {
    "success": true,
    "message": "学生信息更新成功",
    "student_id": "S001"
  }
  ```
- **失败响应** (404 Not Found / 400 Bad Request / 500 Internal Server Error)：
  ```json
  {
    "success": false,
    "message": "错误信息"
  }
  ```

#### g. 删除指定学号的学生 (管理员权限)

- **接口**：`DELETE /admin/students/{student_id}` (例如: `/admin/students/S001`)
- **成功响应** (200 OK)：
  ```json
  {
    "success": true,
    "message": "学生信息删除成功",
    "student_id": "S001"
  }
  ```
- **失败响应** (404 Not Found / 500 Internal Server Error)：
  ```json
  {
    "success": false,
    "message": "错误信息"
  }
  ```
  *注意：此操作会同时删除 `users` 表中对应的用户记录（如果存在）。*

### 2. 用户（学生）相关接口 (`/user`)

#### a. 学生（用户）登录验证

- **接口**：`POST /user/login`
- **请求体**（JSON）：
  ```json
  {
    "student_id": "学号",
    "password": "密码"
  }
  ```
- **成功响应** (200 OK)：
  ```json
  {
    "success": true,
    "message": "登录成功",
    "studentId": "学号"
  }
  ```
- **失败响应** (401 Unauthorized)：
  ```json
  {
    "success": false,
    "message": "用户名或密码错误"
  }
  ```

---

## 使用方法

1.  **环境准备**：
    *   安装 Java Development Kit (JDK) 8 或更高版本。
    *   安装 Maven 构建工具。
    *   安装 MySQL 数据库。
2.  **数据库配置**：
    *   创建名为 `student_info` (或您在 `application.yml` 中配置的名称) 的数据库。
    *   执行数据库脚本创建 `students`, `admins`, `users` 表（参考上面的数据库结构）。
    *   插入必要的测试数据。
3.  **项目配置**：
    *   修改 `src/main/resources/application.yml` 文件，配置正确的数据库连接信息 (URL, username, password)。
4.  **构建与运行**：
    *   在项目根目录下执行 `mvn clean package` 进行构建。
    *   运行生成的 JAR 文件：`java -jar target/spweb-0.0.1-SNAPSHOT.jar` (文件名可能不同)。
5.  **接口测试**：
    *   项目启动后，默认运行在 `http://localhost:8081`。
    *   使用 Postman、curl 或其他 API 测试工具调用上述接口。
