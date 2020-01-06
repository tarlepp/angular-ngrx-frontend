import { Viewport } from '../../shared/enums';

export interface LayoutState {
  language?: string;
  viewport?: Viewport;
  mobile: boolean;
}
