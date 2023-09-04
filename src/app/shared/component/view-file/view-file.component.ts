import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.scss']
})
export class ViewFileComponent implements OnInit {

  pdfSrc;
  constructor(

    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ViewFileComponent>
  ) {
    if (data) {
      this.pdfSrc = data.file

    }
  }


  ngOnInit(): void {

  }


  onCloseClick(): void {
    this.dialogRef.close(true);
  }



}
