package com.evnit.ttpm.khcn.services.admin;

import com.evnit.ttpm.khcn.models.admin.Q_Lst_Api;
import org.springframework.stereotype.Service;

@Service
public interface ApiService {

    Q_Lst_Api findAPIById(String apiId);

    Boolean existsAPIById(String apiId);

    Q_Lst_Api findAPIByEndPoint(String endpoint);

    Boolean insertAPI(Q_Lst_Api api);

    Boolean deleteAPI(String apiId);

}
