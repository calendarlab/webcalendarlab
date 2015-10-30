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

// NOTE: see readme.txt before you start to configure this client!

// ===================================================================================================
	// 语言?
		// default interface language - see localization.js
		//  supported languages (note: this option is case sensitive):
		//   cs_CZ (ÄŒeÅ¡tina [Czech])
		//   da_DK (Dansk [Danish]; thanks Niels Bo Andersen)
		//   de_DE (Deutsch [German]; thanks Marten Gajda and Thomas Scheel)
		//   en_US (English [English/US])
		//   es_ES (EspaÃ±ol [Spanish]; thanks DamiÃ¡n Vila)
		//   fr_FR (FranÃ§ais [French]; thanks John Fischer)
		//   it_IT (Italiano [Italian]; thanks Luca Ferrario)
		//   ja_JP (æ—¥æœ¬è?[Japan]; thanks Muimu Nakayama)
		//   hu_HU (Magyar [Hungarian])
		//   nl_NL (Nederlands [Dutch]; thanks Johan Vromans)
		//   sk_SK (SlovenÄina [Slovak])
		//   tr_TR (TÃ¼rkÃ§e [Turkish]; thanks Selcuk Pultar)
		//   ru_RU (Ð ÑƒÑÑÐºÐ¸Ð¹ [Russian]; thanks ÐÐ»ÐµÐºÑÐ°Ð½Ð´Ñ?Ð¡Ð¸Ð¼Ð¾Ð½Ð¾Ð²)
		//   uk_UA (Ð£ÐºÑ€Ð°Ñ—Ð½ÑÑŒÐºÐ?[Ukrainian]; thanks Serge Yakimchuck)
		var globalInterfaceLanguage = 'zh_CN';

		// if defined and not empty then only languages listed here are shown at the login screen (for example: ['en_US', 'sk_SK']),
		//  otherwise (default) all languages are shown
		//  values in the array must refer to an existing localization defined in the common.js (see the option above)
		var globalInterfaceCustomLanguages = [];

	// 界面显示相关...
		// 每周第一天： 周日?，周一?...
			// set the datepicker first day of the week: Sunday is 0, Monday is 1, etc.
			var globalDatepickerFirstDayOfWeek = 1;
		// editor hide information message (success, error) after X miliseconds
			var globalHideInfoMessageAfter = 1800;
		// editor fade in/out animation duration (editing or saving)
			var globalEditorFadeAnimation = 666;
		// if more than one resource (server account) is configured, sort resources alphabetically?
			var globalResourceAlphabetSorting = true;
		// asynchronously sync resources/collections on background every X miliseconds
			var globalSyncResourcesInterval = 120000;
			// var globalSyncResourcesInterval = 10000;

	// 后台同步...
		// enable background sync even if browser window has no focus (if false, sync is performed only if browser window/tab is focused)
		//  if undefined or not false, background sync is enabled
		var globalBackgroundSync = true;

	// 键盘导航...
		// enable keyboard navigation?  if undefined or not false, keyboard navigation is enabled
		var globalEnableKbNavigation = true;

	// 预先读取过去和未来的多少个月份的数据...
		// number of months pre-loaded from past and future in advance (if null then date range synchronization is disabled)
		// note: interval synchronization is used only if your server supports sync-collection REPORT (e.g. DAViCal)
		// note: if you experience problems with data loading and your server has no time-range filtering support set both variables to null
		var globalEventStartPastLimit = 3;
		var globalEventStartFutureLimit = 3;
		var globalTodoPastLimit = 1;

	// 日历默认显示哪个视图..
		// default fullcalendar view option (use 'month', 'multiWeek', 'agendaWeek' or 'agendaDay')
		// note: we use custom and enhanced version of fullcalendar!
		var globalActiveView = 'agendaWeek';

	// 新建事件采用单击还是双击...
		// open new event form on 'single' or 'double' click (if undefined or not 'double', then 'single' is used)
		var globalOpenFormMode = 'double';

	// 设置日历在登录后的默认被选择情况，如果是空或者未定义，则自动选择第一个可选的日历...
		// set calendar to be selected by default after login (URL encoded path to the calendar, for example: 'USER/calendar/')
		// if empty or undefined the first available calendar is selected automatically
		//var globalCalendarSelected = '';

	// 工作时间的开始和结束...
		// set business hours with 0.5 hour precision - non-business hours will be faded out in the calendar interface
		// if both variables have the same value no fade out occurs
		var globalCalendarStartOfBusiness = 8;
		var globalCalendarEndOfBusiness = 17;

	// 设置新建事件的默认持续时间（分钟为单位），如果为未定义或者空，globalCalendarEndOfBusiness将作为替?
		// set default duration (in minutes) for newly created events.
		// If undefined or null, globalCalendarEndOfBusiness value will be taken as a default end time instead
		var globalDefaultEventDuration = 120;

	// 设置是否采用12小时(AM/PM)
		// use 12 hours format (AM/PM) for displaying time?
		// note: time format is now predefined for each localization 
		// - use this option only if you want to use custom time format instead of the predefined one
		var globalAMPMFormat = false;

	// 打开针对“时间事件”的时区的支持，若关闭则使用当地事件
		// turn on timezone support for "time events", if disabled local time is used
		var globalTimeZoneSupport = false;

	// 订阅的日历不是分享的日历...
		//  NOTE: subsribed calendars are NOT "shared" calendars ... for "shared" calendars see the delegation option in globalAccountSettings, globalNetworkCheckSettings and globalNetworkAccountSettings
		// array of subscribed (read-only) calendars; each calendar is identified by an url address (for example: http://something.com/calendar.ics)
		//var globalSubscribedCalendars={hrefLabel: 'Subscribed', calendars: [{displayName: 'Subscribed Calendar', href: 'http://something.com/calendar.ics', userAuth: {userName: '', userPassword: ''}, ignoreAlarm: true, color: '#ff0000', typeList: ['vevent','vtodo']}]};

	// 设置哪些天是周末，非周末将自动认为是工作的时间。周日是0，周一?...
		// set what days of the week are considered weekend days; non-weekend days are automatically considered to be business days
		// Sunday is 0, Monday is 1, etc.
		var globalWeekendDays = [0, 6];

	// globalAccountSettings 必须是一个数组（如果你使?globalNetworkCheckSettings ?globalNetworkAccountSettings，那么也能为未定义）
		// globalAccountSettings must be an array (can be undefined if you use globalNetworkCheckSettings or globalNetworkAccountSettings)
		// href 的值是一?principal URL"?即最后一个字符必须是 '/'
		// the href value is a "principal URL" - the last character in href must be '/'
		// principal URL != collection URL -> 客户端自动为每一个principal URL探测collections
		// principal URL != collection URL -> the client automatically detects collections for each principal URL
		//    PROPER principal URL looks like:（例子）
		//    https://server.com:8443/principals/users/USER/
		//      https://server.com:8443/caldav.php/USER/
		//    INVALID principal URL looks like:（例子）
		//      https://server.com:8443/principals/users/USER/collection/	<- url to collection
		//      https://server.com:8443/caldav.php/USER/collection/		<- url to collection
		//      https://server.com:8443/principals/users/USER			<- missing '/'
		//      https://server.com:8443/caldav.php/USER				<- missing '/'

	// the hrefLabel: 
		// sets the server name in the resource header - useful if you want to see custom resource header above the collections; 
		// 在resource头部设置服务器的名称 - 如果你想在collections的头部自定义resource的头部，这将很有?..
		// 	you can use the following variables: 
		// 		%H = full hostname (including the port number), 
		// 		%h = full hostname (without the port number), 
		// 		%D = full domain name, 
		// 		%d = only the first and second level domain, 
		// 		%P = principal name, 
		// 		%p = principal name without the @domain.com part (if present), 
		// 		%U = logged user name, 
		// 		%u = logged user name without the @domain.com part (if present); 
		// 		if undefined, empty or or null then '%d/%p [%u]' is used

	// the forceReadOnly: 
		// sets the resource or list of collections as "read-only" - if true then the whole resource will be "read-only"; 
		// 设置collections的resource或list?“只读?- 若为真则整个resource将为 “只读?
		// if an array of URL encoded collections or regexes (for example: 
		// 		['/caldav.php/user/calendar/', 
		// 		'/caldav.php/user%40domain.com/calendar/', 
		// 		new RegExp('^/caldav.php/user/calendar[0-9]/$', 'i')]) 
		// 		then specified collections will be marked as "read-only"; 
		// 		if null (default), unset or unknown then server detected privileges are used

	// the timeOut: 
		// sets the timeout for jQuery .ajax call (in miliseconds)
		// 设置 jQuery .ajax 调用的超时时间（毫秒 ms为单位）

	// the lockTimeOut: 
		// sets the LOCK Timeout value if resource locking is used (in miliseconds)
		// 如果 resource 锁被使用，则设置锁的超时时间 （毫秒）

	// the settingsAccount: 
		// sets the account where client properties are saved during logout and resource/collection synchronisation
		// 在登出和 resource/collection 同步期间，客户端保存属性时设置账户
		// (note: set it to true only for ONE account)
		// （注意：只有在一个账户时将其设置为真?

	// the delegation: 
		// allows user to load delegated (shared) resources 
		// 允许用户读取 授权（分享）的资?
		// - if true (default) then delegation is enabled and the interface allows you to select which delegated resources/collections you want to load; 
		// - 如果为真（默认），那么授权是可用的，并且在界面上也允许你读取你想要选择的授权的 resources/collections
		// if false then delegation is disabled

	// the ignoreAlarms: 
		// defines an array of calendars with disabled alarm functionality 
		// 定义一个日历数组（使得闹铃无效?
		// - if true then alarm functionality is disabled for all collections; 
		// if false (default) then alarm functionality is enabled for all collections; 
		// if an array of URL encoded collections or regexes (for example: 
		// 		['/caldav.php/user/calendar/', 
		// 		'/caldav.php/user%40domain.com/calendar/', 
		// 		new RegExp('^/caldav.php/user/calendar[0-9]/$', 'i')] 
		// 		then alarm functionality is disabled for all specified collections

	// special options not present in the default config (use only if you know what are you doing!):
		// 未出现在默认配置（config）中的特殊选项 （只有在你知道你在干啥的时候再?..?
	//  the crossDomain: 
		//  sets jQuery ajax crossDomain value (use only if you know what are you doing!) 
		//  设置 jQuery ajax 跨域的值（只有在你知道你在干啥的时候再?..?
		//  - by default null = autodetect/detected setting is shown in the console

	// ??if set, the client authenticates against the href URL (the last character in href must be '/') 
	// and if the authentication is successful it appends the USER + '/' to end of href and sets the userAuth:
	// 并且如果认证成功，则将在 href 结尾添加 USER + '/' 和设?userAuth为如下所示：
		// {userName: USER, 
		// userPassword: PASSWORD}
	// then the client uses the modified globalNetworkCheckSettings in the same way as the globalAccountSettings
	// 接着客户端将?globalAccountSettings 一样使用修改过?globalNetworkCheckSettings

	// this option invokes a login screen and disallows access until successfull authentication
	// 这个选项将调用一个登录界面，并能拒绝未成功授权的登录
	// the additionalResources array can contain additional resources (shared resources accessible by all users), 
	// additionalResources 数组能包含额外的 resources (能够被所有用户访问的共享?resources )
	// 		for example: additionalResources: ['company','customers'] ... 
	// href values for these resources are created in the same way as described above for the USER
	// 对于这些 resources ?href 同样如上述对?USER 的方式被创建
	// see globalAccountSettings (above) comments for more information
	// Lion server example (http + https setup; see misc/readme_lion.txt for server setup):
	//var globalNetworkCheckSettings = 
		//	{href: 'https://192.168.80.59:8443/principals/users/', 
		//	hrefLabel: null, 
		//	additionalResources: [], 
		//	forceReadOnly: null, 
		//	settingsAccount: true, 
		//	timeOut: 90000, 
		//	lockTimeOut: 10000, 
		//	delegation: true, 
		//	backgroundCalendars: [], 
		//	ignoreAlarms: false}
		var globalNetworkCheckSettings = 
			{	href: 'http://ip:port/principals/users/', 
				hrefLabel: null, 
				additionalResources: [], 
				forceReadOnly: null, 
				settingsAccount: true, 
				timeOut: 90000, 
				lockTimeOut: 10000, 
				delegation: true, 
				backgroundCalendars: [], 
				ignoreAlarms: false
			};

	// if set, the configuration is loaded from the network (using HTTP basic auth) 
	// 如果设置来，那么配置将从网络上读取（使用 HTTP 的基础认证？）
	// - the returned configuration XML settings are added to globalAccountSettings ... 
	// - 返回的配?XML 文件将被添加?globalAccountSettings
	// it is possible to combine this option with the globalAccountSettings although it is not recommended
	// 虽然不是很推荐，不过也可能将这个选项?globalAccountSettings 将结合起?

	// use jQuery .ajax() auth or custom header for HTTP basic auth (default)
	// 使用 jQuery ?.ajax() 认证，或者自定义的头部用?HTTP basic 认证（默认）
	// set this option to true if your server uses digest auth (note: you may experience auth popups on some browsers)
	// 如果你的服务器使?digest 认证，则将该选项设置为真 （注意：你可能在一些浏览器上看到认证的弹出窗）
	//  if undefined (or empty), custom header for HTTP basic auth is used
	//  如果是未定义或者为空，那么 HTTP basic 认证的自定义头部将被使用
		// var globalUseJqueryAuth = false;

	// JavaScript localeCompare() or custom alphabet for data sorting
	// 使用 JavaScript ?localeCompare() 方法或者是自定义的字母表，来用于数据的排序
	// custom alphabet is used by default because the JavaScript localeCompare() not support collation and often returns "wrong" result
	// 自定义的字母表将被默认使用，因为 JavaScript ?localeCompare() ???法不支?collation「定序？」，并且经常返回“错误”的结果
		// var globalSortAlphabet = null;	// use localeCompare()
		var globalSortAlphabet = 
			' 0123456789AÃ€ÃÃ‚Ã„Ã†ÃƒÃ…Ä€BCÃ‡Ä†ÄŒDÄŽEÃˆÃ‰ÃŠÃ‹Ä’Ä–Ä˜ÄšFGÄžHIÃŒÃÃŽÄ°ÃÄªÄ®JKLÅÄ¹Ä½MNÅƒÃ‘Å‡OÃ’Ã“Ã”Ã–ÅÅ’Ã˜Ã•ÅŒPQRÅ”Å˜SÅšÅ È˜È™ÅžÅŸáºžTÅ¤ÈšÈ›Å¢Å£UÃ™ÃšÃ›ÃœÅ°Å®ÅªVWXYÃÅ¸ZÅ¹Å»Å½aÃ Ã¡Ã¢Ã¤Ã¦Ã£Ã¥ÄbcÃ§Ä‡ÄdÄeÃ¨Ã©ÃªÃ«Ä“Ä—Ä™Ä›fgÄŸhiÃ¬Ã­Ã®Ã¯Ä«Ä¯Ä±jklÅ‚ÄºÄ¾mnÅ„Ã±ÅˆoÃ²Ã³Ã´Ã¶Å‘Å“Ã¸ÃµÅpqrÅ•Å™sÅ›Å¡ÃŸtÅ¥uÃ¹ÃºÃ»Ã¼Å±Å¯Å«vwxyÃ½Ã¿zÅºÅ¼Å¾ÐÐ‘Ð’Ð“ÒÐ”Ð•Ð„Ð–Ð—Ð˜Ð†Ð‡Ð™ÐšÐ›ÐœÐÐžÐŸÐ Ð¡Ð¢Ð£Ð¤Ð¥Ð¦Ð§Ð¨Ð©Ð®Ð¯Ð¬Ð°Ð±Ð²Ð³Ò‘Ð´ÐµÑ”Ð¶Ð·Ð¸Ñ–Ñ—Ð¹ÐºÐ»Ð¼Ð½Ð¾Ð¿Ñ€ÑÑ‚ÑƒÑ„Ñ…Ñ†Ñ‡ÑˆÑ‰ÑŽÑÑ?';	
		// use custom alphabet sorting (note: the first character is "space")
	// search functionality character equivalence (transformation to ASCII: key = regex text, value = result character)
		var globalSearchTransformAlphabet = 
			{'[Ã€Ã ÃÃ¡Ã‚Ã¢Ã„Ã¤Ã†Ã¦ÃƒÃ£Ã…Ã¥Ä€Ä]': 'a', 
			'[Ã‡Ã§Ä†Ä‡ÄŒÄ]': 'c', 
			'[ÄŽÄ]': 'd', 
			'[ÃˆÃ¨Ã‰Ã©ÃŠÃªÃ‹Ã«Ä’Ä“Ä–Ä—Ä˜Ä™ÄšÄ›]': 'e', 
			'[ÄžÄŸ]': 'g', 
			'[ÃŒÃ¬ÃÃ­ÃŽÃ®Ä°Ä±ÃÃ¯ÄªÄ«Ä®Ä¯]': 'i', 
			'[ÅÅ‚Ä¹ÄºÄ½Ä¾]': 'l', 
			'[ÅƒÅ„Ã‘Ã±Å‡Åˆ]': 'n', 
			'[Ã’Ã²Ã“Ã³Ã”Ã´Ã–Ã¶ÅÅ‘Å’Å“Ã˜Ã¸Ã•ÃµÅŒÅ]': 'o', 
			'[Å”Å•Å˜Å™]': 'r', 
			'[ÅšÅ›Å Å¡È˜È™ÅžÅŸáºžÃŸ]': 's', 
			'[Å¤Å¥ÈšÈ›Å¢Å£]': 't', 
			'[Ã™Ã¹ÃšÃºÃ›Ã»ÃœÃ¼Å°Å±Å®Å¯ÅªÅ«]': 'u', 
			'[ÃÃ½Å¸Ã¿]': 'y', 
			'[Å¹ÅºÅ»Å¼Å½Å¾]': 'z'};

	// update notification will be shown only to users with login names defined in this array (for example: ['admin', 'peter'])
	// 更新通知消息将只会对这个数组中的各个登录用户名显示，例如... ['admin', 'peter']
	// if undefined (or empty), update notifications will be shown to all users
	// 如果为未定义或者为空，那么更新通知信息将会对所有用户显?
		 globalNewVersionNotifyUsers = [];

	// set the datepicker format (see http://docs.jquery.com/UI/Datepicker/formatDate for valid values)
	// 设置日期选择控件的格?（在 http://docs.jquery.com/UI/Datepicker/formatDate 查看有效值）
	// note: date format is now predefined for each localization 
	// 注意?日期格式现在已经对于每个地区进行来预定义
	// - use this option only if you want to use custom date format instead of the predefined one
	// - 只有在你希望使用自定义的日期格式而不是预定义的格式时，使用这个选项?
		// var globalDatepickerFormat = 'dd.mm.yy';

	// calendar collections stored in this array are loaded after login (if empty then all collections are loaded)
	// 在登录后，日历的 collections 被保存在这个数组中。（如果是空的，那么所有的 collections 将被读取?
	// note: settings stored on server (see settingsAccount) overwrites this variable
	// 注意?在服务器上保存的设置（参?settingsAccount）将覆盖这个变量
		var globalLoadedCalendarCollections = [];

	// calendar collections stored in this array are checked (visible in the interface) by default after login
	// 在登录后，被保存在这个数组中的日历的 collections 将被默认检查?
	// note: settings stored on server (see settingsAccount) overwrites this variable
	// 注意?在服务器上保存的设置（参?settingsAccount）将覆盖这个变量
		var globalActiveCalendarCollections = [];

	// 何处保存用户设置...
		// where to store user settings such as: active view, enabled/selected collections, ... (we store them into DAV property on the server)
		//  note: not all servers support storing DAV properties (some servers support only subset /or none/ of these URLs)
		//  if 'principal-URL', '', null or undefined (default) - settings are stored to principal-URL
		//  if 'calendar-home-set' - settings are stored to calendar-home-set
		//var globalSettingsType = '';

	// ？？settings nf-it.com such as enabled/selected collections are stored on the server (see the previous option) 
	// in form of full URL (e.g.: http://user@server:port/principal/collection/),
	// 采用完整 URL 的形式， 例如：http://user@server:port/principal/collection/
	// but even if this approach is "correct" (you can use the same principal URL with multiple different logins, ...) 
	// 但是即使这样的方法是“正确的”（你能使用同样?principal URL 进行多种不同的登录，...?
	// it causes a problem if your server is accessible from multiple URLs (e.g. http://server/ and https://server/).
	// 如果你的服务器能够从多种 URL 登录？， 这将导致一个问题?
	// If you want to store only the "principal/collection" part of the URL (instead of full URL) then enable this option
	// 如果你只想保?URL 中的 "principal/collection" 部分（而不是整?URL ），那么启用这个选项
		// var globalCrossServerSettingsURL = false;

	// format time information of events shown in month and multiweek views
	// 在月视图和多周视图中显示的时间的格式
	// if undefined or null, default value will be used. if defined as empty string, no time information will be shown
	// 如果为未定义或者为空，将使用默认值?如果定义为一个空字符串，那么将不显示时间信息?
	// see http://arshaw.com/fullcalendar/docs/utilities/formatDate/ for exact formating rules
	// 参见 http://arshaw.com/fullcalendar/docs/utilities/formatDate/
		//var globalTimeFormatBasic = '';

	// format time information of events shown in agenda (week and day) views
	// 在周视图和日视图中显示的时间的格?
	// if undefined or null, default value will be used. if defined as empty string, no time information will be shown
	// 如果为未定义或者为空，将使用默认值?如果定义为一个空字符串，那么将不显示时间信息?
	// see http://arshaw.com/fullcalendar/docs/utilities/formatDate/ for exact formating rules
		//var globalTimeFormatAgenda = '';

	// display hidden (unchecked calendar) events with certain transparency (true) or remove them from the interface completely (false)
	// 显示隐藏（未确认日历）的事件，使用一定的透明度（值为true），或者将他们完全从界面上移除（值为false?
		var globalDisplayHiddenEvents = false;

	// set the calendar default timezone
	// 设置日历的默认时?
	// see timezones.js or use the following command to get the list of supported timezones defined in timezones.js:
	// 查看 timezones.js 或者使用以下的命令来得到在 timezones.js 中定义的支持的时区列表?
		// grep "'[^']\+': {" timezones.js | sed -Ee "s#(\s*'|':\s*\{)##g"
		var globalTimeZone = 'Asia/Shanghai';

	// array of enabled timezones, for example: ['America/New_York', 'Europe/Berlin'] 
	// 能够使用的时区数组，例如：['America/New_York', 'Europe/Berlin'] 
	// (see the comment for the previous configuration option)
	// 查看上一个配置选项的注?
	// note: if there is at least one event/todo with a certain timezone defined, that timezone is enabled automatically
	// 注意?如果至少一?时间/代办 有一个定义的时区，那么那个时区也自动可使?
		var globalTimeZonesEnabled = ['Asia/Shanghai'];

	// enhance event timezone information using official IANA source (recommended)
	// 使用官方 IANA 数据源来增强事件的时区信息（推??）
		var globalRewriteTimezoneComponent = true;

	// remove non standard timezone names from events and todos on save action 
	// 在保存操作时，从事件中移除非标准的时?
	// (e.g. /freeassociation.sourceforge.net/Tzfile/Europe/Vienna)
		var globalRemoveUnknownTimezone = false;

	// show alarms of hidden calendars
	// 显示隐藏日历的闹?
	// if this option is enabled and you uncheck a calendar in the calendar list, alarm will be temporary disabled for this calendar
	// 如果这个选项被启用，并且你将一个日历隐藏，那么这个日历的闹钟将会暂时失?
		var globalShowHiddenAlarms = false;

	// Mozilla automatically treats custom repeating event calculation as if the start day of the week is Monday,
	// 如果本周开始的第一天是星期一，Mozilla 自动将自定义重复事件 计算?
	// despite what day is chosen in the settings. Set this variable to true to use the same approach, 
	// 而不管在设定中选择了哪一天。将这个变量设置?true 来使用同样的方法
	// ensuring compatible event rendering in special cases
	// 保证在特殊情况下兼容事件的呈?
		var globalMozillaSupport = false;

	// which namespace is used for storing the "calendar-color" property by the client
	// 客户端选择哪一?namespace 来保?“日历颜色?属?
	// if true undefined (or empty) we use the "http://apple.com/ns/ical/" namespace (Apple compatible)
	// 若为真、未定义、空，我们使?"http://apple.com/ns/ical/" namespace (兼容苹果)
	// if false then it is not possible to edit the calendar color in the interface
	// 若为假，则在界面上无法编辑日历颜?
		// var globalCalendarColorPropertyXmlns = true;

