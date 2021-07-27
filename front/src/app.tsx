import React from 'react';
import * as DevOps from "azure-devops-extension-sdk";

import ProjectPage from './pages/project/projects-page';
import Radar from './pages/radar/radar';

import { IHostNavigationService } from 'azure-devops-extension-api/Common/CommonServices';
import Api from './pages/api-docs/api';

interface IAppState {
  page: string;
}

class App extends React.Component<{}, IAppState>  {

  projectService = DevOps.getService<IHostNavigationService>(
    "ms.vss-features.host-navigation-service"
  );

  constructor(props: {}) {
    super(props);

    DevOps.init();

    this.state = {
      page: "",
    };

    this.projectService.then(item => {
      item.getPageRoute().then(route => {
        this.setState({ page: route.routeValues["parameters"] });
      });
    });
  }

  render() {

    const { page } = this.state;

    switch (page) {
      case "elevenlabs.stack-board.stack-board-hub":
        return (<ProjectPage />);
      case "elevenlabs.stack-board.tech-radar-hub":
        return (<Radar />);
      case "elevenlabs.stack-board.api-docs-hub":
        return (<Api />);
      default:
        return null;
    }
  }
}

export default App;
