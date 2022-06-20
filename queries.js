const Pool = require('pg').Pool;
const pool = new Pool({
    user : 'postgres',
    host : 'localhost',
    database : 'blogdb',
    password : 'root',
    port : 5432
})

const getAdmin = (req,res) => {
    const {username,password} = req.body;
    pool.query('select username,password from admin where username=$1 and password=$2',[username,password],(error,result) => {
        if(error){
            console.log(error);
        }
        res.send({status:201,msg:'Login',data:result.rows});
        console.log(result.rows);
    })
}


const addCategory = (req,res) => {
    const {cname} = req.body;
    pool.query('insert into category(cname) values ($1)',[cname],(error,result) => {
        if(error){
            throw error;
        }
        res.status(201).send(`Register add with ID : ${result.id}`);
    });
};

const addBlog = (req,res) => {
    const {title,cat_id,isfeatured,isactive,description,date,image} = req.body;
    pool.query('insert into blog(title,cat_id,isfeatured,isactive,description,date,image) values ($1,$2,$3,$4,$5,$6,$7)',
    [title,cat_id,isfeatured,isactive,description,date,image[0]],(error,result) => {
        if(error){
            throw error;
        }
        res.status(201).send(`Blog add with ID :${result.id}`);
    });
}

const getCategory = (req,res) => {
    pool.query('select * from category order by cid asc',(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getBlog = (req,res) => {
    pool.query('select * from blog order by bid desc',(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getBlogFeatured = (req,res) => {
    const featured = true;
    pool.query('select * from blog where isfeatured=$1 order by bid desc',[featured],(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const getBlogActive = (req,res) => {
    const active = true;
    pool.query('select * from blog where isactive=$1 order by bid desc',[active],(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).json(result.rows);
    })
}


const getCategoryById = (req,res) => {
    const cid = parseInt(req.params.id);
    pool.query('select * from category where cid=$1',[cid],(error,result) => {
        if(error)
        {
            throw error;
        }
        res.status(201).json(result.rows);
        console.log(result.rows);
        
    });
};

const getBlogById = (req,res) => {
    const bid = parseInt(req.params.id);
    pool.query('select * from blog where bid=$1',[bid],(error,result) => {
        if(error){
            throw error;
        }
        res.status(201).json(result.rows);
        console.log(result.rows);
    })
}

const updateCategory = (req,res) => {
    const cid = parseInt(req.body.cid); 
    const {cname} = req.body;
    pool.query('update category set cname=$1 where cid=$2',[cname,cid],(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).send(`Category updated by id ${cid}`);
    });
};

const updateBlog = (req,res) => {
    const bid = parseInt(req.body.bid);
    const {title,cat_id,isfeatured,isactive,description,date,image} = req.body; 
    pool.query('update blog set title=$1,cat_id=$2,isfeatured=$3,isactive=$4,description=$5,date=$6,image=$7 where bid=$8',
    [title,cat_id,isfeatured,isactive,description,date,image[0],bid],(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).send(`Blog updated by Id ${bid}`);
    })
}

const deleteCategory = (req,res) => {
    const cid = parseInt(req.params.id);
    pool.query('delete from category where cid=$1',[cid],(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).send(`Category Deleted by ID : ${cid}`);
    });
};

const deleteBlog = (req,res) => {
    const bid = parseInt(req.params.id);
    pool.query('delete from blog where bid=$1',[bid],(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).send(`Blog Deleted by ID : ${bid}`);
    })
}

const upload = (req,res) => {
    if(!req.file){
        console.log('No file recived');
        return res.send({success:false});
    }
    else{
        return res.send({
            success:true,name:req.file.filename
        })
    }
}

const countBlogs = (req,res) => {
    pool.query('select count(*) as blogcount from blog',(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const countActive = (req,res) =>{
    const isactive = true;
    pool.query('select count(*) as activeblogcount from blog where isactive = $1',
    [isactive],(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const countFeatured = (req,res) => {
    const isfeatured = true;
    pool.query('select count(*) as featuredblogcount from blog where isfeatured = $1',
    [isfeatured],(error,result) => {
        if(error){
            throw error;
        }
        res.status(200).json(result.rows);
    })
}

const updateFeatured = (req,res) => {
    const bid = parseInt(req.body.bid);
    const isfeatured = false;
    pool.query('update blog set isfeatured=$1 where bid=$2',
    [isfeatured,bid],
    (error,result) => {
        if(error){
            throw error;
        }
        res.status(200).send(`Featured updated ${bid}`);
    })
    
}

module.exports = {
    getAdmin,
    addCategory,
    getCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
    addBlog,
    getBlog,
    getBlogById,
    updateBlog,
    deleteBlog,
    getBlogFeatured,
    getBlogActive,
    upload,
    countBlogs,
    countActive,
    countFeatured,
    updateFeatured
}