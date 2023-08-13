import { h, Component, JSX, Prop } from '@stencil/core';

@Component({
  tag: 'wc-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true,
})
export class SideDrawer {
  @Prop({ reflect: true }) title: string;
  @Prop({ reflect: true }) open: string;

  public render(): JSX.Element | null {
    if (this.open) {
      return (
        <aside>
          <header>
            <h1>{this.title}</h1>
          </header>
          <main>
            <slot></slot>
          </main>
        </aside>
      );
    }
    return null;
  }
}
