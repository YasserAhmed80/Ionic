import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.page.html',
  styleUrls: ['./slide.page.scss'],
})
export class SlidePage implements OnInit {
  slideOpts1 = {
    initialSlide: 0,
    speed: 100,
    slidesPerView: 1.3,
    spaceBetween:10,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },

  };

  slideOpts2 = {
    initialSlide: 0,
    speed: 100,
    pager:true,
    slidesPerView: 1.2,
    spaceBetween:10,
    pagination: {
      el: '.swiper-pagination',
      type: 'none',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

  };

  slideOpts3 = {
    initialSlide: 0,
    speed: 100,
    slidesPerView: 1.2,
    spaceBetween:10,
    pager:true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + '</span>';
      },  
    },
  };


  constructor() { }

  ngOnInit() {
  }

}
