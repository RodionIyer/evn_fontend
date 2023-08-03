import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from 'app/shared/service/service.service';
import { CommonModule } from '@angular/common';
import { String } from 'lodash';
import { Subscription, of, Subject } from 'rxjs';
@Component({
    selector: 'table-plans',
    templateUrl: './table-plans.component.html',
    styleUrls: ['./table-plans.component.css'],
})
export class TablePlansComponent {
    public listNguonKinhPhi = [];
    public listNhiemVuMau = [];
    public listDonvi = [];
    @Input() form: FormGroup;
    @Input() dataImport;
    public sub: Subscription;
    itemsAdd: FormArray;
    public listKeHoachChiTiet = [];
    public listImport = [];
    @Input() submitted;
    // @Input('dataImport') dataImport:Subject<any>;

    constructor(private _formBuilder: FormBuilder, private _serviceApi: ServiceService) {
    }

    ngOnInit() {
        this.getListKeHoachChiTiet();
        this.geListNguonKinhPhi();
        this.addFormtoParent(); 
    }
    ngOnChanges(changes: SimpleChanges) {
        console.log(this.submitted)
    }
    keHoach;
    addFormtoParent() {
        this.form.addControl('listNhiemVu', this._formBuilder.array([]))

        this._serviceApi.execServiceLogin("030A9A96-90D5-4AD0-80E4-C596AED63EE7", null).subscribe((data) => {
            debugger;
            this.listDonvi = data.data || [];
            if(this.listDonvi !=undefined && this.listDonvi.length >0){
                this.keHoach = { capTao: 'TCT' };
            }else{
                this.keHoach = { capTao: 'DONVI' };
            }
            this.sub = this._serviceApi.dataKeHoach.subscribe((data) => {
            if(data !=undefined){
                this.keHoach = { capTao: data.capTao };
            }
                if(data !=undefined && data.listKeHoach !=undefined){
                    this.listKeHoachChiTiet = data.listKeHoach;
                }
                
            })
            this._serviceApi.execServiceLogin("CE428DEE-1945-495E-8F48-03747076AE6F", [{ "name": "ORGID", "value": "115" }, { "name": "USERID", "value": "STR" }]).subscribe((data) => {
                this.listNhiemVuMau = data.data;
                let listNhiemVu11 = this.listNhiemVuMau.filter(c => c.MA_NHOM_CHA == null);
                console.log(this.form);
                debugger;
                if(this.form.get('listNhiemVu') != undefined){
                    for (let i = 0; i < listNhiemVu11.length; i++) {
                        let arrTemp = this.form.get('listNhiemVu') as FormArray;
                        arrTemp.push(this.newNhiemvu(listNhiemVu11[i]))
                    }
                }
               
            })
        })

    }

    getListKeHoachChiTiet() {
        this.keHoach = { capTao: 'DONVI' };
        this.sub = this._serviceApi.dataKeHoach.subscribe((data) => {
            if(data !=undefined){
                this.keHoach = { capTao: data.capTao };
            }
                if(data !=undefined && data.listKeHoach !=undefined){
                    this.listKeHoachChiTiet = data.listKeHoach;
                }
                
        })
        // let maKeHoach = this.form.value.maKeHoach;
        // let typeRecord = this.form.value.typeRecord;
        // if (typeRecord != undefined && (typeRecord == "TH_DonVi" || typeRecord == "TH_EVN")) {
        //     this.sub = this._serviceApi.dataGrid.subscribe((data) => {
        //         if (data != null && data.length > 0) {
        //             let maKH = "";
        //             for (let i = 0; i < data.length; i++) {
        //                 if (i == data.length - 1) {
        //                     maKH += data[i].MA_KE_HOACH;
        //                 } else {
        //                     maKH += data[i].MA_KE_HOACH + ',';
        //                 }
        //             }
        //             if (maKH != '') {
        //                 this._serviceApi.execServiceLogin("EF7E11D2-9D20-4062-9347-30364BCA77B2", [{ "name": "MA_KE_HOACH", "value": maKH }]).subscribe((data) => {

        //                     this.listKeHoachChiTietTongHop = data.data;
        //                 })
        //             }

        //             //this.addFormtoParent(); 
        //         }
        //     })
        // } else {
        //     if (maKeHoach != undefined && maKeHoach != '') {

        //         this._serviceApi.execServiceLogin("B73269B8-55CF-487C-9BB4-99CB7BC7E95F", [{ "name": "MA_KE_HOACH", "value": maKeHoach }]).subscribe((data) => {
        //             this.keHoach = data.data;
        //         })
        //         this._serviceApi.execServiceLogin("113E9708-4131-4D52-B2A9-D0972B4F8266", [{ "name": "MA_KE_HOACH", "value": maKeHoach }]).subscribe((data) => {

        //             this.listKeHoachChiTiet = data.data;
        //             this.sub = this._serviceApi.dataImport.subscribe((data) => {
        //                 if (data != null && data.length > 0) {
        //                     this.listImport = data;
        //                     //this.addFormtoParent(); 
        //                 }
        //             })
        //         })
        //     } else {
        //         this.keHoach = { CAP_TAO: 'DONVI' };
        //         this.sub = this._serviceApi.dataImport.subscribe((data) => {
        //             if (data != null && data.length > 0) {
        //                 this.listImport = data;
        //                 //this.addFormtoParent(); 
        //             }
        //         })
        //     }
        // }
        // this.addFormtoParent();
    }


