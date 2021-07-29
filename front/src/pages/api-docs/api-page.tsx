/// <reference types="vss-web-extension-sdk" />

import React from 'react';
import './api-page.scss';

import { Page } from 'azure-devops-ui/Page';
import { MasterDetailsContext } from 'azure-devops-ui/MasterDetailsContext';
import { DetailsPanel, MasterPanel } from 'azure-devops-ui/MasterDetails';
import { masterDetailsContext } from './api-page-settings';
import ApiModal from '../../components/api-docs/api-modal';


interface IApiState {
  showAdd: boolean;
}

class Api extends React.Component<{}, IApiState>  {

  constructor(props: {}) {
    super(props);
    this.state = {
      showAdd: false
    };
  }

  render() {

    const { showAdd } = this.state;

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
