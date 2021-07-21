import React from 'react';
import * as DevOps from "azure-devops-extension-sdk";
import { IHostNavigationService } from 'azure-devops-extension-api/Common/CommonServices';
import Project from './pages/project/projects';
import Radar from './pages/radar/radar';
import { Surface, SurfaceBackground } from 'azure-devops-ui/Surface';

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

    return (
      <Surface background={SurfaceBackground.neutral}>
        <Project />
      </Surface>
    );

    const { page } = this.state;

    switch (page) {
      case "elevenlabs.stack-board.stack-board-hub":
        return (<Project />);
      case "elevenlabs.stack-board.tech-radar-hub":
        return (<Radar />);
      default:
        return null;
    }
  }
}

export default App;
