package com.evnit.ttpm.khcn.models.thongke;

import com.evnit.ttpm.khcn.models.BaseModel;
import lombok.Data;

import java.util.List;

@Data
public class ThongKeResp  extends BaseModel {
  List<ListData> listData;
  public String tenLinhVuc;
}
