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

---

## 接口测试建议

项目已部署到本地，推荐以下方式测试接口：

### 1. Postman（推荐）

- 下载并安装 [Postman](https://www.postman.com/)
- 根据上述接口说明，创建相应的请求（GET, POST, PUT, DELETE）。
- **POST/PUT 请求**：在 Body 选项选择 `raw` 和 `JSON` 格式，输入请求体。
- **GET/DELETE 请求**：URL 中可能包含路径参数，如 `/admin/students/{student_id}`。
- 点击 Send，查看返回结果。

### 2. curl 命令行工具

**管理员登录示例**：
```bash
curl -X POST http://localhost:8081/admin/login \
  -H "Content-Type: application/json" \
  -d '{"admin_id":"你的管理员账号","password":"你的密码"}'
```

**新增学生示例**：
```bash
curl -X POST http://localhost:8081/admin/students \
  -H "Content-Type: application/json" \
  -d '{"student_id":"S002","student_name":"李四","gender":"女","class_name":"软件工程二班"}'
```

**查询指定学生示例**：
```bash
curl http://localhost:8081/admin/students/S001
```

---

## 代码结构说明

- `src/main/java/site/geekie/web/spweb`
  - `Controller`：接口控制层，处理 HTTP 请求。
  - `entity`：实体类，对应数据库表结构。
  - `mapper`：MyBatis Mapper 接口。
  - `service`：业务逻辑层。
  - `SpwebApplication.java`：Spring Boot 启动类。
- `src/main/resources`
  - `mapper`：MyBatis Mapper XML 文件，包含 SQL 语句。
  - `application.yml`：项目配置文件。
- `doc`：项目说明文档（本文件）。

---

## 注意事项

- 管理员和用户密码均为明文存储，仅用于学习演示，实际项目请使用加密存储（如 BCrypt）。
- 本项目未实现完整的权限控制和会话管理（如 JWT），生产环境需补充相关安全措施。
- 错误处理较为基础，可以根据需要进行扩展和细化。
- 如需扩展功能，可在 service 和 controller 层继续添加业务逻辑和接口。

---
