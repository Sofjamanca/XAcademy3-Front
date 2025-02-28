import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { NgModule } from '@angular/core';
import { RecoverPasswordComponent } from './views/auth/recover-password/recover-password.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { CreateCourseComponent } from './shared/components/create-course/create-course.component';
import { CoursesPageComponent } from './views/courses/courses-page/courses-page.component';
import { loginGuard } from './guards/login.guards';
import { AdminLayoutComponent } from './views/admin/admin-layout/admin-layout.component';
import { HomeComponent } from './views/admin/home/home.component';
import { CoursesListComponent } from './views/admin/courses/courses-list/courses-list.component';
import { CourseComponent } from './shared/components/course/course.component';
import { adminGuard } from './guards/admin.guard';


export const routes: Routes = [
    {
        path: 'home',
        component: LandingPageComponent
    },
    {
        path:'auth/login',
        component:LoginComponent
    },
    {
        path:'auth/register',
        component:RegisterComponent
    },
    {
        path:'auth/reset-password',
        component:RecoverPasswordComponent
    },
    {
        path:'create-course',
        component:CreateCourseComponent,
        canActivate: [adminGuard]       
    },
    {
        path: 'courses',
        component: CoursesPageComponent
    },
    { 
        path: 'course/:id', 
      component: CourseComponent 
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
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
export class AppRoutingModel {}
