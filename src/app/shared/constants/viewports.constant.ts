import { Device, Viewport } from '../enums';

export const Viewports = {
  [Device.MOBILE]: [
    Viewport.XS,
    Viewport.SM,
  ],
  [Device.TABLET]: [
    Viewport.MD,
  ],
  [Device.DESKTOP]: [
    Viewport.LG,
    Viewport.XL,
  ],
};

