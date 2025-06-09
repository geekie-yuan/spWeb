package site.geekie.web.spweb.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.geekie.web.spweb.entity.Students;
import site.geekie.web.spweb.entity.Admin;
import site.geekie.web.spweb.service.AdminService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/students/all")
    public List<Students> getAllStudents() {
        return adminService.getAllStudents();
    }

    @GetMapping("/all")
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }
    
    // 管理员登录验证接口
    @PostMapping("/login")
    public ResponseEntity<Object> adminLogin(@RequestBody Admin admin) {
        Admin verifiedAdmin = adminService.verifyAdmin(admin.getAdmin_id(), admin.getPassword());
        if (verifiedAdmin != null) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "登录成功",
                "adminId", verifiedAdmin.getAdmin_id()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "success", false,
                    "message", "用户名或密码错误"
                ));
        }
    }

    // 新增学生信息
    @PostMapping("/students")
    public ResponseEntity<Object> addStudent(@RequestBody Students student) {
        try {
            boolean success = adminService.addStudent(student);
            if (success) {
                // Optionally, you can return the created student object if the service returns it
                // For now, returning a success message.
                return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "message", "学生信息添加成功",
                    "student_id", student.getStudent_id() 
                ));
            } else {
                 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "学生信息添加失败，学号可能已存在或输入无效"
                ));
            }
        } catch (Exception e) {
            // Log the exception e
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "添加学生信息时发生内部错误: " + e.getMessage()
            ));
        }
    }

    // 根据学号查询学生信息
    @GetMapping("/students/{student_id}")
    public ResponseEntity<Object> getStudentById(@PathVariable("student_id") String studentId) {
        Students student = adminService.getStudentByStudentId(studentId);
        if (student != null) {
            return ResponseEntity.ok(student);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "success", false,
                "message", "未找到学号为 " + studentId + " 的学生"
            ));
        }
    }

    // 根据学号修改学生信息
    @PutMapping("/students/{student_id}")
    public ResponseEntity<Object> updateStudent(@PathVariable("student_id") String studentId, @RequestBody Students studentDetails) {
        try {
            // 保留原始studentId，用于定位要修改的学生记录
            String originalStudentId = studentId;

            // 使用请求体中的student_id，允许修改student_id
            boolean success = adminService.updateStudent(studentDetails, originalStudentId);
            if (success) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "学生信息更新成功",
                    "student_id", studentDetails.getStudent_id() // 返回可能被修改后的student_id
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "学生信息更新失败，未找到学号为 " + originalStudentId + " 的学生，或新学号已存在"
                ));
            }
        } catch (Exception e) {
            // Log the exception e
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "更新学生信息时发生内部错误: " + e.getMessage()
            ));
        }
    }

    // 根据学号删除学生信息
    @DeleteMapping("/students/{student_id}")
    public ResponseEntity<Object> deleteStudent(@PathVariable("student_id") String studentId) {
        try {
            boolean success = adminService.deleteStudent(studentId);
            if (success) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "学生信息删除成功",
                    "student_id", studentId
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "success", false,
                    "message", "学生信息删除失败，未找到学号为 " + studentId + " 的学生"
                ));
            }
        } catch (Exception e) {
            // Log the exception e
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "message", "删除学生信息时发生内部错误: " + e.getMessage()
            ));
        }
    }
}
