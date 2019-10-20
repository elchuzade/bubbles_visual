import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Draggable from 'react-draggable';

class DraggableBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }
  hoverOn = () => {
    this.setState({ hover: true });
  };
  hoverOff = () => {
    this.setState({ hover: false });
  };
  render() {
    return (
      <Draggable
        handle={this.props.handle}
        disabled={this.props.disabled}
        defaultPosition={this.props.defaultPosition}
        scale={1}
        onStart={this.props.onStart}
        onDrag={this.props.onDrag}
        onStop={this.props.onStop}
        bounds={this.props.bounds}
      >
        <div
          onMouseLeave={this.hoverOff}
          id={this.props.bubble._id}
          importance={this.props.bubble.importance}
          className="draggableCover"
        >
          <div className={classnames({ deadline: this.props.bubble.deadline })}>
            <div
              style={{
                width: `${this.props.bubble.importance *
                  this.props.importanceFactor}px`
              }}
            >
              <img
                onMouseEnter={this.hoverOn}
                draggable="false"
                src={
                  this.props.bubble.avatar
                    ? this.props.bubble.avatar.location
                    : 'https://via.placeholder.com/1000'
                }
                alt={this.props.bubble.title}
                className="handle img-fluid rounded-circle bubbleImage"
              />
              <span
                style={{
                  top: `${(this.props.bubble.importance / 2) *
                    this.props.importanceFactor}px`
                }}
                className="imgText handle"
              >
                {this.props.bubble.title}
              </span>
              {this.state.hover && (
                <div className="bubbleDashboard mt-1">
                  <button
                    className="btn btn-sm btn-info bubbleDashboardBtn mr-1 mb-1"
                    onClick={() => {
                      this.props.selectBubbleInfo(this.props.bubble);
                    }}
                  >
                    <i className="fas fa-info"></i>
                  </button>
                  <button className="btn btn-sm btn-info bubbleDashboardBtn mr-1 mb-1">
                    <i className="fas fa-check"></i>
                  </button>
                  <button className="btn btn-sm btn-info bubbleDashboardBtn mr-1 mb-1">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Draggable>
    );
  }
}

DraggableBubble.propTypes = {
  bubble: PropTypes.object.isRequired,
  importanceFactor: PropTypes.number.isRequired,
  handle: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  defaultPosition: PropTypes.object.isRequired,
  onStart: PropTypes.func,
  onDrag: PropTypes.func,
  onStop: PropTypes.func,
  selectBubbleInfo: PropTypes.func.isRequired,
  bounds: PropTypes.string
};

export default DraggableBubble;
