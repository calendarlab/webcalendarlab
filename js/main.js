/*
    CalDavZAP - the open source CalDAV Web Client
    Copyright (C) 2011-2015
        Jan Mate <jan.mate@inf-it.com>
        Andrej Lezo <andrej.lezo@inf-it.com>
        Matej Mihalik <matej.mihalik@inf-it.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var globalDefaultCalendar    = null;        // 默认日历 

var maxAlarmValue            = 2147000000;
var globalMultiWeekSize      = 3;
var globalEventList          = new EventList();
var globalAppleSupport       = new AppleSupportNextDateArray();
var globalResourceCalDAVList = new ResourceCalDAVList();

var globalEventIntervalID           = null;
var globalCalDAVInitLoad            = true;
var globalCalDAVResourceSync        = false;
var globalCalDAVCollectionSync      = false;
var globalResourceRefreshNumber     = 0;
var globalCalendarNumber            = 0;
var globalOnlyCalendarNumber        = 0;
var globalOnlyCalendarNumberCount   = 0;
var globalCalendarNumberCount       = 0;
var globalEventTimeoutID            = 0;

var cleanResourceCalDAVListTemplate = null;
var cleanmyListItemTemplate         = null;

var cleanVcalendarTemplate          = null;

var origResourceCalDAVListTemplate  = null;
var origmyListItemTemplate          = null;

var frequencies = ["SECONDLY", "MINUTELY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"];
var origVcalendarTemplate               = null;
var globalSessionTimeZone               = null;
var globalCalDAVQs                      = null;
var isCalDAVLoaded                      = false;
var isCalDAVAvaible                     = true;
var isResourceComplete                  = false;
var prevFunctionArrayIterator           = 0;
var cLcouny                             = 42;
var minelems                            = [0,15,30,45];
var globalLimitLoading                  = '';
var globalCurrentLoadingResource        = '';
var globalVisibleCalDAVCollections      = new Array();
var prevFunctionArray                   = new Array();
var globalWorkerArray                   = new Array();
var globalIntervalArray                 = new Array();
var timeZonesEnabled                    = new Array();
var processedTimezones                  = new Array();
var timelist                            = new Array();
var globalToday                         = new Date();
var globalLoadedLimit                   = new Date();
var globalToLoadedLimit                 = new Date();
var globalBeginPast                     = new Date();
var globalBeginFuture                   = new Date();

var globalDefaultCalendarCollectionActiveAll    = false;
var globalDefaultCalendarCollectionLoadAll      = false;
var globalEventCollectionsLoading               = false;

var globalCalEvent              = null;
var globalJsEvent               = null;
var globalRevertFunction        = null;
var globalPrevDragEventAllDay   = null;
var globalPrevDate              = '';
var globalAllowFcRerender       = true;
var globalCalWidth              = 0;

var globalSettings = {
    version:                        {value: (typeof globalSettingsVersion!='undefined' && globalSettingsVersion!=null) ? globalSettingsVersion : 1, locked:false},
    timezone:                       {value: (typeof globalTimeZone!='undefined' && globalTimeZone!=null && globalTimeZone!='') ? globalTimeZone : 'local', locked:false},
    timestamp:                      {value: null},
    activeview:                     {value: (typeof globalActiveView!='undefined' && globalActiveView!=null && globalActiveView!='') ? globalActiveView : 'multiWeek', locked:false},
    ampmformat:                     {value: (typeof globalAMPMFormat!='undefined' && globalAMPMFormat!=null) ? globalAMPMFormat : localization[globalInterfaceLanguage]._default_AMPM_format_, locked:false},
    weekenddays:                    {value: (typeof globalWeekendDays!='undefined' && globalWeekendDays!=null && globalWeekendDays!='') ? globalWeekendDays : [0, 6], locked:false},
    settingstype:                   {value: (typeof globalSettingsType!='undefined' && globalSettingsType!=null && globalSettingsType!='') ? globalSettingsType : 'principal-URL', locked:false},
    openformmode:                   {value: (typeof globalOpenFormMode!='undefined' && globalOpenFormMode!=null && globalOpenFormMode!='') ? globalOpenFormMode : 'double', locked:false},
    urihandlerurl:                  {value: (typeof globalUriHandlerUrl!='undefined' && globalUriHandlerUrl!=null && globalUriHandlerUrl!='') ? globalUriHandlerUrl : 'http://', locked:false},
    todopastlimit:                  {value: (typeof globalTodoPastLimit!='undefined' && globalTodoPastLimit!=null) ? globalTodoPastLimit : 3, locked:false},
    compatibility:                  {value: (typeof globalCompatibility!='undefined' && globalCompatibility!=null && globalCompatibility!='') ? globalCompatibility : {anniversaryOutputFormat: ['apple']}, locked:false},
    urihandlertel:                  {value: (typeof globalUriHandlerTel!='undefined' && globalUriHandlerTel!=null && globalUriHandlerTel!='') ? globalUriHandlerTel : 'tel:', locked:false},
    usejqueryauth:                  {value: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth!=null) ? globalUseJqueryAuth : false, locked:false},
    backgroundsync:                 {value: (typeof globalBackgroundSync!='undefined' && globalBackgroundSync!=null) ? globalBackgroundSync : true, locked:false},
    mozillasupport:                 {value: (typeof globalMozillaSupport!='undefined' && globalMozillaSupport!=null) ? globalMozillaSupport : false, locked:false},
    titleformatday:                 {value: localization[globalInterfaceLanguage]._default_title_format_day_, locked:false},
    contactstorefn:                 {value: (typeof globalContactStoreFN!='undefined' && globalContactStoreFN!=null && globalContactStoreFN!='') ? globalContactStoreFN : ['prefix',' last',' middle',' first',' suffix'], locked:false},
    collectionsort:                 {value: (typeof globalCollectionSort!='undefined' && globalCollectionSort!=null && globalCollectionSort!='') ? globalCollectionSort : ['last','middle','first'], locked:false},
    islasttimezone:                 {value: true, locked:false},
    titleformatweek:                {value: localization[globalInterfaceLanguage]._default_title_format_week_, locked:false},
    urihandleremail:                {value: (typeof globalUriHandlerEmail!='undefined' && globalUriHandlerEmail!=null && globalUriHandlerEmail!='') ? globalUriHandlerEmail : 'mailto:', locked:false},
    timeformatbasic:                {value: (typeof globalTimeFormatBasic!='undefined' && globalTimeFormatBasic!=null && globalTimeFormatBasic!='') ? globalTimeFormatBasic : null, locked:false},
    timezonesupport:                {value: (typeof globalTimeZoneSupport!='undefined' && globalTimeZoneSupport!=null) ? globalTimeZoneSupport : true, locked:false},
    timeformatagenda:               {value: (typeof globalTimeFormatAgenda!='undefined' && globalTimeFormatAgenda!=null && globalTimeFormatAgenda!='') ? globalTimeFormatAgenda : null, locked:false},
    timezonesenabled:               {value: (typeof globalTimeZonesEnabled!='undefined' && globalTimeZonesEnabled!=null && globalTimeZonesEnabled!='') ? globalTimeZonesEnabled : [], locked:false},
    showhiddenalarms:               {value: (typeof globalShowHiddenAlarms!='undefined' && globalShowHiddenAlarms!=null) ? globalShowHiddenAlarms : false, locked:false},
    datepickerformat:               {value: (typeof globalDatepickerFormat!='undefined' && globalDatepickerFormat!=null && globalDatepickerFormat!='') ? globalDatepickerFormat : localization[globalInterfaceLanguage]._default_datepicker_format_, locked:false},
    defaultactiveapp:               {value: (typeof globalDefaultActiveApp!='undefined' && globalDefaultActiveApp!=null && globalDefaultActiveApp!='') ? globalDefaultActiveApp : null, locked:false},
    islastactiveview:               {value: true, locked:false},
    calendarselected:               {value: (typeof globalCalendarSelected!='undefined' && globalCalendarSelected!=null && globalCalendarSelected!='') ? globalCalendarSelected : '', locked:false},
    titleformattable:               {value: localization[globalInterfaceLanguage]._default_title_format_table_, locked:false},
    titleformatmonth:               {value: localization[globalInterfaceLanguage]._default_title_format_month_, locked:false},
    urihandlerprofile:              {value: (typeof globalUriHandlerProfile!='undefined' && globalUriHandlerProfile!=null && globalUriHandlerProfile!='') ? globalUriHandlerProfile : {'twitter': 'http://twitter.com/%u', 'facebook': 'http://www.facebook.com/%u', 'flickr': 'http://www.flickr.com/photos/%u', 'linkedin': 'http://www.linkedin.com/in/%u', 'myspace': 'http://www.myspace.com/%u', 'sinaweibo': 'http://weibo.com/n/%u'}, locked:false},
    collectiondisplay:              {value: (typeof globalCollectionDisplay!='undefined' && globalCollectionDisplay!=null && globalCollectionDisplay!='') ? globalCollectionDisplay :['last',' middle',' first'], locked:false},
    appleremindersmode:             {value: (typeof globalAppleRemindersMode!='undefined' && globalAppleRemindersMode!=null) ? globalAppleRemindersMode : false, locked:false},
    columnformatagenda:             {value: localization[globalInterfaceLanguage]._default_column_format_agenda_, locked:false},
    enablekbnavigation:             {value: (typeof globalEnableKbNavigation!='undefined' && globalEnableKbNavigation!=null) ? globalEnableKbNavigation : true, locked:false},
    eventstartpastlimit:            {value: (typeof globalEventStartPastLimit!='undefined' && globalEventStartPastLimit!=null) ? globalEventStartPastLimit : 3, locked:false},
    displayhiddenevents:            {value: (typeof globalDisplayHiddenEvents!='undefined' && globalDisplayHiddenEvents!=null) ? globalDisplayHiddenEvents : false, locked:false},
    addressbookselected:            {value: (typeof globalAddressbookSelected!='undefined' && globalAddressbookSelected!=null && globalAddressbookSelected!='') ? globalAddressbookSelected : '', locked:false},
    todocalendarselected:           {value:　(typeof globalTodoCalendarSelected!='undefined' && globalTodoCalendarSelected!=null && globalTodoCalendarSelected!='') ? globalTodoCalendarSelected : '', locked:false},
    collectiondisplayorg:           {value: (typeof globalCollectionDisplayOrg!='undefined' && globalCollectionDisplayOrg!=null) ? globalCollectionDisplayOrg :true, locked:false},
    defaulteventduration:           {value: (typeof globalDefaultEventDuration!='undefined' && globalDefaultEventDuration!=null && globalDefaultEventDuration>=0) ? globalDefaultEventDuration : null, locked:false},
    activetodocollections:          {value: (typeof globalActiveTodoCollections!='undefined' && globalActiveTodoCollections!=null) ? globalActiveTodoCollections : new Array(), locked:false},
    removeunknowntimezone:          {value: (typeof globalRemoveUnknownTimezone!='undefined' && globalRemoveUnknownTimezone!=null) ? globalRemoveUnknownTimezone : false, locked:false},
    loadedtodocollections:          {value: (typeof globalLoadedTodoCollections!='undefined' && globalLoadedTodoCollections!=null) ? globalLoadedTodoCollections : new Array(), locked:false},
    syncresourcesinterval:          {value: (typeof globalSyncResourcesInterval!='undefined' && globalSyncResourcesInterval!=null) ? globalSyncResourcesInterval :300000, locked:false},
    calendarendofbusiness:          {value: (typeof globalCalendarEndOfBusiness!='undefined' && globalCalendarEndOfBusiness!=null) ? globalCalendarEndOfBusiness : 17, locked:false},
    eventstartfuturelimit:          {value: (typeof globalEventStartFutureLimit!='undefined' && globalEventStartFutureLimit!=null) ? globalEventStartFutureLimit : 3, locked:false},
    defaultaddresscountry:          {value: (typeof globalDefaultAddressCountry!='undefined' && globalDefaultAddressCountry!=null && globalDefaultAddressCountry!='') ? globalDefaultAddressCountry :'us', locked:false},
    islastdefaultactiveapp:         {value: false, locked:false},
    todolistfilterselected:         {value: (typeof globalTodoListFilterSelected!='undefined' && globalTodoListFilterSelected!=null && globalTodoListFilterSelected!='') ? globalTodoListFilterSelected : ['filterAction', 'filterProgress'], locked:false},
    calendarstartofbusiness:        {value: (typeof globalCalendarStartOfBusiness!='undefined' && globalCalendarStartOfBusiness!=null) ? globalCalendarStartOfBusiness : 8, locked:false},
    addresscountryfavorites:        {value: (typeof globalAddressCountryFavorites!='undefined' && globalAddressCountryFavorites!=null && globalAddressCountryFavorites!='') ? globalAddressCountryFavorites :[], locked:false},
    resourcealphabetsorting:        {value: (typeof globalResourceAlphabetSorting!='undefined' && globalResourceAlphabetSorting!=null) ? globalResourceAlphabetSorting : true, locked:false},
    datepickerfirstdayofweek:       {value: (typeof globalDatepickerFirstDayOfWeek!='undefined' && globalDatepickerFirstDayOfWeek!=null) ? globalDatepickerFirstDayOfWeek : 1, locked:false},
    rewritetimezonecomponent:       {value: (typeof globalRewriteTimezoneComponent!='undefined' && globalRewriteTimezoneComponent!=null) ? globalRewriteTimezoneComponent : true, locked:false},
    activecalendarcollections:      {value: (typeof globalActiveCalendarCollections!='undefined' && globalActiveCalendarCollections!=null) ? globalActiveCalendarCollections : new Array(), locked:false},
    addresscountryequivalence:      {value: (typeof globalAddressCountryEquivalence!='undefined' && globalAddressCountryEquivalence!=null && globalAddressCountryEquivalence!='') ? globalAddressCountryEquivalence : [{country: 'de', regex: '^\\W*Deutschland\\W*$'}, {country: 'sk', regex: '^\\W*Slovensko\\W*$'}], locked:false},
    loadedcalendarcollections:      {value: (typeof globalLoadedCalendarCollections!='undefined' && globalLoadedCalendarCollections!=null) ? globalLoadedCalendarCollections : new Array(), locked:false},
    activeaddressbookcollections:   {value: (typeof globalActiveAddressbookCollections!='undefined' && globalActiveAddressbookCollections!=null) ? globalActiveAddressbookCollections : new Array(), locked:false},
    loadedaddressbookcollections:   {value: (typeof globalLoadedAddressbookCollections!='undefined' && globalLoadedAddressbookCollections!=null) ? globalLoadedAddressbookCollections : new Array(), locked:false},
    ignorecompletedorcancelledalarms: {value: (typeof globalIgnoreCompletedOrCancelledAlarms!='undefined' && globalIgnoreCompletedOrCancelledAlarms!=null) ? globalIgnoreCompletedOrCancelledAlarms : true, locked:false}
};

// --todos--
    var globalTodoCalendarNumber    = 0;
    var globalTodoCheckTimeout      = null;
    var globalTodoCheckTimeoutDelay = 1000;
    var globalTodolistStatusArray   = {};
    var cleanVtodoTemplate          = null;
    var origVtodoTemplate           = null;
    var origVtodoLoaderTemplate     = null;
    var globalCalDAVTODOQs          = null;
    var globalLimitTodoLoading      = '';
    var globalLoadedLimitTodo       = new Date();
    var globalToLoadedLimitTodo     = new Date();
    var globalTodoLoaderHide        = '';
    var globalCalTodo               = null;
    var globalResourceRefreshNumberTodo     = 0;
    var globalOnlyTodoCalendarNumberCount   = 0;
    var globalTodoCollectionsLoading        = false;
    var origResourceCalDAVTODOListTemplate  = null;
    var globalVisibleCalDAVTODOCollections  = new Array();
    var cleanResourceCalDAVTODOListTemplate = null;
    var globalDefaultTodoCalendarCollectionLoadAll      = false;
    var globalDefaultTodoCalendarCollectionActiveAll    = false;
// --

var isUserLogged                = false;
var globalWindowFocus           = true;
var isDelegationLoaded          = false;
var globalEnableAppSwitch       = true;
var globalActiveApp             = '';
var globalLoginUsername         = '';
var globalLoginPassword         = '';
var globalAvailableAppsArray    = new Array();
var globalAppName               = 'CalDavZAP';
var globalVersion               = '0.12.0';
var globalXMLCache              = null;
var globalVersionCheckURL       = (location.protocol=='file:' ? 'http:' : 
    location.protocol)+'//www.inf-it.com/versioncheck/'+globalAppName+'/?v='+globalVersion;

var globalXClientHeader                     = globalAppName+' '+globalVersion+' (Inf-IT CalDAV Web Client)';
var globalResourceNumber                    = 0;
var globalResourceNumberCount               = 0;
var globalKBNavigationPaddingRate           = 0.2;
var globalResourceIntervalID                = null;
var globalCacheUpdateInterval               = null;
var isIntegrated                            = false;
var settingsLoaded                          = false;
var globalObjectLoading                     = false;
var globalFirstLoadNextApp                  = false;
var globalParallelAjaxCallCalDAVEnabled     = true;
var globalParallelAjaxCallCardDAVEnabled    = true;

var SVG_select          = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="19px" height="19px" viewBox="0 0 19 19" overflow="visible" enable-background="new 0 0 19 19" xml:space="preserve"><defs></defs><rect x="2" fill="#585858" width="17" height="19"/><polygon fill="#FFFFFF" points="14,7 10.5,13 7,7 "/><rect fill="#FFFFFF" width="2" height="19"/></svg>';
var SVG_select_b        = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="19px" height="19px" viewBox="0 0 19 19" overflow="visible" enable-background="new 0 0 19 19" xml:space="preserve"><defs></defs><rect x="2" fill="#585858" width="17" height="19"/><polygon fill="#FFFFFF" points="14,7 10.5,13 7,7 "/><rect fill="#F0F0F0" width="2" height="19"/></svg>';
var SVG_select_dis      = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="22px" height="19px" viewBox="0 0 22 19" overflow="visible" enable-background="new 0 0 22 19" xml:space="preserve"><defs></defs><rect fill="#FFFFFF" width="22" height="19"/></svg>';
var SVG_select_login    = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="19px" height="28px" viewBox="0 0 19 28" overflow="visible" enable-background="new 0 0 19 28" xml:space="preserve"><defs></defs><rect fill="#FFFFFF" width="19" height="28"/></svg>';

var globalDefinedSettings       = new Array();
var globalLoadedPrincipals      = new Array();
var globalEnableAllResourceSync = true;

if (typeof isSettingsAvaible == 'undefined') {
    var globalPreviousSupportedSettings = 
        ['activecalendarcollections',
        'activetodocollections',
        'activeaddressbookcollections',
        'todolistfilterselected',
        'activeview',
        'defaultactiveapp',
        'calendarselected',
        'todocalendarselected',
        'addressbookselected',
        'timezone',
        'loadedtodocollections',
        'loadedcalendarcollections',
        'loadedaddressbookcollections',
        'version'];
}

var ignoreServerSettings            = false;
var globalFirstHideLoader           = true;
var globalSyncSettingsSave          = false;
var globalPreventLogoutSync         = false;
var globalEmailAddress              = '';
var globalSettingsSaving            = '';
var globalSettingsVersion           = 2;
var globalLoadedCollectionsCount    = 0;
var globalLoadedCollectionsNumber   = 0;

// Timepicker hack (prevent IE to re-open the datepicker on date click + focus)
var globalTmpTimePickerHackTime = new Object();

// ----------------funcs-----------------------------------
function isAvaible (app) {
    // 功能：判断输入的应用名称在 globalAvailableAppsArray 数组中是否存在
    // 输入：app：应用的名称
    // 输出：是否存在的布尔值
    
    return globalAvailableAppsArray.indexOf(app) != -1
}

function resetSettings () {
    // 功能：重置 golbalSettings 数组
    // 输入：无
    // 输出：无

    // console.log("①main_func resetSettings");
    globalSettings = {};
    globalSettings = {
        timestamp:                      {value: null},
        version:                        {value: (typeof globalSettingsVersion!='undefined' && globalSettingsVersion!=null) ? globalSettingsVersion : 1, locked:false},
        resourcealphabetsorting:        {value: (typeof globalResourceAlphabetSorting!='undefined' && globalResourceAlphabetSorting!=null) ? globalResourceAlphabetSorting : true, locked:false},
        usejqueryauth:                  {value: (typeof globalUseJqueryAuth!='undefined' && globalUseJqueryAuth!=null) ? globalUseJqueryAuth : false, locked:false},
        settingstype:                   {value: (typeof globalSettingsType!='undefined' && globalSettingsType!=null && globalSettingsType!='') ? globalSettingsType : 'principal-URL', locked:false},
        defaultactiveapp:               {value: (typeof globalDefaultActiveApp!='undefined' && globalDefaultActiveApp!=null && globalDefaultActiveApp!='') ? globalDefaultActiveApp : null, locked:false},
        islastdefaultactiveapp:         {value: false, locked:false},
        datepickerfirstdayofweek:       {value: (typeof globalDatepickerFirstDayOfWeek!='undefined' && globalDatepickerFirstDayOfWeek!=null) ? globalDatepickerFirstDayOfWeek : 1, locked:false},
        syncresourcesinterval:          {value: (typeof globalSyncResourcesInterval!='undefined' && globalSyncResourcesInterval!=null) ? globalSyncResourcesInterval :300000, locked:false},
        datepickerformat:               {value: (typeof globalDatepickerFormat!='undefined' && globalDatepickerFormat!=null && globalDatepickerFormat!='') ? globalDatepickerFormat : localization[globalInterfaceLanguage]._default_datepicker_format_, locked:false},
        backgroundsync:                 {value: (typeof globalBackgroundSync!='undefined' && globalBackgroundSync!=null) ? globalBackgroundSync : true, locked:false},
        enablekbnavigation:             {value: (typeof globalEnableKbNavigation!='undefined' && globalEnableKbNavigation!=null) ? globalEnableKbNavigation : true, locked:false},
        rewritetimezonecomponent:       {value: (typeof globalRewriteTimezoneComponent!='undefined' && globalRewriteTimezoneComponent!=null) ? globalRewriteTimezoneComponent : true, locked:false},
        removeunknowntimezone:          {value: (typeof globalRemoveUnknownTimezone!='undefined' && globalRemoveUnknownTimezone!=null) ? globalRemoveUnknownTimezone : false, locked:false},
        mozillasupport:                 {value: (typeof globalMozillaSupport!='undefined' && globalMozillaSupport!=null) ? globalMozillaSupport : false, locked:false},
        appleremindersmode:             {value: (typeof globalAppleRemindersMode!='undefined' && globalAppleRemindersMode!=null) ? globalAppleRemindersMode : false, locked:false},
        titleformatmonth:               {value: localization[globalInterfaceLanguage]._default_title_format_month_, locked:false},
        titleformatweek:                {value: localization[globalInterfaceLanguage]._default_title_format_week_, locked:false},
        titleformatday:                 {value: localization[globalInterfaceLanguage]._default_title_format_day_, locked:false},
        titleformattable:               {value: localization[globalInterfaceLanguage]._default_title_format_table_, locked:false},
        columnformatagenda:             {value: localization[globalInterfaceLanguage]._default_column_format_agenda_, locked:false},
        activecalendarcollections:      {value: (typeof globalActiveCalendarCollections!='undefined' && globalActiveCalendarCollections!=null) ? globalActiveCalendarCollections : new Array(), locked:false},
        activetodocollections:          {value: (typeof globalActiveTodoCollections!='undefined' && globalActiveTodoCollections!=null) ? globalActiveTodoCollections : new Array(), locked:false},
        loadedcalendarcollections:      {value: (typeof globalLoadedCalendarCollections!='undefined' && globalLoadedCalendarCollections!=null) ? globalLoadedCalendarCollections : new Array(), locked:false},
        loadedtodocollections:          {value: (typeof globalLoadedTodoCollections!='undefined' && globalLoadedTodoCollections!=null) ? globalLoadedTodoCollections : new Array(), locked:false},
        todolistfilterselected:         {value: (typeof globalTodoListFilterSelected!='undefined' && globalTodoListFilterSelected!=null && globalTodoListFilterSelected!='') ? globalTodoListFilterSelected : ['filterAction', 'filterProgress'], locked:false},
        activeview:                     {value: (typeof globalActiveView!='undefined' && globalActiveView!=null && globalActiveView!='') ? globalActiveView : 'multiWeek', locked:false},
        islastactiveview:               {value: true, lockedlocked:false},
        calendarselected:               {value: (typeof globalCalendarSelected!='undefined' && globalCalendarSelected!=null && globalCalendarSelected!='') ? globalCalendarSelected : '', locked:false},
        todocalendarselected:           {value: (typeof globalTodoCalendarSelected!='undefined' && globalTodoCalendarSelected!=null && globalTodoCalendarSelected!='') ? globalTodoCalendarSelected : '', locked:false},
        timezone:                       {value: (typeof globalTimeZone!='undefined' && globalTimeZone!=null && globalTimeZone!='') ? globalTimeZone : 'local', locked:false},
        islasttimezone:                 {value: true, locked:false},
        openformmode:                   {value: (typeof globalOpenFormMode!='undefined' && globalOpenFormMode!=null && globalOpenFormMode!='') ? globalOpenFormMode : 'double', locked:false},
        calendarstartofbusiness:        {value: (typeof globalCalendarStartOfBusiness!='undefined' && globalCalendarStartOfBusiness!=null) ? globalCalendarStartOfBusiness : 8, locked:false},
        calendarendofbusiness:          {value: (typeof globalCalendarEndOfBusiness!='undefined' && globalCalendarEndOfBusiness!=null) ? globalCalendarEndOfBusiness : 17, locked:false},
        defaulteventduration:           {value: (typeof globalDefaultEventDuration!='undefined' && globalDefaultEventDuration!=null && globalDefaultEventDuration>=0) ? globalDefaultEventDuration : null, locked:false},
        ampmformat:                     {value: (typeof globalAMPMFormat!='undefined' && globalAMPMFormat!=null) ? globalAMPMFormat : localization[globalInterfaceLanguage]._default_AMPM_format_, locked:false},
        timeformatagenda:               {value: (typeof globalTimeFormatAgenda!='undefined' && globalTimeFormatAgenda!=null && globalTimeFormatAgenda!='') ? globalTimeFormatAgenda : null, locked:false},
        timeformatbasic:                {value: (typeof globalTimeFormatBasic!='undefined' && globalTimeFormatBasic!=null && globalTimeFormatBasic!='') ? globalTimeFormatBasic : null, locked:false},
        displayhiddenevents:            {value: (typeof globalDisplayHiddenEvents!='undefined' && globalDisplayHiddenEvents!=null) ? globalDisplayHiddenEvents : false, locked:false},
        timezonesupport:                {value: (typeof globalTimeZoneSupport!='undefined' && globalTimeZoneSupport!=null) ? globalTimeZoneSupport : true, locked:false},
        timezonesenabled:               {value: (typeof globalTimeZonesEnabled!='undefined' && globalTimeZonesEnabled!=null && globalTimeZonesEnabled!='') ? globalTimeZonesEnabled : [], locked:false},
        showhiddenalarms:               {value: (typeof globalShowHiddenAlarms!='undefined' && globalShowHiddenAlarms!=null) ? globalShowHiddenAlarms : false, locked:false},
        weekenddays:                    {value: (typeof globalWeekendDays!='undefined' && globalWeekendDays!=null && globalWeekendDays!='') ? globalWeekendDays : [0, 6], locked:false},
        eventstartpastlimit:            {value: (typeof globalEventStartPastLimit!='undefined' && globalEventStartPastLimit!=null) ? globalEventStartPastLimit : 3, locked:false},
        todopastlimit:                  {value: (typeof globalTodoPastLimit!='undefined' && globalTodoPastLimit!=null) ? globalTodoPastLimit : 3, locked:false},
        eventstartfuturelimit:          {value: (typeof globalEventStartFutureLimit!='undefined' && globalEventStartFutureLimit!=null) ? globalEventStartFutureLimit : 3, locked:false},
        compatibility:                  {value: (typeof globalCompatibility!='undefined' && globalCompatibility!=null && globalCompatibility!='') ? globalCompatibility : {anniversaryOutputFormat: ['apple']}, locked:false},
        contactstorefn:                 {value: (typeof globalContactStoreFN!='undefined' && globalContactStoreFN!=null && globalContactStoreFN!='') ? globalContactStoreFN : ['prefix',' last',' middle',' first',' suffix'], locked:false},
        urihandlertel:                  {value: (typeof globalUriHandlerTel!='undefined' && globalUriHandlerTel!=null && globalUriHandlerTel!='') ? globalUriHandlerTel : 'tel:', locked:false},
        urihandleremail:                {value: (typeof globalUriHandlerEmail!='undefined' && globalUriHandlerEmail!=null && globalUriHandlerEmail!='') ? globalUriHandlerEmail : 'mailto:', locked:false},
        urihandlerurl:                  {value: (typeof globalUriHandlerUrl!='undefined' && globalUriHandlerUrl!=null && globalUriHandlerUrl!='') ? globalUriHandlerUrl : 'http://', locked:false},
        urihandlerprofile:              {value: (typeof globalUriHandlerProfile!='undefined' && globalUriHandlerProfile!=null && globalUriHandlerProfile!='') ? globalUriHandlerProfile : {'twitter': 'http://twitter.com/%u', 'facebook': 'http://www.facebook.com/%u', 'flickr': 'http://www.flickr.com/photos/%u', 'linkedin': 'http://www.linkedin.com/in/%u', 'myspace': 'http://www.myspace.com/%u', 'sinaweibo': 'http://weibo.com/n/%u'}, locked:false},
        addresscountryequivalence:      {value: (typeof globalAddressCountryEquivalence!='undefined' && globalAddressCountryEquivalence!=null && globalAddressCountryEquivalence!='') ? globalAddressCountryEquivalence : [{country: 'de', regex: '^\\W*Deutschland\\W*$'}, {country: 'sk', regex: '^\\W*Slovensko\\W*$'}], locked:false},
        addressbookselected:            {value: (typeof globalAddressbookSelected!='undefined' && globalAddressbookSelected!=null && globalAddressbookSelected!='') ? globalAddressbookSelected : '', locked:false},
        collectionsort:                 {value: (typeof globalCollectionSort!='undefined' && globalCollectionSort!=null && globalCollectionSort!='') ? globalCollectionSort : ['last','middle','first'], locked:false},
        collectiondisplay:              {value: (typeof globalCollectionDisplay!='undefined' && globalCollectionDisplay!=null && globalCollectionDisplay!='') ? globalCollectionDisplay :['last',' middle',' first'], locked:false},
        collectiondisplayorg:           {value: (typeof globalCollectionDisplayOrg!='undefined' && globalCollectionDisplayOrg!=null) ? globalCollectionDisplayOrg :true, locked:false},
        defaultaddresscountry:          {value: (typeof globalDefaultAddressCountry!='undefined' && globalDefaultAddressCountry!=null && globalDefaultAddressCountry!='') ? globalDefaultAddressCountry :'us', locked:false},
        addresscountryfavorites:        {value: (typeof globalAddressCountryFavorites!='undefined' && globalAddressCountryFavorites!=null && globalAddressCountryFavorites!='') ? globalAddressCountryFavorites :[], locked:false},
        activeaddressbookcollections:   {value: (typeof globalActiveAddressbookCollections!='undefined' && globalActiveAddressbookCollections!=null) ? globalActiveAddressbookCollections : new Array(), locked:false},
        loadedaddressbookcollections:   {value: (typeof globalLoadedAddressbookCollections!='undefined' && globalLoadedAddressbookCollections!=null) ? globalLoadedAddressbookCollections : new Array(), locked:false},
        ignorecompletedorcancelledalarms: {value: (typeof globalIgnoreCompletedOrCancelledAlarms!='undefined' && globalIgnoreCompletedOrCancelledAlarms!=null) ? globalIgnoreCompletedOrCancelledAlarms : true, locked:false}
    };
}

function transformToServer (inSettings) {
    // 功能：将传入数组内的各项参数保存在serverSettings数组中，
    //      并且加入timestamp，保存在globalSettings中
    //      最后返回该数组
    // 输入：inSettings
    // 输出：

    // console.log("①main_func transformToServer");
    var serverSettings　=　{};
    for (var prop in inSettings)　{
        serverSettings[prop]　=　inSettings[prop].value;
    }
    var ts = new Date().getTime();
    serverSettings.timestamp = ts;
    globalSettings.timestamp.value = ts;

    return serverSettings;
}

function loadAllResources () {
    // 功能：调用 netFindResource 函数
    // 输入：无
    // 输出：无
    
    // console.log("①main_func loadAllResources");
    if (globalResourceIntervalID == null) {
        netFindResource (globalAccountSettings[0], 0, true, 0);
    }
}

function getAccount (accountUID) {
    // 功能：find the original settings for the resource and user
    //      查找最初对于资源和用户的设置
    // 输入：无
    // 输出：无

    // console.log("①main_func getAccount");
    var tmp = accountUID.match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)','i'));
    var resource_href = tmp[1]+tmp[3]+tmp[4];
    var resource_user = tmp[2];

    for (var i=0; i<globalAccountSettings.length; i++) {
        if (globalAccountSettings[i].href==resource_href && 
            globalAccountSettings[i].userAuth.userName==resource_user) {

            resourceSettings = globalAccountSettings[i];
        }
    }
    return resourceSettings;
}

function checkForUnloadedResources () {
    // 功能：
    // 输入：无
    // 输出：无

    // console.log("①main_func checkForUnloadedResources");
    var rex = new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@([^/]+)(.*/)', 'i');

    for (var i=globalLoadedPrincipals.length-1; i>=0; i--) {
        var resourceCounter = 0;
        // if (isAvaible('CardDavMATE')) {
        //  for (var j=0; j<globalResourceCardDAVList.collections.length;j++) {
        //      if (globalResourceCardDAVList.collections[j].uid!=undefined && 
        //          globalResourceCardDAVList.collections[j].makeLoaded) {

        //          var tmp = globalResourceCardDAVList.collections[j].accountUID.match(rex);
        //          var resourceCalDAV_href = tmp[1]+tmp[3]+tmp[4];
        //          if (globalLoadedPrincipals[i] == resourceCalDAV_href) {
        //              resourceCounter++;
        //          }
        //      }
        //  }
        // }

        if (isAvaible('CalDavZAP')) {
            for (var j=0; j<globalResourceCalDAVList.collections.length; j++) {
                if (globalResourceCalDAVList.collections[j].uid!=undefined && 
                    globalResourceCalDAVList.collections[j].makeLoaded) {

                    var tmp = globalResourceCalDAVList.collections[j].accountUID.match(rex);
                    var resourceCalDAV_href = tmp[1]+tmp[3]+tmp[4];

                    if (globalLoadedPrincipals[i] == resourceCalDAV_href) {
                        resourceCounter++;
                    }
                }
            }

            // for (var j=0; j<globalResourceCalDAVList.TodoCollections.length; j++) {
            //  if (globalResourceCalDAVList.TodoCollections[j].uid!=undefined && 
            //      globalResourceCalDAVList.TodoCollections[j].makeLoaded) {

            //      var tmp = globalResourceCalDAVList.TodoCollections[j].accountUID.match(rex);
            //      var resourceCalDAV_href = tmp[1]+tmp[3]+tmp[4];

            //      if (globalLoadedPrincipals[i] == resourceCalDAV_href) {
            //          resourceCounter++;
            //      }
            //  }
            // }
        }

        if (resourceCounter == 0) {
            globalLoadedPrincipals.splice(i,1);
        }
    }
}

