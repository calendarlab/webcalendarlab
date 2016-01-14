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

function checkTimezone (timezone) {
    // 功能：
    // 输入：timezone
    // 输出：
    // console.log("③interface_func checkTimezone");

    if (timezone in timezones) {
        return timezone;
    }
    else if (timezone in timezones_alt) {
        return checkTimezone(timezones_alt[timezone]);
    }
    return null;
}

function CalDAVeditor_cleanup (repeatHash) {
    // 功能：
    // 输入：repeatHash
    // 输出：
    // console.log("③interface_func CalDAVeditor_cleanup");

    if (typeof repeatHash != 'undefined') {
        CalDAVcleanupRegexEnvironment (repeatHash);
    }
    else {
        CalDAVcleanupRegexEnvironment ();
    }

    if (typeof repeatHash==='undefined' || repeatHash==='form') {
        /*************************** BAD HACKS SECTION ***************************/
        /* IE or FF */
        if ($.browser.msie || $.browser.mozilla) {
            // ADD empty SVG to interface (we will replace it later)
            $('<svg data-type="select_icon"></svg>').css('display', 'none').insertAfter($('#event_details_template, #todo_details_template').find('select'));
        }
        /*************************** END OF BAD HACKS SECTION ***************************/

        /*************************** BAD HACKS SECTION ***************************/
        if ($.browser.msie || $.browser.mozilla) {
            var newSVG = $(SVG_select).attr('data-type', 'select_icon')
                            .css({'pointer-events': 'none', 'z-index': '1', 'display': 'inline', 'margin-left': '-19px', 'vertical-align': 'top', 'background-color': '#ffffff'});  
                // background-color = stupid IE9 bug
            $('#event_details_template, #todo_details_template').find('svg[data-type="select_icon"]')
                .replaceWith($('<div>').append($(newSVG).clone()).html());
        }
        /*************************** END OF BAD HACKS SECTION ***************************/
    }
}

function animate_messageCalendar (messageSelector, messageTextSelector, duration, operation) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func animate_messageCalendar");

    if (operation==undefined) {
        operation = '+=';
    }
    var height    = $(messageTextSelector).height()+14;
    var animation = 500;

    $(messageSelector).animate({
            'max-height': height+'px',
            height: (operation==undefined ? '+=' : operation)+height+'px'
        },
        animation,
        function () {
            if (operation=='+=')
                setTimeout(function () {animate_messageCalendar(messageSelector, messageTextSelector, 0, '-=');}, duration);
        }
    );
    return duration+2*animation;
}

function show_editor_messageCalendar (inputPosition, inputSetClass, inputMessage, inputDuration, callback) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func show_editor_messageCalendar");

    var formShown = '';

    if ($('#todo_details_template').css('display') != 'none') {
        formShown = 'Todo';
    }
    else {
        formShown = 'Event';
    }

    if (inputPosition==undefined || inputPosition=='in') {
        messageSelector     = '#'+formShown+'InMessage';
        messageTextSelector = '#'+formShown+'InMessageText';
    }
    else {
        messageSelector     = '#'+formShown+'Message';
        messageTextSelector = '#'+formShown+'MessageText';
    }

    $(messageTextSelector).attr('class', inputSetClass);
    $(messageTextSelector).text(inputMessage);

    var a = animate_messageCalendar(messageSelector, messageTextSelector, inputDuration);

    if (callback != undefined) {
        callback(a);
    }
}

function show_editor_loader_messageCalendar (inputForm, inputSetClass, inputMessage, callback) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func show_editor_loader_messageCalendar");

    var formShown='';

    if (inputForm=='vtodo')
        formShown='#todoLoader';
    else
        formShown='#CAEvent';

    messageSelector=formShown+' .saveLoader';
    messageTextSelector=formShown+' .saveLoaderInfo';

    $(messageTextSelector).addClass(inputSetClass);
    $(messageTextSelector).text(inputMessage);
    setTimeout(function () {
        if (inputForm=='vtodo')
            $(formShown).hide();
        else
            $(messageSelector).hide();
        $(messageTextSelector).text('');
        $(messageTextSelector).removeClass(inputSetClass);
        if (callback!=undefined)
            callback(globalHideInfoMessageAfter);
    }, globalHideInfoMessageAfter);
}

function items (etag, from, end, title, isall, uid, rid, ev_id, note, displayValue, alertTime, alertNote, untilDate, type, interval, 
    after, repeatStart, repeatEnd, byMonthDay, repeatCount, realRepeatCount, vcalendar, location, alertTimeOut, timeZone, realStart, 
    realEnd, byDay, rec_id, wkst, classType, avail, hrefUrl, compareString, priority, status) {
    // 功能：
    // 输入：items 各项属性
    // 输出：
    // console.log("③interface_func items");

    this.etag               = etag;
    this.id                 = uid;
    this.start              = from;
    this.end                = end;
    this.title              = title;
    this.allDay             = isall;
    this.res_id             = rid;
    this.ev_id              = ev_id;
    this.note               = note;
    this.displayValue       = displayValue;
    this.alertTime          = alertTime;
    this.alertNote          = alertNote;
    this.untilDate          = untilDate;
    this.repeatStart        = repeatStart;
    this.repeatEnd          = repeatEnd;
    this.type               = type;
    this.interval           = interval;
    this.after              = after;
    this.byMonthDay         = byMonthDay;
    this.repeatCount        = repeatCount;
    this.realRepeatCount    = realRepeatCount;
    this.vcalendar          = vcalendar;
    this.location           = location;
    this.alertTimeOut       = alertTimeOut;
    this.timeZone           = timeZone;
    this.realStart          = realStart;
    this.realEnd            = realEnd;
    this.byDay              = byDay;
    this.rec_id             = rec_id;
    this.wkst               = wkst;
    this.classType          = classType;
    this.avail              = avail;
    this.hrefUrl            = hrefUrl;
    this.compareString      = compareString;
    this.priority           = priority;
    this.status             = status;
    this.searchvalue        = title.toLowerCase().replace(vCalendar.pre['compressNewLineRex']).multiReplace(globalSearchTransformAlphabet);
}

function setLoadingLimit (forceLoad, allSyncMode) {
    // 功能：
    // 输入：forceLoad, 
    //      allSyncMode
    // 输出：
    // console.log("③interface_func setLoadingLimit");

    if (forceLoad) {
        if (globalSettings.eventstartpastlimit.value!=null && (allSyncMode || globalLimitLoading=='past')) {
            var pastDate = new Date(globalLoadedLimit.getTime());
            pastDate.setDate(pastDate.getDate()-7);
            globalBeginPast = new Date(pastDate.getTime());
        }
        if (globalSettings.eventstartfuturelimit.value!=null && (allSyncMode || globalLimitLoading=='future')) {
            var futureDate = new Date(globalToLoadedLimit.getTime());
            futureDate.setDate(futureDate.getDate()+14);
            globalBeginFuture = new Date(futureDate.getTime());
        }
    }
}

function initSearchEngine () {
    // 功能：初始化搜索引擎，
    // 输入：无
    // 输出：无
    // console.log("③interface_func initSearchEngine");

    globalCalDAVQs = $('input[data-type="PH_CalDAVsearch"]').quicksearch (globalEventList.displayEventsArray, 
        {   delay: 500,
            hide: function () {
                this.hidden=true;
                $('#SystemCalDavZAP').find('.event_item[data-id="'+this.id+'"]').each(
                    function () {
                        $(this).addClass('searchCalDAV_hide');
                        if (this.tagName.toLowerCase()=='tr' && !$(this).siblings().addBack().not('.searchCalDAV_hide').length) {
                            $(this).parent().prev().find('tr').addClass('searchCalDAV_hide');
                        }
                    }
                );
            },
            show: function () {
                this.hidden=false;
                $('#SystemCalDavZAP').find('.event_item[data-id="'+this.id+'"]').each(
                    function () {
                        $(this).removeClass('searchCalDAV_hide');
                        if (this.tagName.toLowerCase() == 'tr') {
                            $(this).parent().prev().find('tr').removeClass('searchCalDAV_hide');
                        }
                    }
                );
            },
            prepareQuery: function (val) {
                return val.multiReplace (globalSearchTransformAlphabet).toLowerCase().split(' ');
            }
        }
    );

    globalCalDAVTODOQs = $('input[data-type="PH_CalDAVTODOsearch"]').quicksearch(globalEventList.displayTodosArray,{
        delay: 500,
        onAfter: function () {
            if (!$('#TodoDisabler').is(':visible'))
                $('#todoList').fullCalendar('selectEvent');
        },
        hide: function () {
            this.hidden=true;
            $('#SystemCalDavTODO').find('.event_item[data-id="'+this.id+'"]').addClass('searchCalDAV_hide');
        },
        show: function () {
            this.hidden=false;
            $('#SystemCalDavTODO').find('.event_item[data-id="'+this.id+'"]').removeClass('searchCalDAV_hide');
        },
        prepareQuery: function (val) {
            return val.multiReplace (globalSearchTransformAlphabet).toLowerCase().split(' ');
        }
    });
}

//SORRY FOR THAT-----------------------------------------------------------------------------------------------------
function checkEventLoader (inputCounter, needRefresh) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func checkEventLoader");

    inputCounter.counter++;
    if (inputCounter.counter==inputCounter.collectionLength)
    {
        if (inputCounter.listType=='vevent')
            $('#ResourceCalDAVList [data-id="'+inputCounter.uid+'"]').removeClass('r_operate');
        else
            $('#ResourceCalDAVTODOList [data-id="'+inputCounter.uid+'"]').removeClass('r_operate');

        if ((globalLimitTodoLoading=='' && globalLimitLoading=='') || 
            (   (inputCounter.listType=='vtodo' && globalSettings.todopastlimit.value==null) || 
                (   inputCounter.listType=='vevent' && 
                    globalSettings.eventstartpastlimit.value==null && 
                    globalSettings.eventstartfuturelimit.value==null))) {

            if (inputCounter.listType=='vevent') {
                globalAccountSettings[inputCounter.resourceIndex].calendarNo--;
            }
            else if (inputCounter.listType=='vtodo') {
                globalAccountSettings[inputCounter.resourceIndex].todoNo--;
            }

            if (((  globalAccountSettings[inputCounter.resourceIndex].calendarNo==0) && 
                    (globalAccountSettings[inputCounter.resourceIndex].todoNo==0) && globalCalDAVInitLoad) || 
                (!globalCalDAVInitLoad)) {

                if (!globalCalDAVInitLoad&&inputCounter.typeList.indexOf('vevent')!=-1&&inputCounter.typeList.indexOf('vtodo')!=-1) {
                    updateMainLoader (needRefresh,null,inputCounter.uid);
                }
                else {
                    updateMainLoader (needRefresh,inputCounter.listType,inputCounter.uid);
                }
            }
        }
        else if (globalOnlyCalendarNumberCount==globalOnlyCalendarNumber || globalOnlyTodoCalendarNumberCount==globalTodoCalendarNumber)
            updateMainLoader (needRefresh,inputCounter.listType,inputCounter.uid);
    }
}

function getResourceByCollection (calendarUID) {
    // 功能：通过日历的UID，得到资源的 href 和 user ，最后将对应的 globalAccountSettings 返回
    // 输入：calendarUID：日历的UID
    // 输出：resourceSettings
    // console.log("③interface_func getResourceByCollection");

    var coll             = globalResourceCalDAVList.getCollectionByUID(calendarUID);
    var tmp              = coll.accountUID.match(vCalendar.pre['accountUidParts']);
    var resourceSettings = null;

    var resourceCalDAV_href = tmp[1] + tmp[3] + tmp[4];
    var resourceCalDAV_user = tmp[2];

    for (var i=0; i<globalAccountSettings.length; i++) {
        if (globalAccountSettings[i].href==resourceCalDAV_href && globalAccountSettings[i].userAuth.userName==resourceCalDAV_user) {
            resourceSettings = globalAccountSettings[i];
        }
    }

    return resourceSettings;
}

function updateMainLoaderText (type) {
    // 功能：
    // 输入：type
    // 输出：无
    // console.log("③interface_func updateMainLoaderText");

    
    if (globalCalDAVInitLoad) {
        globalCalendarNumberCount++;
        $('#MainLoaderInner').html(localization[globalInterfaceLanguage].loadingCalendars
            .replace('%act%', globalCalendarNumberCount).replace('%total%', globalCalendarNumber));
    }
    else if ((  globalLimitTodoLoading != '' || 
                globalLimitLoading != '') && 
            ((  type=='vtodo' && globalSettings.todopastlimit.value!=null) || 
                (   type=='vevent' && 
                    (   globalSettings.eventstartpastlimit.value!=null || 
                        globalSettings.eventstartfuturelimit.value!=null)))) {

        if (type=='vevent' && (globalLimitLoading=='past' || globalLimitLoading=='future')) {
            globalOnlyCalendarNumberCount++;
            $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCalendars
                .replace('%act%', globalOnlyCalendarNumberCount).replace('%total%', globalOnlyCalendarNumber));
        }
        else if (type=='vtodo' && (globalLimitTodoLoading=='pastTodo' || globalLimitTodoLoading=='futureTodo')) {
            globalOnlyTodoCalendarNumberCount++;
            $('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCalendars
                .replace('%act%', globalOnlyTodoCalendarNumberCount).replace('%total%', globalTodoCalendarNumber));
        }
    }
    else if (globalSettingsSaving!='' && globalFirstHideLoader) {
        globalLoadedCollectionsCount++;
        if (globalSettingsSaving == 'event') {
            $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCalendars
                .replace('%act%', globalLoadedCollectionsCount).replace('%total%', globalLoadedCollectionsNumber));
        }
        else if (globalSettingsSaving == 'todo') {
            $('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCalendars
                .replace('%act%', globalLoadedCollectionsCount).replace('%total%', globalLoadedCollectionsNumber));
        }
    }
}

function updateMainLoaderTextFinal () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func updateMainLoaderTextFinal");

    $('#MainLoaderInner').html(localization[globalInterfaceLanguage].renderingE);
    updateSettings();
}

function updateSettings() {
    /* 功能：在用户登录之后更新相关设定信息
     * 输入：无
     * 输出：无
    */
   
    var tmp_defaultCalendar = globalResourceCalDAVList.getEventCollectionByUID(globalDefaultCalendar.uid);
    $('#settings').html(globalAccountSettings[0].userAuth.userName);
    $('.defaultCalendar span').css('background', tmp_defaultCalendar.ecolor); // 默认日历的颜色
    $('.defaultCalendar p').html(tmp_defaultCalendar.displayvalue); // 默认日历的名称
    if (!tmp_defaultCalendar.isShared) {
        // 当前日历不是共享日历，不显示共享日历
        $('.defaultCalendar strong').css('visibility', 'hidden');
    } else {
        $('.defaultCalendar strong').css('visibility', 'visible');
    }

    // ----------------------
    // if ($('.settingMy').find('li').length > 1) {
    //     $('.settingMy').html($('.settingMy').find('.calendarliTemplate').clone().wrap('<li>'));
    // }

    // var cals = globalResourceCalDAVList.collections;
    // for(var i=0; i<cals.length; i++) {
    //     if (cals[i].uid != undefined && !cals[i].isSubscribed) {
    //         // 新增排除他人日历
            
    //         var newCalendar = $('.settingMy').find('.calendarliTemplate').clone().wrap('<li>');
    //         newCalendar.removeClass('calendarliTemplate');
    //         newCalendar.attr('data-id', cals[i].uid);
    //         newCalendar.find('span').css('background', cals[i].ecolor);
    //         newCalendar.find('p').html(cals[i].displayvalue);
    //         if (!cals[i].isShared) {
    //             newCalendar.find('.sharedli').css('visibility', 'hidden');
    //         }
    //         if (cals[i].uid === globalDefaultCalendar.uid) {
    //             newCalendar.find('.Mycho').addClass('active');
    //         }
    //         $('.settingMy').append(newCalendar); 
    //     }
    // }

    // $('.settingMy').find('li').each(function(index, el) {
    //     $(el).click(function(event) {
    //         $('.settingMy').find('.active').removeClass('active');
    //         $(el).find('.Mycho').addClass('active');
    //         var tmp_data_id = $(el).attr("data-id");

    //         $('#ResourceCalDAVList').find('.myListItem.resourceCalDAV_item_selected').removeClass('resourceCalDAV_item_selected');
    //         $('#ResourceCalDAVList').find('.myListItem').each(function(index, el) {
    //             if ($(el).attr("data-id") === tmp_data_id) {
    //                 $(el).addClass('resourceCalDAV_item_selected');
    //             }
    //         });

    //         globalDefaultCalendar = globalResourceCalDAVList.getCollectionByUID(tmp_data_id);
    //         $('.defaultCalendar span').css('background', globalDefaultCalendar.ecolor); // 默认日历的颜色
    //         $('.defaultCalendar p').html(globalDefaultCalendar.displayvalue); // 默认日历的名称
    //         if (!globalDefaultCalendar.isShared) {
    //             // 当前日历不是共享日历，不显示共享日历
    //             $('.defaultCalendar strong').css('visibility', 'hidden');
    //         }
    //         $('.settingMy').css('display', 'none');
    //     });
    // });
    // ----------------------

    // 将联系人列表中自己的部分删除
    // $('#contacts .myContacts li').each(function() {
    //     if (globalUserData[$(this).attr('data-id')].uuid === globalAccountSettings[0].cahref.slice(-37,-1)) {
    //         $(this).remove();
    //     } 
    // });
}

function updateMainLoaderTextTimezone () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func updateMainLoaderTextTimezone");

    $('#MainLoaderInner').html(localization[globalInterfaceLanguage].timezoneChange);
}

