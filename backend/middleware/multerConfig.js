import multer from 'multer';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/members');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        const extension = file.originalname.split('.').pop();
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

export default upload;