function reloadResources (dontSaveSettings, loadArray) {
    // 功能：
    // 输入：无
    // 输出：无

    // console.log("①main_func reloadResources");
    if ((isAvaible('CardDavMATE')&&(globalCardDAVInitLoad||globalCardDAVResourceSync)) || 
        (isAvaible('CalDavZAP')&&(globalCalDAVInitLoad||globalCalDAVResourceSync)) || 
        (isAvaible('Projects')&&!isProjectsLoaded) || 
        (isAvaible('Settings')&&(!isSettingsLoaded || (globalSettingsSaving!=''&&!dontSaveSettings))) || 
        (isAvaible('CalDavZAP')&&(globalLimitLoading!='' || globalLimitTodoLoading!=''))) {

        return false;
    }
    if (globalWindowFocus == false) {
        return false;
    }

    globalCardDAVResourceSync = true;
    globalCalDAVResourceSync = true;

    if (isAvaible('CalDavZAP')) {
        globalCalDAVResourceSync = true;
        globalToday.setHours(0);
        globalToday.setMinutes(0);
        globalToday.setSeconds(0);
        globalToday.setMilliseconds(0);

        var currentToday = new Date();
        currentToday.setHours(0);
        currentToday.setMinutes(0);
        currentToday.setSeconds(0);
        currentToday.setMilliseconds(0);

        if (currentToday.getTime() != globalToday.getTime()) {
            if (isAvaible('CalDavZAP')) {
                $('.date').datepicker('refresh');
            }
            // if (isAvaible('CardDavMATE')) {
            //  $('#vCardEditor').find('[data-type^="date_"]').datepicker('refresh');
            // }
            // if (isAvaible('Projects')) {
            //  $('.project_date').datepicker('refresh');
            // }

            $('#calendar').fullCalendar('updateToday');
            $('#calendar').fullCalendar('gotoDate', currentToday);
            // $('#todoList').fullCalendar('gotoDate', currentToday);
            
            if (currentToday.getTime() > globalToday.getTime()) {
                getNextMonths ($('#calendar').fullCalendar('getView').end);
            }
            else {
                //support for timezone with backward time flow
                getPrevMonths ($('#calendar').fullCalendar('getView').start);
            }
            globalToday = currentToday;
        }
    }
    checkForUnloadedResources();
    if (!globalEnableAllResourceSync && (typeof loadArray=='undefined' || loadArray==null)) {
        netFindResource (globalAccountSettings[0], 0, false, 0, globalLoadedPrincipals);
    }
    else {
        netFindResource (globalAccountSettings[0], 0, false, 0, loadArray);
    }
}

