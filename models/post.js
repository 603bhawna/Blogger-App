var mongoose=require('mongoose')
var Schema=mongoose.Schema

var schema=new Schema({
    title:{type:String},
    contributor:{type:String},
    body:{type:String},
    date:{type:Date},
    category:{type:String},
    mainimage:{type:String},
    comments:[{ name:{type:String} , email:{type:String} , body:{type:String} }]
})

module.exports=mongoose.model('post',schema)