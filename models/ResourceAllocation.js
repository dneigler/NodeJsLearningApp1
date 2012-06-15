/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 6/5/12
 * Time: 10:59 PM
 * To change this template use File | Settings | File Templates.
 */
var ResourceAllocationSchema = new Schema({
  Employee: { type: Schema.ObjectId, ref: 'users' },
  EmployeeID:{type:String, default:''},
  Name:{type:String, default:''},
  JobCode:{type:String, default:''},
  EmployeeType:{type:String, default:''},
  EmployeeCategory:{type:String, default:'Employees'},
  Month:{type:Date, default:Date.now},
  ProjectID:{type:Number, default:0},
  Project:{type:String, default:''},
  AllocationPercentage:{type:Number, default:1},
  Column1:{type:String, default:''},
  InternalAllocationPercentage:{type:Number, default:0},
  WeightedPercentage:{type:Number, default:0},
  MonthlyCost:{type:Number, default:0},
  ProjectType:{type:String, default:''},
  ParentProjectType:{type:String, default:''},
  BudgetType:{type:String, default:''},
  ProjectCaptionRollup:{type:String, default:''},
  ProjectTypeCaptionRollup:{type:String, default:''},
  BusinessAlignment:{type:String, default:''},
  TechnologyAlignment:{type:String, default:''},
  ResourceTeamID:{type:Number, default:0},
  ProjectTeamID:{type:Number, default:0},
  Team:{type:String, default:''},
  ResourceTeam:{type:String, default:''},
  ProjectTeam:{type:String, default:''},
  ResourceTeamLead:{type:String, default:''},
  BillingCode:{type:String, default:''},
  TaskCode:{type:String, default:''},
  QuarterNumber:{type:String, default:''},
  Quarter:{type:String, default:''},
  AllocationPercentageNegative:{type:Number, default:0},
  ProjectYear:{type:String, default:''},
  Year:{type:String, default:''}
});

mongoose.model('ResourceAllocation', ResourceAllocationSchema);