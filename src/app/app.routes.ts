import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { CreateCourseComponent } from './shared/components/create-course/create-course.component';
import { HomeComponent } from './views/admin/home/home.component';
import { CoursesListComponent } from './views/admin/courses/courses-list/courses-list.component';
import { CourseComponent } from './shared/components/course/course.component';
import { adminGuard } from './guards/admin.guard';
import { loginGuard } from './guards/login.guards';
import { InscripcionComponent } from './shared/components/inscripcion/inscripcion.component';
import { StudentProfileComponent } from './views/student-profile/student-profile.component';
import { TeacherProfileComponent } from './views/teacher-profile/teacher-profile.component';
import { TeachersListComponent } from './views/admin/teachers/teachers-list/teachers-list.component';
import { TeacherDetailComponent } from './views/admin/teachers/teacher-detail/teacher-detail.component';
import { CreateTeacherComponent } from './views/admin/teachers/create-teacher/create-teacher.component';
import { CourseManagementComponent } from './views/course-management/course-management.component';

export const routes: Routes = [
    {
        path: 'home',
        component: LandingPageComponent
    },
    {
        path:'auth/login',
        loadComponent: () =>
          import('./views/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
    },
    {
        path:'auth/register',
        loadComponent: () =>
          import('./views/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
    },
    {
        path:'auth/reset-password',
        loadComponent: () =>
          import('./views/auth/recover-password/recover-password.component').then(
            (m) => m.RecoverPasswordComponent
          ),
    },
    {
        path:'create-course',
        loadComponent: () =>
          import('./shared/components/create-course/create-course.component').then(
            (m) => m.CreateCourseComponent
          ),
        canActivate: [adminGuard]
    },
    {
        path: 'courses',
        loadComponent: () =>
          import('./views/courses/courses-page/courses-page.component').then(
            (m) => m.CoursesPageComponent
          ),
    },
    {
        path: 'course/:id',
        loadComponent: () =>
          import('./shared/components/course/course.component').then(
            (m) => m.CourseComponent
          ),
    },
    {   path: 'inscribir/:id', 
        component: InscripcionComponent,
        canActivate: [loginGuard]
    },
    {
        path: 'course-management/:id',
        component: CourseManagementComponent,
        canActivate: [loginGuard]
    },
    {
        path: 'admin',
        loadComponent: () =>
          import('./views/admin/admin-layout/admin-layout.component').then(
            (m) => m.AdminLayoutComponent
          ),
        canActivateChild: [adminGuard],
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'cursos',
                component: CoursesListComponent
            },
            {
                path: 'cursos/crear',
                component: CreateCourseComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'cursos/editar/:id',
                component: CreateCourseComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'profesores',
                component: TeachersListComponent,
                canActivate: [loginGuard]
            },
            {
                path: 'profesores/view/:id',
                component: TeacherDetailComponent,
                canActivate: [loginGuard]
            },
            {
                path: 'profesores/new',
                component: CreateTeacherComponent,
                canActivate: [loginGuard]
            }
        ]
    },
    {
        path: 'perfil',
        component: StudentProfileComponent,
        // canActivateChild: [loginGuard],
        // canActivate: [admiGuard],      
        children: [
            {
                path: '',
                component: HomeComponent
            },
        ]
    },
    {
        path: 'profesor',
        component: TeacherProfileComponent,
        canActivate: [loginGuard]
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}