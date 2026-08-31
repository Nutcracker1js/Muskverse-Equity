let scrollLockCount = 0;

function lockScroll() {
  scrollLockCount += 1;
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) document.body.style.overflow = '';
}

const AVATAR_KEY = 'Muskverse-avatar-url';

function applyAvatarEverywhere(dataUrl) {
  document.querySelectorAll('.dash-avatar, .dash-user-avatar').forEach((el) => {
    let img = el.querySelector('img.dash-avatar-img');
    const svg = el.querySelector('svg');
    if (dataUrl) {
      if (!img) {
        img = document.createElement('img');
        img.className = 'dash-avatar-img';
        img.alt = 'Profile picture';
        el.appendChild(img);
      }
      img.src = dataUrl;
      if (svg) svg.style.display = 'none';
    } else {
      img?.remove();
      if (svg) svg.style.display = '';
    }
  });
}

applyAvatarEverywhere(localStorage.getItem(AVATAR_KEY));

const menuToggle = document.querySelector('.dash-menu-toggle');
const sidebar = document.querySelector('.dash-sidebar');
const sidebarBackdrop = document.querySelector('.dash-sidebar-backdrop');
const sidebarClose = document.querySelector('.dash-sidebar-close');

if (menuToggle && sidebar && sidebarBackdrop) {
  const openSidebar = () => {
    sidebar.classList.add('is-open');
    sidebarBackdrop.classList.add('is-open');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    lockScroll();
  };

  const closeSidebar = () => {
    if (!sidebar.classList.contains('is-open')) return;
    sidebar.classList.remove('is-open');
    sidebarBackdrop.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    unlockScroll();
  };

  menuToggle.addEventListener('click', () => {
    if (sidebar.classList.contains('is-open')) closeSidebar();
    else openSidebar();
  });
  sidebarBackdrop.addEventListener('click', closeSidebar);
  sidebarClose?.addEventListener('click', closeSidebar);
  sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeSidebar));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSidebar();
  });
}

const animatedFills = document.querySelectorAll('.dash-progress-fill[data-width]');
if (animatedFills.length) {
  requestAnimationFrame(() => {
    setTimeout(() => {
      animatedFills.forEach((fill) => {
        fill.style.width = fill.dataset.width;
      });
    }, 150);
  });
}

document.querySelectorAll('.dash-progress-row.is-clickable[data-href]').forEach((row) => {
  const go = () => {
    window.location.href = row.dataset.href;
  };
  row.addEventListener('click', go);
  row.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      go();
    }
  });
});

const greetingIcon = document.querySelector('#dash-greeting-icon');

