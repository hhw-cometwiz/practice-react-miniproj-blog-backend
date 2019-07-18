const mongoose = require("mongoose");
const Post = require("../models/Post");

class Api {
    constructor() {
        this.testIfObjectIdIsValid = this.testIfObjectIdIsValid.bind(this);
        this.testIsSignedIn = this.testIsSignedIn.bind(this);
        this.list = this.list.bind(this);
        this.read = this.read.bind(this);
        this.write = this.write.bind(this);
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
    }

    testIfObjectIdIsValid(ctx, next) {
        const {postId} = ctx.params;

        if(mongoose.Types.ObjectId.isValid(postId)) {
            return next();
        }
        else {
            ctx.status = 400;
            return null;
        }
    }

    testIsSignedIn(ctx, next) {
        let result = null;

        if(!ctx.session.isSignedIn) {
            ctx.status = 401;
        }
        else {
            result = next();
        }

        return result;
    }

    /**
     * GET /api/posts
     */
    list(ctx) {
        let {page, pageCount, contentLength, tags} = ctx.query;

        if("undefined" === typeof page) {
            page = 1;
        }
        else {
            page = Number.parseInt(page);
        }
        if(page < 1) {
            ctx.status = 400;
            return;
        }

        if("undefined" === typeof pageCount) {
            pageCount = 10;
        }
        else {
            pageCount = Number.parseInt(pageCount);
        }
        if(pageCount < 1) {
            ctx.status = 400;
            return;
        }

        if("undefined" === typeof contentLength) {
            contentLength = 50;
        }
        else {
            contentLength = Number.parseInt(contentLength);
        }
        if(page < 1) {
            ctx.status = 400;
            return;
        }

        let condition = {};
        if("string" === typeof tags) {
            const tagArray = Array.from(new Set(tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0)));
            if(tagArray.length > 0) {
                condition.tags = {
                    $in : tagArray
                };
            }
        }
        
        const responseBody = {};
        
        return Post.find(condition)
            .sort({_id : -1})
            .limit(pageCount)
            .skip((page - 1) * pageCount)
            .lean() //Retrieve all records as JSON texts.
            .exec()
            .then((posts) => {
                responseBody.posts = posts.map((item) => {
                    return ({
                        ...item,
                        content : (item.content.length > contentLength ? `${item.content.slice(0, contentLength)}...` : item.content)
                    });
                });
                return Post.countDocuments(condition).exec();
            })
            .then((totalPostCount) => {
                responseBody.totalPostCount = totalPostCount;
                responseBody.lastPage = (pageCount > 0 ? Math.ceil(totalPostCount / pageCount) : 0);
                ctx.body = responseBody;
            })
            .catch((e) => {
                ctx.throw(e, 500);
            })
        ;
    }

    /**
     * GET /api/posts/:postId
     */
    read(ctx) {
        const {postId} = ctx.params;
        
        return Post.findById(postId)
            .exec()
            .then((post) => {
                if(!!post) {
                    ctx.body = post;
                }
                else {
                    ctx.status = 404;
                }
            })
            .catch((e) => {
                ctx.throw(e, 500);
            })
        ;
    }

    /**
     * POST /api/posts
     * {title, content}
     */
    write(ctx) {
        const {title, content, tags} = ctx.request.body;

        const post = new Post({title, content, tags});

        //This return statement can be converted as follows.
        // try {
        //     await post.save();
        //
        //     ctx.body = post;
        // }
        // catch(e) {
        //     ctx.throw(e);
        // }
        return post.save()
            .then(() => {
                ctx.body = post;
            })
            .catch((e) => {
                ctx.throw(e);
            })
        ;
    }

    /**
     * DELETE /api/posts/:postId
     */
    remove(ctx) {
        const postId = ctx.params.postId;

        return Post.findByIdAndRemove(postId)
            .exec()
            .then(() => {
                ctx.status = 204;
            })
            .catch((e) => {
                ctx.throw(e, 500);
            })
        ;
    }

    /**
     * PATCH /api/posts/:postId
     * {title?, content?}
     */
    update(ctx) {
        const postId = ctx.params.postId;
        const {title, content, tags} = ctx.request.body;
        
        return Post.findByIdAndUpdate(
            postId,
            {
                title : title,
                content : content,
                tags : tags
            },
            {
                // Returns the updated record.
                new : true
            }
        ).exec()
            .then((post) => {
                if(post) {
                    ctx.body = post;
                }
                else {
                    ctx.status = 404;
                }
            })
            .catch((e) => {
                ctx.throw(e, 500);
            })
        ;
    }
}

module.exports = new Api();
