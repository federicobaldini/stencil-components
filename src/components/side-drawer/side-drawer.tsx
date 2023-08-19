import { h, Component, JSX, Prop, State } from '@stencil/core';

@Component({
  tag: 'wc-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true,
})
export class SideDrawer {
  @Prop({ reflect: true }) title: string;
  @Prop({ reflect: true, mutable: true }) open: boolean;

  @State() activeContent: 'nav' | 'contact' = 'nav';

  private closeHandler(): void {
    this.open = false;
  }

  private contectChangeHandler(content: 'nav' | 'contact'): void {
    this.activeContent = content;
  }

  public render(): JSX.Element | null {
    let mainContent: JSX.Element | null = <slot />;

    if (this.activeContent === 'contact') {
      mainContent = (
        <div id="contact-information">
          <h2>Contact Information</h2>
          <p>You can reach us via phone or email</p>
          <ul>
            <li>Phone: 49802384032</li>
            <li>
              <span>E-Mail</span>
              <a href="mailto:test@test.com">test@test.com</a>
            </li>
          </ul>
        </div>
      );
    }

    return [
      <div class={`backdrop ${this.open ? 'open' : ''}`} onClick={this.open && this.closeHandler.bind(this)}></div>,
      <aside class={`${this.open ? 'open' : ''}`}>
        <header>
          <h1>{this.title}</h1>
          <button onClick={this.closeHandler.bind(this)}>X</button>
        </header>
        <section id="tabs">
          <button class={this.activeContent === 'nav' ? 'active' : ''} onClick={this.contectChangeHandler.bind(this, 'nav')}>
            Navigation
          </button>
          <button class={this.activeContent === 'contact' ? 'active' : ''} onClick={this.contectChangeHandler.bind(this, 'contact')}>
            Contact
          </button>
        </section>
        <main>{mainContent}</main>
      </aside>,
    ];
  }
}
