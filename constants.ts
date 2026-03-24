import { WalletInfo, WalletType } from './types';

export const WALLETS: WalletInfo[] = [
  { network: WalletType.SOLANA, address: 'F2UJS1wNzsfcQTknPsxBk7B25qWbU9JtiRW1eRgdwLJY' },
  { network: WalletType.ETHEREUM, address: '0xC5BC11e19D3De81a1365259A99AF4D88c62a8C50' },
  { network: WalletType.MONAD, address: '0xC5BC11e19D3De81a1365259A99AF4D88c62a8C50' },
  { network: WalletType.BASE, address: '0xC5BC11e19D3De81a1365259A99AF4D88c62a8C50' },
  { network: WalletType.SUI, address: '0x41629e22deff6965100a4c28567dea45036d0360e6126a9c7f9c8fb1860a36c4' },
  { network: WalletType.POLYGON, address: '0xC5BC11e19D3De81a1365259A99AF4D88c62a8C50' },
  { network: WalletType.BITCOIN, address: 'bc1q9s855ehn959s5t2g6kjt9q7pt5t55n9gq7gpd7' },
];

export const SUPPORT_EMAIL = "jikob67@gmail.com";
export const SUPPORT_LINKS = [
  "https://jacobalcadiapps.wordpress.com",
  "https://jacobalcadiapps.blogspot.com"
];

export const APP_DESCRIPTION = "It is an application that helps you to record your daily topics of interest.";

// Empty initial state as requested
export const MOCK_USERS = [];
export const MOCK_VIDEOS = [];