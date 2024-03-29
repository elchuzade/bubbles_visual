const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BubbleSchema = new Schema(
  {
    user: {
      type: String
    },
    parentPage: {
      type: String
    },
    page: {
      type: String
    },
    position: {
      x: {
        type: Number
      },
      y: {
        type: Number
      }
    },
    access: {
      id: {
        type: String
      },
      type: {
        type: String
      }
    },
    avatar: {
      location: {
        type: String
      },
      key: {
        type: String
      },
      bucket: {
        type: String
      },
      originalname: {
        type: String
      },
      mimetype: {
        type: String
      },
      size: {
        type: Number
      },
      fieldName: {
        type: String
      }
    },
    title: {
      type: String
    },
    info: {
      type: String
    },
    parent: {
      id: {
        type: String
      },
      title: {
        type: String
      }
    },
    children: [
      {
        id: {
          type: String
        },
        position: {
          x: {
            type: Number
          },
          y: {
            type: Number
          }
        }
      }
    ],
    status: {
      type: String,
      default: 'incomplete'
    },
    importance: {
      type: Number,
      default: 30
    },
    deadline: {
      type: Date
    },
    path: [
      {
        id: {
          type: String
        },
        title: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = Bubble = mongoose.model('bubble', BubbleSchema);