if (greetingIcon) {
  const hour = new Date().getHours();
  const periods = {
    morning: {
      test: hour >= 5 && hour < 12,
      icon: '<path d="M12 2v7"></path><path d="m4.22 10.22 1.42 1.42"></path><path d="M1 18h2"></path><path d="M21 18h2"></path><path d="m18.36 11.64 1.42-1.42"></path><path d="M23 22H1"></path><path d="m16 5-4 4-4-4"></path><path d="M16 18a4 4 0 0 0-8 0"></path>',
    },
    afternoon: {
      test: hour >= 12 && hour < 17,
      icon: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>',
    },
    evening: {
      test: hour >= 17 && hour < 21,
      icon: '<path d="M12 10V2"></path><path d="m4.22 10.22 1.42 1.42"></path><path d="M1 18h2"></path><path d="M21 18h2"></path><path d="m18.36 11.64 1.42-1.42"></path><path d="M23 22H1"></path><path d="m16 6-4-4-4 4"></path><path d="M16 18a4 4 0 0 0-8 0"></path>',
    },
    night: {
      test: hour >= 21 || hour < 5,
      icon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>',
    },
  };
  const period = Object.keys(periods).find((key) => periods[key].test) || 'afternoon';
  greetingIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${periods[period].icon}</svg>`;
  greetingIcon.classList.add(`is-${period}`);
}

const tickerContainer = document.querySelector('#dash-ticker');
const symbolContainer = document.querySelector('#dash-symbol-widget');
const marketOverviewContainer = document.querySelector('#market-overview-widget');
const marketHotlistContainer = document.querySelector('#market-hotlist-widget');
const marketCalendarContainer = document.querySelector('#market-calendar-widget');
const marketEthContainer = document.querySelector('#market-eth-widget');
const advancedChartContainer = document.querySelector('#trading-chart-widget');
const hasTradingViewWidgets = Boolean(
  tickerContainer || symbolContainer || marketOverviewContainer || marketHotlistContainer || marketCalendarContainer || marketEthContainer || advancedChartContainer
);

const STRATEGY_ASSETS = {
  'Automated Portfolios': [
    { symbol: 'CONSV', name: 'Conservative Portfolio', price: 100, tv: 'AMEX:AOK' },
    { symbol: 'BALNC', name: 'Balanced Portfolio', price: 100, tv: 'AMEX:AOM' },
    { symbol: 'AGGR', name: 'Aggressive Portfolio', price: 100, tv: 'AMEX:AOA' },
  ],
  Stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 319.7, tv: 'NASDAQ:AAPL' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 428.15, tv: 'NASDAQ:MSFT' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 248.9, tv: 'NASDAQ:TSLA' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: 231.45, tv: 'NASDAQ:AMZN' },
  ],
  ETFs: [
    { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', price: 512.3, tv: 'AMEX:VOO' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 486.2, tv: 'NASDAQ:QQQ' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', price: 268.9, tv: 'AMEX:VTI' },
  ],
  Cryptocurrency: [
    { symbol: 'BTC', name: 'Bitcoin', price: 77686.0, tv: 'BITSTAMP:BTCUSD' },
    { symbol: 'ETH', name: 'Ethereum', price: 2436.1, tv: 'BITSTAMP:ETHUSD' },
    { symbol: 'SOL', name: 'Solana', price: 178.4, tv: 'COINBASE:SOLUSD' },
  ],
  Bonds: [
    { symbol: 'UST10Y', name: 'US Treasury 10-Year Note', price: 100, tv: 'TVC:US10Y' },
    { symbol: 'CORP', name: 'Investment-Grade Corporate Bond Fund', price: 50, tv: 'AMEX:LQD' },
    { symbol: 'MUNI', name: 'Municipal Bond Fund', price: 25, tv: 'AMEX:MUB' },
  ],
};

const ASSET_LOOKUP = Object.values(STRATEGY_ASSETS)
  .flat()
  .reduce((map, asset) => {
    map[asset.symbol] = asset;
    return map;
  }, {});

const presetSymbol = new URLSearchParams(window.location.search).get('symbol');
const presetAsset = presetSymbol ? ASSET_LOOKUP[presetSymbol] : null;
const activeChartSymbol = presetAsset?.tv || 'NASDAQ:AAPL';

function loadTradingViewWidget(container, src, config) {
  if (!container) return;
  container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  script.async = true;
  script.innerHTML = JSON.stringify(config);
  container.appendChild(script);
}

function refreshTradingViewWidgets(theme) {
  loadTradingViewWidget(tickerContainer, 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js', {
    symbols: [
      { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
      { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
      { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
      { proName: 'NASDAQ:AAPL', title: 'Apple' },
      { proName: 'NASDAQ:AMZN', title: 'Amazon' },
      { proName: 'FX:GBPUSD', title: 'GBP/USD' },
    ],
    showSymbolLogo: true,
    colorTheme: theme,
    isTransparent: false,
    displayMode: 'adaptive',
    locale: 'en',
  });

  loadTradingViewWidget(symbolContainer, 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js', {
    symbols: [
      ['Apple', 'NASDAQ:AAPL|1D'],
      ['Google', 'NASDAQ:GOOGL|1D'],
      ['Microsoft', 'NASDAQ:MSFT|1D'],
      ['XAUUSD', 'OANDA:XAUUSD|1D'],
      ['BTCUSDT', 'BINANCE:BTCUSDT|1D'],
      ['GBPUSD', 'FX:GBPUSD|1D'],
      ['BTCUSD', 'BITSTAMP:BTCUSD|1D'],
      ['AMZN', 'NASDAQ:AMZN|1D'],
    ],
    chartOnly: false,
    width: '100%',
    height: 460,
    locale: 'en',
    colorTheme: theme,
    autosize: true,
    showVolume: false,
    showMA: false,
    hideDateRanges: false,
    hideMarketStatus: false,
    hideSymbolLogo: false,
    scalePosition: 'right',
    scaleMode: 'Normal',
    fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
    noTimeScale: false,
    valuesTracking: '1',
    changeMode: 'price-and-percent',
    chartType: 'area',
    maLineColor: '#2962FF',
    maLineWidth: 1,
    maLength: 9,
  });

  loadTradingViewWidget(marketOverviewContainer, 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js', {
    colorTheme: theme,
    dateRange: '12M',
    showChart: true,
    locale: 'en',
    width: '100%',
    height: 500,
    isTransparent: false,
    showSymbolLogo: true,
    showFloatingTooltip: false,
    tabs: [
      {
        title: 'Indices',
        symbols: [
          { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
          { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
          { s: 'FOREXCOM:DJI', d: 'Dow 30' },
        ],
      },
      {
        title: 'Stocks',
        symbols: [
          { s: 'NASDAQ:AAPL' },
          { s: 'NASDAQ:MSFT' },
          { s: 'NASDAQ:AMZN' },
          { s: 'NASDAQ:TSLA' },
        ],
      },
      {
        title: 'Crypto',
        symbols: [
          { s: 'BITSTAMP:BTCUSD' },
          { s: 'BITSTAMP:ETHUSD' },
          { s: 'BINANCE:SOLUSDT' },
        ],
      },
      {
        title: 'Forex',
        symbols: [
          { s: 'FX:EURUSD' },
          { s: 'FX:GBPUSD' },
          { s: 'FX:USDJPY' },
        ],
      },
    ],
  });

  loadTradingViewWidget(marketHotlistContainer, 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js', {
    colorTheme: theme,
    dateRange: '12M',
    exchange: 'US',
    showChart: true,
    locale: 'en',
    width: '100%',
    height: 425,
    isTransparent: false,
    showSymbolLogo: true,
    showFloatingTooltip: false,
  });

  loadTradingViewWidget(marketCalendarContainer, 'https://s3.tradingview.com/external-embedding/embed-widget-events.js', {
    colorTheme: theme,
    isTransparent: false,
    width: '100%',
    height: 450,
    locale: 'en',
    importanceFilter: '-1,0,1',
    countryFilter: 'us,eu,gb,jp,cn',
  });

  loadTradingViewWidget(marketEthContainer, 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js', {
    symbols: [['Ethereum', 'BITSTAMP:ETHUSD|1D']],
    chartOnly: false,
    width: '100%',
    height: 300,
    locale: 'en',
    colorTheme: theme,
    autosize: true,
    showVolume: true,
    showMA: false,
    hideDateRanges: false,
    hideMarketStatus: false,
    hideSymbolLogo: false,
    scalePosition: 'right',
    scaleMode: 'Normal',
    fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
    noTimeScale: false,
    valuesTracking: '1',
    changeMode: 'price-and-percent',
    chartType: 'area',
  });

  loadTradingViewWidget(advancedChartContainer, 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js', {
    autosize: true,
    symbol: activeChartSymbol,
    interval: 'D',
    timezone: 'Etc/UTC',
    theme,
    style: '1',
    locale: 'en',
    withdateranges: true,
    allow_symbol_change: true,
    calendar: false,
    support_host: 'https://www.tradingview.com',
  });
}

if (tickerContainer) {
  document.body.classList.add('dash-page--with-ticker');
  const updateTickerHeight = () => {
    document.documentElement.style.setProperty('--dash-ticker-h', `${tickerContainer.offsetHeight}px`);
  };
  updateTickerHeight();
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateTickerHeight).observe(tickerContainer);
  } else {
    window.addEventListener('load', updateTickerHeight);
  }
}

const moversTbody = document.querySelector('#movers-tbody');
const moversButtons = document.querySelectorAll('[data-movers]');

if (moversTbody && moversButtons.length) {
  const MOVERS = {
    gainers: [
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$186.42', change: '+4.82%' },
      { symbol: 'SOL', name: 'Solana', price: '$178.40', change: '+6.15%' },
      { symbol: 'PLTR', name: 'Palantir Technologies', price: '$92.15', change: '+3.97%' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: '$214.88', change: '+3.42%' },
      { symbol: 'COIN', name: 'Coinbase Global', price: '$298.60', change: '+2.91%' },
    ],
    losers: [
      { symbol: 'INTC', name: 'Intel Corp.', price: '$31.20', change: '-3.65%' },
      { symbol: 'DOGE', name: 'Dogecoin', price: '$0.142', change: '-5.28%' },
      { symbol: 'BA', name: 'Boeing Co.', price: '$178.35', change: '-2.74%' },
      { symbol: 'SNAP', name: 'Snap Inc.', price: '$9.86', change: '-4.10%' },
      { symbol: 'RIVN', name: 'Rivian Automotive', price: '$11.42', change: '-3.08%' },
    ],
  };

  const renderMovers = (key) => {
    moversTbody.innerHTML = MOVERS[key]
      .map(
        (row) => `
          <tr>
            <td>${row.symbol}</td>
            <td>${row.name}</td>
            <td class="is-numeric">${row.price}</td>
            <td class="is-numeric ${key === 'gainers' ? 'is-gain' : 'is-loss'}">${row.change}</td>
          </tr>
        `
      )
      .join('');
  };

  renderMovers('gainers');

  moversButtons.forEach((button) => {
    button.addEventListener('click', () => {
      moversButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
      renderMovers(button.dataset.movers);
    });
  });
}

const snapshotBtcValue = document.querySelector('#snapshot-btc-value');

if (snapshotBtcValue) {
  const UP_ICON = '<path d="M3 17 9 11l4 4 8-8"></path><path d="M15 7h6v6"></path>';
  const DOWN_ICON = '<path d="M3 7 9 13l4-4 8 8"></path><path d="M15 17h6v-6"></path>';

  const applySnapshotCard = (valueEl, changeEl, iconEl, priceText, pct) => {
    valueEl.textContent = priceText;
    changeEl.textContent = `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
    changeEl.className = `dash-change ${pct >= 0 ? 'is-gain' : 'is-loss'}`;
    iconEl.className = `dash-stat-icon ${pct >= 0 ? 'is-green' : 'is-red'}`;
    iconEl.querySelector('svg').innerHTML = pct >= 0 ? UP_ICON : DOWN_ICON;
  };

  const btcValueEl = snapshotBtcValue;
  const btcChangeEl = document.querySelector('#snapshot-btc-change');
  const btcIconEl = document.querySelector('#snapshot-btc-icon');
  const ethValueEl = document.querySelector('#snapshot-eth-value');
  const ethChangeEl = document.querySelector('#snapshot-eth-change');
  const ethIconEl = document.querySelector('#snapshot-eth-icon');

  const fetchLivePrices = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
      if (!response.ok) return;
      const data = await response.json();

      const btcPrice = data?.bitcoin?.usd;
      const btcPct = data?.bitcoin?.usd_24h_change;
      if (typeof btcPrice === 'number' && typeof btcPct === 'number') {
        applySnapshotCard(btcValueEl, btcChangeEl, btcIconEl, `$${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, btcPct);
      }

      const ethPrice = data?.ethereum?.usd;
      const ethPct = data?.ethereum?.usd_24h_change;
      if (ethValueEl && typeof ethPrice === 'number' && typeof ethPct === 'number') {
        applySnapshotCard(ethValueEl, ethChangeEl, ethIconEl, `$${ethPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, ethPct);
      }
    } catch (error) {
      // Offline or the API is unreachable — keep showing the last known prices.
    }
  };

  fetchLivePrices();
  setInterval(fetchLivePrices, 30000);
}