function ifLoadCollections () {
    // 功能：
    // 输入：无
    // 输出：无

    // console.log("①main_func ifLoadCollections");
    if ((isAvaible('CardDavMATE') && (globalCardDAVInitLoad || globalCardDAVResourceSync)) || 
        (isAvaible('CalDavZAP') && (globalCalDAVInitLoad || globalCalDAVResourceSync))) {

        return false;
    }

    var changeCounter = 0;
    // if (isAvaible('CardDavMATE')) {
    //  for (var i=0; i<globalResourceCardDAVList.collections.length; i++) {
    //      if (globalResourceCardDAVList.collections[i].uid!=undefined && 
    //          globalResourceCardDAVList.collections[i].someChanged) {

    //          changeCounter++;
    //      }
    //  }
    // }

    if (isAvaible('CalDavZAP')) {
        for (var i=0; i<globalResourceCalDAVList.collections.length; i++) {
            if (globalResourceCalDAVList.collections[i].uid!=undefined && globalResourceCalDAVList.collections[i].someChanged) {
                changeCounter++;
            }
        }

        // for (var i=0; i<globalResourceCalDAVList.TodoCollections.length; i++) {
        //  if (globalResourceCalDAVList.TodoCollections[i].uid!=undefined && globalResourceCalDAVList.TodoCollections[i].someChanged) {
        //      changeCounter++;
        //  }
        // }
    }

    if (changeCounter>0 || globalSettingsSaving!='') {
        loadNextApplication (false);
    }
}

function loadNextApplication (forceLoad) {
    // 功能：
    // 输入：forceLoad
    // 输出：无

    // console.log("①main_func loadNextApplication");
    if (!globalFirstLoadNextApp) {
        // if (isAvaible('CardDavMATE')) {
        //  setAddressbookNumber();
        // }
        if (isAvaible('CalDavZAP')) {
            setCalendarNumber (true);
        }
        globalFirstLoadNextApp = true;
    }

    if (isAvaible('CardDavMATE') && !globalCardDAVCollectionSync && globalResourceCardDAVList.collections.length>0) {
        globalCardDAVCollectionSync = true;
        CardDAVnetLoadCollection (globalResourceCardDAVList.collections[0], forceLoad, false, null, 0, globalResourceCardDAVList.collections,true);
    }
    else if (isAvaible('CalDavZAP') && !globalCalDAVCollectionSync && globalResourceCalDAVList.collections.length>0) {
        globalCalDAVCollectionSync = true;
        CalDAVnetLoadCollection (globalResourceCalDAVList.collections[0], forceLoad, true, 0, globalResourceCalDAVList.collections);
    }
    else if (isAvaible('Projects') && !globalProjectSync && !isProjectsLoaded && getLoggedUser()!=null) {
        $('#MainLoaderInner').html('Loading projects');
        globalProjectSync = true;
        if (typeof globalCRMSettings != 'undefined') {
            netLoadXSLT(globalCRMSettings.XSLTHref);
        }
        else {
            console.log("Error: globalCRMSettings is not defined");
            loadNextApplication(false);
        }
    }
    else if (isAvaible('Reports') && !globalReportsSync && !isReportsLoaded && getLoggedUser()!=null) {
        $('#MainLoaderInner').html('Loading Reports');
        globalReportsSync = true;
        // if (typeof globalCRMSettings != 'undefined')
        //  netLoadXSLT(globalCRMSettings.XSLTHref);
        // else
        // {
            netLoadReportList();
        // }
    }
    else if (isAvaible('Settings') && !globalSettingsSync && !isSettingsLoaded && getLoggedUser()!=null) {
        globalSettingsSync = true;
        if (!isSettingsLoaded) {
            loadNextApplication(false);
        }
        if ($('#ResourceSettingsList').children('.resourceSettings_item').length) {
            $('#ResourceSettingsList').children().eq(0).trigger('click');
        }
    }
    else {
        if ((isAvaible('CalDavZAP') && !isCalDAVLoaded) || (isAvaible('CardDavMATE') && !isCardDAVLoaded)) {
            $('#MainLoader').fadeOut(1200, function() {$('#MainLoader').css('left','50px');});
        }
        if (isAvaible('CardDavMATE')) {
            globalCardDAVCollectionSync = false;
            if (!isCardDAVLoaded) {
                isCardDAVLoaded = true;
            }
        }
        if (isAvaible('CalDavZAP')) {
            globalCalDAVCollectionSync = false;
            if (!isCalDAVLoaded) {
                isCalDAVLoaded = true;
            }
        }
        if (isAvaible('Projects')) {
            globalProjectSync = false;
            isProjectsLoaded = true;
        }
        if (isAvaible('Reports')) {
            globalReportsSync = false;
            isReportsLoaded = true;
        }
        if (isAvaible('Settings')) {
            globalSettingsSync = false;
            isSettingsLoaded = true;
        }
    }
}

function checkForApplication (inputApp) {
    // 功能：显示输入的应用，隐藏非输入应用
    // 输入：inputApp：应用名称
    // 输出：无

    // console.log("①main_func checkForApplication");
    if (!globalEnableAppSwitch || globalObjectLoading) {
        return false;
    }

    globalEnableAppSwitch   = false;
    globalActiveApp         = inputApp;

    var inputID = 'System' + inputApp;
    $('.System').not('#' + inputID).each(
        function() {
            $(this).animate({opacity : 0}, 666, function() {
                /* XXX - System display:none changes
                if ($(this).attr('id').indexOf('CalDav')==-1)
                    $(this).css('display','none');
                else*/
                    $(this).css('visibility','hidden');
            });
        }
    );

    /* XXX - System display:none changes
    if (inputID.indexOf('CalDav')==-1)
        $('#'+inputID).css('display','block').animate({opacity : 1}, 666, function() {globalEnableAppSwitch=true;});
    else*/
        $('#'+inputID).css('visibility','visible').animate({opacity : 1}, 666, function() {globalEnableAppSwitch=true;});
}

function getLoggedUser () {
    // 功能：
    // 输入：无
    // 输出：无

    // console.log("①main_func getLoggedUser");
    for (var i=0; i<globalAccountSettings.length; i++) {
        if (globalAccountSettings[i].href.indexOf(globalLoginUsername) != -1) {
            return globalAccountSettings[i];
        }
    }
    return globalAccountSettings[0];
}

function login () {
    // 功能：登录函数，显示 $('#LoginLoader') ，
    //      将用户名和密码分别使用 globalLoginUsername 和 globalLoginPassword 保存，之后调用 loadConfig 函数
    // 输入：无
    // 输出：无

    // console.log("①main_func login");
    $('#LoginLoader').fadeTo(1200, 1, function() {
        globalLoginUsername = $('#LoginPage').find('[data-type="system_username"]').val();
        globalLoginPassword = $('#LoginPage').find('[data-type="system_password"]').val();
        loadConfig();
    });

}

function logout (forceLogout) {
    // 功能：登出函数
    // 输入：forceLogout
    // 输出：无

    // console.log("①main_func logout");

    // 修复注销登录后，左侧日历列表未删除的bug 
    $('#ResourceCalDAVList > .myListItem').remove();
    $('#ResourceCalDAVList > .othersListItem').remove();
    globalDefaultCalendar = null;
    addContacts();

    if ((typeof forceLogout=='undefined' || forceLogout==null ) && 
        ((isAvaible('CardDavMATE')&&(globalCardDAVInitLoad||globalCardDAVResourceSync)) || 
            (isAvaible('CalDavZAP')&&(globalCalDAVInitLoad||globalCalDAVResourceSync)) || 
            (isAvaible('Projects')&&!isProjectsLoaded) || 
            (isAvaible('Settings')&&(!isSettingsLoaded || (globalSettingsSaving!=''&&!dontSaveSettings))) || 
            (isAvaible('CalDavZAP')&&(globalLimitLoading!='' || globalLimitTodoLoading!='')))) {

        globalPreventLogoutSync = true;
        return false;
    }
    clearInterval(globalResourceIntervalID);

    if (globalFirstLoadNextApp) {
        globalFirstLoadNextApp = false;
    }
    settingsLoaded              = false;
    ignoreServerSettings        = false;
    //save settings
    // checkBeforeClose (false);
    globalResourceIntervalID    = null;
    globalXMLCache              = null;
    globalPreventLogoutSync     = false;
    globalSyncSettingsSave      = false;
    globalEmailAddress          = '';
    globalLoginUsername         = '';
    globalLoginPassword         = '';
    globalResourceNumber        = 0;
    globalResourceNumberCount   = 0;
    globalLoadedPrincipals      = new Array();

    $(document.documentElement).unbind();

    // reset page title
    var tmpMatch = document.title.match('^(.*) \\[.*\\]$');
    if (tmpMatch != null) {
        document.title = tmpMatch[1];
    }

    $('#LoginPage').fadeTo(2000, 1, function() {
        if (typeof isCalDAVLoaded!='undefined' && isCalDAVLoaded) {
            logoutCalDAV();
            isCalDAVLoaded = false;
        }
        if (typeof isCardDAVLoaded!='undefined' && isCardDAVLoaded) {
            logoutCardDAV();
            isCardDAVLoaded = false;
        }
        if (typeof isProjectsLoaded!='undefined' && isProjectsLoaded) {
            logoutProjects();
            isProjectsLoaded = false;
        }
        if (typeof isSettingsLoaded!='undefined' && isSettingsLoaded) {
            logoutSettings();
            isSettingsLoaded = false;
        }

        for (var i=globalAccountSettings.length-1; i>=0; i--) {
            if (globalAccountSettings[i].type == 'network'){
                globalAccountSettings.splice(i, 1);
            }
        }
            
        if (typeof globalDemoMode == 'undefined') {
            $('[data-type="system_username"]').val('').change();
            $('[data-type="system_password"]').val('').change();
        }

        $('.integration_d').hide();

        isUserLogged = false;

        if (globalSettings.defaultactiveapp.value == null) {
            if (isAvaible('CalDavZAP')) {
                globalActiveApp = 'CalDavZAP';
            }
            else if (isAvaible('CardDavMATE')) {
                globalActiveApp = 'CardDavMATE';
            }
        }
        else {
            globalActiveApp = globalSettings.defaultactiveapp.value;
        }

        resetSettings();
        if (isAvaible('CardDavMATE')) {
            mainCardDAV();
        }
        if (isAvaible('CalDavZAP')) {
            mainCalDAV();
        }

        if (isAvaible('Settings')) {
            mainSettings();
        }
        if (isAvaible('Projects')) {
            mainProjects();
        }
        if (isAvaible('Reports')) {
            mainReports();
        }
        init();
    });
}

