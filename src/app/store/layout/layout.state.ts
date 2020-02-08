import {Device, Language, Viewport} from '../../shared/enums';

export interface LayoutState {
  language?: Language;
  viewport?: Viewport;
  device?: Device;
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
  anchor?: string;
}
