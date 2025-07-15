import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  permissions: string;
  invitation: 'Yes' | 'No';
}

interface PartnerState {
  partners: Partner[];
}

const initialState: PartnerState = {
  partners: [],
};

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    addPartner: (state, action: PayloadAction<Partner>) => {
      state.partners.push(action.payload);
      console.log('Partner added in redux:', action.payload);
    },
  },
});

export const { addPartner } = partnerSlice.actions;
export default partnerSlice.reducer;
