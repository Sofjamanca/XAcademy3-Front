import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NewsService {
    private apiUrl = 'http://localhost:3001/api/news';

    constructor(private http: HttpClient) {}

    getNews(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getNewsById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/view/${id}`);
    }

    createNews(news: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, news);
    }

    updateNews(id: number, news: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, news);
    }

    deleteNews(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    getOrderedNews(sortColumn: string, sortDirection: string, currentPage: number, pageSize: number): Observable<any> {
        let params = new HttpParams()
            .set('page', currentPage.toString())
            .set('limit', pageSize.toString());
        
        if (sortColumn) {
            params = params.set('column', sortColumn);
        }
        
        if (sortDirection) {
            params = params.set('direction', sortDirection);
        }
        
        return this.http.get<any>(`${this.apiUrl}/ordered`, { params });    
    }
}
