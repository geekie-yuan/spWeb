package site.geekie.web.spweb.entity;


public class User {
    private String student_id;
    private String password;

    // 无参构造函数
    public User() {}
    
    // 全参构造函数
    public User(String student_id, String password) {
        this.student_id = student_id;
        this.password = password;
    }
    
    // getter 和 setter 方法
    public String getStudent_id() {
        return student_id;
    }
    
    public void setStudent_id(String student_id) {
        this.student_id = student_id;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}
