import { Component, Input, OnInit } from '@angular/core';
import { ServiceService } from 'app/shared/service/service.service';

@Component({
  selector: 'app-lichsu',
  templateUrl: './lichsu.component.html',
  styleUrls: ['./lichsu.component.scss']
})
export class LichsuComponent implements OnInit {

  public title ='LỊCH SỬ PHÊ DUYỆT, CẬP NHẬP ĐỊNH HƯỚNG ĐĂNG KÝ';
  public noidung ="thông tin bản đăng ký đề tài";
  @Input() title_lichsu;
  @Input() typeLichSu;
  @Input() madeTaiSK;
  public listLichSu :[{tenDonVi:"",tenNguoiTao:"",tenTrangThaiMoi:"",ngayTao,""}]
  constructor(private _serviceApi: ServiceService) { }

  ngOnInit(): void {
    this.addForm();
  }
  addForm() {
    if(this.typeLichSu=="DETAI"){
      this.noidung ="thông tin bản đăng ký đề tài";
      this._serviceApi.execServiceLogin("BDA6825F-9CAB-4363-A093-5A2C7D906AE5", [{"name":"MA_DETAI","value":this.madeTaiSK}]).subscribe((data) => {
        this.listLichSu =data.data;
        console.log(this.listLichSu);
      })
    }else if(this.typeLichSu=="SANGKIEN"){
      this.noidung ="thông tin bản đăng ký sáng kiến";
      this._serviceApi.execServiceLogin("6CB00DBC-A70D-41E1-956E-0C67E2A24342", [{"name":"MA_SANGKIEN","value":this.madeTaiSK}]).subscribe((data) => {
        this.listLichSu =data.data;
        console.log(this.listLichSu);
      })
    }
  }
  

}
