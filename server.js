// require("dotenv").config();
// import dotnev from 'dotenv';
//IMPORTS
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(cors({origin: true, credentials: true}));
app.use(express.urlencoded({ extended: true }));

//DATABASE
const tasks = [
  {
    title: "Kitty 3",
    status:"incomplete"
  },
  {
    title: "Kitty 1",
    status:"complete"
  },  
  {
    title: "Kitty 4",
    status:"incomplete"
  },
];

mongoose.connect(
  'mongodb://127.0.0.1:27017/university',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (err) {
    if (!err) {
      console.log("Database connected...");
    } else {
      console.log(err);
    }
  }
);

const tasksSchema = new mongoose.Schema({
  title:{type:String,require:true},
  status:{type:String,require:true},
},{
  timestamps:true
  });

const task = mongoose.model("task", tasksSchema);

//insert data into db
// tasks.forEach((data) => {
//   const newTask = new task({
//     title: data.title,
//     status: data.status,
//   });

//   newTask.save();
// });

app.get("/", (req, res) => {
  task.find({})
    .then((items) => res.json(items))
    .catch((err) => console.log(err));
});

// app.post('/add',(req,res)=>{
//   save(task({
//     title:req.body.title,
//     status:req.body.status,
//   }));

// })

app.post('/add', async(req,res)=>{
  const kudar=await task({
    title:req.body.title,
    status:req.body.status,
  });
  await kudar.save()
  res.send("Saved Sucessfully")

});


app.put('/update/:id', async(req,res)=>{

  task.findByIdAndUpdate({
    _id:req.params.id
  },{
      $set:{
        title:req.body.title,
        status:req.body.status,
      }
  })
  .then(result=>{
      res.status(200).json({
          update:result
      })
  })
  .catch(err=>{
      console.log(err);
      res.status(404).json({
          Error:err
      })
  })
})

app.put('/updatech/:id', async(req,res)=>{

  task.findByIdAndUpdate({
    _id:req.params.id
  },{
      $set:{
        status:req.body.status,
      }
  })
  .then(result=>{
      res.status(200).json({
          update:result
      })
  })
  .catch(err=>{
      console.log(err);
      res.status(404).json({
          Error:err
      })
  })
})


app.delete("/delete/:id",async(req , res)=>{
  task.remove({_id:req.params.id}).then(reslt=>{
      res.status(200).json({
          message:"data deleted",
          reslt:reslt
      })
  })
  .catch(err=>{
      res.status(404).json({
          Error:err
      })
  })
})

app.listen(3001, function () {
  console.log("Server is running... on 3001");
});
