import { h, Component, JSX, State } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'wc-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPrice {
  private stockSymbolElement: HTMLInputElement;

  @State() stockPrice: number;

  private fetchStockPrice(stockSymbol: string): void {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
      .then((response: Response): Promise<object> => {
        return response.json();
      })
      .then((parsedResponse: { 'Global Quote': { '05. price': number } }): void => {
        this.stockPrice = parsedResponse['Global Quote']['05. price'];
        console.log(parsedResponse);
      })
      .catch((error: Error): void => {
        console.log(error);
      });
  }

  private submitHandler(event: Event): void {
    event.preventDefault();
    const stockSymbol: string = this.stockSymbolElement.value;
    this.fetchStockPrice(stockSymbol);
  }

  public render(): JSX.Element | null {
    return [
      <form onSubmit={this.submitHandler.bind(this)}>
        <input
          id="stock-symbol"
          ref={(inputElement: HTMLInputElement): void => {
            this.stockSymbolElement = inputElement;
          }}
        />
        <button type="submit">Fetch</button>
      </form>,
      <div>
        <p>Price: ${this.stockPrice}</p>
      </div>,
    ];
  }
}
