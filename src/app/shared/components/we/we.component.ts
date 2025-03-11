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
      image: 'assets/images/we/historia.png'
    },
    {
      title: 'Nuestra Misión',
      content: `Impulsamos el desarrollo de emprendimientos sostenibles e innovadores,
      brindando herramientas, mentorías y capacitación.  
      
      Nuestra misión es acompañar a emprendedores en su crecimiento, conectándolos con 
      oportunidades y redes estratégicas que potencien sus proyectos.`,
      image: 'assets/images/we/mision.png'
    },
    {
      title: 'Nuestra Visión',
      content: `Ser un referente en incubación de startups y proyectos innovadores en el 
      noroeste de Córdoba, creando un ecosistema dinámico y conectado que fomente la 
      innovación y el crecimiento de los emprendedores.`,
      image: 'assets/images/we/vision.png'
    },
    {
      title: '¿Qué Hacemos?',
      content: `Capacitamos, asesoramos y vinculamos a emprendedores con inversores y mentores.
      Brindamos programas de incubación que incluyen formación, acceso a financiamiento y 
      oportunidades de networking.`,
      image: 'assets/images/we/que-hacemos.png'
    },
    {
      title: 'Nuestro Compromiso',
      content: `Somos parte del Programa Córdoba Incuba y trabajamos para impulsar el desarrollo 
      sostenible de la región.  

      Creemos en el talento local y en la capacidad de los emprendedores para generar impacto 
      positivo en la comunidad.`,
      image: 'assets/images/we/compromiso.png'
    }
  ];

  values = [
    { icon: 'assets/images/we/Innovadores.png', title: 'Innovadores', content: 'Somos curiosos, nos gustan los desafíos y siempre estamos buscando cómo mejorar nuestro trabajo.' },
    { icon: 'assets/images/we/Proactivos.png', title: 'Proactivos', content: 'Buscamos que las cosas sucedan en vez de quedarnos esperando.' },
    { icon: 'assets/images/we/Equipo.png', title: 'Unidos como equipo', content: 'Somos parte de un equipo que logra resultados increíbles trabajando entre todos.' },
    { icon: 'assets/images/we/Apasionados.png', title: 'Apasionados', content: 'Disfrutamos nuestro día a día y amamos lo que hacemos.' },
    { icon: 'assets/images/we/Globales.png', title: 'Globales', content: 'Perseguimos un pensamiento más allá de nuestras comunidades.' },
    { icon: 'assets/images/we/Perseverantes.png', title: 'Perseverantes', content: 'No nos conformamos con un "no se puede", buscamos que las cosas pasen.' }
  ];
  
}

