import React from 'react';
import {Search} from "./components/public/search/Search";
import {BrowserRouter} from "react-router-dom";
import {AppRouter} from "./API/router/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <Search/>
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;
