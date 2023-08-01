import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import {App} from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import MainRouter from "./router/MainRouter";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <BrowserRouter>
          <MainRouter />
      </BrowserRouter>
  </React.StrictMode>,
)
