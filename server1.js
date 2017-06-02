/*var express = require('express');

var app = express();

var mypendings=[
    {
        task:"go home",
        finished: false
    },
    {
        task:"come to office",
        finished: false
    }
]

app.use(express.static('public'));
app.get('/showmydata',function(req,res){
    res.json(mypendings);
})
app.listen(3000,function(){
    console.log("Server has started");
})

*/

var cluster = require('cluster')
var express = require('express');
var bp=require('body-parser');
var _=require('underscore');
var MongoClient = require('mongodb').MongoClient
var db;
MongoClient.connect('mongodb://admin:admin@ds147599.mlab.com:47599/nakidb',(err ,database) => {
    if(err) return console.log(err)
    db = database
})

if (cluster.isMaster){
    var cpuCount = require('os').cpus.length;

    for (var i =0 ; i< cpuCount; i+=1){
        cluster.fork();
    }
}
else{

var app = express();

app.get('./getmydata',function(req,res){
    res.send('Hello from Worker '+cluster.worker.id);
});

var pid=1;

var pendingtasks=[];

app.use(bp.json());


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
   // fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

app.post('/postmydata',function(req,res) {
    db.collection('mytasks').save(req.body, function(err, result){
        if(err) return console.log("error");
        console.log("saved to db");
    });
    /**var body=req.body;
    body.id=pid++;
    pendingtasks.push(body);
    res.json(body);**/
})

app.use(express.static('public'))

app.get('/showmydata',function(req,res){
    db.collection('mytasks').find().toArray((err, result) =>{
        if(err) return console.log(err)
        res.json(result);
    })
    
});
app.get('/showmydata/:id',function(req,res){
    var todoId=parseInt(req.params.id,10);
    var matchedTodo = _.findWhere(pendingtasks,{id:todoId}); 

    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

app.delete('/deletemydata/:id',function(req,res){
    db.collection('mytasks').findOneAndDelete({name:req.body.name}, (err,result) =>
    {
        if(err) return res.send(500,err_)
        res.send('record deleted')
    })
});

app.listen(3000,function() {
    console.log('Server is Started !!!');
})
}