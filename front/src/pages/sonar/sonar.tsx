import React from 'react';
import './sonar.scss';

import {
  CustomHeader,
  HeaderDescription,
  HeaderTitle,
  HeaderTitleArea,
  HeaderTitleRow,
  TitleSize
} from "azure-devops-ui/Header";

import { Button } from 'azure-devops-ui/Button';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { Page } from 'azure-devops-ui/Page';

import { FilterBar } from "azure-devops-ui/FilterBar";
import { Observer } from "azure-devops-ui/Observer";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { Filter, FILTER_CHANGE_EVENT, FilterOperatorType } from "azure-devops-ui/Utilities/Filter";
import {
  DropdownSelection,
  DropdownMultiSelection
} from "azure-devops-ui/Utilities/DropdownSelection";
import { DropdownFilterBarItem } from "azure-devops-ui/Dropdown";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Card } from 'azure-devops-ui/Card';


const stats = [
  {
    label: "Points",
    value: 340
  },
  {
    label: "3PM",
    value: 23
  },
  {
    label: "Rebounds",
    value: 203
  },
  {
    label: "Assists",
    value: 290
  },
  {
    label: "Steals",
    value: 56
  }
];

interface ISonarState {
}

class Sonar extends React.Component<{}, ISonarState>  {

  private filter: Filter;
  private currentState = new ObservableValue("");
  private selectionSingleList = new DropdownSelection();
  private selectionMultiList = new DropdownMultiSelection();
  private selectionEmptyList = new DropdownMultiSelection();


  constructor(props: {}) {
    super(props);

    this.filter = new Filter();
    this.filter.setFilterItemState("listMulti", {
      value: [],
      operator: FilterOperatorType.and
    });
    this.filter.subscribe(() => {
      this.currentState.value = JSON.stringify(this.filter.getState(), null, 4);
    }, FILTER_CHANGE_EVENT);
  }

  render() {
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
              Projects list generated from templates
            </HeaderDescription>
          </HeaderTitleArea>
          <ButtonGroup>
            <Button ariaLabel="Settings" iconProps={{ iconName: "Settings" }}
              onClick={() => this.setState({ settingsExpanded: true })}
            />
          </ButtonGroup>
        </CustomHeader>

        <div className="page-content page-content-top">

          <div className="flex-grow">
            <FilterBar filter={this.filter}>
              <KeywordFilterBarItem filterItemKey="Placeholder" />

              <DropdownFilterBarItem
                filterItemKey="listSingle"
                filter={this.filter}
                items={[]}
                selection={this.selectionSingleList}
                placeholder="Status"
              />

            </FilterBar>
          </div>


          <div style={{ marginTop: "10px" }}>
            <Card titleProps={{ text: "Eleven.Service.Mail 🏀", ariaLevel: 3 }}
              headerDescriptionProps={{ text: "Last analysis: 2 days ago" }}
            >
              <div className="flex-row" style={{ flexWrap: "wrap" }}>
                {stats.map((items, index) => (
                  <div className="flex-column" style={{ minWidth: "120px" }} key={index}>
                    <div className="body-m secondary-text">{items.label}</div>
                    <div className="body-m primary-text">{items.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>


        </div>

      </Page>
    );
  }
}

export default Sonar;
