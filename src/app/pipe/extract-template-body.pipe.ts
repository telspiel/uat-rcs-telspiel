import { Pipe, PipeTransform } from '@angular/core';
import { TEMPLATE_COMPONENT } from '../models/templateModel';

@Pipe({
  name: 'extractTemplateBody'
})
export class ExtractTemplateBodyPipe implements PipeTransform {

  transform(value: TEMPLATE_COMPONENT[]): unknown {
    return value.find(item => item.type === 'BODY')?.text
  }

}
