import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TeacherService } from '../../../../services/teacher/teacher.service';
import { Course } from '../../../../core/models/course.model';
import { CoursesService } from '../../../../services/courses/courses.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ]
})
export class CreateTeacherComponent implements OnInit {
    createTeacherForm: FormGroup;
    courses: Course[] = [];
    selectedCourses: Course[] = [];
    editMode: boolean = false;
    teacherId: number | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private teacherService: TeacherService,
        private courseService: CoursesService
    ) {
        this.createTeacherForm = this.formBuilder.group({
            name: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            phone: ['', Validators.required],
            specialty: ['', Validators.required],
            courses: [[]],
            isRegistered: [false]
        });

        // Escuchar cambios en el checkbox de usuario registrado
        this.createTeacherForm.get('isRegistered')?.valueChanges.subscribe(isRegistered => {
            this.updatePasswordValidation(isRegistered);
        });
    }

    ngOnInit(): void {
        this.loadCourses();
        
        // verificar si estamos en modo editar
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.editMode = true;
                this.teacherId = +params['id'];
                this.loadTeacherData(this.teacherId);
            }
        });
    }

    // Actualizar la validación de la contraseña según si el usuario está registrado
    updatePasswordValidation(isRegistered: boolean): void {
        const passwordControl = this.createTeacherForm.get('password');
        const confirmPasswordControl = this.createTeacherForm.get('confirmPassword');
        const nameControl = this.createTeacherForm.get('name');
        const lastNameControl = this.createTeacherForm.get('lastName');
        const phoneControl = this.createTeacherForm.get('phone');
        
        if (isRegistered) {
            // Si el usuario ya está registrado, quitar la validación de los campos
            passwordControl?.clearValidators();
            confirmPasswordControl?.clearValidators();
            nameControl?.clearValidators();
            lastNameControl?.clearValidators();
            phoneControl?.clearValidators();
        } else {
            // Si es un nuevo usuario, requerir todos los campos
            passwordControl?.setValidators([Validators.required]);
            confirmPasswordControl?.setValidators([Validators.required]);
            nameControl?.setValidators([Validators.required]);
            lastNameControl?.setValidators([Validators.required]);
            phoneControl?.setValidators([Validators.required]);
        }
        
        // Actualizar el estado de validación
        passwordControl?.updateValueAndValidity();
        confirmPasswordControl?.updateValueAndValidity();
        nameControl?.updateValueAndValidity();
        lastNameControl?.updateValueAndValidity();
        phoneControl?.updateValueAndValidity();
    }

    loadCourses() {
        this.courseService.getCourses().subscribe((courses) => {
            this.courses = courses;
        });
    }

    loadTeacherData(id: number) {
        this.teacherService.getTeacherById(id).subscribe((response: any) => {
            const teacher = response.teacher;
            const courses = response.courses;
            
            // llenar el formulario con datos del profesor
            this.createTeacherForm.patchValue({
                name: teacher.user.name,
                lastname: teacher.user.lastname,
                email: teacher.user.email,
                phone: teacher.user.phone || '',
                specialty: teacher.specialty || '',
                courses: courses.map((course: Course) => course.id),
                isRegistered: this.editMode // Si estamos en modo edición, el usuario ya está registrado
            });
            
            // Actualizar la validación de contraseña para el modo edición
            this.updatePasswordValidation(this.editMode);
        });
    }

    createTeacher() {
        if (this.createTeacherForm.valid) {
            const teacherData = this.createTeacherForm.value;
            const isRegistered = teacherData.isRegistered;
            console.log(teacherData);
            // Eliminar campos que no son necesarios para la petición
            delete teacherData.isRegistered;
            
            // Si el usuario ya está registrado, no enviar contraseñas
            if (isRegistered) {
                delete teacherData.password;
                delete teacherData.confirmPassword;
            }
            
            if (this.editMode && this.teacherId) {
                this.teacherService.updateTeacher(this.teacherId, teacherData).subscribe(() => {
                    this.router.navigate(['/admin/profesores']);
                });
            } else {
                // Decidir qué método usar según si el usuario está registrado
                if (isRegistered) {
                    this.teacherService.assignTeacherRole(teacherData).subscribe(() => {
                        this.router.navigate(['/admin/profesores']);
                    });
                } else {
                    this.teacherService.createTeacher(teacherData).subscribe(() => {
                        this.router.navigate(['/admin/profesores']);
                    });
                }
            }
        }
    }

    isRegistered() {
        return this.createTeacherForm.get('isRegistered')?.value;
    }

    // Método para manejar el cambio en el checkbox "isRegistered"
    toggleRegistered(event: any): void {
        const isRegistered = event.checked;
        this.createTeacherForm.patchValue({ isRegistered: isRegistered });
        this.updatePasswordValidation(isRegistered);
    }

    goBack(): void {
        this.router.navigate(['/admin/profesores']);
    }
}
