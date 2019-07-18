const {ADMIN_PASSWORD : adminPassword} = process.env;

function Api () {}

Api.prototype.isSignedIn = function (ctx) {
    ctx.body = {
        isSignedIn : !!ctx.session.isSignedIn
    };
};

Api.prototype.signIn = function (ctx) {
    const {plainPassword} = ctx.request.body;

    if(adminPassword === plainPassword) {
        ctx.body = {
            isSignedIn : true
        };

        ctx.session.isSignedIn = true;
    }
    else {
        ctx.body = {
            isSignedIn : false
        };
        
        //Unauthorized
        ctx.status = 401;
    }
};

Api.prototype.signOut = function (ctx) {
    ctx.session = null;
    
    ctx.body = {
        isSignedIn : false
    };
};

module.exports = new Api();
