import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { Console } from "console";

export const admiGuard = ()=>{
    const router = inject(Router);
    const role = localStorage.getItem('role');
    console.log("role",role);

    if(role === 'ADMIN'){
        return true;
    }else{
        router.navigate(['/']);
        return false;
    }


}