function updateMainLoader (needRefresh, type, collUID) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func updateMainLoader");

    if ((type==null && $('.r_operate').length==0) || 
        (type=='vtodo' && $('#ResourceCalDAVTODOList .r_operate').length==0) || 
        (type=='vevent' && $('#ResourceCalDAVList .r_operate').length==0)) {

        var rex = vCalendar.pre['accountUidParts'];
        if (globalCalDAVInitLoad && $('.r_operate').length==0) {
            updateMainLoaderTextFinal();
            var counter = 0;
            for (calendarUID in globalEventList.displayEventsArray) {
                counter++;
            }
            for (calendarUID in globalEventList.displayTodosArray) {
                counter++;
            }

            var beforeScroll = $('#main').width()-$('#calendar').width();
            // var beforeScrollTodo = $('#mainTODO').width()-$('#todoList').width();
            for (calendarUID in globalEventList.displayEventsArray) {
                setTimeout(function (calendarUID) {
                    if (globalSettings.displayhiddenevents.value || globalVisibleCalDAVCollections.indexOf(calendarUID)!=-1) {
                        var bg      = false;
                        var tmpUID  = calendarUID.match(rex);
                        var hrefUID = '';

                        if (tmpUID != null) {
                            hrefUID = tmpUID[4];
                        }

                        var resource   = getResourceByCollection(calendarUID);
                        var collection = globalResourceCalDAVList.getEventCollectionByUID(calendarUID);

                        if (resource!=null && typeof resource.backgroundCalendars!='undefined' && 
                            resource.backgroundCalendars!=null && resource.backgroundCalendars!='') {

                            var rbCalendars = '';
                            if (resource.backgroundCalendars instanceof Array) {
                                rbCalendars = resource.backgroundCalendars;
                            }
                            else {
                                rbCalendars = [resource.backgroundCalendars];
                            }

                            for (var j=0; j<rbCalendars.length; j++) {
                                if (typeof rbCalendars[j] == 'string') {
                                    var index = hrefUID.indexOf(rbCalendars[j]);
                                    if (index != -1) {
                                        if (hrefUID.length == (index+rbCalendars[j].length)) {
                                            bg = true;
                                        }
                                    }
                                }
                                else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null) {
                                    bg = true;
                                }
                            }
                        }
                        if (collection.makeLoaded) {
                            collection.fcSource   = $('#calendar').fullCalendar('addEventSource', 
                                                        {   events:         globalEventList.displayEventsArray[calendarUID],
                                                            backgroundColor:hexToRgba(collection.ecolor, 0.9),
                                                            borderColor:    collection.ecolor,
                                                            textColor:      checkFontColor(collection.ecolor),
                                                            background:     bg});
                            collection.makeLoaded = false;
                        }
                    }
                    counter--;
                    if (counter == 0) {
                        var afterScroll = $('#main').width()-$('#calendar').width();
                        rerenderCalendar (beforeScroll != afterScroll);
                        globalCalDAVQs.cache();
                        // var afterScrollTodo = $('#mainTODO').width()-$('#todoList').width();
                        // rerenderTodo(beforeScrollTodo!=afterScrollTodo);
                        // globalCalDAVTODOQs.cache();
                        $('#calendar').fullCalendar('findToday');
                        globalCalDAVInitLoad = false;
                        // $('#todoList').fullCalendar('allowSelectEvent',true);
                        // $('#todoList').fullCalendar('selectEvent', $('.fc-view-todo .fc-list-day').find('.fc-event:visible:first'));
                        globalCalWidth = $('#main').width();
                        $('#SystemCalDavZAP .fc-header-center ').removeClass('r_operate_all');
                        // showTimezones(globalSessionTimeZone, 'Picker');
                        // showTimezones(globalSessionTimeZone, 'PickerTODO');
                        loadNextApplication (true);
                    }
                }, 10, calendarUID);
            }

            for (calendarUID in globalEventList.displayTodosArray) {
                setTimeout(function (calendarUID) {
                    if (globalSettings.displayhiddenevents.value || globalVisibleCalDAVTODOCollections.indexOf(calendarUID)!=-1) {
                        var collection = globalResourceCalDAVList.getTodoCollectionByUID(calendarUID);
                        if (collection.makeLoaded) {
                            collection.fcSource = $('#todoList').fullCalendar('addEventSource', 
                                                    {   events:          globalEventList.displayTodosArray[calendarUID],
                                                        backgroundColor: hexToRgba(collection.ecolor, 0.9),
                                                        borderColor:     collection.ecolor});
                        }
                    }
                    counter--;
                    if (counter == 0) {
                        var afterScroll = $('#main').width()-$('#calendar').width();
                        rerenderCalendar(beforeScroll!=afterScroll);
                        globalCalDAVQs.cache();
                        // var afterScrollTodo = $('#mainTODO').width()-$('#todoList').width();
                        // rerenderTodo(beforeScrollTodo!=afterScrollTodo);
                        // globalCalDAVTODOQs.cache();
                        $('#calendar').fullCalendar('findToday');
                        globalCalDAVInitLoad = false;
                        // $('#todoList').fullCalendar('allowSelectEvent',true);
                        // $('#todoList').fullCalendar('selectEvent', $('.fc-view-todo .fc-list-day').find('.fc-event:visible:first'));
                        globalCalWidth = $('#main').width();
                        $('#SystemCalDavZAP .fc-header-center ').removeClass('r_operate_all');
                        // showTimezones(globalSessionTimeZone, 'Picker');
                        // showTimezones(globalSessionTimeZone, 'PickerTODO');
                        loadNextApplication(true);
                    }
                }, 10, calendarUID);
            }
        }
        else if (!globalCalDAVInitLoad) {
            if (type==null || type=='vevent') {
                var collection = globalResourceCalDAVList.getEventCollectionByUID(collUID);
                if ((globalSettings.displayhiddenevents.value || globalVisibleCalDAVCollections.indexOf(collUID)!=-1) && 
                    globalLimitLoading=='' && needRefresh && typeof collUID!= 'undefined' && collection!=null && collection.fcSource==null) {

                    var bg      = false;
                    var tmpUID  = collUID.match(rex);
                    var hrefUID = '';

                    if (tmpUID != null) {
                        hrefUID = tmpUID[4];
                    }

                    var resource = getResourceByCollection(collUID);
                    if (resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && 
                        resource.backgroundCalendars!='') {

                        var rbCalendars = '';
                        if (resource.backgroundCalendars instanceof Array) {
                            rbCalendars = resource.backgroundCalendars;
                        }
                        else {
                            rbCalendars = [resource.backgroundCalendars];
                        }
                        for (var j=0; j<rbCalendars.length; j++) {
                            if (typeof rbCalendars[j]=='string') {
                                var index = hrefUID.indexOf(rbCalendars[j]);
                                if (index != -1) {
                                    if (hrefUID.length == (index+rbCalendars[j].length)) {
                                        bg = true;
                                    }
                                }
                            }
                            else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null) {
                                bg = true;
                            }
                        }
                    }
                    collection.fcSource = $('#calendar')
                                            .fullCalendar('addEventSource', 
                                                {   events:          globalEventList.displayEventsArray[collUID], 
                                                    backgroundColor: hexToRgba(collection.ecolor, 0.9), 
                                                    borderColor:     collection.ecolor, 
                                                    textColor:       checkFontColor(collection.ecolor), 
                                                    background:      bg});
                }
                if (needRefresh) {
                    refetchCalendarEvents();
                }
                setTimeout(function () {
                    if (globalLimitLoading!='' && (globalSettings.eventstartpastlimit.value!=null || globalSettings.eventstartfuturelimit.value!=null)) {
                        $('#CalendarLoader').css('display', 'none');
                        globalLimitLoading = '';
                        globalOnlyCalendarNumberCount = 0;
                    }
                    $('#SystemCalDavZAP .fc-header-center ').removeClass('r_operate_all');
                },10);
            }
            if (type==null || type=='vtodo') {
                var collection = globalResourceCalDAVList.getTodoCollectionByUID(collUID);
                if ((   globalSettings.displayhiddenevents.value || 
                        globalVisibleCalDAVTODOCollections.indexOf(collUID)!=-1) && 
                    globalLimitTodoLoading=='' && needRefresh && typeof collUID!= 'undefined' && 
                    collection!=null && collection.fcSource==null) {

                    collection.fcSource = $('#todoList').fullCalendar('addEventSource', 
                                            {   events:          globalEventList.displayTodosArray[collUID],
                                                backgroundColor: hexToRgba(collection.ecolor, 0.9),
                                                borderColor:     collection.ecolor});
                }
                if (needRefresh) {
                    refetchTodoEvents();
                }
                setTimeout(function () {
                    if (globalLimitTodoLoading!='' && globalSettings.todopastlimit.value!=null) {
                        $('#CalendarLoaderTODO').css('display', 'none');
                        globalLimitTodoLoading = '';
                        globalOnlyTodoCalendarNumberCount = 0;
                    }
                },10);
            }
            showTimezones(globalSessionTimeZone, 'Picker');
            showTimezones(globalSessionTimeZone, 'PickerTODO');
            if (globalSettingsSaving!='' && globalLoadedCollectionsCount == globalLoadedCollectionsNumber)
                setTimeout(function () {hideUnloadCollectionCallback(globalSettingsSaving);},300);
        }
    }
}

function checkFontColor (hexColor) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func checkFontColor");

    if ((hexColor!='') && (hexColor!=undefined))
    {
        var color=hexColor;
        var cutHex=((color.charAt(0)=="#") ? color.substring(1, 7) : color);

        var resultColor;
        /*
        var R=parseInt(cutHex.substring(0, 2), 16);
        var G=parseInt(cutHex.substring(2, 4), 16);
        var B=parseInt(cutHex.substring(4, 6), 16);

        var a=1-(0.299*R+0.587*G+0.114*B)/255;
        */
        var a=checkColorBrightness(cutHex);
        if (a<140)
            resultColor='#ffffff'; // dark colors - white font
        else
            resultColor='#404040'; // bright colors - black font

        return resultColor;
    }

    return '#000';
}

function checkfor (data_id) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func checkfor");

    if (typeof vCalendar.tplM['contentline_TRIGGER']!='undefined' && vCalendar.tplM['contentline_TRIGGER']!='' &&
        vCalendar.tplM['contentline_TRIGGER']!=null && vCalendar.tplM['contentline_TRIGGER'].length>0)
            vCalendar.tplM['contentline_TRIGGER'].splice(data_id-1, 1);

    if (typeof vCalendar.tplM['contentline_VANOTE']!='undefined' && vCalendar.tplM['contentline_VANOTE']!='' &&
        vCalendar.tplM['contentline_VANOTE']!=null && vCalendar.tplM['contentline_VANOTE'].length>0)
            vCalendar.tplM['contentline_VANOTE'].splice(data_id-1, 1);

    if (typeof vCalendar.tplM['contentline_ACTION']!='undefined' && vCalendar.tplM['contentline_ACTION']!='' &&
        vCalendar.tplM['contentline_ACTION']!=null && vCalendar.tplM['contentline_ACTION'].length>0)
            vCalendar.tplM['contentline_ACTION'].splice(data_id-1, 1);

    if (typeof vCalendar.tplM['unprocessedVALARM']!='undefined' && vCalendar.tplM['unprocessedVALARM']!='' &&
        vCalendar.tplM['unprocessedVALARM']!=null && vCalendar.tplM['unprocessedVALARM'].length>0)
            vCalendar.tplM['unprocessedVALARM'].splice(data_id-1, 1);
}

function div (op1, op2) {
    // 功能：求出 op1-1 的 op2 分之一的值
    //      （i.e. op1:11，op2:2 =» a-b：5 「二分之一」
    //             op1:13，op2:3 =» a-b：4 「三分之一」）
    // 输入：op1：被等分的数, 
    //      op2：等分值
    // 输出：a-b：第一个等分点的值
    // console.log("③interface_func div");

    var a = (op1 / op2);

    var b = (op1 % op2) / op2;
    return a-b;
}

function binarySearch (array, first, last, value) {
    // 功能：二分查找
    // 输入：array：被查找的对象数组, 
    //      first：查找的起点下标, 
    //      last ：查找的终点下标, 
    //      value：被查找的值
    // 输出：mid ：如果找到了，则是被找到的下标
    // console.log("③interface_func binarySearch");

    var mid = 0;
    value   = value.getTime();

    while (first <= last) {
        mid       = div((first+last), 2);
        var date3 = $.fullCalendar.parseDate(array[mid].sortStart);
        date3     = date3.getTime();

        if (date3 < value) {
            first = mid+1;
        }
        else if (date3 > value) {
            last = mid-1;
        }
        else {
            break;
        }
    }
    return mid;
}

function parseISO8601 (str) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func parseISO8601");

    // we assume str is a UTC date ending in 'Z'
    var err=0;
    if (str.indexOf('T')!=-1)
    {
        var parts=str.split('T');

        if (parts.length>1)
            var dateParts=parts[0].split('-');
        else
            return null;

        if (dateParts.length>1)
            var timeParts=parts[1].split('Z');
        else
            return null;

        var timeSubParts=timeParts[0].split(':');
        if (timeSubParts.length>1)
            var timeSecParts=timeSubParts[2].split('.');
        else
            return null;

        var timeHours=Number(timeSubParts[0]);
        _date=new Date;
        _date.setFullYear(Number(dateParts[0]));
        _date.setMonth(Number(dateParts[1])-1);
        _date.setDate(Number(dateParts[2]));
        _date.setHours(Number(timeHours));
        _date.setMinutes(Number(timeSubParts[1]));
        _date.setSeconds(Number(timeSecParts[0]));
        if (timeSecParts[1])
            _date.setUTCMilliseconds(Number(timeSecParts[1]));

        // by using setUTC methods the date has already been converted to local time(?)
        return _date;
    }
    else
    {
        var dateParts=str.split('-');

        if (dateParts.length!=3)
            return null;

        _date=new Date;
        _date.setFullYear(Number(dateParts[0]));
        _date.setMonth(Number(dateParts[1])-1);
        _date.setDate(Number(dateParts[2]));

        return _date;
    }
}

function getValidRepeatDay (inputDate, RepeatDay) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func getValidRepeatDay");

    var newDate='';
    if (typeof RepeatDay=='string')
        newDate=$.fullCalendar.parseDate(RepeatDay);
    else
        newDate = new Date(RepeatDay.getTime());

    var monthNumber=inputDate.getMonth()+2;
    var dayOfMonth=newDate.getDate();

    if (monthNumber>12)
        monthNumber=1;

    var lastDayInMonth=new Date(inputDate.getFullYear(), monthNumber, 0);
        lastDayInMonth=lastDayInMonth.getDate();

    if (lastDayInMonth<dayOfMonth)
        return lastDayInMonth;
    else
        return dayOfMonth;
}

