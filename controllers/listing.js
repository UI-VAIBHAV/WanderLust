const List = require("../model/listening.js")
const ExpressError = require("../utils/expressError");

module.exports.index = async(req,res)=>{
    const listItem = await List.find({});
    res.render("listings/view.ejs",{listItem});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listIng = await List.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!listIng) {
        throw new ExpressError(404, "Listing not found!");
    }
    console.log(listIng);
    res.render("listings/show.ejs",{listIng});
}

module.exports.createListing = async(req,res,next)=>{
    // let response = await geocodingClient.forwardGeocode({
    //     query : req.body.listing.location,
    //     limit : 1,
    // }).send()
    // console.log(response.body.features[0].geometry);
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,filename);
    const newList = new List(req.body.listing);
    newList.owner = req.user._id;
    newList.image = {url,filename};
    await newList.save();
    req.flash("success","New listing created!");
    res.redirect("/listings");
}

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const listInfo = await List.findById(id);
    if(!listInfo){
        req.flash("error","listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listInfo.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listInfo,originalImageUrl});    
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await List.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined"){ 
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","listing updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await List.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","listing Deleted!");
    res.redirect("/listings");
}