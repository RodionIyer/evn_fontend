package com.evnit.ttpm.khcn.services.tracuu;

import com.evnit.ttpm.khcn.models.tracuu.TraCuuReq;
import com.evnit.ttpm.khcn.models.tracuu.TraCuuResp;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TraCuuService {
    List<TraCuuResp> ListTraCuu(TraCuuReq traCuuReq, String page, String pageSize,String userId,String orgId) throws Exception;
}
