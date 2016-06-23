import ReactDOM from "react-dom";
import React from "react";

import {PostWindow} from "react-components/post-window.js"

const POST_WINDOW_ID = 'post-window';

ReactDOM.render(
  <PostWindow />,
  document.getElementById(POST_WINDOW_ID)
);
