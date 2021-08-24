import React from 'react';
import './code-page.scss';

import {
  CustomHeader,
  HeaderDescription,
  HeaderIcon,
  HeaderTitle,
  HeaderTitleArea,
  HeaderTitleRow,
  TitleSize
} from "azure-devops-ui/Header";

import { Button } from 'azure-devops-ui/Button';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { Page } from 'azure-devops-ui/Page';
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Card } from 'azure-devops-ui/Card';
import { Pill } from 'azure-devops-ui/Components/Pill/Pill';

import { Tab, TabBar, TabSize } from 'azure-devops-ui/Tabs';
import { Services } from '../../services/services';
import { ISonarService, SonarServiceId } from '../../services/sonar';
import { ISonarBranch, ISonarComponent } from '../../model/sonar';
import { Duration } from 'azure-devops-ui/Duration';
import { MessageCard, MessageCardSeverity } from 'azure-devops-ui/MessageCard';
import { configureMeasure, renderBranchStatus, } from './code-page-settings';

import CodePanel from '../../components/code-quality/code-panel';
import { Spinner } from '@fluentui/react';
import { ZeroData, ZeroDataActionType } from 'azure-devops-ui/ZeroData';
import { CodeServiceId, ICodeService } from '../../services/code';

interface ICodeState {
  settingsExpanded: boolean;
  loading: boolean;
  components: ISonarComponent[];
  selectedTabs: string[];
}

class Code extends React.Component<{}, ICodeState>  {

  sonarService = Services.getService<ISonarService>(SonarServiceId);
  codeService = Services.getService<ICodeService>(CodeServiceId);

  constructor(props: {}) {
    super(props);

    this.state = {
      settingsExpanded: false,
      loading: true,
      components: [],
      selectedTabs: []
    };

    this.loadComponents();

  }

