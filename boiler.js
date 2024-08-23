const AWS = require('aws-sdk');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); 

const s3 = new AWS.S3({
    region : "ap-south-1",
    credentials : {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        }
    }   
);

router.get('/url-upload',  async (req, res) => {
    const { user_id } = req.query
    const key = `${user_id}/${uuidv4()}.jpeg`;

    await s3.getSignedUrl('putObject', {
        Bucket: 'Bucket Name',
        ContentType: 'image/jpeg', 
        Key: key,
    }, (err, url) => {
        if (err) return res.status(400).send({ msg: err });
        res.send({ key, url });
    });
});


router.get('/url-getURL', async (req, res) => {
    const { key } = req.query;

    s3.getSignedUrl('getObject', {
        Bucket: 'Bucket Name',
        Key: key,
        Expires: 60 * 50 
    }, (err, url) => {
        if (err) return res.status(400).send({ msg: err.message });
        res.status(200).send({ url });
    });
});