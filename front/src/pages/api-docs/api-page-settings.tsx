import * as React from "react";

import { Card } from "azure-devops-ui/Card";
import { IObservableValue } from "azure-devops-ui/Core/Observable";
import { ScreenSize } from "azure-devops-ui/Core/Util/Screen";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IListItemDetails, List, ListItem, ListSelection } from "azure-devops-ui/List";

import {
    bindSelectionToObservable,
    MasterDetailsContext,
} from "azure-devops-ui/MasterDetailsContext";

import { Page } from "azure-devops-ui/Page";

import { Tooltip } from "azure-devops-ui/TooltipEx";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ScreenSizeObserver } from "azure-devops-ui/Utilities/ScreenSize";

import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

import { IApi } from "../../model/api";
import Api from "./api-page";

export const SampleData2: IApi[] = [
    {
        id: "1",
        name: "Eleven.Service.Push",
        url: "https://petstore.swagger.io/v2/swagger.json",
    },
    {
        id: "2",
        name: "Eleven.Service.User",
        url: "https://generator.swagger.io/api/swagger.json",
    },
    {
        id: "3",
        name: "Eleven.Service.Report",
        url: "https://petstore.swagger.io/v2/swagger.json",
    },
];

export const ListView: React.FunctionComponent<{
    initialSelectedMasterItem: IObservableValue<IApi>;
    initialItems: IApi[];
    that: Api;
}> = (props) => {
    const [initialItemProvider] = React.useState(new ArrayItemProvider(props.initialItems));
    const [initialSelection] = React.useState(new ListSelection({ selectOnFocus: false }));
    const masterDetailsContext = React.useContext(MasterDetailsContext);

    React.useEffect(() => {
        bindSelectionToObservable(
            initialSelection,
            initialItemProvider,
            props.initialSelectedMasterItem,
        );
    });

    return (
        <List
            ariaLabel={"APIs list"}
            itemProvider={initialItemProvider}
            selection={initialSelection}
            renderRow={renderListRow}
            width="100%"
            onSelect={(item) => { masterDetailsContext.setDetailsPanelVisbility(true); props.that.setState({ seletectedApi: props.initialSelectedMasterItem.value }) }}
        />
    );
};

export const DetailView: React.FunctionComponent<{
    detailItem: IApi;
    deleteEvent: any
}> = (props) => {
    const masterDetailsContext = React.useContext(MasterDetailsContext);
    const { detailItem, deleteEvent } = props;

    return (
        <Page className="flex-grow">
            <ScreenSizeObserver>
                {(screenSizeProps: { screenSize: ScreenSize }) => {
                    const showBackButton = screenSizeProps.screenSize <= ScreenSize.small;
                    return (
                        <Header
                            description={detailItem.url}
                            descriptionClassName="description-primary-text"
                            title={detailItem.name}
                            titleClassName="details-view-title"
                            titleSize={TitleSize.Large}
                            backButtonProps={showBackButton ? { onClick: () => masterDetailsContext.setDetailsPanelVisbility(false) } : undefined}
                            commandBarItems={[
                                {
                                    id: "delete",
                                    text: "Delete",
                                    important: false,
                                    onActivate: () => {
                                        deleteEvent(detailItem)
                                    }
                                },
                            ]}
                        />
                    );
                }}
            </ScreenSizeObserver>
            <div className="page-content page-content-top">
                <Card>
                    <SwaggerUI url={detailItem.url} />
                </Card>
            </div>
        </Page>
    );
};

const renderListRow = (
    index: number,
    item: IApi,
    details: IListItemDetails<IApi>,
    key?: string
): JSX.Element => {
    return (
        <ListItem
            className="master-row"
            key={key || "list-item" + index}
            index={index}
            details={details}
        >
            <div className="master-row-content flex-row flex-center h-scroll-hidden">
                <div className="flex-column text-ellipsis">
                    <Tooltip overflowOnly={true}>
                        <div className="primary-text text-ellipsis">{item.name}</div>
                    </Tooltip>
                    <Tooltip overflowOnly={true}>
                        <span className="fontSizeMS font-size-ms text-ellipsis secondary-text">
                            {item.url}
                        </span>

                    </Tooltip>
                </div>
            </div>
        </ListItem>
    );
};