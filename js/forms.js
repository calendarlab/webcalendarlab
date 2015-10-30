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
function updateEventFormDimensions(setHeight) {
    $('#CAEvent').css('width', '');
    $('#CAEvent').css('width', $('#event_details_template').css('width'));

    if (setHeight) {
        $('#CAEvent').css('height', '');
        $('#CAEvent').css('height', $('#event_details_template').css('height'));
    }
}

function setFormPosition(jsEvent, confirmRepeat) {
    var position_x,
        position_y,
        dist_x,
        dist_y;

    $('#event_details_template').css('max-height', '');

    if (jsEvent) {
        if (jsEvent.pageX <= ($('#main').width() / 2)) {
            position_v = 'left';
            dist_x = jsEvent.pageX;
        } else {
            position_v = 'right';
            dist_x = $('body').width() - jsEvent.pageX;
        }

        /*if (jsEvent.pageY<=($('#main').height()/2))
        {
            position_h='top';
            dist_y=jsEvent.pageY;
        }
        else
        {
            position_h='top';
            dist_y=jsEvent.pageY-$('#event_details_template').height();
        }*/
        position_h = 'top';
        dist_y = Math.max(29, jsEvent.pageY - (confirmRepeat ? $('#CAEvent').height() : $('#event_details_template').height()));
    } else {
        position_v = 'right';
        position_h = 'top';
        dist_x = 25;
        dist_y = 29;
    }

    $('#CAEvent').css('left', '');
    $('#CAEvent').css('right', '');
    $('#CAEvent').css('top', '');
    $('#CAEvent').css('bottom', '');
    $('#CAEvent').css(position_v, dist_x);
    $('#CAEvent').css(position_h, dist_y);
    $('#event_details_template').css('max-height', $('#main').height() - dist_y + 20 + 'px');
    $('#CAEvent').css('max-height', $('#main').height() - dist_y + 20 + 'px');
}

function showTimezones(selTimezone, todoSelector) {
    if (!globalSettings.timezonesupport.value)
        return false;

    var select = $('#timezone' + todoSelector);
    select.empty();

    for (var izone in timezoneKeys) {
        if (timeZonesEnabled.indexOf(timezoneKeys[izone]) == -1)
            continue;
        if (!isNaN(izone)) {
            var tmp = null;
            tmp = $('<option>');
            tmp.attr('data-type', timezoneKeys[izone]);
            if (izone == 0) {
                tmp.text(localization[globalInterfaceLanguage].localTime);
                tmp.attr('value', 'local');
                // if ((todoSelector=='PickerTODO' || todoSelector=='Picker') && typeof globalSettings.timezone.value != 'undefined' && globalSettings.timezone.value != null)
                //  tmp.attr('value',globalSettings.timezone.value);
                select.append(tmp);

                if (!(selTimezone in timezones) && selTimezone != '' && selTimezone != 'local' && (globalSettings.removeunknowntimezone.value == null || !globalSettings.removeunknowntimezone.value)) {
                    tmp.text(localization[globalInterfaceLanguage].customTimezone);
                    tmp.attr('value', 'custom');
                    if ((todoSelector == 'PickerTODO' || todoSelector == 'Picker') && globalSettings.timezone.value != null)
                        tmp.attr('value', globalSettings.timezone.value);
                    select.append(tmp);
                }
            } else {
                tmp.text(timezoneKeys[izone]);
                tmp.attr('value', timezoneKeys[izone]);
                select.append(tmp);
            }
        }
    }

    if (!selTimezone && typeof globalSessionTimeZone != 'undefined' && globalSessionTimeZone)
        selTimezone = globalSessionTimeZone;

    if (selTimezone in timezones)
        select.val(selTimezone);
    else {
        if ((globalSettings.removeunknowntimezone.value != null && globalSettings.removeunknowntimezone.value) || selTimezone == 'local')
            select.val('local');
        else
            select.val('custom');
    }
}

function findUserUid(email) {
    /* 功能：根据email，查找并返回用户在globalUsersData中的uid
     * 输入：email: 电子邮箱地址
     * 输出：uid
    */

    for (var i = 0; i < globalUsersData.length; i++) {
        if (globalUsersData[i].e_mail === email) {
            return globalUsersData[i].uid;
        }
    }
}

