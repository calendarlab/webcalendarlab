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

// EventList Class
function EventList () {
    this.events             = {};
    this.todos              = {};
    this.displayEventsArray = {};
    this.displayTodosArray  = {};
    this.repeatable         = new Array();
    this.repeatableTodo     = new Array();

    this.reset = function() {
        this.events = {};
        this.todos  = {};
        this.repeatable.splice(0, this.repeatable.length);
        this.repeatableTodo.splice(0, this.repeatableTodo.length);
        this.displayEventsArray = {};
        this.displayTodosArray  = {};
    }

    this.getNewUID = function(){
        // we count with uniqueness of generated hash string
        var newUID = null;
        newUID     = generateUID();
        return newUID;
    }

    this.getSortKey = function (vcalendar_clean) {
        var vcalendar_element = ('\r\n'+vcalendar_clean).match(RegExp('\r\n'+vCalendar.re['contentline_N'], 'm'));

        if (vcalendar_element!=null && vcalendar_element.length==1)  {
            // if the N attribute is not present exactly once, vCalendar is considered invalid
            var parsed = vcalendar_element[0].match(RegExp('\r\n'+vCalendar.re['contentline_parse'], 'm'));
                // parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
            var parsed_value = vcalendarSplitValue(parsed[4], ';');
                // parsed_value = [0]->Family, [1]->Given, [2]->Middle, [3]->Prefix, [4]->Suffix

            // TODO: allow users to set the sorting method
            if (parsed_value[0]!='' || parsed_value[1]!='') {
                var sort_value = parsed_value[0];
                if (sort_value!='' && parsed_value[1]!='') {
                    sort_value += ' ';
                }
                sort_value += parsed_value[1];
            }
            else {
                // if no N value present, we use the FN instead
                var vcalendar_element2 = ('\r\n'+vcalendar_clean).match(RegExp('\r\n'+vCalendar.re['contentline_FN'], 'm'));
                if (vcalendar_element2!=null && vcalendar_element2.length==1) {
                    // if the FN attribute is not present exactly once, vCalendar is considered invalid
                    var parsed = vcalendar_element2[0].match(RegExp('\r\n'+vCalendar.re['contentline_parse'], 'm'));
                        // parsed (contentline_parse) = [1]->"group.", [2]->"name", [3]->";param;param", [4]->"value"
                    var sort_value = parsed[4];
                }
            }
            return sort_value;
        }
        else {
            return false;
        }
    }

    // Resource list is not sorted, instead "insert sort" is performed
    this.insertEvent = function(forceCall, inputCollection, inputEvent, forceReload, isEvent, isFromServer) {
        makeActive     = null;
        var rid        = inputEvent.uid.substring(0, inputEvent.uid.lastIndexOf('/')+1);
        var compObject = {};

        if (isEvent) {
            compObject = globalEventList.events;
        }
        else {
            compObject = globalEventList.todos;
        }
        
        // do not insert entry with duplicate UID
        // 不要将拥有相同 UID 的事件再次插入
        if (compObject[rid][inputEvent.uid] != undefined) {
            if (compObject[rid][inputEvent.uid].etag != inputEvent.etag) {
                this.removeOldEvent (inputEvent.uid, false, isEvent);
                makeActive = inputEvent.uid;
            }
            else {
                checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid+' '+inputCollection.listType], false);
                return 0;
            }
        }

        if (isEvent) {
            // 如果是事件，解析出事件的开始时间
            var res = getvCalendarstart(inputEvent);
            if (res!=false && res!=-1 && res!=undefined && res!=null) {
                inputEvent.sortStart = res;
            }
            else {
                console.log("Error: '"+inputEvent.uid+"': unable to parse vEvent");
                checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid + ' ' + inputCollection.listType], true);
                return false;
            }

            // （新增）解析 ics 中的 organizer 和 attendee 字段，支持邀请事件功能  
            var vcalendar_element = '',
                vEvent            = inputEvent.vcalendar;

            vcalendar_element = vEvent.match(RegExp('\r\nORGANIZER;.*', 'mi'));

            inputEvent.organizerData     = new Object();
            inputEvent.acceptedAttendees = [];
            inputEvent.declinedAttendees = [];
            inputEvent.unknownAttendees  = [];
            if (vcalendar_element === null) {
                // 没有匹配到 ORGANIZER 字段，说明这是不是一个邀请事件
                inputEvent.isInvitation      = false;
                inputEvent.isOrganizer       = false;
            } 
            else {
                inputEvent.isInvitation = true;

                if (vcalendar_element[0].slice(-36) === globalAccountSettings[0].cahref.slice(-37,-1)) {
                    // 自己就是该事件的组织者
                    inputEvent.isOrganizer = true;
                } 
                else {
                    // 自己是该事件的参与者
                    inputEvent.isOrganizer = false;
                }
                
                vcalendar_element = vEvent.match(RegExp('\r\nATTENDEE;.*', 'mig'));
                if (vcalendar_element) {
                    for (var i=0; i<vcalendar_element.length; i++) {
                        var tmp_sp1      = vcalendar_element[i].split(";");
                        var tmp_attendee = new Map();
                        var the_attendee = new Object();

                        tmp_sp1.forEach(function(el) {
                            if (el.split("=").length > 1) {
                                // 当前字段不是 ATTENDEE
                                tmp_attendee.set(el.split("=")[0], el.split("=")[1].split(":")[0]);
                                if (el.split("=")[1].split(":").length > 1) {
                                    // 当前字段中包含uid
                                    tmp_attendee.set('UID', el.split(":")[el.split(":").length - 1]);
                                }
                            }
                        });

                        the_attendee.CN     = tmp_attendee.get('CN');       // 当前字段为 Common Name
                        the_attendee.CUTYPE = tmp_attendee.get('CUTYPE');   // 当前字段为 Calendar User Type
                        the_attendee.EMAIL  = tmp_attendee.get('EMAIL');    // 当前字段为 Email 
                        the_attendee.uid    = tmp_attendee.get('UID');      // 当前字段为 uid 

                        if (tmp_attendee.get('ROLE') === "CHAIR") {
                            // 当前字段(ROLE)表明：该 attendee 是事件组织者
                            inputEvent.organizerData = the_attendee;
                        }
                        else if (tmp_attendee.get('ROLE') === "REQ-PARTICIPANT") {
                            // 当前字段(ROLE)表明：该 attendee 是事件参与者
                            switch (tmp_attendee.get('PARTSTAT')) {
                                case "NEEDS-ACTION":
                                    inputEvent.unknownAttendees.push(the_attendee);
                                    break;
                                case "ACCEPTED":
                                    inputEvent.acceptedAttendees.push(the_attendee);
                                    break;
                                case "DECLINED":
                                    inputEvent.declinedAttendees.push(the_attendee);
                                    break;
                                default:
                                    console.log("ERROR PARTSTAT! please check...");
                                    break;
                            }
                        }
                        else {
                            console.log("ERROR ROLE! Please check...");
                        }
                    }
                }
            }
            // --------------------------------

            globalEventList.events[rid][inputEvent.uid] = inputEvent;
        }
        else {
            globalEventList.todos[rid][inputEvent.uid] = inputEvent;
        }

        if (makeActive != null) {
            globalEventList.loadEventByUID(makeActive, isEvent, isFromServer);
            return 0;
        }

        var inputUID = inputEvent.uid;
        rid          = inputUID.substring(0, inputUID.lastIndexOf('/')+1);

        //setTimeout(function()
        //{
            if (!isEvent) {
                if (vcalendarTodoData(inputCollection, inputEvent, true) == false) {
                    console.log("Error: '"+inputEvent.uid+"': unable to parse vTodo");
                }
            }
            else {
                if (vcalendarToData(inputCollection, inputEvent, true) == false) {
                    console.log("Error: '"+inputEvent.uid+"': unable to parse vEvent");
                }
            }

            if (isEvent) {
                if (inputEvent.counter == undefined) {
                    if (globalVisibleCalDAVCollections.indexOf(rid)!=-1 || globalSettings.displayhiddenevents.value) {
                        refetchCalendarEvents();
                    }
                    else {
                        var beforeScroll = $('#main').width()-$('#calendar').width();
                        $('#calendar').fullCalendar('removeEvents', 'fooUID');
                        var afterScroll = $('#main').width()-$('#calendar').width();
                        rerenderCalendar(beforeScroll!=afterScroll);
                    }
                }
            }
            /*else {
                if (inputEvent.counter==undefined) {
                    if (globalVisibleCalDAVTODOCollections.indexOf(rid)!=-1 || globalSettings.displayhiddenevents.value) {
                        refetchTodoEvents();
                    }
                }
            }*/
            if (inputEvent.counter!=undefined) {
                checkEventLoader(globalResourceCalDAVList.counterList[inputCollection.uid+' '+inputCollection.listType], true);
            }
            if (forceCall && !isEvent) {
                $('#todoList').fullCalendar('selectEvent',$('[data-id="'+inputEvent.uid+'"]'));
            }
        //}, 100);
    }

    this.checkAndTouchIfExists=function(calendarUID,inputUID,inputEtag,inputTimestamp)
    {
        if (globalEventList.events[calendarUID]!=undefined && globalEventList.events[calendarUID][inputUID]!=undefined)
        {
            globalEventList.events[calendarUID][inputUID].timestamp=inputTimestamp;
            if (globalEventList.events[calendarUID][inputUID].etag==inputEtag)
                return true;
            else
                return false;
        }
        else if (globalEventList.todos[calendarUID]!=undefined && globalEventList.todos[calendarUID][inputUID]!=undefined)
        {
            globalEventList.todos[calendarUID][inputUID].timestamp=inputTimestamp;
            if (globalEventList.todos[calendarUID][inputUID].etag==inputEtag)
                return true;
            else
                return false;
        }
        else
            return false;
    }

    this.removeOldEvents=function(inputUidBase, inputTimestamp, isEvent)
    {
        if (isEvent)
        {
            for (var i=0; i<globalResourceCalDAVList.collections.length;i++)
                if (globalResourceCalDAVList.collections[i].uid!=undefined)
                    for (var key in globalEventList.events[globalResourceCalDAVList.collections[i].uid])
                    {
                        var event = globalEventList.events[globalResourceCalDAVList.collections[i].uid][key];
                        if (event.timestamp!=undefined && event.uid.indexOf(inputUidBase)==0 && event.timestamp<inputTimestamp)
                            globalEventList.removeOldEvent(event.uid, true, isEvent);
                    }
        }
        else
        {
            for (var i=0; i<globalResourceCalDAVList.TodoCollections.length;i++)
                if (globalResourceCalDAVList.TodoCollections[i].uid!=undefined)
                    for (var key in globalEventList.todos[globalResourceCalDAVList.TodoCollections[i].uid])
                    {
                        var event = globalEventList.todos[globalResourceCalDAVList.TodoCollections[i].uid][key];
                        if (event.timestamp!=undefined && event.uid.indexOf(inputUidBase)==0 && event.timestamp<inputTimestamp)
                            globalEventList.removeOldEvent(event.uid, true, isEvent);
                    }
        }
    }

    this.removeOldEvent=function(inputUid, fromInterface, isEvent)
    {
        var rid=inputUid.substring(0, inputUid.lastIndexOf('/')+1);
        var uidRemoved=null;
        var isEvent=true;
        if (globalEventList.events[rid]!=undefined && globalEventList.events[rid][inputUid]!=undefined)
        {
            uidRemoved=inputUid;
            delete globalEventList.events[rid][inputUid];
            isEvent=true;
        }
        else if (globalEventList.todos[rid]!=undefined && globalEventList.todos[rid][inputUid]!=undefined)
        {
            uidRemoved=inputUid;
            delete globalEventList.todos[rid][inputUid];
            isEvent=false;
        }
        
        if (uidRemoved!=null)
        {
            if (fromInterface)
            {
                deleteEventFromArray(uidRemoved);
                if (isEvent)
                    refetchCalendarEvents();
                else
                {
                    var prevIndex = '';
                    if (globalCalTodo!=null)
                        prevIndex=$('.fc-view-todo .fc-list-day').find('.fc-event:visible').index($('[data-repeat-hash="'+globalCalTodo.repeatHash+'"]'));
                    refetchTodoEvents();
                    if (prevIndex!=-1 && $('.fc-view-todo .fc-list-day').find('.fc-event:visible').length > 0 && prevIndex>($('.fc-view-todo .fc-list-day').find('.fc-event:visible').length-1))
                        $('#todoList').fullCalendar('selectEvent',$($('.fc-view-todo .fc-list-day').find('.fc-event:visible').get($('.fc-view-todo .fc-list-day').find('.fc-event:visible').length-1)));
                    else if (prevIndex!=-1 && $('.fc-view-todo .fc-list-day').find('.fc-event:visible').length > 0 && prevIndex<=($('.fc-view-todo .fc-list-day').find('.fc-event:visible').length-1))
                        $('#todoList').fullCalendar('selectEvent',$($('.fc-view-todo .fc-list-day').find('.fc-event:visible').get(prevIndex)));
                    else
                        $('#CATodo').attr('style','display:none');
                }
            }

            for (var k=0;k<globalEventList.repeatable.length;k++)
                if (globalEventList.repeatable[k].uid==inputUid)
                {
                    globalEventList.repeatable.splice(k, 1);
                    break;
                }
        }
    }

    this.loadEventByUID=function(inputUID, isEvent,isFromServer)
    {
        var rid='';
        if (inputUID.charAt(inputUID.length-1)!='/')
        {
            rid=inputUID.substring(0, inputUID.lastIndexOf('/')+1);
            if (isEvent)
            {
                if (globalEventList.events[rid][inputUID].uid!=undefined)
                {
                    var evs='';
                    if (!globalCalDAVInitLoad)
                        evs=findEventInArray(globalEventList.events[rid][inputUID].uid, isEvent);

                    if (evs!='' && evs.etag!=globalEventList.events[rid][inputUID].etag)
                    {
                        vcalendarToData(globalResourceCalDAVList.getCollectionByUID(rid), globalEventList.events[rid][inputUID], false);
                        if (!isFromServer && (globalVisibleCalDAVCollections.indexOf(rid)!=-1 || globalSettings.displayhiddenevents.value))
                            refetchCalendarEvents();
                        else if (isFromServer)
                            checkEventLoader(globalResourceCalDAVList.counterList[rid+' '+globalResourceCalDAVList.getCollectionByUID(rid).listType], true);
                    }
                }
            }
            else
            {
                if (globalEventList.todos[rid][inputUID].uid!=undefined)
                {
                    var evs='';
                    if (!globalCalDAVInitLoad)
                        evs=findEventInArray(globalEventList.todos[rid][inputUID].uid, isEvent);
                    if (evs!='' && evs.etag!=globalEventList.todos[rid][inputUID].etag)
                    {
                        vcalendarTodoData(globalResourceCalDAVList.getCollectionByUID(rid), globalEventList.todos[rid][inputUID], false);
                        if (globalVisibleCalDAVTODOCollections.indexOf(rid)!=-1 || globalSettings.displayhiddenevents.value)
                        {
                            $('#todoList').fullCalendar('allowSelectEvent',false);
                            refetchTodoEvents();
                            $('#todoList').fullCalendar('allowSelectEvent',true);
                            if ($('#showTODO').val()==inputUID)
                            {
                                var newTodo = findEventInArray(globalEventList.todos[rid][inputUID].uid,false,globalCalTodo!=null ? globalCalTodo.repeatHash : null);
                                if (newTodo!='')
                                {
                                    if (globalCalTodo!=null)
                                    {
                                        if (isFromServer && $('#showTODO').val()==inputUID && ($('#repeatTodo').val()=="true" || $('#recurrenceIDTODO').val()!=''))
                                        {
                                            if (globalCalTodo.repeatHash != newTodo.repeatHash)
                                            {
                                                var name=globalCalTodo.title;
                                                showTodoForm({title: name, id:inputUID}, 'show','', true);
                                                $('#editAllTODO').css('visibility','hidden');
                                                $('#editFutureTODO').css('visibility','hidden');
                                                $('#editOnlyOneTODO').css('visibility','hidden');
                                                $('#repeatConfirmBoxContentTODO').html('<b>'+name+"</b> "+localization[globalInterfaceLanguage].repeatChangeTxt);
                                                $('#repeatConfirmBoxQuestionTODO').html(localization[globalInterfaceLanguage].repeatTodoChangeTxtClose);
                                            }
                                            else
                                                $('#todoList').fullCalendar('selectEvent');
                                        }
                                        else
                                        {
                                            if ($($('.fc-view-todo .fc-list-day').find('.fc-event[data-repeat-hash="'+$('#todoList').fullCalendar('getView').selectedElement+'"]')).length>0)
                                                $('#todoList').fullCalendar('selectEvent',$($('.fc-view-todo .fc-list-day').find('.fc-event[data-repeat-hash="'+$('#todoList').fullCalendar('getView').selectedElement+'"]')));
                                            else
                                                showTodoForm(globalCalTodo, 'show');
                                        }
                                    }
                                }
                                else
                                    $('#CATodo').attr('style','display:none');
                            }
                            else
                                $('#todoList').fullCalendar('selectEvent',null,true);
                        }
                    }
                }
            }
        }
    }
}
