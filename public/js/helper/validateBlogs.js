module.exports = function(fieldvalue) {
    if (fieldvalue != undefined && fieldvalue == true) {
        return '<li class="nav-item dropdown btn-group">' +
            '<a class="nav-link dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">User</a>' +
            '<div class="dropdown-menu dropdown" aria-labelledby="dropdownMenu1">' +
            '<a class="dropdown-item" href="/admin/add">Add</a>' +
            '<a class="dropdown-item" href="/admin/list">Show</a>' +
            '</div></li>' +
            '<li class="nav-item"><a class="nav-link" href="/dashboard">Dashboard</a></li>';
    }
}