    newNhiemvu(item): FormGroup {
        let listNhiemVu21 = this.listNhiemVuMau.filter(c => c.MA_NHOM_CHA == item.MA_NHOM);
        let listNhiemVu2 = [];
        for (let i = 0; i < listNhiemVu21.length; i++) {
            //console.log(listNhiemVu1[i].MA_NHOM); //use i instead of 0
            listNhiemVu2.push(this.newNhiemvu_cap2(listNhiemVu21[i]));
        }
        if(this.listKeHoachChiTiet !=null && this.listKeHoachChiTiet.length >0){
            let listChiTiet = this.listKeHoachChiTiet.filter(c => c.maNhom==item.MA_NHOM && c.maDonVi==null)
            for (let i = 0; i < listChiTiet.length; i++) {
                //console.log(listNhiemVu1[i].MA_NHOM); //use i instead of 0
                listNhiemVu2.push(this.newItemNhiemvu(listChiTiet[i]));
            }
        }
        return this._formBuilder.group({
            maNhom: item.MA_NHOM,
            noiDungDangKy: item.TEN_NHOM,
            listNhiemVu_cap2: this._formBuilder.array(listNhiemVu2),
            chiTiet :item.CHI_TIET,
            action:"view"
        })
    }

    newNhiemvu_cap2(item): FormGroup {
       // let itemArr = [];
      //  if (this.keHoach.capTao=='TCT') {
            let listNhiemVu3 = [];
            if (this.listDonvi != null && this.listDonvi.length > 0) {
                for (let i = 0; i < this.listDonvi.length; i++) {
                    //console.log(listNhiemVu1[i].MA_NHOM); //use i instead of 0
                    listNhiemVu3.push(this.newNhiemvu_cap3(this.listDonvi[i], item));
                }
            }
            if(this.listKeHoachChiTiet !=null && this.listKeHoachChiTiet.length >0){
                let listChiTiet = this.listKeHoachChiTiet.filter(c => c.maNhom==item.MA_NHOM && c.maDonVi ==null)
                for (let i = 0; i < listChiTiet.length; i++) {
                    //console.log(listNhiemVu1[i].MA_NHOM); //use i instead of 0
                    listNhiemVu3.push(this.newItemNhiemvu(listChiTiet[i]));
                }
            }
                return this._formBuilder.group({
                    maNhom: item.MA_NHOM,
                    noiDungDangKy: item.TEN_NHOM,
                    maDonVi: null,
                    listNhiemVu_cap3: this._formBuilder.array(listNhiemVu3),
                    chiTiet :item.CHI_TIET,
                    action:"view"
                })
           // }
       // }
        //  else {
        //     if(this.listKeHoachChiTiet !=null && this.listKeHoachChiTiet.length >0){
        //         let listChiTiet = this.listKeHoachChiTiet.filter(c => c.maNhom==item.MA_NHOM)
        //         for (let i = 0; i < listChiTiet.length; i++) {
        //             //console.log(listNhiemVu1[i].MA_NHOM); //use i instead of 0
        //             itemArr.push(this.newItemNhiemvu(listChiTiet[i]));
        //         }
        //     }
        //     return this._formBuilder.group({
        //         maNhom: item.MA_NHOM,
        //         maDonVi: null,
        //         noiDungDangKy: item.TEN_NHOM,
        //         listNhiemVu_cap3: this._formBuilder.array(itemArr),
        //         chiTiet :item.CHI_TIET
        //     })
        // }

    }

