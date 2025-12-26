import { HttpClient } from "@angular/common/http";
import { Component, ViewChild, ChangeDetectorRef } from "@angular/core"; // Added ChangeDetectorRef
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
import { NzCarouselComponent } from "ng-zorro-antd/carousel";
import { NzUploadFile } from "ng-zorro-antd/upload";
import { CampaignService } from "src/app/service/campaign.service";
import { ReportService } from "src/app/service/report.service";
import { TemplateService } from "src/app/service/template-service.service";
import { ToastService } from "src/app/shared/toast-service.service";

@Component({
  selector: "app-template-approval",
  templateUrl: "./template-approval.component.html",
  styleUrls: ["./template-approval.component.scss"],
})
export class TemplateApprovalComponent {
  templateList: any;
  visible = false;
  isVisible2 = false;
  approved = false;
  @ViewChild("carouselRef", { static: false }) carousel!: NzCarouselComponent;
  botSummary: any;
  filteredTemplateList: any[] = [];
  botName: any;
  isStatusModalVisible = false;
  selectedTemplateName = "";
  selectedFilter: string = "Active";
  isTemplateActive = false;
  alignment = "";
  fileUrl = "";
  // selectedFilter: string = 'All';
  selectedTemplate: any = null;
  today = new Date();
  day = this.today.getDate();
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();
  botss: any;
  templateId: any;
  templateListapproved: any[] = [];
  getAllInActiveTemplates: any[] = [];
  pendingCount: number = 0;
  approvedCount: number = 0;
  selectedBot: any = null;
  botId: string = "";
  messageTemplate: any;
  selectedBotId12: boolean = false;
  selecttemplate: boolean = false;
  selectedbotid: any;
  messagetype = "transactional";
  fileList: NzUploadFile[] = [];
  isUploading: boolean = false;
  uploading = false;
  shortUrlSelected = "N";
  shortuploadss = "no";
  selectedTab: string = "Run Now";
  quickObj: any;
  bulkCampaignObj: any;
  radio = "A";
  hourList: string[] = [];
  uploadedBulkfileName: any[] = [];
  selectedColor: string = '#000000';
  columnHeaders: any;
  quickUpload: any;
  scheduleMessage = "no";
  splitFile = "no";
  numberprivew: any;
  capabilities: any[] = [];
  mssageprivew: any;
  previewUrl: string | null = null;
  imageUrl:string="";
  backgroundUrl: SafeUrl | null = null;
  uploadedFileSize: string | null = null;
  uploadedFileUrl: string | null = null;
  orientation = "vertical";
  carouselList: {
    cardTitle: string | null | undefined;
    cardDescription: string | null | undefined;
    mediaUrl: string | null;
    suggestions: any[];
  }[] = [
    { cardTitle: "", cardDescription: "", mediaUrl: "", suggestions: [] },
    { cardTitle: "", cardDescription: "", mediaUrl: "", suggestions: [] },
  ];
  imageHeight = 120;
  transformedData: any;
  phoneControl = new FormControl("");
  templateForm = this.fb.group({
    botid: [""],
    type: ["", Validators.required],
    name: ["", Validators.required],
    fallbackText: ["", Validators.required],
    height: [""],
    width: [""],
    alignment: ["", Validators.required],
    cardTitle: ["", [Validators.required, Validators.maxLength(200)]],
    messagecontent: ["", [Validators.required, Validators.maxLength(2500)]],
    cardOrientation: [""],
    cardDescription: ["", [Validators.required, Validators.maxLength(2000)]],
    standAloneFileName: [""],
    thumbnailFileName: [""],
    urlopen: ["", [Validators.required, Validators.maxLength(120)]],
    phonenumberdial: [""],
    fallback: ["no", Validators.required],
    suggestions: this.fb.array([]),
  });
  checkcapabilityform = this.fb.group({
    Mobile_Number: [""],
  });
  operator: any;
  selectedFile: File | null = null;
  quickCampaign!: FormGroup;
  cardTitle: any;
  carddescription: any;
  Suggestiontext: any;
  suggestions: any;
  messagecontent: any;
  valueChangesSubscription: any;
  templateStatus: any;
  splitPartForm!: FormGroup;
  selectedCardIndex: any;
  checked: boolean = false;
  fileType: any;
  isFallbackEnabled = false;
  validateForm!: FormGroup;
  uploadCampaignForm: any;
  sessionStorage: any;
  uploadedFileName: any;
  bulkupload: any = [];
  minutesList: string[] = [];
  templateType: any;
  disabledDate: ((d: Date) => boolean) | undefined;
  timeDefaultValue: Date | undefined;

