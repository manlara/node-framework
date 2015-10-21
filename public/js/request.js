function request(type,url,params,cb){
    console.log(url)
    $.ajax({
        url: url,
        type: type,
        data:params,
        success: function(result) {
            console.log('success')
            return cb(null,result)
        },
        error:function(err){
            console.log('fail')
            return cb(err)
        }
    });
}



function checkRequestParams(_params){
    if(!_params || _params.constructor !== Object) return false
    var allow = true

    console.log(_params)
    function check(params, allow){
        for (var key in params) {
            if(params[key] && params[key].constructor === Object) return check(params[key], allow);
            else{
                if(params[key] === undefined || params[key] === null) allow = false;
                if(!params[key] || (params[key].constructor === Boolean || params[key].constructor === Number)) allow = false;
                if(!params[key] || (params[key].constructor === String && (!params[key] || !params[key].length))) allow = false;
            }
        }

        return allow
    }

    return check(_params, allow)
}