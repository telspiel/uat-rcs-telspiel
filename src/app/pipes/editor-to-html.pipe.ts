import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'editorToHtml'
})
export class EditorToHtmlPipe implements PipeTransform {

  transform(value: any, ...args: any): unknown {
    if (args[0] === 'varOccurences') {
      return this.getVariableOccurances(value);
    }
    if (args[0] === 'updateVarValue') {
      return this.updateVarValue(value, args[1]);
    }
    return this.prepareFormattedContent(value);
  }

  prepareFormattedContent(messageString: string) {
    let htmlContent = messageString
      .replace(/\*(.*?)\*/g, '<b>$1</b>') // replaces values surrounded by *
      .replace(/_(.*?)_/g, '<i>$1</i>') // replaces values surrounded by _
      .replace(/~(.*?)~/g, '<strike>$1</strike>') // replaces values surrounded by ~
      .replace(/```(.*?)```/g, '<pre>$1</pre>'); // replaces values surrounded by ```

    return htmlContent;
  }

  updateVarValue(messageString: string, varInput: any) {
    let formattedText = this.prepareFormattedContent(messageString);
    if (varInput) {
      varInput.variables.forEach(function (value: any) {
        const match = value.object.match(/\{\{(\d+)\}\}/); // get number surrounded by a one or two digit number
        const regexString = `{\\{${match[1]}}}`; // regex construct
        // input.replace(/{\{2}}/g, 'pep');
        const regex = new RegExp(regexString);
        if (value.value.length > 0) {
          formattedText = formattedText.replace(regex, value.value);
        }
      })
    }
    return formattedText;
  }

  getVariableOccurances(messageString: string) {
    // console.log(messageString)
    // if(!messageString){
    //   return [];
    // }
    // console.log(messageString)
    const regexArr = messageString.match(/{{\d{1,2}}}/g);
    return regexArr ? regexArr : [];
  }
}
