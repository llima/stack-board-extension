import React from 'react';
import './app.scss';

import {
  CustomHeader,
  HeaderDescription,
  HeaderTitle,
  HeaderTitleArea,
  HeaderTitleRow,
  TitleSize
} from "azure-devops-ui/Header";

import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";
import Settings from './components/settings';
import Template from './components/template';


interface IAppState {
  settingsExpanded: boolean;
  createExpanded: boolean;
}

class App extends React.Component<{}, IAppState>  {

  constructor(props: {}) {
    super(props);
    this.state = {
      settingsExpanded: false,
      createExpanded: false
    };
  }

  render() {
    return (
      <Page>
        <CustomHeader className="bolt-header-with-commandbar">
          <HeaderTitleArea>
            <HeaderTitleRow>
              <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
                #3: Add new header to sample site
              </HeaderTitle>
            </HeaderTitleRow>
            <HeaderDescription>
              Validation of 405810 triggered today at 6:27 pm
            </HeaderDescription>
          </HeaderTitleArea>
          <ButtonGroup>
            <Button text="Create" iconProps={{ iconName: "Add" }} primary={true}
              onClick={() => this.setState({ createExpanded: true })}
            />
            <Button ariaLabel="Add" iconProps={{ iconName: "Settings" }}
              onClick={() => this.setState({ settingsExpanded: true })}
            />
          </ButtonGroup>
        </CustomHeader>

        <div className="page-content page-content-top">
          
          <Card>Page content</Card>
          <Card>Page content</Card>
          <Card>Page content</Card>
        </div>

        <Settings show={this.state.settingsExpanded} onDismiss={() => this.setState({ settingsExpanded: false })} />

        <Template show={this.state.createExpanded} onDismiss={() => this.setState({ createExpanded: false })} />

      </Page>
    );
  }
}

export default App;