function loadRepeatEvents (inputRepeatEvent, prevLimit, toLimit) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func loadRepeatEvents");

    var frequency=inputRepeatEvent.frequency;
    var monthPlus=0, dayPlus=0;
    if (frequency=="DAILY\r\n" || frequency=="DAILY")
    {
        monthPlus=0,
        dayPlus=1;
    }
    else if (frequency=="WEEKLY\r\n" || frequency=="WEEKLY")
    {
        monthPlus=0,
        dayPlus=7;
    }
    else if (frequency=="MONTHLY\r\n" || frequency=="MONTHLY")
    {
        monthPlus=1,
        dayPlus=0;
    }
    else if (frequency=="YEARLY\r\n" || frequency=="YEARLY")
    {
        monthPlus=12,
        dayPlus=0;
    }

    var td='', td2='';
    var valOffsetFrom='',intOffset='';
    if (inputRepeatEvent.realStart)
        var varDate=new Date(inputRepeatEvent.realStart.getTime());
    else
        var varDate=new Date(inputRepeatEvent.start.getTime());
    if (inputRepeatEvent.realEnd)
        var varEndDate=new Date(inputRepeatEvent.realEnd.getTime());
    else
        var varEndDate=new Date(inputRepeatEvent.end.getTime());
    var repeatFromLine=new Date(prevLimit.getFullYear(), prevLimit.getMonth(), prevLimit.getDate(), 0, 0, 0);
    var repeatCount=inputRepeatEvent.repeatCount;
    var realRepeatCount=inputRepeatEvent.repeatCount;
    var byMonthDay=inputRepeatEvent.byMonthDay;
    var realStart,realEnd;
    if (inputRepeatEvent.realUntilDate=='')
        untilDate=toLimit;
    else
        untilDate=inputRepeatEvent.realUntilDate;
    if (inputRepeatEvent.realUntil=='')
        if (untilDate<repeatFromLine)
            return;

    if (byMonthDay!='' && dayPlus==0)
        byMonthDay=varDate.getDate()+dayPlus;

    var dayDifference=varEndDate.getTime()-varDate.getTime();
    var iterator=0;
    var ruleString=inputRepeatEvent.vcalendar.match(vCalendar.pre['contentline_RRULE2'])[0].match(vCalendar.pre['contentline_parse'])[4];
    var dates = new Array();
    if (ruleString.indexOf('BYMONTH=')!=-1 || ruleString.indexOf('BYMONTHDAY=')!=-1 || ruleString.indexOf('BYDAY=')!=-1)
    {
        if (inputRepeatEvent.rulePartsArray.length>0)
        {

            if (inputRepeatEvent.lastGenDate!='')
            {
                inputRepeatEvent.lastGenDate = new Date(prevLimit.getTime());
                var objR = processRule (inputRepeatEvent.vcalendar, inputRepeatEvent.lastGenDate, inputRepeatEvent.rulePartsArray.slice(), 
                                        [inputRepeatEvent.lastGenDate], frequencies.indexOf(inputRepeatEvent.frequency), toLimit, 
                                        inputRepeatEvent.interval, inputRepeatEvent.uid, inputRepeatEvent.rCount, inputRepeatEvent.start, 
                                        inputRepeatEvent.wkst, inputRepeatEvent.classType);
            }
            else
                var objR = processRule (inputRepeatEvent.vcalendar, inputRepeatEvent.start, inputRepeatEvent.rulePartsArray.slice(), 
                                        [inputRepeatEvent.start], frequencies.indexOf(inputRepeatEvent.frequency), toLimit, 
                                        inputRepeatEvent.interval, inputRepeatEvent.uid, inputRepeatEvent.rCount, inputRepeatEvent.start, 
                                        inputRepeatEvent.wkst, inputRepeatEvent.classType);

            dates                   = objR.dates;
            inputRepeatEvent.rCount = objR.rCount;
        }
        for (var idt=0;idt<dates.length;idt++)
        {
            varDate=new Date(dates[idt].getTime());
            varEndDate=new Date(varDate.getTime()+dayDifference);
            iterator++;
            if ((varDate.getTime()-repeatFromLine.getTime())<0)
                continue;
            if ((varDate.getTime()-toLimit.getTime())>=0)
                break;
            if (inputRepeatEvent.realUntil=='')
                var count=untilDate-varDate;
            else
                var count = inputRepeatEvent.realUntil - inputRepeatEvent.realRepeatCount;
            if (untilDate&&count<0 || inputRepeatEvent.realUntilDate==''&&count<=0)
                break;
            else
            {
                    if (inputRepeatEvent.frequency=="YEARLY")
                    {
                        if (inputRepeatEvent.lastYear!=varDate.getFullYear())
                        {
                            inputRepeatEvent.lastYear=varDate.getFullYear();
                            if (inputRepeatEvent.lastYear>0 && inputRepeatEvent.rCount%inputRepeatEvent.interval!=0)
                            {
                                inputRepeatEvent.rCount++;
                                continue;
                            }
                            inputRepeatEvent.rCount++;
                        }
                    }
                    realRepeatCount++;
                    inputRepeatEvent.realRepeatCount=realRepeatCount;
                    if (inputRepeatEvent.rec_id_array.length>0)
                    {
                        var checkCont = false;
                        for (var ir=0;ir<inputRepeatEvent.rec_id_array.length;ir++)
                        {
                            var recString = inputRepeatEvent.rec_id_array[ir].split(';')[0];
                            if (recString.charAt(recString.length-1)=='Z')
                            {
                                if (globalSettings.timezonesupport.value && inputRepeatEvent.timeZone in timezones)
                                {
                                    var recValOffsetFrom=getOffsetByTZ(inputRepeatEvent.timeZone, varDate);
                                    var recTime = new Date(recString.parseComnpactISO8601().getTime());
                                    if (recValOffsetFrom)
                                    {
                                        var rintOffset=recValOffsetFrom.getSecondsFromOffset()*1000;
                                        recTime.setTime(recTime.getTime()+rintOffset);
                                    }
                                    if (recTime.toString()+inputRepeatEvent.rec_id_array[ir].split(';')[1] == varDate+inputRepeatEvent.stringUID)
                                        checkCont=true;
                                }
                            }
                            else
                            {
                                if (recString.parseComnpactISO8601().toString()+inputRepeatEvent.rec_id_array[ir].split(';')[1] == varDate+inputRepeatEvent.stringUID)
                                    checkCont=true;
                            }
                        }
                        if (checkCont)
                            continue;
                    }
                    if (!inputRepeatEvent.allDay)
                    {
                        var dateStart, dateEnd;
                        if (inputRepeatEvent.timeZone in timezones)
                            valOffsetFrom=getOffsetByTZ(inputRepeatEvent.timeZone, varDate);

                        realStart=new Date(varDate.getTime());
                        dateStart=new Date(realStart.getTime());
                        if (valOffsetFrom)
                        {
                            intOffset=(getLocalOffset(dateStart)*-1*1000)-valOffsetFrom.getSecondsFromOffset()*1000;
                            dateStart.setTime(dateStart.getTime()+intOffset);
                        }
                        if (inputRepeatEvent.exDates.length>0)
                            if (inputRepeatEvent.exDates.indexOf(dateStart.toString())!=-1)
                                continue;
                        realEnd=new Date(varEndDate.getTime());
                        dateEnd=new Date(realEnd.getTime());
                        if (intOffset)
                            dateEnd.setTime(dateEnd.getTime()+intOffset);
                    }
                    else
                    {
                        realStart=new Date(varDate.getTime());
                        if (inputRepeatEvent.exDates.length>0)
                            if (inputRepeatEvent.exDates.indexOf(realStart.toString())!=-1)
                                continue;
                        var dateStart=$.fullCalendar.formatDate(varDate,"yyyy-MM-dd'T'HH:mm:ss");
                        realEnd=new Date(varEndDate.getTime());
                        var dateEnd=$.fullCalendar.formatDate(varEndDate,"yyyy-MM-dd'T'HH:mm:ss");
                    }

                    if (inputRepeatEvent.alertTime.length>0)
                    {
                        var repeatAlarm='',
                        myVarDate='',
                        alertString='';
                        if (!inputRepeatEvent.collection.ignoreAlarms)
                            for (var v=0;v<inputRepeatEvent.alertTime.length;v++)
                            {
                                if ((inputRepeatEvent.alertTime[v].charAt(0)=='-') || (inputRepeatEvent.alertTime[v].charAt(0)=='+'))
                                {
                                    var startTime;
                                    if (inputRepeatEvent.alertTime[v].charAt(0)=='-')
                                    {
                                        if (typeof dateStart=='string')
                                            startTime = $.fullCalendar.parseDate(dateStart);
                                        else
                                            startTime=new Date(dateStart.getTime());
                                        aTime=startTime.getTime() - parseInt(inputRepeatEvent.alertTime[v].substring(1, inputRepeatEvent.alertTime[v].length-1));
                                    }
                                    else if (inputRepeatEvent.alertTime[v].charAt(0)=='+')
                                    {
                                        if (typeof dateEnd=='string')
                                            startTime = $.fullCalendar.parseDate(dateEnd);
                                        else
                                            startTime=new Date(dateEnd.getTime());
                                        aTime=startTime.getTime() + parseInt(inputRepeatEvent.alertTime[v].substring(1, inputRepeatEvent.alertTime[v].length-1));
                                    }
                                    var now=new Date();

                                    if (aTime>now)
                                    {
                                        var delay=aTime-now;
                                        if (maxAlarmValue<delay)
                                            delay=maxAlarmValue;
                                        inputRepeatEvent.alertTimeOut[inputRepeatEvent.alertTimeOut.length] = setTimeout(function (startTime) {
                                            showAlertEvents (inputRepeatEvent.uid, (aTime-now), 
                                                            {start:new Date(startTime.getTime), 
                                                             allDay:inputRepeatEvent.allDay, 
                                                             title:inputRepeatEvent.title});
                                        }, delay, startTime);
                                    }
                                }
                            }
                    }
                    repeatCount++;
                    inputRepeatEvent.repeatCount=repeatCount;
                    var tmpObj = new items (inputRepeatEvent.etag, dateStart,dateEnd, inputRepeatEvent.title, inputRepeatEvent.allDay, 
                                            inputRepeatEvent.uid, inputRepeatEvent.rid, inputRepeatEvent.evid, inputRepeatEvent.note, 
                                            inputRepeatEvent.displayValue, inputRepeatEvent.alertTime, inputRepeatEvent.alertNote, 
                                            inputRepeatEvent.realUntilDate, inputRepeatEvent.frequency, inputRepeatEvent.interval,
                                            inputRepeatEvent.realUntil, inputRepeatEvent.repeatStart, inputRepeatEvent.repeatEnd, 
                                            byMonthDay, inputRepeatEvent.repeatCount, inputRepeatEvent.realRepeatCount, 
                                            inputRepeatEvent.vcalendar, inputRepeatEvent.location, inputRepeatEvent.alertTimeOut,
                                            inputRepeatEvent.timeZone, realStart, realEnd, inputRepeatEvent.byDay, 
                                            inputRepeatEvent.rec_id, inputRepeatEvent.wkst, inputRepeatEvent.classType,
                                            inputRepeatEvent.avail, inputRepeatEvent.hrefUrl, inputRepeatEvent.compareString,
                                            inputRepeatEvent.priority, inputRepeatEvent.status);

                    globalEventList.displayEventsArray[inputRepeatEvent.rid].splice(globalEventList.displayEventsArray[inputRepeatEvent.rid].length, 0, tmpObj);
                    inputRepeatEvent.lastGenDate = new Date(varDate.getTime());
            }
        }
    }
    else
    {
        while (true)
        {
            var dayNumberStart=varDate.getDate()+dayPlus;
            var dayNumberEnd=varEndDate.getDate()+dayPlus;
            if (dayPlus==0)
            {
                dayNumberStart=getValidRepeatDay(varDate,inputRepeatEvent.start);
                dayNumberEnd=getValidRepeatDay(varEndDate,inputRepeatEvent.end);
            }

            if (varEndDate.getDate()>=dayNumberEnd)
            {
                varEndDate.setDate(dayNumberEnd);
                varEndDate.setMonth(varEndDate.getMonth()+monthPlus);
            }
            else
            {
                varEndDate.setMonth(varEndDate.getMonth()+monthPlus);
                varEndDate.setDate(dayNumberEnd);
            }

            varDate=new Date(varEndDate.getTime()-dayDifference);

            if (byMonthDay!='' && dayPlus==0)
                if (byMonthDay!=dayNumberStart)
                    continue;

            iterator++;

            if ((varDate.getTime()-repeatFromLine.getTime())<0)
                continue;
            if ((varDate.getTime()-toLimit.getTime())>=0)
                break;

            var count=untilDate-varDate;
            if (count<0)
                break;
            else
            {
                if (inputRepeatEvent.byDay.length>0)
                    if (inputRepeatEvent.byDay.indexOf(varDate.getDay().toString())==-1)
                        continue;

                if ((iterator%inputRepeatEvent.interval)==0)
                {
                    realRepeatCount++;
                    inputRepeatEvent.realRepeatCount=realRepeatCount;
                    if (inputRepeatEvent.rec_id_array.length>0)
                    {
                        var checkCont = false;
                        for (var ir=0;ir<inputRepeatEvent.rec_id_array.length;ir++)
                        {
                            var recString = inputRepeatEvent.rec_id_array[ir].split(';')[0];
                            if (recString.charAt(recString.length-1)=='Z')
                            {
                                if (globalSettings.timezonesupport.value && inputRepeatEvent.timeZone in timezones)
                                {
                                    var recValOffsetFrom=getOffsetByTZ(inputRepeatEvent.timeZone, varDate);
                                    var recTime = new Date(recString.parseComnpactISO8601().getTime());
                                    if (recValOffsetFrom)
                                    {
                                        var rintOffset=recValOffsetFrom.getSecondsFromOffset()*1000;
                                        recTime.setTime(recTime.getTime()+rintOffset);
                                    }
                                    if (recTime.toString()+inputRepeatEvent.rec_id_array[ir].split(';')[1] == varDate+inputRepeatEvent.stringUID)
                                        checkCont=true;
                                }
                            }
                            else
                            {
                                if (recString.parseComnpactISO8601().toString()+inputRepeatEvent.rec_id_array[ir].split(';')[1] == varDate+inputRepeatEvent.stringUID)
                                    checkCont=true;
                            }
                        }
                        if (checkCont)
                            continue;
                    }
                    if (!inputRepeatEvent.allDay)
                    {
                        var dateStart, dateEnd;
                        if (inputRepeatEvent.timeZone in timezones)
                            valOffsetFrom=getOffsetByTZ(inputRepeatEvent.timeZone, varDate);

                        realStart=new Date(varDate.getTime());
                        dateStart=new Date(realStart.getTime());
                        if (valOffsetFrom)
                        {
                            intOffset=(getLocalOffset(dateStart)*-1*1000)-valOffsetFrom.getSecondsFromOffset()*1000;
                            dateStart.setTime(dateStart.getTime()+intOffset);
                        }
                        if (inputRepeatEvent.exDates.length>0)
                            if (inputRepeatEvent.exDates.indexOf(dateStart.toString())!=-1)
                                continue;
                        realEnd=new Date(varEndDate.getTime());
                        dateEnd=new Date(realEnd.getTime());
                        if (intOffset)
                            dateEnd.setTime(dateEnd.getTime()+intOffset);
                    }
                    else
                    {
                        realStart=new Date(varDate.getTime());
                        if (inputRepeatEvent.exDates.length>0)
                            if (inputRepeatEvent.exDates.indexOf(realStart.toString())!=-1)
                                continue;
                        var dateStart=$.fullCalendar.formatDate(varDate,"yyyy-MM-dd'T'HH:mm:ss");
                        realEnd=new Date(varEndDate.getTime());
                        var dateEnd=$.fullCalendar.formatDate(varEndDate,"yyyy-MM-dd'T'HH:mm:ss");
                    }

                    if (inputRepeatEvent.alertTime.length>0)
                    {
                        var repeatAlarm='',
                        myVarDate='',
                        alertString='';
                        if (!inputRepeatEvent.collection.ignoreAlarms)
                            for (var v=0;v<inputRepeatEvent.alertTime.length;v++)
                            {
                                if ((inputRepeatEvent.alertTime[v].charAt(0)=='-') || (inputRepeatEvent.alertTime[v].charAt(0)=='+'))
                                {
                                    var startTime;
                                    if (inputRepeatEvent.alertTime[v].charAt(0)=='-')
                                    {
                                        if (typeof dateStart=='string')
                                            startTime = $.fullCalendar.parseDate(dateStart);
                                        else
                                            startTime=new Date(dateStart.getTime());
                                        aTime=startTime.getTime() - parseInt(inputRepeatEvent.alertTime[v].substring(1, inputRepeatEvent.alertTime[v].length-1));
                                    }
                                    else if (inputRepeatEvent.alertTime[v].charAt(0)=='+')
                                    {
                                        if (typeof dateEnd=='string')
                                            startTime = $.fullCalendar.parseDate(dateEnd);
                                        else
                                            startTime=new Date(dateEnd.getTime());
                                        aTime=startTime.getTime() + parseInt(inputRepeatEvent.alertTime[v].substring(1, inputRepeatEvent.alertTime[v].length-1));
                                    }
                                    var now=new Date();

                                    if (aTime>now)
                                    {
                                        var delay=aTime-now;
                                        if (maxAlarmValue<delay)
                                            delay=maxAlarmValue;
                                        inputRepeatEvent.alertTimeOut[inputRepeatEvent.alertTimeOut.length]=setTimeout(function (startTime) {
                                            showAlertEvents (inputRepeatEvent.uid, (aTime-now), 
                                                            {   start:new Date(startTime.getTime()), 
                                                                allDay:inputRepeatEvent.allDay, 
                                                                title:inputRepeatEvent.title});
                                        }, delay,startTime);
                                    }
                                }
                            }
                    }
                    repeatCount++;
                    inputRepeatEvent.repeatCount=repeatCount;
                    var tmpObj = new items(inputRepeatEvent.etag, dateStart,dateEnd, inputRepeatEvent.title, inputRepeatEvent.allDay, 
                                            inputRepeatEvent.uid, inputRepeatEvent.rid, inputRepeatEvent.evid, inputRepeatEvent.note, 
                                            inputRepeatEvent.displayValue, inputRepeatEvent.alertTime, inputRepeatEvent.alertNote, 
                                            inputRepeatEvent.realUntilDate, inputRepeatEvent.frequency, inputRepeatEvent.interval, 
                                            inputRepeatEvent.realUntil, inputRepeatEvent.repeatStart, inputRepeatEvent.repeatEnd,
                                            byMonthDay, inputRepeatEvent.repeatCount, inputRepeatEvent.realRepeatCount, 
                                            inputRepeatEvent.vcalendar, inputRepeatEvent.location, inputRepeatEvent.alertTimeOut, 
                                            inputRepeatEvent.timeZone, realStart, realEnd, inputRepeatEvent.byDay, inputRepeatEvent.rec_id, 
                                            inputRepeatEvent.wkst, inputRepeatEvent.classType, inputRepeatEvent.avail, inputRepeatEvent.hrefUrl, 
                                            inputRepeatEvent.compareString, inputRepeatEvent.priority, inputRepeatEvent.status);

                    globalEventList.displayEventsArray[inputRepeatEvent.rid].splice(globalEventList.displayEventsArray[inputRepeatEvent.rid].length, 0, tmpObj);
                }
            }
        }
    }
}

function getPrevMonths (viewStart) {
    // 功能：获取之前的月份
    // 输入：viewStart：之前月份的起始时间
    // 输出：
    // console.log("③interface_func getPrevMonths");


    if (globalLimitLoading!='future' && globalLimitLoading!='past' && 
        globalSettings.eventstartpastlimit.value!=null && viewStart < globalLoadedLimit) {

        globalLoadedLimit.setMonth(globalLoadedLimit.getMonth() - globalSettings.eventstartpastlimit.value - 1);
        globalOnlyCalendarNumberCount = 0
        $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
        globalLimitLoading = 'past';
        setCalendarNumber (false);
        CalDAVnetLoadCollection (globalResourceCalDAVList.collections[0], true, false, 0, globalResourceCalDAVList.collections);
    }
}

function getNextMonths (viewEnd) {
    // 功能：获取之后的月份
    // 输入：viewEnd：之后月份的结束时间
    // 输出：
    // console.log("③interface_func getNextMonths");

    if (globalLimitLoading!='future' && globalLimitLoading!='past' && viewEnd > globalToLoadedLimit) {
        var limitSet    = (globalSettings.eventstartfuturelimit.value!=null);
        var futureLimit = limitSet ? globalSettings.eventstartfuturelimit.value : 2;
        var prevLimit   = new Date(globalBeginFuture.getTime());
        globalToLoadedLimit.setMonth(globalToLoadedLimit.getMonth()+futureLimit+1);
        var futureDate  = new Date(globalToLoadedLimit.getTime());
        futureDate.setDate(futureDate.getDate()+14);

        if (limitSet) {
            globalOnlyCalendarNumberCount = 0;
            $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
            globalLimitLoading = 'future';
        }

        for (var i=0; i<globalEventList.repeatable.length; i++) {
            loadRepeatEvents (globalEventList.repeatable[i], prevLimit, futureDate);
        }

        if (limitSet) {
            setCalendarNumber(false);
            CalDAVnetLoadCollection (globalResourceCalDAVList.collections[0], true, false, 0, globalResourceCalDAVList.collections);
        }
        else {
            globalBeginFuture = new Date(futureDate.getTime());
        }

        refetchCalendarEvents();
    }
}

function showAlertEvents(inputUID, realDelay, alarmObject) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func showAlertEvents");

    if (maxAlarmValue < realDelay) {
        var delay = realDelay - maxAlarmValue;
        if (maxAlarmValue < delay) {
            setTimeout(function() {
                showAlertEvents(inputUID, delay, alarmObject);
            }, maxAlarmValue);
        }
        else {
            setTimeout(function() {
                showAlertEvents(inputUID, delay, alarmObject);
            }, delay);
        }
        return false;
    }
    var rid = inputUID.substring(0, inputUID.lastIndexOf('/') + 1);

    if (globalSettings.showhiddenalarms.value) {
        hiddenCheck = true;
    }
    else {
        hiddenCheck = false;
    }

    if ((alarmObject != undefined && hiddenCheck) || (alarmObject != undefined && !hiddenCheck && globalVisibleCalDAVCollections.indexOf(rid) != -1)) {
        // $('#alertBox').css('visibility', 'visible');
        // $('#AlertDisabler').fadeIn(globalEditorFadeAnimation)

        var date = $.fullCalendar.parseDate(alarmObject.start);
        var dateString = '';
        var formattedDate = $.datepicker.formatDate(globalSettings.datepickerformat.value, date);
        if (formattedDate != '') {
            dateString += formattedDate;
        }

        var timeString = '';
        if (!alarmObject.allDay) {
            var timeS = $.fullCalendar.formatDate(date, globalSettings.ampmformat.value ? 'h:mm TT{ - h:mm TT}' : 'H:mm{ - H:mm}')
            if (timeS != '') {
                timeString = ' - ' + timeS;
            }
        }

        // $('#alertBoxContent').append("<div class='alert_item'><img src='images/calendarB.svg' alt='Calendar'/><label>" + alarmObject.title + dateString + timeString + "</label></div>");
        AlertWrapper.alertItems.push(
            {
                isShow: true,
                color: globalResourceCalDAVList.getCollectionByUID(rid).ecolor,
                title: alarmObject.title,
                detail: dateString + timeString
            }
        );
    }
}

function clearAlertEvents () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func clearAlertEvents");

    $('#alertBoxContent').html('');
    $('#alertBox').css('visibility', 'hidden');
    $('#AlertDisabler').fadeOut(globalEditorFadeAnimation);
}

function addAndEdit (isFormHidden, deleteMode, attendees) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func addAndEdit");

    var inputUID = '';
    if ($('#uid').val() != '') {
        var coll = globalResourceCalDAVList.getEventCollectionByUID($('#uid').val().substring(0, $('#uid').val().lastIndexOf('/')+1));
    }
    else {
        var coll = globalResourceCalDAVList.getEventCollectionByUID($('#event_calendar').val());
    }
    var res     = getAccount(coll.accountUID);
    var tmp     = res.href.match(vCalendar.pre['hrefRex']);
    var origUID = tmp[1]+res.userAuth.userName+'@'+tmp[2];

    if ($('#etag').val() != '') {
        inputUID = $('#uid').val();
    }
    else if ( $('#event_calendar').val() != 'choose' ) {
        inputUID = $('#event_calendar').val()+'';
    }
    else {
        return false;
    }
    dataToVcalendar('EDIT', origUID, inputUID, $('#etag').val(), '', isFormHidden, deleteMode, attendees);
}

function interResourceEdit (op, delUID,isFormHidden) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func interResourceEdit");

    var inputUID='';
    if ($('#uid').val()!='')
        var coll = globalResourceCalDAVList.getEventCollectionByUID($('#uid').val().substring(0, $('#uid').val().lastIndexOf('/')+1));
    else
        var coll = globalResourceCalDAVList.getEventCollectionByUID($('#event_calendar').val());
    var res = getAccount(coll.accountUID);
    var tmp=res.href.match(vCalendar.pre['hrefRex']);
    var origUID=tmp[1]+res.userAuth.userName+'@'+tmp[2];

    $('#etag').val('');
    var srcUID=$('#uid').val().substring($('#uid').val().lastIndexOf('/')+1, $('#uid').val().length);

    inputUID=$('#event_calendar').val()+srcUID;
    dataToVcalendar(op, origUID, inputUID, '', delUID,isFormHidden);
}

function save (isFormHidden, deleteMode) {
    // 功能：保存函数
    // 输入：isFormHidden, 
    //      deleteMode
    // 输出：
    // console.log("③interface_func save");
    
    $('#eventLoader').show();

    if (!deleteMode) {
        // console.log("into !deleteMode;");

        if ($('#event_details_template').find('img[data-type=invalidSmall]')
            .filter(function () {return this.style.display != 'none'}).length>0 ) {

            show_editor_loader_messageCalendar ('vevent', 'message_error', localization[globalInterfaceLanguage].txtErorInput);
            return false;
        }

        var a  = $.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val());
        var a2 = $.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_to').val());

        var datetime_from = $.fullCalendar.formatDate(a, 'yyyy-MM-dd');
        var datetime_to   = $.fullCalendar.formatDate(a2, 'yyyy-MM-dd');
        var time_from     = '00:00';
        var time_to       = '00:00';

        if (!$('#allday').prop('checked')) {
            if ($('#time_from').val() != '' && $('#time_to').val() != '') {
                time_from = new Date(Date.parse("01/02/1990, " + $('#time_from').val()));
                time_from = $.fullCalendar.formatDate(time_from, 'HH:mm');
                time_to = new Date(Date.parse("01/02/1990, " + $('#time_to').val()));
                time_to = $.fullCalendar.formatDate(time_to, 'HH:mm');
            }
        }


        if ($.fullCalendar.parseDate(datetime_from+'T'+time_from+'Z') > 
            $.fullCalendar.parseDate(datetime_to+'T'+time_to+'Z') ) {

            console.log("$.fullCalendar.parseDate(datetime_from+'T'+time_from+'Z')");
            show_editor_loader_messageCalendar('vevent', 'message_error', localization[globalInterfaceLanguage].txtErrorDates);
            return false;
        }
    }

    var calUID = $('#uid').val().substring(0, $('#uid').val().lastIndexOf('/'));
    var newUID = $('#event_calendar').val().substring(0, $('#event_calendar').val().length-1);

    if ($('#event_calendar').val() != 'choose') {
        if ($('#name').val() == '') {
            $('#name').val(localization[globalInterfaceLanguage].pholderNewEvent);
        }

        if (newUID==calUID || ($('#etag').val()=='' && $('#event_calendar').val()!='choose')) {
            // console.log("newUID==calUID || ($('#etag').val()=='' && $('#event_calen");

            // var attendees = [7,8];   //---attendee test---
            var attendees = [];
            if ($('#addPartnerTxt').attr('data-id')) {
                attendees = $('#addPartnerTxt').attr('data-id').split(',');
            }
            addAndEdit(isFormHidden, deleteMode, attendees);
        }
        // else if (calUID.substring(0, calUID.lastIndexOf('/'))==newUID.substring(0, newUID.lastIndexOf('/')))
        // {
        //  var delUID=$('#uid').val();
        //  interResourceEdit('MOVE_IN',delUID, isFormHidden);
        // }
        else if ($('#etag').val() != '' 
            /* && calUID.substring(0, calUID.lastIndexOf('/'))!=newUID.substring(0, newUID.lastIndexOf('/'))*/ ) {

            console.log("@etag");
            var delUID = $('#uid').val();
            interResourceEdit ('MOVE_OTHER', delUID, isFormHidden);
        }
    }
    else {
        console.log("else");
        $('#eventLoader').hide();
        show_editor_loader_messageCalendar('vevent', 'message_error', localization[globalInterfaceLanguage].txtNotChoose);
    }
}

function deleteEvent () {
    // 功能：调用 deleteVcalendarFromCollection 函数，删除事件
    // 输入：无
    // 输出：无
    // console.log("③interface_func deleteEvent");

    var delUID = $('#uid').val();
    $('#eventLoader').show();

    if (delUID != '') {
        deleteVcalendarFromCollection (delUID, 'vevent');
    }
}

