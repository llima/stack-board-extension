import * as React from "react";
import "./api.scss";

import { Card } from "azure-devops-ui/Card";
import { IObservableValue, ObservableValue } from "azure-devops-ui/Core/Observable";
import { ScreenSize } from "azure-devops-ui/Core/Util/Screen";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IListItemDetails, List, ListItem, ListSelection } from "azure-devops-ui/List";
import { MasterPanelHeader } from "azure-devops-ui/MasterDetails";
import {
    BaseMasterDetailsContext,
    bindSelectionToObservable,
    IMasterDetailsContext,
    IMasterDetailsContextLayer,
    MasterDetailsContext,
} from "azure-devops-ui/MasterDetailsContext";
import { Page } from "azure-devops-ui/Page";

import { TextField, TextFieldStyle } from "azure-devops-ui/TextField";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ScreenSizeObserver } from "azure-devops-ui/Utilities/ScreenSize";


import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

interface ISamplePullRequestData {
    url: string;
    pullRequestTitle: string;
    userName: string;
}

const SampleData: ISamplePullRequestData[] = [
    {
        pullRequestTitle: "Eleven.Service.Push",
        userName: "Cecil Folk",
        url: "https://petstore.swagger.io/v2/swagger.json",
    },
    {
        pullRequestTitle: "Eleven.Service.User",
        userName: "Cecil Folk",
        url: "https://petstore.swagger.io/v2/swagger.json",
    },
    {
        pullRequestTitle: "Eleven.Service.Report",
        userName: "Ashley McCarthy",
        url: "https://petstore.swagger.io/v2/swagger.json",
    },
];

const renderInitialRow = (
    index: number,
    item: ISamplePullRequestData,
    details: IListItemDetails<ISamplePullRequestData>,
    key?: string
): JSX.Element => {
    return (
        <ListItem
            className="master-example-row"
            key={key || "list-item" + index}
            index={index}
            details={details}
        >
            <div className="master-example-row-content flex-row flex-center h-scroll-hidden">
                <div className="flex-column text-ellipsis">
                    <Tooltip overflowOnly={true}>
                        <div className="primary-text text-ellipsis">{item.pullRequestTitle}</div>
                    </Tooltip>
                    <Tooltip overflowOnly={true}>
                        <div className="primary-text text-ellipsis">{item.userName}</div>
                    </Tooltip>
                </div>
            </div>
        </ListItem>
    );
};

const initialPayload: IMasterDetailsContextLayer<ISamplePullRequestData, undefined> = {
    key: "initial",
    masterPanelContent: {
        renderContent: (parentItem, initialSelectedMasterItem) => (
            <InitialMasterPanelContent initialSelectedMasterItem={initialSelectedMasterItem} />
        ),
        renderHeader: () => <MasterPanelHeader title={"APIs"} />,
        renderSearch: () => (
            <TextField
                prefixIconProps={{ iconName: "Search" }}
                placeholder="Search does not work"
                style={TextFieldStyle.inline}
            />
        ),
        hideBackButton: true,
    },
    detailsContent: {
        renderContent: (item) => <InitialDetailView detailItem={item} />,
    },
    selectedMasterItem: new ObservableValue<ISamplePullRequestData>(SampleData[0]),
    parentItem: undefined,
};

const InitialMasterPanelContent: React.FunctionComponent<{
    initialSelectedMasterItem: IObservableValue<ISamplePullRequestData>;
}> = (props) => {
    const [initialItemProvider] = React.useState(new ArrayItemProvider(SampleData));
    const [initialSelection] = React.useState(new ListSelection({ selectOnFocus: false }));
    const masterDetailsContext = React.useContext(MasterDetailsContext);

    React.useEffect(() => {
        bindSelectionToObservable(
            initialSelection,
            initialItemProvider,
            props.initialSelectedMasterItem
        );
    });

    return (
        <List
            ariaLabel={"Engineering master list"}
            itemProvider={initialItemProvider}
            selection={initialSelection}
            renderRow={renderInitialRow}
            width="100%"
            onSelect={() => masterDetailsContext.setDetailsPanelVisbility(true)}
        />
    );
};

const InitialDetailView: React.FunctionComponent<{
    detailItem: ISamplePullRequestData;
}> = (props) => {
    const masterDetailsContext = React.useContext(MasterDetailsContext);
    const { detailItem } = props;


    return (
        <Page className="context-details">
            <ScreenSizeObserver>
                {(screenSizeProps: { screenSize: ScreenSize }) => {
                    const showBackButton = screenSizeProps.screenSize <= ScreenSize.small;
                    return (
                        <Header
                            description={"Created by " + detailItem.userName}
                            descriptionClassName="description-primary-text"
                            title={detailItem.pullRequestTitle}
                            titleClassName="details-view-title"
                            titleSize={TitleSize.Large}
                            backButtonProps={showBackButton ? { onClick: () => masterDetailsContext.setDetailsPanelVisbility(false), } : undefined
                            }
                        />
                    );
                }}
            </ScreenSizeObserver>
            <div className="page-content page-content-top">
                <Card className="bolt-card-no-vertical-padding" contentProps={{ contentPadding: false }}>
                    <SwaggerUI url={detailItem.url} />
                </Card>
            </div>
        </Page>
    );
};

export const masterDetailsContext: IMasterDetailsContext = new BaseMasterDetailsContext(
    initialPayload, () => { }
);