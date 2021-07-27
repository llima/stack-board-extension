import React from 'react';
import './api.scss';

import {
  CustomHeader,
  HeaderTitle,
  HeaderTitleArea,
  HeaderTitleRow,
  TitleSize
} from "azure-devops-ui/Header";

import { Button } from 'azure-devops-ui/Button';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { Page } from 'azure-devops-ui/Page';

interface IApiState {
}

class Api extends React.Component<{}, IApiState>  {

  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <Page>
        <CustomHeader className="bolt-header-with-commandbar">
          <HeaderTitleArea>
            <HeaderTitleRow>
              <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
                API Documentation
              </HeaderTitle>
            </HeaderTitleRow>
          </HeaderTitleArea>
          <ButtonGroup>
            <Button text="Create" iconProps={{ iconName: "Register" }} primary={true}
              onClick={() => this.setState({ templateExpanded: true })}
            />
            <Button ariaLabel="Add" iconProps={{ iconName: "Settings" }}
              onClick={() => this.setState({ settingsExpanded: true })}
            />
          </ButtonGroup>
        </CustomHeader>

        <div className="page-content page-content-top">

        
        </div>

      </Page>
    );
  }
}

export default Api;
