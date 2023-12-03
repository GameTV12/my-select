import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import MainRouter from "./router/MainRouter";
import {CookiesProvider} from "react-cookie";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <CookiesProvider>
          <BrowserRouter>
              <MainRouter />
          </BrowserRouter>
      </CookiesProvider>
  </React.StrictMode>,
)
