import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByNome'
})
export class FilterByNomePipe implements PipeTransform {
  transform(lista: any[], termo: string): any[] {
    if (!termo) return lista;
    termo = termo.toLowerCase();
    return lista.filter(u => u.nome.toLowerCase().includes(termo));
  }
}
