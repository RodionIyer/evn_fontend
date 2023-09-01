package com.evnit.ttpm.khcn.services.admin;

import com.evnit.ttpm.khcn.models.admin.Q_User;
import com.evnit.ttpm.khcn.models.system.FunctionGrant;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {

    Q_User findQ_UserById(String userId);

    List<FunctionGrant> getListFunctionGrantByUser(String userId);

    Boolean existsQ_UserById(String userId);

}