// ===================================================================================================

// --？？？？？？？？？？?----------------------------------------------------------------
	
	// ？？DAViCal example (for cross-domain setup see misc/config_davical.txt):
		//var globalNetworkCheckSettings = {href: 'http://davical.server.com:8080/caldav.php/', hrefLabel: null, additionalResources: [], forceReadOnly: null, settingsAccount: true, timeOut: 90000, lockTimeOut: 10000, delegation: true, backgroundCalendars: [], ignoreAlarms: false}
	// ？？Davical example (client installed into Davical subdirectory - works out of the box, no additional setup required):
		//var globalNetworkCheckSettings = {href: location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+location.pathname.replace(RegExp('/+[^/]+/*(index\.html)?$'),'')+'/caldav.php/', hrefLabel: null, additionalResources: [], forceReadOnly: null, settingsAccount: true, checkContentType: true, timeOut: 90000, lockTimeOut: 10000, delegation: true, ignoreAlarms: false, backgroundCalendars: []}

	//  ??the withCredentials: 
		//  sets jQuery's ajax withCredentials value for cross domain queries (use only if you know what are you doing!); 
		//  note: if true, Access-Control-Allow-Origin "*" is not allowed

	// ？？the checkContentType: 
		// enables content-type checking for server response (only objects with proper content-type are inserted into interface) 
		// 使得 content-type 能够对于服务器的应答进行检查？?
		// - if you cannot see data in the interface you may try to disable it 
		// (useful if your server return wrong value in "propstat/prop/getcontenttype"); 
		// if undefined content-type checking is enabled

	// ？？the backgroundCalendars: 
		// defines an array of background calendars 
		// - if there is at least one event defined for the given day in a background calendar, 
		// 		the background color for that day will be pink/light-red; 
		// 		to use this feature define an array of URL encoded collections or regexes (for example: 
		// 			['/caldav.php/user/calendar/', 
		// 			'/caldav.php/user%40domain.com/calendar/', 
		// 			new RegExp('^/caldav.php/user/calendar[0-9]/$', 
		// 			'i')])

	// ？？this option invokes a login screen and disallows access until the client gets correct XML configuration file from the server
	// 这个选项将调用一个登录界面，并且拒绝登录直到客户端从服务器得到正确的 XML 配置文件
	// the timeOut sets the timeout for jQuery .ajax call (in miliseconds)
		//var globalNetworkAccountSettings = {href: 'https://www.config-server.com/auth/', timeOut: 30000};
		//var globalNetworkAccountSettings = {href: 'https://192.168.80.59/auth/', timeOut: 30000};
	// default configuration if the auth module is located in the currect subdirectory
	// ？？
		//var globalNetworkAccountSettings = {href: location.protocol+'//'+location.hostname+(location.port ? ':'+location.port : '')+location.pathname.replace(RegExp('index\.html$'),'')+'auth/', timeOut: 30000};