function init () {
    // 功能：browser check
    //      检查浏览器（还有是否为demo），之后调用 loadConfig 函数
    // 输入：无
    // 输出：无
 
    // console.log("①main_func init");
    if (($.browser.msie && parseInt($.browser.version, 10)<9) || $.browser.opera) {
        // 如果浏览器是低于IE9或者是opera，则显示提示（不支持的浏览器）
        $('#login_message').css('display','').text(localization[globalInterfaceLanguage].unsupportedBrowser);
    }

    if (typeof globalDemoMode != 'undefined') {
        if (typeof globalDemoMode.userName != undefined) {
            $('[data-type="system_username"]').val(globalDemoMode.userName).change();
        }
        if (typeof globalDemoMode.userPassword != undefined) {
            $('[data-type="system_password"]').val(globalDemoMode.userPassword).change();
        }
    }

    loadConfig();
}

function run () {
    // 功能：
    // 输入：无
    // 输出：无
    
    // console.log("①main_func run");
    isUserLogged = true;
    window.onfocus = function() {
        globalWindowFocus = true;
    }

    window.onblur = function() {
        if (globalSettings.backgroundsync.value == false) {
            globalWindowFocus = false;
        }
    }

    $('#LoginPage').fadeOut(2000);

    if (typeof globalAccountSettings == 'undefined') {
        console.log('Error: \'no account configured\': see config.js!');
        return false;
    }

    // if (typeof globalNewVersionNotifyUsers=='undefined' || globalNewVersionNotifyUsers!=null) {
    //  netVersionCheck();
    // }

    document.title += ' ['+globalAccountSettings[0].userAuth.userName+']';

    // Automatically detect crossDomain settings
    // 自动检测跨域设置
    var detectedHref = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port : '');
    for (var i=0; i<globalAccountSettings.length; i++) {
        if (globalAccountSettings[i].crossDomain==undefined || typeof globalAccountSettings[i].crossDomain!='boolean') {
            if (globalAccountSettings[i].href.indexOf(detectedHref) == 0) {
                globalAccountSettings[i].crossDomain = false;
            }
            else {
                globalAccountSettings[i].crossDomain = true;
            }
            console.log("Info: [userAccount: '"+
                globalAccountSettings[i].href.replace('\/\/', '//'+
                    globalAccountSettings[i].userAuth.userName+'@')+"']: crossDomain set to: '"+
                    (globalAccountSettings[i].crossDomain==true ? 'true' : 'false')+"'");
        }
    }

    if (typeof globalAvailableAppsArray!='undefined' && globalAvailableAppsArray!=null && globalAvailableAppsArray.length>1) {
        // $('.integration_d').css('display', 'block');
        if (globalAvailableAppsArray.indexOf('CalDavZAP') != -1) {
            $('#intCaldav').attr('title',localization[globalInterfaceLanguage].txtCalendars).css('display', 'block')
                .find('.int_error').attr('alt',localization[globalInterfaceLanguage].txtError);
        }
        if (globalAvailableAppsArray.indexOf('CalDavTODO') != -1) {
            $('#intCaldavTodo').attr('title',localization[globalInterfaceLanguage].txtTodos).css('display', 'block')
                .find('.int_error').attr('alt',localization[globalInterfaceLanguage].txtError);
        }
        if (globalAvailableAppsArray.indexOf('CardDavMATE') != -1) {
            $('#intCarddav').attr('title',localization[globalInterfaceLanguage].txtContacts).css('display', 'block')
                .find('.int_error').attr('alt',localization[globalInterfaceLanguage].txtError);
        }
        if (globalAvailableAppsArray.indexOf('Projects') != -1) {
            $('#intProjects').attr('title',localization[globalInterfaceLanguage].txtProjects).css('display', 'block')
                .find('.int_error').attr('alt',localization[globalInterfaceLanguage].txtError);
        }
        if (globalAvailableAppsArray.indexOf('Reports') != -1) {
            $('#intReports').attr('title',localization[globalInterfaceLanguage].txtReports).css('display', 'block')
                .find('.int_error').attr('alt',localization[globalInterfaceLanguage].txtError);
        }
        if (globalAvailableAppsArray.indexOf('Settings') != -1) {
            $('#intSettings').attr('title',localization[globalInterfaceLanguage].txtSettings).css('display', 'block')
                .find('.int_error').attr('alt',localization[globalInterfaceLanguage].txtError);
        }
    }

    $('#cacheDialogText').text(localization[globalInterfaceLanguage].txtCacheText);
    $('#cacheDialogButton').attr('value',localization[globalInterfaceLanguage].txtCacheButton);
}

function loadConfig () {
    // 功能：被 init 和 login 函数调用
    // 输入：无
    // 输出：暂无作用
    
    // console.log("①main_func loadConfig");
    if (isUserLogged) {
        // !!!!!! kedy moze toto nastat? nexapem ...????
        return false;
    }

    var configLoaded = true;
    // Automatically detect crossDomain settings
    var detectedHref = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

    // --------------- netCheckAndCreateConfiguration && netLoadConfiguration ----------------------
    // check username and password against the server and create config from globalNetworkCheckSettings
    // 调用函数 netCheckAndCreateConfiguration 
    if (typeof globalNetworkCheckSettings!='undefined' && globalNetworkCheckSettings!=null) {
        if (globalLoginUsername=='' || globalLoginPassword=='') {
            $('#LoginPage').fadeTo(500, 1, 
                function() {
                    if (typeof globalDemoMode=='undefined') {
                        $('[data-type="system_username"]').focus()
                    }
                });
            $('#LoginLoader').fadeOut(1200);
            return false;
        }
        else {
            if (globalNetworkCheckSettings.crossDomain==undefined || typeof globalNetworkCheckSettings.crossDomain!='boolean') {
                if (globalNetworkCheckSettings.href.indexOf(detectedHref) == 0) {
                    globalNetworkCheckSettings.crossDomain = false;
                }
                else {
                    globalNetworkCheckSettings.crossDomain = true;
                }
                console.log("Info: [globalNetworkCheckSettings: '" + globalNetworkCheckSettings.href+"']: crossDomain set to: '"+
                    (globalNetworkCheckSettings.crossDomain==true ? 'true' : 'false')+"'");
            }

            // !!!! preco sa riesi s logout buttonom prave tu?？？？
            // show the logout button
            // if (typeof globalAvailableAppsArray!='undefined' && globalAvailableAppsArray!=null && globalAvailableAppsArray.length>1) {
            //  $('#intLogout').css('display', 'block');
            //  $('#intLogout').attr('title',localization[globalInterfaceLanguage].altLogout);
            // }
            // else {
            //  $('#Logout').css('display', 'block');
            // }

            netCheckAndCreateConfiguration (globalNetworkCheckSettings);
            return true;
        }
    }

    // load the configuration XML(s) from the network
    // 调用函数 netLoadConfiguration
    if (typeof globalNetworkAccountSettings!='undefined' && globalNetworkAccountSettings!=null) {
        if (globalLoginUsername=='' || globalLoginPassword=='') {
            $('#LoginPage').fadeTo(500, 1, 
                function() {
                    if (typeof globalDemoMode=='undefined') 
                        $('[data-type="system_username"]').focus()
                }
            );
            $('#LoginLoader').fadeOut(1200);
            return false;
        }
        else {
            if (globalNetworkAccountSettings.crossDomain==undefined || typeof globalNetworkAccountSettings.crossDomain!='boolean') {
                if (globalNetworkAccountSettings.href.indexOf(detectedHref) == 0) {
                    globalNetworkAccountSettings.crossDomain = false;
                }
                else {
                    globalNetworkAccountSettings.crossDomain = true;
                }
                console.log("Info: [globalNetworkAccountSettings: '"+globalNetworkAccountSettings.href+"']: crossDomain set to: '"+
                    (globalNetworkAccountSettings.crossDomain==true ? 'true' : 'false')+"'");
            }
            // !!!! preco sa riesi s logout buttonom prave tu?
            // show the logout button
            if (typeof globalAvailableAppsArray!='undefined' && globalAvailableAppsArray!=null && globalAvailableAppsArray.length>1) {
                $('#intLogout').css('display', 'block');
                $('#intLogout').attr('title',localization[globalInterfaceLanguage].altLogout);
            }
            else {
                $('#Logout').css('display', 'block');
            }
            netLoadConfiguration (globalNetworkAccountSettings);
            return true;
        }
    }
    // ----------------------------------------------------------------------------------------------

    if ((typeof globalNetworkAccountSettings=='undefined' || globalNetworkAccountSettings==null) && 
        (typeof globalNetworkCheckSettings=='undefined' || globalNetworkCheckSettings==null) && 
        (typeof globalAccountSettings!='undefined' && globalAccountSettings!=null) && 
        globalAccountSettings.length>0) {

        var delegCount=0, delegIndex = 0;
        if (!isDelegationLoaded) {
            for (var i=0; i<globalAccountSettings.length; i++) {
                if ((typeof globalAccountSettings[i].delegation=='boolean' && globalAccountSettings[i].delegation) || 
                    (globalAccountSettings[i].delegation instanceof Array && globalAccountSettings[i].delegation.length>0)) {

                    delegIndex = i;
                }
            }
            for (var i=0; i<globalAccountSettings.length; i++) {
                if ((typeof globalAccountSettings[i].delegation=='boolean' && globalAccountSettings[i].delegation) || 
                    (globalAccountSettings[i].delegation instanceof Array && globalAccountSettings[i].delegation.length>0)) {

                    delegCount++;
                    DAVresourceDelegation (globalAccountSettings[i], i, delegIndex);
                }
            }
                
            if (delegCount > 0) {
                isDelegationLoaded = true;
            }
        }

        if (delegCount==0 && !isDelegationLoaded) {
            // start the client
            if (isAvaible('CardDavMATE')) {
                runCardDAV();
            }
            if (isAvaible('CalDavZAP')) {
                runCalDAV();
            }
            if (isAvaible('Projects')) {
                runProjects();
            }
            if (isAvaible('Settings')) {
                runSettings();
            }

            globalResourceNumber = globalAccountSettings.length;
            loadAllResources();
        }
    }
}

function globalMain () {
    // 功能：程序入口函数，确认可用的app数量（比如InfCloud整合了所有）
    // 输入：无
    // 输出：无
    
    // console.log("①main_func globalMain");
    for (var prop in globalSettings) {
        globalDefinedSettings.push(prop);
    }

    // 给 globalAvailableAppsArray 数组赋值...
    if (typeof globalEnabledApps=='undefined' || globalEnabledApps==null) {
        if (typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible) {
            globalAvailableAppsArray[globalAvailableAppsArray.length] = 'CalDavZAP';
            // globalAvailableAppsArray[globalAvailableAppsArray.length] = 'CalDavTODO';
        }
        if (typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && isCardDAVAvaible) {
            globalAvailableAppsArray[globalAvailableAppsArray.length] = 'CardDavMATE';
        }
        if (typeof isSettingsAvaible!='undefined' && isSettingsAvaible!=null && isSettingsAvaible) {
            globalAvailableAppsArray[globalAvailableAppsArray.length] = 'Settings';
        }
        if (typeof isProjectsAvaible!='undefined' && isProjectsAvaible!=null && isProjectsAvaible) {
            globalAvailableAppsArray[globalAvailableAppsArray.length] = 'Projects';
        }
        if (typeof isReportsAvaible!='undefined' && isReportsAvaible!=null && isReportsAvaible) {
            globalAvailableAppsArray[globalAvailableAppsArray.length] = 'Reports';
        }
    }
    else {
        if (typeof isCalDAVAvaible!='undefined' && isCalDAVAvaible!=null && isCalDAVAvaible && (globalEnabledApps.indexOf('CalDavZAP')!=-1 || globalEnabledApps.indexOf('CalDavTODO')!=-1 )) {
            globalAvailableAppsArray[globalAvailableAppsArray.length]='CalDavZAP';
            globalAvailableAppsArray[globalAvailableAppsArray.length]='CalDavTODO';
        }
        if (typeof isCardDAVAvaible!='undefined' && isCardDAVAvaible!=null && isCardDAVAvaible && globalEnabledApps.indexOf('CardDavMATE')!=-1) {
            globalAvailableAppsArray[globalAvailableAppsArray.length]='CardDavMATE';
        }
        if (typeof isSettingsAvaible!='undefined' && isSettingsAvaible!=null && isSettingsAvaible && globalEnabledApps.indexOf('Settings')!=-1) {
            globalAvailableAppsArray[globalAvailableAppsArray.length]='Settings';
        }
        if (typeof isProjectsAvaible!='undefined' && isProjectsAvaible!=null && isProjectsAvaible && globalEnabledApps.indexOf('Projects')!=-1) {
            globalAvailableAppsArray[globalAvailableAppsArray.length]='Projects';
        }
        if (typeof isReportsAvaible!='undefined' && isReportsAvaible!=null && isReportsAvaible) {
            globalAvailableAppsArray[globalAvailableAppsArray.length]='Reports';
        }
    }

    if (globalAvailableAppsArray.length > 1) {
        isIntegrated = true;
    }

    if (globalSettings.defaultactiveapp.value == null) {
        if (isAvaible('CardDavMATE')) {
            globalActiveApp = 'CardDavMATE';
        }
        else if (isAvaible('CalDavZAP')) {
            globalActiveApp = 'CalDavZAP';
        }
    }
    else {
        globalActiveApp = globalSettings.defaultactiveapp.value;
    }

    // if (isAvaible('CardDavMATE')) {
    //  // Modify available inputs before making additional changes to vCard form
    //  if (typeof globalDisabledContactAttributes!='undefined' && globalDisabledContactAttributes instanceof Array)
    //      for (var i=0;i<globalDisabledContactAttributes.length;i++)
    //          $('#vCardTemplate').find('[data-attr-name="'+jqueryEscapeSelector(globalDisabledContactAttributes[i])+'"]').remove();

    //  // hook for vCard template extension
    //  if (typeof(globalContactsExtInitMain)=='function')
    //      globalContactsExtInitMain($('#vCardTemplate'));
    // }

    /*************************** BAD HACKS SECTION ***************************/
        // here we fix the cross OS/cross broser problems (unfixable in pure CSS)
        if ($.browser.webkit && !!window.chrome)    /* Chrome */ {
            if (navigator.platform.toLowerCase().indexOf('win')==0) /* Windows version */ {
                // $('#LoginPage, #vCardTemplate, #event_details_template, #todo_details_template, #EditorBoxSettings').find('input').css('text-indent', '2px');
                $('#LoginPage, #vCardTemplate, #event_details_template, #todo_details_template, #EditorBoxSettings').find('select').css({'padding-left': '0px', 'padding-right': '13px'});
            }
            else {
                /* non-Windows version */
                $('#vCardTemplate, #event_details_template, #todo_details_template, #EditorBoxSettings').find('input').css('text-indent', '1px');
                // $('#LoginPage, #vCardTemplate, #event_details_template, #todo_details_template, #EditorBoxSettings').find('input').css('text-indent', '1px');
            }   
        }
        else if ($.browser.safari) {
            $('#LoginPage, #vCardTemplate, #event_details_template, #todo_details_template, #EditorBoxSettings').find('textarea').addClass('safari_hack');
            $('#LoginPage, #vCardTemplate, #event_details_template, #todo_details_template, #EditorBoxSettings').find('input').addClass('safari_hack');
        }
        else if ($.browser.msie)    /* IE */ {
            if (parseInt($.browser.version, 10)==10)    /* IE 10 (because there are no more conditional comments) */ {
                $('select').css({'padding-top': '1px', 'padding-left': '0px', 'padding-right': '0px'});
                $('textarea').css('padding-top', '3px');
                $('input[type=button]').css('padding-top', '2px');
            }

            // ADD SVG to login screen
            var newSVG=$(SVG_select_login).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});   // background-color = stupid IE9 bug
            $('#Login').find('select[data-type="language"]').after($($('<div>').append($(newSVG).clone()).html()));
        }
        else if ($.browser.mozilla) {
            // ADD SVG to login screen
            var newSVG=$(SVG_select_login).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});   // background-color = stupid IE9 bug
            $('#Login').find('select[data-type="language"]').after($($('<div>').append($(newSVG).clone()).html()));
        }
    /*************************** END OF BAD HACKS SECTION ********************/

    /* language selector */
    // 语言选择
    var lang_num        = 0;
    var language_option = $('#Login').find('[data-type="language"]').find('option');
    $('#Login').find('[data-type="language"]').html('');

    if (typeof globalInterfaceCustomLanguages != 'undefined' && 
        globalInterfaceCustomLanguages.length != undefined && 
        globalInterfaceCustomLanguages.length > 0) {

        for (var i=0; i<globalInterfaceCustomLanguages.length; i++) {
            if (localization[globalInterfaceCustomLanguages[i]] != undefined) {
                var tmp = language_option;
                tmp.attr('data-type',globalInterfaceCustomLanguages[i]);
                tmp.text(localization[globalInterfaceCustomLanguages[i]]['_name_']);
                $('#Login').find('[data-type="language"]').append(tmp.clone());
                lang_num++;
            }
        }   
    }

    if (lang_num == 0) {
        // no language option, use the default (all languages from localization.js)
        // 没有语言可选项，使用默认
        for (var loc in localization) {
            var tmp = language_option;
            tmp.attr('data-type',loc);
            tmp.text(localization[loc]['_name_']);  
                // translation
            $('#Login').find('[data-type="language"]').append(tmp.clone());
        }
    }   

    // select the globalInterfaceLanguage in the interface
    // 在界面上选择通用语言
    $('[data-type="language"]').find('[data-type='+globalInterfaceLanguage+']').prop('selected',true);

    if (isAvaible('CalDavZAP')) {
        globalMainCalDAV();
        mainCalDAV();
    }
    //var alisy=document.getElementsByClassName('myListItem');
    //var oBtn=document.getElementById('ceshi');
    //oBtn.onclick=function(){
    //  alert(alisy.length);
    //};

    /**********************************************************
        set login screen logo
        if (isAvaible('CalDavZAP') && !isAvaible('CardDavMATE')) {
            $('[data-size="login_logo"]').find('img').attr('src', "images/cdz_logo.svg");
            $('#LoginPage').find('.footer').text('CalDavZAP - the open source CalDAV web client');
        }
        else if (isAvaible('CardDavMATE') && !isAvaible('CalDavZAP')) {
            $('[data-size="login_logo"]').find('img').attr('src', "carddavmate/images/cdm_logo.svg");
            $('#LoginPage').find('.footer').text('CardDavMATE - the open source CardDAV web client');
        }
        else {
            $('#Login').css('margin-top', '41px');
            $('[data-size="login_logo"]').find('img').attr('src', "images/infcloud_logo.svg");
            $('#LoginPage').find('.footer').text('InfCloud - the open source CalDAV/CardDAV web client');
        }

        if (isAvaible('Projects')) {
            globalMainProjects();
            mainProjects();
        }
        if (isAvaible('CardDavMATE')) {
            globalMainCardDAV();
            mainCardDAV();
        }
        if (isAvaible('Reports')) {
            globalMainReports();
            mainReports();
        }
        if (isAvaible('Settings')) {
            globalMainSettings();
            mainSettings();
        }
    */

    init();
}

