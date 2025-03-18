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
import { MisCursosComponent } from './views/student-profile/mis-cursos/mis-cursos.component';
import { PendingComponent } from './views/student-profile/pending/pending.component';
import { WeComponent } from './shared/components/we/we.component';
import { ContactComponent } from './shared/components/contact/contact.component';
import { CreditsComponent } from './shared/components/credits/credits.component';
import { CertificatesDowComponent } from './views/student-profile/certificates-dow/certificates-dow.component';


export const routes: Routes = [
    {
        path: 'home',
        component: LandingPageComponent
    },
    {
      path: 'we',
      component: WeComponent
    },
    {
      path: 'contact',
      component: ContactComponent
    },
    {
      path: 'credits',
      component: CreditsComponent
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
            }
        ]
    },
    {
      path: 'perfil',
      loadComponent: () =>
        import('./views/student-profile/student-profile.component').then(
          (m) => m.StudentProfileComponent
        ),
      // canActivateChild: [loginGuard],
      children: [
        {
          path: '',
          component: MisCursosComponent
        },
        { path: 'mis-cursos', 
          component: MisCursosComponent
        },
        { path: 'pagos',
          component: PendingComponent
        },
        {
          path: 'editar',
          loadComponent: () => import('./shared/components/edit-profile/edit-profile.component')
            .then(m => m.EditProfileComponent)
        },
        { path: 'certificates/:id',
          component: CertificatesDowComponent
        },
      ]},
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
