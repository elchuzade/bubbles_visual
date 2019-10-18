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
        bubble={bubble}
        className="draggableCover"
        style={{
          width: `${JSON.parse(bubble).importance * importanceFactor}px`
        }}
      >
        <div bubble={bubble} className={classnames({ deadline: deadline })}>
          <img
            bubble={bubble}
            draggable="false"
            src="https://picsum.photos/1000/1000?random=5"
            alt={JSON.parse(bubble).title}
            className="handle img-fluid rounded-circle bubbleImage"
          />
          <span bubble={bubble} className="imgText handle">
            {JSON.parse(bubble).title}
          </span>
        </div>
      </div>
    </Draggable>
  );
};

DraggableBubble.propTypes = {
  bubble: PropTypes.string.isRequired,
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
