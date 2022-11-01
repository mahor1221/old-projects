const Controller = require(`${config.path.controller}/controller`);

const postTransform = require(`${config.path.transform}/api/v1/Admin/postTransform`);

module.exports = new (class postController extends Controller {
    store(req, res) {
        // Validation
        req.checkBody("title", "عنوان نمیتواند خالی بماند").notEmpty();
        req.checkBody("description", "توضیحات نمیتواند خالی بماند").notEmpty();
        req.checkBody("originalImage", "عکس اصلی  نمیتواند خالی بماند").notEmpty();
        req.checkBody("compressedImage", "عکس جایگزین  نمیتواند خالی بماند").notEmpty();
        req.checkBody("category", "دسته بندی نمیتواند خالی بماند").notEmpty();
        this.escapeAndTrim(req, "title desciption ortiginalImage");
        //
        // req.checkBody("category", "دسته بندی وارد شده صحیح نیست").isMongoId();
        // if (req.body.tags) {
        //     req.checkBody("tags", "برچسب وارد شده صحیح نیست").isMongoId();
        // }
        if (this.showValidationErrors(req, res)) return;
        const tag = req.body.tags
        const cat =req.body.category
        if (req.body.alt) {
            if (tag) { const t = tag.split(",")
        const c = cat.split(",")
        this.model.Post({
            title: req.body.title,
            description: req.body.description,
            originalImage: req.body.originalImage,
            compressedImage :req.body.compressedImage,
            alt : req.body.alt,
            category: c,
            tags: t
        }).save((err, post) => {
            if (err) throw err;
            res.json({
                status: 200,
                data: new postTransform().transform(post),
                Message: "create success",
                success: true,
            });
        });
        }else{const c = cat.split(",")
        this.model.Post({
            title: req.body.title,
            description: req.body.description,
            originalImage: req.body.originalImage,
            compressedImage:req.body.compressedImage,
            category: c,
        }).save((err, post) => {
            if (err) throw err;
            res.json({
                status: 200,
                data: new postTransform().transform(post),
                Message: "create success",
                success: true,
            });
        });

        }   
            
        }else{
            if (tag) { const t = tag.split(",")
        const c = cat.split(",")
        this.model.Post({
            title: req.body.title,
            description: req.body.description,
            originalImage: req.body.originalImage,
            compressedImage:req.body.compressedImage,
            category: c,
            tags: t
        }).save((err, post) => {
            if (err) throw err;
            res.json({
                status: 200,
                data: new postTransform().transform(post),
                Message: "create success",
                success: true,
            });
        });
        }else{const c = cat.split(",")
        this.model.Post({
            title: req.body.title,
            description: req.body.description,
            originalImage: req.body.originalImage,
            compressedImage:req.body.compressedImage,
            category: c,
        }).save((err, post) => {
            if (err) throw err;
            res.json({
                status: 200,
                data: new postTransform().transform(post),
                Message: "create success",
                success: true,
            });
        });

        }   
        }
            
        

        
    }

    update(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();

        if (this.showValidationErrors(req, res)) return;

        // Validation
        req.checkBody("title", "عنوان نمیتواند خالی بماند").notEmpty();
        req.checkBody("description", "توضیحات نمیتواند خالی بماند").notEmpty();
        req.checkBody("originalImage", "عکس اصلی  نمیتواند خالی بماند").notEmpty();
        req.checkBody("compressedImage", "عکس جایگزین  نمیتواند خالی بماند").notEmpty();
        req.checkBody("category", "دسته بندی نمیتواند خالی بماند").notEmpty();

        this.escapeAndTrim(req, " title desciption ortiginalImage");

        if (this.showValidationErrors(req, res)) return;
        const tag = req.body.tags
        const cat =req.body.category
        if (req.body.alt) {
            if (tag) {
                const t = tag.split(",")
                const c = cat.split(",")
                
            this.model.Post.findByIdAndUpdate(
                req.params.id,
                {
                    title: req.body.title,
                    description: req.body.description,
                    originalImage: req.body.originalImage,
                    compressedImage:req.body.compressedImage,
                    alt:req.body.alt,
                    category: c,
                    tags: t
                },
                (err, post) => {
                    if (err) throw err;
                    res.json({
                        status: 200,
                        data: new postTransform().transform(post),
                        title :req.body.title, 
                        description: req.body.description,
                        originalImage : req.body.originalImage,
                        compressedImage:req.body.compressedImage,
                        category: c,
                        tags: t,
                        alt:req.body.alt,
                        Message: "Update success",
                        success: true,
                    });
                }
            );
                
            }else{
               
                const c = cat.split(",")
                
            this.model.Post.findByIdAndUpdate(
                req.params.id,
                {
                    title: req.body.title,
                    description: req.body.description,
                    originalImage: req.body.originalImage,
                    compressedImage:req.body.compressedImage,
                    category: c,
                },
                (err, post) => {
                    if (err) throw err;
                    res.json({
                        status: 200,
                        data: new postTransform().transform(post),
                        title :req.body.title, 
                        description: req.body.description,
                        originalImage : req.body.originalImage,
                        compressedImage:req.body.compressedImage,
                        category: c,
                        Message: "Update success",
                        success: true,
                    });
                }
            );
               
            }
            
        }else{
            if (tag) {
                const t = tag.split(",")
                const c = cat.split(",")
                
            this.model.Post.findByIdAndUpdate(
                req.params.id,
                {
                    title: req.body.title,
                    description: req.body.description,
                    originalImage: req.body.originalImage,
                    category: c,
                    tags: t
                },
                (err, post) => {
                    if (err) throw err;
                    res.json({
                        status: 200,
                        data: new postTransform().transform(post),
                        title :req.body.title, 
                        description: req.body.description,
                        originalImage : req.body.originalImage,
                        category: c,
                        tags: t,
                        Message: "Update success",
                        success: true,
                    });
                }
            );
                
            }else{
               
                const c = cat.split(",")
                
            this.model.Post.findByIdAndUpdate(
                req.params.id,
                {
                    title: req.body.title,
                    description: req.body.description,
                    originalImage: req.body.originalImage,
                    category: c,
                },
                (err, post) => {
                    if (err) throw err;
                    res.json({
                        status: 200,
                        data: new postTransform().transform(post),
                        title :req.body.title, 
                        description: req.body.description,
                        originalImage : req.body.originalImage,
                        category: c,
                        Message: "Update success",
                        success: true,
                    });
                }
            );
               
            }
        }
        
        

    }
    destroy(req, res) {
        req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();

        if (this.showValidationErrors(req, res)) return;

        this.model.Post.findByIdAndRemove(req.params.id, (err, post) => {
            if (err) throw err;
            res.json({
                status: 200,
                Message: "delete success",
                success: true,
            });
        });
    }
})();
