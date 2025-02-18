import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const admiGuard = ()=>{
    const router = inject(Router);
    const role = localStorage.getItem('role');
    console.log("role",role);

    if(role === 'STUDENT'){
        return true;
    }else{
        router.navigate(['/']);
        return false;
    }


}