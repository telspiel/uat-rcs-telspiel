import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { Validators } from "ngx-editor";
import { BotServiceService } from "src/app/service/bot-service.service";
import { ToastService } from "src/app/shared/toast-service.service";
@Component({
  selector: "app-tps-manager",
  templateUrl: "./tps-manager.component.html",
  styleUrls: ["./tps-manager.component.scss"],
})
export class TpsManagerComponent {
  operator: any;
  operatorsview: any[] = [];
  operatorForm: FormGroup;
  userName = sessionStorage.getItem("USER_NAME");
  operatorviewForm: FormGroup;
  role: string = sessionStorage.getItem("ROLE") || "";
  operatoreditForm: FormGroup;
  operators = [
    { name: "VTL", label: "VTL" },
    { name: "AIRTEL", label: "AIRTEL" },
    { name: "VODAFONE", label: "VODAFONE" },
    { name: "RELIANCE_JIO", label: "RELIANCE JIO" },
    { name: "BSNL", label: "BSNL" },
    { name: "Jio_CX", label: "RELIANCE JIO CX" },
  ];
  constructor(
    private fb: FormBuilder,
    private botService: BotServiceService,
    private tostService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.operatorForm = this.fb.group({
      selectedOperators: [[], Validators.required],
      operatorData: this.fb.array([]),
    });
    this.operatorviewForm = this.fb.group({
      selectedOperators: [[]],

      operatorData: this.fb.array([]), // Holds form fields for selected operators
    });
    this.operatoreditForm = this.fb.group({
      selectededitOperators: [[]],
      operatoreditData: this.fb.array([]),
    });
  }

  get operatoreditData(): FormArray {
    return this.operatoreditForm.get("operatoreditData") as FormArray;
  }

  get operatorData(): FormArray {
    return this.operatorForm.get("operatorData") as FormArray;
  }

  ngOnInit(): void {
    this.editfunction();
    this.botService.viewtps(this.operator).subscribe(
      (res: any) => {
        console.log("API response:", res);
        //  const selectedOperators = res.data[0]?.selectedOperators || [];
        this.operatorsview = res?.data[0]?.operatorData || [];
      },
      (err) => {
        console.error("Error in viewtps:", err);
      }
    );
  }

  editfunction() {
    this.botService.viewtps(this.operator).subscribe(
      (res: any) => {
        console.log("API response:", res);
        const operatoreditData = res?.data[0]?.operatorData || [];
        this.operatorsview = operatoreditData;
        this.operatoreditForm.patchValue({
          selectededitOperators: operatoreditData.map(
            (op: any) => op.operatorName
          ),
        });
        const formArray = this.operatoreditForm.get(
          "operatoreditData"
        ) as FormArray;
        formArray.clear();
        operatoreditData.forEach((op: any) => {
          formArray.push(
            this.fb.group({
              operatorName: [op.operatorName, Validators.required],
              traficVolume: [op.tps, Validators.required],
              operatorTemplateClientId: [op.operatorTemplateClientId || ""],      
              operatorTemplateSecret: [op.operatorTemplateSecret || ""]
            })
          );
        });

        this.cdr.detectChanges();
      },
      (err) => {
        console.error("Error in viewtps:", err);
      }
    );
  }

  onOperatoreditChange(selected: string[]) {
    const formArray = this.operatoreditForm.get(
      "operatoreditData"
    ) as FormArray;

    // Step 1: Build a map of existing operators
    const existingMap = new Map<string, FormGroup>();
    formArray.controls.forEach((ctrl: AbstractControl) => {
      const group = ctrl as FormGroup;
      const name = group.get("operatorName")?.value;
      if (name) {
        existingMap.set(name, group);
      }
    });

    // Step 2: Rebuild formArray with only selected operators
    const updatedControls: FormGroup[] = [];
    selected.forEach((opName) => {
      if (existingMap.has(opName)) {
        updatedControls.push(existingMap.get(opName)!); // Keep existing
      } else {
        // Add new
        updatedControls.push(
          this.fb.group({
            operatorName: [opName, Validators.required],
            traficVolume: ["", Validators.required],
            operatorTemplateClientId: [""],
            operatorTemplateSecret:[""]
          })
        );
      }
    });

    // Step 3: Replace formArray content
    formArray.clear();
    updatedControls.forEach((ctrl) => formArray.push(ctrl));
  }

