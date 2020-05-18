import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.page.html',
  styleUrls: ['./toolbar.page.scss'],
})
export class ToolbarPage implements OnInit {
  new_activities = 10;
  new_message = 11;
  constructor() { }

  ngOnInit() {
  }

}
