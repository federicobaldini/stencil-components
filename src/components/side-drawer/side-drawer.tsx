import { h, Component, JSX, Prop } from '@stencil/core';

@Component({
  tag: 'wc-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true,
})
export class SideDrawer {
  @Prop({ reflect: true }) title: string;
  @Prop({ reflect: true, mutable: true }) open: boolean;

  private closeHandler(): void {
    this.open = false;
  }

  public render(): JSX.Element | null {
    return (
      <aside class={`${this.open ? 'open' : ''}`}>
        <header>
          <h1>{this.title}</h1>
          <button onClick={this.closeHandler.bind(this)}>X</button>
        </header>
        <main>
          <slot></slot>
        </main>
      </aside>
    );
  }
}
