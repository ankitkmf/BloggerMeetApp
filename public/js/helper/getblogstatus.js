var status = require('../../../data/blogstatus.json');

module.exports = function(fieldvalue) {
    if (fieldvalue != undefined) {
        if (fieldvalue == status.pending)
            return "<td>Pending</td>";
        else if (fieldvalue == status.approved)
            return "<td>Approved</td>";
        else if (fieldvalue == status.deleted)
            return "<td>Deleted</td>";
    } else {
        return '<td>{{this.status}}</td>';
    }
}