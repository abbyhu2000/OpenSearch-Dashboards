/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {
  htmlIdGenerator,
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSpacer,
  EuiSwitch,
  EuiSwitchEvent,
  EuiTextArea,
  EuiHorizontalRule,
  EuiRadio,
  EuiSelect
} from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import React, { Fragment } from 'react';
import { EuiText } from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { SavedObjectsFindOptions } from 'src/core/server/saved_objects/types';
import { findObjects } from '../../../saved_objects_management/public/lib';
import { HttpSetup } from 'src/core/public/http';

export interface OnSaveProps {
  newTitle: string;
  newCopyOnSave: boolean;
  isTitleDuplicateConfirmed: boolean;
  onTitleDuplicate: () => void;
  newDescription: string;
}

interface Props {
  onSave: (props: OnSaveProps & {
    addToDashboard?: boolean, chosenDashboard?:string|undefined
  }) => void;
  onClose: () => void;
  title: string;
  showCopyOnSave: boolean;
  initialCopyOnSave?: boolean;
  objectType: string;
  confirmButtonLabel?: React.ReactNode;
  options?: React.ReactNode | ((state: SaveModalState) => React.ReactNode);
  description?: string;
  showDescription: boolean;
  showAddToDashboard?: boolean;
  http?: HttpSetup
}

export interface SaveModalState {
  title: string;
  copyOnSave: boolean;
  isTitleDuplicateConfirmed: boolean;
  hasTitleDuplicate: boolean;
  isLoading: boolean;
  visualizationDescription: string;
  addToDashboard: boolean;
  chosenDashboard: string|undefined;
  dashboards: {text?: string; value: string}[]
}

const generateId = htmlIdGenerator();
// const checkboxIdPrefix = generateId();

export class SavedObjectSaveModal extends React.Component<Props, SaveModalState> {
  private warning = React.createRef<HTMLDivElement>();
  public readonly state = {
    title: this.props.title,
    copyOnSave: Boolean(this.props.initialCopyOnSave),
    isTitleDuplicateConfirmed: false,
    hasTitleDuplicate: false,
    isLoading: false,
    visualizationDescription: this.props.description ? this.props.description : '',
    addToDashboard: true,
    chosenDashboard: undefined,
    dashboards: []
  };

  public render() {
    const { isTitleDuplicateConfirmed, hasTitleDuplicate, title } = this.state;
    const duplicateWarningId = generateId();

    return (
      <EuiModal
        data-test-subj="savedObjectSaveModal"
        className="osdSavedObjectSaveModal"
        onClose={this.props.onClose}
      >
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <FormattedMessage
              id="savedObjects.saveModal.saveTitle"
              defaultMessage="Save {objectType}"
              values={{ objectType: this.props.objectType }}
            />
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          {this.renderDuplicateTitleCallout(duplicateWarningId)}

          <EuiForm component="form" onSubmit={this.onFormSubmit} id="savedObjectSaveModalForm">
            {!this.props.showDescription && this.props.description && (
              <EuiText size="s" color="subdued">
                {this.props.description}
              </EuiText>
            )}

            <EuiSpacer />

            {this.renderCopyOnSave()}

            <EuiFormRow
              fullWidth
              label={
                <FormattedMessage id="savedObjects.saveModal.titleLabel" defaultMessage="Title" />
              }
            >
              <EuiFieldText
                fullWidth
                autoFocus
                data-test-subj="savedObjectTitle"
                value={title}
                onChange={this.onTitleChange}
                isInvalid={(!isTitleDuplicateConfirmed && hasTitleDuplicate) || title.length === 0}
                aria-describedby={this.state.hasTitleDuplicate ? duplicateWarningId : undefined}
              />
            </EuiFormRow>

            {this.renderViewDescription()}

            {typeof this.props.options === 'function'
              ? this.props.options(this.state)
              : this.props.options}

            {this.renderAddToDashboardDirectly()}
          </EuiForm>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty data-test-subj="saveCancelButton" onClick={this.props.onClose}>
            <FormattedMessage
              id="savedObjects.saveModal.cancelButtonLabel"
              defaultMessage="Cancel"
            />
          </EuiButtonEmpty>

          {this.renderConfirmButton()}
        </EuiModalFooter>
      </EuiModal>
    );
  }

  private renderViewDescription = () => {
    if (!this.props.showDescription) {
      return;
    }

    return (
      <EuiFormRow
        fullWidth
        label={
          <FormattedMessage
            id="savedObjects.saveModal.descriptionLabel"
            defaultMessage="Description"
          />
        }
      >
        <EuiTextArea
          data-test-subj="viewDescription"
          value={this.state.visualizationDescription}
          onChange={this.onDescriptionChange}
        />
      </EuiFormRow>
    );
  };

