function removeEmpty(obj) {
    Object.keys(obj).forEach(function(key) {
        if (obj[key] && typeof obj[key] == 'object') removeEmpty(obj[key])
        else if (obj[key] == null) delete obj[key]
    });
};

module.exports = {removeEmpty};