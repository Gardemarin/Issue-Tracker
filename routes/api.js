/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect       = require('chai').expect;
var MongoClient  = require('mongodb');
var ObjectId     = require('mongodb').ObjectID;
var Issues       = require('../issues.js');
var mongoose    = require('mongoose');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
var options, db, IssuesTable;//

options = { promiseLibrary: require('bluebird') };
db = mongoose.createConnection(CONNECTION_STRING, options);
IssuesTable = new Issues(db);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      if (!req.body) return res.sendStatus(400);
        var issue = new IssuesTable();
        var filter = req.query || {};
        filter.project = req.params.project;
        
        IssuesTable.find(filter, function(err, issue){
          res.json(issue);
        });
    })
    
    .post(function (req, res){
      if (!req.body) return res.sendStatus(400);
        var issue = new IssuesTable();
        issue.project = req.params.project;
        issue.issue_title = req.body.issue_title;
        issue.issue_text = req.body.issue_text;
        issue.created_by = req.body.created_by;
        if (req.body.assigned_to){
          issue.assigned_to = req.body.assigned_to;
        }
        if (req.body.status_text){
          issue.status_text = req.body.status_text;
        }
        issue.save(function(err, savedIssue){
          if (!err){
            res.json(savedIssue);
          } else {
            res.send(`Error(s): ${err.message}`);
          }
        });
    })
    
    .put(function (req, res){
        if (!req.body) return res.sendStatus(400);
        if (req.body._id === undefined) {
          res.send('_id error');
        } else {
          var issue = new IssuesTable();
          let needUpdate = false;

          let tempIssue = {};
          issue.project = req.params.project;
          issue._id = req.body._id;
          if (req.body.issue_title){
            needUpdate = true;
            tempIssue.issue_title = req.body.issue_title;
          }
          if (req.body.issue_text){
            needUpdate = true;
            tempIssue.issue_text = req.body.issue_text;
          }
          if (req.body.created_by){
            needUpdate = true;
            tempIssue.created_by = req.body.created_by;
          }
          if (req.body.assigned_to){
            needUpdate = true;
            tempIssue.assigned_to = req.body.assigned_to;
          }
          if (req.body.status_text){
            needUpdate = true;
            tempIssue.status_text = req.body.status_text;
          }
          if (req.body.open){
            needUpdate = true;
            tempIssue.open = req.body.open;
          }

          if (!needUpdate){
            res.send('no updated field sent');
          } else {

            tempIssue.updated_on = new Date();

            IssuesTable.findOneAndUpdate({ _id: req.body._id }, { $set: tempIssue }, { new: true }, function(err, savedIssue){
              if (!err){
                res.send('successfully updated');
              } else {
                res.send(`could not update ${req.body._id}`);
              }
            });
          }
        }
    })
    
    .delete(function (req, res){
      if (!req.body) return res.sendStatus(400);
    
        var issue = new IssuesTable();
    
        IssuesTable.findOne({ _id: req.body._id, project: req.params.project }, function(err, issue){
          if (!issue){
            res.send('_id error');
          } else {
            issue.remove(function(err, issue){
              if (!err){
                res.send(`deleted ${req.body._id}`);
              } else {
                res.send(`could not delete ${req.body._id}`);
              }
            });
          }
        });
      
    });
    
};
