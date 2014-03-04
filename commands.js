/*
if(!PS) {
    PS = {}
    PS.call = function() {}
    PS.log = function(txt) { console.log(txt);}
    PS.get = function() { return {msg:"PS not connected"}};
    PS.simpleGet = PS.get;
}
*/

try {PS.log("we have been called!");} catch(e) {}

var makeMapWithFn = function(arr,fn) {
    var rval = {}
    forEach(arr,function(elt) {
        console.log("'",elt,"'")
     rval[fn(elt)] = elt    
    })
    return rval
}

var forEach = function(arrayLike,fn) {
    for(var i = 0; i < arrayLike.length; i++)
        fn(arrayLike[i],i,arrayLike)
}

var filter = function(arrayLike,fn) {
    var rval = []
    for(var i = 0; i < arrayLike.length; i++) {
        var elt = arrayLike[i];
        if(fn(elt,i,arrayLike))
            rval.push(elt)
            }
    return rval
}

var map = function(arrayLike,fn) {
    var rval = []
    for(var i = 0; i < arrayLike.length; i++) {
        var elt = arrayLike[i];
        rval.push(fn(elt,i,arrayLike))
    }
    return rval
}

var getExtension = function(str) {
    console.log(str)
    return str.substring(str.lastIndexOf('.')+1)   
}
var allExtensions = function(arr) {

    return makeMapWithFn(arr, getExtension)  
}

var imgtypes = {png:1, svg:1, jpg:1}
var isImagePath = function(path) {
    return getExtension(path) in imgtypes 
}
var isCSSLink = function(link) { return link.rel === "stylesheet"}

onFilesChanged = function(arr) {
    console.log("!!!")
    console.log(arr.length, "filesChanged")
    var types = allExtensions(arr)
   console.log(types)
   if(types.js) {
        console.log("js changed. time to reload")
        location.reload();  
        console.log("do we still get called?")
        console.log("yes, yes we do")
   } else if (types.png || types.svg || types.jpg) {
       console.log("image changed")
       reloadImages(arr.filter(isImagePath))
   } else if (types.css) {
       reloadCSS(arr)
   }
}

//var keyFromUrl = function(url) {
// for(var key in url) {
//     console.log("url",url)
//    return key
// }
//}


var stripMunge = function(str) {
 var idx = str.indexOf('?')
 return idx == -1 ? str : str.substring(0,idx) + ')'
}
var mungeCounter = 0
var mungeUrl = function(str) {
    mungeCounter++
    return str.substring(0,str.length-1) + '?'+mungeCounter+ ')';
     
}

var reloadImages = function (arr) {
    console.log("input",arr)
    var urlMap = makeMapWithFn(arr, function(elt) { return "url(file://"+elt+")"})
    console.log(urlMap)

    
    
//    forEach(document.styleSheets,function(sheet) {
//        forEach(sheet.cssRules, function(rule){
//            var img = rule.style.backgroundImage
//            if(img.lenth > 0)
//                console.log(rule)
//        })
//    })

  //  console.log(document.all.length)
    forEach(document.all, function(elt) {
 //       console.log(elt.tagName, elt.style)
//        var img = keyFromUrl(elt.style.backgroundImage)
      var img = elt.style.backgroundImage + ""
      if(img.length == 0) img = window.getComputedStyle(elt).backgroundImage + ""
      if(img.length == 0 || img == "none")
          return
        
          
        img = stripMunge(img)
          console.log(img)
        
        if(img in urlMap) {
    //    if(urls.indexOf(img) != -1) {
            console.log("found it")
            // elt.style.setProperty("backgroundImage",)
            elt.style.backgroundImage  = mungeUrl(img)  
            console.log("ELT",elt)
            console.log("STYLE",elt.style)
            console.log("CSS",elt.style.cssText)
            console.log(" elt.style.backgroundImage  = '"+newImage+"'")
          //  elt.style.cssText = "backgroundImage:"+ newImage + ';'
            console.log(elt.style.backgroundImage)
        }
    })
    
//    reloadCSS(arr)   // cheap but slow -- should just run through and update the styles
}

reloadCSS = function(arr) {
    var links = document.getElementsByTagName("link")
    var cssLinks = filter(links,isCSSLink)
    var log = console.log
    var cb = function(link) { 
        console.log(link)
        var temp = link.href
        link.href = ""
        link.href = temp + "?"
    }
    console.log(links)
    forEach(cssLinks,cb)
}

Commands = {
}

Commands.Noun = {
layerCount:"NmbL"
}

Commands.Verbs = {
    select: "slct",
    make: "MK  "
}

var Inner = {
}

Inner.CallSimple = function(verb,noun) {
    PS.call(verb,{"null":{ref:noun}})
}

