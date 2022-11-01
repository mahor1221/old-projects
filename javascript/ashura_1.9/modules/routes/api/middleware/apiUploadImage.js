const multer  = require('multer')
const mkdirp  = require('mkdirp');
const path = require('path')

const ImageStorage = multer.diskStorage({
    destination : (req , file , cb) => {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDay();
        let dir = `./public/uploads/images/${year}/${month}/${day}`;

        mkdirp(dir , err => cb(err , dir))
    },
    filename: (req , file , cb) => {
       let extname = path.extname(file.originalname)

        cb(null, Date.now() + extname) 
    }
});


const uploadImage = multer({ 
    storage : ImageStorage,
    
})


module.exports = {
    uploadImage
}