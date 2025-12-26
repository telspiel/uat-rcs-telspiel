import {
  Component,
  ElementRef,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent implements OnDestroy {
  @Input() imageUrl: string = '';
  @Input() imageFile!: File; // 💡 Accept file instead of URL
  @Input() cropWidth: number = 300;
  @Input() cropHeight: number = 300;
  @Output() cropped = new EventEmitter<string>();

  @ViewChild('image', { static: false }) imageElement!: ElementRef;

  cropper!: Cropper;
  isInitialized = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageFile'] && this.imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        setTimeout(() => this.initCropper(), 100); // Ensure image is rendered
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  initCropper(): void {
    if (this.cropper) {
      this.cropper.destroy();
    }
  
    const image = this.imageElement.nativeElement;
  
    this.cropper = new Cropper(image, {
      viewMode: 1,
      autoCropArea: 1,
      aspectRatio: this.cropWidth / this.cropHeight,
      background: false,
      zoomable: true,
      scalable: true,
      movable: true,
      cropBoxResizable: false,
      cropBoxMovable: true,
      ready: () => {
        // Set crop box size fixed and centered
        const cropBoxData = {
          width: this.cropWidth,
          height: this.cropHeight
        };

        const containerData = this.cropper.getContainerData();

        const left = (containerData.width - cropBoxData.width) / 2;
        const top = (containerData.height - cropBoxData.height) / 2;

        this.cropper.setCropBoxData({
          width: cropBoxData.width,
          height: cropBoxData.height,
          left,
          top
        });
      }
    });
  }
  
  crop(): void {
    const canvas = this.cropper.getCroppedCanvas({
      width: this.cropWidth,
      height: this.cropHeight,
      imageSmoothingQuality: 'high',
      fillColor: '#ffffff' // ✅ removes alpha to reduce PNG size
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          this.cropped.emit(base64); // ✅ base64 PNG output
        };
        reader.readAsDataURL(blob);
      }
    }, 'image/jpeg', 0.8);
  }

  ngOnDestroy(): void {
    if (this.cropper) {
      this.cropper.destroy();
    }
  }
}
