import { Component, Input, OnInit } from '@angular/core';
import { ServiceService } from 'app/shared/service/service.service';

@Component({
  selector: 'app-lichsu-kehoach',
  templateUrl: './lichsuKeHoach.component.html',
  styleUrls: ['./lichsuKeHoach.component.scss']
})
export class LichsuKeHoachComponent implements OnInit {

  public title ='LỊCH SỬ PHÊ DUYỆT, CẬP NHẬP ĐỊNH HƯỚNG ĐĂNG KÝ';
  public listLichSu :[{tenDonVi:"",tenNguoiTao:"",tenTrangThaiMoi:"",ngayTao,""}]
  @Input() makehoach;
  constructor(private _serviceApi: ServiceService) {
  }
  ngOnInit(): void {
    this.addForm();
  }
  addForm() {
  this._serviceApi.execServiceLogin("90B27610-123D-4EEE-9A41-10F9DBB43281", [{"name":"MA_KE_HOACH","value":this.makehoach}]).subscribe((data) => {
    this.listLichSu =data.data;
    console.log(this.listLichSu);
  })
}

}
