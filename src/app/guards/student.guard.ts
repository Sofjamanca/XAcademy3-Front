import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "../services/localstorage/local-storage.service";

export const admiGuard = ()=>{
    const router = inject(Router);
    const localStorageService = inject(LocalStorageService);
    
    const role = localStorageService.getItem('role');

    if(role === 'STUDENT'){
        return true;
    }else{
        router.navigate(['/home']);
        return false;
    }


}