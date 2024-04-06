import { configureStore } from "@reduxjs/toolkit";
import sharedDataPoolReducer from "./sharedDataPoolSlice";

const store =  configureStore({
    reducer: {
        sharedDataPool: sharedDataPoolReducer,
    },
    middleware:getDefaultMiddleware => getDefaultMiddleware({
        //关闭redux序列化检测
        serializableCheck:false
    })
});

export default store;