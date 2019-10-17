import React, { Component } from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  PixelToPercent,
  PercentToPixel
} from '../common/exports/convertPixelPercent';

import { getBubble, getPageBubbles } from '../../actions/bubbleActions';

class Bubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      bubble: {},
      pageBubbles: [],
      position: {
        x: 0,
        y: 0
      },
      circleImportance: 200
    };
  }

  componentDidMount() {
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
      this.setState({ bubbles: nextProps.bubble.bubbles });
    }
  }
  handleDrag = (e, ui) => {
    this.setState({
      position: {
        x: this.state.position.x + ui.deltaX,
        y: this.state.position.y + ui.deltaY
      }
    });
  };
  handleStop = () => {
    let plainWidth = document.getElementById('plain').clientWidth;
    let plainHeight = document.getElementById('plain').clientHeight;
    let convertedX = PixelToPercent(
      this.state.position.x + this.state.circleImportance / 2,
      plainWidth
    );
    let convertedY = PixelToPercent(
      this.state.position.y + this.state.circleImportance / 2,
      plainHeight
    );
    console.log(convertedX, convertedY);
  };

  render() {
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
        <div id="plain">
          <Draggable
            handle=".handle"
            defaultPosition={{ x: 0, y: 0 }}
            position={null}
            scale={1}
            onStart={this.handleStart}
            onDrag={this.handleDrag}
            onStop={this.handleStop}
            bounds="parent"
            onMouseDown={this.mouseDown}
          >
            <div
              className="draggableCover"
              style={{ width: `${this.state.circleImportance}px` }}
            >
              <div className="deadline">
                <img
                  draggable="false"
                  src="https://picsum.photos/1000/1000?random=5"
                  alt="img1"
                  className="handle img-fluid rounded-circle bubbleImage"
                />
                <span className="imgText handle">4</span>
              </div>
            </div>
          </Draggable>
        </div>
      </div>
    );
  }
}

Bubble.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  bubble: PropTypes.object.isRequired,
  getBubble: PropTypes.func.isRequired,
  getPageBubbles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  bubble: state.bubble
});

export default connect(
  mapStateToProps,
  { getBubble, getPageBubbles }
)(Bubble);
