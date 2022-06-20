const express = require('express');
const bodyparser = require('body-parser');
const multer = require('multer');
const path = require('path');
const db = require('./queries');
const cors = require('cors');
const app = express();
const port = 3636;
const DIR = './uploads';

let storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,DIR);
    },
    filename : (req,file,cb) => {
        cb(null,file.filename + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({storage:storage});

app.use(cors());
app.use(bodyparser.json());
app.use(
    bodyparser.urlencoded({
        extended : true,
    })
)

app.get('/uploads/:imagename',function(req,res) {
    res.sendFile(__dirname + '/uploads/' + req.params.imagename);
})

//image
app.post('/upload',upload.single('image'),db.upload)

app.post('/getAdmin',db.getAdmin);
app.post('/addCategory',db.addCategory);
app.get('/getCategory',db.getCategory);
app.get('/getCategoryById/:id',db.getCategoryById);
app.put('/updateCategory',db.updateCategory);
app.delete('/deleteCategory/:id',db.deleteCategory);
app.post('/addBlog',db.addBlog);
app.get('/getBlog',db.getBlog);
app.get('/getBlogById/:id',db.getBlogById);
app.put('/updateBlog',db.updateBlog);
app.delete('/deleteBlog/:id',db.deleteBlog);
app.get('/getBlogFeatured',db.getBlogFeatured);
app.get('/getBlogActive',db.getBlogActive);
app.get('/countBlogs',db.countBlogs);
app.get('/countActive',db.countActive);
app.get('/countFeatured',db.countFeatured);
app.put('/updateFeatured',db.updateFeatured);

app.get('/',(req,res) => {
    res.json({info:'Node.js , Express , and Postgre API'})
})

app.listen(port,() => {
    console.log(`App running on port ${port}.`)
})