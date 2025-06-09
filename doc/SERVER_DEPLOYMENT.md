# 学生管理系统服务器部署指南

本文档详细说明如何将学生管理系统后端部署到服务器上。根据不同的环境和需求，提供了多种部署方式供选择。

## 方法一：直接部署JAR包（推荐简单环境）

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

5. **配置为系统服务（推荐）**：
   * 创建systemd服务文件：
     ```bash
     sudo nano /etc/systemd/system/spweb.service
     ```
   * 添加以下内容：
     ```
     [Unit]
     Description=Student Management System
     After=syslog.target network.target
     
     [Service]
     User=your_username
     WorkingDirectory=/path/to/deploy
     ExecStart=/usr/bin/java -jar spWeb-0.0.1-SNAPSHOT.jar
     SuccessExitStatus=143
     Restart=always
     
     [Install]
     WantedBy=multi-user.target
     ```
   * 启用并启动服务：
     ```bash
     sudo systemctl daemon-reload
     sudo systemctl enable spweb
     sudo systemctl start spweb
     ```
   * 查看服务状态：
     ```bash
     sudo systemctl status spweb
     ```

## 方法二：使用Docker部署（一下方法由GPT生成，未验证）

1. **在服务器上安装Docker**：
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install docker.io
   sudo systemctl enable --now docker
   
   # CentOS/RHEL
   sudo yum install -y yum-utils
   sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
   sudo yum install docker-ce docker-ce-cli containerd.io
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

2. **创建Docker网络（可选，用于连接多个容器）**：
   ```bash
   docker network create spweb-network
   ```

3. **运行MySQL容器**：
   ```bash
   docker run --name spweb-mysql \
     --network spweb-network \
     -e MYSQL_ROOT_PASSWORD=your_root_password \
     -e MYSQL_DATABASE=student_info \
     -e MYSQL_USER=spweb_user \
     -e MYSQL_PASSWORD=your_password \
     -v mysql-data:/var/lib/mysql \
     -d mysql:5.7
   ```

4. **构建应用Docker镜像**：
   * 确保项目根目录有Dockerfile（项目已包含），内容如下：
     ```dockerfile
     FROM openjdk:8-jdk-alpine
     VOLUME /tmp
     ARG JAR_FILE=target/spWeb-0.0.1-SNAPSHOT.jar
     COPY ${JAR_FILE} app.jar
     COPY src/main/resources/application.yml /app/config/application.yml
     ENTRYPOINT ["java","-jar","/app.jar","--spring.config.location=file:/app/config/application.yml"]
     ```
   * 上传项目到服务器并构建镜像：
     ```bash
     # 在项目根目录下
     docker build -t spweb:latest .
     ```
   * 或者在本地构建并推送到Docker Hub：
     ```bash
     docker build -t yourusername/spweb:latest .
     docker push yourusername/spweb:latest
     
     # 在服务器上拉取
     docker pull yourusername/spweb:latest
     ```

5. **运行应用容器**：
   ```bash
   docker run --name spweb-app \
     --network spweb-network \
     -e SPRING_DATASOURCE_URL=jdbc:mysql://spweb-mysql:3306/student_info \
     -e SPRING_DATASOURCE_USERNAME=spweb_user \
     -e SPRING_DATASOURCE_PASSWORD=your_password \
     -p 8081:8081 \
     -d spweb:latest
   ```

6. **使用Docker Compose（推荐）**：
   * 创建docker-compose.yml文件：
     ```yaml
     version: '3'
     
     services:
       mysql:
         image: mysql:5.7
         container_name: spweb-mysql
         environment:
           MYSQL_ROOT_PASSWORD: rootpassword
           MYSQL_DATABASE: student_info
           MYSQL_USER: spweb_user
           MYSQL_PASSWORD: userpassword
         volumes:
           - mysql-data:/var/lib/mysql
         networks:
           - spweb-network
     
       app:
         image: spweb:latest
         container_name: spweb-app
         depends_on:
           - mysql
         environment:
           SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/student_info?useSSL=false&serverTimezone=UTC
           SPRING_DATASOURCE_USERNAME: spweb_user
           SPRING_DATASOURCE_PASSWORD: userpassword
         ports:
           - "8081:8081"
         networks:
           - spweb-network
     
     networks:
       spweb-network:
     
     volumes:
       mysql-data:
     ```
   * 启动应用：
     ```bash
     docker-compose up -d
     ```

