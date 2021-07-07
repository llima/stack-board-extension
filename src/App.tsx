import React from 'react';
import './App.css';

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
import { Panel } from "azure-devops-ui/Panel";
import { Button } from "azure-devops-ui/Button";
import { ButtonGroup } from "azure-devops-ui/ButtonGroup";

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

        {this.state.createExpanded && (
          <Panel
            onDismiss={() => this.setState({ createExpanded: false })}
            titleProps={{ text: "Sample Panel Title" }}
            description={
              "A description of the header. It can expand to multiple lines. Consumers should try to limit this to a maximum of three lines."
            }
            footerButtonProps={[
              { text: "Cancel", onClick: () => this.setState({ createExpanded: false }) },
              { text: "Save", primary: true }
            ]}>

            <div style={{ height: "1200px" }}>
              Panel Content
            </div>
          </Panel>
        )}

        {this.state.settingsExpanded && (
          <Panel
            onDismiss={() => this.setState({ settingsExpanded: false })}
            titleProps={{ text: "Sample Panel Title" }}
            description={
              "A description of the header. It can expand to multiple lines. Consumers should try to limit this to a maximum of three lines."
            }
            footerButtonProps={[
              { text: "Cancel", onClick: () => this.setState({ settingsExpanded: false }) },
              { text: "Save", primary: true }
            ]}>

            <div style={{ height: "1200px" }}>
              Panel Content
            </div>
          </Panel>
        )}

      </Page>
    );
  }
}

export default App;
