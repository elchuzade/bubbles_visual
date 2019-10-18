import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  PixelToPercent,
  PercentToPixel
} from '../common/exports/convertPixelPercent';

import DraggableBubble from './DraggableBubble';

import { getBubble, getPageBubbles } from '../../actions/bubbleActions';

class Bubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: undefined,
      screenHeight: undefined,
      importanceFactor: undefined,
      errors: {},
      bubble: {},
      pageBubbles: [],
      position: {
        x: 0,
        y: 0
      },
      draggingImportance: undefined
    };
  }
  handleResize = () => {
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
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
  handleDrag = (e, ui) => {
    e.preventDefault();
    this.setState({
      position: {
        x: this.state.position.x + ui.deltaX,
        y: this.state.position.y + ui.deltaY
      }
    });
  };
  handleStop = (e, ui) => {
    e.preventDefault();
    let convertedX = PixelToPercent(
      this.state.position.x + this.state.draggingImportance / 2,
      this.state.screenWidth * 0.9
    );
    let convertedY = PixelToPercent(
      this.state.position.y + this.state.draggingImportance / 2,
      this.state.screenHeight * 0.9
    );
    console.log(convertedX, convertedY);
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
                  key={bubble._id}
                  bubble={bubble}
                  importanceFactor={this.state.importanceFactor}
                  deadline={bubble.deadline ? true : false}
                  handle=".handle"
                  defaultPosition={{
                    x:
                      PercentToPixel(
                        bubble.position.x,
                        this.state.screenWidth * 0.9
                      ) -
                      (bubble.importance / 2) * this.state.importanceFactor,
                    y:
                      PercentToPixel(
                        bubble.position.y,
                        this.state.screenHeight * 0.9
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
