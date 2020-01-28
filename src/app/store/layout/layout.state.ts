import { Device, Viewport } from '../../shared/enums';

export interface LayoutState {
  language?: string;
  viewport?: Viewport;
  device?: Device;
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
  anchor?: string;
}