function loadAdditionalCollections (collectionType) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func loadAdditionalCollections");

    if (globalSettingsSaving!='')
        return false;
    globalSettingsSaving=collectionType;
    var inSettings = $.extend({},globalSettings);
    var rex = new RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)');
    var sel = '';
    var key = '';
    if (collectionType=='event')
    {
        key='loadedcalendarcollections';
        inSettings.loadedcalendarcollections = {value:new Array(), locked: globalSettings[key].locked};
        $('#ResourceCalDAVList').find('.unloadCheck').each(function (cin,cel)
        {
            if ($(cel).prop('checked'))
            {
                var uidParts=$(cel).attr('data-id').match(rex);
                inSettings.loadedcalendarcollections.value.splice(inSettings.loadedcalendarcollections.value.length , 0, uidParts[1]+uidParts[3]);
            }

        });
    }
    else if (collectionType=='todo')
    {
        sel='TODO';
        key='loadedtodocollections';
        inSettings.loadedtodocollections = {value : new Array(), locked: globalSettings[key].locked};
        $('#ResourceCalDAVTODOList').find('.unloadCheck').each(function (cin,cel)
        {
            if ($(cel).prop('checked'))
            {
                var uidParts=$(cel).attr('data-id').match(rex);
                inSettings.loadedtodocollections.value.splice(inSettings.loadedtodocollections.value.length , 0, uidParts[1]+uidParts[3]);
            }
        });
    }

    if ($(inSettings[key].value).not(globalSettings[key].value).length > 0 || $(globalSettings[key].value).not(inSettings[key].value).length > 0)
    {
        $('#CalendarLoader'+sel).removeClass('loader_hidden');
        $('#ResourceCalDAV'+sel+'List').find('input[type="checkbox"]').prop('disabled',true);
        var setC=0;
        for (var i=0;i<globalAccountSettings.length;i++)
            if (globalAccountSettings[i].href.indexOf(globalLoginUsername)!=-1 && globalAccountSettings[i].settingsAccount)
            {
                setC++;
                netSaveSettings(globalAccountSettings[i], inSettings, false, true);
                break;
            }
        if (setC==0)
            cancelUnloadedCollections(collectionType);
    }
    else {
        hideUnloadedCollections(collectionType,true);
    }
}

function showUnloadedCollections (collectionType) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func showUnloadedCollections");

    if ((collectionType=='event'&&globalEventCollectionsLoading) || (collectionType=='todo'&&globalTodoCollectionsLoading))
        return false;
    var sel=null;
    var locString='';
    if (collectionType=='event')
    {
        globalEventCollectionsLoading=true;
        sel='';
        locString='txtEnabledCalendars';
    }
    else if (collectionType=='todo')
    {
        globalTodoCollectionsLoading=true;
        sel='TODO';
        locString='txtEnabledTodoLists';
    }
    if (isAvaible('CardDavMATE'))
        $('#showUnloadedAddressbooks').css('display','none');
    if (sel=='TODO')
        $('#showUnloadedCalendars').css('display','none');
    else
        $('#showUnloadedCalendarsTODO').css('display','none');
    $('#ResourceCalDAV'+sel+'List').find('input[type="checkbox"]').prop('disabled',true);
    $('#CalendarLoader'+sel).children('.loaderInfo').text(localization[globalInterfaceLanguage].loadingCollectionList).parent().fadeIn(300);
    var resList = $('#ResourceCalDAV'+sel+'List');
    var resHeader = '.resourceCalDAV'+sel+'_header';
    var resItem = '.resourceCalDAV'+sel+'_item';
    $('#ResourceCalDAV'+sel+'List').find('input[type="checkbox"]').prop('disabled',false);
    $('#CalendarLoader'+sel).children('.loaderInfo').text('').parent().addClass('loader_hidden');
    // resList.find('.resourceCalDAV_item_selected').removeClass('resourceCalDAV_item_selected');
    resList.find('input').css('display','none');

    // header display
    resList.children('.resourceCalDAV'+sel+'_header').each(function () {
        if ($(this).css('display')=='none')
            $(this).addClass('unloaded').css('display','');
        var headerClickElm = $('<input type="checkbox" class="unloadCheckHeader" style="position:absolute;top:3px;right:0px;margin-right:6px;"/>');
        headerClickElm.change(function () {
            loadResourceChBoxClick(this, '#ResourceCalDAV'+sel+'List', resHeader, resItem, resItem);
        });
        $(this).addClass('load_mode').append(headerClickElm);
    });
    
    // caldav_item display
    resList.find('.resourceCalDAV'+sel+'_item').each(function () {
        if (typeof $(this).attr('data-id') != 'undefined')
        {
            var newInputElm = $('<input type="checkbox" class="unloadCheck" data-id="'+$(this).attr('data-id')+'" style="position:absolute;top:8px;right:0px;margin-right:6px;"/>');
            newInputElm.change(function () {
                loadCollectionChBoxClick(this, '#ResourceCalDAV'+sel+'List', resHeader, resItem, resItem);
            });
            $(this).addClass('load_mode').append(newInputElm);
            if ($(this).css('display')=='none')
                $(this).addClass('unloaded');
            else
                newInputElm.prop('checked',true);
            newInputElm.trigger('change');
        }
    });
    $('#showUnloadedCalendars'+sel).css('display','none');
    $('#resourceCalDAV'+sel+'_h').find('.resourceCalDAV'+sel+'_text').text(localization[globalInterfaceLanguage][locString]);
    var origH = resList.find('.resourceCalDAV'+sel+'_header.unloaded').eq(0).css('height');
    var origC = resList.find('.resourceCalDAV'+sel+'_item.unloaded').eq(0).css('height');
    resList.find('.resourceCalDAV'+sel+'_header.unloaded').css({height:0,display:''}).animate({height:origH},300);
    resList.find('.resourceCalDAV'+sel+'_item.unloaded').css({height:0,display:''}).animate({height:origC},300);
    resList.animate({'top':49},300);
}

function cancelUnloadedCollections (collectionType) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func cancelUnloadedCollections");

    var sel=null;
    var loadedCollections=null;
    if (collectionType=='event')
    {
        sel='';
        loadedCollections=globalSettings.loadedcalendarcollections.value;
    }
    else if (collectionType=='todo')
    {
        sel='TODO';
        loadedCollections=globalSettings.loadedtodocollections.value;
    }

    $('#ResourceCalDAV'+sel+'List').children('.resourceCalDAV'+sel+'_item').each(function () {
        var isLoaded=false;
        if (typeof globalCrossServerSettingsURL!='undefined'&&globalCrossServerSettingsURL!=null&globalCrossServerSettingsURL)
        {
            var uidParts=$(this).attr('data-id').match(RegExp('/([^/]+/[^/]+/)$'));
            var tmpParts = uidParts[1].match('^(.*/)([^/]+)/$');
            var checkHref=decodeURIComponent(tmpParts[1])+tmpParts[2]+'/';
            var found=false;
            for (var l=0;l<loadedCollections.length;l++)
            {
                var tmpParts2 = loadedCollections[l].match('^(.*/)([^/]+)/([^/]+)/$');
                var checkHref2=decodeURIComponent(tmpParts2[2])+'/'+tmpParts2[3]+'/';
                if (checkHref==checkHref2)
                {
                    found=true;
                    break;
                }
            }
            isLoaded=found;
        }
        else
        {
            var uidParts=$(this).attr('data-id').match(RegExp('^(https?://)([^@/]+(?:@[^@/]+)?)@(.*)'));
            var checkHref=uidParts[1]+uidParts[3];
            isLoaded=(loadedCollections.indexOf(checkHref)!=-1);
        }

        var unloadCh=$(this).find('.unloadCheck');
        var checked=unloadCh.prop('checked');

        if ((isLoaded && !checked) || (!isLoaded && checked))
            unloadCh.prop('checked',!checked).trigger('change');
    });
    hideUnloadedCollections(collectionType,true);
}

function hideUnloadedCollections (collectionType, withCallback) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func hideUnloadedCollections");

    var sel=null;
    var locString='';
    if (collectionType=='event') {
        sel='';
        locString='txtCalendars';
    }
    else if (collectionType=='todo') {
        sel='TODO';
        locString='txtTodoLists';
    }

    var resList=$('#ResourceCalDAV'+sel+'List');
    resList.find(':input.unloadCheck').remove();
    resList.find(':input.unloadCheckHeader').remove();
    resList.find('.load_mode').removeClass('load_mode');
    resList.find(':input').css('display','');

    $('#resourceCalDAV'+sel+'_h').find('.resourceCalDAV'+sel+'_text').text(localization[globalInterfaceLanguage][locString]);
    resList.find('.resourceCalDAV'+sel+'_header.unloaded').animate({height:0},300).promise().done(function () {
        resList.find('.resourceCalDAV'+sel+'_header.unloaded').css({display:'none',height:''});
    });
    resList.find('.resourceCalDAV'+sel+'_item.unloaded').animate({height:0},300).promise().done(function () {
        resList.find('.resourceCalDAV'+sel+'_item.unloaded').css({display:'none',height:''});
        resList.find('.resourceCalDAV'+sel+'_header').not('.unloaded').each(function () {
            var triggerInput=$(this).nextUntil('.resourceCalDAV'+sel+'_header').filter(':visible').first().find('input[type="checkbox"]');
            collectionChBoxClick(triggerInput.get(0), '#ResourceCalDAV'+sel+'List', '.resourceCalDAV'+sel+'_header', '.resourceCalDAV'+sel+'_item', null, false);
        });
        resList.find('.unloaded').removeClass('unloaded');
        if (collectionType=='event')
            globalEventCollectionsLoading=false;
        else if (collectionType=='todo')
            globalTodoCollectionsLoading=false;
        if (withCallback)
            hideUnloadCollectionCallback(collectionType);
    });
    resList.animate({'top':24},300);
    if (withCallback)
        $('#CalendarLoader'+sel).fadeOut(300,function () {
            $(this).removeClass('loader_hidden');
        });
    if (isAvaible('CardDavMATE'))
        $('#showUnloadedAddressbooks').css('display','block');
    if (sel=='TODO')
        $('#showUnloadedCalendars').css('display','block');
    else
        $('#showUnloadedCalendarsTODO').css('display','block');
}

function hideUnloadCollectionCallback (collectionType) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func hideUnloadCollectionCallback");

    var sel=null;
    if (collectionType == 'event')
        sel='';
    else if (collectionType == 'todo')
        sel='TODO';

    $('#showUnloadedCalendars'+sel).css('display','');
    globalFirstHideLoader=true;
    globalSettingsSaving='';
    // selectActiveCalendar();
    if (collectionType=='event')
    {

        if ($('#ResourceCalDAVList .resourceCalDAV_item:visible').not('.resourceCalDAV_item_ro').length==0)
        {
            $('#eventFormShower').css('display','none');
            // console.log("dnone...");
            $('#calendar').fullCalendar('setOptions',{'selectable':false});
        }
        else
        {
            // console.log("dblock...");
            $('#eventFormShower').css('display','block');
            $('#calendar').fullCalendar('setOptions',{'selectable':true});
        }
    }
    else if (collectionType=='todo')
    {
        if ($('#ResourceCalDAVTODOList .resourceCalDAVTODO_item:visible').not('.resourceCalDAV_item_ro').length==0)
            $('#eventFormShowerTODO').css('display','none');
        else
            $('#eventFormShowerTODO').css('display','block');
    }
    $('#CalendarLoader'+sel).css('display','none');
    $('#ResourceCalDAV'+sel+'List').find('input[type="checkbox"]').prop('disabled',false);
}

function disableAll () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func disableAll");

    var counter = 0;
    $('#ResourceCalDAVList').children(':visible').each(function (i, e) {
        if ($(e).hasClass('resourceCalDAV_item') && $(e).find('input').prop('checked')) {
            counter++;
        }
    });
    if (!counter) {
        return false;
    }

    if (!globalSettings.displayhiddenevents.value) {
        globalResourceRefreshNumber++;
        $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
        var beforeScroll = $('#main').width()-$('#calendar').width();
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('removeEventSources');
        var afterScroll = $('#main').width()-$('#calendar').width();
        rerenderCalendar(beforeScroll!=afterScroll);
    }

    for (var j=0;j<globalResourceCalDAVList.collections.length;j++) {
        if (globalResourceCalDAVList.collections[j].href!=undefined) {
            var uid=globalResourceCalDAVList.collections[j].uid;
            var check=$('#ResourceCalDAVList').find('[name^="'+uid+'"]');
            if (check.prop('checked')) {
                var pos=globalVisibleCalDAVCollections.indexOf(uid);
                if (pos!=-1)
                    globalVisibleCalDAVCollections.splice(pos, 1);
                check.prop('checked', false);
                if (globalSettings.displayhiddenevents.value)
                    hideCalendarEvents(uid);
            }
            collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAV_header', '.resourceCalDAV_item', null, false)
        }
        /*else
        {
            var check=$('#ResourceCalDAVList').children().eq(globalResourceCalDAVList.collections[j].index+1).find('input');
            if (check.prop('checked'))
                check.prop('checked', false);
        }*/
    }

    if (!globalSettings.displayhiddenevents.value) {
        globalResourceRefreshNumber--;
        if (!globalResourceRefreshNumber) {
            $('#CalendarLoader').css('display','none');
        }
    }
}

function enableAll () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func enableAll");

    var counter=0;
    $('#ResourceCalDAVList').children(':visible').each(function (i, e) {
        if ($(e).hasClass('resourceCalDAV_item') && !$(e).find('input').prop('checked'))
            counter++;
    });
    if (!counter)
        return false;

    if (!globalSettings.displayhiddenevents.value)
    {
        globalResourceRefreshNumber++;
        $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
    }

    var beforeScroll = $('#main').width()-$('#calendar').width();
    var rex = vCalendar.pre['accountUidParts'];
    for (var j=0;j<globalResourceCalDAVList.collections.length;j++)
    {
        if (globalResourceCalDAVList.collections[j].href!=undefined)
        {
            var uid=globalResourceCalDAVList.collections[j].uid;
            var check=$('#ResourceCalDAVList').find('[name^="'+uid+'"]');
            if (!check.prop('checked'))
            {
                check.prop('checked', true);
                var pos=globalVisibleCalDAVCollections.indexOf(uid);
                if (pos==-1)
                {
                    globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
                    if (globalSettings.displayhiddenevents.value)
                        showCalendarEvents(uid);
                    else
                    {
                        var bg = false;
                        var tmpUID = uid.match(rex);
                        var hrefUID='';
                        if (tmpUID!=null)
                            hrefUID = tmpUID[4];
                        var resource = getResourceByCollection(uid);
                        if (resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
                        {
                            var rbCalendars = '';
                            if (resource.backgroundCalendars instanceof Array)
                                rbCalendars=resource.backgroundCalendars;
                            else
                                rbCalendars = [resource.backgroundCalendars];
                            for (var k=0; k<rbCalendars.length;k++)
                            {
                                if (typeof rbCalendars[k]=='string')
                                {
                                    var index = hrefUID.indexOf(rbCalendars[k]);
                                    if (index!=-1)
                                        if (hrefUID.length == (index+rbCalendars[k].length))
                                            bg=true;
                                }
                                else if (typeof rbCalendars[k]=='object' && hrefUID.match(rbCalendars[k])!=null)
                                    bg = true;
                            }
                        }
                        var collection = globalResourceCalDAVList.collections[j];
                        collection.fcSource = $('#calendar').fullCalendar('addEventSource', 
                                                                {   events:          globalEventList.displayEventsArray[uid], 
                                                                    backgroundColor: hexToRgba(collection.ecolor, 0.9), 
                                                                    borderColor:     collection.ecolor, 
                                                                    textColor:       checkFontColor(collection.ecolor), 
                                                                    background:      bg});
                    }
                }
            }
            collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAV_header', '.resourceCalDAV_item', null, false)
        }
        /*else
        {
            var check=$('#ResourceCalDAVList').children().eq(globalResourceCalDAVList.collections[j].index+1).find('input');
            if (!check.prop('checked'))
                check.prop('checked', true);
        }*/
    }

    if (!globalSettings.displayhiddenevents.value)
    {
        var afterScroll = $('#main').width()-$('#calendar').width();
        rerenderCalendar(beforeScroll!=afterScroll);
        globalResourceRefreshNumber--;
        if (!globalResourceRefreshNumber)
            $('#CalendarLoader').css('display','none');
    }
}

function disableResource (header) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func disableResource");

    if (!globalSettings.displayhiddenevents.value) {
        globalResourceRefreshNumber++;
        $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
    }

    var beforeScroll = $('#main').width()-$('#calendar').width();
    $(header).nextUntil('.resourceCalDAV_header').each(function (i, e) {
        var uid=$(e).attr('data-id');
        var pos=globalVisibleCalDAVCollections.indexOf(uid);
        if (pos!=-1)
        {
            globalVisibleCalDAVCollections.splice(pos, 1);
            if (globalSettings.displayhiddenevents.value)
                hideCalendarEvents(uid);
            else
                $('#calendar').fullCalendar('removeEventSource', globalResourceCalDAVList.getCollectionByUID(uid).fcSource);
        }
    });

    if (!globalSettings.displayhiddenevents.value)
    {
        var afterScroll = $('#main').width()-$('#calendar').width();
        rerenderCalendar(beforeScroll!=afterScroll);
        globalResourceRefreshNumber--;
        if (!globalResourceRefreshNumber)
            $('#CalendarLoader').css('display','none');
    }
}

function enableResource (header) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func enableResource");

    if (!globalSettings.displayhiddenevents.value)
    {
        globalResourceRefreshNumber++;
        $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
    }

    var beforeScroll = $('#main').width()-$('#calendar').width();
    $(header).nextUntil('.resourceCalDAV_header').each(function (i, e) {
        var uid=$(e).attr('data-id');
        var pos=globalVisibleCalDAVCollections.indexOf(uid);
        if (pos==-1)
        {
            globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
            if (globalSettings.displayhiddenevents.value)
                showCalendarEvents(uid);
            else
            {
                var bg = false;
                var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
                var hrefUID='';
                if (tmpUID!=null)
                    hrefUID = tmpUID[4];
                var resource = getResourceByCollection(uid);
                if (resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
                {
                    var rbCalendars = '';
                    if (resource.backgroundCalendars instanceof Array)
                        rbCalendars=resource.backgroundCalendars;
                    else
                        rbCalendars = [resource.backgroundCalendars];
                    for (var j=0; j<rbCalendars.length;j++)
                    {
                        if (typeof rbCalendars[j]=='string')
                        {
                            var index = hrefUID.indexOf(rbCalendars[j]);
                            if (index!=-1)
                                if (hrefUID.length == (index+rbCalendars[j].length))
                                    bg=true;
                        }
                        else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
                            bg = true;
                    }
                }
                var collection = globalResourceCalDAVList.getCollectionByUID(uid)
                collection.fcSource = $('#calendar')
                                        .fullCalendar('addEventSource', 
                                            {   events:          globalEventList.displayEventsArray[uid], 
                                                backgroundColor: hexToRgba (collection.ecolor, 0.9), 
                                                borderColor:     collection.ecolor, 
                                                textColor:       checkFontColor (collection.ecolor), 
                                                background:      bg});
            }
        }
    });

    if (!globalSettings.displayhiddenevents.value)
    {
        var afterScroll = $('#main').width()-$('#calendar').width();
        rerenderCalendar(beforeScroll!=afterScroll);
        globalResourceRefreshNumber--;
        if (!globalResourceRefreshNumber)
            $('#CalendarLoader').css('display','none');
    }
}

function disableCalendar (uid) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func disableCalendar");

    var pos=globalVisibleCalDAVCollections.indexOf(uid);
    if (pos!=-1)
    {
        globalVisibleCalDAVCollections.splice(pos, 1);
        if (globalSettings.displayhiddenevents.value)
            hideCalendarEvents(uid);
        else
        {
            var beforeScroll = $('#main').width()-$('#calendar').width();
            globalResourceRefreshNumber++;
            $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
            $('#calendar').fullCalendar( 'removeEventSource', globalResourceCalDAVList.getCollectionByUID(uid).fcSource);
            globalResourceRefreshNumber--;

            if (!globalResourceRefreshNumber)
            {
                var afterScroll = $('#main').width()-$('#calendar').width();
                rerenderCalendar(beforeScroll!=afterScroll);
                $('#CalendarLoader').css('display','none');
            }
        }
    }
}

function enableCalendar (uid) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func enableCalendar");

    var pos=globalVisibleCalDAVCollections.indexOf(uid);
    if (pos==-1)
    {
        globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
        if (globalSettings.displayhiddenevents.value)
            showCalendarEvents(uid);
        else
        {
            var beforeScroll = $('#main').width()-$('#calendar').width();
            globalResourceRefreshNumber++;
            $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
            var bg = false;
            var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
            var hrefUID='';
            if (tmpUID!=null)
                hrefUID = tmpUID[4];
            var resource = getResourceByCollection(uid);
            if (resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
            {
                var rbCalendars = '';
                if (resource.backgroundCalendars instanceof Array)
                    rbCalendars=resource.backgroundCalendars;
                else
                    rbCalendars = [resource.backgroundCalendars];
                for (var j=0; j<rbCalendars.length;j++)
                {
                    if (typeof rbCalendars[j]=='string')
                    {
                        var index = hrefUID.indexOf(rbCalendars[j]);
                        if (index!=-1)
                            if (hrefUID.length == (index+rbCalendars[j].length))
                                bg=true;
                    }
                    else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
                        bg = true;
                }
            }
            var collection = globalResourceCalDAVList.getCollectionByUID(uid);
            collection.fcSource = $('#calendar').fullCalendar('addEventSource', 
                                                    {   events:         globalEventList.displayEventsArray[uid],
                                                        backgroundColor:hexToRgba(collection.ecolor, 0.9),
                                                        borderColor:    collection.ecolor,
                                                        textColor:      checkFontColor(collection.ecolor),
                                                        background:     bg});
            globalResourceRefreshNumber--;

            if (!globalResourceRefreshNumber) {
                var afterScroll = $('#main').width()-$('#calendar').width();
                rerenderCalendar(beforeScroll!=afterScroll);
                $('#CalendarLoader').css('display','none');
            }
        }
    }
}

