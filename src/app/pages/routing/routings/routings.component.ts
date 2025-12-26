import { Component } from '@angular/core';

@Component({
  selector: 'app-routings',
  templateUrl: './routings.component.html',
  styleUrls: ['./routings.component.scss']
})


export class RoutingsComponent {

  isPromoclick  = false;

  isTransclick  = false;

  isOtpclick = false
  modalService: any;

  isVisible = false;
  isConfirmLoading = false;

  isVisible1 = false; 


  isVisible2 = false; 

  // isConfirmLoading = false;


  setPromo(){
  this.isPromoclick = !this.isPromoclick;

  }

  
  setTrans(){
    this.isTransclick = !this.isTransclick;
  
    }

  setOTP(){
    this.isOtpclick = !this.isOtpclick;
  }



    showModal(): void {
      this.isVisible = true;
    }
  
    handleOk(): void {
      console.log('Button ok clicked!');
      this.isVisible = false;
    }
  
    handleCancel(): void {
      console.log('Button cancel clicked!');
      this.isVisible = false;
    }

    showModal1(): void {
      this.isVisible1 = true;
    }
  
    handleOk1(): void {
      console.log('Button ok clicked!');
      this.isVisible1 = false;
    }
  
    handleCancel1(): void {
      console.log('Button cancel clicked!');
      this.isVisible1 = false;
    }



    showModal2(): void {
      this.isVisible2 = true;
    }
  
    handleOk2(): void {
      console.log('Button ok clicked!');
      this.isVisible2 = false;
    }
  
    handleCancel2(): void {
      console.log('Button cancel clicked!');
      this.isVisible2 = false;
    }
}
