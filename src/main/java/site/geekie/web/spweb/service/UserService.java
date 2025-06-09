package site.geekie.web.spweb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import site.geekie.web.spweb.entity.User;
import site.geekie.web.spweb.mapper.UserMapper;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    // 验证用户登录信息
    public User verifyUser(String studentId, String password) {
        return userMapper.verifyUser(studentId, password);
    }
}
