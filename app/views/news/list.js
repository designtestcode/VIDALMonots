
var config = require('../../shared/config');
var http = require('http');

var observableModule = require('data/observable');
var frame = require("ui/frame");

class NewsListViewModel extends observableModule.Observable{}

var bc = new NewsListViewModel();


function navigatingToHandler(args) {
    var page = args.object;
    page.bindingContext = bc;
}

exports.tapHandler = function(e){

    if(!bc.get("news")||!bc.get("news").length)
        return;

    var news = bc.get('news')[e.index];

    if(!news)
        return;


    frame.topmost().navigate({
        moduleName:'views/news/details',
        bindingContext:news
    });
};

exports.navigatingToHandler = navigatingToHandler;

exports.loadedHandler = function(){

    var url = config.api.resources.url+"news?order=publication_date_news:desc&token="+config.api.resources.token;

    //console.log("url : " + url);

    http.getJSON(url).then(function(r){
        bc.set('news', r.results);
        //console.log("json : " + r.results);
    }, function(e){});
};