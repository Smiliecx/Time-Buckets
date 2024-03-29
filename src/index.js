import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./Redux/Reducers/CombineReducer";
import { createStore } from "redux";
import initSubscriber from "./Redux/StoreSubscriber";
import "semantic-ui-css/semantic.min.css";
import "./Components/Components.css";

const store = createStore(rootReducer, composeWithDevTools());
initSubscriber(store);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app")
);
