const mongoose = require("mongoose");
const listdata = require("./data.js")
const List = require("../model/listening.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await List.deleteMany({});
    listdata.data = listdata.data.map((obj)=>({...obj,owner:"68af723413f504998947f998"}));
    await List.insertMany(listdata.data);
    console.log(listdata.data);
}

initDB();