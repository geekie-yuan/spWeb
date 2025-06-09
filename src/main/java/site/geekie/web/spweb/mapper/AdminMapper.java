package site.geekie.web.spweb.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import site.geekie.web.spweb.entity.Students;
import site.geekie.web.spweb.entity.Admin;

import java.util.List;

@Mapper
public interface AdminMapper {
    List<Students> getAllStudents();
    List<Admin> getAllAdmins();
    
    // 验证管理员登录
    Admin verifyAdmin(@Param("adminId") String adminId, @Param("password") String password);

    // 新增学生信息
    int insertStudent(Students student);

    // 根据学号查询学生信息
    Students selectStudentByStudentId(@Param("studentId") String studentId);

    // 修改学生信息
    int updateStudent(@Param("student") Students student, @Param("originalStudentId") String originalStudentId);

    // 根据学号删除学生信息
    int deleteStudent(@Param("studentId") String studentId);
}
