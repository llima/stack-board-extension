import ReactDOM from 'react-dom';
import "./services/registration";
import "./utils/extensions.ts";

import { SurfaceBackground, SurfaceContext } from "azure-devops-ui/Surface";
import App from './app';

ReactDOM.render(
  <SurfaceContext.Provider value={{ background: SurfaceBackground.neutral }}>
    <App />
  </SurfaceContext.Provider>,
  document.getElementById('root')
);
