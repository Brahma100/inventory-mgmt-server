const express =require('express');
const router =express.Router();
const auth=require("../../middleware/auth");
// Item Model

const Item=require('../../models/Item');

//@route GET api/items
//@desc Get All Items
// @access Public

router.get('/',(req,res)=>{
    Item.find()
    .sort({date:-1}) // sort by date in desc order
    .then(items=>res.json(items));   //this is a Json API 
});


//@route Post api/items
//@desc Post A New Item
// @access Public

router.post('/',auth,(req,res)=>{
    const newItem=new Item({
        name:req.body.name
    });
    newItem.save().then(item=>res.json(item)); 
});

//@route Delete api/items
//@desc Delete A Item by id
// @access Public

router.delete('/:id',auth,(req,res)=>{
    Item.findById(req.params.id)
    .then(item=> item.remove())
    .then(()=>res.json({success:true}))
    .catch(err=>res.status(404).json({success:false}));

});




module.exports=router;