// --？？？？？？？？？？?over-------------------------------------------------------------

// --todo...---------------------------------------------------------------------
	
	// STRONGLY recommended if you use any Apple clients for todos (has no effect on events).
	// 如果你使用任何苹果的客户端来使用 todos（对?events 无影响），强烈推?..
	// Accepted values are currently 'iOS6', 'iOS7', true (support of the latest iOS version - 'iOS7') and false.
	// If enabled:
	//  - RFC todo support is SEVERELY limited and the client mimics the behaviour of Apple Reminders.app (to ensure maximum compatibility)
	//  - when a single instance of repeating todo is edited, it becomes an autonomous non-repeating todo with NO relation to the original repeating todo
	//  - capabilities of repeating todos are limited - only the first instance is ever visible
	//  - support for todo DTSTART attribute is disabled
	//  - support for todo STATUS attribute other than COMPLETED and NEEDS-ACTION is disabled
	//  - [iOS6 only] support for LOCATION and URL attributes is disabled
		var globalAppleRemindersMode = true;

	// ignore alarms for completed or cancelled todos
		var globalIgnoreCompletedOrCancelledAlarms = true;

	// set todo calendar to be selected by default after login (URL encoded path to the todo calendar, for example: 'USER/todoCalendar/')
	// if empty or undefined the first available todo calendar is selected automatically
	//var globalTodoCalendarSelected = '';

	// todo calendar collections stored in this array are loaded after login  (if empty then all collections are loaded)
	// note: settings stored on server (see settingsAccount) overwrites this variable
		var globalLoadedTodoCollections = [];

	// todo calendars collections stored in this array are checked (visible in the interface) by default after login
	// note: settings stored on server (see settingsAccount) overwrites this variable
		var globalActiveTodoCollections = [];

	// which filters in todo list are selected (filterAction, filterProgress, filterCompleted, filterCanceled)
	// note: filterProgress and filterCanceled are available only if globalAppleRemindersMode is disabled
	// note: settings stored on server (see settingsAccount) overwrites this variable
		var globalTodoListFilterSelected = ['filterAction', 'filterProgress'];
		
// --todo...over-----------------------------------------------------------------
