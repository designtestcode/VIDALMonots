
var config = require('../../shared/config');
var http = require('http');
var he = require('he');

var observableModule = require('data/observable');
var frame = require("ui/frame");
var dictionary = require('../../vidal/Dictionary');

class NewsListViewModel extends observableModule.Observable{}

var bc = new NewsListViewModel();
bc.set('isLoading', true);

function formatDate(pDate){
    let d = pDate.split('-');
    return d[2]+" "+dictionary.months[Number(d[1])-1]+" "+d[0];
}

function navigatingToHandler(args) {
    let page = args.object;
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
        transition:{
            name: "slide",
            duration: 380,
            curve: "easeOut"
        },
        bindingContext:news
    });
};

exports.showSideDrawer = function(){
    console.log("open menu");
};

exports.navigatingToHandler = navigatingToHandler;

exports.loadedHandler = function(e){

    var url = config.api.resources.url+"news?order=publication_date_news:desc&token="+config.api.resources.token;

    http.getJSON(url).then(function(r){
        for(var i = 0, max = r.results.length; i<max; i++){
            r.results[i].decoded_title = he.decode(r.results[i].title_news);
            r.results[i].type.decoded_name = he.decode(r.results[i].type.name_type);
            r.results[i].author.name_user = he.decode(r.results[i].author.name_user);
            r.results[i].author.firstname_user = he.decode(r.results[i].author.firstname_user);
            r.results[i].formated_date = formatDate(r.results[i].publication_date_news);
        }
        bc.set('news', r.results);
        e.object.getViewById("loading").animate({opacity:0,duration:500}).then(function(){
            bc.set("isLoading", false);
        });
    }, function(e){});
};

exports.imageLoadedHandler = function(e){
    e.object.animate({opacity:1, duration:400});
};