const dashThemeToggle = document.querySelector('.dash-theme-toggle');

if (dashThemeToggle) {
  const setDashTheme = (isLight) => {
    const theme = isLight ? 'light' : 'dark';
    document.body.dataset.dashTheme = theme;
    dashThemeToggle.setAttribute('aria-pressed', String(!isLight));
    dashThemeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    localStorage.setItem('Muskverse-dash-theme', theme);
    if (hasTradingViewWidgets) refreshTradingViewWidgets(theme);
  };

  setDashTheme(localStorage.getItem('Muskverse-dash-theme') === 'light');
  dashThemeToggle.addEventListener('click', () => {
    setDashTheme(document.body.dataset.dashTheme !== 'light');
  });
} else if (hasTradingViewWidgets) {
  refreshTradingViewWidgets('dark');
}

const kycTrigger = document.querySelector('#kyc-trigger');
const kycOverlay = document.querySelector('#kyc-modal-overlay');

if (kycTrigger && kycOverlay) {
  const kycClose = document.querySelector('#kyc-modal-close');
  const kycUploadInput = document.querySelector('#kyc-upload-input');
  const kycUploadFilename = document.querySelector('#kyc-upload-filename');
  const kycSubmit = document.querySelector('#kyc-submit');
  const kycNote = document.querySelector('#kyc-modal-note');

  const openKycModal = () => {
    kycOverlay.classList.add('is-open');
    lockScroll();
  };

  const closeKycModal = () => {
    kycOverlay.classList.remove('is-open');
    unlockScroll();
  };

  kycTrigger.addEventListener('click', openKycModal);
  kycClose?.addEventListener('click', closeKycModal);
  kycOverlay.addEventListener('click', (event) => {
    if (event.target === kycOverlay) closeKycModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && kycOverlay.classList.contains('is-open')) closeKycModal();
  });

  kycUploadInput?.addEventListener('change', () => {
    const file = kycUploadInput.files?.[0];
    if (file && kycUploadFilename) {
      kycUploadFilename.textContent = file.name;
      kycUploadFilename.hidden = false;
    }
    if (kycNote) kycNote.textContent = '';
  });

  kycSubmit?.addEventListener('click', () => {
    if (!kycNote) return;
    if (!kycUploadInput?.files?.length) {
      kycNote.textContent = 'Please upload a document first.';
      kycNote.style.color = 'var(--dash-red)';
      return;
    }
    kycNote.textContent = "Thanks — your document is under review. We'll notify you once verified.";
    kycNote.style.color = '';
  });
}

const holdingModalOverlay = document.querySelector('#holding-modal-overlay');
const holdingsTbody = document.querySelector('#holdings-tbody');

if (holdingModalOverlay && holdingsTbody) {
  const holdingClose = document.querySelector('#holding-modal-close');
  const holdingIcon = document.querySelector('#holding-modal-icon');
  const holdingValue = document.querySelector('#holding-modal-value');
  const holdingHeading = document.querySelector('#holding-modal-heading');
  const holdingGain = document.querySelector('#holding-modal-gain');
  const holdingShares = document.querySelector('#holding-modal-shares');
  const holdingAvg = document.querySelector('#holding-modal-avg');
  const holdingPrice = document.querySelector('#holding-modal-price');
  const holdingGainAmt = document.querySelector('#holding-modal-gain-amt');
  const holdingTrade = document.querySelector('#holding-modal-trade');

  const openHoldingModal = (row) => {
    holdingIcon.textContent = row.dataset.icon;
    holdingValue.textContent = row.dataset.value;
    holdingHeading.textContent = `${row.dataset.symbol} · ${row.dataset.name}`;
    holdingGain.textContent = row.dataset.gainPct;
    holdingShares.textContent = row.dataset.shares;
    holdingAvg.textContent = row.dataset.avg;
    holdingPrice.textContent = row.dataset.price;
    holdingGainAmt.textContent = row.dataset.gainAmt;
    if (holdingTrade) holdingTrade.href = `trading.html?symbol=${encodeURIComponent(row.dataset.symbol)}`;

    holdingModalOverlay.classList.add('is-open');
    lockScroll();
  };

  const closeHoldingModal = () => {
    holdingModalOverlay.classList.remove('is-open');
    unlockScroll();
  };

  // Event delegation so rows added dynamically (after investing) work too.
  holdingsTbody.addEventListener('click', (event) => {
    const row = event.target.closest('tr');
    if (row) openHoldingModal(row);
  });
  holdingsTbody.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const row = event.target.closest('tr');
    if (row) {
      event.preventDefault();
      openHoldingModal(row);
    }
  });

  holdingClose?.addEventListener('click', closeHoldingModal);
  holdingModalOverlay.addEventListener('click', (event) => {
    if (event.target === holdingModalOverlay) closeHoldingModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && holdingModalOverlay.classList.contains('is-open')) closeHoldingModal();
  });
}

const investModalOverlay = document.querySelector('#invest-modal-overlay');
const investButtons = document.querySelectorAll('.dash-invest-now');

