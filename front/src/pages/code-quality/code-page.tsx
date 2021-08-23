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

import { InlineKeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { Filter, FILTER_CHANGE_EVENT, FilterOperatorType } from "azure-devops-ui/Utilities/Filter";

import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Card } from 'azure-devops-ui/Card';

import { AiFillBug } from "react-icons/ai";
import { FaRadiationAlt } from "react-icons/fa";
import { GiPadlock, GiCheckedShield } from "react-icons/gi";
import { Pill } from 'azure-devops-ui/Components/Pill/Pill';
import { IColor } from 'azure-devops-extension-api';
import { Status, Statuses } from 'azure-devops-ui/Components/Status/Status';
import { StatusSize } from 'azure-devops-ui/Status';
import { Link } from 'azure-devops-ui/Link';
import { Icon } from 'azure-devops-ui/Icon';
import { MenuButton, IMenuItem, MenuItemType } from "azure-devops-ui/Menu";

import CodePanel from '../../components/code-quality/code-panel';
import { Dropdown } from 'azure-devops-ui/Dropdown';
import { Observer } from 'azure-devops-ui/Observer';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { Tab, TabBar, TabSize } from 'azure-devops-ui/Tabs';

const menuItems: IMenuItem[] = [
  { id: "one", text: "MenuItem 1" },
  { id: "two", text: "MenuItem 2" },
  { id: "three", text: "MenuItem 3" },
  { id: "separator", itemType: MenuItemType.Divider },
  { id: "four", text: "MenuItem 4" },
  { id: "five", text: "MenuItem 5" }
];

const items =
  [
    {
      Title: "Eleven.Service.Mail",
      status: "passed",
      Props: [
        {
          label: "Bugs",
          value: 1,
          status: "C",
          icon: <AiFillBug className="icon-tools" />

        },
        {
          label: "Vulnerabilities",
          value: 0,
          status: "A",
          icon: <GiPadlock className="icon-tools" />
        },
        {
          label: "Hotspots",
          value: "0.0%",
          status: "E",
          icon: <GiCheckedShield className="icon-tools" />
        },
        {
          label: "Code Smells",
          value: 14,
          status: "A",
          icon: <FaRadiationAlt className="icon-tools" />
        },
        {
          label: "Coverage",
          value: "0.0%"
        },
        {
          label: "Duplications",
          value: "2.7%"
        },
        {
          label: "Lines",
          value: "1.1k",
          status: "S"
        }
      ]
    },
    {
      Title: "Eleven.Service.Push",
      status: "fail",
      Props: [
        {
          label: "Bugs",
          value: 9,
          status: "E",
          icon: <AiFillBug className="icon-tools" />

        },
        {
          label: "Vulnerabilities",
          value: 0,
          status: "A",
          icon: <GiPadlock className="icon-tools" />
        },
        {
          label: "Hotspots",
          value: "0.0%",
          status: "E",
          icon: <GiCheckedShield className="icon-tools" />
        },
        {
          label: "Code Smells",
          value: 126,
          status: "C",
          icon: <FaRadiationAlt className="icon-tools" />
        },
        {
          label: "Coverage",
          value: "0.0%"
        },
        {
          label: "Duplications",
          value: "3%"
        },
        {
          label: "Lines",
          value: "2.05k",
          status: "S"
        }
      ]
    },
    {
      Title: "Eleven.Service.Report",
      status: "fail",
      Props: [
        {
          label: "Bugs",
          value: 0,
          status: "A",
          icon: <AiFillBug className="icon-tools" />

        },
        {
          label: "Vulnerabilities",
          value: 2,
          status: "E",
          icon: <GiPadlock className="icon-tools" />
        },
        {
          label: "Hotspots",
          value: "0.0%",
          status: "E",
          icon: <GiCheckedShield className="icon-tools" />
        },
        {
          label: "Code Smells",
          value: "4.2K",
          status: "E",
          icon: <FaRadiationAlt className="icon-tools" />
        },
        {
          label: "Coverage",
          value: "0.0%"
        },
        {
          label: "Duplications",
          value: "1.2%"
        },
        {
          label: "Lines",
          value: "6.1k",
          status: "S"
        }
      ]
    }
  ]

interface ICodeState {
  settingsExpanded: boolean;
  loading: boolean;
}

class Code extends React.Component<{}, ICodeState>  {

  private filter: Filter;
  private currentState = new ObservableValue("");
  private selectedTabId = new ObservableValue("tab1");

  constructor(props: {}) {
    super(props);

    this.state = {
      settingsExpanded: false,
      loading: false
    };

    this.filter = new Filter();
    this.filter.setFilterItemState("listMulti", {
      value: [],
      operator: FilterOperatorType.and
    });
    this.filter.subscribe(() => {
      this.currentState.value = JSON.stringify(this.filter.getState(), null, 4);
    }, FILTER_CHANGE_EVENT);
  }

  private onSelectedTabChanged = (newTabId: string) => {
    this.selectedTabId.value = newTabId;
  };

  private onRenderFilterBar = () => {
    return <InlineKeywordFilterBarItem filter={this.filter} filterItemKey="keyword" />;
  };

  private darkColor: IColor = {
    red: 151,
    green: 30,
    blue: 79
  };

  private renderStatus = (className?: string) => {
    return <Status {...Statuses.Success} className={className} size={StatusSize.l} />;
  };

  private selectedItem = new ObservableValue<string>("");

  private onSelect = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<{}>) => {
    this.selectedItem.value = item.text || "";
  };

  render() {

    const { settingsExpanded } = this.state;


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

          {items.map((project, index) => (

            <div>

              <CustomHeader className="bolt-header-with-commandbar code--title">
                <HeaderIcon
                  className="bolt-table-status-icon-large code--status"
                  iconProps={{ render: this.renderStatus }}
                  titleSize={TitleSize.Large}
                />
                <HeaderTitleArea>
                  <HeaderTitleRow>
                    <HeaderTitle ariaLevel={3} className="text-ellipsis" titleSize={TitleSize.Large}>
                      #3: Add new header to sample site
                    </HeaderTitle>
                  </HeaderTitleRow>
                  <HeaderDescription>

                    <span className="fontSize secondary-text flex-row flex-center text-ellipsis">
                      <span style={{ flexShrink: 10000 }}>
                        Last analysis: 3 days ago
                      </span>
                      <div className="flex-row ">
                        <TabBar
                          onSelectedTabChanged={this.onSelectedTabChanged}
                          selectedTabId={this.selectedTabId}
                          tabSize={TabSize.Compact}
                        >
                          <Tab name="develop" id="tab1" iconProps={{ iconName: "OpenSource" }} />
                          <Tab name="main" id="tab2" iconProps={{ iconName: "OpenSource" }} />
                        </TabBar>
                      </div>
                    </span>

                  </HeaderDescription>
                </HeaderTitleArea>

              </CustomHeader>

              <Card>

                <div className="flex-row" style={{ flexWrap: "wrap", marginTop: "20px" }}>
                  {project.Props.map((item, index) => (
                    <div className="flex-column" style={{ minWidth: "120px" }} key={index}>
                      <div className="body-m primary-text">{item.icon} {item.label}</div>
                      <div className="body-m primary-text">
                        <h2 className="code--number">
                          {item.value}
                        </h2>
                        {item.status && <Pill className={"code--tag code--tag--" + item.status}>{item.status}</Pill>}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          ))}
        </div>

        <CodePanel show={settingsExpanded} onDismiss={() => { this.setState({ settingsExpanded: false, loading: true }); }} />
      </Page>
    );
  }
}

export default Code;
