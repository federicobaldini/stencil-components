import { h, Component, JSX, State, Prop } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'wc-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  @State() stockPrice: number;
  @State() stockSymbol: string;
  @State() stockSymbolValid: boolean;
  @State() errorMessage: string;

  @Prop() initialStockSymbol?: string;

  private inputHandler(event: Event): void {
    this.stockSymbol = (event.target as HTMLInputElement).value;

    if (this.stockSymbol.trim() !== '') {
      this.stockSymbolValid = true;
    } else {
      this.stockSymbolValid = false;
    }
  }

  private fetchStockPrice(stockSymbol: string): void {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
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

  private submitHandler(event: Event): void {
    event.preventDefault();
    this.fetchStockPrice(this.stockSymbol);
  }

  public componentDidLoad() {
    if (this.initialStockSymbol) {
      this.fetchStockPrice(this.initialStockSymbol);
    }
  }

  public render(): JSX.Element | null {
    return [
      <form onSubmit={this.submitHandler.bind(this)}>
        <input id="stock-symbol" value={this.stockSymbol} onInput={this.inputHandler.bind(this)} />
        <button type="submit" disabled={!this.stockSymbolValid}>
          Fetch
        </button>
      </form>,
      <div>{this.errorMessage ? <p>{this.errorMessage}</p> : <p>Price: ${this.stockPrice}</p>}</div>,
    ];
  }
}