function showEventForm(date, allDay, calEvent, jsEvent, mod, repeatOne, confirmRepeat) {
    $('#event_details_template').remove();
    $('#CAEvent').html(cleanVcalendarTemplate);
    setFirstDayEvent();
    bindEventForm();

    $('#note').autosize({
        defaultStyles: {
            overflow: '',
            'overflow-y': '',
            'word-wrap': '',
            resize: 'none'
        },
        callback: function() {
            checkEventFormScrollBar();
        }
    });
    $("#show").val('');
    $("#uid").val('');
    $("#etag").val('');
    $("#repeatCount").val('');
    $("#repeatEvent").val('');
    $("#recurrenceID").val('');
    $("#futureStart").val('');
    $("#vcalendarHash").val('');
    $("#vcalendarUID").val('');
    globalPrevDate = '';
    var color = '';

    // --- 添加邀请人显示部分 ---
    var tmp_html = "";
    var tmp_dataId = "";
    if (calEvent && calEvent.isInvitation) {
        for (var el of calEvent.acceptedAttendees) {
            tmp_html   += "," + el.CN;
            tmp_dataId += "," + findUserUid(el.EMAIL);
        }
        for (var el of calEvent.declinedAttendees) {
            tmp_html   += "," + el.CN;
            tmp_dataId += "," + findUserUid(el.EMAIL);
        }
        for (var el of calEvent.unknownAttendees) {
            tmp_html   += "," + el.CN;
            tmp_dataId += "," + findUserUid(el.EMAIL);
        }
    }
    if (tmp_html != "") {
        $('#addPartnerTxt').attr('data-id', tmp_dataId.slice(1));
        $('#addPartnerTxt').html(tmp_html.slice(1));
    }
    // --- 添加邀请人显示部分 over ---

    $('#addPartner')
        .hover(function() {
            $(this).attr('src', 'images/add_partner_hover.png');
        }, function() {
            $(this).attr('src', 'images/add_partner.png');
        })
        .click(function() {
            // 点击该图标，弹出联系人 div#contacts 对话框。
            // 出现位置逻辑：放置在 div#event_details_template 对话框的左或右（默认右边）

            var window_width = $(window).width();
            var edt_left = $('#event_details_template').offset().left;
            var edt_width = $('#event_details_template').width();

            if (edt_width <= window_width - edt_left - edt_width) {
                // 右侧空间足够
                $('#contacts').css({
                    'left': edt_left + edt_width,
                    'top': $('#event_details_template').offset().top
                });
            } else {
                // 放左边咯╮(╯_╰)╭
                $('#contacts').css({
                    'left': edt_left - $('#contacts').width() - 21,
                    'top': $('#event_details_template').offset().top
                });
            }
            $('#contacts').css({
                'display': 'block',
                'margin': '0',
                'z-index': '30',
            });
            $('.ezz').css('z-index', 27);

            // 若是已有邀请人，则读取 #addPartnerTxt 的 data-id ,将已选联系人勾选上
            if ($('#addPartnerTxt').attr('data-id')) {
                var tmp_users = $('#addPartnerTxt').attr('data-id').split(',');
                $('#contacts .group li').each(function() {
                    // data-id 匹配成功，将其增加 .active
                    for (var i = 0; i < tmp_users.length; i++) {
                        if ($(this).attr('data-id') === tmp_users[i]) {
                            // 匹配成功
                            $(this).addClass('active');
                            break;
                        }
                    }
                });
            }
        });

    $('#alertButton').click(function() {
        if ($('#allday').prop('checked')) {
            if (typeof($('#alertTxt').attr('value')) != "undefined" && $('#alertTxt').attr('value') != "-1,-1,-1") {
                // 该事件已有提醒时间
                AllDayAlertSelect.isDIY = true;
                AllDayAlertSelect.dayCount = parseInt($('#alertTxt').attr('value').split(',')[0]);
                AllDayAlertSelect.hourCount = parseInt($('#alertTxt').attr('value').split(',')[1]);
            }
            else {
                AllDayAlertSelect.isDIY = false;
                AllDayAlertSelect.dayCount = 0;
                AllDayAlertSelect.hourCount = 0;
            }

            $('#allDayAlertSelect').css({
                top: $('#alertButton').offset().top + 16,
                left: $('#event_details_template').offset().left + 120
            });
            AllDayAlertSelect.isShow = true;
            AllDayAlertSelect.modalZ = 27;
        }
        else {
            if ($('#noDay').css('display') === 'none') {
                $('#noDay').css({
                    display: 'block',
                    top: $('#alertButton').offset().top + 16,
                    left: $('#event_details_template').offset().left + 120
                });
                if (typeof($('#alertTxt').attr('value')) != "undefined") {
                    // 该事件已有提醒时间
                    $('#noDayContent li').each(function() {
                        if ($(this).attr('value') === $('#alertTxt').attr('value')) {
                            $('#noDayContent li.active').removeClass('active');
                            $(this).addClass('active');    
                        } 
                    });
                }
                else {
                    $('#noDayContent li.active').removeClass('active');
                    $('#noDayContent li:first').addClass('active');
                }
                $('.ezz').css('z-index', 27);
            }
        }
    });

    // -----------------------
    if (mod == 'new') {
        var activeCollection = $('#ResourceCalDAVList').find('.myListItem.resourceCalDAV_item_selected');

        if (activeCollection.length > 0 && !globalResourceCalDAVList.getEventCollectionByUID(activeCollection.attr('data-id')).permissions.read_only) {
            color = rgbToHex(activeCollection.find('.labelafter').css('background-color'));
        }
    } else {
        color = globalResourceCalDAVList.getEventCollectionByUID(calEvent.res_id).ecolor;
    }

    if (confirmRepeat) {
        $('#show').val(calEvent.id);
        $('#repeatEvent').val(true);
        $('#CAEvent').show();
        $('#repeatConfirmBox').css('visibility', 'visible');

        if (calEvent.repeatCount != '' && calEvent.repeatCount == 1) {
            $('#editFuture').css('display', 'none');
            if ($('#editFuture').next('br').length > 0)
                $('#editFuture').next().remove();
        } else if ($('#editFuture').css('display') == 'none') {
            $('#editFuture').css('display', 'block');
            if ($('#editFuture').next('br').length == 0)
                $('#editFuture').after('<br/>')
        }
        $('#repeatConfirmBoxContent').html('<b>' + calEvent.title + "</b> " + localization[globalInterfaceLanguage].repeatBoxContent);
        $('#repeatConfirmBoxQuestion').html(localization[globalInterfaceLanguage].repeatBoxQuestion);

        $('#editAll, #editOnlyOne, #editFuture').click(function() {
            if (globalCalEvent) {
                if ($(this).attr('id') == 'editOnlyOne')
                    showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', 'editOnly');
                else if ($(this).attr('id') == 'editAll')
                    showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', '');
                else if ($(this).attr('id') == 'editFuture')
                    showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', 'futureOnly');

                $('#repeatConfirmBoxContent').html('');
                $('#repeatConfirmBox').css('visibility', 'hidden');
                $('#AlertDisabler').fadeOut(globalEditorFadeAnimation);
            }
        });

        $('#CAEvent').height($('#repeatConfirmBox').height());
        $('#eventColor').css('background-color', color);
        updateEventFormDimensions();
        setFormPosition(jsEvent, true);
        $('#event_details_template').scrollTop(0);
        return true;
    }

    if (mod == 'show' && repeatOne == 'futureOnly') {
        $('#futureStart').val(calEvent.realRepeatCount + ';' + calEvent.start);
    }

    if (mod != 'new') {
        fullVcalendarToData(calEvent);
    } else {
        CalDAVeditor_cleanup();
    }

    if (calEvent != null && ((repeatOne == 'editOnly' && calEvent.type) || calEvent.rec_id)) {
        var eventsSorted = jQuery.grep(globalEventList.displayEventsArray[calEvent.res_id], function(e) {
            if (e.id == calEvent.id) return true
        }).sort(repeatStartCompare);
        if (eventsSorted.indexOf(calEvent) != -1) {
            if (eventsSorted.indexOf(calEvent) < (eventsSorted.length - 1))
                showEventNextNav();
            if (eventsSorted.indexOf(calEvent) != 0)
                showEventPrevNav();
        }
    }

    var cals = globalResourceCalDAVList.sortedCollections;
    var calendarObj = $('#event_calendar');
    // var calSelected = $('.resourceCalDAV_item.resourceCalDAV_item_selected').attr('data-id');
    var calSelected = $('.myListItem.resourceCalDAV_item_selected').attr('data-id');
    for (var i = 0; i < cals.length; i++) {
        if (cals[i].uid != undefined &&
            ((calEvent != null && calEvent.res_id == cals[i].uid) ||
                (!cals[i].permissions_read_only &&
                    // (cals[i].makeLoaded && !cals[i].permissions_read_only && 
                    (globalVisibleCalDAVCollections.indexOf(cals[i].uid) != -1 || calSelected == cals[i].uid)))) {
            // A && ((B || (C && D && (F || G))))
            calendarObj.append(new Option(cals[i].displayValue, cals[i].uid));
        }
    }

    if (mod == 'new') {
        $('#show').val('');
        $('#editButton').hide();
        $('#duplicateButton').hide();
        $('#editOptionsButton').hide();
        // $('#resetButton').hide();
        $('#deleteButton').hide();

        if ($('#ResourceCalDAVList').find('.myListItem').length > 0 &&
            $('#event_calendar').find('option[value="' + $('#ResourceCalDAVList').find('.myListItem.resourceCalDAV_item_selected').attr("data-id") + '"]').length > 0) {

            $('.R_calendar').val($('#ResourceCalDAVList').find('.myListItem.resourceCalDAV_item_selected').attr("data-id"));
        } else {
            $('#event_calendar').val('choose');
        }
    }

    if (mod == 'drop') {
        if (calEvent.etag != '') {
            $('#event_calendar').val(calEvent.res_id);
        }
    }

    if (mod == 'new') {
        //$('[data-type="name"]').attr('placeholder', localization[globalInterfaceLanguage].pholderNewEvent);
        var date_to = null;

        if (calEvent !== null) {
            if (calEvent.realStart)
                date = calEvent.realStart;
            else
                date = calEvent.start;

            if (calEvent.realEnd)
                date_to = new Date(calEvent.realEnd.getTime());
            else
                date_to = new Date(calEvent.end.getTime());
        }

        if (!allDay && ((date_to == null) || ((date_to - date) == 0))) {
            date_to = new Date(date.getTime());

            if (globalSettings.defaulteventduration.value !== null)
                date_to.setMinutes(date_to.getMinutes() + globalSettings.defaulteventduration.value);
            else {
                date_to.setHours(globalSettings.calendarendofbusiness.value);
                date_to.setMinutes((globalSettings.calendarendofbusiness.value % 1) * 60);
            }

            if (date_to.getTime() < date.getTime())
                date_to.setDate(date_to.getDate() + 1);
        }

        var beforeScroll = $('#main').width() - $('#calendar').width();
        $('#calendar').fullCalendar('renderEvent', $.extend(new items('', date, date_to, localization[globalInterfaceLanguage].pholderNewEvent, allDay, 'fooUID', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''), {
            backgroundColor: hexToRgba(color, 0.9),
            borderColor: color,
            textColor: checkFontColor(color)
        }));
        var afterScroll = $('#main').width() - $('#calendar').width();
        rerenderCalendar(beforeScroll != afterScroll);

        if (allDay) {
            $('#allday').prop('checked', true);
            $('#time_from_cell').css('visibility', 'hidden');
            $('#time_to_cell').css('visibility', 'hidden');
            $('.timezone_row').css('display', 'none');
        }
        showTimezones('', '');
    }

    if (mod == 'show' || mod == 'drop') {
        if (calEvent.status == 'CANCELLED')
            $('#name').addClass('title_cancelled');

        $('#name').val(calEvent.title);
        $('#location').val(calEvent.location);

        if (calEvent.allDay == true) {
            $('#allday').prop('checked', true);
            $('#time_from_cell').css('visibility', 'hidden');
            $('#time_to_cell').css('visibility', 'hidden');
            $('.timezone_row').css('display', 'none');
        }

        if (calEvent.end)
            if (calEvent.realEnd && (mod != 'drop' || repeatOne != 'editOnly'))
                date_to = new Date(calEvent.realEnd.getTime());
            else
                date_to = new Date(calEvent.end.getTime());

        $('#note').val(calEvent.note).trigger('autosize.resize');
        if (typeof calEvent.classType != 'undefined' && calEvent.classType != null && calEvent.classType != '')
            $('#type').val(calEvent.classType.toLowerCase());
        else
            $('#type').val('public');

        if (calEvent.status != '')
            $('#status').val(calEvent.status);
        else
            $('#status').val('NONE');

        if (calEvent != null && mod != 'new') {
            var uidArray = calEvent.id.match(vCalendar.pre['uidParts']);
            if (decodeURIComponent(uidArray[4]).indexOf(uidArray[2]) == -1)
                $('.row_type').css('display', 'none');
        }

        if (calEvent.avail == 'OPAQUE')
            $('#avail').val('busy');
        else
            $('#avail').val('free');

        if (calEvent != null) {
            var prior = parseInt(calEvent.priority, 10);
            if (prior == 5)
                $('#priority').val(5);
            else if (prior > 5 && prior < 10) {
                $('#priority [data-type="priority_low"]').attr('value', prior)
                $('#priority').val(prior);
            } else if (prior < 5 && prior > 0) {
                $('#priority [data-type="priority_high"]').attr('value', prior)
                $('#priority').val(prior);
            } else
                $('#priority').val(0);
        }

        $('#uid').val(calEvent.id);
        // console.log("the calEvent.id is ",calEvent.id);
        $('#url_EVENT').val(calEvent.hrefUrl + '');
        $('#vcalendarHash').val(hex_sha256(calEvent.vcalendar));
        $('#etag').val(calEvent.etag);
        var stringUIDcurrent = calEvent.vcalendar.match(vCalendar.pre['contentline_UID']);

        if (stringUIDcurrent != null) {
            stringUIDcurrent = stringUIDcurrent[0].match(vCalendar.pre['contentline_parse'])[4];
        }

        if (stringUIDcurrent) {
            $('#vcalendarUID').val(stringUIDcurrent);
        }

        // 显示提醒
        var alarmDate = '';
        for (var alarmIterator = 0; alarmIterator < calEvent.alertTime.length; alarmIterator++) {
            if (alarmIterator > 0)
                event_alert_add(alarmIterator);

            $(".alert[data-id=" + (alarmIterator + 1) + "]").val("message");
            if (calEvent.alertTime[alarmIterator].charAt(0) == '-' || calEvent.alertTime[alarmIterator].charAt(0) == '+') {
                var alVal = parseInt(calEvent.alertTime[alarmIterator].substring(1, calEvent.alertTime[alarmIterator].length - 1));
                var alString = '';

                if (calEvent.alertTime[alarmIterator].charAt(calEvent.alertTime[alarmIterator].length - 1) == "W") {
                    alVal = alVal / 1000 / 60 / 60 / 24 / 7;
                    alString = 'weeks';
                } else if (calEvent.alertTime[alarmIterator].charAt(calEvent.alertTime[alarmIterator].length - 1) == "D") {
                    alVal = alVal / 1000 / 60 / 60 / 24;
                    alString = 'days';
                } else if (calEvent.alertTime[alarmIterator].charAt(calEvent.alertTime[alarmIterator].length - 1) == "H") {
                    alVal = alVal / 1000 / 60 / 60;
                    alString = 'hours';
                } else if (calEvent.alertTime[alarmIterator].charAt(calEvent.alertTime[alarmIterator].length - 1) == "M") {
                    alVal = alVal / 1000 / 60;
                    alString = 'minutes';
                } else if (calEvent.alertTime[alarmIterator].charAt(calEvent.alertTime[alarmIterator].length - 1) == "S") {
                    alVal = alVal / 1000;
                    alString = 'seconds';
                }

                if (calEvent.alertTime[alarmIterator].charAt(0) == '-')
                    alString += "_before";
                else
                    alString += "_after"

                $(".alert_message_details[data-id=" + (alarmIterator + 1) + "]").val(alString);
                $(".before_after_input[data-id=" + (alarmIterator + 1) + "]").val(alVal);
                $('.alert_details[data-id="' + (alarmIterator + 1) + '"]').show();
                $('.alert_message_date[data-id="' + (alarmIterator + 1) + '"]').show();
                $('.before_after_input[data-id="' + (alarmIterator + 1) + '"]').show();
                $(".message_date_input[data-id=" + (alarmIterator + 1) + "]").hide();
                $(".message_time_input[data-id=" + (alarmIterator + 1) + "]").hide();
            } else {
                alarmDate = $.fullCalendar.parseDate(calEvent.alertTime[alarmIterator]);
                (alarmDate.getHours()) < 10 ? (hour = '0' + (alarmDate.getHours())) : (hour = alarmDate.getHours());
                (alarmDate.getMinutes()) < 10 ? (minute = '0' + (alarmDate.getMinutes())) : (minute = alarmDate.getMinutes());

                $(".alert_message_details[data-id=" + (alarmIterator + 1) + "]").val('on_date');
                var formattedAlarmDate = $.datepicker.formatDate(globalSettings.datepickerformat.value, alarmDate);

                $(".message_date_input[data-id=" + (alarmIterator + 1) + "]").val(formattedAlarmDate);
                $(".message_time_input[data-id=" + (alarmIterator + 1) + "]").val($.fullCalendar.formatDate(alarmDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));

                $('.alert_details[data-id="' + (alarmIterator + 1) + '"]').show();
                $('.alert_message_date[data-id="' + (alarmIterator + 1) + '"]').show();
            }
        }

        if (alarmIterator > 0) {
            event_alert_add(alarmIterator + 2);
        }

        if (calEvent.type != '' && repeatOne != 'editOnly') {
            var ruleString = calEvent.vcalendar.match(vCalendar.pre['contentline_RRULE2'])[0].match(vCalendar.pre['contentline_parse'])[4];
            if (ruleString.indexOf('BYMONTH=') != -1 || ruleString.indexOf('BYMONTHDAY=') != -1 || ruleString.indexOf('BYDAY=') != -1) {
                pars = ruleString.split(';');

                if (pars.indexElementOf('BYMONTH=') != -1 && pars.indexElementOf('BYMONTHDAY=') == -1 && pars.indexElementOf('BYDAY=') == -1)
                    pars[pars.length] = "BYMONTHDAY=" + calEvent.start.getDate();
                if (calEvent.type == "DAILY") {
                    $("#repeat option[value='DAILY']").prop('selected', true);
                    $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatDays);
                } else if (calEvent.type == "WEEKLY") {
                    $("#repeat option[value='CUSTOM_WEEKLY']").prop('selected', true);
                    $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatWeeks);

                    for (var ri = 0; ri < pars.length; ri++) {
                        if (pars[ri].indexOf("BYDAY=") != -1) {
                            var byDay = pars[ri].split('=')[1];
                            byDay = byDay.replace(/\d*MO/, 1).replace(/\d*TU/, 2).replace(/\d*WE/, 3).replace(/\d*TH/, 4).replace(/\d*FR/, 5).replace(/\d*SA/, 6).replace(/\d*SU/, 0).split(',');
                            for (var rj = 0; rj < byDay.length; rj++) {
                                if (!isNaN(parseInt(byDay[rj], 10)))
                                    $('#week_custom .customTable td[data-type="' + byDay[rj] + '"]').addClass('selected');
                            }
                        }
                    }
                    $('#week_custom').show();
                } else if (calEvent.type == "MONTHLY") {
                    $("#repeat option[value='CUSTOM_MONTHLY']").prop('selected', true).change();
                    $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatMonths);


                    for (var ri = 0; ri < pars.length; ri++) {
                        if (pars[ri].indexOf("BYDAY=") != -1) {
                            var byDay = pars[ri].split('=')[1];
                            byDay = byDay.split(',');
                            for (var rj = 0; rj < byDay.length; rj++) {
                                var checkString = byDay[rj].match(vCalendar.pre['+/-number']);
                                byDay[rj] = byDay[rj].replace(checkString[0], '');
                                if (!isNaN(parseInt(checkString[0], 10))) {
                                    switch (parseInt(checkString[0], 10)) {
                                        case 1:
                                            $('#repeat_month_custom_select').val('first');
                                            break;
                                        case 2:
                                            $('#repeat_month_custom_select').val('second');
                                            break;
                                        case 3:
                                            $('#repeat_month_custom_select').val('third');
                                            break;
                                        case 4:
                                            $('#repeat_month_custom_select').val('fourth');
                                            break;
                                        case 5:
                                            $('#repeat_month_custom_select').val('fifth');
                                            break;
                                        case -1:
                                            $('#repeat_month_custom_select').val('last');
                                            break;
                                        default:
                                            $('#repeat_month_custom_select').val('every');
                                            break;
                                    }
                                    $('#repeat_month_custom_select2').val(byDay[rj]);
                                }
                            }
                        } else if (pars[ri].indexOf("BYMONTHDAY=") != -1) {
                            $('#repeat_month_custom_select').val('custom').change();
                            var byMonthDay = pars[ri].split('=')[1];
                            byMonthDay = byMonthDay.split(',');
                            for (var rj = 0; rj < byMonthDay.length; rj++) {
                                if (parseInt(byMonthDay[rj], 10) == -1) {
                                    $('#repeat_month_custom_select').val('last').change();
                                    $('#repeat_month_custom_select2').val("DAY");

                                } else
                                    $('#month_custom2 .customTable td[data-type="' + (parseInt(byMonthDay[rj], 10)) + '"]').addClass('selected');
                            }
                        }
                    }
                } else if (calEvent.type == "YEARLY") {
                    $("#repeat option[value='CUSTOM_YEARLY']").prop('selected', true).change();
                    $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatYears);
                    var isMonthDay = false;
                    for (var ri = 0; ri < pars.length; ri++) {
                        if (pars[ri].indexOf("BYDAY=") != -1) {
                            var byDay = pars[ri].split('=')[1];
                            byDay = byDay.split(',');
                            for (var rj = 0; rj < byDay.length; rj++) {
                                var checkString = byDay[rj].match(vCalendar.pre['+/-number']);
                                byDay[rj] = byDay[rj].replace(checkString[0], '');
                                if (!isNaN(parseInt(checkString[0], 10))) {
                                    switch (parseInt(checkString[0], 10)) {
                                        case 1:
                                            $('#repeat_year_custom_select1').val('first');
                                            break;
                                        case 2:
                                            $('#repeat_year_custom_select1').val('second');
                                            break;
                                        case 3:
                                            $('#repeat_year_custom_select1').val('third');
                                            break;
                                        case 4:
                                            $('#repeat_year_custom_select1').val('fourth');
                                            break;
                                        case 5:
                                            $('#repeat_year_custom_select1').val('fifth');
                                            break;
                                        case -1:
                                            $('#repeat_year_custom_select1').val('last');
                                            break;
                                        default:
                                            $('#repeat_year_custom_select1').val('every');
                                            break;
                                    }
                                    $('#repeat_year_custom_select2').val(byDay[rj]);
                                }
                            }
                        } else if (pars[ri].indexOf("BYMONTHDAY=") != -1) {
                            $('#repeat_year_custom_select1').val('custom').change()
                            var byMonthDay = pars[ri].split('=')[1];
                            byMonthDay = byMonthDay.split(',');
                            for (var rj = 0; rj < byMonthDay.length; rj++) {
                                if (parseInt(byMonthDay[rj], 10) == -1) {
                                    $('#repeat_year_custom_select1').val('last').change();
                                    $('#repeat_year_custom_select2').val("DAY");

                                } else
                                    $('#year_custom1 .customTable td[data-type="' + (parseInt(byMonthDay[rj], 10)) + '"]').addClass('selected');
                            }
                            isMonthDay = true;
                        } else if (pars[ri].indexOf("BYMONTH=") != -1) {
                            var byMonth = pars[ri].split('=')[1];
                            byMonth = byMonth.split(',');
                            for (var rj = 0; rj < byMonth.length; rj++)
                                $('#year_custom3 .customTable td[data-type="' + (parseInt(byMonth[rj], 10) - 1) + '"]').addClass('selected');
                        }
                    }
                }

                if (calEvent.after == '' && calEvent.untilDate == '')
                    $("#repeat_end_details option[value='never']").prop('selected', true);
                else if (calEvent.after != '') {
                    $("#repeat_end_details option[value='after']").prop('selected', true);
                    $('#repeat_end_after').val(calEvent.after);
                } else if (calEvent.untilDate != '') {
                    date = $.fullCalendar.parseDate(calEvent.untilDate);
                    $("#repeat_end_details option[value='on_date']").prop('selected', true);
                    var formattedRepeatDate = $.datepicker.formatDate(globalSettings.datepickerformat.value, date);
                    $('#repeat_end_date').val(formattedRepeatDate);
                }

                $('#repeat_interval_detail').val(calEvent.interval);
                $('#repeat_interval').show();

                if (calEvent.byDay.length > 0) {
                    var businessArray = new Array();
                    if (globalSettings.weekenddays.value.length > 0)
                        for (var i = 0; i < 7; i++)
                            if (globalSettings.weekenddays.value.indexOf(i) == -1)
                                businessArray[businessArray.length] = i + '';
                    var businessCount = 0;
                    var weekendCount = 0;
                    for (var i = 0; i < byDay.length; i++) {
                        if (businessArray.indexOf(byDay[i]) != -1)
                            businessCount++;
                        if (globalSettings.weekenddays.value.indexOf(parseInt(byDay[i], 10)) != -1)
                            weekendCount++;

                    }

                    if (businessArray.length > 0 && businessArray.length == businessCount) {
                        $("#repeat option[value='BUSINESS']").prop('selected', true);
                        $('#repeat_interval').hide();
                        $('#week_custom').hide();
                    } else if (globalSettings.weekenddays.value.length > 0 && globalSettings.weekenddays.value.length == weekendCount) {
                        $("#repeat option[value='WEEKEND']").prop('selected', true);
                        $('#repeat_interval').hide();
                        $('#week_custom').hide();
                    }
                }

            } else {
                if (calEvent.type == "DAILY") {
                    $("#repeat option[value='DAILY']").prop('selected', true);
                    $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatDays);
                } else if (calEvent.type == "WEEKLY") {
                    $("#repeat option[value='WEEKLY']").prop('selected', true);
                    $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatWeeks);
                } else if (calEvent.type == "MONTHLY") {
                    $("#repeat option[value='MONTHLY']").prop('selected', true);
                    $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatMonths);
                } else if (calEvent.type == "YEARLY") {
                    $("#repeat option[value='YEARLY']").prop('selected', true);
                    $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatYears);
                }

                if (calEvent.after == '' && calEvent.untilDate == '')
                    $("#repeat_end_details option[value='never']").prop('selected', true);
                else if (calEvent.after != '') {
                    $("#repeat_end_details option[value='after']").prop('selected', true);
                    $('#repeat_end_after').val(calEvent.after);
                } else if (calEvent.untilDate != '') {
                    date = $.fullCalendar.parseDate(calEvent.untilDate);
                    $("#repeat_end_details option[value='on_date']").prop('selected', true);
                    var formattedRepeatDate = $.datepicker.formatDate(globalSettings.datepickerformat.value, date);
                    $('#repeat_end_date').val(formattedRepeatDate);
                }

                $('#repeat_interval_detail').val(calEvent.interval);
                $('#repeat_interval').show();

                if (calEvent.byDay.length > 0) {
                    if (calEvent.byDay.indexOf('1') != -1 && calEvent.byDay.indexOf('2') != -1 && calEvent.byDay.indexOf('3') != -1 && calEvent.byDay.indexOf('4') != -1 && calEvent.byDay.indexOf('5') != -1 && calEvent.byDay.indexOf('6') == -1 && calEvent.byDay.indexOf('0') == -1) {
                        $("#repeat option[value='BUSINESS']").prop('selected', true);
                        $('#repeat_interval').hide();
                    } else if (calEvent.byDay.indexOf('1') == -1 && calEvent.byDay.indexOf('2') == -1 && calEvent.byDay.indexOf('3') == -1 && calEvent.byDay.indexOf('4') == -1 && calEvent.byDay.indexOf('5') == -1 && calEvent.byDay.indexOf('6') != -1 && calEvent.byDay.indexOf('0') != -1) {
                        $("#repeat option[value='WEEKEND']").prop('selected', true);
                        $('#repeat_interval').hide();
                    }
                }
                $('#repeatEvent').val(true);
            }
        } else
            $('#repeatEvent').val(false);

        if (calEvent.timeZone) {
            showTimezones(calEvent.timeZone, '');
        }
        else {
            showTimezones('local', '');
        }
    }

    var year,
        month,
        day,
        hour,
        minute;

    if (mod == 'show') {
        $('#show').val(calEvent.id);
    }
    if (mod == 'show' || mod == 'drop') {
        $('#repeatCount').val(calEvent.repeatCount);
        if (calEvent.realStart && (mod != 'drop' || repeatOne != 'editOnly'))
            date = calEvent.realStart;
        else
            date = calEvent.start;

        if ($('#show').val()) {
            if (calEvent.repeatStart && repeatOne == '')
                date = calEvent.repeatStart;
            if (calEvent.repeatEnd && repeatOne == '')
                date_to = new Date(calEvent.repeatEnd.getTime());

        }
        if (repeatOne == 'editOnly') {
            if ((mod == 'drop' && globalPrevDragEventAllDay) || (mod != 'drop' && calEvent.allDay)) {
                if (calEvent.realStart)
                    $('#recurrenceID').val($.fullCalendar.formatDate($.fullCalendar.parseDate(calEvent.realStart), "yyyyMMdd"));
                else
                    $('#recurrenceID').val($.fullCalendar.formatDate(date, "yyyyMMdd"));
            } else {
                if (calEvent.realStart)
                    $('#recurrenceID').val($.fullCalendar.formatDate(calEvent.realStart, "yyyyMMdd'T'HHmmss"));
                else
                    $('#recurrenceID').val($.fullCalendar.formatDate(date, "yyyyMMdd'T'HHmmss"));
            }
        } else
            $('#recurrenceID').val(calEvent.rec_id);

        if (calEvent.rec_id || repeatOne == 'editOnly' || repeatOne == 'futureOnly') {
            var savedEvs = jQuery.grep(globalEventList.displayEventsArray[calEvent.res_id], function(e) {
                if (e.id == calEvent.id && (e.repeatCount < 2 || !e.repeatCount)) return true
            });
            if (savedEvs.length > 1 || (repeatOne == 'futureOnly' && calEvent.repeatCount > 1) || (repeatOne == 'editOnly' && calEvent.type != ''))
                $('#deleteButton').attr('onclick', "updateEventFormDimensions(true);save(false, true);");
        }
    }

    var today = new Date();
    var todayClear = new Date(today.getTime());
    todayClear.setHours(0);
    todayClear.setMinutes(0);
    todayClear.setSeconds(0);
    todayClear.setMilliseconds(0);
    var dateClear = new Date(date.getTime());
    dateClear.setHours(0);
    dateClear.setMinutes(0);
    dateClear.setSeconds(0);
    dateClear.setMilliseconds(0);

    if (allDay) {
        if (globalSettings.defaulteventduration.value !== null && todayClear.getTime() === dateClear.getTime()) {
            if (today.getMinutes() > 0) {
                date.setHours(today.getHours() + 1);
                date.setMinutes(0);
            } else {
                date.setHours(today.getHours());
                date.setMinutes(today.setMinutes());
            }
        } else {
            date.setHours(globalSettings.calendarstartofbusiness.value);
            date.setMinutes((globalSettings.calendarstartofbusiness.value % 1) * 60);
        }
    }

    $('#date_from').val($.datepicker.formatDate(globalSettings.datepickerformat.value, date));
    $('#time_from').val($.fullCalendar.formatDate(date, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
    globalPrevDate = new Date(date.getTime());

    if (typeof date_to === 'undefined' || date_to === null) {
        date_to = new Date(date.getTime());
    }

    if (allDay) {
        if (globalSettings.defaulteventduration.value !== null) {
            date_to.setHours(date.getHours());
            date_to.setMinutes(date.getMinutes() + globalSettings.defaulteventduration.value);
        } else {
            date_to.setHours(globalSettings.calendarendofbusiness.value);
            date_to.setMinutes((globalSettings.calendarendofbusiness.value % 1) * 60);
        }
    }

    if (date_to.getTime() < date.getTime()) {
        date_to.setDate(date_to.getDate() + 1);
    }

    $('#date_to').val($.datepicker.formatDate(globalSettings.datepickerformat.value, date_to));
    $('#time_to').val($.fullCalendar.formatDate(date_to, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));

    if ($('#repeat option:selected').attr('data-type') != "repeat_no-repeat") {
        $('#repeat_details').show();
    }

    if ($('#repeat_end_details option:selected').attr('data-type') == "repeat_details_on_date") {
        $('#repeat_end_after').hide();
        $('#repeat_end_date').show();
    }

    if ($('#repeat_end_details option:selected').attr('data-type') == "repeat_details_after") {
        $('#repeat_end_after').show();
        $('#repeat_end_date').hide();
    }

    if ($('#repeat_end_details option:selected').attr('data-type') == "repeat_details_never") {
        $('#repeat_end_after').hide();
        $('#repeat_end_date').hide();
    }

    if (mod == 'show') {
        $('#saveButton').hide();
        // $('#resetButton').hide();
        $('#deleteButton').hide();
        if ($('#ResourceCalDAVList').find('[data-id="' + calEvent.res_id + '"]').hasClass("resourceCalDAV_item_ro")) {
            $('#editButton').hide();
            $('#editOptionsButton').hide();
        }
        $('#eventDetailsTable :input[type!="button"]').prop('disabled', true);
        $('#eventDetailsTable :input[type="text"]').prop('readonly', true);
        $('#eventDetailsTable .customTable td').addClass('disabled');
        $('#eventDetailsTable textarea').prop('readonly', true);

        /*************************** BAD HACKS SECTION ***************************/
        // here we fix the cross OS/cross broser problems (unfixable in pure CSS)
        if ($.browser.webkit && !!window.chrome) /* Chrome */ {
            if (navigator.platform.toLowerCase().indexOf('win') == 0) /* Windows version */ {
                // $('#event_details_template').find('input').css('text-indent', '2px');
                $('#event_details_template').find('select').css({
                    'padding-left': '0px',
                    'padding-right': '13px'
                });
            } else /* non-Windows version */
                $('#event_details_template').find('input').css('text-indent', '1px');
        } else if ($.browser.safari) {
            $('#event_details_template').find('textarea').addClass('safari_hack');
            $('#event_details_template').find('input').addClass('safari_hack');
        } else if ($.browser.msie) /* IE */ {
            if (parseInt($.browser.version, 10) == 10) /* IE 10 (because there are no more conditional comments) */ {
                $('#event_details_template').find('select').css({
                    'padding-top': '1px',
                    'padding-left': '0px',
                    'padding-right': '0px'
                });
                $('#event_details_template').find('textarea').css('padding-top', '3px');
                $('#event_details_template').find('input[type=button]').css('padding-top', '2px');
            }
        }

        if ($.browser.msie || $.browser.mozilla) {
            var newSVG = $(SVG_select_dis).attr('data-type', 'select_icon').css({
                'pointer-events': 'none',
                'z-index': '1',
                'display': 'inline',
                'margin-left': '-22px',
                'vertical-align': 'top',
                'background-color': '#ffffff'
            }); // background-color = stupid IE9 bug
            $('#event_details_template').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
        }
        /*************************** END OF BAD HACKS SECTION ***************************/
        if (calEvent.etag != '') {
            $('#event_calendar').val(calEvent.res_id);
        }
    }

    if (repeatOne == 'editOnly' || $('#recurrenceID').val() != '') {
        // $('#repeat').parent().parent().css('display', 'none');
        $('#week_custom').css('display', 'none');
        $('#month_custom1').css('display', 'none');
        $('#month_custom2').css('display', 'none');
        $('#year_custom1').css('display', 'none');
        $('#year_custom2').css('display', 'none');
        $('#year_custom3').css('display', 'none');
        $('#repeat_details').css('display', 'none');
    }

    if (repeatOne == 'editOnly' || repeatOne == 'futureOnly' || $('#recurrenceID').val())
    // $('#calendarLine').hide();
        if (calEvent == null || calEvent.type == '')
            $('#editOptionsButton').hide();
        else
            $('#editOptionsButton').click(function() {
                showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', '', true);
            });
    if (calEvent && calEvent.after && repeatOne == 'futureOnly') {
        $('#repeat_end_after').val(calEvent.after - calEvent.realRepeatCount + 1);
    }

    if (!globalSettings.timezonesupport.value) {
        $('.timezone_row').css('display', 'none');
    }

    if ($('#allday').prop('checked')) {
        stripEventAlerts();
    }

    if (mod != 'drop') {
        $('#CAEvent').show();
        $('#event_details_template').show();
        $('#eventColor').css('background-color', color);
        updateEventFormDimensions();
        setFormPosition(jsEvent);
    }

    checkEventFormScrollBar();
    $('#event_details_template').scrollTop(0);

    // --bug: repeat show..--
    if (calEvent && calEvent.type) {
        // 若为重复事件
        switch (calEvent.type) {
            case "no-repeat":
                break;
            case "DAILY":
                $("#repeat").val("DAILY");
                $("#repeat_details").parent().show();
                $("#repeat_details").show();
                var tmp_date = $.fullCalendar.parseDate(calEvent.untilDate);
                var formattedRepeatDate = $.datepicker.formatDate(globalSettings.datepickerformat.value, tmp_date);
                $('#repeat_end_date').val(formattedRepeatDate);
                break;
            case "WEEKLY":
                $("#repeat").val("WEEKLY");
                $("#repeat_details").parent().show();
                $("#repeat_details").show();
                var tmp_date = $.fullCalendar.parseDate(calEvent.untilDate);
                var formattedRepeatDate = $.datepicker.formatDate(globalSettings.datepickerformat.value, tmp_date);
                $('#repeat_end_date').val(formattedRepeatDate);
                break;
            case "TWO_WEEKLY":
                $("#repeat").val("TWO_WEEKLY");
                $("#repeat_details").parent().show();
                $("#repeat_details").show();
                var tmp_date = $.fullCalendar.parseDate(calEvent.untilDate);
                var formattedRepeatDate = $.datepicker.formatDate(globalSettings.datepickerformat.value, tmp_date);
                $('#repeat_end_date').val(formattedRepeatDate);
                break;
            case "MONTHLY":
                $("#repeat").val("MONTHLY");
                $("#repeat_details").parent().show();
                $("#repeat_details").show();
                var tmp_date = $.fullCalendar.parseDate(calEvent.untilDate);
                var formattedRepeatDate = $.datepicker.formatDate(globalSettings.datepickerformat.value, tmp_date);
                $('#repeat_end_date').val(formattedRepeatDate);
                break;
            case "YEARLY":
                $("#repeat").val("YEARLY");
                $("#repeat_details").parent().show();
                $("#repeat_details").show();
                var tmp_date = $.fullCalendar.parseDate(calEvent.untilDate);
                var formattedRepeatDate = $.datepicker.formatDate(globalSettings.datepickerformat.value, tmp_date);
                $('#repeat_end_date').val(formattedRepeatDate);
                break;
            default:
                alert("new calEvent.type! please check...");
                break;
        }
    }
    // ----------------------
    startEditModeEvent();
    if (calEvent && calEvent.isInvitation && !calEvent.isOrganizer) {
        // 是邀请事件，但不是组织者：将添加邀请人按钮，和确定按钮隐藏
        $('#saveButton').css('display', 'none');
        $('#addPartner').css('display', 'none');
    }
}

function bindEventForm() {
    initCalDavDatepicker($('#event_details_template'));
    initCalDavTimepicker($('#event_details_template'));

    $('#event_details_template .alert_message_details').change(function() {
        var data_id = $(this).attr("data-id");
        $('.before_after_input[data-id="' + data_id + '"]').parent().parent().find('img').css('display', 'none');
        if ($('.alert_message_details[data-id="' + data_id + '"] option:selected').attr('data-type') == "on_date") {
            var myDate = new Date();
            myDate.setDate(myDate.getDate() + 7);

            if ($('#date_from').parent().parent().find('img:visible').length == 0) {
                var dateTo = $.datepicker.parseDate(globalSettings.datepickerformat.value, $("#date_from").val());
                var datetime_to = $.fullCalendar.formatDate(dateTo, 'MM/dd/yyyy, ');
                myDate = new Date(Date.parse(datetime_to + (!$("#allday").prop('checked') ? $("#time_from").val() : '')));
                myDate.setHours(myDate.getHours() - 1);
            } else if ($('#date_to').parent().parent().find('img:visible').length == 0) {
                var dateTo = $.datepicker.parseDate(globalSettings.datepickerformat.value, $("#date_to").val());
                var datetime_to = $.fullCalendar.formatDate(dateTo, 'MM/dd/yyyy, ');
                myDate = new Date(Date.parse(datetime_to + (!$("#allday").prop('checked') ? $("#time_to").val() : '')));
                myDate.setHours(myDate.getHours() - 1);
            }
            $('.message_date_input[data-id="' + data_id + '"]').val($.datepicker.formatDate(globalSettings.datepickerformat.value, myDate));
            $('.message_date_input[data-id="' + data_id + '"]').show();
            $('.message_time_input[data-id="' + data_id + '"]').val($.fullCalendar.formatDate(myDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
            $('.message_time_input[data-id="' + data_id + '"]').show();
            $('.before_after_input[data-id="' + data_id + '"]').hide();
        } else {
            $('.message_date_input[data-id="' + data_id + '"]').hide();
            $('.message_time_input[data-id="' + data_id + '"]').hide();
            $('.before_after_input[data-id="' + data_id + '"]').show();
            $('.before_after_input[data-id="' + data_id + '"]').val('15');
        }
    });

    $('#event_details_template .before_after_input').bind('keyup change', function() {
        if ($(this).val() == '') {
            $(this).parent().find('img').css('display', 'inline');
            //$(this).parent().find('img').css('visibility','visible');
        } else {
            if ($(this).val().match("^(\d*[0-9])*$") == null) {
                $(this).parent().find('img').css('display', 'inline');
                //$(this).parent().find('img').css('visibility','visible');
            } else {
                $(this).parent().find('img').css('display', 'none');
            }
        }
    });


    $('#event_details_template .alert').change(function() {
        // 原版本中的下拉列表 none / message
        var data_id = $(this).attr("data-id");
        if ($(this).val() != 'none') {
            $('.alert_details[data-id="' + data_id + '"]').show();
            $('.alert_message_date[data-id="' + data_id + '"]').show();
            var myDate = new Date();
            myDate.setDate(myDate.getDate() + 7);

            if ($('#date_from').parent().parent().find('img:visible').length == 0) {
                var dateTo = $.datepicker.parseDate(globalSettings.datepickerformat.value, $("#date_from").val());
                var datetime_to = $.fullCalendar.formatDate(dateTo, 'MM/dd/yyyy, ');
                myDate = new Date(Date.parse(datetime_to + (!$("#allday").prop('checked') ? $("#time_from").val() : '')));
                myDate.setHours(myDate.getHours() - 1);
            } else if ($('#date_to').parent().parent().find('img:visible').length == 0) {
                var dateTo = $.datepicker.parseDate(globalSettings.datepickerformat.value, $("#date_to").val());
                var datetime_to = $.fullCalendar.formatDate(dateTo, 'MM/dd/yyyy, ');
                myDate = new Date(Date.parse(datetime_to + (!$("#allday").prop('checked') ? $("#time_to").val() : '')));
                myDate.setHours(myDate.getHours() - 1);
            }
            $('.message_date_input[data-id="' + data_id + '"]').val($.datepicker.formatDate(globalSettings.datepickerformat.value, myDate));
            $('.message_time_input[data-id="' + data_id + '"]').val($.fullCalendar.formatDate(myDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
            event_alert_add(data_id);
        } else {
            $('.alert_details[data-id="' + data_id + '"]').hide();
            $('.alert_message_date[data-id="' + data_id + '"]').hide();
            checkFor(data_id);
            var data_id = $(this).attr("data-id");
            $('#event_details_template tr[data-id="' + data_id + '"]').remove();
        }
        checkEventFormScrollBar();
    });

    $('#repeat_end_after, #repeat_interval_detail').bind('keyup change', function() {
        if ($(this).val() == '') {
            $(this).parent().find('img').css('display', 'inline');
            //$(this).parent().find('img').css('visibility','visible');
        } else {
            if ($(this).val().match("^[0-9]+$") == null || parseInt($(this).val(), 10) < 1) {
                $(this).parent().find('img').css('display', 'inline');
                //$(this).parent().find('img').css('visibility','visible');
            } else
                $(this).parent().find('img').css('display', 'none');
        }
    });

    $('#repeat_month_custom_select').change(function() {
        if ($(this).val() == "custom") {
            $('#month_custom2').show();
            $('#repeat_month_custom_select2').parent().hide();
        } else {
            $('#month_custom2').hide();
            $('#repeat_month_custom_select2').parent().show();
        }
        checkEventFormScrollBar();
    });

    $('#repeat_year_custom_select1').change(function() {
        if ($(this).val() == "custom") {
            $('#year_custom1').show();
            $('#repeat_year_custom_select2').parent().hide();
        } else {
            $('#year_custom1').hide();
            $('#repeat_year_custom_select2').parent().show();
        }
        checkEventFormScrollBar();
    });

    $('#repeat_end_details').change(function() {
        $('#repeat_end_date').parent().find('img').css('display', 'none');

        if ($('#repeat_end_details option:selected').attr('data-type') == "repeat_details_on_date") {
            $('#repeat_end_after').hide();
            $('#repeat_end_date').show();

            var today;
            if ($('#date_from').val() != '') {
                today = $.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val());
                if (today == null)
                    today = new Date();
            } else
                today = new Date();

            var date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
            $('#repeat_end_date').val($.datepicker.formatDate(globalSettings.datepickerformat.value, date));
        }

        if ($('#repeat_end_details option:selected').attr('data-type') == "repeat_details_after") {
            $('#repeat_end_after').show();
            $('#repeat_end_after').val('2');
            $('#repeat_end_date').hide();
        }

        if ($('#repeat_end_details option:selected').attr('data-type') == "repeat_details_never") {
            $('#repeat_end_after').hide();
            $('#repeat_end_date').hide();
        }

        checkEventFormScrollBar();
    });

    $('#closeButton').click(function() {
        if ($('#uid').val() != '') {
            var uid = $('#uid').val();
            var calUID = uid.substring(0, uid.lastIndexOf('/') + 1);
            var events = $('.event_item[data-id="' + uid + '"]');
            // var color=$('#ResourceCalDAVList').find("[data-id='"+calUID+"']").find('.resourceCalDAVColor').css('background-color');
            var color = $('#ResourceCalDAVList').find("[data-id='" + calUID + "']").find('.labelafter').css('background-color');

            $.each(events, function(index, event) {
                if (event.nodeName.toLowerCase() != 'tr') {
                    $(event).find('.fc-event-inner, .fc-event-head').addBack().css({
                        'background-color': rgbToRgba(color, 0.9),
                        'border-color': color
                    });
                    $(event).find('.fc-event-title, .fc-event-title-strict, .fc-event-time').css('color', checkFontColor(rgbToHex(color)));
                } else {
                    $(event).children('.fc-event-handle').css({
                        'background-color': rgbToRgba(color, 0.9),
                        'border-color': color
                    });
                }
            });
        } else {
            var beforeScroll = $('#main').width() - $('#calendar').width();
            $('#calendar').fullCalendar('unselect');
            $('#calendar').fullCalendar('removeEvents', 'fooUID');
            var afterScroll = $('#main').width() - $('#calendar').width();
            rerenderCalendar(beforeScroll != afterScroll);
        }

        $('#show').val('');
        $('#CAEvent').hide();
        $('#EventDisabler').fadeOut(globalEditorFadeAnimation, function() {
            $('#timezonePicker').prop('disabled', false);
        });
    });

    // $('#resetButton').click(function() {
    //  $('#event_details_template').find('img[data-type=invalidSmall]').css('display','none');
    //  var uid=$('#uid').val();

    //  if (uid!='')
    //  {
    //      var calUID=uid.substring(0, uid.lastIndexOf('/')+1);
    //      var events=$('.event_item[data-id="'+uid+'"]');
    //      var color=$('#ResourceCalDAVList').find("[data-id='"+calUID+"']").find('.resourceCalDAVColor').css('background-color');

    //      $.each(events, function(index, event) {
    //          if (event.nodeName.toLowerCase()!='tr')
    //          {
    //              $(event).find('.fc-event-inner, .fc-event-head').addBack().css({'background-color': rgbToRgba(color,0.9), 'border-color': color});
    //              $(event).find('.fc-event-title, .fc-event-title-strict, .fc-event-time').css('color',checkFontColor(rgbToHex(color)));
    //          }
    //          else
    //          {
    //              $(event).children('.fc-event-handle').css({'background-color': rgbToRgba(color,0.9), 'border-color': color})
    //          }
    //      });
    //      if ($('#recurrenceID').val()!='' && $('#repeatCount').val()!='')
    //          showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', 'editOnly');
    //      else if ($('#futureStart').val()!='')
    //          showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', 'futureOnly');
    //      else
    //          showEventForm(null, globalCalEvent.allDay, globalCalEvent, globalJsEvent, 'show', '');
    //      startEditModeEvent();
    //  }
    // });

    $('#allday').click(function() {
        if ($('#allday').prop('checked')) {
            $('#timezone').val('local');
            $('#time_from_cell').css('visibility', 'hidden');
            $('#time_to_cell').css('visibility', 'hidden');
            $('#time_to_cell').find('img').css('display', 'none');
            $('#time_from_cell').find('img').css('display', 'none');
            $('.timezone_row').css('display', 'none');
            stripEventAlerts();
        } else {
            $('#time_from_cell').css('visibility', 'visible');
            $('#time_to_cell').css('visibility', 'visible');
            $('#time_from').trigger('change');
            $('#time_to').trigger('change');
            if (globalSettings.timezonesupport.value) {
                var a = true;
                $('.timezone_row').show();
                $('#timezone').val(globalSessionTimeZone);
            }
            expandEventAlerts();
        }
        checkEventFormScrollBar();
    });


    $('#event_details_template .customTable td').click(function() {
        if ($(this).hasClass('disabled'))
            return true;
        else if ($(this).hasClass('selected'))
            $(this).removeClass('selected');
        else
            $(this).addClass('selected');
    });

    $('#event_calendar').change(function() {
        var color = '';
        if ($(this).val() == 'choose')
            color = 'rgb(240,240,240)';
        else
        // color=$('#ResourceCalDAVList').find("[data-id='"+$(this).val()+"']").find('.resourceCalDAVColor').css('background-color');
            color = $('#ResourceCalDAVList').find("[data-id='" + $(this).val() + "']").find('.labelafter').css('background-color');

        var uid = 'fooUID';
        if ($('#uid').val() != '')
            uid = $('#uid').val();
        var events = $('.event_item[data-id="' + uid + '"]');

        $('#eventColor').css('background-color', color);
        $.each(events, function(index, event) {
            if (event.nodeName.toLowerCase() != 'tr') {
                $(event).find('.fc-event-inner, .fc-event-head').addBack().css({
                    'background-color': rgbToRgba(color, 0.9),
                    'border-color': color
                });
                $(event).find('.fc-event-title, .fc-event-title-strict, .fc-event-time').css('color', checkFontColor(rgbToHex(color)));
            } else {
                $(event).find('.fc-event-handle').css({
                    'background-color': rgbToRgba(color, 0.9),
                    'border-color': color
                });
            }
        });
    });

    $('#repeat').change(function() {
        if ($('#repeat option:selected').attr('data-type') == 'repeat_no-repeat') {
            $('div.endrepeatContainer').hide();
            // $('div.endrepeatContainer').css('display', 'block');
            $('#repeat_details').hide();
            $('#repeat_interval').hide();
            $('#week_custom').hide();
            $('#month_custom1').hide();
            $('#month_custom2').hide();
            $('#year_custom1').hide();
            $('#year_custom2').hide();
            $('#year_custom3').hide();
        } else {
            $('div.endrepeatContainer').show();
            // $('div.endrepeatContainer').css('display', 'block');
            $('#repeat_details').show();

            if ($(this).val() != 'BUSINESS' && $(this).val() != 'TWO_WEEKLY' && $(this).val() != 'WEEKEND') {
                $('#repeat_interval').show();
                $("#repeat_interval_detail").val('1');
                $('#repeat_interval').find('img').css('display', 'none');
            } else
                $('#repeat_interval').hide();

            if ($(this).val() == 'DAILY')
                $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatDays);

            if ($(this).val() == 'WEEKLY')
                $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatWeeks);

            if ($(this).val() == 'MONTHLY')
                $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatMonths);

            if ($(this).val() == 'YEARLY')
                $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatYears);

            if ($(this).val() == 'CUSTOM_WEEKLY') {
                $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatWeeks);
                $('#week_custom').show();
            } else
                $('#week_custom').hide();

            if ($(this).val() == 'CUSTOM_MONTHLY') {
                $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatMonths);
                $('#month_custom1').show();
                if ($('#repeat_month_custom_select').val() == "custom")
                    $('#repeat_month_custom_select').trigger('change');
            } else {
                $('#month_custom1').hide();
                $('#month_custom2').hide();
            }

            if ($(this).val() == 'CUSTOM_YEARLY') {
                $('#repeat_interval [data-type="txt_interval"]').text(localization[globalInterfaceLanguage].repeatYears);
                $('#year_custom2').show();
                $('#year_custom3').show();
                if ($('#repeat_year_custom_select1').val() == "custom")
                    $('#repeat_year_custom_select1').trigger('change');
            } else {
                $('#year_custom1').hide();
                $('#year_custom2').hide();
                $('#year_custom3').hide();
            }

            var today;
            if ($('#date_from').val() != '') {
                today = $.datepicker.parseDate(globalSettings.datepickerformat.value, $('#date_from').val());
                if (today == null)
                    today = new Date();
            } else
                today = new Date();

            var date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
            $('#repeat_end_date').val($.datepicker.formatDate(globalSettings.datepickerformat.value, date));
        }
        checkEventFormScrollBar();
    });

    $('#status').change(function() {
        var status = $(this).val();

        if (status == 'CANCELLED')
            $('#name').addClass('title_cancelled');
        else
            $('#name').removeClass('title_cancelled');

        todoStatusChanged(status);
    });
}

