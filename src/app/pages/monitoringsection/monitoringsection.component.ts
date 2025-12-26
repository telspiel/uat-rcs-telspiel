import { Component, OnInit } from '@angular/core';

interface Tab {
  path: string;
  label: string;
}


@Component({
  selector: 'app-monitoringsection',
  templateUrl: './monitoringsection.component.html',
  styleUrls: ['./monitoringsection.component.css']
})
export class MonitoringsectionComponent implements OnInit {

  tabs: Tab[] = [
    { path: 'smsmonitoring', label: 'SMS' },
    { path: 'rcsmonitoring', label: 'RCS' },
    { path: 'whatsappreport', label: 'WhatsApp' },

  ];


  constructor() { }

  ngOnInit(): void {
  }

}
