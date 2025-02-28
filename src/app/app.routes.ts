import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { NgModule } from '@angular/core';
import { RecoverPasswordComponent } from './views/auth/recover-password/recover-password.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { CreateCourseComponent } from './shared/components/create-course/create-course.component';
import { CoursesPageComponent } from './views/courses/courses-page/courses-page.component';
import { loginGuard } from './guards/login.guards';
import { admiGuard } from './guards/admi.guard';
import { AdminLayoutComponent } from './views/admin/admin-layout/admin-layout.component';
import { HomeComponent } from './views/admin/home/home.component';
import { CoursesListComponent } from './views/admin/courses/courses-list/courses-list.component';
import { CourseComponent } from './shared/components/course/course.component';


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
        canActivateChild: [loginGuard],
        canActivate: [admiGuard]
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
    {
        path: 'admin',
        loadComponent: () =>
          import('./views/admin/admin-layout/admin-layout.component').then(
            (m) => m.AdminLayoutComponent
          ),
        canActivateChild: [loginGuard],
        canActivate: [admiGuard],
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
                canActivate: [admiGuard]
            },
            {
                path: 'cursos/editar/:id',
                component: CreateCourseComponent,
                canActivate: [admiGuard]
            }
        ]
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
