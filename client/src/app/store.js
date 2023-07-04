import { configureStore } from '@reduxjs/toolkit';
import walletReducer from '../features/wallet/walletSlice';
import nftReducer from '../features/nft/nftSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    nft: nftReducer,
  },
});