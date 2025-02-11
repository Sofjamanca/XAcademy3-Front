import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { NgModule } from '@angular/core';
import { RecoverPasswordComponent } from './views/auth/recover-password/recover-password.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { CoursesPageComponent } from './views/courses/courses-page/courses-page.component';

export const routes: Routes = [
    {
        path: 'home',
        component:LandingPageComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'reset-password',
        component:RecoverPasswordComponent
    },
    {
        path:'courses',
        component: CoursesPageComponent
    },
    {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    // {
    //   path: '**',
    //   redirectTo: '404',
    // }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModel{}
