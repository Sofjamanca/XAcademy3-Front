import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../../../services/news/news.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { LocalStorageService } from '../../../../services/localstorage/local-storage.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../../services/api.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatOptionModule,
    MatSnackBarModule
  ],
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {
  articleForm!: FormGroup;
  articleId!: number;
  isLoading = true;
  isSubmitting = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  currentImageUrl: string | null = null;
  uploadProgress: number = 0;
  userId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private localStorageService: LocalStorageService,
    private snackBar: MatSnackBar,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getUserId();
    this.loadArticle();
  }

  getUserId(): void {
    // Intenta obtener el ID del usuario del token
    const token = this.localStorageService.getItem('token');
    if (token) {
      try {
        // Decodificar el token para obtener el payload
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload && payload.id) {
            this.userId = payload.id;
            console.log('ID del usuario extraído del token:', this.userId);
            return;
          }
        }
        throw new Error('Formato de token inválido');
      } catch (e) {
        console.error('Error al decodificar el token:', e);
        this.getUserIdFromApi();
      }
    } else {
      console.error('No se encontró token de autenticación');
      this.getUserIdFromApi();
    }
  }

  getUserIdFromApi(): void {
    this.apiService.getMe().subscribe({
      next: (data) => {
        if (data && data.user_id) {
          this.userId = data.user_id;
          console.log('ID del usuario obtenido de la API:', this.userId);
        } else {
          console.error('No se pudo obtener el ID del usuario desde la API');
          this.showError('No se pudo obtener tu ID de usuario');
        }
      },
      error: (error) => {
        console.error('Error al obtener datos del usuario:', error);
        this.showError('Error al obtener datos del usuario');
      }
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  initForm(): void {
    this.articleForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      image: ['']
    });
  }

  loadArticle(): void {
    this.isLoading = true;
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.articleId = +id;
          return this.newsService.getNewsById(+id);
        }
        return of(null);
      })
    ).subscribe({
      next: (article) => {
        if (article) {
          this.articleForm.patchValue({
            title: article.title,
            description: article.description,
            image: article.image_url || ''
          });
          
          if (article.image) {
            this.currentImageUrl = article.image;
            this.imagePreview = article.image;
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando artículo:', error);
        this.isLoading = false;
        this.showError('Error al cargar el artículo. Por favor, inténtalo de nuevo.');
        this.router.navigate(['/admin/noticias']);
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.currentImageUrl = null;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.currentImageUrl = null;
    this.articleForm.get('image_url')?.setValue('');
  }

  uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `uploads/articles/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progreso: ${this.uploadProgress}%`);
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log('Imagen subida exitosamente:', downloadURL);
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error('Error al obtener la URL de descarga:', error);
              reject(error);
            });
        }
      );
    });
  }

  onSubmit(): void {
    if (this.articleForm.invalid) {
      return;
    }

    if (!this.userId) {
      this.showError('No se pudo obtener tu ID de usuario. Por favor, inténtalo de nuevo.');
      return;
    }

    this.isSubmitting = true;
    
    const saveArticle = (imageUrl?: string) => {
      const articleData = {
        title: this.articleForm.get('title')?.value,
        description: this.articleForm.get('description')?.value,
        image: imageUrl || this.currentImageUrl || '',
        user_id: this.userId
      };

      this.newsService.updateNews(this.articleId, articleData).subscribe({
        next: () => {
          this.router.navigate(['/admin/noticias']);
        },
        error: (error) => {
          console.error('Error al actualizar el artículo:', error);
          this.isSubmitting = false;
          this.showError('Error al actualizar el artículo. Por favor, inténtalo de nuevo.');
        }
      });
    };

    if (this.selectedFile) {
      this.uploadImage(this.selectedFile)
        .then((imageUrl) => {
          saveArticle(imageUrl);
        })
        .catch((error) => {
          console.error('Error al subir la imagen:', error);
          this.isSubmitting = false;
          this.showError('Error al subir la imagen. Por favor, inténtalo de nuevo.');
        });
    } else {
      saveArticle();
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/noticias']);
  }
}
