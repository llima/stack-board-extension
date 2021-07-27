import React from 'react';
import './api.scss';

import { Page } from 'azure-devops-ui/Page';
import { MasterDetailsContext } from 'azure-devops-ui/MasterDetailsContext';
import { DetailsPanel, MasterPanel } from 'azure-devops-ui/MasterDetails';
import { masterDetailsContext } from './api-settings';

interface IApiState {
}

class Api extends React.Component<{}, IApiState>  {

  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <Page className="flex-grow">
        <MasterDetailsContext.Provider value={masterDetailsContext}>
            <div className="flex-row">
              <MasterPanel className="master-example-panel" />
              <DetailsPanel />
            </div>
          </MasterDetailsContext.Provider>
      </Page>
    );
  }
}

export default Api;
