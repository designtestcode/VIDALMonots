import { StackLayout } from 'ui/layouts/stack-layout';
import { NavigatedData } from 'ui/page';

import { MonoViewModel } from './mono-view-model';
import {ObservableArray} from "tns-core-modules/data/observable-array";
var observableModule = require('data/observable');
var config = require('../shared/config');
var http = require('http');
var frame = require("ui/frame");
import { SearchBar } from "ui/search-bar";
import * as dialogs from "ui/dialogs";

import * as segmentedBarModule from "tns-core-modules/ui/segmented-bar";

var fs = require('file-system');
var Sqlite = require("nativescript-sqlite");

var database = null;
let dbName = "vidalmono.sqlite";

var result = new Array();

var segmentIndex = 0;

class NewsListViewModel extends observableModule.Observable{}

var model = new NewsListViewModel();

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    let page = <StackLayout>args.object;
    page.bindingContext = model;
}

exports.onLoaded = function(){

};

export function onClear(args)   {
    let searchBar = <SearchBar>args.object;
    model.set("products", "");
    searchBar.dismissSoftInput();
}

export function onSubmit(args)   {

    if(segmentIndex > 0)   {
        dialogs.action("Non supporté", "Annuler", []).then(result => {
            model.set("products", "");          
            return;
        });
    }

    let searchBar = <SearchBar>args.object;
    searchBar.dismissSoftInput();

    if(segmentIndex === 0 )
        searchProductLike(searchBar.text);
}

export function loadSearchBar(args){

    if(segmentIndex > 0)   {
        dialogs.action("Non supporté", "Annuler", []).then(result => {
            model.set("products", "");            
            return;
        });
    }

    var searchBar:SearchBar = <SearchBar>args.object;

    searchBar.on("textChange", function(args){
        let text = (<any>args).value;
        if( !text || text.length == 0 ) {
            return;
        }
        if(segmentIndex > 0)   {
            dialogs.action("Non supporté", "Annuler", []).then(result => {
                model.set("products", "");          
                return;
            });
        }

        if(segmentIndex === 0 )
            searchProductLike(text);
    })
}

export function  tapHandler(args)
{
    if(!model.get("products")||!model.get("products").length)
        return;

    var product = model.get('products')[args.index];

    if(!product)
        return;

    product.someUrl = "https://mobile-fastdoc.vidal.fr/V1/product/" + product.id + "/document?codeLap=VIDALMOBILE&uuid=577068&version=4.0";

    frame.topmost().navigate({
        moduleName:'mono/mono-document',
        bindingContext:product
    });
}

function searchProductLike(text: String) {
    var resultSet = new Array();

    var dbName = "vidalmono.sqlite";

    try {
        if (!Sqlite.exists("vidalmono.sqlite")) {
            Sqlite.copyDatabase("vidalmono.sqlite");
        }
    }
    catch (e) {
        console.log(e.toString());
        return new Array();
    }
    if( database == null )  {
        (new Sqlite("vidalmono.sqlite")).then(db => {
                database = db;
                database.resultType(Sqlite.RESULTSASOBJECT);
                _searchProductLike( text);
            }   //(new Sqlite("vidalmono.sqlite")).then(db =>
            , error => {
                console.log("OPEN DB ERROR", error);
            });
    }   else
        _searchProductLike( text);

}   //searchProductLike(text: String)

function _searchProductLike(text: String)    {
    var sql = "select distinct product.productid as id ,product.name as name, product.saumon as saumon, product.generictype as generictype" +
        " from product" +
        " where (product.nameWithoutAccent like('" + text + "%%') or product.nameWithoutAccent like('%% " + text + "%%'));"

    database.all(sql).then( data => {
        model.set('products', data);
    }); //db.all(sql).then( data =>
}

export function segmentedBarIndexChanged(args) {
    //segmentedBar = <SegmentedBar>args.oject;
//    console.log("Tab selected: " + args.newIndex + ", old one is:" + args.oldIndex);
    segmentIndex = args.newIndex;
    if(segmentIndex > 0)   {
        dialogs.action("Non supporté", "Annuler", []).then(result => {
            model.set("products", "");
            
        });
    }
}
