import { Component, Injectable, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Por página';
  override nextPageLabel = 'Siguiente';
  override previousPageLabel = 'Anterior';
  override firstPageLabel = 'Primera página';
  override lastPageLabel = 'Última página';
  override changes = new Subject<void>();

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0) {
      return 'Página 1 de 1';
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Página ${page + 1} de ${amountPages}`;
  };
}

@Component({
  selector: 'shared-pagination',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: CustomPaginatorIntl}
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit {
  @Input() length: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() hidePageSize: boolean = false;
  @Output() page = new EventEmitter<any>();

  isMobile: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  onPageChange(event: any) {
    this.page.emit(event);
  }
}
