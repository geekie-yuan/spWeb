package site.geekie.web.spweb.entity;

// 移除 lombok 注解导入

public class Students {
    private String id;
    private String student_id;
    private String student_name;
    private String gender;
    private String class_name;

    // 无参构造函数
    public Students() {}

    // 全参构造函数
    public Students(String id, String student_id, String student_name, String gender, String class_name) {
        this.id = id;
        this.student_id = student_id;
        this.student_name = student_name;
        this.gender = gender;
        this.class_name = class_name;
    }

    // 三参数构造函数
    public Students(String id, String student_id, String student_name) {
        this.id = id;
        this.student_id = student_id;
        this.student_name = student_name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudent_id() {
        return student_id;
    }

    public void setStudent_id(String student_id) {
        this.student_id = student_id;
    }

    public String getStudent_name() {
        return student_name;
    }

    public void setStudent_name(String student_name) {
        this.student_name = student_name;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getClass_name() {
        return class_name;
    }

    public void setClass_name(String class_name) {
        this.class_name = class_name;
    }
}
