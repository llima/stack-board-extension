import React from 'react';
import './project-modal.scss';

import { TextField } from "azure-devops-ui/TextField";
import { IProject } from '../../model/project';

import { RadioButton, RadioButtonGroup } from "azure-devops-ui/RadioButton";
import { CustomDialog } from "azure-devops-ui/Dialog";
import { PanelContent, PanelFooter } from "azure-devops-ui/Panel";
import { CustomHeader, HeaderTitleArea } from 'azure-devops-ui/Header';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { Button } from 'azure-devops-ui/Button';


export interface IProjectModalProps {
  show: boolean;
  onDismiss: any;
  onConfirm: any;
  project: IProject;
}

interface IProjectModalState {
  nameValidation: string;
  deleteType: string;
}

class ProjectModal extends React.Component<IProjectModalProps, IProjectModalState>  {

  constructor(props: IProjectModalProps) {
    super(props);
    this.state = {
      nameValidation: "",
      deleteType: "project"
    };
  }

  isDeleteValid(): boolean {
    return (
      this.props.project.name.toLocaleLowerCase() === this.state.nameValidation.toLocaleLowerCase()
    );
  }

  close(that: this) {
    that.setState({ nameValidation: "", deleteType: "project" }, () => {
      that.props.onDismiss();
    });
  }

  confirm(that: this) {
    var type = that.state.deleteType;
    that.setState({ nameValidation: "", deleteType: "project" }, () => {
      that.props.onConfirm(type);
    });
  }

  render() {

    const { nameValidation, deleteType } = this.state;
    const { project } = this.props;

    if (this.props.show) {
      return (
        <CustomDialog
          onDismiss={() => this.close(this)}
          modal={true}>
          <CustomHeader className="bolt-header-with-commandbar" separator>
            <HeaderTitleArea>
              <div className="flex-grow scroll-hidden">
                <div className="title-m">
                  Delete '{project.name}'?
                </div>
              </div>
            </HeaderTitleArea>
          </CustomHeader>
          <PanelContent>
            <div className="flex-column flex-grow project-modal--content">
              <div className="project-modal--group">
                This project will be permanently deleted. This is a destructive operation.
              </div>
              <RadioButtonGroup className="project-modal--group"
                onSelect={selectedId => { console.log(selectedId); this.setState({ deleteType: selectedId })}}
                selectedButtonId={deleteType}
                text={"What type of exclusion?"}>
                <RadioButton id="project" text="Project" />
                <RadioButton id="all" text="Project + Repository" />
              </RadioButtonGroup>
              <div className="flex-column project-modal--group">
                <TextField
                  inputId="name"
                  label="Please type the name of the project to confirm."
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

export default ProjectModal;
