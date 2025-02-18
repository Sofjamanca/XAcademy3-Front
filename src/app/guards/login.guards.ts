import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { Console } from "console";

export const loginGuard = ()=>{
    const router = inject(Router);
    
    if(localStorage.getItem('token')){
        return true;
    }else{
        router.navigate(['/']);
        return false;
    }


}