  constructor(
    private templateService: TemplateService,
    private fb: FormBuilder,
    private http: HttpClient,
    private capmser: CampaignService,
    private toastService: ToastService,
    private temp: TemplateService,
    private reportService: ReportService,
    private cdr: ChangeDetectorRef // Added ChangeDetectorRef
  ) {
    this.validateForm = this.fb.group({
      botName: [{ value: "", disabled: "true" }],
      brandName: [{ value: "", disabled: "true" }],
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
      Url: [{ value: "", disabled: "true" }],
      privacypolicyurl: [{ value: "", disabled: "true" }],
      chatbotwebhook: [{ value: "", disabled: "true" }],
      botSummary: [{ value: "", disabled: "true" }],
      scheduleMessage: [{ value: "", disabled: "true" }],
    });
  }

  showModal2(): void {
    this.isVisible2 = true;
  }

  handleOk2(): void {
    console.log("Button ok clicked!");
    this.isVisible2 = false;
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  closeapprove() {
    this.approved = false;
  }

  handleCancel2(): void {
    console.log("Button cancel clicked!");
    this.isVisible2 = false;
  }

  ngOnInit(): void {
    let dt = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
    };

    this.templateService.getAllPendingTemplates(dt).subscribe(
      (response) => {
        this.templateList = response.data.templateDataList || [];
        this.cdr.detectChanges();
        console.log("Pending templates:", response);
      },
      (error) => {
        this.toastService.publishNotification(
          "error",
          "Failed to fetch pending templates"
        );
        console.error("Error fetching pending templates:", error);
      }
    );

    this.templateService.getAllapproveTemplates(dt).subscribe(
      (response) => {
        const rawTemplates = response.data?.templateList || [];

        this.templateListapproved = rawTemplates
          .filter((item: any) =>
            item.template?.operatordata?.every(
              (op: any) => op.templateStatus === "Approved"
            )
          )
          .map((item: any) => {
            const tpl = item.template;
            return {
              userName: tpl?.userName || "N/A",
              name: tpl?.name || "N/A",
              createadDate: item.createadDate || "N/A",
              approveDate: item.approveDate || "N/A",
              operatorData: tpl?.operatordata || [],
              id: tpl?.id || "N/A",
              type: tpl?.type || "N/A",
              isActive: tpl?.isActive ?? null, // <-- add this
            };
          });

        this.filteredTemplateList = [...this.templateListapproved]; // Default to All
        this.cdr.detectChanges();
        console.log(
          "Processed Approved Template List:",
          this.templateListapproved
        );
      },
      (error) => {
        this.templateListapproved = [];
        this.filteredTemplateList = [];
        this.cdr.detectChanges();
        this.toastService.publishNotification(
          "error",
          "Failed to fetch approved templates"
        );
        console.error("Error fetching approved templates:", error);
      }
    );
  }

  applyFilter() {
    if (this.selectedFilter === "All") {
      this.filteredTemplateList = [...this.templateListapproved];
    } else if (this.selectedFilter === "Active") {
      this.filteredTemplateList = this.templateListapproved.filter(
        (t: any) => t.isActive === true
      );
    } else if (this.selectedFilter === "Inactive") {
      this.filteredTemplateList = this.templateListapproved.filter(
        (t: any) => t.isActive === false
      );
    }
    this.cdr.detectChanges();
  }

  onTabChange(index: number): void {
    const dt = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
    };

