# Nginx配置与域名访问设置

## 安装Nginx

```bash
# Ubuntu/Debian系统
sudo apt update
sudo apt install nginx

# CentOS系统
sudo yum install epel-release
sudo yum install nginx
```

## 启动Nginx服务

```bash
# 启动Nginx
sudo systemctl start nginx

# 设置开机自启
sudo systemctl enable nginx

# 检查Nginx状态
sudo systemctl status nginx
```

## 配置Nginx作为反向代理

1. **创建新的站点配置文件**:

```bash
sudo nano /etc/nginx/sites-available/spweb
```

2. **添加以下配置内容**:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的实际域名

    location / {
        proxy_pass http://localhost:8081;  # SpringBoot应用的地址和端口
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **启用站点配置**:

```bash
# 创建符号链接到sites-enabled目录
sudo ln -s /etc/nginx/sites-available/spweb /etc/nginx/sites-enabled/

# 测试配置文件语法是否正确
sudo nginx -t

# 重新加载Nginx配置
sudo systemctl reload nginx
```

## 配置域名DNS

1. 在您的域名提供商控制面板中，添加一条A记录，将您的域名指向服务器IP地址。

2. 等待DNS生效（通常需要几分钟到几小时不等）。

## 配置HTTPS（可选但推荐）

使用Let's Encrypt获取免费SSL证书：

```bash
# 安装certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书并自动配置Nginx
sudo certbot --nginx -d your-domain.com

# 设置自动续期
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 验证访问

配置完成后，您应该能够通过以下方式访问您的应用：

- http://your-domain.com（如果未配置HTTPS）
- https://your-domain.com（如果已配置HTTPS）

## 常见问题排查

1. **无法访问网站**：
   - 检查防火墙是否允许80端口（HTTP）和443端口（HTTPS）的访问
   ```bash
   sudo ufw allow 'Nginx Full'
   ```
   
2. **查看Nginx错误日志**：
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **查看应用日志**：
   ```bash
   sudo tail -f /path/to/deploy/app.log
   ```
