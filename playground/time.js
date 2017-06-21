const moment = require('moment');

var date = moment(Date.now() - 10000000);
console.log(date.format('h:mm a'));
 