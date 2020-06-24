import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-img-loader',
  templateUrl: './img-loader.component.html',
  styleUrls: ['./img-loader.component.scss'],
})
export class ImgLoaderComponent implements OnInit {
  @Input('src')  src: string;

  imageLoaded: boolean=false;

  constructor() { }

  ngOnInit() {}

}