function saveSettings (isFormSave) {
    // 功能：
    // 输入：无
    // 输出：无
    
    // console.log("①main_func saveSettings");
    if (globalSettings.islastdefaultactiveapp.value) {
        globalSettings.defaultactiveapp.value = globalActiveApp;
    }

    globalSettings.version.value = globalSettingsVersion;

    var rex = new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)');
    if (isAvaible('CalDavZAP')) {
        globalSettings.activecalendarcollections.value.splice(0, globalSettings.activecalendarcollections.value.length);
        globalSettings.activetodocollections.value.splice(0, globalSettings.activetodocollections.value.length);
        globalSettings.todolistfilterselected.value.splice(0, globalSettings.todolistfilterselected.value.length);

        for (var i=0; i<globalVisibleCalDAVCollections.length; i++) {
            var uidParts = globalVisibleCalDAVCollections[i].match(rex)
            globalSettings.activecalendarcollections.value.splice(globalSettings.activecalendarcollections.value.length, 0, uidParts[1]+uidParts[3]);
        }

        for (var i=0; i<globalVisibleCalDAVTODOCollections.length; i++) {
            var uidParts = globalVisibleCalDAVTODOCollections[i].match(rex);
            globalSettings.activetodocollections.value.splice(globalSettings.activetodocollections.value.length , 0, uidParts[1]+uidParts[3]);
        }

        if (globalSettings.islastactiveview.value) {
            var view = $('#calendar').fullCalendar('getView');
            globalSettings.activeview.value = view.name;
        }

        if (globalSettings.islasttimezone.value) {
            globalSettings.timezone.value = globalSessionTimeZone;
        }

        var uidSelected = $('#ResourceCalDAVList').find('.resourceCalDAV_item_selected').attr('data-id');
        if (uidSelected!=undefined && uidSelected!='') {
            var par=uidSelected.split('/');
            globalSettings.calendarselected.value = par[par.length-3]+'/'+par[par.length-2]+'/';
        }

        uidSelected = $('#ResourceCalDAVTODOList').find('.resourceCalDAV_item_selected').attr('data-id');
        if (uidSelected!=undefined && uidSelected!='') {
            var par = uidSelected.split('/');
            globalSettings.todocalendarselected.value = par[par.length-3]+'/'+par[par.length-2]+'/';
        }

        var filterArray = $('.fc-filter-option-selected');
        for (var i=0; i<filterArray.length; i++) {
            globalSettings.todolistfilterselected.value.splice(globalSettings.todolistfilterselected.value.length, 0, $($('.fc-filter-option-selected')[i]).attr('data-type'));
        }
    }

    // if (isAvaible('CardDavMATE')) {
    //  globalSettings.activeaddressbookcollections.value.splice(0, globalSettings.activeaddressbookcollections.value.length);
    //  var visAddrs = dataGetChecked('#ResourceCardDAVList');
    //  for (var i=0;i<visAddrs.length;i++) {
    //      if (visAddrs[i]!='undefined') {
    //          var uidPart=visAddrs[i].match(RegExp('^(https?://)(.*)', 'i'))[1];
    //          var uidPart2= visAddrs[i].match(RegExp('^(https?://)(.*)', 'i'))[2].split('@')[2];
    //          globalSettings.activeaddressbookcollections.value.splice(globalSettings.activeaddressbookcollections.value.length , 0, uidPart+uidPart2);
    //      }
    //  }

    //  if ($('#ResourceCardDAVList').find('.group.resourceCardDAV_selected').length>0)
    //      var uidASelected=$('#ResourceCardDAVList').find('.group.resourceCardDAV_selected').attr('data-id');
    //  else if ($('#ResourceCardDAVList').find('.resourceCardDAV_selected').length>0)
    //      var uidASelected=$('#ResourceCardDAVList').find('.resourceCardDAV_selected').attr('data-id');
    //  else
    //      var uidASelected='';
    //  if (uidASelected!=undefined && uidASelected!='')
    //      globalSettings.addressbookselected.value=uidASelected;
    // }
    if (isAvaible('Settings') && isFormSave) {
        return applyFormSettings();
    }
    else {
        return globalSettings;
    }
}

