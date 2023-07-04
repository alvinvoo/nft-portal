import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  walletAddress: '',
  status: '',
  balance: '',
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletState: (state, action) => {
      const {
        walletAddress,
        status,
        balance,
      } = action.payload;
      state.walletAddress = walletAddress;
      state.status = status;
      state.balance = balance;
    },
    setWalletStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setWalletState, setWalletStatus } = walletSlice.actions;

export const selectWalletAddress = (state) => state.wallet.walletAddress;
export const selectWalletStatus = (state) => state.wallet.status;
export const selectWalletBalance = (state) => state.wallet.balance;

export default walletSlice.reducer;
