import React from 'react';
import PropTypes from 'prop-types';

const BubbleDashboard = ({
  createBubble,
  moveBubbles,
  saveMoveBubbles,
  resetBubbles,
  enableMoveBubbles
}) => {
  return (
    <div className="container dashboard">
      <div className="row">
        <div className="col-12 my-2">
          <button
            className="btn btn-sm btn-success"
            onClick={createBubble}
          >
            <i className="fas fa-plus"></i>
          </button>
          {moveBubbles ? (
            <span>
              <button
                className="btn btn-sm btn-success mx-1"
                onClick={saveMoveBubbles}
              >
                save
              </button>
              <button
                className="btn btn-sm btn-success mx-1"
                onClick={resetBubbles}
              >
                reset
              </button>
            </span>
          ) : (
            <button
              className="btn btn-sm btn-success mx-1"
              onClick={enableMoveBubbles}
            >
              move
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

BubbleDashboard.propTypes = {
  createBubble: PropTypes.func.isRequired,
  moveBubbles: PropTypes.bool.isRequired,
  saveMoveBubbles: PropTypes.func.isRequired,
  resetBubbles: PropTypes.func.isRequired,
  enableMoveBubbles: PropTypes.func.isRequired
}

export default BubbleDashboard;
