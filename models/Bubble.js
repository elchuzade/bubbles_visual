const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BubbleSchema = new Schema(
  {
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
    status: {
      type: String,
      default: 'incomplete'
    },
    importance: {
      type: Number,
      default: 25
    },
    deadline: {
      type: Date
    },
    children: [
      {
        id: {
          type: String
        },
        title: {
          type: String
        }
      }
    ],
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
