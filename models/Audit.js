/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 5/30/12
 * Time: 9:52 PM
 * To change this template use File | Settings | File Templates.
 */
var AuditSchema = new Schema({
  action:{type:String, default:'ping'},
  targetobject:{type:String, default:''},
  audittime:{type:Date, default:Date.now },
  audituser:{type:String}
});

mongoose.model('audit', AuditSchema);