Commands.selectTool = function(toolName) {
    AI.toolName = toolName
}

Commands.make = function(noun) {
    Inner.CallSimple("Mk  ",noun);
}

Commands.makeLayer = function() {
    Commands.make("Lyr ");
}

Commands.layerCount = function (docID) {
    var ref = {  property:"NmbL",
                  id:{ "Dcmn":docID}
    }
    var result = get(ref);
    
    PS.log(JSON.stringify(result));
}

Commands.selectLayer = function(name) {
    try {
    PS.call("slct",
            {
                "MkVs":0,
                "null":{ name :name, ref:"Lyr "}
            });
    } catch (e) {
        PS.log('select layer '+ e);
    }
}
Commands.hasLayer = function(name) {
  var l = PS.get({ref:'Lyr ', name:name})
  return typeof l == "object";
}

Commands.renameLayer = function(name) {
PS.call('setd',{
  "T   " : {
    "obj" : "Lyr ",
    "Nm  " : name
  },
  "null" : {
    "ref" : "Lyr ",
    "value" : "Trgt",
    "enumType" : "Ordn"
  }
})
}


Commands.selectFrontLayer = function () {
    PS.call('slct',{
  "MkVs" : 0,
  "null" : {ref:"Lyr ",
                        value:"Frnt",
                        enumType:"Ordn"}
})
}

Commands.selectBackLayer = function () {
    PS.call('slct',{
  "MkVs" : 0,
  "null" : {ref:"Lyr ",
                        value:"Back",
                        enumType:"Ordn"}
})
}
Commands.moveFrontLayerToBack = function () {
    Commands.selectFrontLayer();
    Commands.moveSelectedLayerToBack();
}

Commands.moveBackLayerToFront = function () {
    Commands.selectBackLayer();
    Commands.moveSelectedLayerToFront();
}
Commands.moveSelectedLayerToFront = function () {
    PS.call("move",{"null":{ref:"Lyr ",
                            value:"Trgt",
                            enumType:"Ordn"},
                    to:{ref:"Lyr ",
                        value:"front",
                        enumType:"Ordn"}
                   }
           ); 
}

Commands.moveSelectedLayerToBack = function () {
    PS.call("move",{"null":{ref:"Lyr ",
                            value:"Trgt",
                            enumType:"Ordn"},
                    to:{ref:"Lyr ",
                        value:"Back",
                        enumType:"Ordn"}
                   }
           ); 
}


Commands.moveNamedLayerToFront = function (name) {
    
    PS.call("move",{ 'null':{ref:"Lyr ",name:name}, 
                    to:{ref:"Lyr ",value:"front",enumType:"Ordn"}
                   }); 
}

//function SetBrush( inDiameter, inHardness, inAngle, inRoundness, inSpacing, inInterpolation, inFlipX, inFlipY ) {
//   var idsetd = charIDToTypeID( "setd" );
//   var desc97 = new ActionDescriptor();
//   var idnull = charIDToTypeID( "null" );
//       var ref56 = new ActionReference();
//       var idBrsh = charIDToTypeID( "Brsh" );
//       var idOrdn = charIDToTypeID( "Ordn" );
//       var idTrgt = charIDToTypeID( "Trgt" );
//       ref56.putEnumerated( idBrsh, idOrdn, idTrgt );
//   desc97.putReference( idnull, ref56 );
//   var idT = charIDToTypeID( "T   " );
//       var desc98 = new ActionDescriptor();
//       var idDmtr = charIDToTypeID( "Dmtr" );
//       var idPxl = charIDToTypeID( "#Pxl" );
//       desc98.putUnitDouble( idDmtr, idPxl, inDiameter );
//       var idHrdn = charIDToTypeID( "Hrdn" );
//       var idPrc = charIDToTypeID( "#Prc" );
//       desc98.putUnitDouble( idHrdn, idPrc, inHardness );
//       var idAngl = charIDToTypeID( "Angl" );
//       var idAng = charIDToTypeID( "#Ang" );
//       desc98.putUnitDouble( idAngl, idAng, inAngle );
//       var idRndn = charIDToTypeID( "Rndn" );
//       var idPrc = charIDToTypeID( "#Prc" );
//       desc98.putUnitDouble( idRndn, idPrc, inRoundness );
//       var idSpcn = charIDToTypeID( "Spcn" );
//       var idPrc = charIDToTypeID( "#Prc" );
//       desc98.putUnitDouble( idSpcn, idPrc, inSpacing );
//       var idIntr = charIDToTypeID( "Intr" );
//       desc98.putBoolean( idIntr, inInterpolation );
//       var idflipX = stringIDToTypeID( "flipX" );
//       desc98.putBoolean( idflipX, inFlipX );
//       var idflipY = stringIDToTypeID( "flipY" );
//       desc98.putBoolean( idflipY, inFlipY );
//   var idcomputedBrush = stringIDToTypeID( "computedBrush" );
//   desc97.putObject( idT, idcomputedBrush, desc98 );
//   executeAction( idsetd, desc97, DialogModes.NO );
//}
//

