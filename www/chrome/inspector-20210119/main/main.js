import{RuntimeModel as e,SDKModel as t,ResourceTreeModel as n,FrameManager as i,NetworkLog as o,ConsoleModel as s,NetworkManager as r,DOMDebuggerModel as a,DebuggerModel as c}from"../sdk/sdk.js";import{NetworkProject as l,ResourceMapping as d,PresentationConsoleMessageHelper as g,CSSWorkspaceBinding as p,DebuggerWorkspaceBinding as m,BreakpointManager as u,IgnoreListManager as h}from"../bindings/bindings.js";import{Settings as f,AppProvider as x,QueryParamHandler as S,Console as v,Revealer as w,UIString as b}from"../common/common.js";import{Reload as _}from"../components/components.js";import{ExtensionServer as C}from"../extensions/extensions.js";import{InspectorFrontendHost as I,Platform as E,userMetrics as k,InspectorFrontendHostAPI as M,UserMetrics as T}from"../host/host.js";import{i18n as D}from"../i18n/i18n.js";import{IsolatedFileSystemManager as y,FileSystemWorkspaceBinding as P,Persistence as L,NetworkPersistenceManager as F}from"../persistence/persistence.js";import{runOnWindowLoad as A,ls as R,NumberUtilities as U}from"../platform/platform.js";import{InspectorBackend as B}from"../protocol_client/protocol_client.js";import{RecordingFileSystem as N}from"../recorder/recorder.js";import{Runtime as W}from"../root/root.js";import{ScriptSnippetFileSystem as H}from"../snippets/snippets.js";import{ThemeSupport as V}from"../theme_support/theme_support.js";import{ViewManager as z,UIUtils as j,InspectorView as O,ZoomManager as q,ContextMenu as J,Tooltip as G,DockController as K,Context as Z,ActionRegistry as Q,ShortcutRegistry as $,SearchableView as X,Toolbar as Y,RootView as ee}from"../ui/ui.js";import{FileManager as te,Workspace as ne}from"../workspace/workspace.js";class ie{constructor(n,i){i.addFlavorChangeListener(e.ExecutionContext,this._executionContextChanged,this),i.addFlavorChangeListener(t.Target,this._targetChanged,this),n.addModelListener(e.RuntimeModel,e.Events.ExecutionContextCreated,this._onExecutionContextCreated,this),n.addModelListener(e.RuntimeModel,e.Events.ExecutionContextDestroyed,this._onExecutionContextDestroyed,this),n.addModelListener(e.RuntimeModel,e.Events.ExecutionContextOrderChanged,this._onExecutionContextOrderChanged,this),this._targetManager=n,this._context=i,n.observeModels(e.RuntimeModel,this)}modelAdded(e){queueMicrotask(function(){this._context.flavor(t.Target)||this._context.setFlavor(t.Target,e.target())}.bind(this))}modelRemoved(n){const i=this._context.flavor(e.ExecutionContext);i&&i.runtimeModel===n&&this._currentExecutionContextGone();const o=this._targetManager.models(e.RuntimeModel);this._context.flavor(t.Target)===n.target()&&o.length&&this._context.setFlavor(t.Target,o[0].target())}_executionContextChanged(e){const n=e.data;n&&(this._context.setFlavor(t.Target,n.target()),this._ignoreContextChanged||(this._lastSelectedContextId=this._contextPersistentId(n)))}_contextPersistentId(e){return e.isDefault?e.target().name()+":"+e.frameId:""}_targetChanged(t){const n=t.data,i=this._context.flavor(e.ExecutionContext);if(!n||i&&i.target()===n)return;const o=n.model(e.RuntimeModel),s=o?o.executionContexts():[];if(!s.length)return;let r=null;for(let e=0;e<s.length&&!r;++e)this._shouldSwitchToContext(s[e])&&(r=s[e]);for(let e=0;e<s.length&&!r;++e)this._isDefaultContext(s[e])&&(r=s[e]);this._ignoreContextChanged=!0,this._context.setFlavor(e.ExecutionContext,r||s[0]),this._ignoreContextChanged=!1}_shouldSwitchToContext(e){return!(!this._lastSelectedContextId||this._lastSelectedContextId!==this._contextPersistentId(e))||!(this._lastSelectedContextId||!this._isDefaultContext(e))}_isDefaultContext(e){if(!e.isDefault||!e.frameId)return!1;if(e.target().parentTarget())return!1;const t=e.target().model(n.ResourceTreeModel),i=t&&t.frameForId(e.frameId);return!(!i||!i.isTopFrame())}_onExecutionContextCreated(e){this._switchContextIfNecessary(e.data)}_onExecutionContextDestroyed(t){const n=t.data;this._context.flavor(e.ExecutionContext)===n&&this._currentExecutionContextGone()}_onExecutionContextOrderChanged(e){const t=e.data.executionContexts();for(let e=0;e<t.length&&!this._switchContextIfNecessary(t[e]);e++);}_switchContextIfNecessary(t){return!(this._context.flavor(e.ExecutionContext)&&!this._shouldSwitchToContext(t))&&(this._ignoreContextChanged=!0,this._context.setFlavor(e.ExecutionContext,t),this._ignoreContextChanged=!1,!0)}_currentExecutionContextGone(){const t=this._targetManager.models(e.RuntimeModel);let n=null;for(let e=0;e<t.length&&!n;++e){const i=t[e].executionContexts();for(const e of i)if(this._isDefaultContext(e)){n=e;break}}if(!n)for(let e=0;e<t.length&&!n;++e){const i=t[e].executionContexts();if(i.length){n=i[0];break}}this._ignoreContextChanged=!0,this._context.setFlavor(e.ExecutionContext,n),this._ignoreContextChanged=!1}}var oe=Object.freeze({__proto__:null,ExecutionContextSelector:ie});class se{constructor(){se._instanceForTest=this,A((()=>{this._loaded()})),this._lateInitDonePromise}static time(e){I.isUnderTest()||console.time(e)}static timeEnd(e){I.isUnderTest()||console.timeEnd(e)}async _loaded(){console.timeStamp("Main._loaded"),await W.appStarted,W.Runtime.setPlatform(E.platform()),W.Runtime.setL10nCallback(R);const e=await new Promise((e=>{I.InspectorFrontendHostInstance.getPreferences(e)}));console.timeStamp("Main._gotPreferences"),this._createSettings(e),await this.requestAndRegisterLocaleData(),this._createAppUI()}async requestAndRegisterLocaleData(){const e=navigator.language||"en-US";D.registerLocale(e);const t=D.registeredLocale;if(t){const e=await W.loadResourcePromise(`i18n/locales/${t}.json`);if(e){const n=JSON.parse(e);D.registerLocaleData(t,n)}}}_createSettings(e){this._initializeExperiments();let t,n="";E.isCustomDevtoolsFrontend()?n="__custom__":W.Runtime.queryParam("can_dock")||!Boolean(W.Runtime.queryParam("debugFrontend"))||I.isUnderTest()||(n="__bundled__"),t=!I.isUnderTest()&&window.localStorage?new f.SettingsStorage(window.localStorage,void 0,void 0,(()=>window.localStorage.clear()),n):new f.SettingsStorage({},void 0,void 0,void 0,n);const i=new f.SettingsStorage(e,I.InspectorFrontendHostInstance.setPreference,I.InspectorFrontendHostInstance.removePreference,I.InspectorFrontendHostInstance.clearPreferences,n);f.Settings.instance({forceNew:!0,globalStorage:i,localStorage:t}),self.Common.settings=f.Settings.instance(),I.isUnderTest()||(new f.VersionController).updateVersion()}_initializeExperiments(){W.experiments.register("applyCustomStylesheet","Allow custom UI themes"),W.experiments.register("captureNodeCreationStacks","Capture node creation stacks"),W.experiments.register("sourcesPrettyPrint","Automatically pretty print in the Sources Panel"),W.experiments.register("backgroundServices","Background web platform feature events",!0),W.experiments.register("backgroundServicesNotifications","Background services section for Notifications"),W.experiments.register("backgroundServicesPaymentHandler","Background services section for Payment Handler"),W.experiments.register("backgroundServicesPushMessaging","Background services section for Push Messaging"),W.experiments.register("blackboxJSFramesOnTimeline","Ignore List for JavaScript frames on Timeline",!0),W.experiments.register("ignoreListJSFramesOnTimeline","Ignore List for JavaScript frames on Timeline",!0),W.experiments.register("cssOverview","CSS Overview"),W.experiments.register("emptySourceMapAutoStepping","Empty sourcemap auto-stepping"),W.experiments.register("inputEventsOnTimelineOverview","Input events on Timeline overview",!0),W.experiments.register("liveHeapProfile","Live heap profile",!0),W.experiments.register("protocolMonitor","Protocol Monitor"),W.experiments.register("developerResourcesView","Show developer resources view"),W.experiments.register("cspViolationsView","Show CSP Violations view"),W.experiments.register("recordCoverageWithPerformanceTracing","Record coverage while performance tracing"),W.experiments.register("samplingHeapProfilerTimeline","Sampling heap profiler timeline",!0),W.experiments.register("showOptionToNotTreatGlobalObjectsAsRoots","Show option to take heap snapshot where globals are not treated as root"),W.experiments.register("sourceDiff","Source diff"),W.experiments.register("sourceOrderViewer","Source order viewer"),W.experiments.register("spotlight","Spotlight",!0),W.experiments.register("webauthnPane","WebAuthn Pane"),W.experiments.register("keyboardShortcutEditor","Enable keyboard shortcut editor",!0),W.experiments.register("recorder","Recorder"),W.experiments.register("timelineEventInitiators","Timeline: event initiators"),W.experiments.register("timelineInvalidationTracking","Timeline: invalidation tracking",!0),W.experiments.register("timelineShowAllEvents","Timeline: show all events",!0),W.experiments.register("timelineV8RuntimeCallStats","Timeline: V8 Runtime Call Stats on Timeline",!0),W.experiments.register("timelineWebGL","Timeline: WebGL-based flamechart"),W.experiments.register("timelineReplayEvent","Timeline: Replay input events",!0),W.experiments.register("wasmDWARFDebugging","WebAssembly Debugging: Enable DWARF support"),W.experiments.register("dualScreenSupport","Emulation: Support dual screen mode"),W.experiments.setEnabled("dualScreenSupport",!0),W.experiments.register("cssFlexboxFeatures","Enable new CSS Flexbox debugging features"),W.experiments.register("APCA","Enable new Advanced Perceptual Contrast Algorithm (APCA) replacing previous contrast ratio and AA/AAA guidelines"),W.experiments.register("fullAccessibilityTree","Enable full accessibility tree view in Elements pane"),W.experiments.register("fontEditor","Enable new Font Editor tool within the Styles Pane."),W.experiments.enableExperimentsByDefault(["cssFlexboxFeatures"]),W.experiments.cleanUpStaleExperiments();const e=W.Runtime.queryParam("enabledExperiments");if(e&&W.experiments.setServerEnabledExperiments(e.split(";")),W.experiments.enableExperimentsTransiently(["backgroundServices","backgroundServicesNotifications","backgroundServicesPushMessaging","backgroundServicesPaymentHandler","webauthnPane","developerResourcesView"]),I.isUnderTest()){const e=W.Runtime.queryParam("test");e&&e.includes("live-line-level-heap-profile.js")&&W.experiments.enableForTest("liveHeapProfile")}const t=W.experiments.isEnabled("blackboxJSFramesOnTimeline");W.experiments.setEnabled("ignoreListJSFramesOnTimeline",t);for(const e of W.experiments.enabledExperiments())k.experimentEnabledAtLaunch(e.name)}async _createAppUI(){se.time("Main._createAppUI"),self.UI.viewManager=z.ViewManager.instance(),self.Persistence.isolatedFileSystemManager=y.IsolatedFileSystemManager.instance();const e="systemPreferred",n=f.Settings.instance().createSetting("uiTheme",e);if(j.initializeUIUtils(document,n),n.get()===e){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",(()=>{O.InspectorView.instance().displayReloadRequiredWarning(R`The system-preferred color scheme has changed. To apply this change to DevTools, reload.`)}))}j.installComponentRootStyles(document.body),this._addMainEventListeners(document);const c=Boolean(W.Runtime.queryParam("can_dock"));self.UI.zoomManager=q.ZoomManager.instance({forceNew:!0,win:window,frontendHost:I.InspectorFrontendHostInstance}),self.UI.inspectorView=O.InspectorView.instance(),J.ContextMenu.initialize(),J.ContextMenu.installHandler(document),G.Tooltip.installHandler(document),i.FrameManager.instance(),o.NetworkLog.instance(),self.SDK.consoleModel=s.ConsoleModel.instance(),self.UI.dockController=K.DockController.instance({forceNew:!0,canDock:c}),self.SDK.multitargetNetworkManager=r.MultitargetNetworkManager.instance({forceNew:!0}),self.SDK.domDebuggerManager=a.DOMDebuggerManager.instance({forceNew:!0}),t.TargetManager.instance().addEventListener(t.Events.SuspendStateChanged,this._onSuspendStateChanged.bind(this)),self.Workspace.fileManager=te.FileManager.instance({forceNew:!0}),self.Workspace.workspace=ne.WorkspaceImpl.instance(),self.Bindings.networkProjectManager=l.NetworkProjectManager.instance(),self.Bindings.resourceMapping=d.ResourceMapping.instance({forceNew:!0,targetManager:t.TargetManager.instance(),workspace:ne.WorkspaceImpl.instance()}),new g.PresentationConsoleMessageManager,self.Bindings.cssWorkspaceBinding=p.CSSWorkspaceBinding.instance({forceNew:!0,targetManager:t.TargetManager.instance(),workspace:ne.WorkspaceImpl.instance()}),self.Bindings.debuggerWorkspaceBinding=m.DebuggerWorkspaceBinding.instance({forceNew:!0,targetManager:t.TargetManager.instance(),workspace:ne.WorkspaceImpl.instance()}),self.Bindings.breakpointManager=u.BreakpointManager.instance({forceNew:!0,workspace:ne.WorkspaceImpl.instance(),targetManager:t.TargetManager.instance(),debuggerWorkspaceBinding:m.DebuggerWorkspaceBinding.instance()}),self.Extensions.extensionServer=C.ExtensionServer.instance({forceNew:!0}),new P.FileSystemWorkspaceBinding(y.IsolatedFileSystemManager.instance(),ne.WorkspaceImpl.instance()),y.IsolatedFileSystemManager.instance().addPlatformFileSystem("snippet://",new H.SnippetFileSystem),W.experiments.isEnabled("recorder")&&y.IsolatedFileSystemManager.instance().addPlatformFileSystem("recording://",new N.RecordingFileSystem),self.Persistence.persistence=L.PersistenceImpl.instance({forceNew:!0,workspace:ne.WorkspaceImpl.instance(),breakpointManager:u.BreakpointManager.instance()}),self.Persistence.networkPersistenceManager=F.NetworkPersistenceManager.instance({forceNew:!0,workspace:ne.WorkspaceImpl.instance()}),new ie(t.TargetManager.instance(),Z.Context.instance()),self.Bindings.ignoreListManager=h.IgnoreListManager.instance({forceNew:!0,debuggerWorkspaceBinding:m.DebuggerWorkspaceBinding.instance()}),new re;const S=Q.ActionRegistry.instance({forceNew:!0});self.UI.actionRegistry=S,self.UI.shortcutRegistry=$.ShortcutRegistry.instance({forceNew:!0,actionRegistry:S}),this._registerMessageSinkListener(),se.timeEnd("Main._createAppUI");const v=W.Runtime.instance().extension(x.AppProvider);if(!v)throw new Error("Unable to boot DevTools, as the appprovider is missing");this._showAppUI(await v.instance())}_showAppUI(e){se.time("Main._showAppUI");const t=e.createApp();K.DockController.instance().initialize(),t.presentUI(document);const n=Q.ActionRegistry.instance().action("elements.toggle-element-search");n&&I.InspectorFrontendHostInstance.events.addEventListener(M.Events.EnterInspectElementMode,(()=>{n.execute()}),this),I.InspectorFrontendHostInstance.events.addEventListener(M.Events.RevealSourceLine,this._revealSourceLine,this),O.InspectorView.instance().createToolbars(),I.InspectorFrontendHostInstance.loadCompleted();const i=W.Runtime.instance().extensions(S.QueryParamHandler);for(const e of i){const t=W.Runtime.queryParam(e.descriptor().name);null!==t&&e.instance().then((e=>{e.handleQueryParam(t)}))}setTimeout(this._initializeTarget.bind(this),0),se.timeEnd("Main._showAppUI")}async _initializeTarget(){se.time("Main._initializeTarget");const e=await Promise.all(W.Runtime.instance().extensions("early-initialization").map((e=>e.instance())));for(const t of e)await t.run();I.InspectorFrontendHostInstance.readyForTest(),setTimeout(this._lateInitialization.bind(this),100),se.timeEnd("Main._initializeTarget")}_lateInitialization(){se.time("Main._lateInitialization"),C.ExtensionServer.instance().initializeExtensions();const e=W.Runtime.instance().extensions("late-initialization"),t=[];for(const n of e){const e=n.descriptor().setting;if(!e||f.Settings.instance().moduleSetting(e).get()){t.push(n.instance().then((e=>e.run())));continue}const i=async t=>{t.data&&(f.Settings.instance().moduleSetting(e).removeChangeListener(i),(await n.instance()).run())};f.Settings.instance().moduleSetting(e).addChangeListener(i)}this._lateInitDonePromise=Promise.all(t).then((()=>{})),se.timeEnd("Main._lateInitialization")}lateInitDonePromiseForTest(){return this._lateInitDonePromise}_registerMessageSinkListener(){v.Console.instance().addEventListener(v.Events.MessageAdded,(function(e){e.data.show&&v.Console.instance().show()}))}_revealSourceLine(e){const t=e.data.url,n=e.data.lineNumber,i=e.data.columnNumber,o=ne.WorkspaceImpl.instance().uiSourceCodeForURL(t);o?w.reveal(o.uiLocation(n,i)):ne.WorkspaceImpl.instance().addEventListener(ne.Events.UISourceCodeAdded,(function e(o){const s=o.data;s.url()===t&&(w.reveal(s.uiLocation(n,i)),ne.WorkspaceImpl.instance().removeEventListener(ne.Events.UISourceCodeAdded,e))}))}_postDocumentKeyDown(e){e.handled||$.ShortcutRegistry.instance().handleShortcut(e)}_redispatchClipboardEvent(e){const t=new CustomEvent("clipboard-"+e.type,{bubbles:!0});t.original=e;const n=e.target&&e.target.ownerDocument,i=n?n.deepActiveElement():null;i&&i.dispatchEvent(t),t.handled&&e.preventDefault()}_contextMenuEventFired(e){(e.handled||e.target.classList.contains("popup-glasspane"))&&e.preventDefault()}_addMainEventListeners(e){e.addEventListener("keydown",this._postDocumentKeyDown.bind(this),!1),e.addEventListener("beforecopy",this._redispatchClipboardEvent.bind(this),!0),e.addEventListener("copy",this._redispatchClipboardEvent.bind(this),!1),e.addEventListener("cut",this._redispatchClipboardEvent.bind(this),!1),e.addEventListener("paste",this._redispatchClipboardEvent.bind(this),!1),e.addEventListener("contextmenu",this._contextMenuEventFired.bind(this),!0)}_onSuspendStateChanged(){const e=t.TargetManager.instance().allTargetsSuspended();O.InspectorView.instance().onSuspendStateChanged(e)}}se._instanceForTest=null;class re{constructor(){t.TargetManager.instance().addModelListener(c.DebuggerModel,c.Events.DebuggerPaused,this._debuggerPaused,this)}_debuggerPaused(e){t.TargetManager.instance().removeModelListener(c.DebuggerModel,c.Events.DebuggerPaused,this._debuggerPaused,this);const n=e.data,i=n.debuggerPausedDetails();Z.Context.instance().setFlavor(t.Target,n.target()),w.reveal(i)}}new se;var ae=Object.freeze({__proto__:null,MainImpl:se,ZoomActionDelegate:class{handleAction(e,t){if(I.InspectorFrontendHostInstance.isHostedMode())return!1;switch(t){case"main.zoom-in":return I.InspectorFrontendHostInstance.zoomIn(),!0;case"main.zoom-out":return I.InspectorFrontendHostInstance.zoomOut(),!0;case"main.zoom-reset":return I.InspectorFrontendHostInstance.resetZoom(),!0}return!1}},SearchActionDelegate:class{handleAction(e,t){let n=X.SearchableView.fromElement(document.deepActiveElement());if(!n){const e=O.InspectorView.instance().currentPanelDeprecated();if(e&&(n=e.searchableView()),!n)return!1}switch(t){case"main.search-in-panel.find":return n.handleFindShortcut();case"main.search-in-panel.cancel":return n.handleCancelSearchShortcut();case"main.search-in-panel.find-next":return n.handleFindNextShortcut();case"main.search-in-panel.find-previous":return n.handleFindPreviousShortcut()}return!1}},MainMenuItem:class{constructor(){this._item=new Y.ToolbarMenuButton(this._handleContextMenu.bind(this),!0),this._item.setTitle(b.UIString("Customize and control DevTools"))}item(){return this._item}_handleContextMenu(e){if(K.DockController.instance().canDock()){const t=document.createElement("div");t.classList.add("flex-centered"),t.classList.add("flex-auto"),t.tabIndex=-1;const n=t.createChild("span","flex-auto");n.textContent=b.UIString("Dock side");const o=$.ShortcutRegistry.instance().shortcutsForAction("main.toggle-dock");G.Tooltip.install(n,b.UIString("Placement of DevTools relative to the page. (%s to restore last position)",o[0].title())),t.appendChild(n);const s=new Y.Toolbar("",t);E.isMac()&&!V.instance().hasTheme()&&s.makeBlueOnHover();const r=new Y.ToolbarToggle(b.UIString("Undock into separate window"),"largeicon-undock"),a=new Y.ToolbarToggle(b.UIString("Dock to bottom"),"largeicon-dock-to-bottom"),c=new Y.ToolbarToggle(b.UIString("Dock to right"),"largeicon-dock-to-right"),l=new Y.ToolbarToggle(b.UIString("Dock to left"),"largeicon-dock-to-left");r.addEventListener(Y.ToolbarButton.Events.MouseDown,(e=>e.data.consume())),a.addEventListener(Y.ToolbarButton.Events.MouseDown,(e=>e.data.consume())),c.addEventListener(Y.ToolbarButton.Events.MouseDown,(e=>e.data.consume())),l.addEventListener(Y.ToolbarButton.Events.MouseDown,(e=>e.data.consume())),r.addEventListener(Y.ToolbarButton.Events.Click,i.bind(null,K.State.Undocked)),a.addEventListener(Y.ToolbarButton.Events.Click,i.bind(null,K.State.DockedToBottom)),c.addEventListener(Y.ToolbarButton.Events.Click,i.bind(null,K.State.DockedToRight)),l.addEventListener(Y.ToolbarButton.Events.Click,i.bind(null,K.State.DockedToLeft)),r.setToggled(K.DockController.instance().dockSide()===K.State.Undocked),a.setToggled(K.DockController.instance().dockSide()===K.State.DockedToBottom),c.setToggled(K.DockController.instance().dockSide()===K.State.DockedToRight),l.setToggled(K.DockController.instance().dockSide()===K.State.DockedToLeft),s.appendToolbarItem(r),s.appendToolbarItem(l),s.appendToolbarItem(a),s.appendToolbarItem(c),t.addEventListener("keydown",(e=>{let t=0;if("ArrowLeft"===e.key)t=-1;else{if("ArrowRight"!==e.key)return;t=1}const n=[r,l,a,c];let i=n.findIndex((e=>e.element.hasFocus()));i=U.clamp(i+t,0,n.length-1),n[i].element.focus(),e.consume(!0)})),e.headerSection().appendCustomItem(t)}const n=this._item.element;function i(t){K.DockController.instance().once(K.Events.AfterDockSideChanged).then((()=>{n.focus()})),K.DockController.instance().setDockSide(t),e.discard()}if(K.DockController.instance().dockSide()===K.State.Undocked){const n=t.TargetManager.instance().mainTarget();n&&n.type()===t.Type.Frame&&e.defaultSection().appendAction("inspector_main.focus-debuggee",b.UIString("Focus debuggee"))}e.defaultSection().appendAction("main.toggle-drawer",O.InspectorView.instance().drawerVisible()?b.UIString("Hide console drawer"):b.UIString("Show console drawer")),e.appendItemsAtLocation("mainMenu");const o=e.defaultSection().appendSubMenuItem(b.UIString("More tools")),s=[...W.Runtime.instance().extensions("view").map((e=>({location:e.descriptor().location,persistence:e.descriptor().persistence,title:e.title(),id:e.descriptor().id}))),...z.getRegisteredViewExtensions().map((e=>({location:e.location(),persistence:e.persistence(),title:e.title(),id:e.viewId()})))];s.sort(((e,t)=>{const n=e.title||"",i=t.title||"";return n.localeCompare(i)}));for(const e of s)"issues-pane"!==e.id?"closeable"===e.persistence&&("drawer-view"!==e.location&&"panel"!==e.location||o.defaultSection().appendItem(e.title,(()=>{z.ViewManager.instance().showView(e.id,!0,!1)}))):o.defaultSection().appendItem(e.title,(()=>{k.issuesPanelOpenedFrom(T.IssueOpener.HamburgerMenu),z.ViewManager.instance().showView("issues-pane",!0)}));e.footerSection().appendSubMenuItem(b.UIString("Help")).appendItemsAtLocation("mainMenuHelp")}},SettingsButtonProvider:class{constructor(){this._settingsButton=Y.Toolbar.createActionButtonForId("settings.show",{showLabel:!1,userActionCode:void 0})}item(){return this._settingsButton}},PauseListener:re,sendOverProtocol:function(e,t){return new Promise(((n,i)=>{const o=B.test.sendRawMessage;if(!o)return i("Unable to send message to test client");o(e,t,((e,...t)=>e?i(e):n(t)))}))},ReloadActionDelegate:class{handleAction(e,t){switch(t){case"main.debug-reload":return _.reload(),!0}return!1}}});class ce{presentUI(e){const t=new ee.RootView;O.InspectorView.instance().show(t.element),t.attachToDocument(e),t.focus()}}var le=Object.freeze({__proto__:null,SimpleApp:ce,SimpleAppProvider:class{createApp(){return new ce}}});export{oe as ExecutionContextSelector,ae as MainImpl,le as SimpleApp};