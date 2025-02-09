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
    { src: 'https://innovaryemprendercba.com.ar/wp-content/uploads/2021/10/5-CONTACTO-06.png' },
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3G4RI0Ro1bp7F9NGMZF-2wch7bXw-PhOXsL53f-hAwByIXkKZnAHoC_S5LAh_SftSJss&usqp=CAU' },
    { src: 'https://www.cba.gov.ar/wp-content/4p96humuzp/2017/06/logo-cba-incuba.png' },
    { src: 'https://www.ubp.edu.ar/wp-content/uploads/2019/01/Ministerio-de-Industria.jpg'},
    { src: 'https://datosgestionabierta.cba.gov.ar/uploads/group/2018-09-06-142318.706967ag-joven.jpg' },
    { src: 'https://www.fedecom.org.ar/wp-content/uploads/2018/09/came-logo-portada.png'},
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt1jfsBtguLHmA387m9baGlvvEZG-Z5fvb2fLVHw3GBK0w4jcieiJTgFVQrZrn9TrHXpg&usqp=CAU'},
    { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2Vna0Lk6XaJnwNxkqPltQF8ACuk3LHbALWw&s'},
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
