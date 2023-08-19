import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, takeUntil, timeout, Subject } from 'rxjs';
import { AbstractControl, FormArray, FormBuilder, FormGroup, RequiredValidator, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'app/shared/message.services';
import { SnotifyToast } from 'ng-alt-snotify';
import { State } from 'app/shared/commons/conmon.types';
import { BaseDetailInterface } from 'app/shared/commons/basedetail.interface';
import { UserService } from 'app/core/user/user.service';
import { BaseComponent } from 'app/shared/commons/base.component';
import { FunctionService } from 'app/core/function/function.service';
import { ListdinhhuongService } from '../listdinhhuong.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ServiceService } from 'app/shared/service/service.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupFileComponent } from 'app/shared/component/popup-file/popup-filecomponent';
import { PopupCbkhComponent } from './popup-cbkh/popup-cbkh.component';
import { User } from 'app/core/user/user.types';
import { DOfficeService } from 'app/shared/service/doffice.service'

@Component({
    selector: 'component-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class ApiDinhHuongDetailsComponent implements OnInit {

    public selectedYear: number;
    public selectedStatus: string;
    public actionClick: string = null;
    public getYearSubscription: Subscription;
    public getStatusSubscription: Subscription;
    public listYears = [];
    public listStatus = [];
    public showTable = true
    public form;
    public dataImport = {
        arr: []
    }
    @ViewChild('fileUpload2') fileUpload2: ElementRef;
    public idParam: string = null;
    public checkChiTiet: string = null;
    public listDonvi = [];
    public listChiTietImport = [];
    submitted = { check: false };
    public listFile;
    public listFileDelete = [];
    public actionType: string = null;
    public makehoach: string = null;
    public screen;
    public checkDOffice = false;
    public linkDoffice = "";
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _formBuilder: FormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        private _serviceApi: ServiceService,
        public _messageService: MessageService,
        public dialog: MatDialog,
        private _userService: UserService,
        private _dOfficeApi: DOfficeService,
    ) {
        this.idParam = this._activatedRoute.snapshot.paramMap.get('id');
        this._activatedRoute.queryParams.subscribe(params => {
            this.checkChiTiet = params["type"];
            this.updateKeHoach();
            if (params?.type) {
                this.actionType = params?.type;
            } else {
                this.actionType = null;
            }
            if (params?.screen) {
                this.screen = params?.screen;
            }
            if (params?.makehoach) {
                this.makehoach = params?.makehoach;
            } else {
                this.makehoach = null;
            }
            this.initForm()
            if (this.actionType == "THEMMOI") {
                this._serviceApi.dataKeHoach.next({capTao:'DONVI'});
                this.getCheckQuyenDoffice();

            }else if(this.actionType == "CHINHSUA"){
                this.getCheckQuyenDoffice();
            }
        }
        )

    }


    ngOnInit() {
        this.geListYears()
        // this.getListStatus()
        this.geListNhomDonVi();
        this.selectedYear = (new Date()).getFullYear();
        // console.log(this.form.value);

    }
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

    geListNhomDonVi() {
        this._serviceApi.execServiceLogin("030A9A96-90D5-4AD0-80E4-C596AED63EE7", null).subscribe((data) => {
            this.listDonvi = data.data || [];
        })
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
            year: [(new Date()).getFullYear(), [Validators.required]],
            maKeHoach: this.idParam,
            listChiTietImport: [],
            
        }
        )
        // }

    }

    updateKeHoach() {
        if (this.idParam != undefined && this.idParam != null) {
            this._serviceApi.execServiceLogin("DC2F3F51-09CC-4237-9284-13EBB85C83C1", [{ "name": "MA_KE_HOACH", "value": this.idParam }]).subscribe((data) => {
                //console.log(data.data);
                this._serviceApi.dataKeHoach.next(data.data);
                this.listFile = data.data || [];
                this.listFile = data.data.listFile;
                this.form.get("name").patchValue(data.data.name);
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

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }



    geListYears() {
        var obj = { "NAME": 0, "ID": 0 };
        var year = (new Date()).getFullYear();
        var yearStart = year - 4;
        var yearEnd = yearStart + 10;
        for (let i = yearStart; i <= yearEnd; i++) {
            obj = { "NAME": i, "ID": i }
            this.listYears.push(obj);
        }
        this.selectedYear = (new Date()).getFullYear();

    }

    // getListStatus() {
    //     this.getStatusSubscription = this._serviceApi.execServiceLogin("E5050E10-799D-4F5F-B4F2-E13AFEA8543B", null).subscribe((data) => {
    //         this.listStatus = data.data || [];
    //     })
    // }
    downloadExcel() {
        let data ="UEsDBBQABgAIAAAAIQAhjEY6cwEAAIwFAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEVMluwjAQvVfqP0S+VomBQ1VVBA5dji0S9ANMPCEWiW15Bgp/34lZVFUsQiD1kiix5232TH+4aupkCQGNs7noZh2RgC2cNnaWi6/Je/okEiRltaqdhVysAcVwcH/Xn6w9YMLVFnNREflnKbGooFGYOQ+WV0oXGkX8GWbSq2KuZiB7nc6jLJwlsJRSiyEG/Vco1aKm5G3FvzdKpsaK5GWzr6XKhfK+NoUiFiqXVv8hSV1ZmgK0KxYNQ2foAyiNFQA1deaDYcYwBiI2hkIe5AxQ42WkW1cZV0ZhWBmPD2z9CEO7ctzVtu6TjyMYDclIBfpQDXuXq1p+uzCfOjfPToNcGk2MKGuUsTvdJ/jjZpTx1b2xkNZfBL5QR++fdBDfdZDxeX0UEeaMcaR1DXjr44+g55grFUCPibtodnMBv7FP6eDWHgXnkadHgMtT2LVqW516BoJABvbNeujS7xl59FwdO7SzTYM+wC3jLB38AAAA//8DAFBLAwQUAAYACAAAACEAtVUwI/QAAABMAgAACwAIAl9yZWxzLy5yZWxzIKIEAiigAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKySTU/DMAyG70j8h8j31d2QEEJLd0FIuyFUfoBJ3A+1jaMkG92/JxwQVBqDA0d/vX78ytvdPI3qyCH24jSsixIUOyO2d62Gl/pxdQcqJnKWRnGs4cQRdtX11faZR0p5KHa9jyqruKihS8nfI0bT8USxEM8uVxoJE6UchhY9mYFaxk1Z3mL4rgHVQlPtrYawtzeg6pPPm3/XlqbpDT+IOUzs0pkVyHNiZ9mufMhsIfX5GlVTaDlpsGKecjoieV9kbMDzRJu/E/18LU6cyFIiNBL4Ms9HxyWg9X9atDTxy515xDcJw6vI8MmCix+o3gEAAP//AwBQSwMEFAAGAAgAAAAhAEqppmH6AAAARwMAABoACAF4bC9fcmVscy93b3JrYm9vay54bWwucmVscyCiBAEooAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALySzWrEMAyE74W+g9G9cZL+UMo6eymFvbbbBzCxEodNbGOpP3n7mpTuNrCkl9CjJDTzMcxm+zn04h0jdd4pKLIcBLram861Cl73T1f3IIi1M7r3DhWMSLCtLi82z9hrTk9ku0AiqThSYJnDg5RUWxw0ZT6gS5fGx0FzGmMrg64PukVZ5vmdjL81oJppip1REHfmGsR+DMn5b23fNF2Nj75+G9DxGQvJiQuToI4tsoJp/F4WWQIFeZ6hXJPhw8cDWUQ+cRxXJKdLuQRT/DPMYjK3a8KQ1RHNC8dUPjqlM1svJXOzKgyPfer6sSs0zT/2clb/6gsAAP//AwBQSwMEFAAGAAgAAAAhAJ47ajZQAgAAuAQAAA8AAAB4bC93b3JrYm9vay54bWysVM1u00AQviPxDqu9J/6Jk6ZWnKptgoioqqiU9tLLZj2Ol6x3ze6aJEI8Bc/BE3DkSXgTxjYGQy9FcPHM/n0z830znp0dCkneg7FCq4QGQ58SUFynQm0T+ub2xWBKiXVMpUxqBQk9gqVn8+fPZnttdhutdwQBlE1o7lwZe57lORTMDnUJCk8ybQrmcGm2ni0NsNTmAK6QXuj7E69gQtEWITZPwdBZJjgsNK8KUK4FMSCZw/RtLkrboRX8KXAFM7uqHHBdlAixEVK4YwNKScHj1VZpwzYSyz4E4w4Z3UfQheBGW525IUJ5bZKP6g18LwjakuezTEi4a2knrCyvWVFHkZRIZt0yFQ7ShE5wqffw24apyotKSDwNoij0qTf/KcXakBQyVkl3iyJ08HhxEvlBUN/Eos6lA6OYg0utHHL4g/1/5avBvsw1qkNu4F0lDGBT1LTNZ/hlPGYbu2YuJ5WRCV3ED2uj3wJ3D8u764cet+yxcH/BLuN1mR7W2ebS+n/WPJ/VnXsnYG9/sVcvyeFeqFTvE4pzcOz5+2b7XqQuT2g4nfp43u69BLHNHZIcjkaNGl4Pu2l2jNFYohqRX9cDEOBU1XZV60iJiQU6ZpU2KvVvX2+rb18+KfJKqJys86+few/D3sOwqbuLx5nk2A21aSJMwtNgVN+Ag7uyrrEohEjohyDyz0/802jgL0fjQTQ9DQfTaBQOLqNFuByfLBfLi/HH/9v72A9x9/uos8yZcbeG8R3+dG4gu2AWZ6FhwsN8UcIua697Nf8OAAD//wMAUEsDBBQABgAIAAAAIQCa3hwsOAQAAA8WAAANAAAAeGwvc3R5bGVzLnhtbNRY3Y+bOBB/P+n+B+R3lo8AG6KQqtldpEq96nSbSvfqgEl8NTYCZzdpdf/7jQ0E2k02abLZ2+Yh4GE885uxPR8ev1vnzHggZUUFj5BzZSOD8ESklC8i9HkWm0NkVBLzFDPBSYQ2pELvJr//Nq7khpH7JSHSABG8itBSymJkWVWyJDmurkRBOHzJRJljCcNyYVVFSXBaqUk5s1zbDqwcU45qCaM8OUZIjssvq8JMRF5gSeeUUbnRspCRJ6MPCy5KPGcAde14ODHWTlC6rQZNeqIkp0kpKpHJKxBqiSyjCXmKNbRCCyedJBB7miTHt2y3NnwyzgSXlZGIFZfgfvC+hjj6wsUjj9U3oKKabTKuvhoPmAHFQdZknAgmSkOCt8FYTeE4JzXHDWZ0XlLFluGcsk1NdhVBL1DDl1NwlyJaCkirZ664Wl16znO6ZjQnlfGJPBp/iRzzH3VqZE/E08uquDD6rfhBtxDlYh6hOLb1T5G71TjJQ7tMuJiO19xQwQs45+n2eVFvnyRM7/EKzhBlbHukB+rwAmEyhmglScljGBjN+2xTwNHlEFjrI6j5DnAvSrxxXP/4CZVgNFUoFjf9gAGhRlIVdEz7yvHCMBx615597flu4OrdMG/4KU/JmqQRCjyttGeHChsas36A6XNRppBL2njmgtqaNBkzkkk4FCVdLNVTigL+50JKCLmTcUrxQnDMVCRqZ/RnQg6CdBMhuYR00Ya+H5EpFY2Go/g1Fg3lKHaA3CI+ir82brdtjZHgsoQwdq+M+zvr8gCYuM4MvsrjXH4A18NiqfjcvoLPm9faR/VA+a4vrZbdEwvreopcY51tFexD5QDAXaiA3s42cFGwjcppKlvVo6neL934PaMLnpOaZTKGJFYPjaUo6VeYqrJfAt9JiVTVImnSpzyWuJiRtVagvLHO9tv7moj/WVWSZpu3Dvk8h0KR9YttgUsjPs+fg1/On6+J+IWO1KUhn7cFvD1bQLUJTUzeFVXPi6KHAqd/QVAqg++Ikv8npL3Z5hCo8PXP78UhgYJ9FUDws9viGVlw53BeKrmk7PrE/cwZe0ulyJ4TZpxYOkEK7UrQA8We6nzeROl3ffmwemjJVUG/u4rvV9u6nIcCvtclfNcjbKt9QzWsEfqk7tpYLznMV5RBl7ejPwCZ6brrOGzV2kl1b6Z7ka0WwJmSDK+YnG0/Rqh7/4OkdJXDLmi4/qQPQmoREereP6qmz9F9P1TnHyvo0uBprEoaoW930+vw9i52zaE9HZregPhm6E9vTd+7md7exqHt2jf/9i7wzri+05eNEMIcb1QxuOQrG2Mb8PcdLUK9QQ1fN78Au489dAP7ve/YZjywHdML8NAcBgPfjH3HvQ286Z0f+z3s/okXhrblOO2F4drxRxJu3Bjl7Vq1K9SnwiLB8BkjrHYlrO4md/IfAAAA//8DAFBLAwQUAAYACAAAACEAO20yS8EAAABCAQAAIwAAAHhsL3dvcmtzaGVldHMvX3JlbHMvc2hlZXQxLnhtbC5yZWxzhI/BisIwFEX3A/5DeHuT1oUMQ1M3IrhV5wNi+toG25eQ9xT9e7McZcDl5XDP5Tab+zypG2YOkSzUugKF5GMXaLDwe9otv0GxOOrcFAktPJBh0y6+mgNOTkqJx5BYFQuxhVEk/RjDfsTZsY4JqZA+5tlJiXkwyfmLG9Csqmpt8l8HtC9Ote8s5H1Xgzo9Uln+7I59Hzxuo7/OSPLPhEk5kGA+okg5yEXt8oBiQet39p5rfQ4Epm3My/P2CQAA//8DAFBLAwQUAAYACAAAACEAd+w99fwBAAAYBAAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQyLnhtbJSTy27bMBBF9wX6DwT3ESXHjhNBUmDUMJpFgaLoY01TI4kwHypJv/6+Qyky3CQF0oVEEhyduXNnVDyetCIHcF5aU9IsSSkBI2wtTVvSH983N/eU+MBNzZU1UNIzePpYffxQHK3b+Q4gECQYX9IuhD5nzIsONPeJ7cHgTWOd5gGPrmW+d8Dr4SOt2CxN75jm0tCRkLv3MGzTSAFrK/YaTBghDhQPqN93svcTTYv34DR3u31/I6zuEbGVSobzAKVEi/ypNdbxrcK6T9mci4k9HF7htRTOetuEBHFsFPq65gf2wJBUFbXECqLtxEFT0lWWr24pq4rBn58Sjv5qT6LdW2t38eKpLmmKBA8KRCyccFwO8AmUQtACO/Z7ZC4ikF2I1/uJvhka9NWRGhq+V+GbPX4G2XYBpwFJQ6l5fV6DF2g4Jk5mA1VYhQh8Ey3j5KBh/DSsR1mHDndZMrtfZIs7jCdb8GEjI5MSsffB6l/PUYPCETboXPPAq8LZI8F5wGjf8zhdWY77t8Wgihi7isEYOKcE83j051DNC3bAogU+SLxgZ39jx1qT5T/LnTLE7zDD8irD8u0Mt/8jPAa/ED57yR2bOJrT8xa+cNdK44mCZmgKanJj19Ik6rN9bFUsaWsD2j2dOvwDAd1KE8zaWBumQxyUyz9d/QEAAP//AwBQSwMEFAAGAAgAAAAhAHU+mWmTBgAAjBoAABMAAAB4bC90aGVtZS90aGVtZTEueG1s7Flbi9tGFH4v9D8IvTu+SbK9xBts2U7a7CYh66TkcWyPrcmONEYz3o0JgZI89aVQSEtfCn3rQykNNNDQl/6YhYQ2/RE9M5KtmfU4m8umtCVrWKTRd858c87RNxddvHQvps4RTjlhSdutXqi4Dk7GbEKSWdu9NRyUmq7DBUomiLIEt90l5u6l3Y8/uoh2RIRj7IB9wndQ242EmO+Uy3wMzYhfYHOcwLMpS2Mk4DadlScpOga/MS3XKpWgHCOSuE6CYnB7fTolY+wMpUt3d+W8T+E2EVw2jGl6IF1jw0JhJ4dVieBLHtLUOUK07UI/E3Y8xPeE61DEBTxouxX155Z3L5bRTm5ExRZbzW6g/nK73GByWFN9prPRulPP872gs/avAFRs4vqNftAP1v4UAI3HMNKMi+7T77a6PT/HaqDs0uK71+jVqwZe81/f4Nzx5c/AK1Dm39vADwYhRNHAK1CG9y0xadRCz8ArUIYPNvCNSqfnNQy8AkWUJIcb6Iof1MPVaNeQKaNXrPCW7w0atdx5gYJqWFeX7GLKErGt1mJ0l6UDAEggRYIkjljO8RSNoYpDRMkoJc4emUVQeHOUMA7NlVplUKnDf/nz1JWKCNrBSLOWvIAJ32iSfBw+TslctN1PwaurQZ4/e3by8OnJw19PHj06efhz3rdyZdhdQclMt3v5w1d/ffe58+cv3798/HXW9Wk81/EvfvrixW+/v8o9jLgIxfNvnrx4+uT5t1/+8eNji/dOikY6fEhizJ1r+Ni5yWIYoIU/HqVvZjGMEDEsUAS+La77IjKA15aI2nBdbIbwdgoqYwNeXtw1uB5E6UIQS89Xo9gA7jNGuyy1BuCq7EuL8HCRzOydpwsddxOhI1vfIUqMBPcXc5BXYnMZRtigeYOiRKAZTrBw5DN2iLFldHcIMeK6T8Yp42wqnDvE6SJiDcmQjIxCKoyukBjysrQRhFQbsdm/7XQZtY26h49MJLwWiFrIDzE1wngZLQSKbS6HKKZ6wPeQiGwkD5bpWMf1uYBMzzBlTn+CObfZXE9hvFrSr4LC2NO+T5exiUwFObT53EOM6cgeOwwjFM+tnEkS6dhP+CGUKHJuMGGD7zPzDZH3kAeUbE33bYKNdJ8tBLdAXHVKRYHIJ4vUksvLmJnv45JOEVYqA9pvSHpMkjP1/ZSy+/+Msts1+hw03e74XdS8kxLrO3XllIZvw/0HlbuHFskNDC/L5sz1Qbg/CLf7vxfube/y+ct1odAg3sVaXa3c460L9ymh9EAsKd7jau3OYV6aDKBRbSrUznK9kZtHcJlvEwzcLEXKxkmZ+IyI6CBCc1jgV9U2dMZz1zPuzBmHdb9qVhtifMq32j0s4n02yfar1arcm2biwZEo2iv+uh32GiJDB41iD7Z2r3a1M7VXXhGQtm9CQuvMJFG3kGisGiELryKhRnYuLFoWFk3pfpWqVRbXoQBq66zAwsmB5Vbb9b3sHAC2VIjiicxTdiSwyq5MzrlmelswqV4BsIpYVUCR6ZbkunV4cnRZqb1Gpg0SWrmZJLQyjNAE59WpH5ycZ65bRUoNejIUq7ehoNFovo9cSxE5pQ000ZWCJs5x2w3qPpyNjdG87U5h3w+X8Rxqh8sFL6IzODwbizR74d9GWeYpFz3EoyzgSnQyNYiJwKlDSdx25fDX1UATpSGKW7UGgvCvJdcCWfm3kYOkm0nG0ykeCz3tWouMdHYLCp9phfWpMn97sLRkC0j3QTQ5dkZ0kd5EUGJ+oyoDOCEcjn+qWTQnBM4z10JW1N+piSmXXf1AUdVQ1o7oPEL5jKKLeQZXIrqmo+7WMdDu8jFDQDdDOJrJCfadZ92zp2oZOU00iznTUBU5a9rF9P1N8hqrYhI1WGXSrbYNvNC61krroFCts8QZs+5rTAgataIzg5pkvCnDUrPzVpPaOS4ItEgEW+K2niOskXjbmR/sTletnCBW60pV+OrDh/5tgo3ugnj04BR4QQVXqYQvDymCRV92jpzJBrwi90S+RoQrZ5GStnu/4ne8sOaHpUrT75e8ulcpNf1OvdTx/Xq171crvW7tAUwsIoqrfvbRZQAHUXSZf3pR7RufX+LVWduFMYvLTH1eKSvi6vNLtbb984tDQHTuB7VBq97qBqVWvTMoeb1us9QKg26pF4SN3qAX+s3W4IHrHCmw16mHXtBvloJqGJa8oCLpN1ulhlerdbxGp9n3Og/yZQyMPJOPPBYQXsVr928AAAD//wMAUEsDBBQABgAIAAAAIQAzbi8JDwYAAAYZAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1srFlNk6JIEL1vxP4HgvuIIGo3oU60CjiHjdjY2Y8zjaUSI+IC3T3z7zfrA8zKZGfcjr007fNlFq8yqzKrXHz8Wp6dV1E3RXVZuv5o7Driklf74nJcun/8nnx4cJ2mzS777FxdxNL9Jhr34+rnnxZvVf2lOQnROuDh0izdU9teI89r8pMos2ZUXcUFvjlUdZm18LE+es21FtleGZVnLxiPZ16ZFRdXe4jqe3xUh0ORi22Vv5Ti0montThnLbx/cyquTeetzO9xV2b1l5frh7wqr+DiuTgX7Tfl1HXKPPp0vFR19nwG3V/9MMs73+oDc18WeV011aEdgTtPvyjX/Og9euBptdgXoEBOu1OLw9J98qPdZO56q4WaoD8L8dag/502e/4sziJvxR7i5Dpy/p+r6oskfgJoDC4bRZAus7wtXsVGnM/gOYQQ/q0HCaOnmRzD6wfB/3cDJipov9bOXhyyl3P7W/W2E8Xx1MLIU5gEORfR/ttWNDkEAcYeBVPpNa/O4AL+OmUhswkmMfuq37bYtyf4D5gPU386A76TvzRtVf5lvjH22jIwlvB809+H8/ssJ8YSnsbSn42m8/HE/8GQMEnqZeHFOsNgFAbT+cOPLGfGEp7GMvDvs5wbS3j2lt+dF1iM6iXhaQwm45Efjv9lPj0dEBXrbdZmq0VdvTmwziAyzTWTq9aPwJcMLDia90Hpoz0Y7AmkWi7dPEk/4OPRdcBDA/DrKpgsvFdIqtxw1poTjFWApdWGIVuGxAxJGJIyZIcRD7T2giGRqOAgGP1XvWvphup9sPVuNAfp3TIkZkjCkJQhO4xY6iDZ368O1kUXTuln6T72kVprwEexY8jWIH5vFTMkYUhKh9ohwNImNy+SqrNA7jdm//h+qiJx0hHEDtK9z9UxSdUBSvBIwjvA8QlnO8CZkLHiobGm9ljJEGdmc9Kh97EpuyE3Yc+xZhumFc/28E7fpYskqxmVW79c2WuGbBiyZUjMkIQhKUN2GLE0wD58vwZJtjUwZMOQLUNihiQMSRmyw4ilASoC1iBfEaKoK6auzmoT1xVZbdzfD5X0Bxawg/TJP/FJ9hsOLMQbJyDZbzj9Wt9SIKZAQoFUA5Pex04DgepL8KYtW0+y9P3pHWKlHYiFyb1VJaLVUCCHblqJVE0Jb1IpEFMgoUCqAd0byQWyQwwr3lBB3yVV2hGpZBNZGwqWSvaQjaaoxlCt4y0FYgokFEg18HCLqgZUR2tJhWry/+a2ckiTm3UhclQg4eymlbtzdAs5Q2KGJAxJDaISWs3nDnPsyRjoxO7Kcd+0XjjJSRladxwc+oDUoU1HQqKN61tBZ5yEIalBsGjkxxY90I3dJ9r0X1i0T7cxucnJSGPVPlNtSEg1ReLOUc9JGJIaBKtGfmzVA13afapN92SpJhvzWiY2VT25FXmVhpuOhFQbMxRriiTMKjUIVo2sbNUD/dt9qk3XYqkmgtayKFLVAUmIjSGh7Y0hMUMShqQGUTuaWdZ6eH2ixpVLJt+79nNlSGsXi7VpfawMJxvexnjCqrXZDYkZJ2FIahCsGvmxY006r7u7E1mqaRmb0DrWkayaTSuZIWHV2jdWTZGEWaUGwaqRla2a9Gr3qx5qyub09DzUlbHCxdoyn/VlDEkYkhoEr2vkx1b93uZMHsBorH0W64H+zGex1iQca4rEZrQbJ2FIahAca+THVv3ePk1ekTDVLNYDrZrPYs2aNeMbZzhr1xgnNQhWjazsyxPSsd2d4XAJwo8dtEvpSLgzC2m97ki3ysWQmCEJQ1KDoAzHHPtSBVIfKdVnrx/eNvR3q/q+rRT1UV3DNk5evci7UmgFV4se1ne/2zCCIyWYEnwTRnD45Li8K1b3LYT/1F3vEnwdRushP0kYwTGV+0/DCA6rHN+FERxZOR6HERyAOb4OIri0klNym4fV4podxS9ZfSwujXMWB3V/DHNd6wtmuIaEQ1l1lbfK8kLyuWrhlrj7dIIfEAQcpMYjSJdDVbXdBxhE+v0s2perU9UF3Eur3wSW7rWq2zorWhghKuCivP60V3Pn9b9grP4BAAD//wMAUEsDBBQABgAIAAAAIQCLQTWCDgMAADAHAAAUAAAAeGwvc2hhcmVkU3RyaW5ncy54bWyMVc9LG0EUvhf6Pzz2ZMFmk9WKSBKhsW2KND009irLZLu7mMzEzKzosXootBQUD/0BUoOIaFtU6CmL9LBL/o/5T/pmozHOGOtpd7+ZefPe9973bXF+vdWENa/DQ0ZLViGXt8CjhDVC6pespfrzx7MWcOHShttk1CtZGx635ssPHxQ5F4BnKS9ZgRDtOdvmJPBaLs+xtkdx5R3rtFyBnx3f5u2O5zZ44Hmi1bSdfH7GbrkhtYCwiIqSNV2wIKLhauRVhkC5yMNyUZTf1OtFW5SLtvocQDUZfwuhEVEfAiZ7XQHpDkLU1zcWcgXjbBDK+EML1mR8CIvVSg2I7B224dnbmr71FqiQc+4bkPS7wGX8Q9+fbve7VF3/SV9ZQIwE15np645ZzegREkQbMt6i4IcuA5L8QXqoH2C1ZiCjCic3dVc66U6yz0Ag12wSMORBG0TSJRmBZvRpHZoyM6+MY33KpHiwdxyhNT+S8S6FlZAG0A6S3zCBnbOveX50V2WqRaqi0whEB88KDGYQNkqzCDJmRUjHVP9Ev+7pSxlvLsEr2TtZgnQ73ay9gMVkD19l/LFWhWr/VMbfEay+lr39eoZ/VXtwOvVYdUx1L1QtptCQ8TlWLXt/KQjEzwlkw01hQsj4J2JJl/o2TbdaSiCDbUPIYOWaMCAY7Ujx8Uu/v5Kt0EsRXT2VmAxdXLUFsyDGIuY0B07eMaZuRNvpTrqFM7ySXNzSwHMQDGvBUjtK0FFmAbvUN8r6vwMYA6wByufmeNsl6H9oZNzrrHlW+cZMhMlJhKxFsndMJzEVBs3+GXaK+pOKzN6hGAAH1F9ez+fzC8tooZqrObmZe108DDB8qd4wQWhiNhRWIxyRFUU+igL7QzJjydT7BVuLGjYDkYDBmqKTKOfIwhAZH0cYh7lKJZ8xSrKvVIammzGPfjNqNeim8ZGr3BRsHOQrq8NZ9Bh+Y+z3EcxC/VJE/TMoOGMZMYZDK5SrYb5UgM6m4UGVIBy4gypykHJmYavYtAMKzeRC+5lo+rPxj1f+BwAA//8DAFBLAwQUAAYACAAAACEAKp9lIGEBAABqAgAAEQAIAWRvY1Byb3BzL2NvcmUueG1sIKIEASigAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhJJNTsMwEIX3SNwh8j5xkkKprCQVP+qKIiTCj9hZ9jSNiJ3IdgldI47CJWDLRXoTnKQNqUBi6XlvPr03cjR9EYXzDErnpYxR4PnIAclKnsssRrfpzJ0gRxsqOS1KCTFag0bT5PAgYhVhpYJrVVagTA7asSSpCatitDSmIhhrtgRBtWcd0oqLUglq7FNluKLsiWaAQ98fYwGGcmooboBu1RPRFslZj6xWqmgBnGEoQIA0GgdegH+8BpTQfy60ysApcrOubKdt3CGbs07s3S867411XXv1qI1h8wf4YX5501Z1c9ncigFKIs4IU0BNqZJTLnIZ4cGkuV5BtZnbQy9y4Gfr5CpbrTefb9K5+3qVTrrafLzbnd8+C257dHTgjk1Guh475X50fpHOUBL64cj1j1x/nPohOQ5IGD42Mfb2m6TdQGzD/EucuMFJGoyJPyHBkLgDJG3u/d+RfAMAAP//AwBQSwMEFAAGAAgAAAAhAKEfdL61AQAA1RIAACcAAAB4bC9wcmludGVyU2V0dGluZ3MvcHJpbnRlclNldHRpbmdzMS5iaW7sWN1KAkEU/lYNRVikBwh8gaI0vAiCzH/xZ3G3MlgI0QIhEkqDwIfoDXofn6En6Kq76KK2b0ct21ZKzR/YPbAzc2bOzM755uyZj81CQRgF1HCDc1wjz7LNHoXtFusidrGNCDYHrSj7rqg1WJoi+TbkR7yuh17gkSDhKdgKNFj7UfVwlCWreYtk/wIPer3hSILedOhTU3g5+YaynHeJW4FOE3XiNZkEbcxNhKwyxpX5Y7j0N/hhGCKiGDVg/PS10dYqgXCg5AthNaWFM0c5VYtXtHz5cH9HtjtmB5yd6+KiERiNv1Qp6cjos+bKSXXv56EFBpn4Z/Z9QGCqo+2v9LzmF9nMusQwt41bOu21vwd+m/f3rSawBx0nyKGEJMpsqdRVnPLRkOJtH+Wtb/YoHC2TIei0q9D+mKMVYV1FjOxAp6WOLO3MdWKCLcRxhv5oAmlksEWtyDVccRFYBAJp8rM6eWyLjO+OjDVJ3nbBvg45XJtM979Ehrz0A/VZdmAY78abYFKrEWvOZbTut+4i4CKwoghEvu0rRO3+K1PFxZ+CGm+L6aSL7kxuzzrf4VH3AQAA//8DAFBLAwQUAAYACAAAACEAC8MAqqQBAAA3AwAAEAAIAWRvY1Byb3BzL2FwcC54bWwgogQBKKAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACck01u2zAQhfcFcgeC+5iyEwSFQTEonAYB+mfATrpmqZFFhCIFzliwe42eoyfosifJTUpJiCI3iwLdDec9PHycIeX1oXashYg2+JzPZxln4E0orN/l/H57e/6WMyTtC+2Ch5wfAfm1Onsj1zE0EMkCshThMecVUbMUAk0FtcZZkn1SyhBrTekYdyKUpTVwE8y+Bk9ikWVXAg4EvoDivBkD+ZC4bOl/Q4tgOj582B6bBKzku6Zx1mhKt1SfrIkBQ0ns/cGAk2IqykS3AbOPlo4qk2J6lBujHaxSsCq1Q5DipSHvQHdDW2sbUcmWli0YCpGh/Z7GtuDsm0bocHLe6mi1p4TV2YZDX7sGKaqvIT5iBUAoRTIMzb6ceqe1vVSL3pCKU2MXMIAk4RRxa8kBfinXOtK/iHuGgXfA2XR88ynfSPp5t3/69cOzD9ZXbF39/vnqFv1gEs9fBKtQN9ofkzBWH61/xPtmG240wfPQT5tyU+kIRdrTuJSxIe/SvKPrQlaV9jsonj2vhe6JPAz/QM2vZtlFlrY/6Unx8uLVHwAAAP//AwBQSwECLQAUAAYACAAAACEAIYxGOnMBAACMBQAAEwAAAAAAAAAAAAAAAAAAAAAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLAQItABQABgAIAAAAIQC1VTAj9AAAAEwCAAALAAAAAAAAAAAAAAAAAKwDAABfcmVscy8ucmVsc1BLAQItABQABgAIAAAAIQBKqaZh+gAAAEcDAAAaAAAAAAAAAAAAAAAAANEGAAB4bC9fcmVscy93b3JrYm9vay54bWwucmVsc1BLAQItABQABgAIAAAAIQCeO2o2UAIAALgEAAAPAAAAAAAAAAAAAAAAAAsJAAB4bC93b3JrYm9vay54bWxQSwECLQAUAAYACAAAACEAmt4cLDgEAAAPFgAADQAAAAAAAAAAAAAAAACICwAAeGwvc3R5bGVzLnhtbFBLAQItABQABgAIAAAAIQA7bTJLwQAAAEIBAAAjAAAAAAAAAAAAAAAAAOsPAAB4bC93b3Jrc2hlZXRzL19yZWxzL3NoZWV0MS54bWwucmVsc1BLAQItABQABgAIAAAAIQB37D31/AEAABgEAAAYAAAAAAAAAAAAAAAAAO0QAAB4bC93b3Jrc2hlZXRzL3NoZWV0Mi54bWxQSwECLQAUAAYACAAAACEAdT6ZaZMGAACMGgAAEwAAAAAAAAAAAAAAAAAfEwAAeGwvdGhlbWUvdGhlbWUxLnhtbFBLAQItABQABgAIAAAAIQAzbi8JDwYAAAYZAAAYAAAAAAAAAAAAAAAAAOMZAAB4bC93b3Jrc2hlZXRzL3NoZWV0MS54bWxQSwECLQAUAAYACAAAACEAi0E1gg4DAAAwBwAAFAAAAAAAAAAAAAAAAAAoIAAAeGwvc2hhcmVkU3RyaW5ncy54bWxQSwECLQAUAAYACAAAACEAKp9lIGEBAABqAgAAEQAAAAAAAAAAAAAAAABoIwAAZG9jUHJvcHMvY29yZS54bWxQSwECLQAUAAYACAAAACEAoR90vrUBAADVEgAAJwAAAAAAAAAAAAAAAAAAJgAAeGwvcHJpbnRlclNldHRpbmdzL3ByaW50ZXJTZXR0aW5nczEuYmluUEsBAi0AFAAGAAgAAAAhAAvDAKqkAQAANwMAABAAAAAAAAAAAAAAAAAA+icAAGRvY1Byb3BzL2FwcC54bWxQSwUGAAAAAA0ADQBsAwAA1CoAAAAA";
        this.downloadTempExcel(data, "MAU_DANG_KY_DINH_HUONG.xlsx");
        //this._serviceApi.execServiceLogin("B186CEDA-876B-4511-96D1-E199926A6913", [{ "name": "ORGID", "value": "115" }]).subscribe((data) => {
         //   this.downloadTempExcel(data.data, "MAU_DANG_KY_DINH_HUONG.xlsx");
      //  })
    }

    importFile(event) {
        this.showTable = false
        const file = event.target.files[0];
        const formTem = this.form.value;
        this.form = this._formBuilder.group({
            name: [formTem.name, [Validators.required]],
            year: [formTem.year, [Validators.required]],
            maKeHoach: this.idParam,
            listChiTietImport: [],
        }
        )

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let fileBase64 = reader.result.toString().split(',')[1];
            this._serviceApi.execServiceLogin("1E707636-93B5-43EA-97BC-2F850C14D1E3", [{ "name": "ORGID", "value": "115" }, { "name": "FILE_UPLOAD", "value": fileBase64 }]).subscribe((data) => {
              
                let arr = data.data || [];
                let capTao = "DONVI";
                if (this.listDonvi != null && this.listDonvi.length > 0) {
                    capTao = 'TCT';
                }
                let kehoach = {
                    capTao: capTao,
                    listKeHoach: arr
                };
                this._serviceApi.dataKeHoach.next(kehoach);
                this.listChiTietImport = data.data || [];
                this.showTable = true
            })
        };
    }




    downloadTempExcel(userInp, fileName) {
        var mediaType = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
        // var userInp = document.getElementById('base64input');
        // var userInp = "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";
        // //var a = document.createElement('a');
        // a.href = mediaType+userInp;
        //a.href = mediaType+userInp;
        const downloadLink = document.createElement('a');
        //const fileName = 'sample.excel';

        downloadLink.href = mediaType + userInp;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    ngOnDestroy() {
        // this.getYearSubscription.unsubscribe();
        //this.getStatusSubscription.unsubscribe();
    }

    onSubmit(status) {
        this.submitted.check = true;
        if (this.form.invalid || this.listupload.length == 0) {
            return;
        }
        console.log(this.form);
        let name = this.form.value.name;
        let nam = this.form.value.year;

       // let capTao = 'DONVI';
       // if (this.listDonvi != undefined && this.listDonvi.length > 0) {
       //     capTao = "TCT";
       // }
        let listChiTiet = [];
        let listFile = this.listupload;
        let kehoach = { name: name, nam: nam, maTrangThai: status, maKeHoach: this.idParam };
        for (let i = 0; i < this.form.value.listNhiemVu.length; i++) {
            let chitiet1 = this.form.value.listNhiemVu[i];
            for (let j = 0; j < chitiet1.listNhiemVu_cap2.length; j++) {
                let chitiet2 = chitiet1.listNhiemVu_cap2[j];
                if (chitiet2.chiTiet == 0) {
                    listChiTiet.push(chitiet2);
                }
                if (chitiet2 != null && chitiet2.listNhiemVu_cap3 != undefined && chitiet2.listNhiemVu_cap3.length > 0) {
                    for (let k = 0; k < chitiet2.listNhiemVu_cap3.length; k++) {
                        let chitiet3 = chitiet2.listNhiemVu_cap3[k];
                        if (chitiet3.chiTiet == 0) {
                            listChiTiet.push(chitiet3);
                        }
                        if (chitiet3.listNhiemVu_cap4 != undefined && chitiet3.listNhiemVu_cap4.length > 0) {
                            for (let i = 0; i < chitiet3.listNhiemVu_cap4.length; i++) {
                                let chitiet4 = chitiet3.listNhiemVu_cap4[k];
                                if (chitiet4.chiTiet == 0) {
                                    listChiTiet.push(chitiet4);
                                }
                            }
                        }

                    }
                }
                if(status=='CHO_PHE_DUYET' && listChiTiet.length ==0){
                    this._messageService.showErrorMessage("Thông báo", "Vui lòng thêm thông tin đăng ký định hướng.");
                }

                // if (this.listDonvi != undefined && this.listDonvi.length > 0) {
                //     for (let k = 0; k < chitiet2.listNhiemVu_cap3.length; k++) {
                //         let itemChiTiet = chitiet2.listNhiemVu_cap3[k];

                //         if (itemChiTiet.listNhiemVu_cap4 != undefined && itemChiTiet.listNhiemVu_cap4.length > 0) {
                //             for (let i = 0; i < itemChiTiet.listNhiemVu_cap4.length; i++) {

                //                 listChiTiet.push(itemChiTiet.listNhiemVu_cap4[i]);
                //             }
                //         }
                //     }
                // } else {

                //     if (chitiet2.listNhiemVu_cap3 != undefined && chitiet2.listNhiemVu_cap3.length > 0) {
                //         for (let i = 0; i < chitiet2.listNhiemVu_cap3.length; i++) {

                //             listChiTiet.push(chitiet2.listNhiemVu_cap3[i]);
                //         }
                //     }
                // }


            }
        }
   
        var token = localStorage.getItem("accessToken");
        this._serviceApi.execServiceLogin("404ABE65-3B92-448F-A8F0-9543503AE1E3", [{ "name": "LIST_FILE", "value": JSON.stringify(listFile) }, { "name": "LIST_KE_HOACH_CHI_TIET", "value": JSON.stringify(listChiTiet) }, { "name": "TOKEN_LINK", "value": "Bearer " + token }, { "name": "KE_HOACH", "value": JSON.stringify(kehoach) }]).subscribe((data) => {
            // this._messageService.showSuccessMessage("Thông báo", data.message);
            // this._router.navigateByUrl('nghiepvu/kehoach/dinhhuong');
            switch (data.status) {
                case 1:
                    this._messageService.showSuccessMessage("Thông báo", data.message);
                    if (this.screen) {
                        this._router.navigateByUrl(this.screen);
                    } else {
                        this._router.navigateByUrl('nghiepvu/kehoach/dinhhuong');
                    }
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

    }

    resetFileUploader() {
        this.fileUpload2.nativeElement.value = null;
    }
    dataFile = [];
    openAlertDialog(type) {
        let data = this.dialog.open(PopupCbkhComponent, {
            data: {
                type: type,
                linkApi: this.linkDoffice,
                maDv: this.user.ORGID,
            },
            width: '800px',
            panelClass: 'custom-PopupCbkh',
            position: {
                top: '100px',
            }
        });
        data.afterClosed().subscribe((data) => {
            //if (type == 'DOFFICE') {
            this.dataFile = this._dOfficeApi.execTimKiemTheoFile(this.linkDoffice, data.ID_VB);
            if (this.dataFile != null && this.dataFile.length > 0) {

                for (var i = 0; i < this.dataFile.length; i++) {
                    let dataBase64 = this._dOfficeApi.execFileBase64(this.linkDoffice, this.dataFile[i].ID_FILE, this.user.ORGID, this.dataFile[i].ID_VB);
                    this.listupload.push({
                        fileName: this.dataFile[i].TEN_FILE,
                        base64: dataBase64,
                        size: 0,
                        sovanban: data.KY_HIEU,
                        mafile: ""
                    })
                }
            }
        })
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

    downLoadFile(item) {
        if (item.base64 != undefined && item.base64 != '') {
            let link = item.base64.split(',');
            let url = "";
            if (link.length > 1) {
                url = link[1];
            } else {
                url = link[0];
            }
            this.downloadTempExcel(url, item.fileName);
        } else {
            var token = localStorage.getItem("accessToken");
            this._serviceApi.execServiceLogin("2269B72D-1A44-4DBB-8699-AF9EE6878F89", [{ "name": "DUONG_DAN", "value": item.duongdan }, { "name": "TOKEN_LINK", "value": "Bearer " + token }]).subscribe((data) => {
                console.log("downloadFile:" + JSON.stringify(data));
            })
        }

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

}
