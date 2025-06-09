package site.geekie.web.spweb.entity;


public class Admin {
    private String admin_id;
    private String password;
    
    // 无参构造函数
    public Admin() {}
    
    // 全参构造函数
    public Admin(String admin_id, String password) {
        this.admin_id = admin_id;
        this.password = password;
    }
    
    // getter 和 setter 方法
    public String getAdmin_id() {
        return admin_id;
    }
    
    public void setAdmin_id(String admin_id) {
        this.admin_id = admin_id;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
