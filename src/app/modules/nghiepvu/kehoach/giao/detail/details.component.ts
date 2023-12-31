import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormGroup, RequiredValidator, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'app/shared/message.services';
import { SnotifyToast } from 'ng-alt-snotify';
import { State } from 'app/shared/commons/conmon.types';
import { BaseDetailInterface } from 'app/shared/commons/basedetail.interface';
import { UserService } from 'app/core/user/user.service';
import { BaseComponent } from 'app/shared/commons/base.component';
import { FunctionService } from 'app/core/function/function.service';
import { ApiGiaoService } from '../giao.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ServiceService } from 'app/shared/service/service.service';
import { DOfficeService } from 'app/shared/service/doffice.service';
import { DOfficeComponent } from 'app/shared/component/d-office/d-office.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'component-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class ApiGiaoDetailsComponent implements OnInit {

   
    public selectedYear: number;
    public selectedStatus: string;
    public actionClick: string = null;
    public getYearSubscription: Subscription;
    public getStatusSubscription: Subscription;
    public listYears = [];
    public listStatus = [];
    public form;
    public idParam : string = null;
    public checkChiTiet :string = null;
    public listDonvi = [];
    public listChiTietImport = [];
    submitted = {check:false};
    record ={ lock: false,isEmail:false };
    public listFile; 
    // public user={EMAIL:''};
    public listFileDelete=[]; 
    //add
    public dataFile = [];
    public checkDOffice = false;
    public linkDoffice = "";
    user: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _formBuilder: FormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        private _serviceApi: ServiceService,
        public _messageService: MessageService,
        private _userService: UserService,
        private _dOfficeApi: DOfficeService,
        public dialog: MatDialog,
    ) {
        
        this.idParam = this._activatedRoute.snapshot.paramMap.get('id');
        console.log('this.idParam',this.idParam);
        this._activatedRoute.queryParams.subscribe( params =>{
            this.checkChiTiet = params["type"];
            this.updateKeHoach();
            this.getUserByMaKeHoach();
           

          //  console.log('this.idParam2',JSON.stringify(params));
        }
           
        )
        this.initForm()
    
        
    }


    ngOnInit() {
      this.getCheckQuyenDoffice();
        this.updateFile();
        this.geListYears()
        this.getListStatus()
        this.geListNhomDonVi();
        this.selectedYear= (new Date()).getFullYear();
       // console.log(this.form.value);

    }
    geListNhomDonVi() {
        this._serviceApi.execServiceLogin("030A9A96-90D5-4AD0-80E4-C596AED63EE7", null).subscribe((data) => {
            this.listDonvi = data.data || [];
        })
    }

    updateFile(){
        let typeRecord =  this.form.value.typeRecord;
        if(typeRecord !=undefined && (typeRecord=="TH_DonVi" || typeRecord=="TH_EVN")){
            this._serviceApi.dataGrid.subscribe((data)=>{
                if(data != null && data.length >0){
                    let maKH = "";
                    for(let i=0 ; i< data.length;i++){
                        if(i==data.length -1){
                            maKH +=data[i].MA_KE_HOACH;
                        }else{
                            maKH +=data[i].MA_KE_HOACH+',';
                        }
                    }
                    if(maKH != ''){
                        this._serviceApi.execServiceLogin("8EA30077-D521-40E7-B5EA-B3FD741B28C9", [{"name":"MA_KE_HOACH","value":maKH}]).subscribe((data) => {
                       
                            this.listFile = data.data  || [];
                            if(this.listFile != null && this.listFile.length >0){
                                for(let i =0 ; i< this.listFile.length;i++){
                                    this.listupload.push({
                                        fileName:this.listFile[i].TEN_FILE,
                                        base64:'',
                                        duongdan:this.listFile[i].DUONG_DAN,
                                        size: this.listFile[i].KICH_THUOC,
                                        sovanban:this.listFile[i].SO_KY_HIEU,
                                        mafile:this.listFile[i].MA_FILE
                                   });
                                }
                            }
                        })
                    }
                    
                }
            })
        }
    }

    getUserByMaKeHoach() {
        if(this.idParam != undefined && this.idParam != ''){
            this._serviceApi.execServiceLogin("993EA746-A6CF-4D42-B395-F2816ABFC37A", [{"name":"MA_KE_HOACH","value":this.idParam}]).subscribe((data) => {
                this.user = data.data || {};
                if(this.user != undefined && this.user.EMAIL !=null && this.user.EMAIL !=''){
                   this.record.lock=true;
                   this.record.isEmail=true;
                }else{
                    this.record.lock=false;
                    this.record.isEmail=false;
                }
            })
        }
        
    }

  


    initForm() {
        // if(this.idParam != undefined && this.idParam !=''){
        //     this.getYearSubscription = this._serviceApi.execServiceLogin("B73269B8-55CF-487C-9BB4-99CB7BC7E95F", [{"name":"MA_KE_HOACH","value":this.idParam}]).subscribe((data) => {
        //         this.form = this._formBuilder.group({
        //             name: [data.data.TEN_KE_HOACH, [Validators.required]],
        //             year: [data.data.NAM, [Validators.required]],
        //             maKeHoach:this.idParam
        //         }
        //         )
        //     })

        // }else{
            this.form = this._formBuilder.group({
                name: [null, [Validators.required]],
                lock: [this.record.lock],
                maKeHoach:this.idParam,
                typeRecord:this.checkChiTiet,
                yKienNguoiPheDuyet:'',
                year: [(new Date()).getFullYear(), [Validators.required]],
            }
            )
        // }
       
    }

    updateKeHoach(){
        // if(this.idParam != undefined && this.idParam !=null){
        //     this._serviceApi.execServiceLogin("B73269B8-55CF-487C-9BB4-99CB7BC7E95F", [{"name":"MA_KE_HOACH","value":this.idParam}]).subscribe((data) => {
        
        //        // this.form.get("name").patchValue(data.data.Y_KIEN_NGUOI_PHE_DUYET);
        //        // this.form.get("email").patchValue(true);
        //        // this.form.get("maKeHoach").patchValue(this.idParam);
    
        //     })
        //     this._serviceApi.execServiceLogin("D9680D9D-5705-42FA-9321-E04521D53014", [{"name":"MA_KE_HOACH","value":this.idParam}]).subscribe((data) => {
        //         this.listFile = data.data  || [];
            
        //     })


        // }
        if (this.idParam != undefined && this.idParam != null) {
            this._serviceApi.execServiceLogin("DC2F3F51-09CC-4237-9284-13EBB85C83C1", [{ "name": "MA_KE_HOACH", "value": this.idParam }]).subscribe((data) => {
                this._serviceApi.dataKeHoach.next(data.data);
                this.listFile = data.data || [];
                this.listFile =data.data.listFile;

                this.form.get("name").patchValue(data.data.name);
                this.form.get("yKienNguoiPheDuyet").patchValue(data.data.ykienNguoiPheDuyet);
                this.form.get("year").patchValue(data.data.nam);
                this.form.get("maKeHoach").patchValue(this.idParam);
                if (this.listFile != null && this.listFile.length > 0) {
                    for (let i = 0; i < this.listFile.length; i++) {

                        this.listupload.push({
                            fileName: this.listFile[i].fileName,
                            base64: this.listFile[i].base64,
                            duongDan: this.listFile[i].duongDan,
                            size: this.listFile[i].size,
                            sovanban: this.listFile[i].sovanban,
                            mafile: this.listFile[i].mafile
                        });
                    }
                }

            })


        }
     
    }

    onChangEmail(){
        this.record.lock = !this.record.lock;
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
      }
  

    geListYears() {
        // this.getYearSubscription = this._serviceApi.execServiceLogin("E5050E10-799D-4F5F-B4F2-E13AFEA8543B", null).subscribe((data) => {
        //     console.log("nam:"+ data);
        //     this.listYears = data.data || [];
        // })
        var obj = {"NAME":0,"ID":0};
        var year = (new Date()).getFullYear();
        var yearStart = year - 4;
        var yearEnd = yearStart + 10;
        for(let i=yearStart;i<=yearEnd;i++){
            obj = {"NAME":i,"ID":i}
            this.listYears.push(obj);
        }
        this.selectedYear=  (new Date()).getFullYear();
        
    }

    getListStatus() {
        this.getStatusSubscription = this._serviceApi.execServiceLogin("E5050E10-799D-4F5F-B4F2-E13AFEA8543B", null).subscribe((data) => {
            this.listStatus = data.data || [];
        })
    }
    downloadExcel(){
        this._serviceApi.execServiceLogin("B186CEDA-876B-4511-96D1-E199926A6913", [{"name":"ORGID","value":"115"}]).subscribe((data) => {
            this.downloadTempExcel(data.data,"MAU_DANG_KY_DINH_HUONG.xlsx");
        })
    }

    importFile(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let fileBase64 =reader.result.toString().split(',')[1];
            this._serviceApi.execServiceLogin("1E707636-93B5-43EA-97BC-2F850C14D1E3", [{"name":"ORGID","value":"115"},{"name":"FILE_UPLOAD","value":fileBase64}]).subscribe((data) => {
                this.listChiTietImport = data.data || [];
            })
           // console.log(reader.result);
        };
    }

    backHome(){
        this._router.navigateByUrl('nghiepvu/kehoach/pheduyetdinhhuong');
            setTimeout(function(){
                window.location.reload();
              }, 300);
    }

     downloadTempExcel(userInp,fileName){
        var mediaType="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
       // var userInp = document.getElementById('base64input');
        // var userInp = "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";
        // //var a = document.createElement('a');
       // a.href = mediaType+userInp;
        //a.href = mediaType+userInp;
        const downloadLink = document.createElement('a');
        //const fileName = 'sample.excel';
    
        downloadLink.href = mediaType+userInp;
        downloadLink.download = fileName;
        downloadLink.click();
      }

    ngOnDestroy() {
       // this.getYearSubscription.unsubscribe();
        //this.getStatusSubscription.unsubscribe();
    }
    onSubmit(status) {
        this.submitted.check = true;
        if (this.form.invalid) {
            this._messageService.showErrorMessage("Thông báo", "Chưa nhập đủ trường bắt buộc!")
            return;
        }
        console.log(this.form.value);
        let email = 0;
        if(status=="DA_PHE_DUYET" || status=="Y_CAU_HIEU_CHINH"){
            email = this.record.lock?1:0;
        }
        let yKienNguoiPheDuyet ='';
        if(this.form.value != undefined  && this.form.value != null && this.form.value.yKienNguoiPheDuyet != undefined &&  this.form.value.yKienNguoiPheDuyet != null){
            yKienNguoiPheDuyet = this.form.value.yKienNguoiPheDuyet;
        }
       
        console.log(this.form);
        let name = this.form.value.name;
        let nam = this.form.value.year;

        let capTao = 'DONVI';
        if (this.listDonvi != undefined && this.listDonvi.length > 0) {
            capTao = "TCT";
        }
        let listChiTiet = [];
        let listFile = this.listupload;
        let kehoach = { name: name, nam: nam,maTrangThai: status,maKeHoach:this.idParam};
        for (let i = 0; i < this.form.value.listNhiemVu.length; i++) {
            for (let j = 0; j < this.form.value.listNhiemVu[i].listNhiemVu_cap2.length; j++) {
                let chitiet2 = this.form.value.listNhiemVu[i].listNhiemVu_cap2[j];
                if (this.listDonvi != undefined && this.listDonvi.length > 0) {
                    for (let k = 0; k < chitiet2.listNhiemVu_cap3.length; k++) {
                        let itemChiTiet = chitiet2.listNhiemVu_cap3[k];

                        if (itemChiTiet.listNhiemVu_cap4 != undefined && itemChiTiet.listNhiemVu_cap4.length > 0) {
                            for(let i=0;i<itemChiTiet.listNhiemVu_cap4.length;i++){

                                listChiTiet.push(itemChiTiet.listNhiemVu_cap4[i]);
                            }
                        }
                    }
                } else {

                    if (chitiet2.listNhiemVu_cap3 != undefined && chitiet2.listNhiemVu_cap3.length > 0) {
                        for(let i=0;i<chitiet2.listNhiemVu_cap3.length;i++){

                            listChiTiet.push(chitiet2.listNhiemVu_cap3[i]);
                        }
                    }
                }


            }
        }
        var token = localStorage.getItem("accessToken");
        
        this._serviceApi.execServiceLogin("404ABE65-3B92-448F-A8F0-9543503AE1E3", [{ "name": "LIST_FILE", "value": JSON.stringify(listFile) }, { "name": "LIST_KE_HOACH_CHI_TIET", "value": JSON.stringify(listChiTiet) }, {"name":"TOKEN_LINK","value":"Bearer "+token},{ "name": "KE_HOACH", "value": JSON.stringify(kehoach) }]).subscribe((data) => {
            // this._messageService.showSuccessMessage("Thông báo", data.message);
            // this._router.navigateByUrl('nghiepvu/kehoach/dinhhuong');
            switch (data.status) {
                case 1:
                    this._messageService.showSuccessMessage("Thông báo", "Thành công");
                   
                        this._router.navigateByUrl('nghiepvu/kehoach/giao');
                    
                    break;
                case 0:
                    this._messageService.showErrorMessage("Thông báo", "Không tìm thấy bản ghi");
                    break;
                case -1:
                    this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện");
                    break;
            }
        })

    }

    onSubmitTongHop(status,capTao) {
        this.submitted.check = true;
        if (this.form.invalid) {
            return;
        }
        console.log(this.form);
        let name = this.form.value.name;
        let nam = this.form.value.year;
        let listChiTiet = [];
        let listFile = this.listupload;
        let kehoach = { name: name, nam: nam,maTrangThai: status,maKeHoach:this.idParam,tongHop:true,capTao:capTao};
        for (let i = 0; i < this.form.value.listNhiemVu.length; i++) {
            for (let j = 0; j < this.form.value.listNhiemVu[i].listNhiemVu_cap2.length; j++) {
                let chitiet2 = this.form.value.listNhiemVu[i].listNhiemVu_cap2[j];
                if (this.listDonvi != undefined && this.listDonvi.length > 0) {
                    for (let k = 0; k < chitiet2.listNhiemVu_cap3.length; k++) {
                        let itemChiTiet = chitiet2.listNhiemVu_cap3[k];

                        if (itemChiTiet.listNhiemVu_cap4 != undefined && itemChiTiet.listNhiemVu_cap4.length > 0) {
                            for(let i=0;i<itemChiTiet.listNhiemVu_cap4.length;i++){

                                listChiTiet.push(itemChiTiet.listNhiemVu_cap4[i]);
                            }
                        }
                    }
                } else {

                    if (chitiet2.listNhiemVu_cap3 != undefined && chitiet2.listNhiemVu_cap3.length > 0) {
                        for(let i=0;i<chitiet2.listNhiemVu_cap3.length;i++){

                            listChiTiet.push(chitiet2.listNhiemVu_cap3[i]);
                        }
                    }
                }


            }
        }
        var token = localStorage.getItem("accessToken");
        this._serviceApi.execServiceLogin("404ABE65-3B92-448F-A8F0-9543503AE1E3", [{ "name": "LIST_FILE", "value": JSON.stringify(listFile) }, { "name": "LIST_KE_HOACH_CHI_TIET", "value": JSON.stringify(listChiTiet) }, {"name":"TOKEN_LINK","value":"Bearer "+token},{ "name": "KE_HOACH", "value": JSON.stringify(kehoach) }]).subscribe((data) => {
            this._messageService.showSuccessMessage("Thông báo", data.message);
            this._router.navigateByUrl('nghiepvu/kehoach/dinhhuong');
        })
   
    }

    downLoadFile(item) {
        if (item.value.base64 != undefined && item.value.base64 != '') {
            let link = item.value.base64.split(',');
            let url = '';
            if (link.length > 1) {
                url = link[1];
            } else {
                url = link[0];
            }
            this.downloadAll(url, item.value.fileName);
        } else {
            var token = localStorage.getItem('accessToken');
            this._serviceApi
                .execServiceLogin('2269B72D-1A44-4DBB-8699-AF9EE6878F89', [
                    {name: 'DUONG_DAN', value: item.duongdan},
                    {name: 'TOKEN_LINK', value: 'Bearer ' + token},
                ])
                .subscribe((data) => {
                });
        }
    }

   async downloadAll(base64String, fileName){
    let typeFile =  await this.detectMimeType(base64String, fileName);
    let mediaType = `data:${typeFile};base64,`;
    const downloadLink = document.createElement('a');

        downloadLink.href = mediaType + base64String;
        downloadLink.download = fileName;
        downloadLink.click();
    }

   async detectMimeType(base64String, fileName) {
        var ext = fileName.substring(fileName.lastIndexOf(".") + 1);
        if (ext === undefined || ext === null || ext === "") ext = "bin";
        ext = ext.toLowerCase();
        const signatures = {
          JVBERi0: "application/pdf",
          R0lGODdh: "image/gif",
          R0lGODlh: "image/gif",
          iVBORw0KGgo: "image/png",
          TU0AK: "image/tiff",
          "/9j/": "image/jpg",
          UEs: "application/vnd.openxmlformats-officedocument.",
          PK: "application/zip",
        };
        for (var s in signatures) {
          if (base64String.indexOf(s) === 0) {
            var x = signatures[s];
            // if an office file format
            if (ext.length > 3 && ext.substring(0, 3) === "ppt") {
              x += "presentationml.presentation";
            } else if (ext.length > 3 && ext.substring(0, 3) === "xls") {
              x += "spreadsheetml.sheet";
            } else if (ext.length > 3 && ext.substring(0, 3) === "doc") {
              x += "wordprocessingml.document";
            }
            // return
            return x;
          }
        }
        // if we are here we can only go off the extensions
        const extensions = {
          xls: "application/vnd.ms-excel",
          ppt: "application/vnd.ms-powerpoint",
          doc: "application/msword",
          xml: "text/xml",
          mpeg: "audio/mpeg",
          mpg: "audio/mpeg",
          txt: "text/plain",
        };
        for (var e in extensions) {
          if (ext.indexOf(e) === 0) {
            var xx = extensions[e];
            return xx;
          }
        }
        // if we are here – not sure what type this is
        return "unknown";
      }
    listupload = []
    handleUpload(event) {
        for (var i = 0; i < event.target.files.length; i++) {
            const reader = new FileReader();
            let itemVal = event.target.files[i];
            reader.readAsDataURL(event.target.files[i]);
            reader.onload = () => {           
                this.listupload.push({
                    fileName: itemVal.name,
                    base64: reader.result,
                    size: itemVal.size,
                    sovanban: "",
                    mafile: ""
                });
            };
        }
        event.target.value = null;

    }
    deleteItemFile(items) {
        if (items.mafile != undefined && items.mafile != '') {
            this.listupload = this.listupload.filter(item => item.mafile != items.mafile);
        } else {
            this.listupload = this.listupload.filter(item => item.fileName != items.fileName);
        }
        if (items.mafile != null && items.mafile != '') {
            this.listFileDelete.push(items);
            // this._serviceApi.execServiceLogin("83C28EE1-6A5A-4ADA-B866-287EBAC8B5D5", [{"name":"MA_FILE","value":items.mafile}]).subscribe((data) => {

            // })
        }
    }

    // add
    getCheckQuyenDoffice() {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
                this._serviceApi.execServiceLogin("3FADE0E4-B2C2-4D9D-A0C7-06817ADE4FA3", [{ "name": "ORGID", "value": user.ORGID }]).subscribe((data) => {
                    if (data.data.API_DOFFICE) {
                        this.checkDOffice = true;
                        this.linkDoffice = data.data.API_DOFFICE;
                    }
                })
            });
    }
    exportMau() {
        if (this.idParam != undefined && this.idParam != null) {
            this._serviceApi.execServiceLogin("FC95C3F7-942F-4C7E-88D7-46E12BFE9185", [{ "name": "MA_KE_HOACH", "value": this.idParam }]).subscribe((data) => {
                this.downloadTempExcel(data.data, "DANH_SACH_DANG_KY_DINH_HUONG.docx");

           })
        } else {
            this._messageService.showWarningMessage("Thông báo", "Chức năng này không được sử dụng.");
        }
    }
    async openAlertDialogDoffice(type, item?: any) {
        let data = this.dialog.open(DOfficeComponent, {
            data: {
                type: type,
                linkApi: this.linkDoffice,
                maDv: this.user.ORGID,
                message: 'HelloWorld',
                buttonText: {
                    cancel: 'Done',
                },
            },
            width: '800px',
            panelClass: 'custom-PopupCbkh',
            position: {
                top: '100px',
            },
        });

         data.afterClosed().subscribe((data) => {
           let kyHieu =data.data.KY_HIEU;
           let ngayVB =data.data.NGAY_VB;
           item.get("sovanban").setValue(kyHieu);
           item.get("ngayVanBan").setValue(ngayVB);
            if (type == 'DOffice') {
                  this._dOfficeApi.execTimKiemTheoFile(this.linkDoffice, data.data.ID_VB).then(data=>{
                this.dataFile = data.body.Data;
                console.log("thong tin file");
                console.log(data);
                if (this.dataFile != null && this.dataFile.length > 0) {
                   for (var i = 0; i < this.dataFile.length; i++) {
                    this.getFileFromDoffice(item, this.dataFile[i].ID_FILE, this.user.ORGID, this.dataFile[i].ID_VB,
                         this.dataFile[i].TEN_FILE, this.dataFile[i].KY_HIEU);
                //         let dataFile =  this.dataFile[i];
                //         setTimeout(() => {
                            
                     
                   
                // }, 1000);
                //     }
                }
            }
            }); 
            }
        });
    }
    async getFileFromDoffice(item,idFile,orgId,idVB,tenFile,kyHieu){
        this._dOfficeApi.execFileBase64(this.linkDoffice, idFile, orgId, idVB).then(data=>{
            console.log("file base64");
            var base64str = data.body;
            var decoded = atob(base64str);
             let arrFile = item.get("listFile") as FormArray;
             arrFile.push(this.addListDocChildView(tenFile,base64str,decoded,kyHieu))
            });
            
    }

    addListDocChildView(tenFile,base64str,decoded,kyHieu) {
        return this._formBuilder.group({
            fileName: tenFile,
            base64: base64str,
            size: decoded.length,
            sovanban: kyHieu,
            mafile: ""
        });
    }


}
