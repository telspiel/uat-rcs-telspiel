import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bot-previwe',
  templateUrl: './bot-previwe.component.html',
  styles: [`
    .whatsapp-preview-block {
    width: 310px;
    height: 600px;
    position: relative;
    overflow: hidden;
    background: url('/assets/images/mobile-frame.png') no-repeat center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  
    .inner-container {
      width: 85%;
      height: 90%;
      position: absolute;
      top: 5%;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      border-radius: 25px;
      overflow: hidden;
    }
  
    .header-background {
      height: 15%;
      border-radius: 25px 25px 0 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
  
      .background-img {
        width: 100%;
        height: auto;
        aspect-ratio: 3 / 1;
        object-fit: cover;
        object-position: center;
      }
    }
  
    .profile-img {
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #ffffff;
      border: 2px solid #ccc;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  
    .bot-name {
      text-align: center;
      margin-top: 20%;
      font-weight: bold;
      font-size: 18px;
    }
  
    .bot-summary {
      text-align: center;
      font-size: 12px;
      color: #5a5a5a;
      padding: 5px 10px;
    }
  
    .icons-row {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
      padding: 0 20px;
  
      .icon-col {
        text-align: center;
        font-size: small;
      }
    }
  
    .tabs-container {
      margin-top: 10px;
      width: 100%;
      height: 45%;
      overflow-y: auto;
    }
  
    .info-list {
      list-style: none;
      padding: 5px;
  
      .info-item {
        display: flex;
        align-items: center;
        padding: 5px;
  
        span[nz-icon] {
          margin-right: 10px;
          font-size: 1.2rem;
        }
  
        .info-details {
          display: flex;
          flex-direction: column;
          width: 100%;
  
          .info-label {
            border-bottom: #8b8b8b solid 2px;
            font-size: smaller;
            width: 100%;
          }
        }
      }
    }
  }
  `]
})
export class BotPreviweComponent {
  @Input() botName: string = 'BotName';
  @Input() botSummary: string = 'Bot Description';
  @Input() imageUrl: string | null = null;
  @Input() backgroundUrl: string | null = null;
  @Input() validateForm!: FormGroup;
  @ViewChild('icons', { static: false }) icons!:  ElementRef;
  @Input() selectedColor: string = '#d71d1d'; // Default color
  constructor(private el: ElementRef) {}



}
