import * as React from 'react'
import * as ReactDOM from "react-dom"

import "./index.css"
import WritePost from "./WritePost"

const App = () => (
  <div className="container">
    <div>Name: mf-post</div>
    <div>Framework: react</div>
    <div>Language: TypeScript</div>
    <div>CSS: Empty CSS</div>
      <WritePost />
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
