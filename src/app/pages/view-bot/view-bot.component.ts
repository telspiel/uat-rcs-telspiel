import { Component, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { SEND_TEMPLATE_MODEL, TEMPLATES, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { EditorToHtmlPipe } from 'src/app/pipes/editor-to-html.pipe';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { BotServiceService } from 'src/app/service/bot-service.service';
import { Router } from '@angular/router';
import { NzIconService } from 'ng-zorro-antd/icon';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noSpaceRegexValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const regex = /^\S+$/; 
  return regex.test(value) ? null : { noSpaces: true };
}

interface Country {
  name: string;
  code: string;
  flag: string;
}


@Component({
    selector: 'app-view-bot',
    templateUrl: './view-bot.component.html',
    styleUrls: ['./view-bot.component.scss']
  })
export class ViewBotComponent implements OnInit {
  nzTabPosition: NzTabPosition = 'top';
  selectedApi: string = '';
  backgroundUrl: any;
  botLogoUrl: any;
   operatorForm!: FormGroup;
  form: any;
    selectedColor: string = '#000000';
  region: any;
  //  operators = [
  //   { name: 'VTL', label: 'VED TECH LABS' },
  //   { name: 'AIRTEL', label: 'AIRTEL' },
  //   { name: 'VODAFONE', label: 'VODAFONE' },
  //   { name: 'RELIANCE_JIO', label: 'RELIANCE JIO' },
  //   { name: 'BSNL', label: 'BSNL' }
  // ];
operators : any []=[];
  type: any;
  logColor() {
    console.log(this.selectedColor); // Logs the selected color
  }
  
  // formattedbotSummary: string = 'short description';
  // selectedColor: string = '';
  bannerImageUrl: SafeUrl | null = null;
    role: string =sessionStorage.getItem('ROLE')||"";
  selectedCountryCode = '+91';
  botName: string = '';
  selectedValue = 'Conversational';
    selectedClient: string | null = null;
  botSummary: string = '';
  radioValue = '';
  imageUrl = null;
  // backgroundUrl: SafeUrl | null = null;
  scheduleMessage: string = 'no';
  transformedData: any;
  validateForm: FormGroup 
  senderTo = 'Conversational';
  listTemplates: TEMPLATES[] = []; // Initialize an empty array to store the fetched templates.
  selectedTemplateData: TEMPLATE_RESPONSE | undefined;
  language:string =""
  body: any;
  newMessagePreviewTemplate: { template?: TEMPLATE_RESPONSE, data?: any } = {};
  previewVisibility = false;
  filterPipe = new EditorToHtmlPipe();
  edit:boolean=false;

  constructor(private fb: FormBuilder,
    private templateMessageService: TemplateMessageService,
    private toastService: ToastService,
    private router: Router,
    private templateService: TemplateService,
    private sanitizer: DomSanitizer,
    private notifyService: ToastService,
    private botService: BotServiceService,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private iconService: NzIconService
  ) {

    this.iconService.addIconLiteral(
      'custom:globals',
      `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q41-45 62.5-100.5T800-480q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z"/></svg>`
    );
    this.iconService.addIconLiteral(
      'custom:call',
      `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg>`
    );
    this.iconService.addIconLiteral(
      'custom:mail',
      `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>`
    );
    this.validateForm= this.fb.group({
      botName: [{value:'', disabled:'true'}],
      brandName: [{value:'', disabled:'true'}],

      //to: ['', [Validators.required]],
      color: [{value:'', disabled:'true'}],
      primaryphone: [{value:'', disabled:'true'}],
      labelphone: [{value:'', disabled:'true'}],
      primarywebsite: [{value:'', disabled:'true'}],
      labelwebsite: [{value:'', disabled:'true'}],
      primaryemail: [{value:'', disabled:'true'}],
      emailLabel:[{value:'', disabled:'true'}],
      region:[{value:'', disabled:'true'}],
      messageType:[{value:'', disabled:'true'}],
      billingCategory:[{value:'', disabled:'true'}],
      bannerimage:[{value:'', disabled:'true'}],
      language:[{value:'', disabled:'true'}],
      botlogo:[{value:'', disabled:'true'}],
      Url:[{value:'', disabled:'true'}],
      privacypolicyurl:[{value:'', disabled:'true'}],
      // chatbotwebhook:[{value:'', disabled:'true'}],
      botSummary: [{value:'', disabled:'true'}],
      scheduleMessage: [{value:'', disabled:'true'}]
    });
  }

  get operatorData(): FormArray {
      return this.operatorForm.get('operatorData') as FormArray;
    }

      onOperatorChange(selected: string[]) {
          this.operatorData.clear(); 
          selected.forEach(op => {
           this.operatorData.push(
              this.fb.group({
                operatorName: [{ value: op, disabled: true }],
                isNewBot: [{ value: true, disabled: true }],
  // isNewBot: [true, Validators.required],
  traficVolume: [{ value: 100, disabled: true }],
  operatorBotId: [{ value: '', disabled: true }],
  operatorTemplateSecret : [{ value: '', disabled: true }],
  operatorTemplateClientId : [{ value: '', disabled: true }],
  operatorBotSecret: [{ value: '', disabled: true }],
  operatorBotStatus: [{ value: 'LAUNCHED', disabled: true }]
              })
            )
          });
        }

  ngOnInit(): void {
    this.operator();
    this.operatorForm = this.fb.group({
      selectedOperators: [{ value: [], disabled: true }],       
      operatorData: this.fb.array([]) 
    });
    // Load saved data from session storage first
    this.loadSavedFormData();
    
    // Then fetch fresh data from API if available
    this.fetchBotDetails();
    
    // Set up form value listeners
    this.setupFormListeners();
}



// Load saved form data from sessionStorage
loadSavedFormData(): void {
    const savedFormData = sessionStorage.getItem('botFormData');
    if (savedFormData) {
        try {
            const parsedData = JSON.parse(savedFormData);
            this.validateForm.patchValue(parsedData);
            
            // Apply saved color to icons
            if (parsedData.color) {
                this.selectedColor = parsedData.color;
                setTimeout(() => this.applyIconColor(), 0);
            }
            
            // Also restore any other component properties
            this.botName = parsedData.botName || '';
            this.botSummary = parsedData.botSummary || '';
            this.imageUrl = parsedData.imageUrl || '';
            this.backgroundUrl = parsedData.backgroundUrl || '';
            
            console.log('Restored form data from sessionStorage');
        } catch (error) {
            console.error('Error parsing saved form data:', error);
        }
    }
}

// Fetch bot details from API
fetchBotDetails(): void {
    const selectedBot = this.botService.getBotDetails();
    
    if (!selectedBot) {
        console.error('No bot details found.');
        return;
    }
    
    console.log('Bot details on bot creation page:', selectedBot);

    // Check if a different bot is selected
    const storedBot = sessionStorage.getItem('selectedBot');
    if (storedBot !== JSON.stringify(selectedBot)) {
        console.log("New bot selected. Clearing old session data...");
        sessionStorage.removeItem('botFormData'); // Clear old form data
        sessionStorage.setItem('selectedBot', JSON.stringify(selectedBot)); // Store the new selection
    }

    const dt = {
        loggedInUserName: sessionStorage.getItem('USER_NAME'),
        botId: selectedBot.botId
    };

    this.templateService.editbotdetail(dt).subscribe({
        next: (response) => {
            if (response.result === 'Success' && response.data?.botData) {
                const botData = response.data.botData;
                const creationData = botData.creationData.data;
                this.edit = true;

                // Get the color from API response and set it
                this.selectedColor = creationData.agentColor || '#000000';
                
                // Set other properties
                this.imageUrl = creationData.botLogoUrl || '';
                this.backgroundUrl = creationData.bannerLogoUrl || '';

                const botSummary = creationData.botDescription?.[0]?.botSummary || '';

                // Prepare complete form data with all fields
                const formData = {
                    botName: botData.botName,
                    messageType: botData.botType,
                    brandName: creationData.brandDetails?.brandName || '',
                    color: this.selectedColor,
                    primaryphone: creationData.bot?.phoneList?.[0]?.value || '',
                    labelphone: creationData.bot?.phoneList?.[0]?.label || '',
                    primarywebsite: creationData.bot?.websiteList?.[0]?.value || '',
                    labelwebsite: creationData.bot?.websiteList?.[0]?.label || '',
                    primaryemail: creationData.bot?.emailList?.[0]?.value || '',
                    emailLabel: creationData.bot?.emailList?.[0]?.label || '',
                    region: botData.creationData.region || '',
                    // chatbotwebhook: creationData.rcsBot?.webhookUrl || '',
                    privacypolicyurl: creationData.bot?.privacyUrl || '',
                    Url: creationData.bot?.termsAndConditionsUrl || '',
                    botSummary: botSummary,
                    language: creationData.rcsBot?.languageSupported || '',
                    // Store additional UI-related properties
                    imageUrl: this.imageUrl,
                    backgroundUrl: this.backgroundUrl
                };

                  const operatorData = response.data.botData.operatorData || [];
                  console.log('Operator Data:', operatorData);

this.selectedClient = response.data.botData.userName || '';

// ✅ Patch main form
this.validateForm.patchValue(formData);

// ✅ Patch operatorForm with selected operators
this.operatorForm.patchValue({
  selectedOperators: operatorData.map((op: any) => op.operatorName),
  operatorData: operatorData.map((op: any) => ({
    operatorName: op.operatorName || '',
    isNewBot: op.isNewBot ?? false,
    traficVolume: op.trafficVolume || '',
    operatorBotId: op.operatorBotId || '',
    operatorTemplateSecret : op.operatorTemplateSecret || '',
    operatorTemplateClientId : op.operatorTemplateClientId || '',
    operatorBotSecret: op.operatorBotSecret || '',
    operatorBotStatus: op.operatorBotStatus || '',
  }))
});

// ✅ Clear existing FormArray (IMPORTANT)
const formArray = this.operatorForm.get('operatorDetails') as FormArray;
formArray.clear();  // 👈 This is what fixes the duplication

// ✅ Push fresh controls
operatorData.forEach((op: any) => {
  formArray.push(
    this.fb.group({
      operatorName: [op.operatorName || '', Validators.required],
      isNewBot: [op.isNewBot ?? false, Validators.required],
      traficVolume: [op.trafficVolume || '', Validators.required],
      operatorBotId: [op.operatorBotId || ''],
      operatorTemplateSecret : [op.operatorTemplateSecret || ''],
      operatorTemplateClientId : [ op.operatorTemplateClientId || ''],
      operatorBotSecret: [op.operatorBotSecret || ''],
      operatorBotStatus: [op.operatorBotStatus || ''],
    })
  );
});

                // Store complete data in sessionStorage
                sessionStorage.setItem('botFormData', JSON.stringify(formData));

                // Patch the form with complete data
                this.validateForm.patchValue(formData);
                
                // Apply icon color after form is updated
                setTimeout(() => this.applyIconColor(), 0);
                
                console.log('Form patched successfully:', this.validateForm.value);
            } else {
                console.error('Invalid API response:', response);
            }
        },
        error: (error) => {
            console.error('Failed to fetch bot details:', error);
        }
    });
}

// Setup form value change listeners
setupFormListeners(): void {
    // Listen for form changes and save them in sessionStorage
    this.validateForm.valueChanges.subscribe(value => {
        // Get the current saved data first (to preserve any non-form fields)
        const currentSavedData = JSON.parse(sessionStorage.getItem('botFormData') || '{}');
        
        // Merge the current form values with any additional saved data
        const updatedData = {
            ...currentSavedData,
            ...value,
            // Ensure UI properties are also saved
            imageUrl: this.imageUrl,
            backgroundUrl: this.backgroundUrl
        };
        
        // Save the merged data back to session storage
        sessionStorage.setItem('botFormData', JSON.stringify(updatedData));
    });

    this.validateForm.get('botName')?.valueChanges.subscribe(value => {
        this.botName = value;
    });

    this.validateForm.get('botSummary')?.valueChanges.subscribe(value => {
        this.botSummary = value;
    });
    
    // Add listener for color changes
    this.validateForm.get('color')?.valueChanges.subscribe(value => {
        if (value) {
            this.selectedColor = value;
            this.applyIconColor();
        }
    });
}

// Updated color picker handler
updateColorCode(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedColor = inputElement.value;
    
    // Update the form control
    this.validateForm.get('color')?.setValue(this.selectedColor);
    
    // Apply the new color when user changes it
    this.applyIconColor();
}

// Apply colors to nz-icons
applyIconColor(): void {
    if (!this.selectedColor) return;
    
    // Find all nz-icon elements within this component only
    const iconsInComponent = this.el.nativeElement.querySelectorAll('i[nz-icon]');
    
    // Apply the selected color to each icon
    iconsInComponent.forEach((icon: HTMLElement) => {
        icon.style.color = this.selectedColor;
    });
    
    // Also apply as a CSS variable for the component scope
    this.el.nativeElement.style.setProperty('--theme-icon-color', this.selectedColor);
    
    // Ensure Angular detects the changes
    this.cdr.detectChanges();
}


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
  
      const loggedInUserName = sessionStorage.getItem('USER_NAME');
      if (!loggedInUserName) {
        console.error('loggedInUserName is not available in sessionStorage');
        this.notifyService.publishNotification('Failed', 'User not logged in', 'error');
        return;
      }
  
      formData.append('type', 'logo');
      formData.append('loggedInUserName', loggedInUserName);
      console.log(file)
      //**Preview Image**
      const objectURL = URL.createObjectURL(file);
      //this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.botLogoUrl = objectURL;  // ✅ Store preview URL
      console.log('Bot Logo Preview URL:', objectURL);
  
      // **Call API to Upload**
      this.templateService.uploadbot(formData).subscribe(
        (response: { message: string, botlogo: string }) => {
          this.notifyService.publishNotification('Success', response.message);
          this.botLogoUrl = response.botlogo;  // ✅ Update botLogoUrl from API response
        },
        (err: { meta?: { developer_message: string }; message?: string }) => {
          const error = err.meta?.developer_message || err.message || 'An error occurred';
          console.error('Upload Error:', error);
          this.notifyService.publishNotification('Failed', error, 'error');
        }
      );
    }
  }
  



  onFileSelectedBackground(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
  
      const loggedInUserName = sessionStorage.getItem('USER_NAME');
      if (!loggedInUserName) {
        console.error('loggedInUserName is not available in sessionStorage');
        this.notifyService.publishNotification('Failed', 'User not logged in', 'error');
        return;
      }
  
      formData.append('type', 'banner');
      formData.append('loggedInUserName', loggedInUserName);
  
      // **Preview Banner Image**
      const objectURL = URL.createObjectURL(file);
      this.bannerImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.backgroundUrl = objectURL;  // ✅ Store preview URL
      console.log('Banner Preview URL:', objectURL);
  
      // **Call API to Upload**
      this.templateService.uploadbot(formData).subscribe(
        (response: { message: string, bannerimage: string }) => {
          this.notifyService.publishNotification('Success', response.message);
          this.backgroundUrl = response.bannerimage;  // ✅ Update backgroundUrl from API response
        },
        (err: { meta?: { developer_message: string }; message?: string }) => {
          const error = err.meta?.developer_message || err.message || 'An error occurred';
          console.error('Banner Upload Error:', error);
          this.notifyService.publishNotification('Failed', error, 'error');
        }
      );
    }
  }
  
  
  


  
  onNotification() {
    console.log('Notification clicked');
    // Add logic for notifications
  }
  
  onBlockAndReport() {
    console.log('Block & Report Spam clicked');
    // Add logic for blocking/reporting
  }
  
  onViewPrivacyPolicy() {
    console.log('View Privacy Policy clicked');
    // Add logic for viewing privacy policy
  }
  
  onViewTermsOfService() {
    console.log('View Terms of Services clicked');
    // Add logic for viewing terms of service
  }
  
  onLearnMore() {
    console.log('Learn More clicked');
    // Add logic for learning more
  }
  
  resetForm() {
    this.validateForm.reset({
      scheduleMessage:'no'
    })
    this.selectedTemplateData = undefined;
  }

  updatedMsgBody($event: any) {
    console.log($event)
  }

  addNewlines(text: string, maxLength: number): string {
    return text.replace(new RegExp(`(.{${maxLength}})`, 'g'), '$1\n');
  }

  onCountrySelect(code: string): void {
    this.selectedCountryCode = code; // Update the country code when a new country is selected
  }

  onTemplateSelect(templateId: string) {
    templateId && this.templateService.getTemplateById(templateId).subscribe(data => {
      this.selectedTemplateData = { ...data };
    })
  }

  submitDataToSendTemplate() {
    console.log("submitDataToSendTemplate")
    const form = this.validateForm.value;
    const template = this.templateMessageService.templateMessage.template
    let params = this.templateMessageService.templateMessage.data;
    console.log(params)

    const header = template?.components.find(item => item.type === 'HEADER');
    console.log(header)
    const compHeader = params.headerURL && {
      type: 'header',
      parameters: [
        {
          type: header?.format?.toLowerCase() || "image",
          image: {
            link: params.headerURL
          }
        }
      ]
    }

    const body = template?.components.find(item => item.type === 'BODY');
    const bodyParams = params.variables.map((item: any) => {
      return { "type": "text", "text": item.value }
    })
    const compBody = {
      "text": body?.text,
      "type": "body",
      "parameters": bodyParams
    }

    let comp = [];

    if (compHeader) {
      comp.push(compHeader)
    }

    if (compBody) {
      comp.push(compBody)
    }

    const senderNumbers = form.to.map((to: string) => {
      return `91${to}`
    })

    console.log(template)

    const reqBody: SEND_TEMPLATE_MODEL = {
      "name": template?.name || '',
      "from": "0123456789",
      "to": senderNumbers,
      "id": '8qTZWz54yQdq3qyNpcwgWT',
      "type": "template",
      components: comp,
      "language": {
        "policy": "deterministic",
        "code": template?.language || "en_US"
      }
    }
    console.log(reqBody)
  }
  operator(){
this.botService.viewtps(this.operator).subscribe(
  (res: any) => {
    const selectedOperators = res.data[0]?.selectedOperators || [];
   const operatorBotId = res.data[0]?.operatorBotId || '';
   const operatorTemplateClientId = res.data[0]?.operatorTemplateClientId || '';
   const operatorBotSecret = res.data[0]?.operatorBotSecret || '';
   const operatorBotStatus = res.data[0]?.operatorBotStatus || '';
   console.log("Selected operators:", selectedOperators);

   const apiOperators = selectedOperators.map((op: string) => ({
    name: op,
    label: op,
    
  }));


    console.log("API operator list:", apiOperators);
    this.operators = [...apiOperators];

    console.log("Complete operator list:", this.operators);
  },
  (err) => {
    console.error("Error in viewtps:", err);
  }
);
  }

}