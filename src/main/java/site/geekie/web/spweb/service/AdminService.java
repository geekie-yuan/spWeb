package site.geekie.web.spweb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import site.geekie.web.spweb.entity.Students;
import site.geekie.web.spweb.entity.Admin;
import site.geekie.web.spweb.mapper.AdminMapper;
import site.geekie.web.spweb.mapper.UserMapper; // Import UserMapper
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminMapper adminMapper;

    @Autowired // Autowire UserMapper for deleting user accounts
    private UserMapper userMapper;
    
    public List<Students> getAllStudents() {
        return adminMapper.getAllStudents();
    }

    public List<Admin> getAllAdmins() {
        return adminMapper.getAllAdmins();
    }
    
    // 验证管理员登录信息
    public Admin verifyAdmin(String adminId, String password) {
        return adminMapper.verifyAdmin(adminId, password);
    }

    // 新增学生信息
    // Note: This basic version doesn't create a corresponding user in 'users' table.
    // That would require a password, which is not part of the Students entity.
    // For a complete solution, you might need a DTO or a separate process for user account creation.
    @Transactional
    public boolean addStudent(Students student) {
        // Basic validation: student_id and student_name should not be null or empty
        if (student.getStudent_id() == null || student.getStudent_id().trim().isEmpty() ||
            student.getStudent_name() == null || student.getStudent_name().trim().isEmpty()) {
            return false; 
        }
        // Optional: Check if student_id already exists to prevent duplicates if not handled by DB constraint
        // Students existingStudent = adminMapper.selectStudentByStudentId(student.getStudent_id());
        // if (existingStudent != null) {
        //     return false; // Or throw a custom exception
        // }
        return adminMapper.insertStudent(student) > 0;
    }

    // 根据学号查询学生信息
    public Students getStudentByStudentId(String studentId) {
        return adminMapper.selectStudentByStudentId(studentId);
    }

    // 修改学生信息
    @Transactional
    public boolean updateStudent(Students student) {
         // Basic validation: student_id should not be null or empty
        if (student.getStudent_id() == null || student.getStudent_id().trim().isEmpty()) {
            return false;
        }
        return adminMapper.updateStudent(student) > 0;
    }

    // 删除学生信息 (同时删除users表中的对应用户)
    @Transactional // Ensure atomicity
    public boolean deleteStudent(String studentId) {
        // It's good practice to check if the student exists before attempting to delete.
        // Students student = adminMapper.selectStudentByStudentId(studentId);
        // if (student == null) {
        //     return false; // Student not found
        // }
        
        // First, delete from users table (if a corresponding user exists)
        // Assuming deleteUserByStudentId returns number of rows affected or throws no error if not found
        userMapper.deleteUserByStudentId(studentId); 
        
        // Then, delete from students table
        int studentsDeleted = adminMapper.deleteStudent(studentId);
        
        return studentsDeleted > 0; // Return true if student was deleted from students table
    }
}
