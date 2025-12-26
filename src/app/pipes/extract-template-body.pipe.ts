import { Pipe, PipeTransform } from '@angular/core';
import { TEMPLATE_COMPONENT } from '../models/templateModel';

@Pipe({
  name: 'extractTemplateBody'
})
export class ExtractTemplateBodyPipe implements PipeTransform {

  transform(value: TEMPLATE_COMPONENT[]): string {
    return value ? value.find(item => item.type.toLowerCase() === 'body')?.text || '' : '';
  }

}
