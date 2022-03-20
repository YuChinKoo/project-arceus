const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskTitle: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const ColumnSchema = new mongoose.Schema({
    columnTitle: {
        type: String,
        required: true
    },
    tasks: {
        type: [ TaskSchema ],
        default: []
    }

});

const TaskboardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String, 
        required: true
    },
    helpers: {
        type: [ String ], 
        default: []
    },
    requestedHelpers: {
        type: [ String ], 
        default: []
    },
    columns: {
        type: [ ColumnSchema ],
        default: []
    }
});

const TaskBoard = mongoose.model('taskboard', TaskboardSchema);
const Column = mongoose.model('column', ColumnSchema);
const Task = mongoose.model('task', TaskSchema);

module.exports = { TaskBoard, Column, Task };