  onTabChange(event: any) {
    if (event.index === 0) {
      this.operatorForm.reset();
      this.operatorData.clear();
    } else if (event.index === 1) {
      this.botService.viewtps(this.operator).subscribe(
        (res: any) => {
          this.operatorsview = res.data[0].operatorData; // 👈 Use operatorData here
          console.log("Operator view data:", this.operatorsview);
        },
        (err) => {
          console.error("Error in viewtps:", err);
        }
      );

      // this.operatorviewData.clear();
    } else if (event.index === 2) {
    }
  }

  onOperatorChange(selected: string[]) {
    this.operatorData.clear();

    selected.forEach((op) => {
      this.operatorData.push(
        this.fb.group({
          operatorName: [op],
          tps: ["", Validators.required],
          operatorTemplateClientId: [""],
          operatorTemplateSecret:[""]
        })
      );
    });
  }

  // onOperatoreditChange(selected: string[]) {
  //   this.operatoreditData.clear();

  //   selected.forEach(op => {

  //    this.operatoreditData.push(
  //       this.fb.group({
  //         operatorName: [op],
  //         tps: ["", Validators.required],
  //       })
  //     )
  //   });
  // }

  // onOperatorviewChange(selected: string[]){
  //    this.operatorviewData.clear();

  //   selected.forEach(op => {

  //    this.operatorviewData.push(
  //       this.fb.group({
  //         operatorviewName: [op],
  //         tps: ["", Validators.required],
  //       })
  //     )
  //   });
  // }

  onOperatorviewChange(selected: string[]) {
    this.operatorData.clear();

    selected.forEach((op) => {
      this.operatorData.push(
        this.fb.group({
          operatorName: [op, Validators.required],
          isNewBot: [true, Validators.required],
          trafficVolume: [100, Validators.required],
          operatorBotId: [""],
          operatorBotSecret: [""],
          operatorBotStatus: ["LAUNCHED"],
        })
      );
    });
  }

  submitForm() {
    if (this.operatorForm.valid && this.operatorData.length > 0) {
      if (this.operatorData.controls.some((control) => control.invalid)) {
        this.tostService.publishNotification(
          "Please ensure all operator data fields are filled correctly",
          "error",
          "error"
        );
      } else {
        this.botService.addtps(this.operatorForm.value).subscribe({
          next: (res) => {
            this.tostService.publishNotification(
              res.message,
              "success",
              "success"
            );
            this.operatorForm.reset();
          },
          error: (err) => {
            this.tostService.publishNotification(
              err.error.message,
              "error",
              "error"
            );
          },
        });
      }
    } else {
      this.tostService.publishNotification(
        "Please fill all required fields",
        "error",
        "error"
      );
    }
  }

  editForm() {
    const formArray = this.operatoreditForm.get(
      "operatoreditData"
    ) as FormArray;
    const formValue = this.operatoreditForm.value;
    console.log("edit form value" + formValue);
    const payload = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      selectedOperators: formValue.selectededitOperators,
      operatorData: formValue.operatoreditData.map((op: any) => ({
        operatorName: op.operatorName,
        tps: op.traficVolume,
        operatorTemplateClientId: op.operatorTemplateClientId || "",
        operatorTemplateSecret: op.operatorTemplateSecret || ""
      })),
    };

    this.botService.edittps(payload).subscribe({
      next: (res) => {
        this.tostService.publishNotification(res.message, "success", "success");
         this.operatoreditForm.reset();
        //  this.operatorData.clear();

      },
      error: (err) => {
        this.tostService.publishNotification(
          err.error.message,
          "error",
          "error"
        );
      },
    });
  }

  resetForm() {
    this.operatorForm.reset();
    this.operatorData.clear();
  }
}