  private onDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      visualizationDescription: event.target.value,
    });
  };

  private onTitleDuplicate = () => {
    this.setState({
      isLoading: false,
      isTitleDuplicateConfirmed: true,
      hasTitleDuplicate: true,
    });

    if (this.warning.current) {
      this.warning.current.focus();
    }
  };

  private saveSavedObject = async () => {
    if (this.state.isLoading) {
      // ignore extra clicks
      return;
    }

    this.setState({
      isLoading: true,
    });

    await this.props.onSave({
      newTitle: this.state.title,
      newCopyOnSave: this.state.copyOnSave,
      isTitleDuplicateConfirmed: this.state.isTitleDuplicateConfirmed,
      onTitleDuplicate: this.onTitleDuplicate,
      newDescription: this.state.visualizationDescription,
      addToDashboard: this.state.addToDashboard,
      chosenDashboard: this.state.chosenDashboard
    });
  };

  private onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      title: event.target.value,
      isTitleDuplicateConfirmed: false,
      hasTitleDuplicate: false,
    });
  };

  private onCopyOnSaveChange = (event: EuiSwitchEvent) => {
    this.setState({
      copyOnSave: event.target.checked,
    });
  };

  private onAddToDashboardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      addToDashboard: event.target.checked && event.target.id === 'dashboard'
    })
  }

  private onSelectExistingDashboardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      chosenDashboard: this.state.addToDashboard?event.target.value:undefined
    })
  }

  private onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.saveSavedObject();
  };

  private renderConfirmButton = () => {
    const { isLoading, title } = this.state;

    let confirmLabel: string | React.ReactNode = i18n.translate(
      'savedObjects.saveModal.saveButtonLabel',
      {
        defaultMessage: 'Save',
      }
    );

    if (this.props.confirmButtonLabel) {
      confirmLabel = this.props.confirmButtonLabel;
    }

    return (
      <EuiButton
        fill
        data-test-subj="confirmSaveSavedObjectButton"
        isLoading={isLoading}
        isDisabled={title.length === 0}
        type="submit"
        form="savedObjectSaveModalForm"
      >
        {confirmLabel}
      </EuiButton>
    );
  };

  private renderDuplicateTitleCallout = (duplicateWarningId: string) => {
    if (!this.state.hasTitleDuplicate) {
      return;
    }

    return (
      <>
        <div ref={this.warning} tabIndex={-1}>
          <EuiCallOut
            title={
              <FormattedMessage
                id="savedObjects.saveModal.duplicateTitleLabel"
                defaultMessage="This {objectType} already exists"
                values={{ objectType: this.props.objectType }}
              />
            }
            color="warning"
            data-test-subj="titleDupicateWarnMsg"
            id={duplicateWarningId}
          >
            <p>
              <FormattedMessage
                id="savedObjects.saveModal.duplicateTitleDescription"
                defaultMessage="Saving '{title}' creates a duplicate title."
                values={{
                  title: this.state.title,
                }}
              />
            </p>
          </EuiCallOut>
        </div>
        <EuiSpacer />
      </>
    );
  };

  componentDidMount() {
    const fetchDashboards = async () => {
      if(!this.props.http){
        return;
      }
      const findOptions: SavedObjectsFindOptions = {
        type: 'dashboard'
      }
    
      const resp = await findObjects(this.props.http, findOptions)
      const dashboards: { text: string|undefined; value: string}[] = []
      resp.savedObjects.forEach((item) => {
        dashboards.push({
          text: item.meta.title, 
          value: item.id
        })
      })
      this.setState({
        dashboards: dashboards
      }) 
      if(dashboards.length){
        this.setState({
          chosenDashboard: dashboards[0].value
        })
      }
    }
    fetchDashboards()
  }

  private renderAddToDashboardDirectly = () => {
    if(!this.props.showAddToDashboard){
      return;
    }

    return (
      <Fragment>
      <EuiHorizontalRule margin='m'/>
      <EuiRadio
        id='existing'
        label = { <FormattedMessage
          id="savedObjects.saveModal.addToDashboardLabel"
          defaultMessage="Add to Dashboard"
        />}
        checked={this.state.addToDashboard}
        onChange={(e) => this.onAddToDashboardChange(e)}
      />
      <EuiSpacer size='xs'/>
      <EuiSelect
        id="selectExistingDashboard"
        options={this.state.dashboards}
        value={this.state.chosenDashboard}
        onChange={(e) => this.onSelectExistingDashboardChange(e)}
        disabled={!this.state.addToDashboard || !this.state.dashboards.length}
      />
      <EuiSpacer size='s'/>
      <EuiRadio
        id='new'
        label={<FormattedMessage
          id="savedObjects.saveModal.addToLibraryLabel"
          defaultMessage="Add to Library"
        />}
        checked={!this.state.addToDashboard}
        onChange={(e) => this.onAddToDashboardChange(e)}
      />
   </Fragment>
    )
  }

  private renderCopyOnSave = () => {
    if (!this.props.showCopyOnSave) {
      return;
    }

    return (
      <>
        <EuiSwitch
          data-test-subj="saveAsNewCheckbox"
          checked={this.state.copyOnSave}
          onChange={this.onCopyOnSaveChange}
          label={
            <FormattedMessage
              id="savedObjects.saveModal.saveAsNewLabel"
              defaultMessage="Save as new {objectType}"
              values={{ objectType: this.props.objectType }}
            />
          }
        />
        <EuiSpacer />
      </>
    );
  };
}