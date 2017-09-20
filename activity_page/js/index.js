/**
 * Created by ZK on 17/1/5.
 */

var _toUID = '',
    _toNickname = '',
    _fromUID = '',
    $tableView = $('.mui-table-view');

setupMUI();
/*自动刷新*/
mui.ready(function() {
    bindEventForAvatarBtn();
    requestNewData(true);
    //mui('#pullrefresh').pullRefresh().pulldownLoading();
});

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge)
        }, false)
    }
}

connectWebViewJavascriptBridge(function(bridge) {
    bridge.init();

    $(function () {
        bridge.callHandler('UserInfo', {}, function(d) {

            if(typeof d === 'string') {
                d = JSON.parse(d);
            }
            if (d.userInfo) {
                _fromUID = d.userInfo.uid;
            }
            else {
                _fromUID = d.uid;
            }

            initData();
        });
    })
});

function initData() {
    bindSendFlowerBtn();
}

function pulldownRefresh() {
    requestNewData(true);
}

function requestNewData(isPulldown) {
    $.ajax({
        url: baseUlr + 'moca/BestCpDraw/List',
        type: 'POST',
        success: function (d) {

            setTimeout(function () {
                isPulldown && mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
                //isPulldown && mui('#pullrefresh').pullRefresh().refresh(true);
            }, 200);

            if (!!isPulldown) {
                $tableView.empty();
                var $tableHeader = $('<li class="cell-header"></li>');
                $tableHeader.append($('<span><img src="images/title_rank.png" alt="" width="40"></span>'))
                    .append($('<span><img src="images/title_woman.png" alt="" width="40" ></span>'))
                    .append($('<span><img src="images/title_ship.png" alt="" width="60"></span>'))
                    .append($('<span><img src="images/title_man.png" alt="" width="40"></span>'));
                $tableView.append($tableHeader);
            }

            if (typeof d == 'string') {
                d = JSON.parse(d);
            }

            var dataList = [];

            $.each(d.data, function (index, obj) {
                var p = {};
                p.intimacyNum = obj.intimacyNum;

                var male = {};
                var female = {};

                male.nick = obj.male.nick;
                male.avatar = obj.male.avatar;
                male.uid = obj.male.uid;

                female.nick = obj.female.nick;
                female.avatar = obj.female.avatar;
                female.uid = obj.female.uid;

                p.male = male;
                p.female = female;

                dataList.push(p);
            });

            updateUIWithDataList(dataList);
        },
        error: function (data) {
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); // true代表没有更多数据了
        }
    });
}

function bindEventForAvatarBtn() {
    var $elems = $('.avatar');
    $elems.each(function (index, obj) {
        obj.addEventListener('tap', function () {
            _toUID = $(obj).attr('data-uid');
            _toNickname = $(obj).attr('data-nick');

            $('#moca-id').html('ID: ' + _toUID);
            $('#moca-nick').html(_toNickname);

            mui('.mui-popover').popover('show', obj);
        })
    })
}

/**
 * 更新UI页面
 */
function updateUIWithDataList(dataList) {
    for (var i = 0; i < dataList.length; i++) {
        var model = dataList[i];
        updateCellWithModel(model,i+1);
    }
    bindEventForAvatarBtn();
}

function exchangeRankNumBg(avatarContainers, rankNum) {
    $.each(avatarContainers, function (index, $obj) {
        if (rankNum == 1) {
            $obj.css('background', 'url("images/icon_gold.png") no-repeat center center / 100%');
            $($obj.get(0).firstChild).css({
                'margin': '7px 0 0 2px'
            })
        }
        else if (rankNum == 2) {
            $obj.css('background', 'url("images/icon_silver.png") no-repeat center center / 100%');
            $($obj.get(0).firstChild).css({
                'margin': '6px 0 0 2px'
            });
        }
        else if (rankNum == 3) {
            $obj.css('background', 'url("images/icon_copper.png") no-repeat center center / 100%');
            $($obj.get(0).firstChild).css({
                'margin': '6px 0 0 3px'
            })
        }
    });
}

