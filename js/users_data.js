/*--
    暂时存放静态用户数据...
 --*/

var globalGroupssUrl = "http://192.168.0.174:5000/getdepartment/"; // 部门的获取地址 
var globalUsersUrl   = "http://192.168.0.174:5000/searchbydepartment/"; // 根据部门搜索联系人的地址 

var globalUsersData = [{
    uid: '0',
    uuid: '10000000-0000-0000-0000-000000000008',
    e_mail: 'user08@example.com',
    name: 'user 08',
    title: '用户8',
    mobile: '178 xxxx xxxx',
    telephone: '010 xxxxxx'
},{
    uid: '1',
    uuid: '10000000-0000-0000-0000-000000000009',
    e_mail: 'user09@example.com',
    name: 'user 09',
    title: '用户9',
    mobile: '178 xxxx xxxx',
    telephone: '010 xxxxxx'
},{
    uid: '2',
    uuid: '10000000-0000-0000-0000-000000000010',
    e_mail: 'user10@example.com',
    name: 'user 10',
    title: '用户10',
    mobile: '178 xxxx xxxx',
    telephone: '010 xxxxxx'
},];

var globalUsersGroup = [{
    uid: '0',
    name: '业务所',
    users: [0, 1, 2]
}];

function searchGroupsData(groups_url) {
    /* 功能：向服务器发送请求，获取联系人信息
     * 输入：groups_url: 获取联系人信息的url；
     * 输出：无
     */

    $.ajax({
        type:     'get',
        url:      groups_url,
        dataType: 'json',

        error: function (objAJAXRequest, strError) {
            // console.log("Error: [searchUsersData: 'get " + globalAccountSettings[0].cahref+"'] code: '" + 
            //     objAJAXRequest.status+"' status: '"+strError+"'" + 
            //     (objAJAXRequest.status==0 ? ' (this error code usually means network connection error,' + 
            //         ' or your browser is trying to make a cross domain query,' + 
            //         ' but it is not allowed by the destination server or the browser itself)' : ''));

            console.log("╮(╯_╰)╭");
            
            return false;
        },
        success: function (data) {
            // 0.0
            originGroupDataTOglobalUsersGroup(data);
            // reloadResources();
        }
    });
}

function searchUsersByGroupData(users_url, group_uid) {
    /* 功能：向服务器发送请求，获取联系人信息
     * 输入：users_url: 获取联系人信息的url；
     *      group_uid: 被搜索的部门的uid；
     * 输出：无
     */

     var dataJSON = {
        "departmentNumber" : group_uid
     };

    $.ajax({
        type:        'get',
        // url:         users_url,
        url:         users_url + group_uid,
        dataType:    'json',
        // data:        dataJSON,
        // contentType: 'application/json',

        error: function (objAJAXRequest, strError) {
            // console.log("Error: [searchUsersData: 'get " + globalAccountSettings[0].cahref+"'] code: '" + 
            //     objAJAXRequest.status+"' status: '"+strError+"'" + 
            //     (objAJAXRequest.status==0 ? ' (this error code usually means network connection error,' + 
            //         ' or your browser is trying to make a cross domain query,' + 
            //         ' but it is not allowed by the destination server or the browser itself)' : ''));

            console.log("╮(╯_╰)╭");
            
            return false;
        },
        success: function (data) {
            // 0.0
            console.log(data);
            // reloadResources();
        }
    });
}

function originGroupDataTOglobalUsersGroup(origin) {
    /* 功能：将服务器返回的部门信息保存到 globalUserGroup 中
     * 输入：origin: 原始数据
     * 输出：无
     */
    
    globalUsersGroup = [];
    for (var key in origin) { 
        var tmp_group = new Object(); // 临时保存用户部所信息的对象

        tmp_group.uid = key;
        tmp_group.name = origin[key];
        tmp_group.users = [];

        globalUsersGroup.push(tmp_group);
    }
}

function originUserDataTOglobalUsersData(origin, groupNum) {
    /* 功能：将原始数据进行缩减，选取部分放入 globalUsersData
     * 输入：origin: 原始数据
     *      groupNum: 原始数据在 globalUsersGroup 中的下标
     * 输出：无
     */

    globalUsersData = [];
    for (var i = 0; i < origin.data.length; i++) {
        var tmp_user = new Object(); // 临时保存用户信息的对象
        var the_user = origin.data[i]; // 当前正在操作的原始数据 

        tmp_user.uid = i;
        tmp_user.e_mail = the_user.email;
        tmp_user.name = the_user.cn;
        tmp_user.title = the_user.title;
        tmp_user.mobile = the_user.mobile;
        tmp_user.telephone = the_user.tel;

        globalUsersData.push(tmp_user);
        globalUsersGroup[groupNum].users.push(i);
    }
}



