import { Component } from '@angular/core';

@Component({
  selector: 'app-testdevice',
  templateUrl: './testdevice.component.html',
  styleUrls: ['./testdevice.component.scss']
})
export class TestdeviceComponent {
  testDevices = [
    { phoneNumber: '+91 99538 70879', submitted: 'Nov 13, 2024, 04:50:40 PM', status: 'Ready' },
    { phoneNumber: '+91 88401 84274', submitted: 'Nov 13, 2024, 05:01:05 PM', status: 'Pending' },
    { phoneNumber: '+91 95879 84033', submitted: 'Nov 13, 2024, 05:28:50 PM', status: 'Ready' },
    { phoneNumber: '+91 98187 31110', submitted: 'Nov 16, 2024, 10:49:33 AM', status: 'Pending' },
    { phoneNumber: '+91 93019 75922', submitted: 'Nov 16, 2024, 10:50:10 AM', status: 'Pending' },
  ];

  pageIndex = 1;
}
