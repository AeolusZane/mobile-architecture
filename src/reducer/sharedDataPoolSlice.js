import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  templateSharedDataPool: null, // 还可能添加其他的sharedDataPool，比如但组件有自己的sharedDataPool
  linkedWidgetClickedMap: new Map(),
  widgetSharedDataPool: null,
  sharedDataPool: null,

  viewModels: [],
  models: [],
};

const MSG_LINKAGE_TO_WIDGET = "MSG_LINKAGE_TO_WIDGET";

export const sharedDataPoolSlice = createSlice({
  name: "sharedDataPool",
  initialState,
  reducers: {
    setTemplateSharedDataPool: (state, action) => {
      state.templateSharedDataPool = action.payload;
      state.sharedDataPool = action.payload;
    },

    setWidgetSharedDataPool: (state, action) => {
      state.widgetSharedDataPool = action.payload;
      state.sharedDataPool = action.payload;
    },

    registerLinkageToWidgetMessage: (state, action) => {
      const { viewModel } = action.payload;
      state.sharedDataPool.registerMessage(
        MSG_LINKAGE_TO_WIDGET,
        viewModel,
        (msg) => {
          viewModel.onReceiveLinkageWidgetMessage(msg);
        }
      );
    },
    queryLinkageToWidgetMessage: (state, action) => {
      const msg = action.payload;
      state.sharedDataPool.queryMessage(MSG_LINKAGE_TO_WIDGET, msg);
    },

    registerViewModel: (state, action) => {
      state.viewModels.push(action.payload);
    },
    registerModel: (state, action) => {
      state.models.push(action.payload);
    },
  },
});

export const {
  setTemplateSharedDataPool,
  registerLinkageToWidgetMessage,
  queryLinkageToWidgetMessage,
  registerViewModel,
  registerModel,
} = sharedDataPoolSlice.actions;

export default sharedDataPoolSlice.reducer;