function enableOne (uid) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func enableOne");

    for (var i=0;i<globalResourceCalDAVList.collections.length;i++)
    {
        if (globalResourceCalDAVList.collections[i].href!=undefined)
        {
            var currentUid=globalResourceCalDAVList.collections[i].uid;
            var check=$('#ResourceCalDAVList').find('[name^="'+currentUid+'"]');
            if (currentUid===uid && !check.prop('checked'))
            {
                var pos=globalVisibleCalDAVCollections.indexOf(currentUid);
                if (pos===-1)
                    globalVisibleCalDAVCollections[globalVisibleCalDAVCollections.length]=uid;
                check.prop('checked', true);
            }
            else if (currentUid!==uid && check.prop('checked'))
            {
                var pos=globalVisibleCalDAVCollections.indexOf(currentUid);
                if (pos!==-1)
                    globalVisibleCalDAVCollections.splice(pos, 1);
                check.prop('checked', false);
                if (globalSettings.displayhiddenevents.value)
                    hideCalendarEvents(currentUid);
            }
            collectionChBoxClick(check.get(0), '#'+check.parent().parent().attr('id'), '.resourceCalDAV_header', '.resourceCalDAV_item', null, false)
        }
    }

    if (globalSettings.displayhiddenevents.value)
    {
        showCalendarEvents(uid);
    }
    else
    {
        globalResourceRefreshNumber++;
        $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader).parent().css('display','block');
        var beforeScroll = $('#main').width()-$('#calendar').width();
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('removeEventSources');

        var bg = false;
        var tmpUID = uid.match(vCalendar.pre['accountUidParts']);
        var hrefUID='';
        if (tmpUID!=null)
            hrefUID = tmpUID[4];
        var resource = getResourceByCollection(uid);
        if (resource!=null && typeof resource.backgroundCalendars!='undefined' && resource.backgroundCalendars!=null && resource.backgroundCalendars!='')
        {
            var rbCalendars = '';
            if (resource.backgroundCalendars instanceof Array)
                rbCalendars=resource.backgroundCalendars;
            else
                rbCalendars = [resource.backgroundCalendars];
            for (var j=0; j<rbCalendars.length;j++)
            {
                if (typeof rbCalendars[j]=='string')
                {
                    var index = hrefUID.indexOf(rbCalendars[j]);
                    if (index!=-1)
                        if (hrefUID.length == (index+rbCalendars[j].length))
                            bg=true;
                }
                else if (typeof rbCalendars[j]=='object' && hrefUID.match(rbCalendars[j])!=null)
                    bg = true;
            }
        }
        var collection = globalResourceCalDAVList.getCollectionByUID(uid);
        collection.fcSource = $('#calendar').fullCalendar('addEventSource', 
                                    {   events:         globalEventList.displayEventsArray[uid],
                                        backgroundColor:hexToRgba(collection.ecolor, 0.9),
                                        borderColor:    collection.ecolor,
                                        textColor:      checkFontColor(collection.ecolor),
                                        background:     bg});

        globalResourceRefreshNumber--;
        if (!globalResourceRefreshNumber) {
            var afterScroll = $('#main').width()-$('#calendar').width();
            rerenderCalendar(beforeScroll!=afterScroll);
            $('#CalendarLoader').css('display','none');
        }
    }
}

function getoffsetString (offset) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func getoffsetString");

    if (offset<0)
    {
        offset*=-1;
        offset='-'+(offset<10 ? '0' : '')+offset.toString().split('.')[0]+(offset.toString().split('.').length>1 ? '30' : '00')
    }
    else
        offset='+'+(offset<10 ? '0' : '')+offset.toString().split('.')[0]+(offset.toString().split('.').length>1 ? '30' : '00')

    return offset;
}

Date.prototype.stdTimezoneOffset = function () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func Date.prototype.stdTimezoneOffset");

    var jan=new Date(this.getFullYear(), 0, 1);
    var jul=new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func Date.prototype.dst");

    return this.getTimezoneOffset()<this.stdTimezoneOffset();
}

function setGlobalDatefunction () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func setGlobalDatefunction");

    var date=new Date();
    var offset=date.getTimezoneOffset()*(-1)*60*1000;
}

function initFullCalendar () {
    // 功能：初始化日历，设置各种事件
    // 输入：无
    // 输出：无
    // console.log("③interface_func initFullCalendar");
    
    $('#calendar').fullCalendar({
        eventMode: true,
        contentHeight: $('#main').height(), 
        windowResize: function ( view ) {
            if (globalSettings.displayhiddenevents.value) {
                hideEventCalendars();
            }
            globalCalWidth = $('#main').width();
            if (typeof globalCalDAVInitLoad!='undefined' && !globalCalDAVInitLoad && !globalResourceRefreshNumber) {
                $('#CalendarLoader').css('display','none');
            }
        },
        bindingMode: globalSettings.openformmode.value,
        startOfBusiness: globalSettings.calendarstartofbusiness.value,
        endOfBusiness: globalSettings.calendarendofbusiness.value,
        multiWeekSize: globalMultiWeekSize,
        showWeekNumbers: false,
        showDatepicker: false,
        //ignoreTimezone: !globalSettings.timezonesupport.value,
        titleFormat: {
            month: globalSettings.titleformatmonth.value,
            multiWeek: globalSettings.titleformatweek.value,
            week: globalSettings.titleformatweek.value,
            day: globalSettings.titleformatday.value,
            table: globalSettings.titleformattable.value,
        },
        columnFormat: {
            month: 'ddd',
            multiWeek: 'ddd',
            week: globalSettings.columnformatagenda.value,
            day: globalSettings.columnformatagenda.value,
            table: globalSettings.titleformattable.value,
            // table: globalSettings.columnformatagenda.value,
        },
        timeFormat: {
            agenda:         globalSettings.timeformatagenda.value,
            list:           globalSettings.ampmformat.value ? 'hh:mm TT{ - hh:mm TT}' : 'HH:mm{ - HH:mm}',
            listFull:       dateFormatJqToFc(globalSettings.datepickerformat.value) + 
                                (globalSettings.ampmformat.value ? ' hh:mm TT{ - ' : ' HH:mm{ - ') + 
                                dateFormatJqToFc(globalSettings.datepickerformat.value) + 
                                (globalSettings.ampmformat.value ? ' hh:mm TT}' : ' HH:mm}'),
            listFullAllDay: dateFormatJqToFc(globalSettings.datepickerformat.value) + '{ - ' + 
                                dateFormatJqToFc(globalSettings.datepickerformat.value) + '}',
            '':             globalSettings.timeformatbasic.value
        },
        axisFormat: globalSettings.ampmformat.value ? 'h TT' : 'H',
        // axisFormat: globalSettings.ampmformat.value ? 'h:mm TT' : 'H:mm',  ---@steve---
        buttonText: {
            month: localization[globalInterfaceLanguage].fullCalendarMonth,
            multiWeek: localization[globalInterfaceLanguage].fullCalendarMultiWeek,
            week: localization[globalInterfaceLanguage].fullCalendarAgendaWeek,
            day: localization[globalInterfaceLanguage].fullCalendarAgendaDay,
            table: localization[globalInterfaceLanguage].fullCalendarTable,
            today: localization[globalInterfaceLanguage].fullCalendarTodayButton,
            prevMonth: localization[globalInterfaceLanguage].loadPrevMonth,
            nextMonth: localization[globalInterfaceLanguage].loadNextMonth,
        },
        allDayText: localization[globalInterfaceLanguage].fullCalendarAllDay,
        monthNames: localization[globalInterfaceLanguage].monthNames,
        monthNamesShort: localization[globalInterfaceLanguage].monthNamesShort,
        dayNames: localization[globalInterfaceLanguage].dayNames,
        dayNamesShort: localization[globalInterfaceLanguage].dayNamesShort,
        dayEventSizeStrict: true,

        dayClick: function (date, allDay, jsEvent, view) {
            // console.log("dayclick");
            // if ($('#ResourceCalDAVList .resourceCalDAV_item:visible')
            //      .not('.resourceCalDAV_item_ro').length == 0) {

            //  return false;
            // }
            if ($('#ResourceCalDAVList .myListItem:visible').not('.resourceCalDAV_item_ro').length == 0) {
                return false;
            }

            $('#show').val('');
            $('#CAEvent').hide();
            $('#timezonePicker').prop('disabled', true);
            $('#EventDisabler').fadeIn(globalEditorFadeAnimation, function () {
                showEventForm (date, allDay, null, jsEvent, 'new', '');
                $('#name').focus();
            });
        },
        beforeViewDisplay: function (view) {
            // Hide scrollbar to force view rendering on full width
            if (globalAllowFcRerender) {
                $('#main').css('overflow','hidden');
            }
        },
        viewDisplay: function (view) {
            // Allow scrollbar if previosly hidden
            if (globalAllowFcRerender) {
                $('#main').css('overflow','');
            }
            // If scrollbar present, force view rendering on reduced width
            if (globalAllowFcRerender && $('#main').width() - $('#calendar').width()) {
                globalAllowFcRerender = false;
                $('#calendar').fullCalendar('render');
                return false;
            }

            globalCalWidth = $('#main').width();
            if (globalSettings.displayhiddenevents.value) {
                hideEventCalendars();
            }
            globalAllowFcRerender = true;
        },
        firstDay: globalSettings.datepickerfirstdayofweek.value,
        weekendDays: globalSettings.weekenddays.value,
        header: {
            /*
            left: 'prev,next today',
            center: 'title',
            right: 'month,multiWeek,agendaWeek,agendaDay'
            */
            left: 'today',
            center: 'prev,title,next',
            right: 'agendaDay,agendaWeek,month'
        },
        listSections: 'day',
        headerContainer: $('#main_h_placeholder'),
        defaultView: globalSettings.activeview.value,
        editable: true,
        currentTimeIndicator: true,
        unselectAuto: false,
        eventClick: function (calEvent, jsEvent, view) {
            // console.log("eventclick the calEvent is ",calEvent);
            globalCalEvent = calEvent;
            // globalJsEvent=jsEvent;
        },
        eventDBClick: function (calEvent, jsEvent, view) {
            globalCalEvent = calEvent;
            globalJsEvent  = jsEvent;
            // console.log("eventDBclick the calEvent is ",calEvent);
            if (calEvent.type == '') {
                showEventForm (null, calEvent.allDay, calEvent, jsEvent, 'show', '');
            }
            else {
                   showEventForm(null, calEvent.allDay, calEvent, jsEvent, 'show', '', true);
                // showEventForm (null, calEvent.allDay, calEvent, jsEvent, 'show', 'editOnly');
            }            
        },
        eventDragStart: function (calEvent, jsEvent, ui, view) {
            globalPrevDragEventAllDay = calEvent.allDay;
        },
        eventDrop: function (calEvent, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {  
            if (calEvent.rid != '') {
                var coll = globalResourceCalDAVList.getCollectionByUID(calEvent.res_id);
                if (coll!=null && coll.permissions.read_only) {
                    // 恢复原状
                    revertFunc();
                    return false;
                }
            }

            if (calEvent.isInvitation && !calEvent.isOrganizer) {
                    // 恢复原状
                    revertFunc();
                    return false;                
            }

            if (calEvent.realStart && calEvent.realEnd) {
                var checkDate    = new Date (calEvent.realStart.getFullYear(), calEvent.realStart.getMonth(), 
                                             calEvent.realStart.getDate() + dayDelta, calEvent.realStart.getHours(), 
                                             calEvent.realStart.getMinutes() + minuteDelta,0);
                var checkDateEnd = new Date (calEvent.realEnd.getFullYear(),   calEvent.realEnd.getMonth(),   
                                             calEvent.realEnd.getDate() + dayDelta,   calEvent.realEnd.getHours(),   
                                             calEvent.realEnd.getMinutes() + minuteDelta,0);
                if (calEvent.type != '') {
                    calEvent.start = checkDate;
                    calEvent.end   = checkDateEnd;
                }
                else {
                    calEvent.realStart = checkDate;
                    calEvent.realEnd   = checkDateEnd;
                }
            }
            else {
                calEvent.realStart = calEvent.start;
                calEvent.realEnd   = calEvent.end;
            }

            globalRevertFunction = revertFunc;
            if (calEvent.type != '') {
                globalCalEvent = calEvent;
                globalJsEvent  = jsEvent;
                 showEventForm (null, calEvent.allDay, calEvent, jsEvent, 'drop', 'editOnly');
            }
            else {
                showEventForm (null, calEvent.allDay, calEvent, jsEvent, 'drop', '');
            }

            save (true);
            globalPrevDragEvent = null;
            $('#EventDisabler').css('display', 'none');
        },
        eventResize: function (calEvent, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
            globalPrevDragEventAllDay = calEvent.allDay;
            if (calEvent.rid != '') {
                var coll = globalResourceCalDAVList.getCollectionByUID(calEvent.res_id);
                if (coll!=null && coll.permissions.read_only) {
                    revertFunc();
                    return false;
                }
            }

            if (calEvent.realStart && calEvent.realEnd) {
                var checkDateEnd = new Date (calEvent.realEnd.getFullYear(), calEvent.realEnd.getMonth(), 
                                             calEvent.realEnd.getDate() + dayDelta, calEvent.realEnd.getHours(), 
                                             calEvent.realEnd.getMinutes() + minuteDelta,0);
                if (calEvent.type != '') {
                    calEvent.end = checkDateEnd;
                }
                else {
                    calEvent.realEnd = checkDateEnd;
                }
            }
            else {
                calEvent.realEnd = calEvent.end;
            }
            globalRevertFunction = revertFunc;

            if (calEvent.type != '') {
                globalCalEvent = calEvent;
                globalJsEvent  = jsEvent;
                showEventForm (null, calEvent.allDay, calEvent, jsEvent, 'drop', 'editOnly');
            }
            else {
                showEventForm (null, calEvent.allDay, calEvent, jsEvent, 'drop', '');
            }
            save(true);
        },
        eventResizeHelperCreated: function (calEvent, jsEvent, element, helper, view) {
            if (element.hasClass('searchCalDAV_hide')) {
                helper.addClass('searchCalDAV_hide');
            }
            if (element.hasClass('checkCalDAV_hide')) {
                helper.addClass('checkCalDAV_hide');
            }
        },
        selectable: true,
        selectHelper: false,
        select: function (startDate, endDate, allDay, jsEvent, view) {
            $('#show').val('');
            $('#CAEvent').hide();
            $('#timezonePicker').prop('disabled', true);
            $('#EventDisabler').fadeIn(globalEditorFadeAnimation, function () {
                var calEvent    = new Object();
                calEvent.start  = startDate;
                calEvent.end    = endDate;
                showEventForm (null, allDay, calEvent, jsEvent, 'new', '');
                $('#name').focus();
            });
        },
        eventAfterRender: function (event, element, view) {
            element.attr('data-res-id',event.res_id);
            element.attr('data-id',event.id);
            element.addClass('event_item');

            if (event.status == 'CANCELLED') {
                $(element).find('.fc-event-title').css('text-decoration', 'line-through');
            }

            if (typeof event.hidden!='undefined' && event.hidden) {
                element.addClass('searchCalDAV_hide');
                if (view.name=='table' && !$(element).siblings().addBack().not('.searchCalDAV_hide').length) {
                    $(element).parent().prev().find('tr').addClass('searchCalDAV_hide');
                }
            }

            // element.mouseenter (function (e) {
            //     clearTimeout(globalEventTimeoutID);
            //     globalEventTimeoutID = setTimeout(function () {
            //         showEventPopup (e, event);
            //     }, 500);
            // });
            // element.mousemove (function (e) {
            //     if ($('#CalDavZAPPopup').is(':visible')) {
            //         moveEventPopup (e);
            //     }
            // });
            // element.mouseout(function (e) {
            //     if (!$.contains(element.get(0),e.relatedTarget)) {
            //         clearTimeout(globalEventTimeoutID);
            //         hideEventPopup();
            //     }
            // });
        },
        viewChanged: function (view) {
            $('#CAEvent').hide();
        },
        todayClick: function () {
            $('#CAEvent').hide();
        },
        prevClick: function () {
            $('#CAEvent').hide();
            getPrevMonths($('#calendar').fullCalendar('getView').start);
        },
        nextClick: function () {
            $('#CAEvent').hide();
            getNextMonths($('#calendar').fullCalendar('getView').end);
        }
    });
}

function setFirstDayEvent (setDay) {
    // 功能：
    // 输入：setDay：
    // 输出：
    // console.log("③interface_func setFirstDayEvent");

    var firstDay                = typeof setDay!='undefined' ? setDay : globalSettings.datepickerfirstdayofweek.value;
    var eventWeekDayCells       = $('#week_custom .customTable td');
    var eventWeekDayContainer   = eventWeekDayCells.parent();
    var eventMonthDayOptions    = $('#repeat_month_custom_select2 option');
    var eventYearDayOptions     = $('#repeat_year_custom_select2 option');

    for (i=firstDay; i<7; i++) {
        eventWeekDayContainer.append(eventWeekDayCells.filter('[data-type="'+i+'"]').detach());
        eventMonthDayOptions.filter('[data-type="'+i+'"]').detach()
                            .insertBefore(eventMonthDayOptions.filter('[data-type="month_custom_month"]'));
        eventYearDayOptions.filter('[data-type="'+i+'"]').detach()
                            .insertBefore(eventYearDayOptions.filter('[data-type="year_custom_month"]'));
    }

    for (i=0; i<firstDay; i++) {
        eventWeekDayContainer.append(eventWeekDayCells.filter('[data-type="'+i+'"]').detach());
        eventMonthDayOptions.filter('[data-type="'+i+'"]').detach()
                            .insertBefore(eventMonthDayOptions.filter('[data-type="month_custom_month"]'));
        eventYearDayOptions.filter('[data-type="'+i+'"]').detach()
                            .insertBefore(eventYearDayOptions.filter('[data-type="year_custom_month"]'));
    }

    eventWeekDayCells.removeClass('firstCol lastCol');
    eventWeekDayCells.filter('[data-type="'+firstDay+'"]').addClass('firstCol');
    eventWeekDayCells.filter('[data-type="'+(firstDay+6)%7+'"]').addClass('lastCol');
}

function checkEventFormScrollBar () {
    // 功能：
    // 输入：无
    // 输出：
    // console.log("③interface_func checkEventFormScrollBar");

    if ($('#eventDetailsContainer').is(':hidden')) {
        return false;
    }

    var baseWidth   = 403;
    var scrollWidth = ($('#event_details_template').width() - $('#eventDetailsContainer').width());
    $('#event_details_template').width(baseWidth + scrollWidth);
    // $('#eventColor').height($('#eventDetailsContainer').height()+12);
}

function initTimepicker (ampm) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func initTimepicker");

    timelist=new Array();
    if (!ampm)
    {
        globalTimePre=new RegExp('^ *((([0-1]?[0-9]|2[0-3]):[0-5]?[0-9])|(([0-1][0-9]|2[0-3])[0-5][0-9])) *$','i');
        // 24 hour format time strings for the autocomplete functionality
        for (var i=0;i<24;i++)
            for (var j=0;j<minelems.length;j++)
                timelist.push(i.pad(2)+':'+minelems[j].pad(2));
    }
    else
    {
        globalTimePre=new RegExp('^ *((((0?[1-9]|1[0-2]):[0-5]?[0-9])|((0[1-9]|1[0-2])[0-5][0-9])) *AM|(((0?[1-9]|1[0-2]):[0-5]?[0-9])|((0[1-9]|1[0-2])[0-5][0-9])) *PM) *$','i');
        // 12 hour format time strings for the autocomplete functionality
        for (var i=0;i<24;i++)
            for (var j=0;j<minelems.length;j++)
                timelist.push((i==0 ? 12 : (i<13 ? i : i-12)).pad(2)+':'+minelems[j].pad(2)+(i<12 ? ' AM' : ' PM'));
    }
}

function showEventPrevNav () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func showEventPrevNav");

    $('#CAEvent .formNav.prev').click(function () {
        eventPrevNavClick();
    });

    $('#CAEvent .header').addClass('leftspace');
    $('#CAEvent .formNav.prev').css('display', 'block');
}

function showEventNextNav () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func showEventNextNav");

    $('#CAEvent .formNav.next').click(function () {
        eventNextNavClick();
    });
    $('#CAEvent .header').addClass('rightspace');
    $('#CAEvent .formNav.next').css('display', 'block');
}

