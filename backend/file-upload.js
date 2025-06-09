const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
    destination: './shared/uploads/images',
    filename: function (req, file, cb) {
        const posterId = req.body['posterID'] || 'unknown';
        const timestamp = Date.now();
        const originalFilename = file.originalname.replace(/[\W]]/g, ''); // Removes /, _, -, \, and ,,  and spaces from the filename;

        const uniqueName = `${posterId}-${timestamp}-${originalFilename}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage:imageStorage });

module.exports = upload;