function startEditModeEvent() {
    $('#timezonePicker').prop('disabled', true);
    $('#EventDisabler').fadeIn(globalEditorFadeAnimation);
    $('#CAEvent .formNav').css('display', 'none');
    $('#CAEvent textarea.header').removeClass('leftspace rightspace');
    $('#editButton').hide();
    $('#duplicateButton').hide();
    $('#editOptionsButton').hide();
    $('#saveButton').show();
    // $('#resetButton').show();
    $('#deleteButton').show();
    $('#show').val('');
    $('#eventDetailsTable :input[disabled]').prop('disabled', false);
    $('#eventDetailsTable :input[type="text"]').prop('readonly', false);
    $('#eventDetailsTable .customTable td').removeClass('disabled');
    $('#eventDetailsTable textarea').prop('readonly', false);
    /*************************** BAD HACKS SECTION ***************************/
    if ($.browser.msie || $.browser.mozilla) {
        var newSVG = $(SVG_select).attr('data-type', 'select_icon').css({
            'pointer-events': 'none',
            'z-index': '1',
            'display': 'inline',
            'margin-left': '-19px',
            'vertical-align': 'top',
            'background-color': '#ffffff'
        }); // background-color = stupid IE9 bug
        $('#event_details_template').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
    }
    /*************************** END OF BAD HACKS SECTION ***************************/

    $('#name').focus();
}

