package site.geekie.web.spweb.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import site.geekie.web.spweb.entity.User;

@Mapper
public interface UserMapper {
    // 验证用户登录
    User verifyUser(@Param("studentId") String studentId, @Param("password") String password);

    // 根据学生ID删除用户
    int deleteUserByStudentId(@Param("studentId") String studentId);
}
