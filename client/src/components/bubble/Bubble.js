import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  PixelToPercent,
  PercentToPixel
} from '../common/exports/convertPixelPercent';
import { Line } from 'react-lineto';

import DraggableBubble from './DraggableBubble';

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
      pageBubbles: []
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
      this.setState({ pageBubbles: nextProps.bubble.bubbles });
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
  handleStop = (e, ui) => {
    e.preventDefault();
    const draggedBubble = JSON.parse(ui.node.attributes[0].nodeValue);
    // Access bubble attribute of a DOM element
    let bubbleCenterX =
      ui.x + (draggedBubble.importance / 2) * this.state.importanceFactor;
    let bubbleCenterY =
      ui.y + (draggedBubble.importance / 2) * this.state.importanceFactor;
    let draggedBubblePosition = {
      x: PixelToPercent(bubbleCenterX, this.state.plainWidth),
      y: PixelToPercent(bubbleCenterY, this.state.plainHeight)
    };
    this.props.updatePosition(draggedBubble._id, draggedBubblePosition);
  };
  createBubble = () => {
    this.props.createBubble(this.state.bubble);
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
        <div className="container dashboard">
          <div className="row">
            <div className="col-12 my-2">
              <button
                className="btn btn-sm btn-success"
                onClick={this.createBubble}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        {spinner}
        {!spinner && (
          <div id="plain">
            {this.state.bubble &&
              this.state.bubble.children &&
              this.state.bubble.children.length > 0 &&
              this.state.bubble.children.map(child => (
                <Line
                  key={child._id}
                  x0={
                    this.state.leftOffset +
                    PercentToPixel(this.state.bubble.position.x, this.state.plainWidth)
                  }
                  y0={
                    this.state.topOffset +
                    PercentToPixel(this.state.bubble.position.y, this.state.plainHeight)
                  }
                  x1={this.state.leftOffset +
                    PercentToPixel(child.position.x, this.state.plainWidth)}
                  y1={this.state.topOffset +
                    PercentToPixel(child.position.y, this.state.plainHeight)}
                />
              ))}
            {this.state.pageBubbles &&
              this.state.pageBubbles.map(bubble => (
                <DraggableBubble
                  key={bubble._id}
                  bubble={JSON.stringify(bubble)}
                  importanceFactor={this.state.importanceFactor}
                  deadline={bubble.deadline ? true : false}
                  handle=".handle"
                  defaultPosition={{
                    x:
                      PercentToPixel(bubble.position.x, this.state.plainWidth) -
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
