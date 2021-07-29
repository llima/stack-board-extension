import React from 'react';
import './api-modal.scss';

import { TextField } from "azure-devops-ui/TextField";
import { IApi } from '../../model/api';

import { RadioButton, RadioButtonGroup } from "azure-devops-ui/RadioButton";
import { CustomDialog } from "azure-devops-ui/Dialog";
import { PanelContent, PanelFooter } from "azure-devops-ui/Panel";
import { CustomHeader, HeaderTitleArea } from 'azure-devops-ui/Header';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { Button } from 'azure-devops-ui/Button';


export interface IApiModalProps {
  show: boolean;
  onDismiss: any;
  onConfirm: any;
}

interface IApiModalState {
  nameValidation: string;
  deleteType: string;
}

class ApiModal extends React.Component<IApiModalProps, IApiModalState>  {

  constructor(props: IApiModalProps) {
    super(props);
    this.state = {
      nameValidation: "",
      deleteType: "api"
    };
  }


  close(that: this) {
    that.setState({ nameValidation: "", deleteType: "api" }, () => {
      that.props.onDismiss();
    });
  }

  confirm(that: this) {
    var type = that.state.deleteType;
    that.setState({ nameValidation: "", deleteType: "api" }, () => {
      that.props.onConfirm(type);
    });
  }

  render() {

    const { nameValidation, deleteType } = this.state;
    
    if (this.props.show) {
      return (
        <CustomDialog
          onDismiss={() => this.close(this)}
          modal={true}>
          <CustomHeader className="bolt-header-with-commandbar" separator>
            <HeaderTitleArea>
              <div className="flex-grow scroll-hidden">
                <div className="title-m">
                  Add ?
                </div>
              </div>
            </HeaderTitleArea>
          </CustomHeader>
          <PanelContent>
            <div className="flex-column flex-grow api-modal--content">
             
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
