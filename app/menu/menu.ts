import { StackLayout } from 'ui/layouts/stack-layout';
import { NavigatedData } from 'ui/page';

import {ObservableArray} from "tns-core-modules/data/observable-array";
var observableModule = require('data/observable');
var frame = require("ui/frame");


class MenuListViewModel extends observableModule.Observable{}

var model = new MenuListViewModel();

/* ***********************************************************
* Use the "onNavigatingTo" handler to initialize the page binding context.
*************************************************************/
export function onNavigatingTo(args: NavigatedData) {
    let page = <StackLayout>args.object;
    page.bindingContext = model;

    var menu = new Array();
    menu.push({"type":"n","name":"News"});
    menu.push({"type":"m","name": "Monographies"});
    model.set("menu", menu);
}


exports.onLoaded = function(){


};


export function  OnTapHandler(args)
{
    if (!model.get("menu") || !model.get("menu").length)
        return;

    var item = model.get('menu')[args.index];

    if (!item)
        return;

    switch (item.type) {
        case 'm' :
            frame.topmost().navigate({
                moduleName: 'mono/mono-page',
                //bindingContext: item
            });
            break;
        case 'n' :
            frame.topmost().navigate({
                moduleName: 'views/news/list',
                //bindingContext: item
            });
            break;
    }

}