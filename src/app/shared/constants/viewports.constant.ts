import { Device, Viewport } from 'src/app/shared/enums';

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
