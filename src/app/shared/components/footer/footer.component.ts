import { Component, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { EffectCoverflow, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'shared-footer',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements AfterViewInit {
  @ViewChild('swiperContainer', { static: false }) swiperRef!: ElementRef;

  logos = [
    { src: '/assets/images/footer1.png' },
    { src: '/assets/images/footer2.jpeg' },
    { src: '/assets/images/footer3.png' },
    { src: '/assets/images/footer4.jpg'},
    { src: '/assets/images/footer5.png' },
    { src: '/assets/images/footer6.png'},
    { src: '/assets/images/footer7.png'},
    { src: '/assets/images/footer8.jpg'},
    { src: '/assets/images/footer9.jpeg'},
    { src: '/assets/images/footer10.png'},
    { src: '/assets/images/footer11.png'},
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    // Inicializa Swiper solo si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      new Swiper(this.swiperRef.nativeElement, {
        modules: [EffectCoverflow, Autoplay, Navigation, Pagination],
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 4,
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false
        },
        autoplay: { delay: 2500, disableOnInteraction: false },
        loop: true,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true }
      });
    }
  }
}
