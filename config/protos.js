
Array.prototype.clean = function() {
    var i = this.length;
    var clean = []
    while (i--) {
        this[i] = this[i].trim()
        if (this[i] && this[i].length) {
            clean.push(this[i])
        }
    }
    return clean.reverse();
}

Array.prototype.unique = function(){
    var temp = {};
    for (var i = 0; i < this.length; i++)
        temp[this[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

String.prototype.ucFirst = function(){
    var string_array = this.split(' ')
    _.each(string_array,function(word, key){
            var word_array = word.split('')
            var fChar = word_array.shift()
            var ucFWord = fChar.toUpperCase()+word_array.join('');
            string_array[key] = ucFWord
    })
    return string_array.join(' ')
}

Array.prototype.contains = function(obj) {
    if(!obj) return false;
    var i = this.length;
    while (i--) {
        if (this[i].trim().toLowerCase() === obj.trim().toLowerCase()) {
            return true;
        }
    }
    return false;
}
