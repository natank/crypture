import { parsePortfolioFile } from '@services/portfolioIOService';

function fileFromText(name: string, text: string, type?: string) {
  return {
    name,
    type: type || '',
    async text() {
      return text;
    },
  } as unknown as File;
}

describe('parsePortfolioFile', () => {
  it('parses valid JSON array of assets', async () => {
    const file = fileFromText(
      'portfolio.json',
      JSON.stringify([
        { asset: 'btc', quantity: 1.5 },
        { asset: 'ETH', quantity: 2 },
      ]),
      'application/json'
    );
    const items = await parsePortfolioFile(file);
    expect(items).toEqual([
      { asset: 'btc', quantity: 1.5 },
      { asset: 'eth', quantity: 2 },
    ]);
  });

  it('throws on malformed JSON', async () => {
    const file = fileFromText('bad.json', '{ not json ', 'application/json');
    await expect(parsePortfolioFile(file)).rejects.toThrow(/Invalid JSON file/);
  });

  it('throws on invalid JSON schema', async () => {
    const file = fileFromText(
      'portfolio.json',
      JSON.stringify([{ asset: 'btc' }]),
      'application/json'
    );
    await expect(parsePortfolioFile(file)).rejects.toThrow(
      /Invalid portfolio JSON schema/
    );
  });

  it('parses valid CSV with headers and quoted values', async () => {
    const csv = ['Asset,Quantity', 'BTC,"1,234.56"', 'ETH,"2"'].join('\n');
    const file = fileFromText('portfolio.csv', csv, 'text/csv');
    const items = await parsePortfolioFile(file);
    expect(items).toEqual([
      { asset: 'btc', quantity: 1234.56 },
      { asset: 'eth', quantity: 2 },
    ]);
  });

  it('throws on CSV with missing required headers', async () => {
    const csv = ['Symbol,Qty', 'BTC,1'].join('\n');
    const file = fileFromText('portfolio.csv', csv, 'text/csv');
    await expect(parsePortfolioFile(file)).rejects.toThrow(
      /CSV header must include Asset and Quantity/
    );
  });

  it('throws on empty CSV (missing required headers)', async () => {
    const file = fileFromText('portfolio.csv', '', 'text/csv');
    await expect(parsePortfolioFile(file)).rejects.toThrow(
      /CSV header must include Asset and Quantity/
    );
  });

  it('infers format when extension missing', async () => {
    const file = fileFromText('data', '[ {"asset": "btc", "quantity": 1 } ]');
    const items = await parsePortfolioFile(file);
    expect(items).toEqual([{ asset: 'btc', quantity: 1 }]);
  });

  it('treats unknown text as CSV and throws on missing headers', async () => {
    const file = fileFromText('data.bin', 'garbage');
    await expect(parsePortfolioFile(file)).rejects.toThrow(
      /CSV header must include Asset and Quantity/
    );
  });
});
