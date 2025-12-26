import { Component, EventEmitter, Output } from '@angular/core';
import { TemplateFooterBtns } from 'src/app/enums/template-footer-btns';
import { BtnModel, CTA_BtnModel } from 'src/app/models/templateModel';

@Component({
  selector: 'app-template-footer-btns',
  templateUrl: './template-footer-btns.component.html',
  styleUrls: ['./template-footer-btns.component.scss']
})
export class TemplateFooterBtnsComponent {

  footerBtnType!: TemplateFooterBtns;
  selectedButtonType!: TemplateFooterBtns;
  @Output() templateButtons = new EventEmitter();

  setDisabled: boolean = false;

  btnModel!: BtnModel;
  ctaBtnModel!: CTA_BtnModel;

  quickReplyBtnArray: any = [
    { index: "qucikReply1", value: '', isDeleted: false, isCreated: false },
    { index: "qucikReply2", value: '', isDeleted: false, isCreated: false },
    { index: "qucikReply3", value: '', isDeleted: false, isCreated: false }
  ];

  ctaBtnArray: any = [
    { index: "cta", value: '', type: '', text: '', isDeleted: false, isCreated: false },
    { index: "cta", value: '', type: '', text: '', isDeleted: false, isCreated: false },
    { index: "cta", value: '', type: '', text: '', isDeleted: false, isCreated: false }
  ];

  ctaBtn: TemplateFooterBtns = TemplateFooterBtns.CALL_TO_ACTION;
  quickReplayBtn: TemplateFooterBtns = TemplateFooterBtns.QuICK_REPLY;

  constructor() { }

  addFooterBtns() {
    this.selectedButtonType = this.footerBtnType;
    // this.setDisabled = true;
    if (this.selectedButtonType == TemplateFooterBtns.CALL_TO_ACTION) {
      let findObj = this.ctaBtnArray.find((btn: any) => !btn.isCreated);
      if (findObj && this.ctaBtnArray.length <= 3) {
        findObj.isCreated = true;
      } else if (this.ctaBtnArray.length <= 3) {
        let findObj = this.ctaBtnArray.find((btn: any) => btn.isDeleted);
        findObj.isDeleted = false;
      }
    }

    if (this.selectedButtonType == TemplateFooterBtns.QuICK_REPLY) {
      let findObj = this.quickReplyBtnArray.find((btn: any) => !btn.isCreated);
      if (findObj && this.quickReplyBtnArray.length <= 3) {
        findObj.isCreated = true;
      } else if (this.quickReplyBtnArray.length <= 3) {
        let findObj = this.quickReplyBtnArray.find((btn: any) => btn.isDeleted);
        findObj.isDeleted = false;
      }
    }
  }

  deleteQuickRplyBtn(btnIndex: any) {
    let findObj = this.quickReplyBtnArray.find((btn: any) => btn === btnIndex)
    findObj.isDeleted = true;
    findObj.value = '';
    this.pushQuickButtonArray();
  }

  setQuickBtnValue(btnData: any) {
    console.log(btnData);
    this.quickReplyBtnArray.find((btn: any) => btn.index === btnData.index).value = btnData.value;
    this.pushQuickButtonArray();
  }

  setCtaBtnValue(btnData: any) {
    console.log(btnData);
    this.ctaBtnArray.find((btn: any) => btn.index === btnData.index).value = btnData.value;
    this.pushCtaButtonArray();
  }

  pushQuickButtonArray() {
    const quickBtns = this.quickReplyBtnArray.filter((btn: any) => btn.isCreated && !btn.isDeleted);
    this.btnModel = {
      type: this.selectedButtonType,
      value: this.selectedButtonType === TemplateFooterBtns.QuICK_REPLY ? quickBtns : this.quickReplyBtnArray
    }
    console.log(this.btnModel);
    // this.btnModel.type = this.selectedButtonType;
    // this.btnModel.value = this.selectedButtonType === TemplateFooterBtns.QuICK_REPLY ? quickBtns : this.quickReplyBtnArray;
    this.templateButtons.emit(this.btnModel)
  }

  pushCtaButtonArray() {
    const ctaArray = this.ctaBtnArray.filter((btn: any) => btn.isCreated && !btn.isDeleted);
    this.ctaBtnModel = {
      type: this.selectedButtonType,
      value: this.selectedButtonType === TemplateFooterBtns.CALL_TO_ACTION ? ctaArray : this.ctaBtnArray
    }

    const btn = {
      type: 'BUTTONS',
      value: this.ctaBtnModel
    }

    // this.ctaBtnModel.type = this.selectedButtonType;
    // this.ctaBtnModel.value = this.selectedButtonType === TemplateFooterBtns.CALL_TO_ACTION ? ctaArray : this.ctaBtnArray;
    this.templateButtons.emit(btn)
    console.log(btn);
  }

  deleteCTABtn(btnIndex: any) {
    let findObj = this.ctaBtnArray.find((btn: any) => btn === btnIndex)
    findObj.isDeleted = true;
    findObj.value = '';
    this.pushCtaButtonArray();
    //this.ctaBtnArray = this.ctaBtnArray.filter((item: any) => item !== btnIndex);
  }
}
