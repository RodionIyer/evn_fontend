package com.evnit.ttpm.khcn.security.services;

import com.evnit.ttpm.khcn.models.admin.Q_User;
import com.evnit.ttpm.khcn.models.system.FunctionGrant;
import com.evnit.ttpm.khcn.services.admin.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserService userService;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Q_User user = userService.findQ_UserById(userId);
        List<FunctionGrant> userFunction = userService.getListFunctionGrantByUser(userId);
        if (user == null) {
            throw new UsernameNotFoundException("Tài khoản [" + userId + "] không tồn tại");
        }
        if (user.getEnable() == null || !user.getEnable()) {
            throw new UsernameNotFoundException("Tài khoản [" + userId + "] không tồn tại");
        }
        return UserDetailsImpl.build(user, userFunction);
    }
    

}
