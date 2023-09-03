import { h, Component, JSX, State, Prop, Watch } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'wc-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  @State() stockPrice: number;
  @State() stockSymbolInput: string;
  @State() stockSymbolIsValid: boolean;
  @State() errorMessage: string;

  @Prop({ reflect: true, mutable: true }) stockSymbol?: string;

  @Watch('stockSymbol')
  initianlStockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockSymbolInput = newValue;
      this.fetchStockPrice();
    }
  }

  private inputHandler(event: InputEvent): void {
    this.stockSymbolInput = (event.target as HTMLInputElement).value;

    if (this.stockSymbol.trim() !== '') {
      this.stockSymbolIsValid = true;
    } else {
      this.stockSymbolIsValid = false;
    }
  }

  private fetchStockPrice(): void {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.stockSymbol}&apikey=${AV_API_KEY}`)
      .then((response: Response): Promise<object> => {
        if (response.status !== 200) {
          throw new Error('Invalid Stock Symbol!');
        }

        return response.json();
      })
      .then((parsedResponse: { 'Global Quote': { '05. price': number } }): void => {
        if (!parsedResponse['Global Quote']['05. price']) {
          throw new Error('Stock Symbol not found!');
        }

        this.stockPrice = parsedResponse['Global Quote']['05. price'];
        this.errorMessage = '';
      })
      .catch((error: Error): void => {
        this.errorMessage = error.message;
      });
  }

  private submitHandler(event: SubmitEvent): void {
    event.preventDefault();
    this.stockSymbol = this.stockSymbolInput;
  }

  public componentWillLoad(): void {
    if (this.stockSymbol) {
      this.stockSymbolInput = this.stockSymbol;
      this.stockSymbolIsValid = true;
      this.fetchStockPrice();
    }
  }

  public render(): JSX.Element | null {
    return [
      <form onSubmit={this.submitHandler.bind(this)}>
        <input id="stock-symbol" value={this.stockSymbolInput} onInput={this.inputHandler.bind(this)} />
        <button type="submit" disabled={!this.stockSymbolIsValid}>
          Fetch
        </button>
      </form>,
      <div>{this.errorMessage ? <p>{this.errorMessage}</p> : <p>Price: ${this.stockPrice}</p>}</div>,
    ];
  }
}
