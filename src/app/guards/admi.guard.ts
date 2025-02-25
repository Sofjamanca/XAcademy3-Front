import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { Console } from "console";
import { LocalStorageService } from "../services/localstorage/local-storage.service";


export const admiGuard = ()=>{
    const router = inject(Router);
    const localStorageService = inject(LocalStorageService);
    const role = localStorageService.getItem('role');
    console.log("role",role);

    if(role === 'ADMIN'){
        return true;
    }else{
        router.navigate(['/']);
        return false;
    }


}