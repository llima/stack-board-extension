import React from 'react';
import './api-modal.scss';

import { TextField } from "azure-devops-ui/TextField";
import { IApi } from '../../model/api';

import { CustomDialog } from "azure-devops-ui/Dialog";
import { PanelContent, PanelFooter } from "azure-devops-ui/Panel";
import { CustomHeader, HeaderTitleArea } from 'azure-devops-ui/Header';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { Button } from 'azure-devops-ui/Button';


export interface IApiModalProps {
  show: boolean;
  onDismiss: any;
  onConfirm: any;
  api: IApi;
}

interface IApiModalState {
  nameValidation: string;
}

class ApiModal extends React.Component<IApiModalProps, IApiModalState>  {

  constructor(props: IApiModalProps) {
    super(props);
    this.state = {
      nameValidation: ""
    };
  }

  isDeleteValid(): boolean {
    return (
      this.props.api.name.toLocaleLowerCase() === this.state.nameValidation.toLocaleLowerCase()
    );
  }

  close(that: this) {
    that.setState({ nameValidation: "" }, () => {
      that.props.onDismiss();
    });
  }

  confirm(that: this) {
    that.setState({ nameValidation: "", }, () => {
      that.props.onConfirm();
    });
  }

  render() {

    const { nameValidation } = this.state;
    const { api } = this.props;

    if (this.props.show) {
      return (
        <CustomDialog
          onDismiss={() => this.close(this)}
          modal={true}>
          <CustomHeader className="bolt-header-with-commandbar" separator>
            <HeaderTitleArea>
              <div className="flex-grow scroll-hidden">
                <div className="title-m">
                  Delete '{api.name}'?
                </div>
              </div>
            </HeaderTitleArea>
          </CustomHeader>
          <PanelContent>
            <div className="flex-column flex-grow api-modal--content">
              <div className="api-modal--group">
                This api will be permanently deleted. This is a destructive operation.
              </div>
              <div className="flex-column api-modal--group">
                <TextField
                  inputId="name"
                  label="Please type the name of the api to confirm."
                  value={nameValidation}
                  onChange={(event, value) => this.setState({ nameValidation: value })}
                />
              </div>
            </div>
          </PanelContent>
          <PanelFooter showSeparator className="body-m">
            <ButtonGroup className="template--add-button">
              <Button
                text="Cancel"
                subtle={true}
                onClick={() => this.close(this)} />
              <Button
                text="Delete"
                danger={true}
                disabled={!this.isDeleteValid()}
                onClick={() => this.confirm(this)} />
            </ButtonGroup>
          </PanelFooter>
        </CustomDialog>
      );
    }
    return null;
  }
}

export default ApiModal;
