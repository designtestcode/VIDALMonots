/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import "./bundle-config";
import * as app from 'application';

app.setCssFileName("app.css");

app.start({ moduleName: "menu/menu" });
//app.start({ moduleName: "mono/mono-page" });
//app.start({ moduleName: "views/news/list" });
/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
