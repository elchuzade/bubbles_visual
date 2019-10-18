import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Draggable from 'react-draggable';

const DraggableBubble = ({
  bubble,
  importanceFactor,
  deadline,
  handle,
  defaultPosition,
  onStart,
  onDrag,
  onStop,
  bounds
}) => {
  return (
    <Draggable
      handle={handle}
      defaultPosition={defaultPosition}
      scale={1}
      onStart={onStart}
      onDrag={onDrag}
      onStop={onStop}
      bounds={bounds}
    >
      <div
        className="draggableCover"
        style={{
          width: `${bubble.importance * importanceFactor}px`
        }}
      >
        <div className={classnames({ deadline: deadline })}>
          <img
            draggable="false"
            src="https://picsum.photos/1000/1000?random=5"
            alt={bubble.title}
            className="handle img-fluid rounded-circle bubbleImage"
          />
          <span className="imgText handle">
            {bubble.title}
          </span>
        </div>
      </div>
    </Draggable>
  );
};

DraggableBubble.propTypes = {
  bubble: PropTypes.object.isRequired,
  importanceFactor: PropTypes.number.isRequired,
  deadline: PropTypes.bool.isRequired,
  handle: PropTypes.string.isRequired,
  defaultPosition: PropTypes.object.isRequired,
  onStart: PropTypes.func,
  onDrag: PropTypes.func.isRequired,
  onStop: PropTypes.func,
  bounds: PropTypes.string
};

export default DraggableBubble;
