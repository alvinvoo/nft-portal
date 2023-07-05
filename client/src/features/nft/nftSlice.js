import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nric: '',
  name: '',
  description: '',
  image: '',
  mintedToken: {
    name: '',
    description: '',
    URL: '',
    image: '',
  },
  minting: false,
}

export const nftSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    setNRIC: (state, action) => {
      state.nric = action.payload;
    },
    setNFTName: (state, action) => {
      state.name = action.payload;
    },
    setNFTDescription: (state, action) => {
      state.description = action.payload;
    },
    setNFTImage: (state, action) => {
      state.image = action.payload;
    },
    setMinting: (state, action) => {
      state.minting = action.payload;
    },
    setMintedToken: (state, action) => {
      state.mintedToken = {
        name: action.payload.name,
        description: action.payload.description,
        URL: action.payload.URL,
        image: action.payload.image,
      };
    },
  },
});

export const { 
  setNRIC,
  setNFTName, 
  setNFTDescription, 
  setNFTImage, 
  setMinting,
  setMintedToken,
 } = nftSlice.actions;

export const selectNRIC = (state) => state.nft.nric;
export const selectNFTName = (state) => state.nft.name;
export const selectNFTDescription = (state) => state.nft.description;
export const selectNFTImage = (state) => state.nft.image;
export const selectMinting = (state) => state.nft.minting;
export const selectMintedToken = (state) => state.nft.mintedToken;

export default nftSlice.reducer;
