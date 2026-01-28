import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { ToastService } from "src/app/shared/toast-service.service";
import { TemplateMessageService } from "src/app/service/template-message.service";
import { TemplateService } from "src/app/service/template-service.service";
import {
  SEND_TEMPLATE_MODEL,
  TEMPLATES,
  TEMPLATE_RESPONSE,
} from "src/app/models/templateModel";
import { NzCarouselComponent } from "ng-zorro-antd/carousel";
import { ReportService } from "src/app/service/report.service";
import { BrandService } from "src/app/service/brand.service";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { DomSanitizer } from "@angular/platform-browser";
import { NzIconService } from "ng-zorro-antd/icon";
import { Router } from "@angular/router";
import { BASE_URL } from "src/app/config/app-config";
import { NgxUiLoaderService } from "ngx-ui-loader";

interface Suggestion {
  type: string;
  text: string;
  postback: string;
}

interface Bot {
  botId: string;
  botName: string;
}
@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"],
})
export class AddComponent {
  //@ViewChild('carouselRef', { static: false }) carousel!: NzCarouselComponent;
  @ViewChildren("textInput") textInputs!: QueryList<ElementRef>;
  @ViewChildren("postbackInput") postbackInputs!: QueryList<ElementRef>;

  // Custom URL validator function
  private urlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }
      
      const urlPattern = /^(https?:\/\/)([\w\d-]+\.)+[\w]{2,}(\/[\S]*)?$/i;
      if (!urlPattern.test(control.value)) {
        return { invalidUrl: true };
      }
      
      return null;
    };
  }

  cards: { id: number; previewUrl: string | null }[] = [];

  apiUrl = `${BASE_URL}/rcs-reseller-service/templateService/uploadFile`;
  token = sessionStorage.getItem("TOKEN") || "";
  userName = sessionStorage.getItem("USER_NAME") || "";

  error = true;
  isDisabled = false;
  uploadedFileName = "";
  valueChangesSubscriptionSussutions: any;
  fileList = [];
  err = "";
  addPage: boolean = true;
  ViewPage: boolean = false;
  imageHeight = 120;
  orientation = "vertical";
  selectedCardIndex: any;
  templateType: string = "rich_card";
  templateForm!: FormGroup;
  alignmenttype: string = "LEFT";
  date: any;
  cardTitle: string = "";
  cardDescription: string = "";
  suggestionsArray: any[] = [];
  carouselList: {
    cardTitle: string;
    cardDescription: string;
    mediaUrl: string | null;
    suggestions: any[];
    thumbnailFileName: string | null;
    thumbnailUrl: string | null;
  }[] = [
    {
      cardTitle: "",
      cardDescription: "",
      mediaUrl: "",
      suggestions: [],
      thumbnailFileName: "",
      thumbnailUrl: "",
    },
    {
      cardTitle: "",
      cardDescription: "",
      mediaUrl: "",
      suggestions: [],
      thumbnailFileName: "",
      thumbnailUrl: "",
    },
  ];
  carouseldetails: { cardTitle: string }[] = [];
  // suggestions: FormArray = this.fb.array([]);
  type: string = "rich_card";
  alignment: string = "LEFT";
  text: string[] = [];
  postback: string = "";
  newbot: Bot[] = [];
  selectedActionType: string = ""; // Default empty
  currentStep: number = 1;
  messageTemplates: any = [];
  validateForm: FormGroup;
  VideoSize: number = 0; // Track video size
  // isFallbackEnabled: boolean = false;
  messageBody = "";
  TextMessage: boolean = true;
  bot: any;
  fallbackSmsContent: string = "";
  carddescription: string = "";
  textValues: { [key: number]: string } = {};
  suggestionTexts: { [key: number]: string } = {};
  Suggestiontext: string = "";
  selectedBotName: string = ""; // Default value
  messagecontent: string = "";
  previewUrl: string | null = null;
  uploadedFileSize: string | null = null;
  uploadedFileUrl: string | null = null;
  edit: boolean = false;
  thumbnailUrl = "";
  // selectedCardIndex: number | null = null;
  valueChangesSubscription: any; // Store subscription to unsubscribe late
  isVisible = false;
  isConfirmLoading = false;
  imageChangedEvent: any = "";
  croppedImage: any = "";
  isCropperVisible = false;
  selectedFile: NzUploadFile | null = null;
  file: File | null = null;
  formData: FormData | undefined;
  filename: string = "";
  fileUrl: string = "";
  fileType: string = "";
  fileOrgType: string = "";
  isVideo = false;
  isthumVisible = false;
  thumbnailFileName = "";
  imageBase64: string | ArrayBuffer | null = null;

  // File size tracking properties
  currentImageSize: number = 0;
  currentVideoSize: number = 0;

  maxCombinedSize: number = 10 * 1024 * 1024; // 10MB

  // Debounce mechanism to prevent multiple rapid calls
  private lastToastTime: number = 0;
  private readonly TOAST_DEBOUNCE_TIME = 2000; // 2 seconds

  i: any;
  selectedFile1: File | null = null;
  carousel!: any;

  onCarouselRefChange(event: any): void {
    console.log("Carousel reference changed:", event);
    this.carousel = event;
  }

  onFileSelected(event: NzUploadChangeParam): void {

    this.templateForm.patchValue({
      standAloneFileName: "",
    });
    const file = event.file.originFileObj;
    const isVideoUploaded = this.isVideo;
    const sizeLimitText = isVideoUploaded ? "360KB" : "360KB";
    const errorMessage = isVideoUploaded
      ? "Files under 100KB are allowed for thumbnails"
      : "Files under 360KB are allowed";

    // Clear any previous file and error
    this.selectedFile1 = null;
    this.err = "";

    if (!file) {
      // Clear the uploaded file from the component
      event.fileList = [];

      // Debounce toast to prevent multiple notifications
      const currentTime = Date.now();
      if (currentTime - this.lastToastTime > this.TOAST_DEBOUNCE_TIME) {
        this.toastService.publishNotification("error", errorMessage, "error");
        this.lastToastTime = currentTime;
      }

      this.err = errorMessage;
      return;
    }

    // Validate file type
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedImageTypes.includes(file.type)) {
      event.fileList = [];
      this.err = "Invalid file type. Only JPG, JPEG, or PNG images are allowed.";
      // Debounce toast to prevent multiple notifications
      const currentTime = Date.now();
      if (currentTime - this.lastToastTime > this.TOAST_DEBOUNCE_TIME) {
        this.toastService.publishNotification(
          "error",
          "Invalid file type. Only JPG, JPEG, or PNG images are allowed.",
          "error"
        );
        this.lastToastTime = currentTime;
      }
      return;
    }

    // // Check combined size validation only for regular images (not thumbnails)
    // if (!isVideoUploaded) {
    //   const combinedSize = file.size + this.currentVideoSize;
    //   if (combinedSize > this.maxCombinedSize) {
    //     // Clear the uploaded file from the component
    //     event.fileList = [];

    //     // Debounce toast to prevent multiple notifications
    //     const currentTime = Date.now();
    //     if (currentTime - this.lastToastTime > this.TOAST_DEBOUNCE_TIME) {
    //       this.toastService.publishNotification(
    //         "error",
    //         "Combined file size (image + video) cannot exceed 10MB",
    //         "error"
    //       );
    //       this.lastToastTime = currentTime;
    //     }

    //     this.err = "Combined file size (image + video) cannot exceed 10MB.";
    //     return;
    //   }
    // }

    this.err = "";
    this.selectedFile1 = file;
    if (!isVideoUploaded) {
      this.currentImageSize = file.size; // Track image size only for regular images
    }
    this.fileType = file.type?.split("/")[1] || "";
    this.fileOrgType = file.type;
  }

  onImageCropped(base64: string) {
    this.imageBase64 = base64;
  }

  base64ToBlob(base64: string, contentType = "image/png"): Blob {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  // compressImageToSize(base64: string, maxSizeInBytes: number): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();
  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const ctx = canvas.getContext("2d");

  //       if (!ctx) {
  //         reject(new Error("Could not get canvas context"));
  //         return;
  //       }

  //       // Start with original dimensions
  //       let width = img.width;
  //       let height = img.height;
  //       let quality = 0.9;

  //       const compressImage = () => {
  //         canvas.width = width;
  //         canvas.height = height;

  //         // Clear canvas and draw image
  //         ctx.clearRect(0, 0, canvas.width, canvas.height);
  //         ctx.drawImage(img, 0, 0, width, height);

  //         // Convert to base64 with current quality
  //         const compressedBase64 = canvas.toDataURL("image/png", quality);

  //         // Check size
  //         const sizeInBytes = Math.ceil((compressedBase64.length * 3) / 4);

  //         if (sizeInBytes <= maxSizeInBytes) {
  //           resolve(compressedBase64);
  //         } else {
  //           // Try reducing quality first
  //           if (quality > 0.1) {
  //             quality -= 0.1;
  //             compressImage();
  //           } else {
  //             // If quality reduction doesn't work, try reducing dimensions
  //             if (width > 100 && height > 100) {
  //               width = Math.floor(width * 0.9);
  //               height = Math.floor(height * 0.9);
  //               quality = 0.9; // Reset quality
  //               compressImage();
  //             } else {
  //               reject(new Error("Unable to compress image to required size"));
  //             }
  //           }
  //         }
  //       };

  //       compressImage();
  //     };

  //     img.onerror = () => {
  //       reject(new Error("Failed to load image"));
  //     };

  //     img.src = base64;
  //   });
  // }

  // get vediocropDimensions(): { width: number; height: number } {
  //   const type = this.templateForm.get("type")?.value;
  //   const cardOrientation = this.templateForm.get("cardOrientation")?.value;
  //   const height = this.templateForm.get("height")?.value;
  //   const width = this.templateForm.get("width")?.value;

  //   // Define base width to calculate proportional height
  //   const base = 1440; // You can choose any base value

  //   if (type === "rich_card") {
  //     if (cardOrientation === "VERTICAL") {
  //       if (height === "SHORT_HEIGHT") return { width: base, height: base / 3 }; // 3:1
  //       if (height === "MEDIUM_HEIGHT")
  //         return { width: base, height: (base * 3) / 7 }; // 7:3
  //     }
  //     if (cardOrientation === "HORIZONTAL") {
  //       return { width: base, height: (base * 33) / 25 }; // 25:33
  //     }
  //   }

  //   if (type === "carousel") {
  //     if (width === "SMALL_WIDTH") {
  //       if (height === "MEDIUM_HEIGHT")
  //         return { width: base, height: (base * 5) / 4 }; // 4:5
  //       if (height === "SHORT_HEIGHT")
  //         return { width: base, height: (base * 4) / 5 }; // 5:4
  //     }
  //     if (width === "MEDIUM_WIDTH") {
  //       if (height === "SHORT_HEIGHT") return { width: base, height: base / 2 }; // 2:1
  //       if (height === "MEDIUM_HEIGHT")
  //         return { width: base, height: (base * 3) / 4 }; // 4:3
  //     }
  //   }

  //   // Default dimensions if nothing matches
  //   return { width: base, height: base };
  // }

  get cropDimensions(): { width: number; height: number } {
    const type = this.templateForm.get("type")?.value;
    const orientation = this.templateForm.get("cardOrientation")?.value;
    const height = this.templateForm.get("height")?.value;
    const width = this.templateForm.get("width")?.value;

    // RICH CARD
    if (type === "rich_card") {
      if (orientation === "VERTICAL") {
        if (height === "SHORT_HEIGHT") return { width: 1440, height: 480 }; // 3:1
        if (height === "MEDIUM_HEIGHT" && !this.isVideo)
          return { width: 1440, height: 720 }; // 2:1
        if (height === "MEDIUM_HEIGHT" && this.isVideo)
          return { width: 1400, height: 600 };
      }
      if (orientation === "HORIZONTAL" && !this.isVideo)
        return { width: 768, height: 1024 }; // 3:4
      if (orientation === "HORIZONTAL" && this.isVideo)
        return { width: 1000, height: 1320 };
    }

    // CAROUSEL
    if (type === "carousel") {
      if (height === "SHORT_HEIGHT" && width === "SMALL_WIDTH")
        return { width: 960, height: 720 }; // 5:4
      if (height === "SHORT_HEIGHT" && width === "MEDIUM_WIDTH")
        return { width: 1440, height: 720 }; // 2:1
      if (height === "MEDIUM_HEIGHT" && width === "SMALL_WIDTH")
        return { width: 576, height: 720 }; // 4:5
      if (height === "MEDIUM_HEIGHT" && width === "MEDIUM_WIDTH")
        return { width: 1440, height: 1080 }; // 4:3
    }

    return { width: 1440, height: 480 }; // default fallback
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const event = { target: { files: [file] } };
    this.selectedFile = event.target.files[0];
    this.fileType = event.target.files[0].type?.split("/")[1] || "";
    console.log(event);
    if (!file) return false;
    if (this.fileType !== "mp4") {
      if (this.fileType === "png") {
        this.imageChangedEvent = event.target.files[0];
      } else {
        this.err = "Invalid file format";
      }
    }

    return false; // Prevent default upload behavior
  };
  selectedColor: any;
  imageUrl: any;
  backgroundUrl: any;
  messageTemplate: any;
  selectedBotId12: boolean = false;
  selectedBot: any;
  botss: any;
  imageCropped(event: ImageCroppedEvent) {
    console.log(event);
    if (event.objectUrl) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(
        event.objectUrl
      );
    }
    if (event.blob) {
      this.file = new File([event.blob], this.filename, {
        type: event.blob.type,
        lastModified: Date.now(),
      });
    }
    //console.log(event);
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  // showModal(): void {
  //   this.isVisible = true;
  // }

  generateRandomFilename(): string {
    const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
    return `file${randomNum}.${
      this.fileType == "png" ? "jpeg" : this.fileType
    }`; // Return the filename with the random number
  }

  showModal(): void {
    this.isVisible = true;
    this.filename = this.generateRandomFilename(); // Assign the random filename
  }
  showthum() {
    this.isthumVisible = true;
  }
  handleOk() {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;

      //this.onFileChange()
      this.file = new File(
        [this.base64ToBlob(this.imageBase64 as string, this.fileType)],
        this.filename,
        { type: this.fileType, lastModified: Date.now() }
      );

      if (this.file) {
        const formData = new FormData();
        formData.append(
          "file",
          this.file! as Blob,
          this.generateRandomFilename()
        );
        const userName = sessionStorage.getItem("USER_NAME");
        if (userName) {
          formData.append("userName", userName);
        }

        this.templateService.uploadFile(formData).subscribe((res) => {
          this.fileUrl = res.fileUploadLocation;
          // Fetch the file from the URL and get its size, then show in toast
          if (this.fileUrl) {
            // Use the file size from the File object if available
            if (this.file && this.file.size) {
              const sizeKB = (this.file.size / 1024).toFixed(1);
              this.uploadedFileSize = sizeKB;
            }
            this.templateForm.patchValue({ standAloneFileName: this.fileUrl });
            if (this.templateForm.get("type")?.value == "carousel") {
              this.carouselList[this.selectedCardIndex].mediaUrl = this.fileUrl;
            }
            this.selectedFile1 = null;
          }
        });
      }
    }, 1000);
    if (this.fileType !== "mp4") {
      this.isCropperVisible = false;
      this.previewUrl = this.croppedImage;
      this.imageChangedEvent = "";
    }
  }
  beforeVideoUpload = (file: NzUploadFile, fileList: NzUploadFile[]) =>{
    console.log(file);
    if (this.templateForm.get('type')?.value === 'rich_card') {
      if (file.size && file.size > 8 * 1024 * 1024) {
        this.toastService.publishNotification(
          "error",
          "Video file size cannot exceed 8MB",
          "error"
        );
        return false;
      }
    } else if (this.templateForm.get('type')?.value === 'carousel') {
      if (file.size && file.size > 4 * 1024 * 1024) {
        this.toastService.publishNotification(
          "error",
          "Video file size cannot exceed 4MB",
          "error"
        );
        return false;
      }
    }
    return true;
  }


  VideoHandleChange(event: NzUploadChangeParam): void {
    this.templateForm.patchValue({
      standAloneFileName: "",
    });
    const { file } = event;
    if (file && file.type !== "video/mp4") {
      this.toastService.publishNotification(
        "error",
        "Only MP4 video files are allowed.",
        "error"
      );
      return;
    }
    if (file.status === "uploading") {
      // console.log('Uploading file...', file);
    } else if (file.status === "done") {
      // Validate video file size (8MB limit)
      // Only validate video size for rich_card type
      if (this.templateForm.get('type')?.value === 'rich_card') {
        if (file.size && file.size > 8 * 1024 * 1024) {
          this.toastService.publishNotification(
        "error",
        "Video file size cannot exceed 8MB",
        "error"
          );
          return;
        }
      }
      else{
        if (file.size && file.size > 4 * 1024 * 1024) {
          this.toastService.publishNotification(
        "error",
        "Video file size cannot exceed 4MB",
        "error"
          );
          return;
        }
      }

      // Check combined size validation
      // const combinedSize = (file.size || 0) + this.currentImageSize;
      // if (combinedSize > this.maxCombinedSize) {
      //   this.toastService.publishNotification(
      //     "error",
      //     "Combined file size (image + video) cannot exceed 10MB",
      //     "error"
      //   );
      //   return;
      // }

      console.log("Upload Success:", file.response);

      this.toastService.publishNotification("File Upload", "Successfully");
      this.fileUrl = file.response.fileUploadLocation;
      this.VideoSize = file.size || 0; // Track video size

      if (this.templateForm.get("type")?.value == "carousel") {
        this.carouselList[this.selectedCardIndex].mediaUrl = this.fileUrl;
      }

      this.fileList = [];
      this.isVisible = false;
      this.isVideo = true;
    } else if (file.status === "error") {
      // console.error('Upload Failed:', file.error);
      this.toastService.publishNotification("File Upload", "Failed");
    }
  }
  handleCancel(): void {
    this.isVisible = false;
    this.croppedImage = "";
    this.previewUrl = "";
    this.imageChangedEvent = "";
    this.selectedFile1 = null;
    // Reset file size tracking
    this.currentImageSize = 0;
    this.currentVideoSize = 0;
  }
  handleThumpCancel() {
    this.isthumVisible = false;
    this.croppedImage = "";
    this.previewUrl = "";
    this.imageChangedEvent = "";
    this.selectedFile1 = null;
    // Reset file size tracking
    this.currentImageSize = 0;
    this.currentVideoSize = 0;
    this.err = ""; // Clear any error messages
  }

  // handleThumpOk() {
  //   this.isConfirmLoading = true;

  //   // this.convertBase64ToMime(
  //   //   this.imageBase64 as string,
  //   //   this.fileOrgType,
  //   //   this.filename.split(".")[0],
  //   //   0.75
  //   // )
  //   //   .then((convertedFile) => {
  //   //     this.file = convertedFile;

  //   //     const formData = new FormData();
  //   //     formData.append("file", this.file, this.generateRandomFilename());

  //   //     const userName = sessionStorage.getItem("USER_NAME");
  //   //     if (userName) {
  //   //       formData.append("userName", userName);
  //   //     }

  //   //     this.templateService.uploadFile(formData).subscribe(
  //   //       (res) => {
  //   //         this.thumbnailFileName = res.fileUploadLocation.split("/")[3];
  //   //         this.thumbnailUrl = res.fileUploadLocation;
  //   //         this.templateForm.patchValue({
  //   //           standAloneFileName: this.thumbnailUrl,
  //   //         });
  //   //         this.toastService.publishNotification(
  //   //           "success",
  //   //           "Thumbnail uploaded successfully",
  //   //           "success"
  //   //         );

  //   //         if (this.templateForm.get("type")?.value === "carousel") {
  //   //           this.carouselList[this.selectedCardIndex].thumbnailUrl =
  //   //             this.thumbnailUrl;
  //   //           this.carouselList[this.selectedCardIndex].thumbnailFileName =
  //   //             this.thumbnailFileName;
  //   //         }

  //   //         this.selectedFile1 = null;
  //   //         this.isthumVisible = false;
  //   //         this.isConfirmLoading = false;
  //   //       },
  //   //       (error: any) => {
  //   //         this.toastService.publishNotification(
  //   //           "error",
  //   //           "Failed to upload thumbnail",
  //   //           "error"
  //   //         );
  //   //         console.error("Thumbnail upload error:", error);
  //   //         this.isConfirmLoading = false;
  //   //       }
  //   //     );
  //   //   })
  //   //   .catch((error) => {
  //   //     this.toastService.publishNotification(
  //   //       "error",
  //   //       "Image conversion failed",
  //   //       "error"
  //   //     );
  //   //     console.error("Conversion error:", error);
  //   //     this.isConfirmLoading = false;
  //   //   });
  // }
  //  handleThumpOk() {
  //   // {
  //   //   this.isConfirmLoading = true;
  //   //   setTimeout(() => {
  //   //     this.isVisible = false;
  //   //     this.isConfirmLoading = false;

  //   //     //this.onFileChange()
  //   //     this.file = new File(
  //   //       [this.base64ToBlob(this.imageBase64 as string, this.fileType==".png"? ".jpeg":this.fileType)],
  //   //       this.filename,
  //   //       { type: this.fileOrgType=="image/png"? "image/jpeg":this.fileOrgType, lastModified: Date.now() }
  //   //     );
  //   //     console.log(this.file)
  //   //     if (this.file) {
  //   //       const formData = new FormData();
  //   //       formData.append(
  //   //         "file",
  //   //         this.file! as Blob,
  //   //         this.generateRandomFilename()
  //   //       );
  //   //       const userName = sessionStorage.getItem("USER_NAME");
  //   //       if (userName) {
  //   //         formData.append("userName", userName);
  //   //       }

  //   //       this.templateService.uploadFile(formData).subscribe(
  //   //       (res)=>{
  //   //         this.thumbnailFileName=res.fileUploadLocation.split('/')[3]
  //   //         this.thumbnailUrl=res.fileUploadLocation
  //   //         this.templateForm.patchValue({ standAloneFileName: this.thumbnailUrl });
  //   //         this.toastService.publishNotification('success', 'Thumbnail uploaded successfully', 'success');

  //   //         if(this.templateForm.get('type')?.value=='carousel'){
  //   //           this.carouselList[this.selectedCardIndex].thumbnailUrl=this.thumbnailUrl
  //   //           this.carouselList[this.selectedCardIndex].thumbnailFileName=this.thumbnailFileName
  //   //         }
  //   //         this.selectedFile1= null
  //   //         this.isthumVisible = false;
  //   //         this.isConfirmLoading = false;
  //   //       },
  //   //       (error: any) => {
  //   //         this.toastService.publishNotification('error', 'Failed to upload thumbnail', 'error');
  //   //         console.error('Thumbnail upload error:', error);
  //   //         this.isConfirmLoading = false;
  //   //       }
  //   //     )
  //   //     }
  //   //   }, 1000);
  //   //   if (this.fileType !== "mp4") {
  //   //     this.isCropperVisible = false;
  //   //     this.previewUrl = this.croppedImage;
  //   //     this.imageChangedEvent = "";
  //   //   }
  //   // }
  // }

  handleThumpOk() {
    this.isConfirmLoading = true;

    const targetMime =
      this.fileOrgType === "image/png" ? "image/jpeg" : this.fileOrgType;

    this.compressToTargetRange(
      this.imageBase64 as string,
      targetMime ,
      this.filename.split(".")[0], // just the name
      40000,
      100000
    )
      .then((compressedFile) => {
        this.file = compressedFile;
        console.log(
          "📦 Final file:",
          this.file,
          "Size:",
          (this.file.size / 1024).toFixed(1),
          "KB"
        );

        const formData = new FormData();
        formData.append("file", this.file, this.generateRandomFilename());

        const userName = sessionStorage.getItem("USER_NAME");
        if (userName) {
          formData.append("userName", userName);
        }

        this.templateService.uploadFile(formData).subscribe(
          (res) => {
            this.thumbnailFileName = res.fileUploadLocation.split("/")[3];
            this.thumbnailUrl = res.fileUploadLocation;
            this.templateForm.patchValue({
              standAloneFileName: this.thumbnailUrl,
            });

            this.toastService.publishNotification(
              "success",
              "Thumbnail uploaded successfully",
              "success"
            );

            if (this.templateForm.get("type")?.value === "carousel") {
              this.carouselList[this.selectedCardIndex].thumbnailUrl =
                this.thumbnailUrl;
              this.carouselList[this.selectedCardIndex].thumbnailFileName =
                this.thumbnailFileName;
            }

            this.selectedFile1 = null;
            this.isthumVisible = false;
            this.isConfirmLoading = false;
          },
          (error: any) => {
            this.toastService.publishNotification(
              "error",
              "Failed to upload thumbnail",
              "error"
            );
            console.error("Thumbnail upload error:", error);
            this.isConfirmLoading = false;
          }
        );
      })
      .catch((error) => {
        console.error("❌ Compression error:", error);
        this.toastService.publishNotification(
          "error",
          "Image compression failed",
          "error"
        );
        this.isConfirmLoading = false;
      });

    if (this.fileType !== "mp4") {
      this.isCropperVisible = false;
      this.previewUrl = this.croppedImage;
      this.imageChangedEvent = "";
    }
  }

  compressToTargetRange(
    base64Input: string,
    targetMime: string,
    filename = "compressed",
    minSize = 40000, // 40 KB
    maxSize = 100000 // 100 KB
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = base64Input;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        let quality = 0.9;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject("Compression failed");

              const size = blob.size;

              console.log(
                `🧪 Trying quality ${quality.toFixed(2)} => ${(
                  size / 1024
                ).toFixed(2)} KB`
              );

              if (size >= minSize && size <= maxSize) {
                const file = new File(
                  [blob],
                  `${filename}.${targetMime.split("/")[1]}`,
                  {
                    type: targetMime,
                    lastModified: Date.now(),
                  }
                );
                return resolve(file);
              }

              if (size > maxSize && quality > 0.1) {
                // Reduce quality to get smaller size
                quality -= 0.05;
                tryCompress();
              } else if (size < minSize && quality < 0.95) {
                // Size is too small, increase quality
                quality += 0.05;
                tryCompress();
              } else {
                // Return best-effort file
                const file = new File(
                  [blob],
                  `${filename}.${targetMime.split("/")[1]}`,
                  {
                    type: targetMime,
                    lastModified: Date.now(),
                  }
                );
                console.warn(
                  `⚠️ Could not reach target size, best effort: ${(
                    size / 1024
                  ).toFixed(2)} KB`
                );
                return resolve(file);
              }
            },
            targetMime,
            quality
          );
        };

        tryCompress();
      };

      img.onerror = () => reject("Image load failed.");
    });
  }

  // {
  //   this.isConfirmLoading = true;

  //   // Compress the image to ensure it stays under 100KB
  //   // this.compressImageToSize(this.imageBase64 as string, this.maxThumbnailSize).then((compressedBase64: string) => {
  //   //   this.file = new File(
  //   //     [this.base64ToBlob(compressedBase64, this.fileType)],
  //   //     this.filename,
  //   //     { type: this.fileType, lastModified: Date.now() }
  //   //   );

  //   //   // Double check file size after compression
  //   //   if (this.file && this.file.size > this.maxThumbnailSize) {
  //   //     this.toastService.publishNotification('error', 'Unable to compress image to 100KB. Please try a smaller image.', 'error');
  //   //     this.isConfirmLoading = false;
  //   //     return;
  //   //   }

  //   //   if(this.file){
  //   //     const formData = new FormData();
  //   //     formData.append('file', this.file! as Blob, this.generateRandomFilename());
  //   //     const userName = sessionStorage.getItem('USER_NAME');
  //   //     if (userName) {
  //   //       formData.append('userName', userName);
  //   //     }

  //   //     this.templateService.uploadFile(formData).subscribe(
  //   //       (res)=>{
  //   //         this.thumbnailFileName=res.fileUploadLocation.split('/')[3]
  //   //         this.thumbnailUrl=res.fileUploadLocation
  //   //         this.toastService.publishNotification('success', 'Thumbnail uploaded successfully', 'success');

  //   //         if(this.templateForm.get('type')?.value=='carousel'){
  //   //           this.carouselList[this.selectedCardIndex].thumbnailUrl=this.thumbnailUrl
  //   //           this.carouselList[this.selectedCardIndex].thumbnailFileName=this.thumbnailFileName
  //   //         }
  //   //         this.selectedFile1= null
  //   //         this.isthumVisible = false;
  //   //         this.isConfirmLoading = false;
  //   //       },
  //   //       (error: any) => {
  //   //         this.toastService.publishNotification('error', 'Failed to upload thumbnail', 'error');
  //   //         console.error('Thumbnail upload error:', error);
  //   //         this.isConfirmLoading = false;
  //   //       }
  //   //     )
  //   //   }
  //   // }).catch((error: any) => {
  //   //   this.toastService.publishNotification('error', 'Failed to process image', 'error');
  //   //   console.error('Image compression error:', error);
  //   //   this.isConfirmLoading = false;
  //   // });

  //   if(this.fileType!=='mp4'){
  //     this.isCropperVisible = false;
  //     this.previewUrl = this.croppedImage ;
  //     this.imageChangedEvent=""
  //   }
  // }

  ngAfterViewInit() {
    let hasShownToast = false;
    this.templateForm
      .get("messagecontent")
      ?.valueChanges.subscribe((value: string) => {
        if (value && value.length > 160) {
          if (!hasShownToast) {
            this.toastService.publishNotification(
              "info",
              "Message length exceeds 160 characters. This template will be counted as a rich card message.",
              "info"
            );
            hasShownToast = true;
          }
        } else {
          hasShownToast = false;
        }
      });
  }
  addVariable(type: string): void {
    let controlName: string | undefined;

    if (type === "currentDescription") controlName = "cardDescription";
    else if (type === "cardTitle") controlName = "cardTitle";
    else if (type === "mess") controlName = "messagecontent";
    else if (type === "messageBody") controlName = "messageBody";
    // else if (type === 'urlopen') controlName = 'urlopen';
    // else if (type === 'phonenumberdial') controlName = 'phonenumberdial';
    // else if (type === 'fallbackText') controlName = 'fallbackText';

    if (!controlName) return;

    // Get the input field dynamically
    const inputElement = document.querySelector(
      `[formControlName="${controlName}"]`
    ) as HTMLInputElement | HTMLTextAreaElement;
    if (!inputElement) return;

    const currentValue = this.templateForm.get(controlName)?.value || "";
    const cursorPosition = inputElement.selectionStart || 0; // Get cursor position

    // Insert '[custom_var]' at cursor position
    const newValue =
      currentValue.slice(0, cursorPosition) +
      "[custom_var]" +
      currentValue.slice(cursorPosition);

    this.templateForm.patchValue({ [controlName]: newValue });

    // Restore cursor position
    setTimeout(() => {
      inputElement.selectionStart = inputElement.selectionEnd =
        cursorPosition + "[custom_var]".length;
      inputElement.focus();
    }, 0);
  }

  // addVariableToSuggestion(type: string, i: number): void {
  //   const arr = this.templateForm.get('suggestions') as FormArray;
  //   if (!arr || !arr.at(i)) return;

  //   let controlName: string | undefined;
  //   if (type === 'SuggestionText') controlName = 'text';
  //   else if (type === 'SuggestionPostBack') controlName = 'postback';
  //   if (!controlName) return;
  //   const inputElement = document.querySelector(`[formArrayName="suggestions"] [formControlName="${controlName}"]:nth-of-type(${i + 1})`) as HTMLInputElement | HTMLTextAreaElement;
  //   if (!inputElement) return;

  //   const currentValue = arr.at(i).get(controlName)?.value || '';
  //   const cursorPosition = inputElement.selectionStart || 0;
  //   const newValue = currentValue.slice(0, cursorPosition) + '[custom_var]' + currentValue.slice(cursorPosition);
  //   arr.at(i).patchValue({ [controlName]: newValue });

  //   setTimeout(() => {
  //     inputElement.selectionStart = inputElement.selectionEnd = cursorPosition + '[custom_var]'.length;
  //     inputElement.focus();
  //   }, 0);
  // }
  addVariableToSuggestion(type: string, i: number): void {
    const arr = this.templateForm.get("suggestions") as FormArray;
    if (!arr || !arr.at(i)) return;

    let controlName: string | undefined;
    let elementId: string = "";

    if (type === "SuggestionText") {
      controlName = "text";
      elementId = `suggestionText-${i}`;
    } else if (type === "SuggestionPostBack") {
      controlName = "postback";
      elementId = `suggestionPostback-${i}`;
    }

    if (!controlName) return;

    const inputElement = document.getElementById(
      elementId
    ) as HTMLInputElement | null;
    if (!inputElement) return;

    const currentValue = arr.at(i).get(controlName)?.value || "";
    const cursorPosition = inputElement.selectionStart || 0;
    const newValue =
      currentValue.slice(0, cursorPosition) +
      "[custom_var]" +
      currentValue.slice(cursorPosition);

    arr.at(i).patchValue({ [controlName]: newValue });

    setTimeout(() => {
      const newCursorPos = cursorPosition + "[custom_var]".length;
      inputElement.setSelectionRange(newCursorPos, newCursorPos);
      inputElement.focus();
    }, 0);
  }

  getTemplate(temp: any) {
    this.template.setTemplate(temp);
  }
  prevSlide(): void {
    this.carousel.pre();
  }

  nextSlide(): void {
    this.carousel.next();
  }
  addTepmlate() {
    this.addPage = true;
  }

  viewTemplate() {
    this.ViewPage = true;
  }
  selectCard(index: number) {
    this.error = false;
    this.selectedCardIndex = index;
    this.carousel.goTo(index);
    //console.log(this.carouselList[index])
    this.updateValue(index);
  }
  updateValue(i: number) {
    const selectedCard = this.carouselList[i];

    // Update the selected card index
    this.selectedCardIndex = i;

    // Unsubscribe from the previous valueChanges subscription (if exists)
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
    
    // Clear and populate the suggestionsFormArray dynamically
    this.suggestionsFormArray.clear();
    selectedCard.suggestions.forEach((suggestion) => {
      this.suggestionsFormArray.push(
        this.fb.group({
          type: [suggestion.suggestionType],
          text: [suggestion.displayText],
          postback: [suggestion.postback],
         url: [
  suggestion.url,
  [
    Validators.required,
    this.urlValidator()
  ]
],
          phoneNumber: [suggestion.phoneNumber],
          latitude: [suggestion.latitude],
          longitude: [suggestion.longitude],
          label: [suggestion.label],
          query: [suggestion.query],
          title: [suggestion.title],
          description: [suggestion.description],
          date: [suggestion.date],
          startTime: [suggestion.startTime],
          endTime: [suggestion.endTime],
          timeZone: [suggestion.timeZone],
        })
      );
    });

    // Patch the form with selected card data
    this.templateForm.patchValue({
      cardTitle: selectedCard.cardTitle,
      cardDescription: selectedCard.cardDescription,
    });

    // Subscribe to form changes dynamically and update the corresponding card
    this.valueChangesSubscription = this.templateForm.valueChanges.subscribe(
      (values) => {
        if (this.selectedCardIndex !== null) {
          // const updatedSuggestions = this.suggestionsFormArray.getRawValue();
          // //console.log(updatedSuggestions)
          // Update the selected card in the carousel list
          this.carouselList[this.selectedCardIndex] = {
            ...this.carouselList[this.selectedCardIndex],
            cardTitle: values.cardTitle,
            cardDescription: values.cardDescription,
            suggestions: this.transformSuggestions(
              this.suggestionsFormArray.getRawValue()
            ),
          };
        }
      }
    );
  }

  // onBotSelect(botId: string): void {
  //   const selectedBot: Bot | undefined = this.newbot.find((bot: Bot) => bot.botId === botId);
  //   this.selectedBotName = selectedBot ? selectedBot.botName : 'VTS';

  // }
  onBotSelect(id: string): void {
    console.log("Selected Bot ID:", id);

    let dte = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      botId: id,
    };

    this.templateService.editbotdetail(dte).subscribe({
      next: (response: any) => {
        if (response.result === "Success" && response.data?.botData) {
          const botData = response.data.botData;
          const creationData = botData.creationData.data;

          // Set other properties
          this.imageUrl = creationData.botLogoUrl || "";
          this.backgroundUrl = creationData.bannerLogoUrl || "";

          const botSummary = creationData.botDescription?.[0]?.botSummary || "";

          // Prepare complete form data with all fields
          const formData = {
            botName: botData.botName,
            messageType: botData.botType,
            brandName: creationData.brandDetails?.brandName || "",

            primaryphone: creationData.bot?.phoneList?.[0]?.value || "",
            labelphone: creationData.bot?.phoneList?.[0]?.label || "",
            primarywebsite: creationData.bot?.websiteList?.[0]?.value || "",
            labelwebsite: creationData.bot?.websiteList?.[0]?.label || "",
            primaryemail: creationData.bot?.emailList?.[0]?.value || "",
            emailLabel: creationData.bot?.emailList?.[0]?.label || "",
            region: botData.creationData.region || "",
            chatbotwebhook: creationData.rcsBot?.webhookUrl || "",
            privacypolicyurl: creationData.bot?.privacyUrl || "",
            Url: creationData.bot?.termsAndConditionsUrl || "",
            botSummary: botSummary,
            language: creationData.rcsBot?.languageSupported || "",
            // Store additional UI-related properties
          };

          // Store complete data in sessionStorage
          sessionStorage.setItem("botFormData", JSON.stringify(formData));

          // Patch the form with complete data
          this.validateForm.patchValue(formData);

          // Apply icon color after form is updated
          //setTimeout(() => this.applyIconColor(), 0);

          //console.log('Form patched successfully:', this.validateForm.value);
        } else {
          console.error("Invalid API response:", response);
        }
      },
      error: (error: any) => {
        console.error("Failed to fetch bot details:", error);
      },
    });
  }

  addCard() {
    if (this.carouselList.length < 10) {
      //this.cards.push({ id: this.cards.length + 1, previewUrl: null });
      this.carouselList.push({
        cardTitle: "",
        cardDescription: "",
        mediaUrl: "",
        suggestions: [],
        thumbnailFileName: "",
        thumbnailUrl: "",
      });
    }
  }

  deleteCard(index: number) {
    this.cards.splice(index, 1);
    this.carouselList.splice(index, 1);
  }

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private ngxLoader: NgxUiLoaderService,
    private router: Router,
    private templateMessageService: TemplateMessageService,
    private toastService: ToastService,
    private templateService: TemplateService,
    private template: TemplateMessageService,
    private iconService: NzIconService,
    private reportService: ReportService
  ) {
    // this.suggestions = this.fb.array([]);
    this.iconService.addIconLiteral(
      "custom:vrified",
      `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Z"/></svg>`
    );
    this.templateForm = this.fb.group({
      botid: [""],
      type: [this.templateType, Validators.required],
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z0-9_]+$/),
        ],
      ],
      fallbackText: [""],
      height: [""],
      width: [""],
      alignment: [this.alignmenttype],
      cardTitle: [
        "",
        [
          () =>
            this.templateForm?.get("type")?.value === "rich_card" ||
            this.templateForm?.get("type")?.value === "carousel"
              ? Validators.required
              : null,
          Validators.maxLength(200),
        ].filter(Boolean),
      ],
      messagecontent: [
        "",
        [
          () =>
            this.templateForm?.get("type")?.value === "TextMessage"
              ? Validators.required
              : null,
          Validators.maxLength(2500),
        ].filter(Boolean),
      ],
      messageBody: [
        "",
        [
          () =>
            this.templateForm?.get("type")?.value === "TextMessagewithpdf"
              ? Validators.required
              : null,
          Validators.maxLength(2000),
        ].filter(Boolean),
      ],
      cardOrientation: [""],
      cardDescription: [
        "",
        [
          () =>
            this.templateForm?.get("type")?.value === "rich_card" ||
            this.templateForm?.get("type")?.value === "carousel"
              ? Validators.required
              : null,
          Validators.maxLength(2000),
        ].filter(Boolean),
      ],
      standAloneFileName: [""],
      thumbnailFileName: [""],
      suggestions: this.fb.array([]),
      messageOrder: ["textTop"],
      coruselList: this.fb.array([]),
    });
    this.validateForm = this.fb.group({
      botName: [{ value: "", disabled: "true" }],
      brandName: [{ value: "", disabled: "true" }],

      //to: ['', [Validators.required]],
      color: [{ value: "", disabled: "true" }],
      primaryphone: [{ value: "", disabled: "true" }],
      labelphone: [{ value: "", disabled: "true" }],
      primarywebsite: [{ value: "", disabled: "true" }],
      labelwebsite: [{ value: "", disabled: "true" }],
      primaryemail: [{ value: "", disabled: "true" }],
      emailLabel: [{ value: "", disabled: "true" }],
      region: [{ value: "", disabled: "true" }],
      messageType: [{ value: "", disabled: "true" }],
      billingCategory: [{ value: "", disabled: "true" }],
      bannerimage: [{ value: "", disabled: "true" }],
      language: [{ value: "", disabled: "true" }],
      botlogo: [{ value: "", disabled: "true" }],
      Url: [""],
      privacypolicyurl: [{ value: "", disabled: "true" }],
      chatbotwebhook: [{ value: "", disabled: "true" }],
      botSummary: [{ value: "", disabled: "true" }],
      scheduleMessage: [{ value: "", disabled: "true" }],
    });
  }

  ngOnInit() {
    let dt1 = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
    };

    this.reportService.templatelist(dt1).subscribe(
      (res: any) => {
        if (res.data && res.data.templateList) {
          this.messageTemplates = [...res.data.templateList].reverse();

          // Debug
        } else {
          this.messageTemplates = [];
        }
      },
      (error) => {
        console.error("Failed to fetch template list:", error);
        this.messageTemplates = [];
      }
    );

    this.templateForm.get("alignment")?.valueChanges.subscribe((value) => {
      this.alignment = value;
    });

    //console.log(this.addPage)
    //console.log(this.ViewPage)

    if (this.edit == false) {
      this.templateForm.reset();
      // Reset file size tracking for new templates
      this.currentImageSize = 0;
      this.currentVideoSize = 0;
    }
    let data: any;

    const selectedtemplate = this.templateMessageService.getTemplateDetails();

    //console.log(selectedtemplate);
    if (selectedtemplate) {
      //console.log('Bot details on bot creation page:',selectedtemplate );
      this.edit = true;
      data = {
        loggedInUserName: sessionStorage.getItem("USER_NAME"),
        templateName: selectedtemplate,
      };

      this.templateService.templateDetail(data).subscribe(
        (res) => {
          if (res) {
            // Initialize form with values
            this.templateForm.patchValue({
              botid: res.botId,
              type: res.type,
              name: res.name,
              fallbackText: res.fallbackText,
              height: res.height,
              alignment: res.alignment,
              width: res.width,
              cardTitle: res.standAlone.cardTitle,
              messagecontent: res.textMessageContent,
              cardOrientation: res.cardOrientation,
              cardDescription: res.standAlone.cardDescription,
              standAloneFileName: res.standAlone.fileName,
              thumbnailFileName: res.standAlone.thumbnailFileName,
              //fallback: ['no', Validators.required],
              suggestions: res.standAlone.suggestionTypeRich.map((s: any) => {
                type: s.suggestionType;
                text: s.displayText;
                postback: s.postback;
              }),
            });

            // //console.log('Form patched successfully:', this.templateForm.value);
          } else {
            console.error("Invalid API response:", res);
          }
        },
        (error) => {
          console.error("Failed to fetch bot details:", error);
        }
      );
    } else {
      console.error("No bot details found.");
    }
    let dt = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
    };
    this.templateService.getallbotdetail(dt).subscribe(
      (response: any) => {
        if (response.data && response.data.bots) {
          this.newbot = response.data.bots;
        } else {
          console.error("Invalid API response:", response);
        }
      },
      (error) => {
        console.error("Failed to fetch bot data:", error);
      }
    );

    this.templateForm.get("cardTitle")?.valueChanges.subscribe((value) => {
      this.cardTitle = value;
    });
    this.templateForm.get("messagecontent")?.valueChanges.subscribe((value) => {
      this.messagecontent = value;
    });
    this.templateForm
      .get("cardDescription")
      ?.valueChanges.subscribe((value) => {
        this.carddescription = value;
      });
    this.templateForm.get("Suggestiontext")?.valueChanges.subscribe((value) => {
      this.Suggestiontext = value;
    });
    this.templateForm.get("fallback")?.valueChanges.subscribe((value) => {
      if (value === "yes") {
      } else {
      }
    });

    this.templateForm.get("messageBody")?.valueChanges.subscribe((value) => {
      this.messageBody = value;
    });
  }

  // Getter for suggestions FormArray
  get suggestionsFormArray(): FormArray {
    return this.templateForm.get("suggestions") as FormArray;
  }
  get carouselFormArray(): FormArray {
    return this.templateForm.get("coruselList") as FormArray;
  }
  addCarousel(): void {
    if (this.carouselFormArray.length <= 3) {
      this.carouselFormArray.push(
        this.fb.group({
          cardTitle: [""],
          cardDescription: [""],
          mediaUrl: [""],
          suggestions: this.fb.array([]),
          thumbnailFileName: [""],
          thumbnailUrl: [""],
        })
      );
    }
  }
  addSuggestion(): void {
    const latRegex = /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;
    const lngRegex = /^-?((1[0-7]\d)|(\d{1,2}))(\.\d+)?$|^180(\.0+)?$/;
    //console.log(this.suggestionsFormArray.length)
    if (this.suggestionsFormArray.length <= 3) {
      this.suggestionsFormArray.push(
        this.fb.group({
          type: ["reply", Validators.required],
          text: ["", [Validators.required, Validators.maxLength(25)]],
          postback: ["", [Validators.required, Validators.maxLength(120)]],
          url: ["", [Validators.maxLength(2000), this.urlValidator()]],
          phoneNumber: [
            "",
            [
              Validators.pattern(
                /^(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?[\d\-.\s]{6,15}$/
              ),
            ],
          ],
          latitude: ["", [Validators.pattern(latRegex)]],
          longitude: ["", [Validators.pattern(lngRegex)]],
          label: [""],
          query: [""],
          title: [""],
          description: [""],
          date: [""],
          startTime: [""],
          endTime: [""],
          timeZone: [""],
        })
      );
      // Show an error message or disable the button
    } else {
      this.err = "*You can only add up to 4 suggestions.";
      return;
    }
  }
  // Remove suggestion
  removeSuggestion(index: number): void {
    this.suggestionsFormArray.removeAt(index);
  }

  // Getter for fallback enabled
  get isFallbackEnabled() {
    return this.templateForm.get("fallback")?.value === "yes";
  }

  updateSuggestionText(index: number, text: string): void {
    this.Suggestiontext = text; // Update global variable
  }

  // Add suggestion

  onActionTypeChange(value: string) {
    this.selectedActionType = value;
    // const typeValue = this.suggestionsFormArray.at(i).get('type')?.value;
    // //console.log(typeValue);

    // Reset URL input when other than 'urlaction' is selected
    if (value !== "url_action") {
      this.templateForm.patchValue({ urlopen: null });
    }
    if (value !== "dialer_action") {
      this.templateForm.patchValue({ phonenumberdial: null });
    }
  }

  onSuggestionActionTypeChange(value: string, index: number) {
    const suggestionControl = this.suggestionsFormArray.at(index);
    const urlControl = suggestionControl.get('url');
    
    if (value === 'url_action') {
      // Add required validation for URL when URL action is selected
      if (urlControl && !urlControl.hasValidator(Validators.required)) {
        urlControl.addValidators(Validators.required);
        urlControl.updateValueAndValidity();
      }
    } else {
      // Remove required validation and clear URL value when other action is selected
      if (urlControl) {
        urlControl.removeValidators(Validators.required);
        urlControl.setValue('');
        urlControl.updateValueAndValidity();
      }
    }
  }

  // Remove suggestion
  formatDate(isoDate: string): string {
    let date = new Date(isoDate);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");
    let seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Transform suggestions to API format
  transformSuggestions(suggestions: any[]): any[] {
    return suggestions.map((suggestion) => {
      switch (suggestion.type) {
        case "url_action":
          return {
            suggestionType: "url_action",
            url: suggestion.url,
            displayText: suggestion.text,
            postback: suggestion.postback,
          };
        case "dialer_action":
          return {
            suggestionType: "dialer_action",
            phoneNumber: suggestion.phoneNumber,
            displayText: suggestion.text,
            postback: suggestion.postback,
          };

        case "view_location_latlong":
          return {
            suggestionType: "view_location_latlong",
            latitude: suggestion.latitude,
            longitude: suggestion.longitude,
            postback: suggestion.postback,
            displayText: suggestion.text,
            label: suggestion.Label,
          };

        case "reply":
          return {
            suggestionType: "reply",
            displayText: suggestion.text,
            postback: suggestion.postback,
            //Query: suggestion.Query
          };
        case "view_location_query":
          return {
            suggestionType: "view_location_query",
            displayText: suggestion.text,
            postback: suggestion.postback,
            query: suggestion.query,
          };

        case "share_location":
          return {
            suggestionType: "share_location",
            displayText: suggestion.text,
            postback: suggestion.postback,
          };
        case "calendar_event":
          let date = suggestion.date;
          //console.log(date)
          return {
            suggestionType: "calendar_event",
            displayText: suggestion.text,
            postback: suggestion.postback,
            startTime: this.formatDate(suggestion.startTime),
            endTime: this.formatDate(suggestion.endTime),
            title: suggestion.title,
            description: suggestion.description,
            timeZone: suggestion.timeZone,
          };
        // Add other cases for different suggestion types
        default:
          return {
            suggestionType: suggestion.type,
            displayText: suggestion.text,
            postback: suggestion.postback,
          };
      }
    });

    // messageBody
  }

  ontypeChange(value: string): void {
    this.fileUrl = "";
    this.isVideo=false
    this.templateForm.get("standAloneFileName")?.setValue("");
    this.templateForm.get("thumbnailFileName")?.setValue("");
    //console.log('Selected Template Type:', value);
    if (value === "TextMessage") {
      this.templateForm.patchValue({
        cardOrientation: "",
        height: "",
        imagevideo: "",
        cardTitle: "",
        cardDescription: "",
      });
    }
    
    if (value=="carousel") {
      this.carouselList=[]
      this.carouselList = [
    {
      cardTitle: "",
      cardDescription: "",
      mediaUrl: "",
      suggestions: [],
      thumbnailFileName: "",
      thumbnailUrl: "",
    },
    {
      cardTitle: "",
      cardDescription: "",
      mediaUrl: "",
      suggestions: [],
      thumbnailFileName: "",
      thumbnailUrl: "",
    },
  ];
    }
  }

  onSubmit() {
    let hasError = false;
    let urlErrorMessages: string[] = [];
    
    // Check URL validation for all suggestions
    this.suggestionsFormArray.controls.forEach((control, index) => {
      if (control.get('type')?.value === 'url_action') {
        const urlCtrl = control.get('url');
        if (urlCtrl) {
          // Add required validation dynamically if not already present
          if (!urlCtrl.hasValidator(Validators.required)) {
            urlCtrl.addValidators(Validators.required);
            urlCtrl.updateValueAndValidity();
          }
          
          if (urlCtrl.invalid) {
            urlCtrl.markAsTouched();
            hasError = true;
            
            // Collect specific error messages
            if (urlCtrl.errors?.['required']) {
              urlErrorMessages.push(`URL is required for suggestion ${index + 1}`);
            } else if (urlCtrl.errors?.['pattern'] || urlCtrl.errors?.['invalidUrl']) {
              urlErrorMessages.push(`Invalid URL format for suggestion ${index + 1}. URL must start with http:// or https://`);
            }
          }
        }
      }
    });

    if (this.templateForm.invalid || hasError) {
      // Show specific error messages for URL validation
      if (urlErrorMessages.length > 0) {
        this.toastService.publishNotification('error', urlErrorMessages.join('. '), 'error');
      } else {
        this.toastService.publishNotification('error', 'Please fill all required fields correctly', 'error');
      }
      return;
    }

    this.isDisabled = true;
    if (this.templateForm.invalid) {
      let errorMessage = "Please fill the fields correctly";
      // Check for required errors on controls
      Object.keys(this.templateForm.controls).forEach(key => {
        const controlErrors = this.templateForm.get(key)?.errors;
        if (controlErrors) {
          if (controlErrors['required']) {
            errorMessage = `Field "${key}" is required.`;
          } else if (controlErrors['maxlength']) {
            errorMessage = `Field "${key}" exceeds maximum length.`;
          } else if (controlErrors['pattern']) {
            errorMessage = `Field "${key}" has invalid format.`;
          }
        }
      });
      this.toastService.publishNotification(
        "error",
        errorMessage,
        "error"
      );
      this.isDisabled = false;
      this.templateForm.markAllAsTouched();

      return;
    }
    if (this.isVideo && this.templateForm.get('type')?.value==='rich_card') {
      const videoSize = this.VideoSize || 0;
      const uploadedFileSize = this.file ? this.file.size : 0;
      if (videoSize + uploadedFileSize > 10 * 1024 * 1024) {
        this.toastService.publishNotification(
          "error",
          "Combined video and Image file size cannot exceed 10MB.",
          "error"
        );
        this.isDisabled = false;
        return;
      }
    }
    const formData = this.templateForm.value;
    //console.log("Form data:", formData); // Log the entire form data

    let dt: any; // Declare dt once

    if (formData.type === "rich_card") {
      //console.log("Rich card condition met"); // Debug lo

      dt = {
        loggedInUserName: sessionStorage.getItem("USER_NAME"),
        botId: formData.botid,
        richTemplateData: {
          name: formData.name,
          // fallbackText: formData.fallbackText,
          type: "rich_card",
          height: formData.height,
          alignment: formData.alignment,
          orientation: formData.cardOrientation,
          // width: formData.width,
          //mediaUrl: this.fileUrl,
          standAlone: {
            cardTitle: formData.cardTitle,
            cardDescription: formData.cardDescription,
            mediaUrl: this.fileUrl,
            thumbnailFileName: this.thumbnailFileName,
            thumbnailUrl: this.thumbnailUrl,
            suggestions: this.transformSuggestions(formData.suggestions),
          },
        },
      };
    } else if (formData.type === "carousel") {
      dt = {
        loggedInUserName: sessionStorage.getItem("USER_NAME"),
        botId: formData.botid,
        richTemplateData: {
          name: formData.name,
          type: "carousel",
          height: formData.height,
          width: formData.width,
          carouselList: this.carouselList,
        },
      };
    } else if (formData.type === "TextMessage") {
      //console.log("TextMessage condition met"); // Debug log
      // If messagecontent length > 160, use "rich_card" type, else "text_message"
      const messageContent = formData.messagecontent ?? "";
      const isRichCard = messageContent.length > 160;
      dt = {
        loggedInUserName: sessionStorage.getItem("USER_NAME"),
        botId: formData.botid,
        richTemplateData: {
          name: formData.name,
          fallbackText: formData.fallbackText,
          type: "text_message",
          templateUseCase: "promo",
          height: formData.height,
          width: formData.width,
          textMessageContent: messageContent,
          suggestions: this.transformSuggestions(formData.suggestions),
        },
      };
    } else if (formData.type === "TextMessagewithpdf") {
      //console.log("TextMessage condition met"); // Debug log
      dt = {
        loggedInUserName: sessionStorage.getItem("USER_NAME"),
        botId: formData.botid,
        richTemplateData: {
          name: formData.name,
          fallbackText: formData.fallbackText,
          type: "text_message_with_pdf",
          templateUseCase: "promo",
          textMessageContent: formData.messageBody, // Default to empty string if undefined
          suggestions: this.transformSuggestions(formData.suggestions),
          messageOrder:
            formData.messageOrder == "textTop"
              ? "text_message_at_top"
              : formData.messageOrder == "pdfTop"
              ? "text_message_at_bottom"
              : "",
          documentFileName: this.uploadedFileName,
        },
      };
    } else {
      console.error("Invalid type:", formData.type);
      this.isDisabled = false; // Debug log for unexpected type
    }

    //console.log("Final dt object:", dt); // Log final API payload before sending request

    if (dt) {
      this.ngxLoader.start();

      this.templateService.addtemp(dt).subscribe({
        next: (res: any) => {
          //console.log('API Response:', res);
          this.ngxLoader.stop();
          if (res.result?.toLowerCase() === "success" && res.data) {
            this.toastService.publishNotification(
              "success",
              res.message,
              "success"
            );
            this.templateForm.reset();
            // Reset file size tracking after successful submission
            this.currentImageSize = 0;
            this.currentVideoSize = 0;
            this.router.navigate(["/template"]);
            this.isDisabled = false;
          } else {
            this.toastService.publishNotification(
              "error",
              res.message,
              "error"
            );
            this.isDisabled = false;
          }
        },
        error: (error) => {
          console.error("Error adding template:", error);
          this.ngxLoader.stop();
          this.toastService.publishNotification(
            "error",
            "Failed to add template",
            "error"
          );
          this.isDisabled = false;
        },
      });
    } else {
      console.error("dt is undefined, API call not made"); // Log if dt is empty
      this.toastService.publishNotification(
        "error",
        "Invalid template data",
        "error"
      );
      this.isDisabled = false;
    }
  }

  TemplateCheck() {
    if (
      this.messageTemplates.some(
        (template: any) =>
          template.templateTitle === this.templateForm.get("name")?.value
      )
    ) {
      this.error = true;
      this.err = "Template name already exists";
    } else {
      this.error = false;
      this.err = "";
    }
  }

  onCropImaeg() {
    const img = this.croppedImage;
  }
  onFileChange(): void {
    //const file = event.file.originFileObj;
    const file = this.imageChangedEvent;
    const reader = new FileReader();
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];
    const maxImageSize = 2 * 1024 * 1024; // 2MB
    const maxVideoSize = 10 * 1024 * 1024; // 10MB

    // if (file) {
    //   if (validImageTypes.includes(file.type) && file.size <= maxImageSize) {
    //     const img = new Image();
    //     img.onload = () => {
    //       if (img.width / img.height === 3 / 1 && img.width === 1440 && img.height === 480) {
    //         reader.onload = () => {
    //           this.previewUrl = reader.result as string;
    //           this.carouselList[this.selectedCardIndex].fileName = this.previewUrl;
    //         };
    //         reader.readAsDataURL(file);
    //       } else {
    //         alert('Image must be 3:1 aspect ratio and 1440x480 resolution.');
    //       }
    //     };
    //     img.src = URL.createObjectURL(file);
    //   } else if (file.type.startsWith('video/') && file.size <= maxVideoSize) {
    //     reader.onload = () => {
    //       this.previewUrl = reader.result as string;
    //       this.carouselList[this.selectedCardIndex].fileName = this.previewUrl;
    //     };
    //     reader.readAsDataURL(file);
    //   } else {
    //     alert('Invalid file type or size. Please upload an image (JPEG, JPG, PNG, GIF) with max size 2MB or a video with max size 10MB.');
    //   }
    // }
  }

  // onFileChange(event: any): void {
  //   const file = event.file.originFileObj;
  //   const reader = new FileReader();
  //   //console.log(file)
  //   reader.onload = () => {
  //     this.previewUrl = reader.result as string;
  //     this.carouselList[this.selectedCardIndex].fileName = this.previewUrl;

  //   };
  //   //console.log(this.previewUrl)
  //   reader.readAsDataURL(file);
  // }
  handlePreview = (file: any): Promise<string> => {
    return Promise.resolve(file.url || file.thumbUrl);
  };

  uploadImage(event: any, cardIndex: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.carouselList[cardIndex].mediaUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  formatMessageBody(text: string, limit: number = 26): string[] {
    if (!text) return [];

    // Split text into chunks of 'limit' characters, without breaking words
    const result: string[] = [];
    let index = 0;

    // Continue until all characters are processed
    while (index < text.length) {
      // Slice the string from the current index to the next 'limit' number of characters
      result.push(text.slice(index, index + limit));
      index += limit;
    }

    return result;
  }

  onOrientationChange(selectedOrientation: string): void {
    this.templateForm.get('standAloneFileName')?.reset()
    this.orientation = selectedOrientation;
  }

  navigateLeft() {
    const carousel = document.querySelector(
      ".ant-carousel .slick-prev"
    ) as HTMLElement;
    if (carousel) carousel.click();
  }

  onHeightChange(selectedHeight: string): void {
    this.templateForm.get('standAloneFileName')?.reset()
    if (selectedHeight === "SHORT_HEIGHT") {
      this.imageHeight = 100; // Reset to default or desired "SHORT" height
    } else if (selectedHeight === "MEDIUM_HEIGHT") {
      this.imageHeight = 140; // Increase by 10px for "MEDIUM" height
    }
  }

  navigateRight() {
    const carousel = document.querySelector(
      ".ant-carousel .slick-next"
    ) as HTMLElement;
    if (carousel) carousel.click();
  }

  // beforeUpload = (file: File): boolean => {
  //   // Validate file type or size if needed
  //   this.templateForm.patchValue({ pdfFile: file });
  //   this.uploadedFileSize = file.name;
  //   return false;
  // };

  // handleFileChange(event: any): void {
  //   // Handle any file change logic if required
  //   //console.log('File uploaded:', event.file);
  // }
  handleChange(event: NzUploadChangeParam): void {
    const { file } = event;

    if (file.status === "uploading") {
      ////console.log('Uploading file...', file);
    } else if (file.status === "done") {
      ////console.log('Upload Success:', file.response.data);
      this.uploadedFileUrl = file.response.data.uploadedDynamicfileName;
      this.toastService.publishNotification("File Upload", "Successfully");
      this.fileList = [];
    } else if (file.status === "error") {
      //console.error('Upload Failed:', file.error);
      this.toastService.publishNotification(
        "error",
        "File upload failed",
        "error"
      );
    }
  }

  beforeFileChange = (file: NzUploadFile): boolean => {
    if (!file) {
      return false; // Ensure a return value for invalid input
    }

    console.log(file);
    this.uploadedFileName = file.name;
    this.uploadedFileUrl = "URL_TO_DOWNLOADED_FILE"; // Set dynamically
    this.uploadedFileSize = ((file.size || 0) / 1024).toFixed(2) + " KB"; // Convert size to KB

    if ((file.size || 0) > 100 * 1024 * 1024) {
      // 100MB in bytes
      this.toastService.publishNotification(
        "error",
        "File size exceeds 100MB limit",
        "error"
      );
      return false; // Return false for invalid file size
    }

    return true; // Return true for valid file
  };

  handleUploadChange(info: { file: any; fileList: any[] }){
    if (info.file.status === 'done') {
    // ✅ API response from backend
    const response = info.file.response;
    console.log('Upload success:', response);
    this.toastService.publishNotification("success", "File uploaded successfully");
      this.fileUrl = response.fileUploadLocation;
          // Fetch the file from the URL and get its size, then show in toast
          if (this.fileUrl) {
            // Use the file size from the File object if available
            if (this.file && this.file.size) {
              const sizeKB = (this.file.size / 1024).toFixed(1);
              this.uploadedFileSize = sizeKB;
            }
            this.templateForm.patchValue({ standAloneFileName: this.fileUrl });
            if (this.templateForm.get("type")?.value == "carousel") {
              this.carouselList[this.selectedCardIndex].mediaUrl = this.fileUrl;
            }
            this.selectedFile1 = null;
          }
    // If you need some property from response
    // e.g. response.url or response.data
    // this.uploadedFileData = response;
  } else if (info.file.status === 'error') {
    console.error('Upload failed:', info.file.error);
  }
  }

  handleUploadThumChange(info: { file: any; fileList: any[] }){
   if (info.file.status === 'done') {
    // ✅ API response from backend
    const response = info.file.response;
    console.log('Upload success:', response);
    this.toastService.publishNotification("success", "File uploaded successfully");
     this.thumbnailFileName=response.fileUploadLocation.split('/')[3]
       this.thumbnailUrl=response.fileUploadLocation
    this.templateForm.patchValue({ standAloneFileName: this.thumbnailUrl });
       this.toastService.publishNotification('success', 'Thumbnail uploaded successfully', 'success');

       if(this.templateForm.get('type')?.value=='carousel'){
          this.carouselList[this.selectedCardIndex].thumbnailUrl=this.thumbnailUrl
         this.carouselList[this.selectedCardIndex].thumbnailFileName=this.thumbnailFileName
     }
    // If you need some property from response
    // e.g. response.url or response.data
    // this.uploadedFileData = response;
  } else if (info.file.status === 'error') {
    console.error('Upload failed:', info.file.error);
  } 
  }
}