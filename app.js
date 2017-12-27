 var express        =require("express"),
    methodOverride  =require("method-override"),
    bodyParser      =require("body-parser"),
    mongoose        =require("mongoose"),
    expressSanitizer=require("express-sanitizer"),
    app             = express();

// app config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
// method override is used for put and delete requests
app.use(expressSanitizer());

// mongoose config
mongoose.Promise=global.Promise;
mongoose.connect("mongodb://localhost/Restfull_blog_app",{useMongoClient: true});
var blogSchema=new mongoose.Schema({
    title   :   String,
    image   :   String,
    body    :   String,
    created :   {type:Date,default:Date.now}
                // we can do this for anything , it is used to set the default value we are setting the default date to be the current date
                // ex image   : {type:String,default:"jhansi.jpeg"}
});
var Blog = mongoose.model("blog",blogSchema);

//restful  Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blog){
        if(err){
            console.log(err);
        }else{
            res.render("index.ejs",{blogs:blog});    
        }
    });
});

// New ROUTE

app.get("/blogs/new",function(req,res){
    res.render("new.ejs");
});
// create route
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,b){
        if(err){
            res.render("new");
        }else{
            res.redirect("/");     
        }
    });
});
// show route
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,found){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show.ejs",{blog:found});     
        }
    });
});
// edit route
app.get("/blogs/:id/edit",function(req, res) {
       Blog.findById(req.params.id,function(err,found){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit.ejs",{blog:found});     
        }
    });
});
// update route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateditems){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// Delete route

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });   
});
    

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server is running !!");
});