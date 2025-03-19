import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';


@Component({
  selector: 'app-we',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './we.component.html',
  styleUrls: ['./we.component.css'],
})
export class WeComponent {
  sections = [
    {
      title: 'Nuestra Historia',
      content: `Nacimos en Cruz del Eje, Córdoba, como parte del Programa Córdoba Incuba,
      impulsado por la Agencia Córdoba Innovar y Emprender. Desde el principio, nuestro propósito 
      ha sido fortalecer el ecosistema emprendedor, brindando apoyo y herramientas a proyectos 
      innovadores.  

      A lo largo de los años, hemos crecido y escalado posiciones en el ecosistema regional, 
      consolidándonos como un pilar clave en el desarrollo económico y social del noroeste 
      de Córdoba.`,
      image: 'assets/images/we/historia.webp'
    },
    {
      title: 'Nuestra Misión',
      content: `Impulsamos el desarrollo de emprendimientos sostenibles e innovadores,
      brindando herramientas, mentorías y capacitación.  
      
      Nuestra misión es acompañar a emprendedores en su crecimiento, conectándolos con 
      oportunidades y redes estratégicas que potencien sus proyectos.`,
      image: 'assets/images/we/mision.webp'
    },
    {
      title: 'Nuestra Visión',
      content: `Ser un referente en incubación de startups y proyectos innovadores en el 
      noroeste de Córdoba, creando un ecosistema dinámico y conectado que fomente la 
      innovación y el crecimiento de los emprendedores.`,
      image: 'assets/images/we/vision.webp'
    },
    {
      title: '¿Qué Hacemos?',
      content: `Capacitamos, asesoramos y vinculamos a emprendedores con inversores y mentores.
      Brindamos programas de incubación que incluyen formación, acceso a financiamiento y 
      oportunidades de networking.`,
      image: 'assets/images/we/que-hacemos.webp'
    },
    {
      title: 'Nuestro Compromiso',
      content: `Somos parte del Programa Córdoba Incuba y trabajamos para impulsar el desarrollo 
      sostenible de la región.  

      Creemos en el talento local y en la capacidad de los emprendedores para generar impacto 
      positivo en la comunidad.`,
      image: 'assets/images/we/compromiso.webp'
    }
  ];
  
}

