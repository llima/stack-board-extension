import React from 'react';
import './api-page.scss';

import { Page } from 'azure-devops-ui/Page';
import { BaseMasterDetailsContext, MasterDetailsContext } from 'azure-devops-ui/MasterDetailsContext';
import { DetailsPanel, MasterPanel } from 'azure-devops-ui/MasterDetails';
import { DetailView, ListView, SampleData } from './api-page-settings';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import { TextField, TextFieldStyle } from 'azure-devops-ui/TextField';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { IApi } from '../../model/api';
import ApiPanel from '../../components/api-docs/api-panel';
import { ZeroData, ZeroDataActionType } from 'azure-devops-ui/ZeroData';
import { Services } from '../../services/services';
import { ApiServiceId, IApiService } from '../../services/api';
import ApiModal from '../../components/api-docs/api-modal';

interface IApiState {
  showAdd: boolean;
  showDelete: boolean;
  loading: boolean;
  apis: IApi[];
  seletectedApi?: IApi;

}

class Api extends React.Component<{}, IApiState>  {

  apiService = Services.getService<IApiService>(ApiServiceId);

  constructor(props: {}) {
    super(props);
    this.state = {
      showAdd: false,
      showDelete: false,
      loading: false,
      apis: []
    };

    this.loadApis();
  }

  loadApis() {
    this.apiService.getApi().then(apis => {
      this.setState({ apis: apis, loading: false});
    }).catch(e => {
      this.setState({ loading: false });
    });
  }

  deleteApi(that: this) {
    that.apiService.removeApi(that.state.seletectedApi.id).then(() => {
      that.setState({ seletectedApi: null, showDelete: false });
      that.loadApis();
    })
  }

  render() {

    const { showAdd, showDelete, loading, apis, seletectedApi } = this.state;

    return (
      <Page className="flex-grow">

        {!loading && apis.length === 0 && <ZeroData
          primaryText="Register your first API document"
          secondaryText={
            <span>
              Centralize all api documentation and save time.
            </span>
          }
          imageAltText="Bars"
          imagePath={"https://cdn.vsassets.io/ext/ms.vss-code-web/import-content/repoNotFound.bVoHtlP2mhhyPo5t.svg"}
          actionText="Register"
          actionType={ZeroDataActionType.ctaButton}
          onActionClick={(event, item) =>
            this.setState({ showAdd: true })
          } />
        }

        {!loading && apis.length > 0 && <MasterDetailsContext.Provider value={new BaseMasterDetailsContext({
            key: "initial",
            masterPanelContent: {
              renderHeader: () => <Header
                title={"API Documentation"}
                commandBarItems={[
                  {
                    iconProps: { iconName: "Add" },
                    id: "testCreate",
                    important: true,
                    tooltipProps: {
                      text: "Register a new api"
                    },
                    onActivate: () => {
                      this.setState({ showAdd: true });
                    }
                  },
                ]}
                titleSize={TitleSize.Large}
              />,
              renderSearch: () => (
                <TextField
                  prefixIconProps={{ iconName: "Search" }}
                  placeholder="Search does not work"
                  style={TextFieldStyle.inline}
                />
              ),
              renderContent: (parentItem, initialSelectedMasterItem) => (
                <ListView initialSelectedMasterItem={initialSelectedMasterItem} initialItems={apis} />
              ),
              hideBackButton: true,
            },
            detailsContent: {
              renderContent: (item) => <DetailView detailItem={item} deleteEvent={(item) => { this.setState({ seletectedApi: item, showDelete: true }); }} />,
            },
            selectedMasterItem: new ObservableValue<IApi>(apis[0]),
            parentItem: undefined,
          }, () => { })}>
          <div className="flex-row flex-grow">
            <MasterPanel />
            <DetailsPanel />
          </div>
        </MasterDetailsContext.Provider>}

        <ApiPanel show={showAdd} onDismiss={() => { this.setState({ showAdd: false, loading: true }); this.loadApis() }} />
        <ApiModal show={showDelete} api={seletectedApi} onDismiss={() => { this.setState({ seletectedApi: null, showDelete: false }); }} onConfirm={() => { this.deleteApi(this); }} />

      </Page>
    );
  }
}

export default Api;