function eventPrevNavClick () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func eventPrevNavClick");

    var eventsSorted=jQuery.grep(globalEventList.displayEventsArray[globalCalEvent.res_id],function (e) {if (e.id==globalCalEvent.id)return true}).sort(repeatStartCompare);

    if (eventsSorted.indexOf(globalCalEvent)!=-1)
    {
        if (eventsSorted.indexOf(globalCalEvent)>0)
        {
            globalCalEvent=eventsSorted[eventsSorted.indexOf(globalCalEvent)-1];
            showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', 'editOnly');
        }
    }
}

function eventNextNavClick () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func eventNextNavClick");

    var eventsSorted=jQuery.grep(globalEventList.displayEventsArray[globalCalEvent.res_id],function (e) {if (e.id==globalCalEvent.id)return true}).sort(repeatStartCompare);

    if (eventsSorted.indexOf(globalCalEvent)!=-1)
    {
        if (eventsSorted.indexOf(globalCalEvent)<(eventsSorted.length-1))
        {
            globalCalEvent=eventsSorted[eventsSorted.indexOf(globalCalEvent)+1];
            showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', 'editOnly');
        }
    }
}

function translateEventAlerts () {
    // 功能：将事件提醒中的各处文档进行语言转换
    // 输入：无
    // 输出：无
    // console.log("③interface_func translateEventAlerts");

    $('[data-type="alert"]').text(localization[globalInterfaceLanguage].txtAlert);
    $('.alert').find('[data-type="alert_none"]').text(localization[globalInterfaceLanguage].txtAlertNone);
    $('.alert').find('[data-type="alert_message"]').text(localization[globalInterfaceLanguage].txtAlertMessage);
    $('[data-type="PH_before_after_alert"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAfterBeforeVal);
    $('[data-type="PH_alarm_date"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAlarmDate);
    $('[data-type="PH_alarm_time"]').attr('placeholder',localization[globalInterfaceLanguage].pholderAlarmTime);
    $('.alert_details').find('[data-type="on_date"]').text(localization[globalInterfaceLanguage].txtAlertOnDate);
    $('.alert_details').find('[data-type="weeks_before"]').text(localization[globalInterfaceLanguage].txtAlertWeeksBefore);
    $('.alert_details').find('[data-type="days_before"]').text(localization[globalInterfaceLanguage].txtAlertDaysBefore);
    $('.alert_details').find('[data-type="hours_before"]').text(localization[globalInterfaceLanguage].txtAlertHoursBefore);
    $('.alert_details').find('[data-type="minutes_before"]').text(localization[globalInterfaceLanguage].txtAlertMinutesBefore);
    $('.alert_details').find('[data-type="seconds_before"]').text(localization[globalInterfaceLanguage].txtAlertSecondsBefore);
    $('.alert_details').find('[data-type="weeks_after"]').text(localization[globalInterfaceLanguage].txtAlertWeeksAfter);
    $('.alert_details').find('[data-type="days_after"]').text(localization[globalInterfaceLanguage].txtAlertDaysAfter);
    $('.alert_details').find('[data-type="hours_after"]').text(localization[globalInterfaceLanguage].txtAlertHoursAfter);
    $('.alert_details').find('[data-type="minutes_after"]').text(localization[globalInterfaceLanguage].txtAlertMinutesAfter);
    $('.alert_details').find('[data-type="seconds_after"]').text(localization[globalInterfaceLanguage].txtAlertSecondsAfter);
}

function translate () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func translate");

    // DATEPICKER
        $.datepicker.regional[globalInterfaceLanguage] = {
            monthNames: localization[globalInterfaceLanguage].monthNames,
            monthNamesShort: localization[globalInterfaceLanguage].monthNamesShort,
            dayNames: localization[globalInterfaceLanguage].dayNames,
            dayNamesShort: localization[globalInterfaceLanguage].dayNamesShort,
            dayNamesMin: localization[globalInterfaceLanguage].dayNamesMin};
        $.datepicker.setDefaults($.datepicker.regional[globalInterfaceLanguage]);
    // INTERFACE
        //$('[data-type="system_logo"]').attr('alt',localization[globalInterfaceLanguage].altLogo);
        $('[data-type="system_username"]').attr('placeholder',localization[globalInterfaceLanguage].pholderUsername);
        $('[data-type="system_password"]').attr('placeholder',localization[globalInterfaceLanguage].pholderPassword);
        $('[data-type="system_login"]').attr({'title':localization[globalInterfaceLanguage].buttonLogin, 
                                              'alt':localization[globalInterfaceLanguage].buttonLogin});
        $('.resourceCalDAV_text[data-type="resourcesCalDAV_txt"]').text(localization[globalInterfaceLanguage].txtCalendars);
        $('[data-type="choose_calendar_TODO"]').text(localization[globalInterfaceLanguage].txtSelectCalendarTODO);
        $('[data-type="todo_txt"]').text(localization[globalInterfaceLanguage].txtTodo);
        $('#eventFormShower').attr('alt',localization[globalInterfaceLanguage].altAddEvent);
        $('#showUnloadedCalendars').attr({title:capitalize(localization[globalInterfaceLanguage].txtEnabledCalendars), 
                                          alt:capitalize(localization[globalInterfaceLanguage].txtEnabledCalendars)});
        $('#showUnloadedCalendarsTODO').attr({title:capitalize(localization[globalInterfaceLanguage].txtEnabledTodoLists), 
                                          alt:capitalize(localization[globalInterfaceLanguage].txtEnabledTodoLists)});
        $('#loadUnloadedCalendars, #loadUnloadedCalendarsTODO').val(localization[globalInterfaceLanguage].buttonSave);
        $('#loadUnloadedCalendarsCancel, #loadUnloadedCalendarsTODOCancel').val(localization[globalInterfaceLanguage].buttonCancel);
    // TODOS
        $('.resourceCalDAVTODO_text[data-type="resourcesCalDAV_txt"]').text(localization[globalInterfaceLanguage].txtTodoLists);
        $('[data-type="name_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNameTODO);
        $('[data-type="type_TODO"]').text(localization[globalInterfaceLanguage].txtTypeTODO);
        $('[data-type="todo_type_none"]').text(localization[globalInterfaceLanguage].txtTypeTODONone);
        $('[data-type="todo_type_start"]').text(localization[globalInterfaceLanguage].txtTypeTODOStart);
        $('[data-type="todo_type_due"]').text(localization[globalInterfaceLanguage].txtTypeTODODue);
        $('[data-type="todo_type_both"]').text(localization[globalInterfaceLanguage].txtTypeTODOBoth);
        $('[data-type="date_from_TODO"]').text(localization[globalInterfaceLanguage].txtDateFromTODO);
        $('[data-type="date_to_TODO"]').text(localization[globalInterfaceLanguage].txtDateToTODO);
        $('[data-type="PH_completedOn"]').text(localization[globalInterfaceLanguage].txtCompletedOn);
        $('[data-type="PH_date_from_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateFromTODO);
        $('[data-type="PH_time_from_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeFromTODO);
        $('[data-type="PH_date_to_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateToTODO);
        $('[data-type="PH_time_to_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeToTODO);
        $('[data-type="PH_completedOnDate"]').attr('placeholder',localization[globalInterfaceLanguage].pholderCompletedOnDate);
        $('[data-type="PH_completedOnTime"]').attr('placeholder',localization[globalInterfaceLanguage].pholderCompletedOnTime);
        $('[data-type="status_TODO"]').text(localization[globalInterfaceLanguage].txtStatus);
        $('[data-type="STATUS_NEEDS-ACTION_TODO"]').text(localization[globalInterfaceLanguage].txtStatusNeedsActionTODO);
        $('[data-type="STATUS_COMPLETED_TODO"]').text(localization[globalInterfaceLanguage].txtStatusCompletedTODO);
        $('[data-type="STATUS_IN-PROCESS_TODO"]').text(localization[globalInterfaceLanguage].txtStatusInProcessTODO);
        $('[data-type="STATUS_CANCELLED_TODO"]').text(localization[globalInterfaceLanguage].txtStatusCancelledTODO);
        $('[data-type="percent_complete_TODO"]').text(localization[globalInterfaceLanguage].txtPercentCompletedTODO);
        $('[data-type="priority_TODO"]').text(localization[globalInterfaceLanguage].txtPriority);
        $('[data-type="priority_TODO_none"]').text(localization[globalInterfaceLanguage].txtPriorityNone);
        $('[data-type="priority_TODO_low"]').text(localization[globalInterfaceLanguage].txtPriorityLow);
        $('[data-type="priority_TODO_medium"]').text(localization[globalInterfaceLanguage].txtPriorityMedium);
        $('[data-type="priority_TODO_high"]').text(localization[globalInterfaceLanguage].txtPriorityHigh);
        $('[data-type="calendar_TODO"]').text(localization[globalInterfaceLanguage].txtTodoList);
        $('[data-type="note_TODO"]').text(localization[globalInterfaceLanguage].txtNoteTODO);
        $('[data-type="PH_note_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNoteTODO);
        $('[data-type="txt_availTODO"]').text(localization[globalInterfaceLanguage].eventAvailability);
        $('[data-type="BUSY_AVAIL_TODO"]').text(localization[globalInterfaceLanguage].eventAvailabilityBusy);
        $('[data-type="FREE_AVAIL_TODO"]').text(localization[globalInterfaceLanguage].eventAvailabilityFree);
        $('[data-type="txt_typeTODO"]').text(localization[globalInterfaceLanguage].eventType);
        $('[data-type="PUBLIC_TYPE_TODO"]').text(localization[globalInterfaceLanguage].eventTypePublic);
        $('[data-type="PRIVATE_TYPE_TODO"]').text(localization[globalInterfaceLanguage].eventTypePrivate);
        $('[data-type="CONFIDENTIAL_TYPE_TODO"]').text(localization[globalInterfaceLanguage].eventTypeConfidential);
        $('[data-type="txt_url_TODO"]').text(localization[globalInterfaceLanguage].eventURL);
        $('[data-type="url_TODO"]').attr('placeholder',localization[globalInterfaceLanguage].eventURL);
        $('[data-type="todo_prev_nav"]').attr('title',localization[globalInterfaceLanguage].todoPrevNav);
        $('[data-type="todo_next_nav"]').attr('title',localization[globalInterfaceLanguage].todoNextNav);
        $('[data-type="todo_prev_uncompleted_nav"]').attr('title',localization[globalInterfaceLanguage].todoUncompletedPrevNav);
        $('[data-type="todo_next_uncompleted_nav"]').attr('title',localization[globalInterfaceLanguage].todoUncompletedNextNav);
        $("#saveTODO").val(localization[globalInterfaceLanguage].buttonSaveTODO);
        $("#editTODO").val(localization[globalInterfaceLanguage].buttonEditTODO);
        $("#duplicateTODO").val(localization[globalInterfaceLanguage].buttonDuplicate);
        $("#resetTODO").val(localization[globalInterfaceLanguage].buttonResetTODO);
        $("#closeTODO").val(localization[globalInterfaceLanguage].buttonCloseTODO);
        $("#deleteTODO").val(localization[globalInterfaceLanguage].buttonDeleteTODO);
    // EVENTS
        $('[data-type="name"]').attr('placeholder',localization[globalInterfaceLanguage].pholderName);
        $('[data-type="location"]').text(localization[globalInterfaceLanguage].txtLocation);
        $('[data-type="PH_location"]').attr('placeholder',localization[globalInterfaceLanguage].pholderLocation);
        $('[data-type="all_day"]').text(localization[globalInterfaceLanguage].txtAllDay);
        $('[data-type="from"]').text(localization[globalInterfaceLanguage].from);
        $('[data-type="to"]').text(localization[globalInterfaceLanguage].to);
        $('[data-type="PH_date_from"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateFrom);
        $('[data-type="PH_time_from"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeFrom);
        $('[data-type="PH_date_to"]').attr('placeholder',localization[globalInterfaceLanguage].pholderDateTo);
        $('[data-type="PH_time_to"]').attr('placeholder',localization[globalInterfaceLanguage].pholderTimeTo);
        $('[data-type="repeat"]').text(localization[globalInterfaceLanguage].txtRepeat);
        $('[data-type="PH_until_date"]').attr('placeholder',localization[globalInterfaceLanguage].pholderUntilDate);
        $('[data-type="PH_repeat_count"]').attr('placeholder',localization[globalInterfaceLanguage].pholderRepeatCount);
        $('[data-type="repeat_end"]').text(localization[globalInterfaceLanguage].txtRepeatEnd);
        $('[data-type="show_as"]').text(localization[globalInterfaceLanguage].txtShowAs);
        $('[data-type="priority"]').text(localization[globalInterfaceLanguage].txtPriority);
        $('[data-type="priority_none"]').text(localization[globalInterfaceLanguage].txtPriorityNone);
        $('[data-type="priority_low"]').text(localization[globalInterfaceLanguage].txtPriorityLow);
        $('[data-type="priority_medium"]').text(localization[globalInterfaceLanguage].txtPriorityMedium);
        $('[data-type="priority_high"]').text(localization[globalInterfaceLanguage].txtPriorityHigh);
        $('[data-type="event_calendar"]').text(localization[globalInterfaceLanguage].txtEventCalendar);
        $('[data-type="choose_calendar"]').text(localization[globalInterfaceLanguage].txtSelectCalendar);
        $('[data-type="note"]').text(localization[globalInterfaceLanguage].txtNote);
        $('[data-type="PH_note"]').attr('placeholder',localization[globalInterfaceLanguage].pholderNote);
        $('[data-type="status"]').text(localization[globalInterfaceLanguage].txtStatus);
        $('[data-type="STATUS_NONE"]').text(localization[globalInterfaceLanguage].txtStatusNone);
        $('[data-type="STATUS_TENTATIVE"]').text(localization[globalInterfaceLanguage].txtStatusTentative);
        $('[data-type="STATUS_CONFIRMED"]').text(localization[globalInterfaceLanguage].txtStatusConfirmed);
        $('[data-type="STATUS_CANCELLED"]').text(localization[globalInterfaceLanguage].txtStatusCancelled);
        $('[data-type="txt_avail"]').text(localization[globalInterfaceLanguage].eventAvailability);
        $('[data-type="BUSY_AVAIL"]').text(localization[globalInterfaceLanguage].eventAvailabilityBusy);
        $('[data-type="FREE_AVAIL"]').text(localization[globalInterfaceLanguage].eventAvailabilityFree);
        $('[data-type="txt_type"]').text(localization[globalInterfaceLanguage].eventType);
        $('[data-type="PUBLIC_TYPE"]').text(localization[globalInterfaceLanguage].eventTypePublic);
        $('[data-type="PRIVATE_TYPE"]').text(localization[globalInterfaceLanguage].eventTypePrivate);
        $('[data-type="CONFIDENTIAL_TYPE"]').text(localization[globalInterfaceLanguage].eventTypeConfidential);
        $('[data-type="txt_url_EVENT"]').text(localization[globalInterfaceLanguage].eventURL);
        $('[data-type="url_EVENT"]').attr('placeholder',localization[globalInterfaceLanguage].eventURL);
        $('[data-type="repeat_no-repeat"]').text(localization[globalInterfaceLanguage].txtNoRepeat);
        $('[data-type="repeat_DAILY"]').text(localization[globalInterfaceLanguage].txtRepeatDay);
        $('[data-type="repeat_WEEKLY"]').text(localization[globalInterfaceLanguage].txtRepeatWeek);
        $('[data-type="repeat_WEEKEND"]').text(localization[globalInterfaceLanguage].txtRepeatWeekend);
        $('[data-type="repeat_MONTHLY"]').text(localization[globalInterfaceLanguage].txtRepeatMonth);
        $('[data-type="repeat_TWO_WEEKLY"]').text(localization[globalInterfaceLanguage].txtRepeatTwoWeek);
        $('[data-type="repeat_YEARLY"]').text(localization[globalInterfaceLanguage].txtRepeatYear);
        $('[data-type="repeat_CUSTOM_WEEKLY"]').text(localization[globalInterfaceLanguage].txtRepeatCustomWeek);
        $('[data-type="repeat_CUSTOM_MONTHLY"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonth);
        $('[data-type="repeat_CUSTOM_YEARLY"]').text(localization[globalInterfaceLanguage].txtRepeatCustomYear);
        $('[data-type="repeat_BUSINESS"]').text(localization[globalInterfaceLanguage].txtRepeatWork);
        $('[data-type="week_custom_txt"]').text(localization[globalInterfaceLanguage].txtRepeatCustomWeekLabel);
        $('[data-type="month_custom2_txt"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthLabel);
        $('[data-type="month_custom_every"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthEvery);
        $('[data-type="month_custom_first"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFirst);
        $('[data-type="month_custom_second"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthSecond);
        $('[data-type="month_custom_third"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthThird);
        $('[data-type="month_custom_fourth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFourth);
        $('[data-type="month_custom_fifth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFifth);
        $('[data-type="month_custom_last"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthLast);
        $('[data-type="month_custom_custom"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthCustom);
        $('[data-type="month_custom_month"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthMonth);

        $('[data-type="year_custom1"]').text(localization[globalInterfaceLanguage].txtRepeatCustomYearLabel1);
        $('[data-type="year_custom3"]').text(localization[globalInterfaceLanguage].txtRepeatCustomYearLabel2);
        $('[data-type="year_custom_every"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthEvery);
        $('[data-type="year_custom_first"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFirst);
        $('[data-type="year_custom_second"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthSecond);
        $('[data-type="year_custom_third"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthThird);
        $('[data-type="year_custom_fourth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFourth);
        $('[data-type="year_custom_fifth"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthFifth);
        $('[data-type="year_custom_last"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthLast);
        $('[data-type="year_custom_custom"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthCustom);
        $('[data-type="year_custom_month"]').text(localization[globalInterfaceLanguage].txtRepeatCustomMonthMonth);

        for (i=0; i<12; i++)
        {
            $('#year_custom3 .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].monthNamesShort[i]);
            $('#year_custom3_TODO .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].monthNamesShort[i]);
        }

        for (i=0; i<7; i++)
        {
            $('#repeat_month_custom_select2 option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
            $('#repeat_month_custom_select2_TODO option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
            $('#repeat_year_custom_select2 option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
            $('#repeat_year_custom_select2_TODO option[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNames[i]);
        }

        for (i=0; i<7; i++)
        {
            $('#week_custom .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNamesMin[i]);
            $('#week_custom_TODO .customTable td[data-type="'+i+'"]').text(localization[globalInterfaceLanguage].dayNamesMin[i]);
        }

        $('[data-type="repeat_details_on_date"]').text(localization[globalInterfaceLanguage].txtRepeatOnDate);
        $('[data-type="repeat_details_after"]').text(localization[globalInterfaceLanguage].txtRepeatAfter);
        $('[data-type="repeat_details_never"]').text(localization[globalInterfaceLanguage].txtRepeatNever);
        $('[data-type="event_prev_nav"]').attr('title',localization[globalInterfaceLanguage].eventPrevNav);
        $('[data-type="event_next_nav"]').attr('title',localization[globalInterfaceLanguage].eventNextNav);
        $("#saveButton").val(localization[globalInterfaceLanguage].buttonSave);
        $("#editButton").val(localization[globalInterfaceLanguage].buttonEdit);
        $("#duplicateButton").val(localization[globalInterfaceLanguage].buttonDuplicate);
        // $("#resetButton").val(localization[globalInterfaceLanguage].buttonReset);
        $("#closeButton").val(localization[globalInterfaceLanguage].buttonClose);
        $("#deleteButton").val(localization[globalInterfaceLanguage].buttonDelete);
        $('#alertsH').text(localization[globalInterfaceLanguage].txtAlertsH);
        $("#alertButton").val(localization[globalInterfaceLanguage].buttonAlert);
        $('[data-type="PH_CalDAVsearch"]').attr('placeholder',localization[globalInterfaceLanguage].CalDAVsearch);

        $('[data-type="addAll"]').attr('title',localization[globalInterfaceLanguage].allEnable);
        $('[data-type="addAll"]').attr('alt',localization[globalInterfaceLanguage].allEnable);
        $('[data-type="removeAll"]').attr('title',localization[globalInterfaceLanguage].allDisable);
        $('[data-type="removeAll"]').attr('alt',localization[globalInterfaceLanguage].allDisable);
        $('[data-type="txt_timezone"]').text(localization[globalInterfaceLanguage].timezone);
        $('[data-type="txt_timezonePicker"]').text(localization[globalInterfaceLanguage].txtTimezonePicker);
        $('[data-type="txt_timezoneTODO"]').text(localization[globalInterfaceLanguage].timezone);
        $('#CalendarLoader').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader);
        $('#CalendarLoaderTODO').children('.loaderInfo').text(localization[globalInterfaceLanguage].calendarLoader);
        $('[data-type="repeat_event"]').text(localization[globalInterfaceLanguage].repeatBoxButton);
        $('[data-type="editOptions"]').attr('value',localization[globalInterfaceLanguage].repeatBoxButton);
        $('[data-type="editOptionsTODO"]').attr('value',localization[globalInterfaceLanguage].repeatBoxButton);
        $('#editAll').val(localization[globalInterfaceLanguage].allEvsButton);
        $('#editFuture').val(localization[globalInterfaceLanguage].allFutureButton);
        $('#editOnlyOne').val(localization[globalInterfaceLanguage].eventOnlyButton);
        $('#editAllTODO').val(localization[globalInterfaceLanguage].allEvsButtonTODO);
        $('#editFutureTODO').val(localization[globalInterfaceLanguage].allFutureButtonTODO);
        $('#editOnlyOneTODO').val(localization[globalInterfaceLanguage].eventOnlyButtonTODO);
        $('[data-type="closeRepeat"]').val(localization[globalInterfaceLanguage].buttonClose);
        $('[data-type="repeat_type"]').text(localization[globalInterfaceLanguage].repeatInterval);

        $('#CalDavZAPPopup').find('[data-type="location_txt"]').text(localization[globalInterfaceLanguage].txtLocation);
        $('#CalDavZAPPopup').find('[data-type="from_txt"]').text(localization[globalInterfaceLanguage].from);
        $('#CalDavZAPPopup').find('[data-type="to_txt"]').text(localization[globalInterfaceLanguage].to);
        $('#CalDavZAPPopup').find('[data-type="status_txt"]').text(localization[globalInterfaceLanguage].txtStatus);
        $('#CalDavZAPPopup').find('[data-type="avail_txt"]').text(localization[globalInterfaceLanguage].eventAvailability);
        $('#CalDavZAPPopup').find('[data-type="type_txt"]').text(localization[globalInterfaceLanguage].eventType);
        $('#CalDavZAPPopup').find('[data-type="priority_txt"]').text(localization[globalInterfaceLanguage].txtPriority);
        $('#CalDavZAPPopup').find('[data-type="calendar_txt"]').text(localization[globalInterfaceLanguage].txtEventCalendar);
        $('#CalDavZAPPopup').find('[data-type="url_txt"]').text(localization[globalInterfaceLanguage].eventURL);
        $('#CalDavZAPPopup').find('[data-type="note_txt"]').text(localization[globalInterfaceLanguage].txtNote);

        translateEventAlerts();
}

function selectActiveCalendar ()　{
    // 功能：将被选择的日历添加新class resourceCalDAV_item_selected
    // 输入：无
    // 输出：无
    // console.log("③interface_func selectActiveCalendar");

    var todoString = "";
    if (!globalEventCollectionsLoading && globalSettingsSaving!='event') {
        $('#ResourceCalDAVList').find('.resourceCalDAV_item_selected').removeClass('resourceCalDAV_item_selected');
        for (var i=0; i<globalResourceCalDAVList.collections.length; i++)
            if (globalResourceCalDAVList.collections[i].uid != undefined) {
                var inputResource = globalResourceCalDAVList.collections[i];
                var par           = inputResource.uid.split('/');
                // set todo calendar as selected
                
                if (globalSettings.calendarselected.value != '') {
                    if ((par[par.length-3]+'/'+par[par.length-2]+'/') == globalSettings.calendarselected.value) {
                        if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0) {

                            $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]')
                                .addClass('resourceCalDAV_item_selected');
                        }
                    }
                    else if (inputResource.uid == globalSettings.calendarselected.value)　{
                        if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0) {
                            $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]')
                                .addClass('resourceCalDAV_item_selected');
                        }
                    }
                    else if (typeof globalSettings.calendarselected.value=='object' && inputResource.uid.match(globalSettings.calendarselected.value)!=null)　{
                        if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0) {
                            $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]')
                                .addClass('resourceCalDAV_item_selected');
                        }
                    }
                }
            }

        if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
            for (var i=0; i<globalResourceCalDAVList.collections.length; i++)
                if (globalResourceCalDAVList.collections[i].uid != undefined)　{
                    var inputResource = globalResourceCalDAVList.collections[i];
                    var par=inputResource.uid.split('/');
                    if (typeof globalCalendarSelected!='undefined' && globalCalendarSelected!=null && globalCalendarSelected!='')　{
                        globalSettings.calendarselected.value = globalCalendarSelected;
                        if ((par[par.length-3]+'/'+par[par.length-2]+'/') == globalSettings.calendarselected.value)　{
                            if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0) {
                                $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]')
                                    .addClass('resourceCalDAV_item_selected');
                            }
                        }
                        else if (inputResource.uid == globalSettings.calendarselected.value)　{
                            if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0) {
                                $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]')
                                    .addClass('resourceCalDAV_item_selected');
                            }
                        }
                        else if (typeof globalSettings.calendarselected.value == 'object' && 
                            inputResource.uid.match(globalSettings.calendarselected.value) != null)　{

                            if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0) {
                                $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item:visible[data-id^="'+inputResource.uid+'"]')
                                    .addClass('resourceCalDAV_item_selected');
                            }
                        }
                    }
                }

        if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0  && 
            $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item[data-id]:visible').length > 0)　{

            var ui_d    = $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item[data-id]:visible').eq(0).attr('data-id');
            var part_u  = ui_d.split('/');
            globalSettings.calendarselected.value = part_u[part_u.length-3]+'/'+part_u[part_u.length-2]+'/';
            $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item[data-id]:visible').eq(0).addClass('resourceCalDAV_item_selected');
        }
    }

    /*todoString = "TODO";
    if (!globalTodoCollectionsLoading && globalSettingsSaving!='todo')　{
        $('#ResourceCalDAVTODOList').find('.resourceCalDAV_item_selected').removeClass('resourceCalDAV_item_selected');
        for (var i=0; i<globalResourceCalDAVList.TodoCollections.length;i++)
            if (globalResourceCalDAVList.TodoCollections[i].uid!=undefined)　{
                var inputResource = globalResourceCalDAVList.TodoCollections[i];
                var par=inputResource.uid.split('/');
                // set todo calendar as selected
                if (globalSettings.todocalendarselected.value!='')　{

                    if ((par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.todocalendarselected.value)　{
                        if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
                            $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
                    }
                    else if (inputResource.uid==globalSettings.todocalendarselected.value)　{
                        if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
                            $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
                    }
                    else if (typeof globalSettings.todocalendarselected.value=='object' && inputResource.uid.match(globalSettings.todocalendarselected.value)!=null)　{
                        if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
                            $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]').addClass('resourceCalDAV_item_selected');
                    }
                }
            }

        if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0)
            for (var i=0; i<globalResourceCalDAVList.TodoCollections.length;i++)
                if (globalResourceCalDAVList.TodoCollections[i].uid!=undefined)　{
                    var inputResource = globalResourceCalDAVList.TodoCollections[i];
                    var par=inputResource.uid.split('/');
                    if (typeof globalTodoCalendarSelected!='undefined' && globalTodoCalendarSelected!=null && globalTodoCalendarSelected!='')　{
                        globalSettings.todocalendarselected.value=globalTodoCalendarSelected;
                        if ((par[par.length-3]+'/'+par[par.length-2]+'/')==globalSettings.todocalendarselected.value)　{
                            if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0) {
                                $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]')
                                    .addClass('resourceCalDAV_item_selected');
                            }
                        }
                        else if (inputResource.uid==globalSettings.todocalendarselected.value)　{
                            if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0) {
                                $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]')
                                    .addClass('resourceCalDAV_item_selected');
                            }
                        }
                        else if (typeof globalSettings.todocalendarselected.value=='object' && 
                            inputResource.uid.match(globalSettings.todocalendarselected.value)!=null)　{

                            if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0) {
                                $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item:visible[data-id^="'+inputResource.uid+'"]')
                                    .addClass('resourceCalDAV_item_selected');
                            }
                        }
                    }
                }

        if ($('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAV_item_selected:visible').length == 0 && 
            $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item[data-id]:visible').length > 0)　{

            var ui_d = $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item[data-id]:visible').eq(0).attr('data-id');
            var part_u = ui_d.split('/');
            globalSettings.todocalendarselected.value=part_u[part_u.length-3]+'/'+part_u[part_u.length-2]+'/';
            $('#ResourceCalDAV'+todoString+'List').find('.resourceCalDAVTODO_item[data-id]:visible').eq(0).addClass('resourceCalDAV_item_selected');
        }
    }*/
}

function hideCalendarEvents (uid) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func hideCalendarEvents");

    $('#SystemCalDavZAP').find('.event_item[data-res-id="'+uid+'"]').each(function () {
        $(this).addClass('checkCalDAV_hide');
        if (this.tagName.toLowerCase()=='tr')
        {
            if ($(this).siblings().addBack().not('.checkCalDAV_hide').length>0)
                $(this).parent().prev().find('tr').removeClass('checkCalDAV_hide');
            else
                $(this).parent().prev().find('tr').addClass('checkCalDAV_hide');
        }
    });
}

function showCalendarEvents (uid) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func showCalendarEvents");

    $('#SystemCalDavZAP').find('.event_item[data-res-id="'+uid+'"]').each(function () {
        $(this).removeClass('checkCalDAV_hide');
        if (this.tagName.toLowerCase() == 'tr')
            $(this).parent().prev().find('tr').removeClass('checkCalDAV_hide');
    });
}

function hideEventCalendars () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func hideEventCalendars");

    for (var k=1;k<globalResourceCalDAVList.collections.length;k++)
    {
        var uid=globalResourceCalDAVList.collections[k].uid;
        if (uid!=undefined && globalVisibleCalDAVCollections.indexOf(uid)==-1)
            hideCalendarEvents(uid);
    }
}

function rerenderCalendar (scrollChanged) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func rerenderCalendar");

    if (scrollChanged)
        $('#calendar').fullCalendar('render');
    if (globalSettings.displayhiddenevents.value)
        hideEventCalendars();
}

function refetchCalendarEvents () {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func refetchCalendarEvents");

    var beforeScroll = $('#main').width()-$('#calendar').width();
    $('#calendar').fullCalendar('refetchEvents');
    var afterScroll = $('#main').width()-$('#calendar').width();
    rerenderCalendar(beforeScroll!=afterScroll);
    globalCalDAVQs.cache();
}

function initCalDavDatepicker (element) {
    // 功能：
    // 输入：element
    // 输出：
    // console.log("③interface_func initCalDavDatepicker");

    var datepickers = element.find('.date');
    datepickers.focus(function () {
        if (!$(this).hasClass('hasDatepicker')) {
            $(this).datepicker({
                disabled: $(this).prop('readonly') || $(this).prop('disabled'),
                showMonthAfterYear: false,
                prevText: '',
                nextText: '',
                monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                dateFormat: globalSettings.datepickerformat.value, defaultDate: null, minDate: '-120y', maxDate: '+120y', yearRange: 'c-120:c+120', showAnim: '',
                firstDay: globalSettings.datepickerfirstdayofweek.value,
                weekendDays: globalSettings.weekenddays.value,
                beforeShow: function (input, inst) {
                    // set the datepicker value if the date is out of range (min/max)
                    inst.dpDiv.addClass('ui-datepicker-simple');

                    var valid = true;
                    try {var currentDate = $.datepicker.parseDate(globalSettings.datepickerformat.value, $(this).val())}
                    catch (e) {valid = false}

                    if (valid==true && currentDate!=null) {
                        var minDateText = $(this).datepicker('option', 'dateFormat', 
                                            globalSettings.datepickerformat.value).datepicker('option', 'minDate');
                        var maxDateText = $(this).datepicker('option', 'dateFormat', 
                                            globalSettings.datepickerformat.value).datepicker('option', 'maxDate');
                        var minDate     = $.datepicker.parseDate(globalSettings.datepickerformat.value, minDateText);
                        var maxDate     = $.datepicker.parseDate(globalSettings.datepickerformat.value, maxDateText);

                        if (currentDate < minDate) {
                            $(this).val(minDateText);
                        }
                        else if (currentDate > maxDate) {
                            $(this).val(maxDateText);
                        }
                    }

                    // Timepicker hack (prevent IE to re-open the datepicker on date click+focus)
                    var index = $(this).attr("data-type");
                    var d     = new Date();

                    if (globalTmpTimePickerHackTime[index]!=undefined && 
                        d.getTime()-globalTmpTimePickerHackTime[index]<200) {

                        return false;
                    }
                },
                onClose: function (dateText, inst) {
                    // set the datepicker value if the date is out of range (min/max) 
                    // and reset the value to proper format 
                    // (for example 'yy-mm-dd' allows '2000-1-1' -> we need to reset the value to '2000-01-01')

                    var valid = true;
                    try {var currentDate = $.datepicker.parseDate(globalSettings.datepickerformat.value, dateText)}
                    catch (e) {valid = false}

                    if (valid==true && currentDate!=null) {
                        var minDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'minDate');
                        var maxDateText=$(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'maxDate');

                        var minDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, minDateText);
                        var maxDate=$.datepicker.parseDate(globalSettings.datepickerformat.value, maxDateText);

                        if (currentDate<minDate)
                            $(this).val(minDateText);
                        else if (currentDate>maxDate)
                            $(this).val(maxDateText);
                        else
                            $(this).val($.datepicker.formatDate(globalSettings.datepickerformat.value, currentDate));
                    }

                    // Timepicker hack (prevent IE to re-open the datepicker on date click+focus)
                    var index=$(this).attr("data-type");
                    var d=new Date();
                    globalTmpTimePickerHackTime[index]=d.getTime();
                    $(this).focus();
                }
            });

            $(this).mousedown(function () {
                if ($(this).datepicker('widget').css('display')=='none')
                    $(this).datepicker('show');
                else
                    $(this).datepicker('hide');
            });

            $(this).on('keydown', function (event) {
                // show datepicker on keydown (up/down/left/right) but only if it not causes cursor position move
                if (this.selectionStart!=undefined && this.selectionStart!=-1)
                    if (((event.which==38 || event.which==37) && this.selectionStart==0) || 
                        ((event.which==40 || event.which==39) && this.selectionStart==$(this).val().length)) {

                        if ($(this).datepicker('widget').css('display') == 'none') {
                            $(this).datepicker('show');
                        }
                        else {
                            $(this).datepicker('hide');
                        }
                    }
            });

            $(this).blur(function (event) {
                // handle onblur event because datepicker can be already closed
                // note: because onblur is called more than once we can handle it only if there is a value change!
                var valid = true;
                try {var currentDate = $.datepicker.parseDate(globalSettings.datepickerformat.value, $(this).val())}
                catch (e) {valid = false}

                if ($(this).val() == '') {
                    valid = false;
                }

                if (valid==true && $(this).val()!=$.datepicker.formatDate(globalSettings.datepickerformat.value, currentDate)) {
                    var minDateText = $(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'minDate');
                    var maxDateText = $(this).datepicker('option', 'dateFormat', globalSettings.datepickerformat.value).datepicker('option', 'maxDate');

                    var minDate = $.datepicker.parseDate(globalSettings.datepickerformat.value, minDateText);
                    var maxDate = $.datepicker.parseDate(globalSettings.datepickerformat.value, maxDateText);

                    if (currentDate < minDate) {
                        $(this).val(minDateText);
                    }
                    else if (currentDate>maxDate) {
                        $(this).val(maxDateText);
                    }
                    else {
                        $(this).val($.datepicker.formatDate(globalSettings.datepickerformat.value, currentDate));
                    }
                }

                if ($(this).attr('id') == 'date_from') {
                    var tmptime = $('#time_from').val();
                    var validD = true, prevDate = '';
                    if (globalPrevDate != '') {
                        prevDate = new Date(globalPrevDate.getTime());
                    }
                    try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val())}
                    catch (e) {validD=false}

                    if ($('#date_from').val()!='' && tmptime.match(globalTimePre)!=null && validD) {
                        var dateFrom    = $.datepicker.parseDate (globalSettings.datepickerformat.value, $('#date_from').val());
                        var datetime_to = $.fullCalendar.formatDate (dateFrom, 'yyyy-MM-dd');
                        var aDate       = new Date(Date.parse("01/02/1990, "+$('#time_from').val()));
                        var time_from   = $.fullCalendar.formatDate (aDate, 'HH:mm:ss');
                        var checkD      = $.fullCalendar.parseDate (datetime_to+'T'+time_from);
                        globalPrevDate  = new Date(checkD.getTime());
                    }
                    else {
                        globalPrevDate = '';
                    }

                    if ($(this).attr('id')=='date_from' && prevDate!='' && globalPrevDate!='') {
                        globalPrevDate.setSeconds(0);
                        globalPrevDate.setMilliseconds(0);
                        prevDate.setSeconds(0);
                        prevDate.setMilliseconds(0);
                        var diffDate = globalPrevDate.getTime() - prevDate.getTime();

                        try {$.datepicker.parseDate (globalSettings.datepickerformat.value, $('#date_to').val())}
                        catch (e) {validD = false}

                        if ($('#date_to').val()!='' && $('#time_to').val().match(globalTimePre)!=null && validD) {
                            var dateTo           = $.datepicker.parseDate (globalSettings.datepickerformat.value, $('#date_to').val());
                            var datetime_to      = $.fullCalendar.formatDate (dateTo, 'yyyy-MM-dd');
                            var aDateT           = new Date(Date.parse("01/02/1990, "+$('#time_to').val()));
                            var time_to          = $.fullCalendar.formatDate (aDateT, 'HH:mm:ss');
                            var checkDT          = $.fullCalendar.parseDate(datetime_to+'T'+time_to);
                            var toDate           = new Date(checkDT.getTime() + diffDate);
                            var formattedDate_to = $.datepicker.formatDate (globalSettings.datepickerformat.value, toDate);

                            $('#date_to').val(formattedDate_to);
                            $('#time_to').val($.fullCalendar.formatDate (toDate, 
                                        (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
                        }
                    }
                }
                else if ($('#todo_type').val()=='both' && $(this).attr('id')=='date_fromTODO') {
                    var tmptime = $('#time_fromTODO').val();
                    var validD = true, prevDate = '';

                    if (globalPrevDate != '') {
                        prevDate = new Date(globalPrevDate.getTime());
                    }

                    try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_fromTODO').val())}
                    catch (e) {validD = false}

                    if ($('#date_fromTODO').val()!='' && tmptime.match(globalTimePre)!=null && validD) {
                        var dateFrom    = $.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_fromTODO').val());
                        var datetime_to = $.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
                        var aDate       = new Date(Date.parse("01/02/1990, "+$('#time_fromTODO').val()));
                        var time_from   = $.fullCalendar.formatDate(aDate, 'HH:mm:ss');
                        var checkD      = $.fullCalendar.parseDate(datetime_to+'T'+time_from);
                        globalPrevDate  = new Date(checkD.getTime());
                    }
                    else {
                        globalPrevDate = '';
                    }

                    if ($(this).attr('id')=='date_fromTODO' && prevDate!='' && globalPrevDate!='') {
                        globalPrevDate.setSeconds(0);
                        globalPrevDate.setMilliseconds(0);
                        prevDate.setSeconds(0);
                        prevDate.setMilliseconds(0);
                        var diffDate  = globalPrevDate.getTime() - prevDate.getTime();

                        try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_toTODO').val())}
                        catch (e) {validD=false}

                        if ($('#date_toTODO').val()!='' && $('#time_toTODO').val().match(globalTimePre)!=null && validD) {
                            var dateTo           = $.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_toTODO').val());
                            var datetime_to      = $.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
                            var aDateT           = new Date(Date.parse("01/02/1990, "+$('#time_toTODO').val()));
                            var time_to          = $.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
                            var checkDT          = $.fullCalendar.parseDate(datetime_to+'T'+time_to);
                            var toDate           = new Date(checkDT.getTime() + diffDate);
                            var formattedDate_to = $.datepicker.formatDate(globalSettings.datepickerformat.value, toDate);

                            $('#date_toTODO').val(formattedDate_to);
                            $('#time_toTODO').val($.fullCalendar.formatDate(toDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
                        }
                    }
                }
            });

            $(this).bind('keyup change', function () {
                if (!$(this).prop('readonly') && !$(this).prop('disabled')) {
                    var valid = false;

                    if ($(this).val() != '') {
                        valid = true;
                        try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $(this).val())}
                        catch (e) {valid = false}
                    }

                    if ($(this).attr('id') == 'completedOnDate') {
                        if ($(this).val() == '') {
                            if ($('#completedOnTime').val() == '') {
                                valid = true;
                                $('#completedOnTime').parent().find('img').css('display', 'none');
                            }
                            else {
                                valid = false;
                            }
                        }
                        else {
                            if (valid) {
                                if ($('#completedOnTime').val() == '') {
                                    $('#completedOnTime').parent().find('img').css('display', 'inline');
                                }
                                else {
                                    $('#completedOnTime').parent().find('img').css('display', 'none');
                                }
                            }
                        }
                    }

                    if (valid) {
                        $(this).parent().find('img').css('display','none');
                        if ($(this).attr('id')=='date_from' && $('#repeat_end_date').is(':visible')) {
                            $('#repeat_end_date').keyup();
                        }
                        if (($(this).attr('id')=='date_fromTODO' || 
                            $(this).attr('id')=='date_toTODO') && 
                            $('#repeat_end_date_TODO').is(':visible')) {

                            $('#repeat_end_date_TODO').keyup();
                        }
                    }
                    else {
                        $(this).parent().find('img').css('display','inline');
                    }

                    if ($(this).attr('id')=='repeat_end_date') {
                        if (valid && $('#date_from').val()!='') {
                            $(this).parent().find('img').css('display','inline');
                            var today = $.datepicker.parseDate (globalSettings.datepickerformat.value, 
                                                                $('#date_from').val());
                            if (today!=null) {
                                var repeatEnd = $.datepicker.parseDate (globalSettings.datepickerformat.value, $(this).val());
                                if (repeatEnd != null) {
                                    if (repeatEnd >= today) {
                                        $(this).parent().find('img').css('display','none');
                                    }
                                }
                            }
                        }
                    }
                    else if (valid && $(this).attr('id')=='repeat_end_date_TODO') {
                        if ($('#date_fromTODO').is(':visible') && $('#date_fromTODO').val()!='') {
                            $(this).parent().find('img').css('display','inline');
                            var today = $.datepicker.parseDate (globalSettings.datepickerformat.value, 
                                                                $('#date_fromTODO').val());
                            if (today!=null) {
                                var repeatEnd = $.datepicker.parseDate (globalSettings.datepickerformat.value, 
                                                                        $(this).val());
                                if (repeatEnd!=null) {
                                    if (repeatEnd>=today) {
                                        $(this).parent().find('img').css('display','none');
                                    }
                                }
                            }
                        }
                        else if ($('#date_toTODO').is(':visible') && $('#date_toTODO').val()!='') {
                            $(this).parent().find('img').css('display','inline');
                            var today=$.datepicker.parseDate (globalSettings.datepickerformat.value, 
                                                              $('#date_toTODO').val());
                            if (today!=null) {
                                var repeatEnd = $.datepicker.parseDate (globalSettings.datepickerformat.value, 
                                                                        $(this).val());
                                if (repeatEnd!=null) {
                                    if (repeatEnd>=today) {
                                        $(this).parent().find('img').css('display','none');
                                    }
                                }

                            }
                        }
                    }
                }
            });
            // show the datepicker after the initialization
            $(this).datepicker('show');
        }
    });
}

function initCalDavTimepicker (element) {
    // 功能：
    // 输入：element
    // 输出：
    // console.log("③interface_func initCalDavTimepicker");

    var timepickers = element.find('.time');

    timepickers.focus(function () {
        $(this).autocomplete({
            create: function ( event, ui ) {
                $(this).data("ui-autocomplete").menu.element.addClass('ui-autocomplete-caldav');
            },
            close: function ( event, ui ) {
                $(this).keyup();
            },
            source: function (request, response) {
                var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), 'i');
                response ($.grep(timelist, function (value) {
                    value = value.label || value.value || value;
                    return matcher.test(value) || matcher.test(value.multiReplace(globalSearchTransformAlphabet));
                }));
            },
            minLength: 0
        });
    });

    timepickers.blur(function () {
        var tmptime = $.trim($(this).val());
        if (tmptime.match(globalTimePre) != null) {
            if (tmptime.indexOf(':') == -1) {
                if (globalSettings.ampmformat.value) {
                    if (tmptime.indexOf(' ') == -1) {
                        tmptime = tmptime.substring(0,2)+':'+tmptime.substring(2,4)+' '+tmptime.substring(4,6);
                    }
                    else {
                        tmptime = tmptime.substring(0,2)+':'+tmptime.substring(2,4)+' '+tmptime.substring(5,7);
                    } 
                }
                else {
                    tmptime = tmptime.substring(0,2)+':'+tmptime.substring(2,4);
                } 
            }
            else {
                if (globalSettings.ampmformat.value) {
                    var partA = tmptime.split(':')[0];
                    partA     = parseInt(partA,10);
                    var partB = tmptime.split(':')[1].substring(0,tmptime.split(':')[1].length-2);
                    partB     = parseInt(partB,10);
                    tmptime   = (partA < 10 ? '0' : '') + partA + ':' + (partB < 10 ? '0' : '') + partB + ' ' + 
                        tmptime.split(':')[1].substring(tmptime.split(':')[1].length-2, tmptime.split(':')[1].length);
                }
                else {
                    var partA = tmptime.split(':')[0];
                    partA     = parseInt(partA,10);
                    var partB = tmptime.split(':')[1];
                    partB     = parseInt(partB,10);
                    tmptime   = (partA<10 ? '0' : '') + partA + ':' + (partB<10 ? '0' : '') + partB;
                }
            }
            if (tmptime.length == 7) {
                tmptime = tmptime.substring(0,5)+' '+tmptime.substring(5,7);
            }
            else if (tmptime.length==6 && tmptime.indexOf(':')!=-1) {
                tmptime = tmptime.substring(0,2)+':'+tmptime.substring(2,4)+' '+tmptime.substring(4,6);
            }

            $(this).val(tmptime.toUpperCase());
        }

        if ($(this).attr('id') == 'time_from') {
            var validD = true, prevDate = '';
            if (globalPrevDate != '') {
                prevDate = new Date(globalPrevDate.getTime());
            }

            try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val())}
            catch (e) {validD = false}

            if (tmptime.match(globalTimePre)!=null && validD) {
                var dateFrom    = $.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val());
                var datetime_to = $.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
                var aDate       = new Date(Date.parse("01/02/1990, "+$('#time_from').val()));
                var time_from   = $.fullCalendar.formatDate(aDate, 'HH:mm:ss');
                var checkD      = $.fullCalendar.parseDate(datetime_to+'T'+time_from);

                globalPrevDate = new Date(checkD.getTime());
            }
            else {
                globalPrevDate = '';
            }
            if ($(this).attr('id')=='time_from' && prevDate!='' && globalPrevDate!='') {
                globalPrevDate.setSeconds(0);
                globalPrevDate.setMilliseconds(0);
                prevDate.setSeconds(0);
                prevDate.setMilliseconds(0);
                var diffDate  = globalPrevDate.getTime() - prevDate.getTime();

                try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_to').val())}
                catch (e) {validD = false}

                if ($('#date_to').val()!='' && $('#time_to').val().match(globalTimePre)!=null && validD) {
                    var dateTo           = $.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_to').val());
                    var datetime_to      = $.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
                    var aDateT           = new Date(Date.parse("01/02/1990, "+$('#time_to').val()));
                    var time_to          = $.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
                    var checkDT          = $.fullCalendar.parseDate(datetime_to+'T'+time_to);
                    var toDate           = new Date(checkDT.getTime() + diffDate);
                    var formattedDate_to = $.datepicker.formatDate(globalSettings.datepickerformat.value, toDate);

                    $('#date_to').val(formattedDate_to);
                    $('#time_to').val($.fullCalendar.formatDate(toDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
                }
            }
        }
        else if ($('#todo_type').val()=='both' && $(this).attr('id')=='time_fromTODO') {
            var validD=true, prevDate = '';
            if (globalPrevDate!='') {
                prevDate = new Date(globalPrevDate.getTime());
            }
            try {$.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_fromTODO').val())}
            catch (e) {validD=false}

            if (tmptime.match(globalTimePre)!=null && validD) {
                var dateFrom    = $.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_fromTODO').val());
                var datetime_to = $.fullCalendar.formatDate(dateFrom, 'yyyy-MM-dd');
                var aDate       = new Date(Date.parse("01/02/1990, "+$('#time_fromTODO').val()));
                var time_from   = $.fullCalendar.formatDate(aDate, 'HH:mm:ss');
                var checkD      = $.fullCalendar.parseDate(datetime_to+'T'+time_from);

                globalPrevDate = new Date(checkD.getTime());
            }
            else {
                globalPrevDate = '';
            }

            if ($(this).attr('id')=='time_fromTODO' && prevDate!='' && globalPrevDate!='') {
                globalPrevDate.setSeconds(0);
                globalPrevDate.setMilliseconds(0);
                prevDate.setSeconds(0);
                prevDate.setMilliseconds(0);
                var diffDate  = globalPrevDate.getTime() - prevDate.getTime();

                try {$.datepicker.parseDate (globalSettings.datepickerformat.value, $('#date_toTODO').val())}
                catch (e) {validD = false}

                if ($('#date_toTODO').val()!='' && $('#time_toTODO').val().match(globalTimePre)!=null && validD) {
                    var dateTo           = $.datepicker.parseDate (globalSettings.datepickerformat.value, 
                                                                    $('#date_toTODO').val());
                    var datetime_to      = $.fullCalendar.formatDate(dateTo, 'yyyy-MM-dd');
                    var aDateT           = new Date(Date.parse("01/02/1990, "+$('#time_toTODO').val()));
                    var time_to          = $.fullCalendar.formatDate(aDateT, 'HH:mm:ss');
                    var checkDT          = $.fullCalendar.parseDate (datetime_to+'T'+time_to);
                    var toDate           = new Date(checkDT.getTime() + diffDate);
                    var formattedDate_to = $.datepicker.formatDate(globalSettings.datepickerformat.value, toDate);

                    $('#date_toTODO').val(formattedDate_to);
                    $('#time_toTODO').val($.fullCalendar.formatDate(toDate, 
                                        (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
                }
            }
        }
    });

    timepickers.bind('keyup change', function () {
        var tmptime = $.trim($(this).val());
        /*if (tmptime.match(globalTimePre)!=null)
        {
            var formattedTime=tmptime.toLowerCase().replace(RegExp(' ','g'),'');    // lower case string without spaces
            if (formattedTime.indexOf(':')==-1)
                var result_time=(parseInt(formattedTime.substr(0,2),10)+(formattedTime.substr(-2)=='pm' ? 12 : 0)).pad(2)+formattedTime.substr(2,2);
            else
                var result_time=(parseInt(formattedTime.split(':')[0],10)+(formattedTime.substr(-2)=='pm' ? 12 : 0)).pad(2)+parseInt(formattedTime.split(':')[1],10).pad(2);
            $(this).parent().find('img').css('display', 'none');
        }
        else $(this).parent().find('img').css('display', 'inline');*/
        if ($(this).attr('id') != 'completedOnTime') {
            if (tmptime.match(globalTimePre) == null) {
                $(this).parent().find('img').css('display', 'inline');
            }
            else {
                $(this).parent().find('img').css('display', 'none');
            }
        }
        else {
            if ($(this).val() == '') {
                if ($('#completedOnDate').val() == '') {
                    $(this).parent().find('img').css('display', 'none');
                    $('#completedOnDate').parent().find('img').css('display', 'none');
                }
                else {
                    $(this).parent().find('img').css('display', 'inline');
                }
            }
            else {
                if (tmptime.match(globalTimePre) == null)
                    $(this).parent().find('img').css('display', 'inline');
                else {
                    $(this).parent().find('img').css('display', 'none');
                    if ($('#completedOnDate').val() == '') {
                        $('#completedOnDate').parent().find('img').css('display', 'inline');
                    }
                    else {
                        $('#completedOnDate').parent().find('img').css('display', 'none');
                    }
                }
            }
        }
    });

    timepickers.dblclick(function () {
        if ($(this).val() != '') {
            return false;
        }

        var now        = new Date();
        var todoString = '';

        if ($(this).attr('id')!=undefined) {
            if ($(this).attr('id').indexOf('TODO')!=-1) {
                todoString = 'TODO';
            }
        }
        if ($(this).attr('id')=='time_to' || 
            (($(this).attr('id')=='time_toTODO') && ($('.dateTrFromTODO').css('display')!='none'))) {

            var testString = $(this).val();
            if (($('#time_from'+todoString).parent().find('img').css('display')=='none') && 
                ($('#date_from'+todoString).parent().find('img').css('display')=='none')
                && ($('#date_to'+todoString).parent().find('img').css('display')=='none')) {

                var inputDate    = $.datepicker.parseDate(globalSettings.datepickerformat.value,$('#date_from'+todoString).val());
                var formatString = inputDate.getFullYear()+'/'+(inputDate.getMonth()<10 ? '0' : '') + 
                                (inputDate.getMonth()+1)+'/'+(inputDate.getDate()<10 ? '0' : '')+inputDate.getDate();
                
                var timeDate = new Date(Date.parse(formatString+", "+$('#time_from'+todoString).val()));
                now          = new Date(timeDate.getTime());

                var inputDate2    = $.datepicker.parseDate(globalSettings.datepickerformat.value,$('#date_to'+todoString).val())
                var formatString2 = inputDate2.getFullYear()+'/'+(inputDate2.getMonth()<10 ? '0' : '')+(inputDate2.getMonth()+1)+'/'+(inputDate2.getDate()<10 ? '0' : '')+inputDate2.getDate();

                var timeDateFrom = new Date(Date.parse(formatString2+", "+$('#time_from'+todoString).val()));

                if (formatString == formatString2) {
                    now.setHours(now.getHours()+1);
                    var newTestValue = new Date(Date.parse(formatString2+", " + 
                            $.fullCalendar.formatDate(now, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm'))));

                    if (newTestValue < timeDateFrom) {
                        newTestValue.setHours(23);
                        newTestValue.setMinutes(59);
                        now = new Date(newTestValue.getTime());
                    }
                }
            }
        }
        if ($(this).attr('id')=='time_from' || $(this).attr('id')=='time_fromTODO') {
            if (globalPrevDate!='') {
                globalPrevDate.setHours(now.getHours());
                globalPrevDate.setMinutes(now.getMinutes());
            }
        }
        $(this).val($.fullCalendar.formatDate(now, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
        $(this).keyup();
    });
}

function duplicateEvent (todoSel) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func duplicateEvent");

    if (todoSel=='TODO')
    {
        startEditModeTodo();
        $('#showTODO').val('');
        $('#uidTODO').val('');
        $('#vcalendarHashTODO').val('');
        $('#vcalendarUIDTODO').val('');
        $('#etagTODO').val('');
        $('#todoInEdit').val('true');
        $('#deleteTODO').hide();
        $('#resetTODO').hide();
        $('#editTODO').hide();
        $('#duplicateTODO').hide();
        $('#editOptionsButtonTODO').hide();
    }
    else
    {
        startEditModeEvent();
        $('#uid').val('');
        $('#show').val('');
        $('#etag').val('');
        $('#vcalendarHash').val('');
        $('#vcalendarUID').val('');
        $('#editButton').hide();
        $('#duplicateButton').hide();
        $('#editOptionsButton').hide();
        // $('#resetButton').hide();
        $('#deleteButton').hide();
    }
}

function showNewEvent (todoSel) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func showNewEvent");

    if ($('#ResourceCalDAV'+todoSel+'List .resourceCalDAV'+todoSel+'_item:visible').not('.resourceCalDAV_item_ro').length==0)
        return false;

    $('#timezonePicker'+todoSel).prop('disabled', true);
    if (todoSel=='TODO')
    {
        $('#TodoDisabler').fadeIn(globalEditorFadeAnimation);
        showTodoForm(null, 'new');
        $('#nameTODO').focus();
    }
    else
    {
        $('#show').val('');
        $('#CAEvent').hide();

        $('#EventDisabler').fadeIn(globalEditorFadeAnimation, function () {
            showEventForm(new Date(), true, null, null, 'new', '');
            $('#name').focus();
        });
    }
}

function showEventPopup (e, event) {
    // 功能：
    // 输入：
    // 输出：
    // console.log("③interface_func showEventPopup");

    var from;
    var to;
    var status;
    var avail;
    var classType;
    var priority;
    var resource = globalResourceCalDAVList.getCollectionByUID(event.res_id);

    if (event.allDay) {
        from = $.fullCalendar.formatDate(event.realStart, dateFormatJqToFc(globalSettings.datepickerformat.value));
        to   = $.fullCalendar.formatDate(event.realEnd, dateFormatJqToFc(globalSettings.datepickerformat.value));
    }
    else {
        from = $.fullCalendar.formatDate(event.realStart, dateFormatJqToFc(globalSettings.datepickerformat.value) + '\'&emsp;\'' + (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm'));
        to   = $.fullCalendar.formatDate(event.realEnd, dateFormatJqToFc(globalSettings.datepickerformat.value) + '\'&emsp;\'' + (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm'));
    }

    switch (event.status) {
        case 'NONE':
            status = localization[globalInterfaceLanguage].txtStatusNone;
            break;
        case 'TENTATIVE':
            status = localization[globalInterfaceLanguage].txtStatusTentative;
            break;
        case 'CONFIRMED':
            status = localization[globalInterfaceLanguage].txtStatusConfirmed;
            break;
        case 'CANCELLED':
            status = localization[globalInterfaceLanguage].txtStatusCancelled;
            break;
        default:
            status = localization[globalInterfaceLanguage].txtStatusNone;
            break;
    }

    switch (event.avail) {
        case 'busy':
            avail = localization[globalInterfaceLanguage].eventAvailabilityBusy;
            break;
        case 'free':
            avail = localization[globalInterfaceLanguage].eventAvailabilityFree;
            break;
        default:
            avail = localization[globalInterfaceLanguage].eventAvailabilityFree;
            break;
    }

    switch (event.classType) {
        case 'public':
            classType = localization[globalInterfaceLanguage].eventTypePublic;
            break;
        case 'confidential':
            classType = localization[globalInterfaceLanguage].eventTypeConfidential;
            break;
        case 'private':
            classType = localization[globalInterfaceLanguage].eventTypePrivate;
            break;
        default:
            classType = localization[globalInterfaceLanguage].eventTypePublic;
            break;
    }

    var prior = parseInt(event.priority,10);
    if (prior == 5) {
        priority = localization[globalInterfaceLanguage].txtPriorityMedium;
    }
    else if (prior>5 && prior<10) {
        priority = localization[globalInterfaceLanguage].txtPriorityLow;
    }
    else if (prior<5 && prior>0) {
        priority = localization[globalInterfaceLanguage].txtPriorityHigh;
    }
    else {
        priority = localization[globalInterfaceLanguage].txtPriorityNone;
    }

    if (event.title == '') {
        $('#CalDavZAPPopup').find('[data-type="name"]').parent().css('display','none');
    }
    else {
        $('#CalDavZAPPopup').find('[data-type="name"]').text(event.title).parent().css('display','');
    }
    if (event.location == '') {
        $('#CalDavZAPPopup').find('[data-type="location"]').parent().css('display','none');
    }
    else {
        $('#CalDavZAPPopup').find('[data-type="location"]').text(event.location).parent().css('display','');
    }
    if (event.hrefUrl == '') {
        $('#CalDavZAPPopup').find('[data-type="url"]').parent().css('display','none');
    }
    else {
        $('#CalDavZAPPopup').find('[data-type="url"]').text(event.hrefUrl).parent().css('display','');
    }
    if (event.note == '') {
        $('#CalDavZAPPopup').find('[data-type="note"]').parent().css('display','none');
    }
    else {
        $('#CalDavZAPPopup').find('[data-type="note"]').text(event.note).parent().css('display','');
    }

    $('#CalDavZAPPopup').find('[data-type="from"]').html(from);
    $('#CalDavZAPPopup').find('[data-type="to"]').html(to);
    $('#CalDavZAPPopup').find('[data-type="status"]').text(status);
    $('#CalDavZAPPopup').find('[data-type="avail"]').text(avail);
    $('#CalDavZAPPopup').find('[data-type="type"]').text(classType);
    $('#CalDavZAPPopup').find('[data-type="priority"]').text(priority);
    $('#CalDavZAPPopup').find('[data-type="calendar"]').text(resource.displayvalue);

    $('#CalDavZAPPopup').css({'opacity':0,'display':'block','top':0,'left':0});
    $('#CalDavZAPPopupColor').css('height',0);
    $('#CalDavZAPPopup').css('top', Math.max(e.pageY-$('#CalDavZAPPopup').outerHeight()-10, 30));
    $('#CalDavZAPPopup').css('left', Math.max(Math.min(e.pageX, $(window).width()-$('#CalDavZAPPopup').outerWidth()-50)+20, 30));
    $('#CalDavZAPPopupColor').css({'background-color':resource.ecolor, 'height':$('#CalDavZAPPopup').height()});
    $('#CalDavZAPPopup').animate({'opacity':1}, 100);
}

function moveEventPopup (e) {
    // 功能：移动 $('#CalDavZAPPopup') 通过设置 top & left 实现
    // 输入：e：
    // 输出：无
    // console.log("③interface_func moveEventPopup");

    $('#CalDavZAPPopup').css('top', Math.max(e.pageY - $('#CalDavZAPPopup').outerHeight()-10, 30));
    $('#CalDavZAPPopup').css('left', Math.max(
        Math.min(e.pageX, $(window).width() - $('#CalDavZAPPopup').outerWidth() - 50)+20, 30));
}

function hideEventPopup () {
    // 功能：隐藏 $('#CalDavZAPPopup')
    // 输入：无
    // 输出：无
    // console.log("③interface_func hideEventPopup");

    $('#CalDavZAPPopup').css('display', 'none');
}