    newNhiemvu_cap3(item, itemParent): FormGroup {
        let itemArr = [];
        if(this.listKeHoachChiTiet !=null && this.listKeHoachChiTiet.length >0){
            let listChiTiet = this.listKeHoachChiTiet.filter(c => c.maNhom==itemParent.MA_NHOM && c.maDonVi ==item.maNhom)
            for (let i = 0; i < listChiTiet.length; i++) {
                itemArr.push(this.newItemNhiemvu(listChiTiet[i]));
            }
        }
        return this._formBuilder.group({
            maNhom: itemParent.MA_NHOM,
            maDonVi: item.maNhom,
            noiDungDangKy: item.tenNhom,
            listNhiemVu_cap4: this._formBuilder.array(itemArr),
            chiTiet :1,
            action:"view"
        })
       

    }

    newItemNhiemvu(item): FormGroup {
        return this._formBuilder.group({
            maDonVi: item.maDonVi,
            maKeHoachChiTiet: item.maKeHoachChiTiet,
            maKeHoach: item.maKeHoach,
            maNhom: item.maNhom,
            noiDungDangKy: [item.noiDungDangKy, [Validators.required]],
            nguonKinhPhi: item.nguonKinhPhi,
            duToan: item.duToan,
            donViChuTri: item.donViChuTri,
            chuNhiemNhiemVu: item.chuNhiemNhiemVu,
            noiDungHoatDong: item.noiDungHoatDong,
            thoiGianDuKien: item.thoiGianDuKien,
            yKienNguoiPheDuyet: item.yKienNguoiPheDuyet,
            opinion: '',
            chiTiet:0,
            action:"add"
        })
    }

    AddItemNhiemvu(items): FormGroup {
        return this._formBuilder.group({
            maDonVi: items.value.maDonVi,
            maKeHoachChiTiet: '',
            maKeHoach: '',
            maNhom: items.value.maNhom,
            noiDungDangKy: ['', [Validators.required]],
            nguonKinhPhi: '',
            duToan: '',
            donViChuTri: '',
            chuNhiemNhiemVu: '',
            noiDungHoatDong: '',
            thoiGianDuKien: '',
            yKienNguoiPheDuyet: '',
            opinion: '',
            chiTiet :0,
            action:'add'
        })
    }

    addCap1(items) {
        this.itemsAdd = items.get('listNhiemVu_cap2') as FormArray;
        this.itemsAdd.push(this.AddItemNhiemvu(items));
    }
    addCap2(items) {
        this.itemsAdd = items.get('listNhiemVu_cap3') as FormArray;
        this.itemsAdd.push(this.AddItemNhiemvu(items));
    }

    addCap3(items) {
        this.itemsAdd = items.get('listNhiemVu_cap4') as FormArray;
        this.itemsAdd.push(this.AddItemNhiemvu(items));
    }

    listChitietDelete: FormArray;


    removeItem(items, i, cap) {
        // remove address from the list

        let item;
        if (cap == 3) {
            const control = items.get('listNhiemVu_cap3');
            item = control.value[i];
            control.removeAt(i);

        }
        if (cap == 4) {
            const control = items.get('listNhiemVu_cap4');
            item = control.value[i];
            control.removeAt(i);

        }


        if (item.maKeHoachChiTiet != undefined && item.maKeHoachChiTiet != '') {
            this.listChitietDelete = this.form.get('listChitietDelete') as FormArray;
            this.listChitietDelete.push(this.AddItemDelete(item.maKeHoachChiTiet));
        }

    }

    AddItemDelete(items): FormGroup {
        return this._formBuilder.group({
            maKeHoachChiTiet: items,

        })
    }

    geListNguonKinhPhi() {
        this._serviceApi.execServiceLogin("CCDB1CBC-F3D2-4893-85FE-F70C47990CF0", null).subscribe((data) => {
            this.listNguonKinhPhi = data.data || [];
        })
    }

    ngDestroy() {
        this.sub.unsubscribe();
    }
}