function event_alert_add(data_id) {
    data_id++;

    var newTr1,
        newTr2,
        newTr3;

    newTr1 = '<tr data-id="' + data_id + '">' +
        '<td><label data-type="alert" for="alert">alert: </label></td>' +
        '<td data-size="full" colspan="2">' +
        '<select class="long alert" name="alert_type" data-id="' + data_id + '">' +
        '<option data-type="alert_none" value="none">none</option>' +
        '<option data-type="alert_message" value="message">message</option>' +
        '</select>' +
        '</td>' +
        '</tr>';
    newTr2 = '<tr data-id="' + data_id + '" class="alert_details" style="display:none;">' +
        '<td></td>' +
        '<td data-size="full" colspan="2">' +
        '<select class="long alert_message_details" name="alert_details" data-id="' + data_id + '">' +
        '<option data-type="on_date" value="on_date">On date</option>' +
        ($('#allday').prop('checked') ? '' : '<option data-type="weeks_before" value="weeks_before">weeks before</option>' +
            '<option data-type="days_before" value="days_before">days before</option>' +
            '<option data-type="hours_before" value="hours_before">hours before</option>' +
            '<option data-type="minutes_before" value="minutes_before">minutes before</option>' +
            '<option data-type="seconds_before" value="seconds_before">seconds before</option>' +
            '<option data-type="weeks_after" value="weeks_after">weeks after</option>' +
            '<option data-type="days_after" value="days_after">days after</option>' +
            '<option data-type="hours_after" value="hours_after">hours after</option>' +
            '<option data-type="minutes_after" value="minutes_after">minutes after</option>' +
            '<option data-type="seconds_after" value="seconds_after">seconds after</option>') +
        '</select>' +
        '</td>' +
        '</tr>';
    newTr3 = '<tr data-id="' + data_id + '" class="alert_message_date" style="display:none;">' +
        '<td></td>' +
        '<td><input class="small before_after_input" data-type="PH_before_after_alert" type="text" data-id="' + data_id + '" style="display:none;" />' +
        '<input class="date small message_date_input" data-type="PH_alarm_date" type="text" data-id="' + data_id + '" /><div class="invalidWrapper"><img data-type="invalidSmall" data-id="' + data_id + '" style="display: none;" src="images/error_b.svg" alt="invalid" /></div></td>' +
        '<td><input class="time small message_time_input" data-type="PH_alarm_time" type="text" data-id="' + data_id + '" /><div class="invalidWrapper"><img data-type="invalidSmall" data-id="' + data_id + '" style="display: none;" src="images/error_b.svg" alt="invalid" /></div></td>' +
        '<tr>';

    $('#url_tr').before(newTr1);
    $('#url_tr').before(newTr2);
    $('#url_tr').before(newTr3);

    translateEventAlerts();
    $('#event_details_template').find('input[placeholder],textarea[placeholder]').placeholder();

    $('#event_details_template .before_after_input[data-id="' + data_id + '"]').bind('keyup change', function() {
        if ($(this).val() == '') {
            $(this).parent().find('img').css('display', 'inline');
            //$(this).parent().find('img').css('visibility','visible');
        } else {
            if ($(this).val().match("^(\d*[0-9])*$") == null) {
                $(this).parent().find('img').css('display', 'inline');
                //$(this).parent().find('img').css('visibility','visible');
            } else
                $(this).parent().find('img').css('display', 'none');
        }
    });
    $('#event_details_template .alert[data-id="' + data_id + '"]').change(function() {
        var data_id = $(this).attr("data-id");
        if ($(this).val() != 'none') {
            $('.alert_details[data-id="' + data_id + '"]').show();
            $('.alert_message_date[data-id="' + data_id + '"]').show();
            if (!$('#allday').prop('checked'))
                expandEventAlerts();
            var myDate = new Date();
            myDate.setDate(myDate.getDate() + 7);

            if ($('#date_from').parent().parent().find('img:visible').length == 0) {
                var dateTo = $.datepicker.parseDate(globalSettings.datepickerformat.value, $("#date_from").val());
                var datetime_to = $.fullCalendar.formatDate(dateTo, 'MM/dd/yyyy, ');
                myDate = new Date(Date.parse(datetime_to + (!$("#allday").prop('checked') ? $("#time_from").val() : '')));
                myDate.setHours(myDate.getHours() - 1);
            } else if ($('#date_to').parent().parent().find('img:visible').length == 0) {
                var dateTo = $.datepicker.parseDate(globalSettings.datepickerformat.value, $("#date_to").val());
                var datetime_to = $.fullCalendar.formatDate(dateTo, 'MM/dd/yyyy, ');
                myDate = new Date(Date.parse(datetime_to + (!$("#allday").prop('checked') ? $("#time_to").val() : '')));
                myDate.setHours(myDate.getHours() - 1);
            }
            $('.message_date_input[data-id="' + data_id + '"]').val($.datepicker.formatDate(globalSettings.datepickerformat.value, myDate));
            $('.message_time_input[data-id="' + data_id + '"]').val($.fullCalendar.formatDate(myDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
            event_alert_add(data_id);
        } else {
            $('.alert_details[data-id="' + data_id + '"]').hide();
            $('.alert_message_date[data-id="' + data_id + '"]').hide();
            checkFor(data_id);
            var data_id = $(this).attr("data-id");
            $('#event_details_template tr[data-id="' + data_id + '"]').remove();
        }
        checkEventFormScrollBar();
    });
    $('#event_details_template .alert_message_details[data-id="' + data_id + '"]').change(function() {
        var data_id = $(this).attr("data-id");
        $('.before_after_input[data-id="' + data_id + '"]').parent().parent().find('img').css('display', 'none');
        if ($('.alert_message_details[data-id="' + data_id + '"] option:selected').attr('data-type') == "on_date") {
            var myDate = new Date();
            myDate.setDate(myDate.getDate() + 7);

            if ($('#date_from').parent().parent().find('img:visible').length == 0) {
                var dateTo = $.datepicker.parseDate(globalSettings.datepickerformat.value, $("#date_from").val());
                var datetime_to = $.fullCalendar.formatDate(dateTo, 'MM/dd/yyyy, ');
                myDate = new Date(Date.parse(datetime_to + (!$("#allday").prop('checked') ? $("#time_from").val() : '')));
                myDate.setHours(myDate.getHours() - 1);
            } else if ($('#date_to').parent().parent().find('img:visible').length == 0) {
                var dateTo = $.datepicker.parseDate(globalSettings.datepickerformat.value, $("#date_to").val());
                var datetime_to = $.fullCalendar.formatDate(dateTo, 'MM/dd/yyyy, ');
                myDate = new Date(Date.parse(datetime_to + (!$("#allday").prop('checked') ? $("#time_to").val() : '')));
                myDate.setHours(myDate.getHours() - 1);
            }
            $('.message_date_input[data-id="' + data_id + '"]').val($.datepicker.formatDate(globalSettings.datepickerformat.value, myDate));
            $('.message_date_input[data-id="' + data_id + '"]').show();
            $('.message_time_input[data-id="' + data_id + '"]').val($.fullCalendar.formatDate(myDate, (globalSettings.ampmformat.value ? 'hh:mm TT' : 'HH:mm')));
            $('.message_time_input[data-id="' + data_id + '"]').show();
            $('.before_after_input[data-id="' + data_id + '"]').hide();
        } else {
            $('.message_date_input[data-id="' + data_id + '"]').hide();
            $('.message_time_input[data-id="' + data_id + '"]').hide();
            $('.before_after_input[data-id="' + data_id + '"]').show();
            $('.before_after_input[data-id="' + data_id + '"]').val('15');
        }
    });
    initCalDavDatepicker($('#event_details_template .alert_message_date[data-id="' + data_id + '"]'));
    initCalDavTimepicker($('#event_details_template .alert_message_date[data-id="' + data_id + '"]'));
    /*************************** BAD HACKS SECTION ***************************/
    // here we fix the cross OS/cross broser problems (unfixable in pure CSS)
    if ($.browser.webkit && !!window.chrome) /* Chrome */ {
        if (navigator.platform.toLowerCase().indexOf('win') == 0) /* Windows version */ {
            // $('#event_details_template').find('input').css('text-indent', '2px');
            $('#event_details_template').find('select').css({
                'padding-left': '0px',
                'padding-right': '13px'
            });
        } else /* non-Windows version */
            $('#event_details_template').find('input').css('text-indent', '1px');
    } else if ($.browser.safari) {
        $('#event_details_template').find('textarea').addClass('safari_hack');
        $('#event_details_template').find('input').addClass('safari_hack');
    } else if ($.browser.msie) /* IE */ {
        if (parseInt($.browser.version, 10) == 10) /* IE 10 (because there are no more conditional comments) */ {
            $('#event_details_template').find('select').css({
                'padding-top': '1px',
                'padding-left': '0px',
                'padding-right': '0px'
            });
            $('#event_details_template').find('textarea').css('padding-top', '3px');
            $('#event_details_template').find('input[type=button]').css('padding-top', '2px');
        }
    }

    /* IE or FF */
    if ($.browser.msie || $.browser.mozilla) {
        // ADD empty SVG to interface (we will replace it later)
        $('<svg data-type="select_icon"></svg>').css('display', 'none').insertAfter($('#event_details_template tr[data-id="' + data_id + '"]').find('select'));
    }

    if ($.browser.msie || $.browser.mozilla) {
        var newSVG = $(SVG_select).attr('data-type', 'select_icon').css({
            'pointer-events': 'none',
            'z-index': '1',
            'display': 'inline',
            'margin-left': '-19px',
            'vertical-align': 'top',
            'background-color': '#ffffff'
        }); // background-color = stupid IE9 bug
        $('#event_details_template tr[data-id="' + data_id + '"]').find('svg[data-type="select_icon"]').replaceWith($('<div>').append($(newSVG).clone()).html());
    }
    /*************************** END OF BAD HACKS SECTION ***************************/
}

function stripEventAlerts() {
    $('.alert_message_details').each(function() {
        if ($(this).val() == 'on_date')
            $(this).find('option').not(':selected').remove();
        else {
            var dataID = $(this).parent().parent().attr('data-id');
            $('#event_details_template').find('tr[data-id="' + dataID + '"]').remove();
        }
    });
}

function expandEventAlerts() {
    $('.alert_message_details').each(function() {
        var value = $(this).val();
        $(this).html('<option data-type="on_date" value="on_date">on date</option>' +
            '<option data-type="weeks_before" value="weeks_before">weeks before</option>' +
            '<option data-type="days_before" value="days_before">days before</option>' +
            '<option data-type="hours_before" value="hours_before">hours before</option>' +
            '<option data-type="minutes_before" value="minutes_before">minutes before</option>' +
            '<option data-type="seconds_before" value="seconds_before">seconds before</option>' +
            '<option data-type="weeks_after" value="weeks_after">weeks after</option>' +
            '<option data-type="days_after" value="days_after">days after</option>' +
            '<option data-type="hours_after" value="hours_after">hours after</option>' +
            '<option data-type="minutes_after" value="minutes_after">minutes after</option>' +
            '<option data-type="seconds_after" value="seconds_after">seconds after</option>');
        $(this).val(value);
    });
    translateEventAlerts();
}


