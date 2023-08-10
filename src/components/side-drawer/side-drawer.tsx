import { h, Component, JSX } from '@stencil/core';

@Component({
  tag: 'wc-side-drawer',
})
export class SideDrawer {
  public render(): JSX.Element {
    return (
      <div>
        <h1>The Side Drawer</h1>
      </div>
    );
  }
}
