import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  PixelToPercent,
  PercentToPixel
} from '../common/exports/convertPixelPercent';

import DraggableBubble from './DraggableBubble';

import {
  getBubble,
  getPageBubbles,
  updatePosition
} from '../../actions/bubbleActions';

class Bubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    console.log(
      PixelToPercent(bubbleCenterX, this.state.plainWidth),
      PixelToPercent(bubbleCenterY, this.state.plainHeight)
    );
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
        <div className="container">
          <div className="row">
            <div className="col-12 my-2">
              <button className="btn btn-sm btn-success">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        {spinner}
        {!spinner && (
          <div id="plain">
            {this.state.pageBubbles &&
              this.state.pageBubbles.map(bubble => (
                <DraggableBubble
                  bubble={JSON.stringify(bubble)}
                  key={bubble._id}
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
  updatePosition: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  bubble: state.bubble
});

export default connect(
  mapStateToProps,
  { getBubble, getPageBubbles, updatePosition }
)(Bubble);