  async loadComponents() {

    var selectedTabs: string[] = [];

    try {

      var configs = await this.codeService.getCode();

      if (configs.length > 0) {
        var config = configs[0];

        var components = await this.sonarService.loadComponents(config.server, config.token);

        for (let c = 0; c < components.length; c++) {
          const component = components[c];
          var branches = (await this.sonarService.loadBranches(config.server, config.token, component.key)).filter(b => b.analysisDate);

          for (let b = 0; b < branches.length; b++) {
            const branch = branches[b];

            if (b === 0)
              selectedTabs.push(component.key + "_" + branch.name)

            branch.measures = await this.sonarService.loadMeasures(config.server, config.token, component.key, branch.name);
          }
          component.branches = branches;
        }
        this.setState({ components: components, selectedTabs: selectedTabs, loading: false });
      }
      else {
        this.setState({ loading: false });
      }

    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  }

  onSelectedTabChanged = (newTabId: string, componentKey: string) => {

    var selectedTabs = this.state.selectedTabs.filter(t => !t.startsWith(componentKey))
    selectedTabs.push(newTabId);

    this.setState({ selectedTabs: selectedTabs });
  };

  getCurrentBranch = (component: ISonarComponent): ISonarBranch => {

    var selectedTab = this.state.selectedTabs.filter(t => t.startsWith(component.key))[0]
    if (selectedTab) {
      var branchName = selectedTab.replace(component.key + "_", "");
      return component.branches.filter(b => b.name == branchName)[0];
    }
    return component.branches[0];
  };

  render() {

    const { settingsExpanded, components, selectedTabs, loading } = this.state;

    return (
      <Page className="flex-grow">

        <CustomHeader className="bolt-header-with-commandbar">
          <HeaderTitleArea>
            <HeaderTitleRow>
              <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
                Code quality
              </HeaderTitle>
            </HeaderTitleRow>
            <HeaderDescription>
              Integration with code review and analysis tools (Sonarqube)
            </HeaderDescription>
          </HeaderTitleArea>
          <ButtonGroup>
            <Button ariaLabel="Settings" iconProps={{ iconName: "Settings" }}
              onClick={() => this.setState({ settingsExpanded: true })}
            />
          </ButtonGroup>
        </CustomHeader>

        <div className="page-content">

          {!loading && components.length === 0 && <ZeroData
            primaryText="Register your first tool"
            secondaryText={
              <span>
                Integrate with code review and analysis tools (Sonarqube).
              </span>
            }
            imageAltText="Bars"
            imagePath={"https://cdn.vsassets.io/ext/ms.vss-code-web/import-content/repoNotFound.bVoHtlP2mhhyPo5t.svg"}
            actionText="Register"
            actionType={ZeroDataActionType.ctaButton}
            onActionClick={(event, item) =>
              this.setState({ settingsExpanded: true })
            } />
          }

          {loading && <div className="api-page--loading">
            <Spinner label="loading" />
          </div>}

          {components.map((component, index) => (

            <div>

              <CustomHeader className="bolt-header-with-commandbar code--title">
                <HeaderIcon
                  className="bolt-table-status-icon-large code--status"
                  iconProps={{
                    render: (className?: string) => {
                      return renderBranchStatus(this.getCurrentBranch(component), className);
                    }
                  }}
                  titleSize={TitleSize.Large}
                />
                <HeaderTitleArea>
                  <HeaderTitleRow>
                    <HeaderTitle ariaLevel={3} className="text-ellipsis" titleSize={TitleSize.Large}>
                      {component.name}
                    </HeaderTitle>
                  </HeaderTitleRow>
                  <HeaderDescription>

                    {component.branches.length > 0 &&
                      <span className="fontSize secondary-text flex-row flex-center text-ellipsis">
                        <span style={{ flexShrink: 10000 }}>
                          Last analysis:
                          <Duration
                            startDate={new Date(this.getCurrentBranch(component).analysisDate)}
                            endDate={new Date()}
                          /> ago
                        </span>
                        <div className="flex-row ">
                          <TabBar
                            onSelectedTabChanged={(newTabId: string) => { this.onSelectedTabChanged(newTabId, component.key) }}
                            selectedTabId={selectedTabs.filter(t => t.startsWith(component.key))[0]}
                            tabSize={TabSize.Compact}
                          >
                            {component.branches.map((branch, index) => (
                              <Tab name={branch.name} id={component.key + "_" + branch.name} iconProps={{ iconName: "OpenSource" }} />
                            ))}

                          </TabBar>
                        </div>
                      </span>
                    }

                    {component.branches.length === 0 &&
                      <span style={{ flexShrink: 10000 }}>
                        No analysis was performed
                      </span>
                    }

                  </HeaderDescription>
                </HeaderTitleArea>

              </CustomHeader>

              {component.branches.length === 0 &&
                <MessageCard
                  className="flex-self-stretch"
                  severity={MessageCardSeverity.Info}
                >
                  There is no branch configured for this project
                </MessageCard>
              }

              {component.branches.map((branch, index) => {
                return (selectedTabs.filter(t => t.startsWith(component.key + "_" + branch.name)).length > 0 && <Card>
                  <div className="flex-row" style={{ flexWrap: "wrap", marginTop: "20px" }}>
                    {branch.measures.sortByProp("metric").map((measure, index) => {
                      var item = configureMeasure(measure);
                      return (item != null &&
                        <div className="flex-column" style={{ minWidth: "120px" }} key={index}>
                          <div className="body-m primary-text">{item.icon} {item.label}</div>
                          <div className="body-m primary-text">
                            <h2 className="code--number">
                              {item.value}
                            </h2>
                            {item.status && <Pill className={"code--tag code--tag--" + item.status}>{item.status}</Pill>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>)
              })}
            </div>


          ))}
        </div>

        <CodePanel show={settingsExpanded} onDismiss={() => { this.setState({ settingsExpanded: false, loading: true }); }} />
      </Page>
    );
  }
}

export default Code;