function loadXMLSetings (settingsXML) {
    // 功能：
    // 输入：无
    // 输出：无
    
    // console.log("①main_func loadXMLSetings");
    $(settingsXML).children().each(
        function (ind,elm) {
            var type = $(elm).attr('type');
            var locked = (  (typeof $(elm).attr('locked')!='undefined') && 
                            ($(elm).attr('locked')!=null) && 
                            ($(elm).attr('locked')=='true')) 
                        ? true : false;

            if (typeof globalSettings[$(elm).prop('tagName').toLowerCase()] == 'undefined') {
                return true;
            }
            if (locked) {
                globalSettings[$(elm).prop('tagName').toLowerCase()].locked = true;
            }

            if ($(elm).children().length > 0) {
                globalSettings[$(elm).prop('tagName').toLowerCase()].value = new Array();
                $(elm).children().each(function(pind,pelm) {
                    if ($(elm).prop('tagName').toLowerCase() == 'urihandlerprofile') {
                        globalSettings[$(elm).prop('tagName').toLowerCase()].value = {};
                        globalSettings[$(elm).prop('tagName').toLowerCase()].value[$(pelm).text().toLowerCase()] = $(pelm).attr('url');
                    }
                    else if ($(elm).prop('tagName').toLowerCase() == 'addresscountryequivalence') {
                        var eqObject = {};
                        eqObject['country'] = $(pelm).attr('name');
                        eqObject['regex'] = $(pelm).attr('regex');
                        globalSettings[$(elm).prop('tagName').toLowerCase()].value.push(eqObject);
                    }
                    else if ($(elm).prop('tagName').toLowerCase() == 'compatibility') {
                        globalSettings[$(elm).prop('tagName').toLowerCase()].value = {};
                        globalSettings[$(elm).prop('tagName').toLowerCase()].value[$(pelm).attr('name')] = new Array();
                        $(pelm).children().each(function (rind,relm) {
                            globalSettings[$(elm).prop('tagName').toLowerCase()].value[$(pelm).attr('name')].push($(relm).text());
                        });
                    }
                    else if ($(pelm).text()!='') {
                        switch(type) {
                            case 'integer':
                                globalSettings[$(elm).prop('tagName').toLowerCase()].value.push(parseInt($(pelm).text(),10));
                                break;
                            case 'string':
                                if ($(pelm).text()!='null')
                                    globalSettings[$(elm).prop('tagName').toLowerCase()].value.push($(pelm).text());
                                else
                                    globalSettings[$(elm).prop('tagName').toLowerCase()].value.push(null);
                                break;
                            case 'boolean':
                                if ($(pelm).text() == 'true')
                                    globalSettings[$(elm).prop('tagName').toLowerCase()].value.push(true);
                                else
                                    globalSettings[$(elm).prop('tagName').toLowerCase()].value.push(false);
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
            else if ($(elm).text()!='') {
                switch(type) {
                    case 'integer':
                        globalSettings[$(elm).prop('tagName').toLowerCase()].value = parseInt($(elm).text(),10);
                        break;
                    case 'string':
                        if ($(elm).text()!='null')
                            globalSettings[$(elm).prop('tagName').toLowerCase()].value = $(elm).text();
                        else
                            globalSettings[$(elm).prop('tagName').toLowerCase()].value = null;
                        break;
                    case 'boolean':
                        if ($(elm).text() == 'true')
                            globalSettings[$(elm).prop('tagName').toLowerCase()].value = true;
                        else if ($(elm).text() == 'false')
                            globalSettings[$(elm).prop('tagName').toLowerCase()].value = false;
                        break;
                    default:
                        break;
                }
            }
    });
}

function applyServerSettings (inputSettings) {
    // 功能：
    // 输入：无
    // 输出：无
    
    // console.log("①main_func applyServerSettings");
    if (typeof inputSettings.activecalendarcollections == 'undefined' || inputSettings.activecalendarcollections==null) {
        inputSettings.activecalendarcollections = new Array();
    }

    if (typeof inputSettings.activetodocollections == 'undefined' || inputSettings.activetodocollections==null) {
        inputSettings.activetodocollections = new Array();
    }

    if (typeof inputSettings.loadedcalendarcollections == 'undefined' || inputSettings.loadedcalendarcollections==null) {
        inputSettings.loadedcalendarcollections = new Array();
        if (isAvaible('CalDavZAP')) {
            $('#showUnloadedCalendars').css('display','none');
        }
    }

    if (typeof inputSettings.loadedtodocollections == 'undefined' || inputSettings.loadedtodocollections==null) {
        inputSettings.loadedtodocollections = new Array();
        if (isAvaible('CalDavZAP')) {
            $('#showUnloadedCalendarsTODO').css('display','none');
        }
    }
    if (typeof inputSettings.activeaddressbookcollections == 'undefined' || inputSettings.activeaddressbookcollections==null) {
        inputSettings.activeaddressbookcollections = new Array();
    }

    if (typeof inputSettings.loadedaddressbookcollections == 'undefined' || inputSettings.loadedaddressbookcollections==null) {
        inputSettings.loadedaddressbookcollections = new Array();
        if (isAvaible('CardDavMATE')) {
            $('#showUnloadedAddressbooks').css('display','none');
        }
    }
    if (typeof inputSettings.version == 'undefined' || inputSettings.version==null || inputSettings.version<globalSettingsVersion) {
        console.log('Warning: Loaded settings version is not defined or is lower than actual version!');

        if (typeof globalActiveCalendarCollections!='undefined' && globalActiveCalendarCollections!=null) {
            inputSettings.activecalendarcollections = globalActiveCalendarCollections.slice();
        }
        else {
            inputSettings.activecalendarcollections.splice(0, inputSettings.activecalendarcollections.length);
        }

        if (typeof globalActiveTodoCollections!='undefined' && globalActiveTodoCollections!=null) {
            inputSettings.activetodocollections = globalActiveTodoCollections.slice();
        }
        else {
            inputSettings.activetodocollections.splice(0, inputSettings.activetodocollections.length);
        }

        if (typeof globalLoadedCalendarCollections!='undefined' && globalLoadedCalendarCollections!=null) {
            inputSettings.loadedcalendarcollections = globalLoadedCalendarCollections.slice();
        }
        else {
            inputSettings.loadedcalendarcollections.splice(0, inputSettings.loadedcalendarcollections.length);
        }

        if (typeof globalLoadedTodoCollections!='undefined' && globalLoadedTodoCollections!=null) {
            inputSettings.loadedtodocollections=globalLoadedTodoCollections.slice();
        }
        else {
            inputSettings.loadedtodocollections.splice(0, inputSettings.loadedtodocollections.length);
        }

        if (typeof globalActiveAddressbookCollections!='undefined' && globalActiveAddressbookCollections!=null) {
            inputSettings.activeaddressbookcollections=globalActiveAddressbookCollections.slice();
        }
        else {
            inputSettings.activeaddressbookcollections.splice(0, inputSettings.activeaddressbookcollections.length);
        }

        if (typeof globalLoadedAddressbookCollections!='undefined' && globalLoadedAddressbookCollections!=null) {
            inputSettings.loadedaddressbookcollections=globalLoadedAddressbookCollections.slice();
        }
        else {
            inputSettings.loadedaddressbookcollections.splice(0, inputSettings.loadedaddressbookcollections.length);
        }

        if (typeof globalContactStoreFN!='undefined' && globalContactStoreFN!=null) {
            inputSettings.contactstorefn=globalContactStoreFN.slice();
        }
        else {
            inputSettings.contactstorefn=['prefix', ' last', ' middle', ' first', ' suffix'];
        }

        inputSettings.version = globalSettingsVersion;
    }

    for (var prop in inputSettings) {
        if (globalDefinedSettings.indexOf(prop)==-1 || (typeof globalPreviousSupportedSettings !='undefined' && globalPreviousSupportedSettings.indexOf(prop)==-1)) {
            if (globalDefinedSettings.indexOf(prop)==-1) {
                console.log('Warning: Unsupported property: \''+prop+'\' (you can safely ignore this message)');
            }
            continue;
        }
        if (typeof globalSettings[prop] !='undefined' && !globalSettings[prop].locked) {
            globalSettings[prop].value = inputSettings[prop];
        }
    }
}

function loadSettings (strobj, fromServer, syncMode) {
    // 功能：
    // 输入：无
    // 输出：无
    
    // console.log("①main_func loadSettings");
    if (settingsLoaded && !syncMode) {
        return false;
    }
    try {
        objNew = jQuery.parseJSON(strobj);
        if (typeof objNew == 'object') {
            if (!syncMode && typeof globalSettingsXML!='undefined' && globalSettingsXML!=null && globalSettingsXML!='') {
                loadXMLSetings($(globalSettingsXML));
            }
            if (fromServer) {
                applyServerSettings(objNew);
            }
            // $.extend(globalSettings,objNew);
        }
    }
    catch (err) {
        console.log('load settings - JSON parsing error: '+err);
        delete globalSettings.version.value;
        loadSettings(JSON.stringify(globalSettings), false, false);
        return false;
    }
    if (syncMode) {
        return false;
    }
    if (isAvaible('CalDavZAP')) {
        for (var i=0;i<globalSettings.timezonesenabled.value.length;i++){
            if (timeZonesEnabled.indexOf(globalSettings.timezonesenabled.value[i])==-1) {
                timeZonesEnabled.push(globalSettings.timezonesenabled.value[i]);
            }
        }

        if (globalSettings.timezonesupport.value) {
            globalSessionTimeZone=globalSettings.timezone.value;
            if (globalSessionTimeZone != null && timeZonesEnabled.indexOf(globalSessionTimeZone)==-1) {
                timeZonesEnabled.push(globalSessionTimeZone);
            }
        }
        else {
            globalSessionTimeZone = 'local';
            timeZonesEnabled.push('local');
        }

        initTimepicker(globalSettings.ampmformat.value);

        if (globalSettings.timeformatagenda.value == null) {
            if (globalSettings.ampmformat.value) {
                globalSettings.timeformatagenda.value = 'h:mm TT{ - h:mm TT}';
            }
            else {
                globalSettings.timeformatagenda.value = 'H:mm{ - H:mm}';
            }
        }

        if (globalSettings.timeformatbasic.value == null) {
            if (globalSettings.ampmformat.value) {
                globalSettings.timeformatbasic.value = 'h:mmT{-h:mmT}';
            }
            else {
                globalSettings.timeformatbasic.value = 'H:mm{-H:mm}';
            }
        }

        if (globalSettings.appleremindersmode.value) {
            if (globalSettings.todolistfilterselected.value.indexOf('filterAction')==-1 && 
                globalSettings.todolistfilterselected.value.indexOf('filterCompleted')==-1) {

                if (globalSettings.todolistfilterselected.value.indexOf('filterProgress')!=-1) {
                    globalSettings.todolistfilterselected.value[globalSettings.todolistfilterselected.value.indexOf('filterProgress')] = 'filterAction';
                }
                if (globalSettings.todolistfilterselected.value.indexOf('filterCanceled')!=-1) {
                    globalSettings.todolistfilterselected.value[globalSettings.todolistfilterselected.value.indexOf('filterCanceled')] = 'filterAction';
                }
            }
        }
        if (globalSettings.eventstartfuturelimit.value == null) {
            var now = new Date();
            globalToLoadedLimit = new Date(now.getFullYear(), now.getMonth()+12, 1, 0, 0, 0);
            globalToLoadedLimit.setMilliseconds(0);
            globalBeginFuture = new Date(globalToLoadedLimit.getTime());
            globalBeginFuture.setDate(globalBeginFuture.getDate()+14);
            globalToLoadedLimitTodo = new Date(now.getFullYear(), now.getMonth()+12, 1, 0, 0, 0);
            globalToLoadedLimitTodo.setMilliseconds(0);
        }

        initFullCalendar();

        // initTodoList();
        // $('#SystemCalDavZAP.fc-header-center').css('width', $('#main_h_placeholder').width()-$('#SystemCalDavZAP.fc-header-left').outerWidth()-$('#SystemCalDavZAP.searchForm').outerWidth());
        // origin$('#SystemCalDavZAP .fc-header-title').css('width', $('#main_h_placeholder').width()-$('#SystemCalDavZAP .fc-header-left').outerWidth()-$('#SystemCalDavZAP .fc-header-right').outerWidth());

        $('#ResourceCalDAVList, #ResourceCalDAVTODOList').css('bottom', (globalSettings.timezonesupport.value ? 20 : 0));
        $('#alertBox').css('left', ($(window).width()/2)-($('#alertBox').width()/2));
    }
    // if (isAvaible('CardDavMATE')) {
    //  if (globalSettings.enablekbnavigation.value!==false)
    //      initKbAddrNavigation();
    //  applyAddrSettings(globalTranslVcardTemplate);
    //  applyAddrSettings($('#vCardEditor'));
    // }
    // if (isAvaible('Projects')) {
    //  if (globalSettings.enablekbnavigation.value !== false) {
    //      initKbProjectNavigation();
    //  }
    // }
    settingsLoaded = true;
    if (!isAvaible(globalSettings.defaultactiveapp.value)) {
        globalActiveApp = globalAvailableAppsArray[0];
    }
    else {
        globalActiveApp = globalSettings.defaultactiveapp.value;
    }
}

function checkForLoadedCollections (inputSettings) {
    // 功能：
    // 输入：无
    // 输出：无
    
    // console.log("①main_func checkForLoadedCollections");
    var val = '', triggerSync = true;
    globalLoadedCollectionsNumber = 0;
    globalLoadedCollectionsCount = 0;

    if (globalSettingsSaving == 'event') {
        hideUnloadedCollections('event');
        val = inputSettings.loadedcalendarcollections.value;
        if (val.length > 0) {
            globalLoadedCollectionsNumber += $(val).not(globalSettings.loadedcalendarcollections.value).length;
        }
        else {
            globalLoadedCollectionsNumber++;
        }
        if ($(globalSettings.loadedcalendarcollections.value).not(val).length > 0) {
            if (globalLoadedCollectionsNumber == 0) {
                triggerSync           = false;
                globalFirstHideLoader = false;
            }
            var unloadArray = $(globalSettings.loadedcalendarcollections.value).not(val);
            unloadCalDAVCollection (unloadArray.toArray(),true);
        }
        if (triggerSync) {
            addLoadCalDAVCollection (val, true);
        }
        globalSettings.loadedcalendarcollections.value = val;
    }
    else if (globalSettingsSaving == 'todo') {
        hideUnloadedCollections('todo');
        val = inputSettings.loadedtodocollections.value;
        if (val.length > 0) {
            globalLoadedCollectionsNumber+=$(val).not(globalSettings.loadedtodocollections.value).length;
        }
        else {
            globalLoadedCollectionsNumber++;
        }
        if ($(globalSettings.loadedtodocollections.value).not(val).length > 0) {
            if (globalLoadedCollectionsNumber == 0) {
                triggerSync           = false;
                globalFirstHideLoader = false;
            }
            var unloadArray = $(globalSettings.loadedtodocollections.value).not(val);
            unloadCalDAVCollection (unloadArray.toArray(),false);
        }
        if (triggerSync) {
            addLoadCalDAVCollection(val, false);
        }
        globalSettings.loadedtodocollections.value = val;
    }
    // else if (globalSettingsSaving == 'addressbook') {
    //  hideUnloadedCardDAVCollections();
    //  val = inputSettings.loadedaddressbookcollections.value;
    //  if (val.length>0)
    //      globalLoadedCollectionsNumber+=$(val).not(globalSettings.loadedaddressbookcollections.value).length;
    //  else
    //      globalLoadedCollectionsNumber++;
    //  if ($(globalSettings.loadedaddressbookcollections.value).not(val).length>0) {
    //      if (globalLoadedCollectionsNumber==0) {
    //          triggerSync=false;
    //          globalFirstHideLoader=false;
    //      }
    //      var unloadArray = $(globalSettings.loadedaddressbookcollections.value).not(val);
    //      unloadCardDAVCollection(unloadArray.toArray());
    //  }
    //  if (triggerSync)
    //      addLoadCardDAVCollection(val)
    //  globalSettings.loadedaddressbookcollections.value = val;
    // }
    if (triggerSync) {
        ifLoadCollections();
    }
}

function checkBeforeClose (isFormSave) {
    // 功能：
    // 输入：无
    // 输出：无
    
    // console.log("①main_func checkBeforeClose");
    if ((isAvaible('CalDavZAP') && globalCalDAVInitLoad) || (isAvaible('CardDavMATE') && globalCardDAVInitLoad)) {
        return false;
    }
    var settings = saveSettings(isFormSave);
    for (var i=0; i<globalAccountSettings.length; i++) {
        if (globalAccountSettings[i].href.indexOf(globalLoginUsername)!=-1 && globalAccountSettings[i].settingsAccount){
            netSaveSettings (globalAccountSettings[i], settings, isFormSave, false);
            break;
        }
    }
}

function isEachResourceLoaded () {
    // 功能：确认是否每个资源都被读取了
    // 输入：无
    // 输出：loaded：是否正确读取的布尔值
    
    // console.log("①main_func isEachResourceLoaded");
    var loaded = true;
    for (var i=0; i<globalAccountSettings.length; i++) {
        if (typeof globalAccountSettings[i].errorLoaded != 'undefined' && 
            globalAccountSettings[i].errorLoaded != null && 
            globalAccountSettings[i].errorLoaded === true) {

            loaded = false;
        }
    }
    return loaded;
}

function logoutCalDAV () {
    // 功能：登出
    // 输入：无
    // 输出：无
    
    // console.log("①main_func logoutCalDAV");
    globalLimitLoading                              = '';
    globalLimitTodoLoading                          = '';
    globalAllowFcRerender                           = true;
    globalCalDAVCollectionSync                      = false;
    globalDefaultCalendarCollectionLoadAll          = false;
    globalDefaultCalendarCollectionActiveAll        = false;
    globalDefaultTodoCalendarCollectionLoadAll      = false;
    globalDefaultTodoCalendarCollectionActiveAll    = false;
    globalTodoCheckTimeout                          = null;
    globalTodolistStatusArray                       = {};
    globalCalendarNumber                            = 0;
    globalOnlyCalendarNumber                        = 0;
    globalTodoCalendarNumber                        = 0;
    globalCalendarNumberCount                       = 0;
    globalBeginPast                                 = new Date();
    globalBeginFuture                               = new Date();
    globalLoadedLimit                               = new Date();
    globalToLoadedLimit                             = new Date();
    globalLoadedLimitTodo                           = new Date();
    globalToLoadedLimitTodo                         = new Date();
    timeZonesEnabled.splice(0,timeZonesEnabled.length);
    processedTimezones.splice(0, processedTimezones.length);
    globalVisibleCalDAVCollections.splice(0, globalVisibleCalDAVCollections.length);
    globalVisibleCalDAVTODOCollections.splice(0, globalVisibleCalDAVTODOCollections.length);
    globalEventList.reset();
    globalResourceCalDAVList.reset();

    if (globalEventIntervalID != null) {
        clearInterval(globalEventIntervalID);
    }

    $('#EventDisabler, #TodoDisabler, #AlertDisabler').fadeOut(2000);
    $('#SystemCalDavZAP,  #SystemCalDavTODO').animate({opacity : 0},200).promise().done(function() {
        $('#SystemCalDavZAP, #SystemCalDavTODO').css('visibility','hidden');
        // $('#main, #mainTODO').animate({top: 25}, 0);
        $('#searchForm, #searchFormTODO').hide();
        $('#searchInput, #searchInputTODO').val('').trigger('keyup').trigger('blur');
        $('#calendar').fullCalendar('destroy');
        // $('#todoList').fullCalendar('destroy');
        $('#timezonePicker, #timezonePickerTODO').prop('disabled', false).empty();
        $('#eventColor, #todoColor').css('background-color','');
        if ($('#ResourceCalDAVList').width() < 1) {
            console.log("-------width<1")
            $('#ResourceCalDAVToggle').trigger('click');
        }
        if ($('#ResourceCalDAVTODOList').width() < 1) {
            $('#ResourceCalDAVTODOToggle').trigger('click');
        }
    });
}

function mainCalDAV () {
    // 调用 localizeCalDAV 函数

    // console.log("①main_func mainCalDAV");
    localizeCalDAV();


    // init();
}

function localizeCalDAV () {
    // 功能：
    // 输入：无
    // 输出：无
    
    // console.log("①main_func localizeCalDAV");
    globalCalDAVInitLoad = true;

    // $('#ResourceCalDAVList').html(origResourceCalDAVListTemplate);
    $('#myListItems').html(origmyListItemTemplate);

    $('#ResourceCalDAVTODOList').html(origResourceCalDAVTODOListTemplate);
    $('#CAEvent').html(origVcalendarTemplate);
    $('#CATodo').html(origVtodoTemplate);
    $('#todoLoader').html(origVtodoLoaderTemplate);
    translate();
    $('input[placeholder], textarea[placeholder]').placeholder();

    // cleanResourceCalDAVListTemplate = $('#ResourceCalDAVListTemplate').clone().wrap('<div>').parent().html();
    cleanmyListItemTemplate = $('#myListItemTemplate').clone().wrap('<div>').parent().html();

    cleanResourceCalDAVTODOListTemplate = $('#ResourceCalDAVTODOListTemplate').clone().wrap('<div>').parent().html();
    cleanVcalendarTemplate = $('#CAEvent .saveLoader').clone().wrap('<div>').parent().html() + $('#repeatConfirmBox').clone().wrap('<div>').parent().html() + $('#event_details_template').clone().wrap('<div>').parent().html();
    cleanVtodoTemplate = $('#repeatConfirmBoxTODO').clone().wrap('<div>').parent().html() + $('#todo_details_template').clone().wrap('<div>').parent().html();
    $('#searchInput, #searchInputTODO').val('');
    
    globalSettings.titleformatday.value     = localization[globalInterfaceLanguage]._default_title_format_day_;
    globalSettings.titleformatweek.value    = localization[globalInterfaceLanguage]._default_title_format_week_;
    globalSettings.titleformatmonth.value   = localization[globalInterfaceLanguage]._default_title_format_month_;
    globalSettings.titleformattable.value   = localization[globalInterfaceLanguage]._default_title_format_table_;
    globalSettings.columnformatagenda.value = localization[globalInterfaceLanguage]._default_column_format_agenda_;
}

function runCalDAV () {
    // 功能：
    // 输入：无
    // 输出：无
    
    // console.log("①main_func runCalDAV");
    if (!isUserLogged) {
        run();
    }

    globalResourceRefreshNumber     = 0;
    globalResourceRefreshNumberTodo = 0;

    $('#MainLoader').css('left','0px');
    $('#MainLoader').fadeIn(200);

    if (typeof globalSubscribedCalendars!='undefined' && globalSubscribedCalendars!=null) {
        globalAccountSettings[globalAccountSettings.length]                 = $.extend({},globalAccountSettings[0]);
        globalAccountSettings[globalAccountSettings.length-1].hrefLabel     = globalSubscribedCalendars.hrefLabel;
        globalAccountSettings[globalAccountSettings.length-1].calendars     = globalSubscribedCalendars.calendars;
        globalAccountSettings[globalAccountSettings.length-1].ignoreAlarms  = '';
    }
}

function globalMainCalDAV () {
    // 功能：
    // 输入：无
    // 输出：无
    
    // console.log("①main_func globalMainCalDAV");

    /*************************** BAD HACKS SECTION ***************************/
        if ($.browser.msie || $.browser.mozilla) {
            var newSVG=$(SVG_select_b).attr('data-type', 'select_icon').css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});   // background-color = stupid IE9 bug
            $('#timezoneWrapper, #timezoneWrapperTODO').find('select').after($($('<div>').append($(newSVG).clone()).html()));
        }
        // INFO LABEL ALIGN WITH UNDELYING SELECT FIX
        if ($.browser.webkit && !!$.browser.safari) {
            $('.infoSpan[data-type="txt_interval"]').css('padding-left', '3px');
        }
    /*************************** END OF BAD HACKS SECTION ********************/

    globalCalWidth = $('#main').width();

    /******************************* 模板 ***************************************/ 
    // origResourceCalDAVListTemplate = $('#ResourceCalDAVListTemplate').clone().wrap('<div>').parent().html();
    origmyListItemTemplate              = $('#myListItemTemplate').clone().wrap('<div>').parent().html();
    origResourceCalDAVTODOListTemplate  = $('#ResourceCalDAVTODOListTemplate').clone().wrap('<div>').parent().html();
    origVcalendarTemplate               = $('#CAEvent .saveLoader').clone().wrap('<div>').parent().html() + 
                                            $('#repeatConfirmBox').clone().wrap('<div>').parent().html() + 
                                            $('#event_details_template').clone().wrap('<div>').parent().html();
    origVtodoTemplate                   = $('#repeatConfirmBoxTODO').clone().wrap('<div>').parent().html() + 
                                            $('#todo_details_template').clone().wrap('<div>').parent().html();
    origVtodoLoaderTemplate             = $('#todoLoader .saveLoader').clone().wrap('<div>').parent().html();

    /* 
        $('#ResourceCalDAVToggle').click(function() {
            console.log("into the toggle.click")
            var transSpeedResource=70;
            var isResourceVisible=$('#ResourceCalDAVList').width()>1;
            var col0 = isResourceVisible? 0:218;
            var col1 = isResourceVisible? 0:224;
            var col2 = isResourceVisible? 0:224;
            var col3 = isResourceVisible? 0:224;

            if (isIntegrated) {
                //col2+=isResourceVisible? 0:1;
                col3 += 1;
            }

            if (typeof globalCalDAVInitLoad!='undefined' && !globalCalDAVInitLoad && !globalResourceRefreshNumber) {

                $('#CalendarLoader').children('.loaderInfo')
                    .text(localization[globalInterfaceLanguage].resizeLoader)
                    .parent().css('display','block');
            }

            if (globalSettings.timezonesupport.value) {
                $('#timezoneWrapper').animate ({width: col0}, transSpeedResource);
            }

            $('#resourceCalDAV_h, #ResourceCalDAVList').animate({width: col1}, transSpeedResource);
            $('#CalendarLoader').animate({left: col3}, transSpeedResource);
            $('#main_h, #searchForm, #main').animate({left: col2}, transSpeedResource).promise().done(function() {
            //  $('#SystemCalDavZAP .fc-header-center').width($('#main_h_placeholder').width()-$('#SystemCalDavZAP .fc-header-left').width()-$('#SystemCalDavZAP .searchForm').width()-20);
            //  $('#SystemCalDavZAP .fc-header-title').width($('#main_h_placeholder').width()-$('#SystemCalDavZAP .fc-header-left').width()-$('#SystemCalDavZAP .fc-header-right').width()-20);
                $(window).resize();
            });
        });

        $('#eventFormShower').click(function() {
            logout();
        });

        $('#timezonePicker').change(function() {
            var previousTimezone = globalSessionTimeZone;
            globalSessionTimeZone = $(this).val();
            $('#timezonePicker').val($(this).val());
            applyTimezone(previousTimezone);
        });
    */

    populateTimezoneKeys();
}

function setCalendarNumber (initSearch) {
    // 功能：初始化搜索引擎 & 计算已经读取的日历数量
    // 输入：initSearch：是否初始化搜索引擎的布尔值
    // 输出：无
    
    // console.log("①main_func setCalendarNumber");
    /*if ($('.resourceCalDAV_header:visible').length>1 || (!$('.resourceCalDAV_header:visible').length  && $('.resourceCalDAV_item:visible').length>1))
        $('.addRemoveAllCalDAV').show();
    if ($('.resourceCalDAVTODO_header:visible').length>1 || (!$('.resourceCalDAVTODO_header:visible').length  && $('.resourceCalDAVTODO_item:visible').length>1))
        $('.addRemoveAllCalDAVTODO').show();*/
    if (initSearch) {
        initSearchEngine ();
    }

    globalCalendarNumber     = 0;
    globalOnlyCalendarNumber = 0;
    globalTodoCalendarNumber = 0;

    for (var i=0; i<globalResourceCalDAVList.collections.length; i++) {
        if (globalResourceCalDAVList.collections[i].uid != undefined && 
            globalResourceCalDAVList.collections[i].makeLoaded) {

            globalCalendarNumber++;
            globalOnlyCalendarNumber++;
        }
    }

    for (var i=0; i<globalResourceCalDAVList.TodoCollections.length; i++) {
        if (globalResourceCalDAVList.TodoCollections[i].uid!=undefined && 
            globalResourceCalDAVList.TodoCollections[i].makeLoaded) {

            globalCalendarNumber++;
            globalTodoCalendarNumber++;
        }
    }
}

function bindColorPickerClick (newElement) {
    // 功能：
    // 输入：newElement
    // 输出：无
    
    // console.log("①main_func bindColorPickerClick");
    newElement.click(function(event) {
        var resourceItems           = null;
        var collectionType          = null;
        var resourceSelectedClass   = null;

        if (newElement.parent().hasClass('resourceCalDAV_item')) {
            if (globalEventCollectionsLoading) {
                return false;
            }
            collectionType = 'event';
            resourceSelectedClass = 'resourceCalDAV_item_selected';
            resourceItems = newElement.parent().siblings('.resourceCalDAV_item_selected');
        }
        else if (newElement.parent().hasClass('resourceCalDAVTODO_item')) {
            if (globalTodoCollectionsLoading) {
                return false;
            }
            collectionType = 'todo';
            resourceSelectedClass = 'resourceCalDAV_item_selected';
            resourceItems = newElement.parent().siblings('.resourceCalDAV_item_selected');
        }
        else if (newElement.hasClass('resourceCardDAVColor')) {
            if (globalAddressbookCollectionsLoading) {
                return false;
            }
            collectionType = 'addressbook';
            resourceSelectedClass = 'resourceCardDAV_selected';
            resourceItems = newElement.parent().parent().siblings().find('.resourceCardDAV_selected');
        }

        var showInput = event.shiftKey;
        var colorpicker = $(this).siblings('.colorPicker');

        if (!$(this).hasClass('hasColorpicker')) {
            $(this).addClass('hasColorpicker');
            colorpicker.spectrum({
                chooseText: localization[globalInterfaceLanguage].buttonSave,
                cancelText: localization[globalInterfaceLanguage].buttonCancel,
                color: newElement.css('background-color'),
                showInput: showInput,
                preferredFormat: 'hex6',
                move: function(color) {
                    newElement.css('background', color);
                },
                hide: function(color) {
                    if (newElement.css('background-color') != colorpicker.spectrum('get').toRgbString())
                        newElement.css('background', colorpicker.spectrum('get').toRgbString());
                },
                change: function(color) {
                    newElement.css('background', color);
                    if (collectionType == 'event') {
                        var coll = globalResourceCalDAVList.getEventCollectionByUID ($(this).parent().attr('data-id'));
                        netSaveProperty (coll, (typeof globalCalendarColorPropertyXmlns!='undefined'&&globalCalendarColorPropertyXmlns!=null&&globalCalendarColorPropertyXmlns!='' ? globalCalendarColorPropertyXmlns : 'http://apple.com/ns/ical/'), 'calendar-color', color.toHexString())
                    }
                    else if (collectionType == 'todo') {
                        var coll = globalResourceCalDAVList.getTodoCollectionByUID($(this).parent().attr('data-id'));
                        netSaveProperty (coll, (typeof globalCalendarColorPropertyXmlns!='undefined'&&globalCalendarColorPropertyXmlns!=null&&globalCalendarColorPropertyXmlns!='' ? globalCalendarColorPropertyXmlns : 'http://apple.com/ns/ical/'), 'calendar-color', color.toHexString())
                    }
                    else if (collectionType == 'addressbook') {
                        var coll = globalResourceCardDAVList.getCollectionByUID($(this).parent().attr('data-id'));
                        netSaveProperty (coll, (typeof globalAddrColorPropertyXmlns!='undefined'&&globalAddrColorPropertyXmlns!=null&&globalAddrColorPropertyXmlns!='' ? globalAddrColorPropertyXmlns : 'http://inf-it.com/ns/ab/'),  'addressbook-color', color.toHexString())
                    }
                }
            });
        }
        else if (showInput!=colorpicker.spectrum('option', 'showInput')) {
            colorpicker.spectrum('option', 'showInput',showInput);
        }

        var container = colorpicker.spectrum('container');
        if (container.is(':visible')) {
            colorpicker.spectrum('hide');
        }
        else {
            var offset=$(this).offset();
            colorpicker.spectrum('show');

            if (event.pageY<$(window).height()/2) {
                offset.top+=$(this).outerHeight();
                container.removeClass('sp-inverse');
            }
            else {
                offset.top-=container.outerHeight();
                container.addClass('sp-inverse');
            }
            container.offset(offset);
        }

        resourceItems.removeClass(resourceSelectedClass);
        newElement.parent().addClass(resourceSelectedClass);

        return false;
    });
}

$(document).ready(globalMain);

/** 
 *  功能：左侧设置/添加/编辑（我的和他人）日历部分的交互事件...etc
 */
$(document).ready(function() {
    // ---公共样式交互部分---
    $('.ListHeaderPlus')
        .hover(function() {
            $(this).attr('src', 'images/list_plus_hover.png');
        }, function() {
            $(this).attr('src', 'images/list_plus.png');
        }); 

    $('.list-color span').click(function() {
        // 新建/编辑日历对话框中共用的颜色选择区域
        $(this).siblings('span.active').removeClass('active');
        $(this).addClass('active');
        $(this).nextAll('div').css('left', $(this).position().left + 33);
    });

    // -----------------

    // 遮罩层
    $('.ezz').click(function(event) {
        // 非全天提醒对话框
            if ($('#noDay').css('display') === "block" && $('.setting-content').css('display') === 'none') {
                // 当前操作焦点在非全天提醒对话框，
                $('#noDay').css('display', 'none');
                $('.ezz').css('z-index', -1);                
            }

        // 邀请事件对话框
            else if ($('#invitationEventBox').css('display') === "block") {
                // 当前操作焦点在邀请事件对话框，
                $('#invitationEventBox').css('display', 'none');
                $('.ezz').css('z-index', -1);                
            }

        // 添加他人日历相关
            else if ($('#addOthersCalendarDetail').css('display') === "block") {
                // 当前操作焦点在显示他人日历列表，
                // 判断是否已勾选了他人的日历，若有勾选则，调用 netSubscribeCalendar 函数订阅日历
                // 若没有勾选，则当作用户取消订阅他人日历，隐藏他人日历对话框、取消联系人列表的 active 状态、并恢复遮罩层的 z-index
                $('#addOthersCalendarDetail .others-calendars-ul li.active').each(function() {
                    // 有勾选的日历项
                   netSubscribeCalendar($(this).attr('data-id'), "commonname", $(this).find('strong').html());
                });

                $('#addOthersCalendarDetail').css('display', 'none');
                $('.group .myContacts li.active').removeClass('active');
                $('.ezz').css('z-index', 25);      
                $('#addOthersCalendarDetail .others-calendars-ul').html("");             
            }
            else if ($('#contacts').css('display') === 'block') {
                $('#contacts').css('display', 'none');
                $('.ezz').css('z-index', -1);
                if ($('#event_details_template').parent().css('display') === 'block') {
                    // 当前操作焦点在联系人对话框(添加邀请人状态)，将选中的联系人加入邀请名单
                    var tmp_html = "";
                    var tmp_dataId = "";
                    $('#contacts .group li.active').each(function() {
                        // 有勾选的联系人，加入 #addPartnerTxt 中
                        tmp_html   += "," + $(this).find('span').html();
                        tmp_dataId += "," + $(this).attr('data-id');
                    });
                    if (tmp_html != "") {                    
                        $('#addPartnerTxt').html(tmp_html.slice(1));
                        $('#addPartnerTxt').attr('data-id', tmp_dataId.slice(1));
                    }
                    $('#contacts .group li.active').removeClass('active');
                }
            }

        // 各类设定相关
            else if ($('.settingMy').css('display') === "block") {
                // 当前操作焦点在设置默认日历                 
                $('.settingMy').css('display', 'none');
                $('.ezz').css('z-index', 25);                    
            } 
            else if ($('.setting-content').css('display') === 'block') {
                // 当前操作焦点在偏好设置对话框，将偏好设置对话框隐藏后恢复遮罩层
                if ($('#noDay').css('display') === 'block') {
                    $('#noDay').css('display', 'none');
                }
                else {                
                    $('.setting-content').css('display', 'none');
                    $('.ezz').css('z-index', -1);                   
                }
            } 
            else if ($('#settingsMenu').css('display') === 'block') {
                // 当前操作焦点在偏好设置菜单，将菜单隐藏后恢复遮罩层
                $('#settingsMenu').css('display', 'none');
                $('.ezz').css('z-index', -1);                   
            }

        // 新建/编辑日历相关
            if ($('#list_MKCalendar').css('display') === "block") {
                // 当前操作焦点在新建日历
                $('#list_MKCalendar').css('display', 'none');
                $('.ezz').css('z-index', -1);

                // 当作取消处理，恢复原始状态
                $('#list_MKCalendar .list_txt').val("");                       // 新建日历的标题
                $('#list_MKCalendar span.setChoose:first').trigger('click');   // 新建日历的是否共享   
                $('#list_MKCalendar .list-color span:first').trigger('click'); // 新建日历的颜色
            } 
            else if ($('#list_ViewCalendar').css('display') === "block") {
                // 当前操作焦点在查看他人日历
                $('#list_ViewCalendar').css('display', 'none');
                $('.ezz').css('z-index', -1);
            } 
            else if ($('#list_EditCalendar').css('display') === 'block') {
                // 当前操作焦点在编辑日历
                // 当作保存设定处理，根据不同属性的更改调用不同的函数：
                //    调用 netSaveProperty 函数保存标题和颜色属性，
                //    调用 netShareCalendar 或 netUnShareCalendar 函数共享/不共享日历
                var tmp_uid      = $('#list_EditCalendar .list_txt').attr('data-id'); 
                var tmp_color    = rgbToHex($('#list_EditCalendar .list-color span.active').css('background-color'));
                var tmp_isShared = $('#list_EditCalendar span.setChoose.active').parent().hasClass('sharedOpen') ? true : false;

                if ($('#list_EditCalendar .list_txt').prop('value') != globalResourceCalDAVList.getCollectionByUID(tmp_uid).displayvalue) {
                    // 标题已被修改
                    if ($('#list_EditCalendar .list_txt').prop('value') === "") {
                        // 没有填写标题
                        var tmp_title = $('#list_EditCalendar .list_txt').prop('placeholder');
                        netSaveProperty(globalResourceCalDAVList.getCollectionByUID(tmp_uid), 'DAV:', 'displayname', tmp_title);
                    }
                    else {
                        var tmp_title = $('#list_EditCalendar .list_txt').prop('value');
                        netSaveProperty(globalResourceCalDAVList.getCollectionByUID(tmp_uid), 'DAV:', 'displayname', tmp_title);
                    }
                }

                if (tmp_color != globalResourceCalDAVList.getCollectionByUID(tmp_uid).ecolor) {
                    // 颜色已被修改
                    netSaveProperty(globalResourceCalDAVList.getCollectionByUID(tmp_uid), 'http://apple.com/ns/ical/', 'calendar-color', tmp_color);
                }

                if (tmp_isShared != globalResourceCalDAVList.getCollectionByUID(tmp_uid).isShared) {
                    // 共享已被修改
                    if (tmp_isShared) {
                        var tmp_url = globalResourceCalDAVList.getCollectionByUID(tmp_uid).url + globalResourceCalDAVList.getCollectionByUID(tmp_uid).href;
                        netShareCalendar(tmp_url);
                    }
                    else {
                        netUnShareCalendar(globalResourceCalDAVList.getCollectionByUID(tmp_uid));
                    }
                }

                $('#list_EditCalendar').css('display', 'none');
                $('.ezz').css('z-index', -1);
            }
    });

    // 邀请事件信息对话框
    $('.invitationEventBoxul1 li').click(function () {
        $('.invitationEventBoxul1 li.active').removeClass('active');
        $(this).addClass('active');

        $('.box-bottom li').each(function () {
            if ($(this).css('display') === 'none') {
                $(this).css('display', 'block');
            }
            else if ($(this).css('display') === 'block') {
                $(this).css('display', 'none');
            }
        })
    });

    // 添加他人日历
    $('#othersListHeader .ListHeaderPlus').click(function() {
        // 点击添加他人日历按钮，弹出联系人对话框
        $('#contacts').css('display', 'block');
        $('.ezz').css('z-index', 25);
    });

    // 新建我的日历
        $('#myListHeader .ListHeaderPlus').click(function() {
            if ($('#list_MKCalendar').css('display') === 'none') {
                $('#list_MKCalendar').css('display', 'block');
                $('.ezz').css('z-index', 25);
            } else {
                $('#list_MKCalendar').css('display', 'none');
            }
        });

        $('#list_MKCalendar span.setChoose').click(function() {
            // 是否共享
            $('#list_MKCalendar span.setChoose.active').removeClass('active');
            $(this).addClass('active');
        });

        $('#list_EditCalendar span.setChoose').click(function() {
            // 是否共享
            $('#list_EditCalendar span.setChoose.active').removeClass('active');
            $(this).addClass('active');
        });

        $('#listAdd').click(function() {
            // 点击新建日历按钮，
            // 获取日历标题和颜色之后调用 netMakeCalendar 函数新建日历，
            // 若是勾选了共享日历，那么调用 netShareCalendar 函数，共享该日历。

            if ($('#list_MKCalendar .list_txt').prop('value') === "") {
                // 没有填写标题
                var tmp_title = $('#list_MKCalendar .list_txt').prop('placeholder');
            }
            else {
                var tmp_title = $('#list_MKCalendar .list_txt').prop('value');
            }

            var tmp_color = rgbToHex($('#list_MKCalendar .list-color span.active').css('background-color'));
        
            if ($('#list_MKCalendar span.setChoose.active').parent().hasClass('sharedOpen')) {
                // 勾选了共享日历
                netMakeCalendar(tmp_title, true, tmp_color);
            }
            else {
                netMakeCalendar(tmp_title, false, tmp_color);
            }

            $('.ezz').trigger('click'); //收起对话框，并将数据初始化
        });

    // 点击左上角的用户名，弹出或收起设定菜单
        $('#settings')
            .click(function () {
                if ($('#settingsMenu').css('display') === 'none') {
                    $('#settingsMenu').css('display', 'block');
                    $('.ezz').css('z-index', 25);
                } else {
                    $('#settingsMenu').css('display', 'none');
                }
            })
            .hover(function() {
                $('#settings').attr('src', 'images/settings_hover.png');
            }, function() {
                $('#settings').attr('src', 'images/settings.png');
            });

    // 点击设定菜单中的偏好设置
        $('#menu-setting').click(function () {
            if ($('.setting-content').css('display') === 'none') {
                $('.setting-content').css('display', 'block');
                $('.ezz').css('z-index', 25);
                $('#settingsMenu').css('display', 'none');
            } else {
                $('.setting-content').css('display', 'none');
            }
        });

    // 点击偏好设置中的默认日历
        $('.defaultCalendar').click(function () {
            if ($('.settingMy').css('display') === "none") {
                $('.settingMy').css('display', 'block');
                $('.ezz').css('z-index', 25); 
            } else {
                $('.settingMy').css('display', 'none');
            }
        });

        $('#menu-logout').click(function () {
            $('#settingsMenu').css('display', 'none');
            $('.ezz').css('z-index', -1); 
            logout();
        });

    // 偏好设置对话框中的提醒部分（待做）
        // 默认提醒时间
        $('.setWidthTime').click(function() {
            if ($('#noDay').css('display') === 'none') {
                $('#noDay').css({
                    display: 'block',
                    top: $('.setWidthTime').offset().top + 16,
                    left: $('.setWidthTime').offset().left -2
                });
                $('.ezz').css('z-index', 27);
            } else {
                $('#noDay').css('display', 'none');
            }
        });

        $('#noDayContent li').click(function() {
            $('#noDayContent li.active').removeClass('active');
            $(this).addClass('active');
            if ($('#event_details_template').parent().css('display') === 'block') {
                // 事件提醒时间
                $('#alertTxt').html($(this).html());
                $('#alertTxt').attr('value', $(this).attr('value'));
                $('.ezz').css('z-index', -1);
            }
            else if ($('#setting-content').css('display') === 'block') {
                // 默认提醒时间
                $('.setWidthTime').html($(this).html());
                $('.setWidthTime').attr('value', $(this).attr('value'));
            }
            $('#noDay').css('display', 'none');
        });

        // $('.haveDay1Content li').click(function() {
        //     $('.haveDay1Content li.active').removeClass('active');
        //     $(this).addClass('active');
        //     if ($('.haveDay1Content li:last').hasClass('active')) {
        //         $('.timeUpDown').css('display', 'block');
        //     }
        //     else {
        //         $('.timeUpDown').css('display', 'none');
        //     }
        // });

        // 提醒及通知铃声
        $('#SettingsAlertOnOff span').click(function() {
            $('#SettingsAlertOnOff span.active').removeClass('active');
            $(this).addClass('active');
        });

    addContacts();
});

function addContacts() {
    /* 功能：根据 users_data.js 中的静态数据，通过两层循环生成联系人对话框
     * 输入：无
     * 输出：无
    */

    $('#contacts .borderSpan ~ div').remove(); // 清空

    // 1. 根据 globalUsersGroup 中的数据，生成组（第一层）
    var tmp_group = "";
    // originUserDataTOglobalUsersData(originUserData, 0)

    // searchGroupsData(globalGroupssUrl);

    for (var i = 0; i < globalUsersGroup.length; i++) {
        // 2. 根据 globalUsersGroup 中的数据，生成组（第二层）
        var tmp_li = "";
        for (var j = 0; j < globalUsersGroup[i].users.length; j++) {
            var tmp_uid = globalUsersGroup[i].users[j]; // globalUsersData 中的下标
            tmp_li += "<li data-id='" + globalUsersData[tmp_uid].uid+ "'>" +
                        "<span>" + globalUsersData[tmp_uid].name + "</span>" +
                        "<img src='images/list_item.png'>" +
                    "</li>";
        }

        tmp_group += "<div class='group' data-id='"+ globalUsersGroup[i].uid + "'>" +
                        "<div class='groupContainer'>" +
                            "<span class='groupTitle'>" + globalUsersGroup[i].name+ "</span>" +
                            "<span class='groupCount'>(" + globalUsersGroup[i].users.length + ")</span>" +                
                        "</div>" +
                        
                        "<ul class='myContacts'>" + tmp_li + "</ul>" + 
                    "</div>"
    }

    $('#contacts .borderSpan').after($(tmp_group));

    // 添加交互事件
        $('.groupTitle').click(function() {
            // 点击联系人群组的一级标题菜单（如业务所），实现显示/收起效果，并且若是已有打开的其他一级菜单，则将其收起
            // $(this).parent().next()：就是二级菜单，具体的个人信息
            
            if ($(this).parent().next().css('display') === 'none') {
                $('.myContacts').css('display', 'none'); // 将二级菜单全部收起
                $(this).parent().next().css('display', 'block');
                $(this).parent().css('background', 'url(../images/headerBtnBottom.png) no-repeat 3px 11px');
            } 
            else {
                $(this).parent().next().css('display', 'none');
                $(this).parent().css('background', 'url(../images/btn_arrow_next.png) no-repeat 7px 7px');
            }
        });

        $('.group .myContacts li').click(function() {
            // 点击二级菜单中的具体的某个人，调用 netSearchCalendar 函数查询该用户的日历，
            // 查询成功后弹出他人日历列表对话框
            // 「待完成：在日历列表对话框中显示正在查询的标志」

            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            }
            else {
                $(this).addClass('active');
            }

            if ($('#event_details_template').parent().css('display') === 'none') {
                // 当前操作焦点在联系人对话框(不是添加邀请人状态)
                var tmp_email = globalUsersData[parseInt($(this).attr('data-id'))].e_mail;
                netSearchCalendar(tmp_email);

                $('#addOthersCalendarDetail').css('display', 'block');
                $('.ezz').css('z-index', 27);
            } 
        });
}

$(document).ready(function() {
    $(window).resize (function (evt) {
        if (evt.target != window) {
            return;
        }

        if (typeof globalCalDAVInitLoad!='undefined' && !globalCalDAVInitLoad && 
            !globalResourceRefreshNumber && $('#main').width() != globalCalWidth) {

            $('#CalendarLoader').children('.loaderInfo')
                .text(localization[globalInterfaceLanguage].resizeLoader).parent().css('display','block');
        }

        //$('#SystemCalDavZAP .fc-header-center').css('width', $('#main_h_placeholder').width()-$('#SystemCalDavZAP .fc-header-left').outerWidth()-$('#SystemCalDavZAP .searchForm').outerWidth());
        //origin$('#SystemCalDavZAP .fc-header-title').css('width', $('#main_h_placeholder').width()-$('#SystemCalDavZAP .fc-header-left').outerWidth()-$('#SystemCalDavZAP .fc-header-right').outerWidth());
        // $('#ResourceCalDAVList, #ResourceCalDAVTODOList').css('bottom',(globalSettings.timezonesupport.value ? 20 : 0));
        $('#alertBox').css('left', ($(window).width()/2)-($('#alertBox').width()/2));
        $('#calendar').fullCalendar('option', 'contentHeight', $('#main').height() - 14);
        $('#todoList').fullCalendar('allowSelectEvent',false);
        $('#todoList').fullCalendar('option', 'contentHeight', $('#mainTODO').height() - 14);
        $('#todoList').fullCalendar('allowSelectEvent',true);
        $('#todoList').fullCalendar('selectEvent', null, true);

        if ($('#CATodo').is(':visible')) {
            checkTodoFormScrollBar();
        }

        if (globalSettings.displayhiddenevents.value) {
            hideEventCalendars();
            hideTodoCalendars();
        }
        globalCalWidth = $('#main').width();
    });

    $('#searchInput').bind('keyup change', function() {
        if ($(this).val() != '') {
            $('#reserButton').css('visibility', 'visible');
        }
        else {
            $('#reserButton').css('visibility', 'hidden');
        }
    });

    $(document).keyup(function(e) {
        switch(e.keyCode) { 
            //--@steve navigation-- 
            case 39:
                // User pressed "right" arrow
                if ($('#CAEvent').css('display') == 'none') {
                    // 防止在新建事件时触发
                    $('#calendar').fullCalendar('next');
                }
            break;
            case 37:
                // User pressed "left" arrow
                if ($('#CAEvent').css('display') == 'none') {
                    // 防止在新建事件时触发
                    $('#calendar').fullCalendar('prev');
                }
            break;

            //--@steve cmd--
            case 46:
                // User pressed "delete"
                console.log("delete button pressed...");
                if ($('#CAEvent').css('display') == 'none') {
                    // 防止在新建事件时触发
                    updateEventFormDimensions(true);
                    // $('#CAEvent.saveLoader').show();
                    // console.log(globalCalEvent.id);
                    deleteVcalendarFromCollection(globalCalEvent.id,'vevent');
                    hideEventPopup();
                }
            break;
        }
    })

    // --自动登录--
    if ($.cookie("username") && $.cookie("username")!="null" && $.cookie("password") && $.cookie("password")!="null") {
        $("#username").val($.cookie("username"));
        $("#password").val($.cookie("password"));
        $("#loginkeeping").trigger('click');
        $('#login_btn').trigger('click');
    }

    $("#login_btn").click(function () {
        if ($("#loginkeeping").is(":checked")) {
            $.cookie("username", $("#username").val(), {expires:1, path:'/'});
            $.cookie("password", $("#password").val(), {expires:1, path:'/'});
        } 
        else {
            $.cookie("username", null, {path:'/'});
            $.cookie("password", null, {path:'/'});
        }
    });

    window.onkeydown = function (event) {
        switch (event.which) {
            case 13:
                if (!isUserLogged)
                    $('#Login').find('[data-type="system_login"]').trigger('click');
                break;
            case 27:
                if (globalActiveApp=='CalDavZAP' && $('#CAEvent').is(':visible') && $('#EventDisabler').is(':hidden'))
                    $('#closeButton').trigger('click');
                if (globalActiveApp=='Projects' && $('#ProjectEventForm').is(':visible') && $('#ProjectsDisabler').is(':hidden'))
                    $('#cancelActivity').trigger('click');
                if ($('.sp-container').is(':visible'))
                    $('html').trigger('click');
                break;
            default:
                break;
        }
    };
});

// --- vue ---
// var AllDayAlertSelect = new Vue({
//     // 勾选全天时，设置提醒的弹出框
//     el: '#allDayAlertSelect',
//     data: {
//         isShow: false,      // 自身是否显示
//         isDIY: false,       // 无/自定义
//         timeTXT: '',        // 动态显示自定义时间
//         dayCount: 0,        // 提前几天
//         timeDayTXT: '天前', // 文本
//         hourCount: 0,       // 提前几小时
//         timeHourTXT: '时',  // 文本
//     },
//     computed: {
//         timeTXT: function() {
//             return this.dayCount + this.timeDayTXT + this.hourCount + this.timeHourTXT;
//         }
//     },
//     components: {
//         // 复用的时间选择组件
//         time_count_component: {
//             props: {
//                 // 传入参数
//                 count: {
//                     type: Number, 
//                     twoWay: true,
//                 },
//                 time_txt: String, 
//                 count_type: String,
//             },
//             template: '#time-count-template',
//             filters: {
//                 // 过滤器
//                 numberDisplay: {
//                     // 利用timeLimit函数保证合法范围，parseInt过滤小数,write表示将过滤后的变量保存
//                     // （由于双向绑定，input中的内容是过滤后的正确值）
//                     write: function(val, oldval) {
//                         return this.timeLimit(val, this.count_type) ? parseInt(val) : 0;
//                     },
//                 },
//             },
//             methods: {
//                 // 增加时间需要验证范围
//                 addTime: function() {
//                     this.count = this.timeLimit(this.count+1, this.count_type) ? this.count+1 : this.count;    
//                 },
//                 timeLimit: function(val, countType) {
//                     /* 功能：根据countType验证val是否在范围内(非数字不在范围内)
//                      * 输入：val: count值, 
//                      *      countType: 当前组件的类型,
//                      * 输出：无
//                     */
//                     if (countType === 'hour') {
//                         return val >= 0 && val < 24;
//                     } 
//                     else if (countType === 'day') {
//                         return val >= 0 && val < 100;
//                     }
//                     else {
//                         return val >= 0;
//                     }
//                 },
//             },
//         },
//     },
// });