    if (index === 0) {
      this.templateService.getAllPendingTemplates(dt).subscribe(
        (response) => {
          this.templateList = response.data.templateDataList || [];
          this.cdr.detectChanges();
          console.log("Pending templates:", response);
        },
        (error) => {
          this.toastService.publishNotification(
            "error",
            "Failed to fetch pending templates"
          );
          console.error("Error fetching pending templates:", error);
        }
      );
    } else if (index === 1) {
      this.templateService.getAllapproveTemplates(dt).subscribe(
        (response) => {
          const rawTemplates = response.data?.templateList || [];
          this.templateListapproved = rawTemplates
            .filter((item: any) =>
              item.template?.operatordata?.every(
                (op: any) => op.templateStatus === "Approved"
              )
            )
            .map((item: any) => {
              const tpl = item.template;
              return {
                userName: tpl?.userName || "N/A",
                name: tpl?.name || "N/A",
                createadDate: tpl?.createdDate || "N/A",
                approveDate: tpl?.approveDate || "N/A",
                operatorData: tpl?.operatordata || [],
                id: tpl?.id || "N/A",
                type: tpl?.type || "N/A",
                isActive: tpl?.isActive ?? null, // <-- add this
              };
            });
          this.applyFilter();
          this.cdr.detectChanges();
          console.log(
            "Processed Approved Template List:",
            this.templateListapproved
          );
        },
        (error) => {
          this.templateListapproved = [];
          this.cdr.detectChanges();
          this.toastService.publishNotification(
            "error",
            "Failed to fetch approved templates"
          );
          console.error("Error fetching approved templates:", error);
        }
      );
    } else if (index === 2) {
      this.templateService.getAllInActiveTemplates(dt).subscribe(
        (response) => {
          const rawTemplates = response.data?.templateList || [];
          this.getAllInActiveTemplates = rawTemplates
            .filter((item: any) =>
              item.template?.operatordata?.every(
                (op: any) => op.templateStatus === "Approved"
              )
            )
            .map((item: any) => {
              const tpl = item.template;
              return {
                userName: tpl?.userName || "N/A",
                name: tpl?.name || "N/A",
                createadDate: tpl?.createdDate || "N/A",
                approveDate: tpl?.approveDate || "N/A",
                operatorData: tpl?.operatordata || [],
                id: tpl?.id || [],
                type: tpl?.type || "N/A",
              };
            });
          this.cdr.detectChanges();
          console.log(
            "Processed Approved Template List:",
            this.templateListapproved
          );
        },
        (error) => {
          this.templateListapproved = [];
          this.cdr.detectChanges();
          this.toastService.publishNotification(
            "error",
            "Failed to fetch approved templates"
          );
          console.error("Error fetching approved templates:", error);
        }
      );
    }
  }

  updatetemplate(id: any) {
    console.log("Update for template ID: " + id);
    const payload = {
      templateId: id,
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      isActive: false,
    };
    this.templateService.updateactive(payload).subscribe(
      (response) => {
        console.log("Update template response", response);
        this.toastService.publishNotification(
          "success",
          "Template updated successfully"
        );
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastService.publishNotification(
          "error",
          "Failed to update template"
        );
        console.error("Error updating template:", error);
      }
    );
  }

  updatetemplateInactive(id: any) {
    console.log("Update for template ID: " + id);
    const payload = {
      templateId: id,
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      isActive: true,
    };
    this.templateService.updateactive(payload).subscribe(
      (response) => {
        console.log("Update template response", response);
        this.toastService.publishNotification(
          "success",
          "Template updated successfully"
        );
        this.cdr.detectChanges();
      },
      (error) => {
        this.toastService.publishNotification(
          "error",
          "Failed to update template"
        );
        console.error("Error updating template:", error);
      }
    );
  }

  cancel() {}

  getFormattedCampaignDateTime(): string {
    const formValues = this.quickCampaign.value;
    if (!formValues.campaignScheduledDateTime) return "";
    const date = new Date(formValues.campaignScheduledDateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hour = formValues.campaignHour || "12";
    const minute = formValues.campaignMinute || "00";
    const second = formValues.campaignSecond || "00";
    const meridian = formValues.campaignMeridian || "AM";
    return `${year}-${month}-${day} ${hour}:${minute}:${second} ${meridian}`;
  }

  get suggestionsFormArray(): FormArray {
    return this.templateForm.get("suggestions") as FormArray;
  }

  addSuggestion(): void {
    console.log(this.suggestionsFormArray.length);
    if (this.suggestionsFormArray.length <= 3) {
      this.suggestionsFormArray.push(
        this.fb.group({
          type: [{ value: "reply", disabled: true }, Validators.required],
          text: [
            { value: "", disabled: true },
            [Validators.required, Validators.maxLength(25)],
          ],
          postback: [
            { value: "", disabled: true },
            [Validators.required, Validators.maxLength(120)],
          ],
          url: [{ value: "", disabled: true }, [Validators.maxLength(120)]],
          phoneNumber: [{ value: "", disabled: true }],
          latitude: [{ value: "", disabled: true }],
          longitude: [{ value: "", disabled: true }],
          label: [{ value: "", disabled: true }],
          query: [{ value: "", disabled: true }],
          title: [{ value: "", disabled: true }],
          description: [{ value: "", disabled: true }],
          date: [{ value: "", disabled: true }],
          startTime: [{ value: "", disabled: true }],
          endTime: [{ value: "", disabled: true }],
          timeZone: [{ value: "", disabled: true }],
        })
      );
    } else {
      return;
    }
  }

  onSuggestionClick(postback: string) {
    console.log("Suggestion Clicked:", postback);
  }

  nextCard() {
    this.carousel.next();
    this.selectedCardIndex = this.selectedCardIndex + 1;
  }

  prevCard() {
    this.carousel.pre();
    this.selectedCardIndex = this.selectedCardIndex - 1;
  }

  getFormattedExpiryDateTime(): string {
    const formValues = this.quickCampaign.value;
    if (!formValues.campaignExpiryDateTime) return "";
    const date = new Date(formValues.campaignExpiryDateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hour = formValues.expiryHour || "12";
    const minute = formValues.expiryMinute || "00";
    const second = formValues.expirySecond || "00";
    const meridian = formValues.expiryMeridian || "AM";
    return `${year}-${month}-${day} ${hour}:${minute}:${second} ${meridian}`;
  }

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

  selecttemp(template: any) {
    this.visible = true;
    this.selectedTemplate = template;
    const selectedtemplate = template;
    console.log(selectedtemplate);
    if (selectedtemplate) {
      let data = {
        loggedInUserName: sessionStorage.getItem("USER_NAME"),
        templateName: selectedtemplate,
      };
      this.temp.templateDetail(data).subscribe(
        (res) => {
          const botId = res.botId;
          this.onBotSelect(botId);
          if (res) {
            const type = res.type;
            if (type === "rich_card") {
              this.previewUrl = res.standAlone.mediaUrl;
              this.fileUrl = res.standAlone.mediaUrl;
              this.alignment = res.alignment;
              this.templateType = res.type;
              this.templateId = res.id;

              let isVideo = false;
              if (res.standAlone.mediaUrl) {
                const mediaUrl = res.standAlone.mediaUrl.toLowerCase();
                isVideo =
                  mediaUrl.endsWith(".mp4") ||
                  mediaUrl.endsWith(".mov") ||
                  mediaUrl.endsWith(".avi") ||
                  mediaUrl.endsWith(".webm");
              }
              this.templateForm.patchValue({
                type: res.type,
                name: res.name,
                height: res.height,
                alignment: res.alignment,
                width: res.width,
                cardTitle: res.standAlone.cardTitle,
                messagecontent: res.textMessageContent,
                cardOrientation: res.orientation,
                cardDescription: res.standAlone.cardDescription,
                standAloneFileName: isVideo
                  ? res.standAlone.thumbnailUrl
                  : res.standAlone.mediaUrl,
                thumbnailFileName: res.standAlone.thumbnailFileName,
              });
              if (res.standAlone.suggestions) {
                const suggestionsArray = this.templateForm.get(
                  "suggestions"
                ) as FormArray;
                suggestionsArray.clear();
                res.standAlone.suggestions.forEach((suggestion: any) => {
                  suggestionsArray.push(
                    this.fb.group({
                      type: [
                        { value: suggestion.suggestionType, disabled: true },
                      ],
                      text: [{ value: suggestion.displayText, disabled: true }],
                      postback: [
                        { value: suggestion.postback, disabled: true },
                      ],
                      url: [{ value: suggestion.url, disabled: true }],
                      phoneNumber: [
                        { value: suggestion.phoneNumber, disabled: true },
                      ],
                      latitude: [
                        { value: suggestion.latitude, disabled: true },
                      ],
                      longitude: [
                        { value: suggestion.longitude, disabled: true },
                      ],
                      label: [{ value: suggestion.label, disabled: true }],
                      query: [{ value: suggestion.query, disabled: true }],
                      title: [{ value: suggestion.title, disabled: true }],
                      description: [
                        { value: suggestion.description, disabled: true },
                      ],
                      date: [{ value: suggestion.date, disabled: true }],
                    })
                  );
                });
              }
            }
            if (type === "carousel") {
              this.templateForm.patchValue({
                type: res.type,
                name: res.name,
                height: res.height,
                alignment: res.alignment,
                width: res.width,
              });
              this.suggestionsFormArray.clear();
              this.carouselList = res.carouselList.map((item: any) => ({
                cardTitle: item.cardTitle || "",
                cardDescription: item.cardDescription || "",
                mediaUrl: item.mediaUrl || "",
                suggestions:
                  item.suggestions?.map((suggestion: any) => ({
                    suggestionType: suggestion.suggestionType || "",
                    displayText: suggestion.displayText || "",
                    postback: suggestion.postback || "",
                    url: suggestion.url || "",
                    phoneNumber: suggestion.phoneNumber || "",
                    latitude: suggestion.latitude || null,
                    longitude: suggestion.longitude || null,
                    label: suggestion.label || "",
                    query: suggestion.query || "",
                    title: suggestion.title || "",
                    description: suggestion.description || "",
                    date: suggestion.date || "",
                  })) || [],
              }));
            }
            if (type === "text_message") {
              console.log(res);
              this.templateForm.patchValue({
                type: "TextMessage",
                name: res.name,
                messagecontent: res.textMessageContent,
              });
              if (res.suggestion) {
                const suggestionsArray = this.templateForm.get(
                  "suggestions"
                ) as FormArray;
                suggestionsArray.clear();
                res.suggestion.forEach((suggestion: any) => {
                  suggestionsArray.push(
                    this.fb.group({
                      type: [
                        { value: suggestion.suggestionType, disabled: true },
                      ],
                      text: [{ value: suggestion.displayText, disabled: true }],
                      postback: [
                        { value: suggestion.postback, disabled: true },
                      ],
                      url: [{ value: suggestion.url, disabled: true }],
                      phoneNumber: [
                        { value: suggestion.phoneNumber, disabled: true },
                      ],
                      latitude: [
                        { value: suggestion.latitude, disabled: true },
                      ],
                      longitude: [
                        { value: suggestion.longitude, disabled: true },
                      ],
                      label: [{ value: suggestion.label, disabled: true }],
                      query: [{ value: suggestion.query, disabled: true }],
                      title: [{ value: suggestion.title, disabled: true }],
                      description: [
                        { value: suggestion.description, disabled: true },
                      ],
                      date: [{ value: suggestion.date, disabled: true }],
                    })
                  );
                });
              }
            }
          } else {
            console.error("Invalid API response:", res);
          }
        },
        (error) => {
          console.error("Failed to fetch bot details:", error);
        }
      );
    } else {
      console.error("No bot template found.");
    }
  }

  updateSatatus(status: any) {
    this.templateList.map((data: any) => {
      if (data.name === this.selectedTemplate) {
        data.templateStatus = status;
        this.templateId = data.id;
      }
    });
    let dt = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      templateId: this.templateId,
      templateStatus: status,
    };
    this.templateService.updateTemplateStatus(dt).subscribe(
      (res: any) => {
        this.toastService.publishNotification(
          "sucess",
          "status updated successfully"
        );
      },
      (err: any) => {
        this.toastService.publishNotification(
          "error",
          "something went wrong while updating template"
        );
      }
    );
    this.visible = false;
  }

  tempapprove(template: any) {
    this.approved = true;
    this.selectedTemplate = template;
    const selectedtemplate = template;
    console.log(selectedtemplate);
    if (selectedtemplate) {
      let data = {
        loggedInUserName: sessionStorage.getItem("USER_NAME"),
        templateName: selectedtemplate,
      };
      this.temp.templateDetail(data).subscribe(
        (res) => {
          const botId = res.botId;
          this.onBotSelect(botId);
          if (res) {
            const type = res.type;
            if (type === "rich_card") {
              this.previewUrl = res.standAlone.mediaUrl;
              this.fileUrl = res.standAlone.mediaUrl;
              this.alignment = res.alignment;
              this.templateType = res.type;
              this.templateId = res.id;
              this.templateForm.patchValue({
                type: res.type,
                name: res.name,
                height: res.height,
                alignment: res.alignment,
                width: res.width,
                cardTitle: res.standAlone.cardTitle,
                messagecontent: res.textMessageContent,
                cardOrientation: res.orientation,
                cardDescription: res.standAlone.cardDescription,
                standAloneFileName: res.standAlone.mediaUrl,
                thumbnailFileName: res.standAlone.thumbnailFileName,
              });
              if (res.standAlone.suggestions) {
                const suggestionsArray = this.templateForm.get(
                  "suggestions"
                ) as FormArray;
                suggestionsArray.clear();
                res.standAlone.suggestions.forEach((suggestion: any) => {
                  suggestionsArray.push(
                    this.fb.group({
                      type: [
                        { value: suggestion.suggestionType, disabled: true },
                      ],
                      text: [{ value: suggestion.displayText, disabled: true }],
                      postback: [
                        { value: suggestion.postback, disabled: true },
                      ],
                      url: [{ value: suggestion.url, disabled: true }],
                      phoneNumber: [
                        { value: suggestion.phoneNumber, disabled: true },
                      ],
                      latitude: [
                        { value: suggestion.latitude, disabled: true },
                      ],
                      longitude: [
                        { value: suggestion.longitude, disabled: true },
                      ],
                      label: [{ value: suggestion.label, disabled: true }],
                      query: [{ value: suggestion.query, disabled: true }],
                      title: [{ value: suggestion.title, disabled: true }],
                      description: [
                        { value: suggestion.description, disabled: true },
                      ],
                      date: [{ value: suggestion.date, disabled: true }],
                    })
                  );
                });
              }
            }
            if (type === "carousel") {
              this.templateForm.patchValue({
                type: res.type,
                name: res.name,
                height: res.height,
                alignment: res.alignment,
                width: res.width,
              });
              this.suggestionsFormArray.clear();
              this.carouselList = res.carouselList.map((item: any) => ({
                cardTitle: item.cardTitle || "",
                cardDescription: item.cardDescription || "",
                mediaUrl: item.mediaUrl || "",
                suggestions:
                  item.suggestions?.map((suggestion: any) => ({
                    suggestionType: suggestion.suggestionType || "",
                    displayText: suggestion.displayText || "",
                    postback: suggestion.postback || "",
                    url: suggestion.url || "",
                    phoneNumber: suggestion.phoneNumber || "",
                    latitude: suggestion.latitude || null,
                    longitude: suggestion.longitude || null,
                    label: suggestion.label || "",
                    query: suggestion.query || "",
                    title: suggestion.title || "",
                    description: suggestion.description || "",
                    date: suggestion.date || "",
                  })) || [],
              }));
            }
            if (type === "text_message") {
              console.log(res);
              this.templateForm.patchValue({
                type: "TextMessage",
                name: res.name,
                messagecontent: res.textMessageContent,
              });
              if (res.suggestion) {
                const suggestionsArray = this.templateForm.get(
                  "suggestions"
                ) as FormArray;
                suggestionsArray.clear();
                res.suggestion.forEach((suggestion: any) => {
                  suggestionsArray.push(
                    this.fb.group({
                      type: [
                        { value: suggestion.suggestionType, disabled: true },
                      ],
                      text: [{ value: suggestion.displayText, disabled: true }],
                      postback: [
                        { value: suggestion.postback, disabled: true },
                      ],
                      url: [{ value: suggestion.url, disabled: true }],
                      phoneNumber: [
                        { value: suggestion.phoneNumber, disabled: true },
                      ],
                      latitude: [
                        { value: suggestion.latitude, disabled: true },
                      ],
                      longitude: [
                        { value: suggestion.longitude, disabled: true },
                      ],
                      label: [{ value: suggestion.label, disabled: true }],
                      query: [{ value: suggestion.query, disabled: true }],
                      title: [{ value: suggestion.title, disabled: true }],
                      description: [
                        { value: suggestion.description, disabled: true },
                      ],
                      date: [{ value: suggestion.date, disabled: true }],
                    })
                  );
                });
                console.log("this type" + type);
              }
            }
          } else {
            console.error("Invalid API response:", res);
          }
        },
        (error) => {
          console.error("Failed to fetch bot details:", error);
        }
      );
    } else {
      console.error("No bot template found.");
    }
  }
}
