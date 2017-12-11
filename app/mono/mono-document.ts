
exports.navigatingToHandler = function(args){
    var page = args.object;
    console.log("navigatingToHandler : " + page);

//console.log("page.bindingContext = " + page.bindingContext.name);
//    console.log("page.bindingContext = " + page.bindingContext.id);
    console.log("page.bindingContext someUrl = " + page.bindingContext.someUrl);
//   page.bindingContext.someUrl = "https://mobile-fastdoc.vidal.fr/V1/product/17855/document?codeLap=VIDALMOBILE&uuid=577068&version=4.0";


};

exports.loadedHandler = function(){

};