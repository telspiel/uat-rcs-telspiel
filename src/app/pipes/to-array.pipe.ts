import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toArray'
})
export class ToArrayPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): any {
    let res = [];
    for (let i = 0; i < value; i++) {
      res.push("Button" + i);
    }
    return res;
  }

}