## 方法三：使用Nginx和Tomcat部署（传统Java Web部署）

1. **安装Tomcat**：
   ```bash
   sudo apt update
   sudo apt install tomcat9 tomcat9-admin
   ```

2. **将项目打包为WAR文件**：
   * 修改pom.xml，将packaging改为war并添加依赖：
     ```xml
     <packaging>war</packaging>
     
     <dependencies>
         <!-- 添加servlet依赖 -->
         <dependency>
             <groupId>org.springframework.boot</groupId>
             <artifactId>spring-boot-starter-tomcat</artifactId>
             <scope>provided</scope>
         </dependency>
     </dependencies>
     ```
   * 修改主应用类：
     ```java
     @SpringBootApplication
     public class SpWebApplication extends SpringBootServletInitializer {
         @Override
         protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
             return application.sources(SpWebApplication.class);
         }
         
         public static void main(String[] args) {
             SpringApplication.run(SpWebApplication.class, args);
         }
     }
     ```
   * 重新打包：`mvn clean package`

3. **部署WAR文件**：
   * 将生成的WAR文件复制到Tomcat的webapps目录：
     ```bash
     scp target/spWeb-0.0.1-SNAPSHOT.war username@server_ip:/var/lib/tomcat9/webapps/spweb.war
     ```

4. **安装和配置Nginx作为反向代理**：
   * 安装Nginx：
     ```bash
     sudo apt install nginx
     ```
   * 配置Nginx：
     ```bash
     sudo nano /etc/nginx/sites-available/spweb
     ```
   * 添加配置：
     ```
     server {
         listen 80;
         server_name your_domain.com;
         
         location / {
             proxy_pass http://localhost:8081;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
         }
     }
     ```
   * 启用站点：
     ```bash
     sudo ln -s /etc/nginx/sites-available/spweb /etc/nginx/sites-enabled/
     sudo nginx -t
     sudo systemctl restart nginx
     ```

## 服务器维护和监控

### 日志管理
* 查看应用日志：
  ```bash
  # 直接运行的jar
  tail -f app.log
  
  # systemd服务
  sudo journalctl -u spweb -f
  
  # Docker容器
  docker logs -f spweb-app
  ```

### 系统监控
* 使用简单监控：
  ```bash
  # 查看系统资源使用情况
  htop
  
  # 查看磁盘使用情况
  df -h
  ```
* 配置Prometheus + Grafana进行高级监控（适用于生产环境）

### 数据备份
* 定期备份MySQL数据：
  ```bash
  # 创建备份脚本
  mysqldump -u username -p student_info > backup_$(date +%Y%m%d).sql
  
  # 添加到crontab定时任务
  0 2 * * * /path/to/backup_script.sh
  ```

## 安全配置

1. **启用HTTPS**：
   * 使用Let's Encrypt获取免费SSL证书：
     ```bash
     sudo apt install certbot python3-certbot-nginx
     sudo certbot --nginx -d your_domain.com
     ```

2. **配置防火墙**：
   ```bash
   # 只开放必要端口
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

3. **数据安全**：
   * 定期更新数据库和应用程序密码
   * 考虑在代码中实现密码加密存储功能

## 常见问题解决

1. **应用无法连接数据库**：
   * 检查数据库连接信息是否正确
   * 确认MySQL服务是否正常运行
   * 检查防火墙是否阻止了数据库连接

2. **端口被占用**：
   * 查找占用端口的进程：`sudo netstat -tuln | grep 8081`
   * 终止占用进程：`sudo kill <PID>`

3. **Java内存问题**：
   * 增加JVM内存参数：`java -Xmx512m -jar spWeb-0.0.1-SNAPSHOT.jar`

4. **日志记录异常**：
   * 检查磁盘空间是否充足
   * 配置日志轮转防止日志文件过大

## 性能优化建议

1. **JVM优化**：
   * 调整JVM参数：`java -XX:+UseG1GC -Xms256m -Xmx512m -jar spWeb-0.0.1-SNAPSHOT.jar`

2. **数据库优化**：
   * 为frequently查询的字段添加索引
   * 优化数据库连接池参数

3. **网络优化**：
   * 配置Nginx缓存静态资源
   * 启用Gzip压缩响应内容
