var ProjectStatusSchema = new Schema({
  StatusDate: { type: Date, default:Date.now },
  ProjectID: { type: Number, default:0 },
  Project: { type:String, default:'' },
  StatusType: { type: String, default: 'Open Items' },
  MilestoneDate: { type: String, default: '' },
  Note: { type: String, default: ''},
  JiraID: { type: String, default: ''},
  TeamID: { type: Number, default: 0 },
  BusinessAlignmentOverride: { type: String, default: ''},
  ProjectTeamID: { type: Number, default: 0},
  TeamName: { type: String, default: '' },
  TeamLead: { type: String, default: ''}
});

mongoose.model('ProjectStatus', ProjectStatusSchema);

//"StatusDate":"1/1/2011","ProjectID":"20","Project":"Operations Run","StatusType":"Last Week",
//"MilestoneDate":"1/14/2011","Note":"Add Velocity to Citco trade feed, CPOS / CCR reconciliation, KPM",
//"JiraID":"","TeamID":"5","BusinessAlignmentOverride":"","ProjectTeamID":"0","TeamName":"Outgoing Feeds","TeamLead":"Jerry Hikel"