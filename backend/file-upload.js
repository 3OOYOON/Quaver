const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
        const postId = req.body.postID || 'unknown';
        const timestamp = Date.now();
        const originalFilename = file.originalname.replace(/[\W]]/g, ''); // Removes /, _, -, \, and ,,  and spaces from the filename;
        const ext = path.extname(file.originalname);

        const uniqueName = `${postId}-${timestamp}-${originalFilename}-${ext}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ imageStorage });

module.exports = upload;