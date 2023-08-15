import { h, Component, JSX, Prop } from '@stencil/core';

@Component({
  tag: 'wc-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true,
})
export class SideDrawer {
  @Prop({ reflect: true }) title: string;
  @Prop({ reflect: true }) open: boolean;

  public render(): JSX.Element | null {
    return (
      <aside class={`${this.open ? 'open' : ''}`}>
        <header>
          <h1>{this.title}</h1>
        </header>
        <main>
          <slot></slot>
        </main>
      </aside>
    );
  }
}
