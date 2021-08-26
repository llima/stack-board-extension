import React from 'react';
import './api-panel.scss';

import { Panel } from "azure-devops-ui/Panel";
import { TextField } from "azure-devops-ui/TextField";
import { IApi } from '../../model/api';
import { Guid } from 'guid-typescript';
import { Services } from '../../services/services';
import { IApiService, ApiServiceId } from '../../services/api';

export interface IApiPanelProps {
  show: boolean;
  onDismiss: any;
}

interface IApiPanelState {
  currentApi: IApi;
  creating: boolean;
}

class ApiPanel extends React.Component<IApiPanelProps, IApiPanelState>  {

  service = Services.getService<IApiService>(
    ApiServiceId
  );

  constructor(props: IApiPanelProps) {
    super(props);
    this.state = {
      currentApi: this.getStartValue(),
      creating: false
    };
  }

  getStartValue(): IApi {
    return {
      id: "",
      name: "",
      url: ""
    };
  }

  close(that: this) {
    that.setState({ currentApi: that.getStartValue(), creating: false }, () => {
      that.props.onDismiss();
    });
  }

  onInputChange(event: React.ChangeEvent, value: string, that: this) {
    var prop = event.target.id.replace("__bolt-", "");
    that.setState(prevState => ({
      currentApi: {...prevState.currentApi, [prop]: value}
    }));
  }

  isValid(): boolean {
    const { currentApi } = this.state;

    return (
      currentApi.name && currentApi.name.trim() !== "" &&
      currentApi.url && currentApi.url.trim() !== ""
    );
  }

  async createNewApi(that: this) {

    that.setState({ creating: true });

    var item = that.state.currentApi;
    item.id = Guid.create().toString();

    that.service.saveApi(item).then(item => {
      that.close(that);
    });
  }

  render() {

    const { currentApi, creating } = this.state;

    if (this.props.show) {
      return (
        <Panel
          onDismiss={() => {
            this.close(this);
          }}
          titleProps={{ text: "Register new api" }}
          description={"Register new api from url swagger."}
          footerButtonProps={[
            {
              text: "Cancel", onClick: (event) => {
                this.close(this);
              }
            },
            {
              text: creating ? "Registring..." : "Register",
              primary: true,
              onClick: (event) => {
                this.createNewApi(this)
              },
              disabled: !this.isValid() || creating
            }
          ]}>

          <div className="api--content">

            <div className="api--group">
              <TextField
                inputId="name"
                label="Name *"
                value={currentApi.name}
                placeholder="Name your api name"
                onChange={(event, value) => this.onInputChange(event, value, this)}
              />
            </div>

            <div className="api--group">

              <TextField
                inputId="url"
                label="Swagger url *"
                value={currentApi.url}
                placeholder="e.g.  https://petstore.swagger.io/v2/swagger.json"
                onChange={(event, value) => this.onInputChange(event, value, this)}
              />

            </div>
          </div>
        </Panel >
      );
    }
    return null;
  }
}

export default ApiPanel;
