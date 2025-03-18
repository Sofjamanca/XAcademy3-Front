import { NgZone, Component, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
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
    { src: '/assets/images/footer1.webp' },
    { src: '/assets/images/footer2.webp' },
    { src: '/assets/images/footer3.webp' },
    { src: '/assets/images/footer4.webp'},
    { src: '/assets/images/footer5.webp' },
    { src: '/assets/images/footer6.webp'},
    { src: '/assets/images/footer7.webp'},
    { src: '/assets/images/footer8.webp'},
    { src: '/assets/images/footer9.webp'},
    { src: '/assets/images/footer10.webp'},
    { src: '/assets/images/footer11.webp'},
  ];

  swiper: Swiper | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.swiper = new Swiper(this.swiperRef.nativeElement, {
        modules: [ Autoplay, Navigation, Pagination],
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 6, // Ajusta según necesidad
        spaceBetween: 10, // Espaciado entre imágenes
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          slideShadows: false,

        },
        autoplay: { delay: 2500, disableOnInteraction: false },
        loop: true, 
        speed: 500,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true },
      
        breakpoints: {
          0: { slidesPerView: 2 }, // Para celulares
          768: { slidesPerView: 6 } // Para pantallas grandes
        }
      });
    }
  }
}
