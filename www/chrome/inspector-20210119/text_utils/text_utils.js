import{StringUtilities as e}from"../platform/platform.js";class t{constructor(e,t){this.lineNumber=e,this.lineContent=t}}var n=Object.freeze({__proto__:null,ContentProvider:class{contentURL(){throw new Error("not implemented")}contentType(){throw new Error("not implemented")}contentEncoded(){throw new Error("not implemented")}requestContent(){throw new Error("not implemented")}searchInContent(e,t,n){throw new Error("not implemented")}},SearchMatch:t,contentAsDataURL:function(e,t,n,s,i=!0){return null==e||i&&e.length>1048576?null:"data:"+t+(s?";charset="+s:"")+(n?";base64":"")+","+e},DeferredContent:undefined});class s{constructor(e){this._lineEndings=e,this._offset=0,this._lineNumber=0,this._columnNumber=0}advance(e){for(this._offset=e;this._lineNumber<this._lineEndings.length&&this._lineEndings[this._lineNumber]<this._offset;)++this._lineNumber;this._columnNumber=this._lineNumber?this._offset-this._lineEndings[this._lineNumber-1]-1:this._offset}offset(){return this._offset}resetTo(e){this._offset=e,this._lineNumber=this._lineEndings.lowerBound(e),this._columnNumber=this._lineNumber?this._offset-this._lineEndings[this._lineNumber-1]-1:this._offset}lineNumber(){return this._lineNumber}columnNumber(){return this._columnNumber}}var i=Object.freeze({__proto__:null,TextCursor:s});class r{constructor(e,t,n,s){this.startLine=e,this.startColumn=t,this.endLine=n,this.endColumn=s}static createFromLocation(e,t){return new r(e,t,e,t)}static fromObject(e){return new r(e.startLine,e.startColumn,e.endLine,e.endColumn)}static comparator(e,t){return e.compareTo(t)}static fromEdit(t,n){let s=t.startLine,i=t.startColumn+n.length;const o=e.findLineEndingIndexes(n);if(o.length>1){s=t.startLine+o.length-1;const e=o.length;i=o[e-1]-o[e-2]-1}return new r(t.startLine,t.startColumn,s,i)}isEmpty(){return this.startLine===this.endLine&&this.startColumn===this.endColumn}immediatelyPrecedes(e){return!!e&&(this.endLine===e.startLine&&this.endColumn===e.startColumn)}immediatelyFollows(e){return!!e&&e.immediatelyPrecedes(this)}follows(e){return e.endLine===this.startLine&&e.endColumn<=this.startColumn||e.endLine<this.startLine}get linesCount(){return this.endLine-this.startLine}collapseToEnd(){return new r(this.endLine,this.endColumn,this.endLine,this.endColumn)}collapseToStart(){return new r(this.startLine,this.startColumn,this.startLine,this.startColumn)}normalize(){return this.startLine>this.endLine||this.startLine===this.endLine&&this.startColumn>this.endColumn?new r(this.endLine,this.endColumn,this.startLine,this.startColumn):this.clone()}clone(){return new r(this.startLine,this.startColumn,this.endLine,this.endColumn)}serializeToObject(){const e={};return e.startLine=this.startLine,e.startColumn=this.startColumn,e.endLine=this.endLine,e.endColumn=this.endColumn,e}compareTo(e){return this.startLine>e.startLine?1:this.startLine<e.startLine?-1:this.startColumn>e.startColumn?1:this.startColumn<e.startColumn?-1:0}compareToPosition(e,t){return e<this.startLine||e===this.startLine&&t<this.startColumn?-1:e>this.endLine||e===this.endLine&&t>this.endColumn?1:0}equal(e){return this.startLine===e.startLine&&this.endLine===e.endLine&&this.startColumn===e.startColumn&&this.endColumn===e.endColumn}relativeTo(e,t){const n=this.clone();return this.startLine===e&&(n.startColumn-=t),this.endLine===e&&(n.endColumn-=t),n.startLine-=e,n.endLine-=e,n}relativeFrom(e,t){const n=this.clone();return 0===this.startLine&&(n.startColumn+=t),0===this.endLine&&(n.endColumn+=t),n.startLine+=e,n.endLine+=e,n}rebaseAfterTextEdit(e,t){console.assert(e.startLine===t.startLine),console.assert(e.startColumn===t.startColumn);const n=this.clone();if(!this.follows(e))return n;const s=t.endLine-e.endLine,i=t.endColumn-e.endColumn;return n.startLine+=s,n.endLine+=s,n.startLine===t.endLine&&(n.startColumn+=i),n.endLine===t.endLine&&(n.endColumn+=i),n}toString(){return JSON.stringify(this)}containsLocation(e,t){return this.startLine===this.endLine?this.startLine===e&&this.startColumn<=t&&t<=this.endColumn:this.startLine===e?this.startColumn<=t:this.endLine===e?t<=this.endColumn:this.startLine<e&&e<this.endLine}}class o{constructor(e,t){this.offset=e,this.length=t}}var l=Object.freeze({__proto__:null,TextRange:r,SourceRange:o,SourceEdit:class{constructor(e,t,n){this.sourceURL=e,this.oldRange=t,this.newText=n}static comparator(e,t){return r.comparator(e.oldRange,t.oldRange)}newRange(){return r.fromEdit(this.oldRange,this.newText)}}});class a{constructor(e){this._value=e}lineEndings(){return this._lineEndings||(this._lineEndings=e.findLineEndingIndexes(this._value)),this._lineEndings}value(){return this._value}lineCount(){return this.lineEndings().length}offsetFromPosition(e,t){return(e?this.lineEndings()[e-1]+1:0)+t}positionFromOffset(e){const t=this.lineEndings(),n=t.lowerBound(e);return{lineNumber:n,columnNumber:e-(n&&t[n-1]+1)}}lineAt(e){const t=this.lineEndings(),n=e>0?t[e-1]+1:0,s=t[e];let i=this._value.substring(n,s);return i.length>0&&"\r"===i.charAt(i.length-1)&&(i=i.substring(0,i.length-1)),i}toSourceRange(e){const t=this.offsetFromPosition(e.startLine,e.startColumn),n=this.offsetFromPosition(e.endLine,e.endColumn);return new o(t,n-t)}toTextRange(e){const t=new s(this.lineEndings()),n=r.createFromLocation(0,0);return t.resetTo(e.offset),n.startLine=t.lineNumber(),n.startColumn=t.columnNumber(),t.advance(e.offset+e.length),n.endLine=t.lineNumber(),n.endColumn=t.columnNumber(),n}replaceRange(e,t){const n=this.toSourceRange(e);return this._value.substring(0,n.offset)+t+this._value.substring(n.offset+n.length)}extract(e){const t=this.toSourceRange(e);return this._value.substr(t.offset,t.length)}}var u=Object.freeze({__proto__:null,Text:a,Position:undefined});const h={get _keyValueFilterRegex(){return/(?:^|\s)(\-)?([\w\-]+):([^\s]+)/},get _regexFilterRegex(){return/(?:^|\s)(\-)?\/([^\s]+)\//},get _textFilterRegex(){return/(?:^|\s)(\-)?([^\s]+)/},get _SpaceCharRegex(){return/\s/},get Indent(){return{TwoSpaces:"  ",FourSpaces:"    ",EightSpaces:"        ",TabCharacter:"\t"}},isStopChar:function(e){return e>" "&&e<"0"||e>"9"&&e<"A"||e>"Z"&&e<"_"||e>"_"&&e<"a"||e>"z"&&e<="~"},isWordChar:function(e){return!h.isStopChar(e)&&!h.isSpaceChar(e)},isSpaceChar:function(e){return h._SpaceCharRegex.test(e)},isWord:function(e){for(let t=0;t<e.length;++t)if(!h.isWordChar(e.charAt(t)))return!1;return!0},isOpeningBraceChar:function(e){return"("===e||"{"===e},isClosingBraceChar:function(e){return")"===e||"}"===e},isBraceChar:function(e){return h.isOpeningBraceChar(e)||h.isClosingBraceChar(e)},textToWords:function(e,t,n){let s=-1;for(let i=0;i<e.length;++i)t(e.charAt(i))?-1===s&&(s=i):(-1!==s&&n(e.substring(s,i)),s=-1);-1!==s&&n(e.substring(s))},lineIndent:function(e){let t=0;for(;t<e.length&&h.isSpaceChar(e.charAt(t));)++t;return e.substr(0,t)},isUpperCase:function(e){return e===e.toUpperCase()},isLowerCase:function(e){return e===e.toLowerCase()},splitStringByRegexes(e,t){const n=[],s=[];for(let e=0;e<t.length;e++){const n=t[e];n.global?s.push(n):s.push(new RegExp(n.source,n.flags?n.flags+"g":"g"))}return function e(t,i,r){if(i>=s.length)return void n.push({value:t,position:r,regexIndex:-1,captureGroups:[]});const o=s[i];let l,a=0;o.lastIndex=0;for(;null!==(l=o.exec(t));){const s=t.substring(a,l.index);s&&e(s,i+1,r+a);const o=l[0];n.push({value:o,position:r+l.index,regexIndex:i,captureGroups:l.slice(1)}),a=l.index+o.length}const u=t.substring(a);u&&e(u,i+1,r+a)}(e,0,0),n}};const c=function(n,s,i,r){const o=e.createSearchRegex(s,i,r),l=new a(n),u=[];for(let e=0;e<l.lineCount();++e){const n=l.lineAt(e);o.lastIndex=0,o.exec(n)&&u.push(new t(e,n))}return u};var d=Object.freeze({__proto__:null,Utils:h,FilterParser:class{constructor(e){this._keys=e}static cloneFilter(e){return{key:e.key,text:e.text,regex:e.regex,negative:e.negative}}parse(e){const t=h.splitStringByRegexes(e,[h._keyValueFilterRegex,h._regexFilterRegex,h._textFilterRegex]),n=[];for(let e=0;e<t.length;e++){const s=t[e].regexIndex;if(-1===s)continue;const i=t[e].captureGroups;if(0===s)-1!==this._keys.indexOf(i[1])?n.push({key:i[1],regex:void 0,text:i[2],negative:Boolean(i[0])}):n.push({key:void 0,regex:void 0,text:i[1]+":"+i[2],negative:Boolean(i[0])});else if(1===s)try{n.push({key:void 0,regex:new RegExp(i[1],"i"),text:void 0,negative:Boolean(i[0])})}catch(e){n.push({key:void 0,regex:void 0,text:"/"+i[1]+"/",negative:Boolean(i[0])})}else 2===s&&n.push({key:void 0,regex:void 0,text:i[1],negative:Boolean(i[0])})}return n}},BalancedJSONTokenizer:class{constructor(e,t){this._callback=e,this._index=0,this._balance=0,this._buffer="",this._findMultiple=t||!1,this._closingDoubleQuoteRegex=/[^\\](?:\\\\)*"/g}write(e){this._buffer+=e;const t=this._buffer.length,n=this._buffer;let s;for(s=this._index;s<t;++s){const e=n[s];if('"'===e){if(this._closingDoubleQuoteRegex.lastIndex=s,!this._closingDoubleQuoteRegex.test(n))break;s=this._closingDoubleQuoteRegex.lastIndex-1}else if("{"===e)++this._balance;else if("}"===e){if(--this._balance,this._balance<0)return this._reportBalanced(),!1;if(!this._balance&&(this._lastBalancedIndex=s+1,!this._findMultiple))break}else if("]"===e&&!this._balance)return this._reportBalanced(),!1}return this._index=s,this._reportBalanced(),!0}_reportBalanced(){this._lastBalancedIndex&&(this._callback(this._buffer.slice(0,this._lastBalancedIndex)),this._buffer=this._buffer.slice(this._lastBalancedIndex),this._index-=this._lastBalancedIndex,this._lastBalancedIndex=0)}remainder(){return this._buffer}},TokenizerFactory:class{createTokenizer(e){throw new Error("not implemented")}},isMinified:function(e){let t=10,n=0;do{let t=e.indexOf("\n",n);if(t<0&&(t=e.length),t-n>500&&"//#"!==e.substr(n,3))return!0;n=t+1}while(--t>=0&&n<e.length);t=10,n=e.length;do{let t=e.lastIndexOf("\n",n);if(t<0&&(t=0),n-t>500&&"//#"!==e.substr(n,3))return!0;n=t-1}while(--t>=0&&n>0);return!1},performSearchInContent:c,ParsedFilter:undefined});class m{constructor(e,t,n){this._contentURL=e,this._contentType=t,this._lazyContent=n}static fromString(e,t,n){return new m(e,t,(()=>Promise.resolve({content:n,isEncoded:!1})))}contentURL(){return this._contentURL}contentType(){return this._contentType}contentEncoded(){return Promise.resolve(!1)}requestContent(){return this._lazyContent()}async searchInContent(e,t,n){const{content:s}=await this._lazyContent();return s?c(s,e,t,n):[]}}var f=Object.freeze({__proto__:null,StaticContentProvider:m});export{n as ContentProvider,f as StaticContentProvider,u as Text,i as TextCursor,l as TextRange,d as TextUtils};