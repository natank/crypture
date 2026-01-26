import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should have the correct title', () => {
    const { getAllByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(
      getAllByText(new RegExp('Privacy-first crypto portfolio tracking', 'gi'))
        .length > 0
    ).toBeTruthy();
  });

  it('should have the investor presentation branding', () => {
    const { getAllByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(
      getAllByText(new RegExp('Investor Presentation', 'gi')).length > 0
    ).toBeTruthy();
  });
});
