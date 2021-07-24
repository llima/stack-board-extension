import React from 'react';
import * as DevOps from "azure-devops-extension-sdk";

import ProjectPage from './pages/project/projects-page';
import Radar from './pages/radar/radar';

import { IHostNavigationService } from 'azure-devops-extension-api/Common/CommonServices';

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

    return (<ProjectPage />);

    const { page } = this.state;

    switch (page) {
      case "elevenlabs.stack-board.stack-board-hub":
        return (<ProjectPage />);
      case "elevenlabs.stack-board.tech-radar-hub":
        return (<Radar />);
      default:
        return null;
    }
  }
}

export default App;
