import { ComponentBody } from "./component-body";
import { ComponentButton } from "./component-button";
import { ComponentFooter } from "./component-footer";
import { ComponentHeader } from "./component-header";

export interface ConvertedObject {
  name: string;
  category: string;
  components: (ComponentBody | ComponentHeader | ComponentFooter | ComponentButton)[];
  language: string;
}