if (investModalOverlay && investButtons.length) {
  const investClose = document.querySelector('#invest-modal-close');
  const investStrategyEl = document.querySelector('#invest-modal-strategy');
  const investDescEl = document.querySelector('#invest-modal-desc');
  const investAssetSelect = document.querySelector('#invest-asset');
  const investAmountInput = document.querySelector('#invest-amount');
  const investForm = document.querySelector('#invest-form');
  const investNote = document.querySelector('#invest-modal-note');
  const investPresets = document.querySelectorAll('.dash-invest-preset');

  const statPortfolioValue = document.querySelector('#stat-portfolio-value');
  const statTotalGain = document.querySelector('#stat-total-gain');
  const statTotalGainLabel = document.querySelector('#stat-total-gain-label');
  const statHoldingsCount = document.querySelector('#stat-holdings-count');

  const iconFor = (symbol) => {
    if (symbol === 'BTC') return '₿';
    if (symbol === 'ETH') return 'Ξ';
    return symbol.slice(0, 2).toUpperCase();
  };

  const formatUSD = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const parseUSD = (text) => parseFloat(String(text).replace(/[^0-9.-]/g, ''));

  const recalculatePortfolioStats = () => {
    if (!holdingsTbody) return;
    const rows = [...holdingsTbody.querySelectorAll('tr')];
    let totalValue = 0;
    let totalCost = 0;
    rows.forEach((row) => {
      const shares = parseFloat(row.dataset.shares);
      const avg = parseUSD(row.dataset.avg);
      const price = parseUSD(row.dataset.price);
      totalValue += shares * price;
      totalCost += shares * avg;
    });
    const totalGain = totalValue - totalCost;
    const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

    if (statPortfolioValue) statPortfolioValue.textContent = formatUSD(totalValue);
    if (statTotalGain) {
      statTotalGain.textContent = `${totalGain >= 0 ? '+' : '-'}${formatUSD(Math.abs(totalGain))}`;
    }
    if (statTotalGainLabel) {
      statTotalGainLabel.textContent = `Total Gain (${totalGain >= 0 ? '+' : '-'}${Math.abs(totalGainPct).toFixed(1)}%)`;
    }
    if (statHoldingsCount) statHoldingsCount.textContent = String(rows.length);
  };

  const openInvestModal = (button) => {
    const strategy = button.dataset.strategy;
    investStrategyEl.textContent = strategy;
    investDescEl.textContent = button.dataset.desc;
    investAmountInput.value = '';
    investNote.textContent = '';
    investPresets.forEach((preset) => preset.classList.remove('is-active'));

    const options = STRATEGY_ASSETS[strategy] || [];
    investAssetSelect.innerHTML = options
      .map(
        (asset, index) =>
          `<option value="${index}" data-symbol="${asset.symbol}" data-name="${asset.name}" data-price="${asset.price}">${asset.symbol} · ${asset.name}</option>`
      )
      .join('');

    investModalOverlay.classList.add('is-open');
    lockScroll();
    investAmountInput.focus();
  };

  const closeInvestModal = () => {
    investModalOverlay.classList.remove('is-open');
    unlockScroll();
  };

  investButtons.forEach((button) => {
    button.addEventListener('click', () => openInvestModal(button));
  });

  investClose?.addEventListener('click', closeInvestModal);
  investModalOverlay.addEventListener('click', (event) => {
    if (event.target === investModalOverlay) closeInvestModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && investModalOverlay.classList.contains('is-open')) closeInvestModal();
  });

  investPresets.forEach((button) => {
    button.addEventListener('click', () => {
      investAmountInput.value = button.dataset.amount;
      investPresets.forEach((btn) => btn.classList.toggle('is-active', btn === button));
    });
  });

  investForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = parseFloat(investAmountInput.value || '0');
    if (!amount || amount <= 0) {
      investNote.textContent = 'Enter an amount to continue.';
      investNote.style.color = 'var(--dash-red)';
      return;
    }

    const selected = investAssetSelect.selectedOptions[0];
    const symbol = selected.dataset.symbol;
    const name = selected.dataset.name;
    const price = parseFloat(selected.dataset.price);
    const newShares = amount / price;
    const amountDisplay = formatUSD(amount);

    if (holdingsTbody) {
      const existingRow = [...holdingsTbody.querySelectorAll('tr')].find((row) => row.dataset.symbol === symbol);

      if (existingRow) {
        // Already hold this asset: merge into the existing position (weighted-average cost).
        const existingShares = parseFloat(existingRow.dataset.shares);
        const existingAvg = parseUSD(existingRow.dataset.avg);
        const totalShares = existingShares + newShares;
        const totalCostBasis = existingShares * existingAvg + newShares * price;
        const newAvg = totalCostBasis / totalShares;
        const marketValue = totalShares * price;
        const gainAmt = marketValue - totalCostBasis;
        const gainPct = totalCostBasis > 0 ? (gainAmt / totalCostBasis) * 100 : 0;
        const sharesDisplay = totalShares >= 1 ? totalShares.toFixed(2) : totalShares.toFixed(6);
        const gainSign = gainAmt >= 0 ? '+' : '-';

        existingRow.dataset.shares = sharesDisplay;
        existingRow.dataset.avg = formatUSD(newAvg);
        existingRow.dataset.price = formatUSD(price);
        existingRow.dataset.value = formatUSD(marketValue);
        existingRow.dataset.gainPct = `${gainSign}${Math.abs(gainPct).toFixed(1)}%`;
        existingRow.dataset.gainAmt = `${gainSign}${formatUSD(Math.abs(gainAmt))}`;

        const cells = existingRow.querySelectorAll('td');
        cells[1].textContent = sharesDisplay;
        cells[2].textContent = formatUSD(newAvg);
        cells[3].textContent = formatUSD(price);
        cells[4].textContent = formatUSD(marketValue);
        cells[5].className = `is-numeric ${gainAmt >= 0 ? 'is-gain' : 'is-loss'}`;
        cells[5].textContent = `${gainSign}${formatUSD(Math.abs(gainAmt))} (${Math.abs(gainPct).toFixed(1)}%)`;
      } else {
        // New position: append a fresh row alongside existing holdings.
        const sharesDisplay = newShares >= 1 ? newShares.toFixed(2) : newShares.toFixed(6);
        const priceDisplay = formatUSD(price);
        const row = document.createElement('tr');
        row.tabIndex = 0;
        row.setAttribute('role', 'button');
        row.dataset.icon = iconFor(symbol);
        row.dataset.symbol = symbol;
        row.dataset.name = name;
        row.dataset.shares = sharesDisplay;
        row.dataset.avg = priceDisplay;
        row.dataset.price = priceDisplay;
        row.dataset.value = amountDisplay;
        row.dataset.gainPct = '+0.0%';
        row.dataset.gainAmt = '+$0.00';
        row.innerHTML = `
          <td>
            <div class="dash-table-asset">
              <span class="dash-table-asset-icon">${iconFor(symbol)}</span>
              <div>
                <div>${symbol}</div>
                <div class="dash-table-asset-name">${name}</div>
              </div>
            </div>
          </td>
          <td class="is-numeric">${sharesDisplay}</td>
          <td class="is-numeric">${priceDisplay}</td>
          <td class="is-numeric">${priceDisplay}</td>
          <td class="is-numeric">${amountDisplay}</td>
          <td class="is-numeric is-gain">+$0.00 (0.0%)</td>
        `;
        holdingsTbody.appendChild(row);
      }
    }

    recalculatePortfolioStats();

    investNote.textContent = `Your ${amountDisplay} investment in ${symbol} · ${name} is complete. Your holdings have been updated.`;
    investNote.style.color = '';

    setTimeout(closeInvestModal, 1600);
  });
}

const historyList = document.querySelector('#history-list');

