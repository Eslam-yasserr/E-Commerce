import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SerchPipe implements PipeTransform {

  transform(data:any[],text:any ): any {
    return data.filter((item) =>item.title.toLowerCase().includes(text.toLowerCase())
    );
  }
}
