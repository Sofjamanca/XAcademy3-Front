
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf, NgClass } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceHelper } from '../../../core/models/helpers/device-helper';
import emailjs from 'emailjs-com'

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, MaterialModule, NgClass],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})


export class ContactComponent implements OnInit{
  isMobile: boolean = false;
  
  constructor(private deviceHelper: DeviceHelper, private snackBar: MatSnackBar) {}


   faqs = [
    { 
      question: '¿Qué es una incubadora de empresas y cuál es su propósito?', 
      answer: 'Una incubadora de empresas es una entidad que ofrece servicios de asesoría, formación y acompañamiento para apoyar el desarrollo y crecimiento de nuevos emprendimientos. Su propósito es facilitar la creación y consolidación de empresas, brindando herramientas y recursos que aumenten las posibilidades de éxito de los emprendedores.', 
      showAnswer: false 
    },
    { 
      question: '¿Qué servicios ofrece la incubadora del NOC en Cruz del Eje?', 
      answer: 'Nuestra incubadora proporciona asesoramiento en planificación y gestión de negocios, capacitación en áreas clave como marketing y finanzas, mentorías con profesionales, espacios de trabajo compartidos y acceso a redes de contacto y financiamiento.', 
      showAnswer: false 
    },
    { 
      question: '¿Quiénes pueden postularse para ser incubados?', 
      answer: 'Pueden postularse emprendedores y equipos con proyectos en marcha o ideas de negocio innovadoras que busquen apoyo para su desarrollo y consolidación. No es necesario que el emprendimiento esté formalmente constituido al momento de la postulación.', 
      showAnswer: false 
    },
    { 
      question: '¿Cuál es la duración del programa de incubación?', 
      answer: 'La duración del programa puede variar según las necesidades del emprendimiento y la etapa de desarrollo en la que se encuentre. Generalmente, los programas tienen una duración de entre 6 y 12 meses, con posibilidad de extensión según el progreso.', 
      showAnswer: false 
    },
    { 
      question: '¿Cómo es el proceso de selección de proyectos?', 
      answer: 'El proceso de selección incluye postulación con un formulario, evaluación del proyecto por un comité, entrevista con los emprendedores y, finalmente, la notificación de los proyectos seleccionados.', 
      showAnswer: false 
    },
    { 
      question: '¿Qué compromisos adquieren los emprendedores al ingresar al programa?', 
      answer: 'Los emprendedores se comprometen a participar en las actividades de formación, cumplir con objetivos establecidos, colaborar en la evaluación del progreso y respetar las normas de la incubadora.', 
      showAnswer: false 
    },
    { 
      question: '¿Qué beneficios adicionales ofrece la incubadora del NOC?', 
      answer: 'Además de asesoramiento y mentoría, ofrece participación en eventos y talleres, networking con otros emprendedores, promoción de proyectos y acceso a financiamiento.', 
      showAnswer: false 
    },
    { 
      question: '¿Cómo puedo postular mi proyecto a la incubadora del NOC?', 
      answer: 'Para postular tu proyecto, debes completar el formulario de postulación, adjuntar la documentación requerida y enviarla dentro de los plazos establecidos en las convocatorias vigentes.', 
      showAnswer: false 
    },
    { 
      question: '¿Dónde puedo obtener más información sobre la incubadora del NOC en Cruz del Eje?', 
      answer: 'Puedes obtener más información a través de su sitio web, correo electrónico, teléfono o visitando sus oficinas en General Mitre 757, Cruz del Eje, Córdoba.', 
      showAnswer: false 
    }
  ];
  

  ngOnInit(): void {
    this.deviceHelper.watchDeviceChange((isMobile) => {
      this.isMobile = isMobile;
    });
  }


  toggleAnswer(item: any) {
    item.showAnswer = !item.showAnswer; 
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const formData = {
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        message: form.value.message,
        time: new Date().toLocaleString(), 
      };

      emailjs.send('service_vf7d7lk', 'template_y2qfuzc', formData, 'gERchL2IHqJiGIhkj')
        .then(response => {
          this.snackBar.open('✅ Gracias por tu mensaje. Nos pondremos en contacto pronto.', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          form.reset();
        })
        .catch(error => {
          console.error('Error al enviar el mensaje', error);
          this.snackBar.open('⚠️ Ocurrió un error al enviar el mensaje. Intenta nuevamente.', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        });
    } else {
      this.snackBar.open('⚠️ Por favor, completa todos los campos.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
