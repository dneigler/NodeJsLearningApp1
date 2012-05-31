/**
 * Created with JetBrains WebStorm.
 * User: dneigler
 * Date: 5/30/12
 * Time: 9:50 PM
 * To change this template use File | Settings | File Templates.
 */
var UserSchema = new Schema({
  username:{ type:String, default:'' },
  firstname:{ type:String, default:'fn' }});

mongoose.model('users', UserSchema);