if (historyList) {
  const filterButtons = document.querySelectorAll('.dash-history-filter');
  const rows = document.querySelectorAll('.dash-history-row');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
      const filter = button.dataset.filter;
      rows.forEach((row) => {
        row.hidden = filter !== 'all' && row.dataset.type !== filter;
      });
    });
  });

  const downloadButton = document.querySelector('#history-download');
  downloadButton?.addEventListener('click', () => {
    const visibleRows = [...rows].filter((row) => !row.hidden);
    const lines = [['Date', 'Description', 'Type', 'Status', 'Amount'].join(',')];
    visibleRows.forEach((row) => {
      const title = row.dataset.title.replace(/&middot;/g, '-').replace(/"/g, '""');
      lines.push([
        row.dataset.date,
        `"${title}"`,
        row.dataset.type === 'in' ? 'Incoming' : 'Outgoing',
        row.dataset.status,
        row.dataset.amount,
      ].join(','));
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'muskverse-transaction-history.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

const txOverlay = document.querySelector('#tx-modal-overlay');
const historyRows = document.querySelectorAll('.dash-history-row');

if (txOverlay && historyRows.length) {
  const txClose = document.querySelector('#tx-modal-close');
  const txIcon = document.querySelector('#tx-modal-icon');
  const txAmount = document.querySelector('#tx-modal-amount');
  const txTitle = document.querySelector('#tx-modal-heading');
  const txStatus = document.querySelector('#tx-modal-status');
  const txDate = document.querySelector('#tx-modal-date');
  const txId = document.querySelector('#tx-modal-id');
  const txMethod = document.querySelector('#tx-modal-method');
  const txType = document.querySelector('#tx-modal-type');

  const arrowIn = '<path d="M17 7 7 17"></path><path d="M17 17H7V7"></path>';
  const arrowOut = '<path d="M7 17 17 7"></path><path d="M7 7h10v10"></path>';

  const openTxModal = (row) => {
    const isIn = row.dataset.type === 'in';
    const isPending = row.dataset.status === 'Pending';

    txIcon.className = `dash-tx-modal-icon ${isIn ? 'is-in' : 'is-out'}`;
    txIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${isIn ? arrowIn : arrowOut}</svg>`;
    txAmount.textContent = row.dataset.amount;
    txAmount.className = `dash-tx-modal-amount ${isIn ? 'is-in' : 'is-out'}`;
    txTitle.textContent = row.dataset.title;
    txStatus.textContent = row.dataset.status;
    txStatus.className = `dash-history-status dash-tx-modal-status ${isPending ? 'is-pending' : 'is-completed'}`;
    txDate.textContent = row.dataset.datetime;
    txId.textContent = row.dataset.id;
    txMethod.textContent = row.dataset.method;
    txType.textContent = isIn ? 'Incoming' : 'Outgoing';

    txOverlay.classList.add('is-open');
    lockScroll();
  };

  const closeTxModal = () => {
    txOverlay.classList.remove('is-open');
    unlockScroll();
  };

  historyRows.forEach((row) => {
    row.addEventListener('click', () => openTxModal(row));
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openTxModal(row);
      }
    });
  });

  txClose?.addEventListener('click', closeTxModal);
  txOverlay.addEventListener('click', (event) => {
    if (event.target === txOverlay) closeTxModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && txOverlay.classList.contains('is-open')) closeTxModal();
  });
}

document.querySelectorAll('.dash-password-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const input = toggle.previousElementSibling;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(isHidden));
    toggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  });
});

const avatarUploadInput = document.querySelector('#avatar-upload-input');
const avatarUploadBtn = document.querySelector('#avatar-upload-btn');

if (avatarUploadInput && avatarUploadBtn) {
  const avatarRemoveBtn = document.querySelector('#avatar-remove-btn');
  const avatarPreviewIcon = document.querySelector('#avatar-preview-icon');
  const avatarPreviewImg = document.querySelector('#avatar-preview-img');
  const avatarNote = document.querySelector('#avatar-note');
  const defaultNote = avatarNote.textContent;
  const MAX_AVATAR_DIMENSION = 240;

  const renderAvatarPreview = (dataUrl) => {
    if (dataUrl) {
      avatarPreviewImg.src = dataUrl;
      avatarPreviewImg.hidden = false;
      avatarPreviewIcon.style.display = 'none';
      avatarRemoveBtn.hidden = false;
    } else {
      avatarPreviewImg.hidden = true;
      avatarPreviewImg.removeAttribute('src');
      avatarPreviewIcon.style.display = '';
      avatarRemoveBtn.hidden = true;
    }
  };

  renderAvatarPreview(localStorage.getItem(AVATAR_KEY));

  avatarUploadBtn.addEventListener('click', () => avatarUploadInput.click());

  avatarUploadInput.addEventListener('change', () => {
    const file = avatarUploadInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      avatarNote.textContent = 'Please choose an image file.';
      avatarNote.style.color = 'var(--dash-red)';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_AVATAR_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        localStorage.setItem(AVATAR_KEY, dataUrl);
        renderAvatarPreview(dataUrl);
        applyAvatarEverywhere(dataUrl);
        avatarNote.textContent = 'Profile picture updated.';
        avatarNote.style.color = 'var(--dash-blue)';
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  avatarRemoveBtn.addEventListener('click', () => {
    localStorage.removeItem(AVATAR_KEY);
    avatarUploadInput.value = '';
    renderAvatarPreview(null);
    applyAvatarEverywhere(null);
    avatarNote.textContent = defaultNote;
    avatarNote.style.color = '';
  });
}

const profileEditBtn = document.querySelector('#profile-edit-btn');

if (profileEditBtn) {
  const profileForm = document.querySelector('#profile-form');
  const profileInputs = profileForm.querySelectorAll('input');
  const profileActions = document.querySelector('#profile-form-actions');
  const profileCancelBtn = document.querySelector('#profile-cancel-btn');
  const profileNote = document.querySelector('#profile-note');
  const originalValues = new Map();

  const enterEditMode = () => {
    profileInputs.forEach((input) => {
      originalValues.set(input, input.value);
      input.readOnly = false;
    });
    profileInputs[0]?.focus();
    profileEditBtn.hidden = true;
    profileActions.hidden = false;
    if (profileNote) profileNote.textContent = '';
  };

  const exitEditMode = (revert) => {
    profileInputs.forEach((input) => {
      if (revert && originalValues.has(input)) input.value = originalValues.get(input);
      input.readOnly = true;
    });
    profileEditBtn.hidden = false;
    profileActions.hidden = true;
  };

  profileEditBtn.addEventListener('click', enterEditMode);
  profileCancelBtn?.addEventListener('click', () => exitEditMode(true));
  profileForm.addEventListener('submit', () => exitEditMode(false));
}

const cryptoFields = document.querySelector('#deposit-crypto-fields');

if (cryptoFields) {
  const qrContainer = document.querySelector('#deposit-qr');
  const addressEl = document.querySelector('#deposit-address');
  const networkEl = document.querySelector('#deposit-network');
  const coinNameEl = document.querySelector('#deposit-coin-name');
  const copyBtn = document.querySelector('#deposit-copy-btn');
  const coinTabs = document.querySelectorAll('.dash-crypto-tab');

  const wallets = {
    btc: { name: 'BTC', network: 'Bitcoin Network', address: 'bc1qmv8y02xxnxdw54yqxa5v9j0aaz6qgqvzn5s0f4' },
    usdt: { name: 'USDT', network: 'Ethereum Network (ERC-20)', address: '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF' },
    eth: { name: 'ETH', network: 'Ethereum Network (ERC-20)', address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' },
  };

  const renderQr = (text) => {
    if (!qrContainer) return;
    qrContainer.innerHTML = '';
    if (window.QRCode) {
      new QRCode(qrContainer, { text, width: 148, height: 148, colorDark: '#000000', colorLight: '#ffffff' });
    }
  };

  const showCoin = (coin) => {
    const wallet = wallets[coin];
    if (addressEl) addressEl.textContent = wallet.address;
    if (networkEl) networkEl.textContent = wallet.network;
    if (coinNameEl) coinNameEl.textContent = wallet.name;
    coinTabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.coin === coin));
    copyBtn?.classList.remove('is-copied');
    renderQr(wallet.address);
  };

  coinTabs.forEach((tab) => {
    tab.addEventListener('click', () => showCoin(tab.dataset.coin));
  });

  showCoin('btc');

  copyBtn?.addEventListener('click', async () => {
    if (!addressEl) return;
    try {
      await navigator.clipboard.writeText(addressEl.textContent);
    } catch (error) {
      const range = document.createRange();
      range.selectNodeContents(addressEl);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
    copyBtn.classList.add('is-copied');
    setTimeout(() => copyBtn.classList.remove('is-copied'), 1500);
  });
}

const withdrawForm = document.querySelector('#withdrawal-form');

if (withdrawForm) {
  const withdrawBalanceEl = document.querySelector('#withdraw-balance');
  const withdrawAmountInput = document.querySelector('#withdraw-amount');
  const withdrawAddressInput = document.querySelector('#withdraw-address');
  const withdrawNote = document.querySelector('#withdraw-note');
  const withdrawNetworkEl = document.querySelector('#withdraw-network');
  const withdrawCoinTabs = document.querySelectorAll('#withdraw-coin-tabs .dash-crypto-tab');
  const withdrawPresets = document.querySelectorAll('.dash-withdraw-amount-preset');

  const withdrawNetworks = {
    btc: 'Bitcoin Network',
    usdt: 'Ethereum Network (ERC-20)',
    eth: 'Ethereum Network (ERC-20)',
  };

  const formatUSDValue = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const getWithdrawBalance = () => parseFloat((withdrawBalanceEl?.textContent || '0').replace(/[^0-9.-]/g, '')) || 0;

  withdrawCoinTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      withdrawCoinTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      if (withdrawNetworkEl) withdrawNetworkEl.textContent = withdrawNetworks[tab.dataset.coin] || withdrawNetworks.btc;
    });
  });

  withdrawPresets.forEach((button) => {
    button.addEventListener('click', () => {
      const pct = parseFloat(button.dataset.pct);
      const amount = getWithdrawBalance() * pct;
      withdrawAmountInput.value = amount > 0 ? amount.toFixed(2) : '';
    });
  });

  withdrawForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = parseFloat(withdrawAmountInput.value || '0');
    const balance = getWithdrawBalance();

    if (!amount || amount <= 0) {
      withdrawNote.textContent = 'Enter an amount to continue.';
      withdrawNote.style.color = 'var(--dash-red)';
      return;
    }
    if (amount > balance) {
      withdrawNote.textContent = 'Withdrawal amount exceeds your available balance.';
      withdrawNote.style.color = 'var(--dash-red)';
      return;
    }
    if (!withdrawAddressInput.value.trim()) {
      withdrawNote.textContent = 'Enter a destination wallet address.';
      withdrawNote.style.color = 'var(--dash-red)';
      return;
    }

    const newBalance = formatUSDValue(balance - amount);
    if (withdrawBalanceEl) withdrawBalanceEl.textContent = newBalance;
    document.querySelectorAll('.dash-balance-value').forEach((el) => {
      el.textContent = newBalance;
    });

    withdrawNote.textContent = `Your withdrawal request for ${formatUSDValue(amount)} has been submitted and is pending review.`;
    withdrawNote.style.color = '';
    withdrawForm.reset();
    withdrawCoinTabs.forEach((t) => t.classList.toggle('is-active', t.dataset.coin === 'btc'));
    if (withdrawNetworkEl) withdrawNetworkEl.textContent = withdrawNetworks.btc;
  });
}

const orderSymbol = document.querySelector('#order-symbol');
const orderQuantity = document.querySelector('#order-quantity');
const orderEstimate = document.querySelector('#order-estimate');
const orderSideButtons = document.querySelectorAll('.dash-order-side-btn');

const orderBalanceEl = document.querySelector('.dash-available-balance span:last-child');
const BUYING_POWER = orderBalanceEl ? parseFloat(orderBalanceEl.textContent.replace(/[^0-9.-]/g, '')) || 0 : 0;

if (orderSymbol && orderQuantity && orderEstimate) {
  const updateEstimate = () => {
    const price = parseFloat(orderSymbol.selectedOptions[0]?.dataset.price || '0');
    const qty = parseFloat(orderQuantity.value || '0');
    orderEstimate.textContent = `$${(price * qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  orderSymbol.addEventListener('change', updateEstimate);
  orderQuantity.addEventListener('input', updateEstimate);

  if (presetSymbol) {
    const hasOption = [...orderSymbol.options].some((opt) => opt.value === presetSymbol);
    if (!hasOption && presetAsset) {
      const option = document.createElement('option');
      option.value = presetAsset.symbol;
      option.dataset.price = String(presetAsset.price);
      option.textContent = `${presetAsset.symbol} · ${presetAsset.name}`;
      orderSymbol.appendChild(option);
    }
    if (hasOption || presetAsset) {
      orderSymbol.value = presetSymbol;
    }
  }
  updateEstimate();

  document.querySelectorAll('.dash-order-qty-preset').forEach((button) => {
    button.addEventListener('click', () => {
      const price = parseFloat(orderSymbol.selectedOptions[0]?.dataset.price || '0');
      if (!price) return;
      const pct = parseFloat(button.dataset.pct);
      const qty = (BUYING_POWER * pct) / price;
      orderQuantity.value = qty >= 1 ? qty.toFixed(2) : qty.toFixed(4);
      updateEstimate();
    });
  });
}

orderSideButtons.forEach((button) => {
  button.addEventListener('click', () => {
    orderSideButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
  });
});

const sessionsList = document.querySelector('#trading-sessions-list');
const orderForm = document.querySelector('#order-symbol')?.closest('form');

if (sessionsList && orderForm) {
  const SESSION_KEY = 'Muskverse-trading-sessions';

  const formatElapsed = (startedAt) => {
    const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const loadSessions = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(SESSION_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  };

  const tickSessions = () => {
    sessionsList.querySelectorAll('.dash-session-time').forEach((el) => {
      el.textContent = formatElapsed(Number(el.dataset.startedAt));
    });
  };

  const renderSessions = (sessions) => {
    sessionsList.innerHTML = sessions
      .map(
        (session) => `
          <section class="dash-card dash-session-card" data-session-id="${session.id}">
            <div class="dash-session-head">
              <div class="dash-session-status">
                <span class="dash-session-dot"></span>
                Trading Session Active
              </div>
              <span class="dash-session-time" data-started-at="${session.startedAt}">00:00</span>
            </div>

            <div class="dash-session-details">
              <div class="dash-session-detail"><span>Symbol</span><strong>${session.symbol}</strong></div>
              <div class="dash-session-detail"><span>Side</span><strong class="${session.side === 'buy' ? 'is-buy' : 'is-sell'}">${session.side === 'buy' ? 'Buy' : 'Sell'}</strong></div>
              <div class="dash-session-detail"><span>Quantity</span><strong>${session.qty}</strong></div>
              <div class="dash-session-detail"><span>Total</span><strong>${session.total}</strong></div>
            </div>

            <button type="button" class="dash-btn-ghost dash-end-session-btn" data-session-id="${session.id}" style="width: 100%; justify-content: center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9 9h6v6H9z"></path>
              </svg>
              End Trading Session
            </button>
          </section>
        `
      )
      .join('');
    tickSessions();
  };

  const saveSessions = (sessions) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
    renderSessions(sessions);
  };

  renderSessions(loadSessions());
  setInterval(tickSessions, 1000);

  sessionsList.addEventListener('click', (event) => {
    const endBtn = event.target.closest('.dash-end-session-btn');
    if (!endBtn) return;
    const sessions = loadSessions().filter((session) => session.id !== endBtn.dataset.sessionId);
    saveSessions(sessions);
  });

  const orderToast = document.querySelector('#order-toast');
  let toastTimer = null;

  const showOrderToast = () => {
    if (!orderToast) return;
    orderToast.classList.add('is-open');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => orderToast.classList.remove('is-open'), 2600);
  };

  orderForm.addEventListener('submit', () => {
    const selected = orderSymbol.selectedOptions[0];
    const side = document.querySelector('.dash-order-side-btn.is-active')?.dataset.side || 'buy';
    const session = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      symbol: selected.value,
      side,
      qty: orderQuantity.value,
      total: orderEstimate.textContent,
      startedAt: Date.now(),
    };
    const sessions = loadSessions();
    sessions.push(session);
    saveSessions(sessions);
    showOrderToast();
    sessionsList.querySelector(`[data-session-id="${session.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

const planModalOverlay = document.querySelector('#plan-modal-overlay');
const planOpenButtons = document.querySelectorAll('.dash-plan-open');

if (planModalOverlay && planOpenButtons.length) {
  const PLANS_KEY = 'Muskverse-savings-plans';
  const planClose = document.querySelector('#plan-modal-close');
  const planNameEl = document.querySelector('#plan-modal-name');
  const planLockEl = document.querySelector('#plan-modal-lock');
  const planForm = document.querySelector('#plan-form');
  const planAmountInput = document.querySelector('#plan-amount');
  const planAmountPresets = document.querySelectorAll('.dash-plan-amount-preset');
  const planDurationField = document.querySelector('#plan-duration-field');
  const planDurationButtons = document.querySelectorAll('.dash-plan-duration');
  const planCustomToggle = document.querySelector('#plan-duration-custom-toggle');
  const planCustomDate = document.querySelector('#plan-custom-date');
  const planUnlockPreview = document.querySelector('#plan-unlock-preview');
  const planInterestPreview = document.querySelector('#plan-interest-preview');
  const planNote = document.querySelector('#plan-modal-note');
  const planDisclaimer = document.querySelector('#plan-modal-disclaimer');
  const plansEmpty = document.querySelector('#savings-plans-empty');
  const plansWrap = document.querySelector('#savings-plans-wrap');
  const plansTbody = document.querySelector('#savings-plans-tbody');
  const plansClearAll = document.querySelector('#plans-clear-all');

  const planDetailOverlay = document.querySelector('#plan-detail-modal-overlay');
  const planDetailClose = document.querySelector('#plan-detail-modal-close');
  const planDetailName = document.querySelector('#plan-detail-name');
  const planDetailStatusLine = document.querySelector('#plan-detail-status-line');
  const planDetailAmount = document.querySelector('#plan-detail-amount');
  const planDetailApy = document.querySelector('#plan-detail-apy');
  const planDetailUnlock = document.querySelector('#plan-detail-unlock');
  const planDetailInterest = document.querySelector('#plan-detail-interest');
  const planDetailDisclaimer = document.querySelector('#plan-detail-disclaimer');
  const planBreakBtn = document.querySelector('#plan-break-btn');
  const planDetailNote = document.querySelector('#plan-detail-note');

  const planFormatUSD = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const planFormatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  let currentPlan = null;
  let selectedUnlockDate = null;

  const clearDurationSelection = () => {
    planDurationButtons.forEach((btn) => btn.classList.remove('is-active'));
    planCustomToggle.classList.remove('is-active');
    planCustomDate.hidden = true;
    planCustomDate.value = '';
  };

  const updatePlanPreview = () => {
    const amount = parseFloat(planAmountInput.value || '0');

    if (currentPlan?.breakable) {
      planUnlockPreview.textContent = 'Anytime';
      const interest = amount * (currentPlan.apy / 100);
      planInterestPreview.textContent = planFormatUSD(Math.max(0, interest));
      planDisclaimer.hidden = true;
      return;
    }

    if (selectedUnlockDate && currentPlan) {
      planUnlockPreview.textContent = planFormatDate(selectedUnlockDate);
      const days = Math.max(0, (selectedUnlockDate - new Date()) / (1000 * 60 * 60 * 24));
      const interest = amount * (currentPlan.apy / 100) * (days / 365);
      planInterestPreview.textContent = planFormatUSD(Math.max(0, interest));
    } else {
      planUnlockPreview.textContent = '—';
      planInterestPreview.textContent = '$0.00';
    }

    if (currentPlan) {
      planDisclaimer.hidden = false;
      planDisclaimer.textContent = selectedUnlockDate
        ? `This plan cannot be broken early — funds stay locked until ${planFormatDate(selectedUnlockDate)}.`
        : 'This plan cannot be broken early — once you choose a lock-up duration, funds stay locked until it ends.';
    }
  };

  const openPlanModal = (card) => {
    currentPlan = {
      name: card.dataset.plan,
      apy: parseFloat(card.dataset.apy),
      min: parseFloat(card.dataset.min),
      lock: card.dataset.lock,
      breakable: card.dataset.breakable === 'true',
    };
    selectedUnlockDate = null;
    planNameEl.textContent = currentPlan.name;
    planLockEl.textContent = `${currentPlan.lock}.`;
    planAmountInput.value = currentPlan.min > 0 ? currentPlan.min : 100;
    planNote.textContent = '';
    planAmountPresets.forEach((btn) => btn.classList.remove('is-active'));
    clearDurationSelection();
    planDurationField.hidden = currentPlan.breakable;
    updatePlanPreview();

    planModalOverlay.classList.add('is-open');
    lockScroll();
    planAmountInput.focus();
  };

  const closePlanModal = () => {
    planModalOverlay.classList.remove('is-open');
    unlockScroll();
  };

  planOpenButtons.forEach((button) => {
    button.addEventListener('click', () => openPlanModal(button.closest('.dash-opp-card')));
  });

  planClose?.addEventListener('click', closePlanModal);
  planModalOverlay.addEventListener('click', (event) => {
    if (event.target === planModalOverlay) closePlanModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && planModalOverlay.classList.contains('is-open')) closePlanModal();
  });

  planAmountPresets.forEach((button) => {
    button.addEventListener('click', () => {
      planAmountInput.value = button.dataset.amount;
      planAmountPresets.forEach((btn) => btn.classList.toggle('is-active', btn === button));
      updatePlanPreview();
    });
  });

  planAmountInput.addEventListener('input', updatePlanPreview);

  planDurationButtons.forEach((button) => {
    button.addEventListener('click', () => {
      clearDurationSelection();
      button.classList.add('is-active');
      const months = Number(button.dataset.months);
      const date = new Date();
      date.setMonth(date.getMonth() + months);
      selectedUnlockDate = date;
      updatePlanPreview();
    });
  });

  planCustomToggle.addEventListener('click', () => {
    planDurationButtons.forEach((btn) => btn.classList.remove('is-active'));
    planCustomToggle.classList.add('is-active');
    planCustomDate.hidden = false;
    planCustomDate.min = new Date().toISOString().split('T')[0];
    planCustomDate.focus();
  });

  planCustomDate.addEventListener('change', () => {
    if (!planCustomDate.value) return;
    const date = new Date(`${planCustomDate.value}T00:00:00`);
    selectedUnlockDate = date;
    updatePlanPreview();
  });

  const renderPlansList = (plans) => {
    if (!plans.length) {
      plansEmpty.hidden = false;
      plansWrap.hidden = true;
      if (plansClearAll) plansClearAll.hidden = true;
      plansTbody.innerHTML = '';
      return;
    }
    plansEmpty.hidden = true;
    plansWrap.hidden = false;
    if (plansClearAll) plansClearAll.hidden = false;
    plansTbody.innerHTML = plans
      .map((plan) => {
        const unlock = new Date(plan.unlockDate);
        const isAvailable = plan.breakable || unlock <= new Date();
        return `
          <tr tabindex="0" role="button" data-plan-id="${plan.id}">
            <td>${plan.name}</td>
            <td class="is-numeric">${planFormatUSD(plan.amount)}</td>
            <td class="is-numeric">${planFormatDate(new Date(plan.openedDate))}</td>
            <td class="is-numeric">${plan.breakable ? 'Anytime' : planFormatDate(unlock)}</td>
            <td class="is-numeric is-gain">+${planFormatUSD(plan.projectedInterest)}</td>
            <td class="is-numeric"><span class="dash-badge ${isAvailable ? 'is-open' : 'is-pending'}">${isAvailable ? 'Available' : 'Locked'}</span></td>
          </tr>
        `;
      })
      .join('');
  };

  const openPlanDetailModal = (plan) => {
    const unlock = new Date(plan.unlockDate);
    planDetailName.textContent = plan.name;
    planDetailStatusLine.textContent = `Opened ${planFormatDate(new Date(plan.openedDate))} · ${plan.apy}% APY`;
    planDetailAmount.textContent = planFormatUSD(plan.amount);
    planDetailApy.textContent = `${plan.apy}%`;
    planDetailUnlock.textContent = plan.breakable ? 'Anytime' : planFormatDate(unlock);
    planDetailInterest.textContent = `+${planFormatUSD(plan.projectedInterest)}`;
    planDetailNote.textContent = '';

    if (plan.breakable) {
      planDetailDisclaimer.hidden = true;
      planBreakBtn.hidden = false;
      planBreakBtn.disabled = false;
      planBreakBtn.dataset.planId = plan.id;
    } else {
      planBreakBtn.hidden = true;
      planDetailDisclaimer.hidden = false;
      planDetailDisclaimer.textContent = `This plan cannot be broken early — funds stay locked until ${planFormatDate(unlock)}.`;
    }

    planDetailOverlay.classList.add('is-open');
    lockScroll();
  };

  const closePlanDetailModal = () => {
    planDetailOverlay.classList.remove('is-open');
    unlockScroll();
  };

  if (planDetailOverlay) {
    plansTbody.addEventListener('click', (event) => {
      const row = event.target.closest('tr');
      if (!row) return;
      const plan = loadPlans().find((p) => p.id === row.dataset.planId);
      if (plan) openPlanDetailModal(plan);
    });
    plansTbody.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const row = event.target.closest('tr');
      if (!row) return;
      event.preventDefault();
      const plan = loadPlans().find((p) => p.id === row.dataset.planId);
      if (plan) openPlanDetailModal(plan);
    });

    planDetailClose?.addEventListener('click', closePlanDetailModal);
    planDetailOverlay.addEventListener('click', (event) => {
      if (event.target === planDetailOverlay) closePlanDetailModal();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && planDetailOverlay.classList.contains('is-open')) closePlanDetailModal();
    });

    planBreakBtn?.addEventListener('click', () => {
      const planId = planBreakBtn.dataset.planId;
      planBreakBtn.disabled = true;
      const remaining = loadPlans().filter((p) => p.id !== planId);
      savePlans(remaining);
      planDetailNote.textContent = 'Savings broken. Funds returned to your balance.';
      planDetailNote.style.color = 'var(--dash-blue)';
      setTimeout(closePlanDetailModal, 900);
    });
  }

  const loadPlans = () => {
    try {
      return JSON.parse(localStorage.getItem(PLANS_KEY) || '[]');
    } catch (error) {
      return [];
    }
  };

  const savePlans = (plans) => {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    renderPlansList(plans);
  };

  renderPlansList(loadPlans());

  plansClearAll?.addEventListener('click', () => {
    const confirmed = window.confirm('This will permanently hide all of your active savings plans. This cannot be undone. Continue?');
    if (!confirmed) return;
    savePlans([]);
  });

  planForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const amount = parseFloat(planAmountInput.value || '0');
    if (!amount || amount <= 0) {
      planNote.textContent = 'Enter an amount to continue.';
      planNote.style.color = 'var(--dash-red)';
      return;
    }
    if (currentPlan.min > 0 && amount < currentPlan.min) {
      planNote.textContent = `Minimum deposit for this plan is ${planFormatUSD(currentPlan.min)}.`;
      planNote.style.color = 'var(--dash-red)';
      return;
    }
    if (!currentPlan.breakable && !selectedUnlockDate) {
      planNote.textContent = 'Choose a lock-up duration or pick a date.';
      planNote.style.color = 'var(--dash-red)';
      return;
    }

    const unlockDate = currentPlan.breakable ? new Date() : selectedUnlockDate;
    const days = currentPlan.breakable ? 365 : Math.max(0, (unlockDate - new Date()) / (1000 * 60 * 60 * 24));
    const projectedInterest = amount * (currentPlan.apy / 100) * (days / 365);

    const plans = loadPlans();
    plans.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: currentPlan.name,
      apy: currentPlan.apy,
      min: currentPlan.min,
      breakable: currentPlan.breakable,
      amount,
      openedDate: new Date().toISOString(),
      unlockDate: unlockDate.toISOString(),
      projectedInterest,
    });
    savePlans(plans);

    planNote.textContent = `Savings started — ${currentPlan.name} opened with ${planFormatUSD(amount)}.`;
    planNote.style.color = 'var(--dash-blue)';
    setTimeout(closePlanModal, 900);
  });
}

const calcAmount = document.querySelector('#calc-amount');
const calcPlan = document.querySelector('#calc-plan');
const calcResult = document.querySelector('#calc-result');

if (calcAmount && calcPlan && calcResult) {
  const updateCalc = () => {
    const amount = parseFloat(calcAmount.value || '0');
    const apy = parseFloat(calcPlan.value || '0');
    const earnings = amount * (apy / 100);
    calcResult.textContent = `$${earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  calcAmount.addEventListener('input', updateCalc);
  calcPlan.addEventListener('change', updateCalc);
  updateCalc();
}

document.querySelectorAll('.dash-plan-open').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.disabled) return;
    button.disabled = true;
    button.style.opacity = '0.7';
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Plan Opened`;
  });
});

document.querySelectorAll('.dash-opp-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const detail = document.getElementById(toggle.dataset.target);
    if (!detail) return;
    const isOpen = !detail.hidden;
    detail.hidden = isOpen;
    toggle.closest('.dash-opp-card')?.classList.toggle('is-expanded', !isOpen);
    toggle.childNodes[0].textContent = isOpen ? 'Details ' : 'Hide Details ';
  });
});

document.querySelectorAll('.dash-opp-view').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.disabled) return;
    button.disabled = true;
    button.style.opacity = '0.7';
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Request Sent`;
  });
});

document.querySelectorAll('.dash-ipo-reserve').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.disabled) return;
    button.disabled = true;
    button.style.opacity = '0.7';
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg> Interest Registered`;
  });
});

document.querySelectorAll('.dash-statement-download').forEach((button) => {
  button.addEventListener('click', () => {
    const month = button.dataset.month;
    const content = `Muskverse Equity — Account Statement\nPeriod: ${month}\nAccount holder: Pj Mask\n\nThis is a sample statement for demonstration purposes.\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `muskverse-statement-${month.replace(' ', '-').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
});

document.querySelectorAll('[data-confirm-note]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const note = document.querySelector(form.dataset.confirmNote);
    if (note) note.textContent = form.dataset.confirmMessage || 'Saved.';
  });
});
