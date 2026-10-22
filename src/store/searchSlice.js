import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAnalogues, fetchGoodsByNumber } from '../api/favoritApi';
import { toOffers, uniqueBrands } from '../utils/offers';

// status: 'idle' | 'loading' | 'succeeded' | 'failed'

export const searchBrands = createAsyncThunk('search/brands', async (number, { signal }) => {
  const goods = await fetchGoodsByNumber(number, signal);
  return uniqueBrands(goods);
});

export const searchOffers = createAsyncThunk('search/offers', async ({ number, brand }, { signal }) => {
  const goods = await fetchAnalogues(number, brand, signal);
  const original = goods[0];
  if (!original) return [];

  return [
    ...toOffers(original, true),
    ...(original.analogues || []).flatMap((a) => toOffers(a)),
  ];
});

const initialState = {
  number: '',
  brands: { items: [], status: 'idle', error: null },
  selectedBrand: null,
  offers: { items: [], status: 'idle', error: null },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setNumber(state, action) {
      state.number = action.payload;
      state.selectedBrand = null;
      state.offers = initialState.offers;
      if (!action.payload.trim()) state.brands = initialState.brands;
    },
    selectBrand(state, action) {
      state.selectedBrand = action.payload;
    },
    resetBrand(state) {
      state.selectedBrand = null;
      state.offers = initialState.offers;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBrands.pending, (state) => {
        state.brands.status = 'loading';
        state.brands.error = null;
      })
      .addCase(searchBrands.fulfilled, (state, action) => {
        state.brands.status = 'succeeded';
        state.brands.items = action.payload;
      })
      .addCase(searchBrands.rejected, (state, action) => {
        if (action.meta.aborted) return; // запрос отменён более новым вводом
        state.brands.status = 'failed';
        state.brands.items = [];
        state.brands.error = action.error.message;
      })
      .addCase(searchOffers.pending, (state) => {
        state.offers.status = 'loading';
        state.offers.error = null;
      })
      .addCase(searchOffers.fulfilled, (state, action) => {
        // игнорируем ответ, если пользователь уже выбрал другого производителя
        if (action.meta.arg.brand !== state.selectedBrand) return;
        state.offers.status = 'succeeded';
        state.offers.items = action.payload;
      })
      .addCase(searchOffers.rejected, (state, action) => {
        if (action.meta.aborted || action.meta.arg.brand !== state.selectedBrand) return;
        state.offers.status = 'failed';
        state.offers.items = [];
        state.offers.error = action.error.message;
      });
  },
});

export const { setNumber, selectBrand, resetBrand } = searchSlice.actions;
export default searchSlice.reducer;
