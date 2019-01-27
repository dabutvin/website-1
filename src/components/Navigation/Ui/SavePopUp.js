// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { ControlLabel, Modal, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'
import DropFileOrText from './DropFileOrText'
import pick from 'lodash/pick'

const titles = {
  file: 'Share coordinates as a file',
  gist: 'Share coordinates as a gist',
  notice: 'Share definitions as a Notice file'
}

const extensions = {
  json: '.json',
  text: '.txt',
  html: '.html'
}

export default class SavePopUp extends Component {
  static propTypes = {
    onOK: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    onHide: PropTypes.func,
    show: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.templateInputRef = React.createRef()
    this.state = { renderer: 'text' }
  }

  doOK = () => {
    let { filename, renderer } = this.state
    switch (this.props.type) {
      case 'file':
      case 'gist':
        filename = this.ensureExtension(filename, '.json')
        break
      case 'notice':
        filename = this.ensureExtension(filename, extensions[renderer])
        break
    }
    this.props.onOK({ filename, renderer, options: { template: this.state.template } })
  }

  ensureExtension(name, extension) {
    if (!extension) return name
    return name.toLowerCase().endsWith(extension) ? name : name + extension
  }

  onTemplate = template => {
    const textarea = ReactDOM.findDOMNode(this.templateInputRef.current)
    if (textarea) textarea.value = template
    this.setState({ ...this.state, template })
  }

  renderNoticeForm = () => {
    return (
      <div>
        {this.renderFileForm()}
        <FormGroup controlId="formNoticeOptions">
          <ControlLabel>Renderer</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="renderer"
            onChange={e => this.setState({ ...this.state, renderer: e.target.value })}
            defaultValue={this.state.renderer}
          >
            <option value="text">text</option>
            <option value="html">HTML</option>
            <option value="json">JSON</option>
            <option value="template">template</option>
          </FormControl>
          {this.state.renderer === 'template' && (
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel>Template</ControlLabel>
              <DropFileOrText onLoad={this.onTemplate}>
                <FormControl
                  ref={this.templateInputRef}
                  componentClass="textarea"
                  placeholder="Provide a Handlebars template (see https://handlebarsjs.com). Paste the template text or drag and drop a template file here."
                  onChange={e => this.setState({ ...this.state, template: e.target.value })}
                  defaultValue={this.state.template}
                  rows="6"
                />
              </DropFileOrText>
            </FormGroup>
          )}
        </FormGroup>
      </div>
    )
  }

  renderFileForm = () => {
    return (
      <FormGroup controlId="formFilename">
        <ControlLabel>File name</ControlLabel>
        <FormControl
          type="text"
          placeholder="Enter a name for the file to share"
          onChange={e => this.setState({ ...this.state, filename: e.target.value })}
          defaultValue={this.state.filename}
        />
      </FormGroup>
    )
  }

  enableOK = () => this.state.filename && (this.state.renderer !== 'template' || this.state.template)

  render() {
    const { show, type, onHide } = this.props
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{titles[type] || titles['file']}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {type === 'file' && this.renderFileForm()}
          {type === 'notice' && this.renderNoticeForm()}
        </Modal.Body>
        <Modal.Footer>
          <div>
            <FormGroup className="pull-right">
              <Button bsStyle="success" disabled={!this.enableOK()} type="button" onClick={() => this.doOK()}>
                OK
              </Button>
              <Button onClick={onHide}>Cancel</Button>
            </FormGroup>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}