function updateCellWithModel(model, index) {

    var $cell = $('<li class="rank-cell"></li>');
    var $intimacyView = $('<spqn class="intimacy">'+ model.intimacyNum +'</spqn>');
    var $leftAvatarContainer = $('<span class="avatar avatar-left" data-uid="'+ model.female.uid +'" data-nick="'+ model.female.nick +'"></span>');
    var $leftAvatar = $('<span class="test avatar-'+ index +'"></span>');

    $leftAvatar.css({
        'background': 'url('+ model.female.avatar.split('.jpg')[0] + '_150.jpg' +') no-repeat center center / 100%',
    });
    $leftAvatarContainer.append($leftAvatar);

    var $rightAvatarContainer = $('<span class="avatar avatar-right" data-uid="'+ model.male.uid +'" data-nick="'+ model.male.nick +'"></span>');
    var $rightAvatar = $('<span class="avatar-'+ index +'"></span>');
    $rightAvatar.css({
        'background': 'url("'+ model.male.avatar.split('.jpg')[0] + '_150.jpg' +'") no-repeat center center / 100%'
    });
    $rightAvatarContainer.append($rightAvatar);

    var avatarContainers = [];
    avatarContainers.push($leftAvatarContainer);
    avatarContainers.push($rightAvatarContainer);

    index <= 3 && exchangeRankNumBg(avatarContainers, index);

    var $rankNum = $('<span class="rank-num">'+ index +'</span>');

    $cell.append($intimacyView).append($leftAvatarContainer).append($rightAvatarContainer).append($rankNum);

    $tableView.append($cell);

    updateCellHeight();
}

function updateCellHeight() {
    var tableWidth = $('.zk-table-view').width();
    $('.rank-cell').css({
        'height': tableWidth * .173
    });
}

/**
 * 初始化页面
 */
function bindSendFlowerBtn() {
    $('.flower-num a').each(function (index, obj) {
        obj.addEventListener('tap', function () {
            mui('.mui-popover').popover('hide');
            var flowerNum = $(obj).attr('data-num');

            if (_fromUID == _toUID) {
                mui.alert('自己不能给自己送花哦', '提示', '我知道了');
                return;
            }

            loading.show();
            // alert('送花==>' + _fromUID + '为' + _toUID + '点亮' + flowerNum + '次');

            // 发送请求送花
            $.ajax({
                url: baseUlr + 'moca/NewYear/Flowers',
                type: 'POST',
                data: {
                    uid: _fromUID,
                    to_uid: _toUID,
                    num: flowerNum
                },

                success: function (response) {
                    loading.hide();
                    if (typeof response == 'string') {
                        response = JSON.parse(response);
                    }

                    if (response.result == 1) {

                        var winInfo = response.data.win_alert_info;
                        var hintStr = '对方已成功收到'+ flowerNum +'朵鲜花';
                        if (!winInfo) {
                            mui.alert(hintStr, '提示', '好的');
                        }
                        else {
                            mui.alert(hintStr + '\n' + winInfo, '中奖啦!', '知道了');
                            setTimeout(function () {
                                var $flowerDrop = $('.flower-drop');
                                $flowerDrop.css('display', 'block').animate({
                                    'top': '1000px'
                                }, 2200, function () {
                                    $flowerDrop.css({
                                        'top': '-1000px',
                                        'display': 'none',
                                    });
                                })
                            }, 300);
                        }
                    }
                    else {
                        response.msg && mui.alert(response.msg, '提示', '好的');
                    }
                },
                error: function (response) {
                    loading.hide();
                    if (typeof response == 'string') {
                        response = JSON.parse(response);
                    }
                    response.msg && mui.alert(response.msg, '提示', '好的');
                }
            });
        });
    });
}

function setupMUI() {
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                contentdown: '下拉刷新最新排行榜',
                callback: pulldownRefresh
            }
        },
        gestureConfig:{
            tap: true, //默认为true
            doubletap: true, //默认为false
            longtap: true, //默认为false
            swipe: true, //默认为true
            drag: true, //默认为true
            hold:false,//默认为false，不监听
            release:false//默认为false，不监听
        }
    });
}
