import { Provider } from "react-redux";

import { LandingPage } from "./LandingPage/LandingPage";

import store from "./redux/store";

import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <LandingPage />
    </Provider>
  );
}

export default App;
