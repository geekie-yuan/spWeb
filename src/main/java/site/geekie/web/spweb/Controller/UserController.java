package site.geekie.web.spweb.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import site.geekie.web.spweb.entity.User;
import site.geekie.web.spweb.service.UserService;

import java.util.Map;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // 用户登录验证接口
    @PostMapping("/user/login")
    public ResponseEntity<Object> userLogin(@RequestBody User user) {
        User verifiedUser = userService.verifyUser(user.getStudent_id(), user.getPassword());
        if (verifiedUser != null) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "登录成功",
                "studentId", verifiedUser.getStudent_id()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                    "success", false,
                    "message", "用户名或密码错误"
                ));
        }
    }
}