Unit = {

 px: function(val) { return {unit:"#Pxl", value:val} },
 percent: function(val) { return {unit:"#Prc", value:val} },
 angle: function(val) { return {unit:"#Ang", value:val} }
}

var target = function(className) { 
    return {ref:className, enumType:"Ordn", value:"Trgt"}   
}

Commands.moveTool = function (params) {
     AI.toolName = "Adobe Select Tool"
//     
//    var args = {"null": [{ref:"capp",value:"Trgt",enumType:"Ordn"}, {ref:'Prpr', property:"_tool"}], 
//                     to: {
//                         obj:"CrnT",
//                         ASGr: params.groups || 0,
//                         AtSL: params.autoSelect || 0,
//                         Abbx: params.transformControls || 0
//                     }}
//    console.log(args)
//        PS.call("setd", args)
}
Commands.setBrush = function (diam, hard, angle,round,spacing) {
    
    PS.call("setd", {"null": target("Brsh"), 
                     to: {
                         obj:"computedBrush",
                         Dmtr:Unit.px(diam), 
                         Hrdn:Unit.percent(hard || 100), 
                         Angl:Unit.angle(angle || 0),
                         Rndn:Unit.percent(round || 100),
                         Spcn:Unit.percent(spacing || 1)
                        } })
    
}

Commands.getBrush = function() {
  return PS.get([{ref:"capp",value:"Trgt",enumType:"Ordn"}, {ref:'Prpr', property:"_tool"}])   
}
Commands.moveSelectedLayerTo = function (idx) {
    
PS.call("move",
  {
    "Vrsn" : 5,
    "Adjs" : 0,
    "T   " : {
      "ref" : "Lyr ",
      "index" : idx
    },
    "null" : {
      "ref" : "Lyr ",
      "value" : "Trgt",
      "enumType" : "Ordn"
    }
  }
)
}

Commands.setStroke = function(r, g, b) {
  console.log(AI.strokeColor);
  // AI likes to see RGB in 1-0 range
  AI.strokeColor = {rgb:[r/255,g/255,b/255]}
}

Commands.getStroke = function() {
  console.log(AI.strokeColor);
}

Commands.setFill = function(r, g, b) {
  console.log(AI.strokeFill);
  // AI likes to see RGB in 1-0 range
  AI.fillColor = {rgb:[r/255,g/255,b/255]}
}

Commands.getFill = function() {
  console.log(AI.fillColor);
}

Commands.bluePencil = function() {
    try {
    AI.toolName = "Adobe Freehand Tool";
    AI.strokeColor = {cmyk:[1,0,0,0]}
    
//    if(Commands.hasLayer("blue pencil")) {
//        Commands.selectLayer("blue pencil");
//    } else {
//      Commands.makeLayer();
//      Commands.renameLayer("blue pencil");
//    }
//    Commands.moveSelectedLayerToFront();
//    
////        PS.call( "slct",
////                {
////                "null" : {
////                "ref" : "Brsh",
////                "name" : "Hard Mechanical 2 pixels"
////                }});
//        
//    Commands.setBrush(2)
//    Commands.setForegroundColor(65,179,225);
    } catch (e) {
        AI.log(e+'');
    }
    
}

receiveMessage = function(message) {
        console.log("received: " + message.data, "received");
        var data = JSON.parse(message.data)
        if(data.fill) {
          var fillRGB = data.fill;
          console.log(fillRGB);
          Commands.setFill(fillRGB.red, fillRGB.green, fillRGB.blue);
        }
        if(data.stroke) { 
          var strokeRGB = data.stroke;
          Commands.setStroke(strokeRGB.red, strokeRGB.green, strokeRGB.blue);
        }
        if(data.sampled) {  
          var sampleRGB = data.sampled;
          Commands.setFill(sampleRGB.red, sampleRGB.green, sampleRGB.blue);
          Commands.setStroke(sampleRGB.red, sampleRGB.green, sampleRGB.blue);
        }

    }

createWebSocketConnection = function() {
        var wsUrl;
        // "wss" is for secure conenctions over https, "ws" is for regular
        if (window.location.protocol === "https:") {
            wsUrl = "wss://127.0.0.1:3000/";
        } else {
            wsUrl = "ws://127.0.0.1:3000/";
        }
        
        // create the websocket and immediately bind handlers
        ws = new WebSocket(wsUrl);
        ws.onopen = function () { console.log("opened websocket"); };
        ws.onmessage = receiveMessage;
        ws.onclose = function () { displayState("closed websocket"); };
    }


