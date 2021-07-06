import React from 'react';
import './App.css';
import { Card } from "azure-devops-ui/Card";
import {
    CustomHeader,
    HeaderDescription,
    HeaderIcon,
    HeaderTitle,
    HeaderTitleArea,
    HeaderTitleRow,
    TitleSize
} from "azure-devops-ui/Header";
import { HeaderCommandBar } from "azure-devops-ui/HeaderCommandBar";
import { Page } from "azure-devops-ui/Page";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";


function App() {
  
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
        
      </CustomHeader>

      <div className="page-content page-content-top">
        <Card>Page content</Card>
      </div>
    </Page>

  );
}

export default App;
