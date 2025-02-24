import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../services/api.service";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID } from "@angular/core";

export const loginGuard = () => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    const apiService = inject(ApiService);

    // Durante SSR, permitimos el acceso
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    if (apiService.getAuthToken()) {
        return true;
    } else {
        router.navigate(['/']);
        return false;
    }
}