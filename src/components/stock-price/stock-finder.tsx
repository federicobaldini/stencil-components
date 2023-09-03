import { h, Component, JSX, State } from '@stencil/core';
import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'wc-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  @State() searchResults: Array<{ symbol: string; name: string }> = [];

  private stockNameInput: string;

  private inputHandler(event: Event): void {
    this.stockNameInput = (event.target as HTMLInputElement).value;
  }

  private fetchStockName(): void {
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${this.stockNameInput}&apikey=${AV_API_KEY}`)
      .then((response: Response): Promise<object> => {
        if (response.status !== 200) {
          throw new Error('Invalid Stock Name!');
        }

        return response.json();
      })
      .then((parsedResponse: { bestMatches: Array<{ '1. symbol': string; '2. name': string }> }): void => {
        this.searchResults = parsedResponse['bestMatches'].map(match => {
          return { symbol: match['1. symbol'], name: match['2. name'] };
        });
      })
      .catch((error: Error): void => {
        console.log(error);
      });
  }

  private submitHandler(event: SubmitEvent): void {
    event.preventDefault();
    this.fetchStockName();
  }

  public render(): JSX.Element | null {
    return [
      <form onSubmit={this.submitHandler.bind(this)}>
        <input id="stock-symbol" value={this.stockNameInput} onInput={this.inputHandler.bind(this)} />
        <button type="submit">Find</button>
      </form>,
      <ul>
        {this.searchResults.map(result => (
          <li>{result.name}</li>
        ))}
      </ul>,
    ];
  }
}
