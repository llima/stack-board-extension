import React from 'react';
import './radar.scss';

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

interface IRadarState {
}

class Radar extends React.Component<{}, IRadarState>  {


  render() {
    return (
      <Page>
        <CustomHeader className="bolt-header-with-commandbar">
          <HeaderTitleArea>
            <HeaderTitleRow>
              <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
                Tech Radar
              </HeaderTitle>
            </HeaderTitleRow>
          </HeaderTitleArea>
          <ButtonGroup>
            <Button text="Create" iconProps={{ iconName: "Add" }} primary={true}
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

export default Radar;
