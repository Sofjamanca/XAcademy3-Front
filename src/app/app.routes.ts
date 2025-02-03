import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { AuthModalComponent } from './shared/components/auth-modal/auth-modal.component';
import { NgModule } from '@angular/core';
import { RecoverPasswordComponent } from './views/auth/recover-password/recover-password.component';

export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'recover',
        component:RecoverPasswordComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModel{}