Commands.setVisSets = function(classic, notClassic) {
    try {
 //   PS.log(classic ? "going classic" : "going custom");

    Owl.tools = Owl.controls = Owl.tabs = classic;
    } catch (e) {}
    Commands.setVisibility("tools",notClassic);
    Commands.setVisibility("properties",notClassic);
//    Commands.setVisibility("goClassic",notClassic);
//    Commands.setVisibility("goCustom",classic);
}

Commands.setClassic = function(classic) {
    Commands.setVisSets(classic,!classic)
    document.getElementById("toggle").className = classic ? "classic" : "custom"
    document.body.className = classic ? "classic" : "custom"
}


Commands.showBoth = function() {
    Commands.setVisSets(true,true)
    document.getElementById("toggle").className = "dev"
    document.body.className = "dev"

}

Commands.toggleIconMess = function() {
    var className = document.getElementById("lotsoftools").className;
    
    if(className == "hidden") className = "showing";
    else className = "hidden"
    
    
    document.getElementById("lotsoftools").className = className;
    
}


Commands.setVisibility = function(id,show) {
    var elt = document.getElementById(id)
    if(elt)
        elt.style.visibility = show?"inherit":"hidden";
}

Commands.getForegroundColor = function() {
 try {
 //   var json = PS.query({ref:'FrgC', enumType:"Ordn", value:'Trgt', property:'capp'})
    var json = PS.get({ref:'capp', enumType:"Ordn", value:'Trgt', property:'FrgC'})
    PS.log(JSON.stringify(json,null,'\t'));
 } catch (e) {
    PS.log(e+'')   
 }
}

Commands.makeFillLayer = function(r,g,b) {

    if(arguments.length == 0) return Commands.makeFillLayer(255,255,255);
    else if(arguments.length == 1) return Commands.makeFillLayer(r >> 16, (r >> 8) & 255, r & 255);
    
 PS.call('Mk  ',{
  "Usng" : {
    "obj" : "contentLayer",
    "Type" : {
      "obj" : "solidColorLayer",
      "Clr " : {
        "Grn " : g,
        "Rd  " : r,
        "obj" : "RGBC",
        "Bl  " : b
      }
    }
  },
  "null" : {
    "ref" : "contentLayer"
  }
})
   
}


Commands.advanceSlideshow= function() {
    Commands.moveFrontLayerToBack();
    Commands.moveFrontLayerToBack();
}

Commands.backupSlideshow= function() {
    Commands.moveBackLayerToFront();
    Commands.moveBackLayerToFront();
}

Commands.getDocID = function(idx) {
 try {
    var json = PS.query({ref:'Dcmn', index:idx, property:'DocI'})
    PS.log(JSON.stringify(json,null,'\t'));
 } catch (e) {
    PS.log(e+'')   
 }
     
}


Commands.askStr = function(str) {
 try {
        var obj =JSON.parse(str);
        return Commands.askObj(obj);
     } catch (e) {
     PS.log(e+'');
     PS.log("input string:<<"+str+">>")
 }
    
}


Commands.askObj = function(obj) {
    var result;
    try {
        result = PS.get(obj);
        PS.log(JSON.stringify(result,null,'\t'));
        return result;
 } catch (e) {
     PS.log(e+'');
     PS.log("input :"+JSON.stringify(obj,null,'\t'))
     return (e + "")
 }
    
}

Commands.ask = Commands.askObj

Commands.getDocCount = function(idx) {
 try {
    var json = PS.get({ref:'capp',  property:'NmbD'})
    PS.log(JSON.stringify(json,null,'\t'));
 } catch (e) {
    PS.log(e+'')   
 }
     
}
Commands.setForegroundColor = function(r,g,b) {
  
    PS.call("setd",{
         "Srce" : "colorPickerPanel",
         "T   " : {
            "Grn " : g,
            "Rd  " : r,
            "obj" : "RGBC",
            "Bl  " : b
         },
         "null" : {"ref" : "Clr ","property" : "FrgC"}
            })
}

Commands.target = function(x) { return {ref:x, enumType:'Ordn', value:"Trgt"}}

Commands.toggleLayer = function(idx, show) {
    var cmd = show ? "show":"hide"
    PS.call()

        }

Commands.crossAppInit = function() {
    createWebSocketConnection();
}

Commands.crossAppSendMessage = function(message) {
        var success = false;
        if (ws && ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(message);
                success = true;
            } catch (e) {
                console.error("Error sending message", e);
            }
        }
        
        if (success) {
            console.log("sent: " + message, "sent");
        } else {
            console.log("failed to send: " + message, "error");
        }
        
}

