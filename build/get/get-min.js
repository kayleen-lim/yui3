YUI.add("get",function(c){var b=c.Lang,d,a;c.Get=d={cssOptions:{attributes:{rel:"stylesheet"},doc:c.config.linkDoc||c.config.doc,pollInterval:50},jsOptions:{autopurge:true,doc:c.config.scriptDoc||c.config.doc},options:{attributes:{charset:"utf-8"},purgethreshold:20},REGEX_CSS:/\.css(?:[?;].*)?$/i,REGEX_JS:/\.js(?:[?;].*)?$/i,_pending:null,_purgeNodes:[],_queue:[],abort:function(h){var f,j,g,e;if(!(typeof h==="object")){j=h;h=null;if(this._pending&&this._pending.transaction.id===j){h=this._pending.transaction;this._pending=null;}else{for(f=0,e=this._queue.length;f<e;++f){g=this._queue[f].transaction;if(g.id===j){h=g;this._queue.splice(f,1);break;}}}}if(h){h.abort();}},css:function(f,e,g){return this._load("css",f,e,g);},js:function(f,e,g){return this._load("js",f,e,g);},load:function(f,e,g){return this._load(null,f,e,g);},_autoPurge:function(e){if(e&&this._purgeNodes.length>=e){this._purge(this._purgeNodes);}},_getEnv:function(){var f=c.config.doc,e=c.UA;return this._env={async:f&&f.createElement("script").async===true,cssLoad:!!(e.gecko?e.gecko>=9:!e.webkit),preservesScriptOrder:!!(e.gecko||e.opera)};},_getTransaction:function(k,g){var l=[],h,e,j,f;if(typeof k==="string"){k=[k];}for(h=0,e=k.length;h<e;++h){f=k[h];j={attributes:{}};if(typeof f==="string"){j.url=f;}else{if(f.url){c.mix(j,f,false,null,0,true);f=f.url;}else{continue;}}c.mix(j,g,false,null,0,true);c.mix(j,this.options,false,null,0,true);if(!j.type){if(this.REGEX_CSS.test(f)){j.type="css";}else{if(!this.REGEX_JS.test(f)){}j.type="js";}}c.mix(j,j.type==="js"?this.jsOptions:this.cssOptions,false,null,0,true);j.attributes.id||(j.attributes.id=c.guid());if(j.win){j.doc=j.win.document;}else{j.win=j.doc.defaultView||j.doc.parentWindow;}if(j.charset){j.attributes.charset=j.charset;}l.push(j);}return new a(l,g);},_load:function(f,g,e,i){var h;e||(e={});e.type=f;if(!this._env){this._getEnv();}h=this._getTransaction(g,e);this._queue.push({callback:i,transaction:h});this._next();return h;},_next:function(){var e;if(this._pending){return;}e=this._queue.shift();if(e){this._pending=e;e.transaction.execute(function(){e.callback&&e.callback.apply(this,arguments);d._pending=null;d._next();});}},_purge:function(f){var h=this._purgeNodes,k=f!==h,e,g,j,i;while(j=f.pop()){i=j.parentNode;if(j.clearAttributes){j.clearAttributes();}else{for(e in j){if(j.hasOwnProperty(e)){delete j[e];}}}i&&i.removeChild(j);if(k){g=c.Array.indexOf(h,j);if(g>-1){h.splice(g,1);}}}}};d.script=d.js;d.Transaction=a=function(g,f){var e=this;e.id=a._lastId+=1;e.data=f.data;e.errors=[];e.nodes=[];e.options=f;e.requests=g;e._callbacks=[];e._queue=[];e._waiting=0;e.tId=e.id;e.win=f.win||c.config.win;};a._lastId=0;a.prototype={_state:"new",abort:function(e){this._pending=null;this._pendingCSS=null;this._pollTimer=clearTimeout(this._pollTimer);this._queue=[];this._waiting=0;this.errors.push({error:e||"Aborted"});this._finish();},execute:function(m){var g=this,l=g.requests,k=g._state,h,f,e,j;if(k==="done"){m&&m(g.errors.length?g.errors:null,g);}else{m&&g._callbacks.push(m);if(k==="executing"){return;}}g._state="executing";g._queue=e=[];if(g.options.timeout){g._timeout=setTimeout(function(){g.abort("Timeout");},g.options.timeout);}for(h=0,f=l.length;h<f;++h){j=g.requests[h];if(j.async||j.type==="css"){g._insert(j);}else{e.push(j);}}g._next();},purge:function(){d._purge(this.nodes);},_createNode:function(g,f,i){var h=i.createElement(g),e;for(e in f){if(f.hasOwnProperty(e)){h.setAttribute(e,f[e]);}}return h;},_finish:function(){var k=this.errors.length?this.errors:null,f=this.options,j=f.context||this,h,g,e;if(this._state==="done"){return;}this._state="done";for(g=0,e=this._callbacks.length;g<e;++g){this._callbacks[g].call(j,k,this);}if(f.onEnd||f.onFailure||f.onSuccess||f.onTimeout){h=this._getEventData();if(k){if(f.onTimeout&&k[k.length-1]==="Timeout"){f.onTimeout.call(j,h);}if(f.onFailure){f.onFailure.call(j,h);}}else{if(f.onSuccess){f.onSuccess.call(j,h);}}if(f.onEnd){f.onEnd.call(j,h);}}},_getEventData:function(e){if(e){return c.merge(this,{abort:this.abort,purge:this.purge,request:e,url:e.url,win:e.win});}else{return this;}},_getInsertBefore:function(f){var g=f.doc,e=f.insertBefore||g.getElementsByTagName("base")[0];if(e){return typeof e==="string"?g.getElementById(e):e;}e=g.head||g.getElementsByTagName("head")[0];return e?e.firstChild:g.getElementsByTagName("script")[0];},_insert:function(m){var j=d._env,k=this._getInsertBefore(m),g=m.type==="js",f=m.node,n=this,e=c.UA,h;if(!f){if(g){h="script";}else{if(!j.cssLoad&&e.gecko){h="style";}else{h="link";}}f=m.node=this._createNode(h,m.attributes,m.doc);}function i(o){n._progress("Failed to load "+m.url,m);}function l(){n._progress(null,m);}if(g){f.setAttribute("src",m.url);if(m.async){f.async=true;}else{if(j.async){f.async=false;}if(!j.preservesScriptOrder){this._pending=m;}}}else{if(!j.cssLoad&&e.gecko){f.innerHTML=(m.attributes.charset?'@charset "'+m.attributes.charset+'";':"")+'@import "'+m.url+'";';}else{f.setAttribute("href",m.url);}}if(g&&e.ie&&e.ie<9){f.onreadystatechange=function(){if(/loaded|complete/.test(f.readyState)){f.onreadystatechange=null;l();}};}else{if(!g&&!j.cssLoad){this._poll(m);}else{f.onerror=i;f.onload=l;}}this._waiting+=1;this.nodes.push(f);k.parentNode.insertBefore(f,k);},_next:function(){if(this._pending){return;}if(this._queue.length){this._insert(this._queue.shift());}else{if(!this._waiting){this._finish();}}},_poll:function(m){var p=this,q=p._pendingCSS,k=c.UA.webkit,g,e,f,o,n,h;if(m){q||(q=p._pendingCSS=[]);q.push(m);if(p._pollTimer){return;}}p._pollTimer=null;for(g=0;g<q.length;++g){n=q[g];if(k){h=n.doc.styleSheets;f=h.length;o=n.node.href;while(--f>=0){if(h[f].href===o){q.splice(g,1);g-=1;p._progress(null,n);break;}}}else{try{e=!!n.node.sheet.cssRules;q.splice(g,1);g-=1;p._progress(null,n);}catch(l){}}}if(q.length){p._pollTimer=setTimeout(function(){p._poll.call(p);},p.options.pollInterval);}},_progress:function(g,f){var e=this.options;if(g){f.error=g;this.errors.push({error:g,request:f});}f.finished=true;
if(e.onProgress){e.onProgress.call(e.context||this,this._getEventData(f));}if(f.autopurge){d._autoPurge(this.options.purgethreshold);d._purgeNodes.push(f.node);}if(this._pending===f){this._pending=null;}this._waiting-=1;this._next();}};},"@VERSION@",{requires:["yui-base"]});