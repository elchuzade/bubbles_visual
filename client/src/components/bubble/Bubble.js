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

import {
  getBubble,
  getPageBubbles,
  updatePosition,
  createBubble
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
      moveBubbles: false,
      movedBubbles: [],
      selectedBubble: {},
      bubbleEdit: false
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
    // Set page bubbles
    if (nextProps.bubble && nextProps.bubble.bubbles) {
      this.setState({
        pageBubbles: nextProps.bubble.bubbles,
        movedBubbles: nextProps.bubble.bubbles
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
  resetBubbles = () => {
    this.forceUpdate();
  };
  selectBubbleInfo = bubble => {
    this.setState({ selectedBubble: bubble });
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
  render() {
    // const { errors } = this.state;
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
                  <div className="col-12"></div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-3">
                        <img
                          src="https://via.placeholder.com/1000"
                          alt="img"
                          className="img-fluid rounded-circle"
                        />
                      </div>
                      <div className="col-9">
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
  updatePosition: PropTypes.func.isRequired,
  createBubble: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  bubble: state.bubble
});

export default connect(
  mapStateToProps,
  { getBubble, getPageBubbles, updatePosition, createBubble }
)(Bubble);
