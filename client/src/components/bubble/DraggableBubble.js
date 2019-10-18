import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Draggable from 'react-draggable';

class DraggableBubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      importance: '',
      title: '',
      importanceFactor: '',
      deadline: false,
      handle: '',
      defaultPosition: {},
      bounds: '',
      hover: false
    };
  }
  hoverOn = () => {
    console.log('hover on');
    this.setState({ hover: true });
  };
  hoverOff = () => {
    console.log('hover off');
    this.setState({ hover: false });
  };
  render() {
    return (
      <Draggable
        handle={this.props.handle}
        defaultPosition={this.props.defaultPosition}
        scale={1}
        onStart={this.props.onStart}
        onDrag={this.props.onDrag}
        onStop={this.props.onStop}
        bounds={this.props.bounds}
      >
        <div
          onMouseLeave={this.hoverOff}
          id={this.props.id}
          importance={this.props.importance}
          className="draggableCover"
        >
          <div className={classnames({ deadline: this.props.deadline })}>
            <div
              style={{
                width: `${this.props.importance *
                  this.props.importanceFactor}px`
              }}
            >
              <img
                onMouseEnter={this.hoverOn}
                draggable="false"
                src="https://picsum.photos/1000/1000?random=5"
                alt={this.props.title}
                className="handle img-fluid rounded-circle bubbleImage"
              />
              <span
                style={{
                  top: `${(this.props.importance / 2) *
                    this.props.importanceFactor}px`
                }}
                className="imgText handle"
              >
                {this.props.title}
              </span>
              {this.state.hover && (
                <div className="bubbleDashboard">
                  <button className="btn btn-sm btn-info bubbleDashboardBtn m-1">
                    <i className="fas fa-info"></i>
                  </button>
                  <button className="btn btn-sm btn-info bubbleDashboardBtn m-1">
                    <i className="fas fa-check"></i>
                  </button>
                  <button className="btn btn-sm btn-info bubbleDashboardBtn m-1">
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
  id: PropTypes.string.isRequired,
  importance: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  importanceFactor: PropTypes.number.isRequired,
  deadline: PropTypes.bool.isRequired,
  handle: PropTypes.string.isRequired,
  defaultPosition: PropTypes.object.isRequired,
  onStart: PropTypes.func,
  onDrag: PropTypes.func,
  onStop: PropTypes.func,
  bounds: PropTypes.string
};

export default DraggableBubble;
