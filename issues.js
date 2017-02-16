var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var issuesSchema = new Schema({
  project: String,
  issue_title: {
    type: String,
    required: [true,
              'Title field is empty']
  },
  issue_text: {
    type: String,
    required: [true,
              'Text field is empty']
  },
  created_by: {
    type: String,
    required: [true,
              'Created by field is epmty']
  },
  assigned_to: String,
  status_text: String,
  created_on: {
    type: Date,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  open: {
    type: Boolean,
    default: true
  }
}, { emitIndexErrors: true });

var issueErrorsHandler = function(error, res, next) {
  let errorai = [];
  for (let err in error.errors){
    if (error.errors[err].name === 'ValidatorError')
      errorai.push(error.errors[err].message);
  }
  if (errorai.length > 0){
    next(new Error(errorai));
  } else {
    next();
  }
};

issuesSchema.post('save', issueErrorsHandler);
issuesSchema.post('update', issueErrorsHandler);
issuesSchema.post('findOneAndUpdate', issueErrorsHandler);
issuesSchema.post('insertMany', issueErrorsHandler);

module.exports = function (db){
  return db.model('issues', issuesSchema);
};

