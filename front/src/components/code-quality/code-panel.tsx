import React from 'react';
import './code-panel.scss';

import { Panel } from "azure-devops-ui/Panel";
import { TextField } from "azure-devops-ui/TextField";
import { ICode } from '../../model/code';
import { Guid } from 'guid-typescript';
import { Services } from '../../services/services';
import { ICodeService, CodeServiceId } from '../../services/code';
import { ButtonGroup } from 'azure-devops-ui/ButtonGroup';
import { Button } from 'azure-devops-ui/Button';
import { Card } from 'azure-devops-ui/Card';
import { Checkbox } from "azure-devops-ui/Checkbox";

import { ISonarService, SonarServiceId } from '../../services/sonar';
import { ISonarComponent } from '../../model/sonar';
import { MessageCard, MessageCardSeverity } from 'azure-devops-ui/MessageCard';

export interface ICodePanelProps {
  show: boolean;
  onDismiss: any;
}

interface ICodePanelState {
  currentCode: ICode;
  creating: boolean;
  hasLoadError: boolean;
  components?: ISonarComponent[];
}

class CodePanel extends React.Component<ICodePanelProps, ICodePanelState>  {

  storageService = Services.getService<ICodeService>(CodeServiceId);
  sonarService = Services.getService<ISonarService>(SonarServiceId);

  constructor(props: ICodePanelProps) {
    super(props);
    this.state = {
      currentCode: this.getStartValue(),
      creating: false,
      hasLoadError: false,
      components: []
    };
  }

  getStartValue(): ICode {
    return {
      id: "",
      type: "Sonarqube",
      server: "",
      token: "",
      components: []
    };
  }

  onInputChange(event: React.ChangeEvent, value: string, that: this) {
    var prop = event.target.id.replace("__bolt-", "");
    that.setState(prevState => ({
      currentCode: { ...prevState.currentCode, [prop]: value }
    }));
  }

  isValid(): boolean {
    const { currentCode } = this.state;

    return (
      currentCode.server && currentCode.server.trim() !== "" &&
      currentCode.token && currentCode.token.trim() !== ""
    );
  }

  addComponent(component: ISonarComponent, checked: boolean, that: this) {

    var items = that.state.currentCode.components;

    if (checked)
      items.push(component.key)
    else
      items = items.filter(d => d !== component.key);

    that.setState(prevState => ({
      currentCode: { ...prevState.currentCode, components: items }
    }));

  }

  load(that: this) {
    var item = that.state.currentCode;
    
    that.setState(prevState => ({
      currentCode: { ...prevState.currentCode, components: [] },
      hasLoadError: false 
    }));

    that.sonarService.loadComponents(item.server, item.token)
      .then((items: ISonarComponent[]) => {
        that.setState({ components: items })
      })
      .catch(function (error) {
        console.log(error);
        that.setState({ hasLoadError: true });
      });;
  }

  save(that: this) {
    that.setState({ creating: true });
    var item = that.state.currentCode;
    item.id = Guid.create().toString();
    
    that.storageService.removeAll().then(() => { });
    that.storageService.saveCode(item).then(item => {
      that.close(that);
    });
  }

  close(that: this) {
    that.setState({ currentCode: that.getStartValue(), creating: false }, () => {
      that.props.onDismiss();
    });
  }

  render() {

    const { currentCode, creating, components, hasLoadError } = this.state;

    if (this.props.show) {
      return (
        <Panel
          onDismiss={() => {
            this.close(this);
          }}
          titleProps={{ text: "Register new tool" }}
          description={"Register new code quality tool."}
          footerButtonProps={[
            {
              text: "Cancel", onClick: (event) => {
                this.close(this);
              }
            },
            {
              text: creating ? "Registring..." : "Register",
              primary: true,
              onClick: (event) => {
                this.save(this)
              },
              disabled: !this.isValid() || creating || this.state.currentCode.components.length === 0
            }
          ]}>

          <div className="code--content">

            <div className="code--group">
              <TextField
                label="Sonarqube URL *"
                inputId="server"
                value={currentCode.server}
                onChange={(event, value) => this.onInputChange(event, value, this)}
                placeholder="e.g. https://sonarqube.company.com"
              />
            </div>

            <div className="code--group">
              <TextField
                label="Token *"
                inputId="token"
                value={currentCode.token}
                onChange={(event, value) => this.onInputChange(event, value, this)}
                inputType={"password"}
                required={true}
                placeholder="01a0164e6f112950das79d823001507cd4fdffce"
              />
            </div>

            <div className="code--group">
              <ButtonGroup className="code--add-button">
                <Button
                  text="Load"
                  primary={true}
                  disabled={!this.isValid()}
                  onClick={() => this.load(this)} />
              </ButtonGroup>
            </div>

            <div className="code--group">

              {hasLoadError && <MessageCard
                className="flex-self-stretch"
                severity={MessageCardSeverity.Error}>
                Error loading projects from server.
              </MessageCard>}

              {!hasLoadError && components.length > 0 && <Card className="flex-grow">
                <div className="rhythm-vertical-8 flex-column">
                  {components.map(item => (
                    <Checkbox
                      onChange={(event, checked) => (this.addComponent(item, checked, this))}
                      checked={currentCode.components.filter(d => d === item.key).length > 0}
                      label={item.key}
                    />
                  ))}
                </div>
              </Card>}

            </div>
          </div>



        </Panel >
      );
    }
    return null;
  }
}

export default CodePanel;
