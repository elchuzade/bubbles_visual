import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  PixelToPercent,
  PercentToPixel
} from '../common/exports/convertPixelPercent';
import { Line } from 'react-lineto';
import ReactHtmlParser from 'react-html-parser';
import DraggableBubble from './DraggableBubble';
import BubbleDashboard from './BubbleDashboard';
import TextInput from '../common/TextInput';
import NumberInput from '../common/NumberInput';
import SelectInput from '../common/SelectInput';
import FileInputGroup from '../common/FileInputGroup';
import statusOptions from '../common/options/statusOptions';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import modules from '../common/exports/QuillModules';
import formats from '../common/exports/QuillFormats';

import {
  getBubble,
  getPageBubbles,
  getUserBubbles,
  updatePosition,
  createBubble,
  uploadBubbleAvatar,
  deleteBubbleAvatar,
  updateStatus
} from '../../actions/bubbleActions';

class Bubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftOffset: undefined,
      topOffset: 50,
      plainWidth: undefined,
      plainHeight: undefined,
      importanceFactor: undefined,
      errors: {},
      bubble: {},
      pageBubbles: [],
      userBubbles: [],
      moveBubbles: false,
      movedBubbles: [],
      selectedBubble: {},
      bubbleEdit: false,
      parent: '',
      title: '',
      status: '',
      importance: '',
      info: '',
      avatarObject: {}
    };
  }
  handleResize = () => {
    this.setState({
      leftOffset: window.innerWidth * 0.05,
      plainWidth: window.innerWidth * 0.9,
      plainHeight: window.innerHeight * 0.9,
      importanceFactor: window.innerWidth * 0.9 * 0.002
    });
  };
  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    if (this.props.match.params.id) {
      this.props.getBubble(this.props.match.params.id);
      this.props.getPageBubbles(this.props.match.params.id);
    }
  }
  componentWillReceiveProps(nextProps) {
    // set errors
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    // set parent bubble
    if (nextProps.bubble && nextProps.bubble.bubble) {
      this.setState({ bubble: nextProps.bubble.bubble });
    }
    // Set user page bubbles
    if (nextProps.bubble && nextProps.bubble.userBubbles) {
      this.setState({
        userBubbles: nextProps.bubble.userBubbles
      });
    }
    // Set page bubbles
    if (nextProps.bubble && nextProps.bubble.pageBubbles) {
      this.setState({
        pageBubbles: nextProps.bubble.pageBubbles,
        movedBubbles: nextProps.bubble.pageBubbles
      });
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleStop = (e, ui) => {
    e.preventDefault();
    const id = ui.node.attributes[0].nodeValue;
    const importance = ui.node.attributes[1].nodeValue;
    // Access bubble attribute of a DOM element
    let bubbleCenterX = ui.x + (importance / 2) * this.state.importanceFactor;
    let bubbleCenterY = ui.y + (importance / 2) * this.state.importanceFactor;
    let draggedBubblePosition = {
      x: PixelToPercent(bubbleCenterX, this.state.plainWidth),
      y: PixelToPercent(bubbleCenterY, this.state.plainHeight)
    };
    let { movedBubbles } = this.state;
    for (let i = 0; i < movedBubbles.length; i++) {
      if (movedBubbles[i]._id === id) {
        movedBubbles[i].position.x = draggedBubblePosition.x;
        movedBubbles[i].position.y = draggedBubblePosition.y;
        movedBubbles[i].refresh = true;
        this.setState({ movedBubbles: movedBubbles });
        break;
      }
    }
  };
  createBubble = () => {
    this.props.createBubble(this.state.bubble);
  };
  enableMoveBubbles = () => {
    this.setState({ moveBubbles: true });
  };
  saveMoveBubbles = () => {
    this.setState({ moveBubbles: false });
    const { movedBubbles } = this.state;
    for (let i = 0; i < movedBubbles.length; i++) {
      if (movedBubbles[i].refresh) {
        this.props.updatePosition(
          movedBubbles[i]._id,
          movedBubbles[i].position
        );
      }
    }
  };
  resetBubbles = () => {};

  selectBubbleInfo = bubble => {
    this.setState({
      selectedBubble: bubble,
      title: bubble.title,
      status: bubble.status,
      importance: bubble.importance,
      parent: bubble.parent.title,
      info: bubble.info
    });
  };
  getParentPage = id => {
    const { pageBubbles } = this.state;
    for (let i = 0; i < pageBubbles.length; i++) {
      if (pageBubbles[i]._id === id) {
        return pageBubbles[i].title;
      }
    }
    return undefined;
  };
  getPath = bubble => {
    let { path } = bubble;
    path.push({ id: bubble._id, title: bubble.title });
    let answer = ``;
    for (let i = 0; i < path.length; i++) {
      answer += `<span>${path[i].title}</span>`;
      if (i < path.length - 1) {
        answer += ` / `;
      }
    }
    return answer;
  };
  enableBubbleEdit = () => {
    this.setState({ bubbleEdit: true });
    this.props.getUserBubbles();
  };
  saveBubbleEdit = () => {
    console.log('saving');
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  buildParentOptions = (allBubbles, selectedBubble) => {
    let parentOptions = [];
    for (let i = 0; i < allBubbles.length; i++) {
      if (allBubbles[i]._id != selectedBubble._id) {
        parentOptions.push({
          label: `${allBubbles[i].title}`,
          value: `${allBubbles[i]._id}`
        });
      }
    }
    return parentOptions;
  };
  onChangeAvatar = e => {
    e.preventDefault();
    this.setState({ avatarObject: e.target.files[0] });
  };
  onSubmitAvatar = e => {
    e.preventDefault();
    if (this.state.avatarObject.name) {
      const formData = new FormData();
      formData.append('bubbleAvatar', this.state.avatarObject);
      const configData = {
        headers: {
          'content-type': 'multipart/form/data'
        }
      };
      this.props.uploadBubbleAvatar(
        formData,
        configData,
        this.state.selectedBubble._id
      );
    } else {
      let updatedErrors = this.state.errors;
      updatedErrors.avatar = 'Choose image to upload';
      this.setState({ errors: updatedErrors });
    }
  };
  onClickDeleteAvatar = e => {
    e.preventDefault();
    if (this.state.avatarObject.location) {
      this.setState({ avatarObject: {} });
    } else {
      if (this.state.selectedBubble.avatar.location) {
        this.props.deleteBubbleAvatar(this.state.selectedBubble._id);
      } else {
        let updatedErrors = this.state.errors;
        updatedErrors.avatar = 'No image to delete';
        this.setState({ errors: updatedErrors });
      }
    }
  };
  changeStatus = (bubble, status) => {
    if (bubble.status != status && bubble.status != 'main') {
      this.props.updateStatus(bubble._id, { status: status });
    }
  };
  onChangeQuill = (content, delta, source, value) => {
    this.setState({ info: value.getHTML() });
  };
  render() {
    const { errors } = this.state;
    // const { isAuthenticated } = this.props.auth;
    const { bubble, loading } = this.props.bubble;
    let spinner = null;
    if (bubble === null || loading) {
      spinner = <div className="loader" />;
    } else {
      spinner = null;
    }
    return (
      <div>
        <BubbleDashboard
          createBubble={this.createBubble}
          moveBubbles={this.state.moveBubbles}
          enableMoveBubbles={this.enableMoveBubbles}
          saveMoveBubbles={this.saveMoveBubbles}
          resetBubbles={this.resetBubbles}
        />
        {spinner}
        {!spinner && (
          <section id="bubbles">
            <div id="plain">
              {this.state.bubble &&
                this.state.bubble.children &&
                this.state.bubble.children.length > 0 &&
                this.state.bubble.children.map(child => (
                  <Line
                    zIndex={-1}
                    key={child.id}
                    x0={
                      this.state.leftOffset +
                      PercentToPixel(
                        this.state.bubble.position.x,
                        this.state.plainWidth
                      )
                    }
                    y0={
                      this.state.topOffset +
                      PercentToPixel(
                        this.state.bubble.position.y,
                        this.state.plainHeight
                      )
                    }
                    x1={
                      this.state.leftOffset +
                      PercentToPixel(child.position.x, this.state.plainWidth)
                    }
                    y1={
                      this.state.topOffset +
                      PercentToPixel(child.position.y, this.state.plainHeight)
                    }
                  />
                ))}
              {this.state.pageBubbles &&
                this.state.pageBubbles.map(bubble => (
                  <DraggableBubble
                    key={bubble._id}
                    selectBubbleInfo={this.selectBubbleInfo}
                    changeStatus={this.changeStatus}
                    bubble={bubble}
                    importanceFactor={this.state.importanceFactor}
                    handle=".handle"
                    disabled={!this.state.moveBubbles}
                    defaultPosition={{
                      x:
                        PercentToPixel(
                          bubble.position.x,
                          this.state.plainWidth
                        ) -
                        (bubble.importance / 2) * this.state.importanceFactor,
                      y:
                        PercentToPixel(
                          bubble.position.y,
                          this.state.plainHeight
                        ) -
                        (bubble.importance / 2) * this.state.importanceFactor
                    }}
                    onStart={this.handleStart}
                    onDrag={this.handleDrag}
                    onStop={this.handleStop}
                    bounds="parent"
                  />
                ))}
            </div>
          </section>
        )}
        {!spinner && Object.keys(this.state.selectedBubble).length > 0 && (
          <section id="bubbleInfo" style={{ marginTop: window.innerHeight }}>
            <div className="container">
              {this.state.bubbleEdit ? (
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-3">
                        <img
                          src={
                            this.state.selectedBubble.avatar
                              ? this.state.selectedBubble.avatar.location
                              : 'https://via.placeholder.com/1000'
                          }
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                        <form onSubmit={this.onSubmitAvatar}>
                          <FileInputGroup
                            name="bubbleAvatar"
                            placeholder="Bubble Avatar"
                            onChange={this.onChangeAvatar}
                            sendFile={this.state.avatarObject}
                            error={errors.avatar}
                            accept="image/png, image/jpg, image/jpeg"
                          />
                          <div className="row mt-2 mb-5">
                            <div className="col">
                              <button
                                className="btn btn-danger mx-2"
                                onClick={this.onClickDeleteAvatar}
                              >
                                Delete
                              </button>
                              <button className="btn mx-2" type="submit">
                                Upload
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="col-9">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={this.saveBubbleEdit}
                        >
                          <i className="fas fa-save"></i>
                        </button>
                        <TextInput
                          name="title"
                          placeholder="Bubble title"
                          value={this.state.title}
                          onChange={this.onChange}
                          error={errors.title}
                        />
                        <SelectInput
                          name="status"
                          value={this.state.status}
                          onChange={this.onChange}
                          options={statusOptions}
                        />
                        <NumberInput
                          name="importance"
                          placeholder="Bubble importance"
                          value={this.state.importance}
                          onChange={this.onChange}
                          error={errors.importance}
                          min={30}
                          max={80}
                        />
                        <SelectInput
                          name="parent"
                          value={this.state.parent}
                          onChange={this.onChange}
                          options={this.buildParentOptions(
                            this.state.userBubbles,
                            this.state.selectedBubble
                          )}
                        />
                        <ReactQuill
                          value={this.state.info || ''}
                          onChange={this.onChangeQuill}
                          theme="snow"
                          modules={modules}
                          formats={formats}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-3">
                        <img
                          src={
                            this.state.selectedBubble.avatar
                              ? this.state.selectedBubble.avatar.location
                              : 'https://via.placeholder.com/1000'
                          }
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </div>
                      <div className="col-9">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={this.enableBubbleEdit}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <h1>{this.state.selectedBubble.title}</h1>
                        <p>{this.state.selectedBubble.deadline}</p>
                        <p>
                          <i>parent: </i>
                          <b>{this.state.selectedBubble.parent.title}</b>
                        </p>
                        <p>
                          <i>status: </i>
                          <b>{this.state.selectedBubble.status}</b>
                        </p>
                        <p>
                          <i>path: </i>
                          <b>
                            {ReactHtmlParser(
                              this.getPath(this.state.selectedBubble)
                            )}
                          </b>
                        </p>
                        <p>
                          <i>page: </i>
                          <b>
                            {this.getParentPage(
                              this.state.selectedBubble.parentPage
                            )}
                          </b>
                        </p>
                        <p>{this.state.selectedBubble.importance}</p>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: this.state.selectedBubble.info
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    );
  }
}

Bubble.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  bubble: PropTypes.object.isRequired,
  getBubble: PropTypes.func.isRequired,
  getPageBubbles: PropTypes.func.isRequired,
  getUserBubbles: PropTypes.func.isRequired,
  updatePosition: PropTypes.func.isRequired,
  createBubble: PropTypes.func.isRequired,
  uploadBubbleAvatar: PropTypes.func.isRequired,
  deleteBubbleAvatar: PropTypes.func.isRequired,
  updateStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  bubble: state.bubble
});

export default connect(
  mapStateToProps,
  {
    getBubble,
    getPageBubbles,
    getUserBubbles,
    updatePosition,
    createBubble,
    uploadBubbleAvatar,
    deleteBubbleAvatar,
    updateStatus
  }
)(Bubble);
