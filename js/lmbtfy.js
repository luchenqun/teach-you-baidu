/**
 * Created by bangbang on 14/10/10.
 */
$(document).ready(function() {
    var teaching = false;

    var clipboard = new Clipboard('#copy');
    clipboard.on('success', function(e) {
        toastr.success('短地址：' + e.text + '<br/>已复制到您的剪切板', "提示");
        $('#short_url').val(e.text).focus().select();
        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        toastr.error('复制失败，请手动复制！', "提示");
    });

    $('#search').on('click', function() {
        console.log('teaching = ', teaching);
        if (teaching) {
            toastr.clear();
            toastr.error('专心看教程！', "提示");
            return;
        }
        var ky = $('#kw').val();
        if (ky) {
            if (ky.length >= 80) {
                $('#kw').val('');
                toastr.error('您输入的字符过长，请重新输入！', "提示");
            } else {
                var link = 'http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long?url=' + 'http://baidu.luchenqun.com/?' + encodeURIComponent(ky);

                $.ajax({
                    url: link,
                    success: function(data) {
                        if (data) {
                            link = data['url_short'];
                            toastr.clear();
                        }
                        $('#link').show();
                        $('#instructions').text('复制下面的地址');
                        $('#short_url').val(link).focus().select();
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log(XMLHttpRequest.status, XMLHttpRequest.responseText);
                        $('#link').show();
                        $('#instructions').text('复制下面的地址');
                        $('#short_url').val(link).focus().select();
                    }
                });
            }
        } else {
            toastr.error('您要先输入搜索关键字！', "提示");
        }
    });

    var $container = $('.container');
    $container.on('click', '#go', function() {
        var link = $('#short_url').val();
        if (!!link) {
            window.location = link;
        }
    });

    var $kw = $('#kw');
    $kw.on('keydown', function(e) {
        if (e.keyCode == 13) {
            $('#search').trigger('click');
        }
    });

    if (!!window.location.search) {
        console.log('window.location.search.........', teaching);
        teaching = true;
        var kw = decodeURIComponent(window.location.search.substr(1));
        var $instructions = $('#instructions');
        var $arrow = $('#arrow');
        setTimeout(function() {

            $instructions.text('1、把鼠标放到输入框上');
            var styles = {
                left: $kw.offset().left + 10 + 'px',
                top: ($kw.offset().top + $kw.height() / 2) + 'px'
            }
            $arrow.attr('src', '../img/arrow.png');
            $arrow.show().animate(styles, 2000, function() {
                $instructions.text('2、输入你的问题');
                $arrow.hide();
                var $kw = $('#kw');
                $kw.focus();
                var i = 0;
                var delay = (kw.length >= 40) ? 100 : 200;

                var interval = setInterval(function() {
                    $kw.val(kw.substr(0, i++));
                    if (i > kw.length) {
                        clearInterval(interval);
                        $instructions.text('3、按下“百度一下”按钮');
                        $arrow.show();
                        var $search = $('#search');
                        styles = {
                            left: $search.offset().left + $search.width() / 2 + 'px',
                            top: $search.offset().top + $search.height() / 2 + 'px'
                        };
                        $arrow.animate(styles, 1000, function() {
                            $arrow.attr('src', '../img/pointer.png');
                            setTimeout(function() {
                                $instructions.html('这对你而言就是这么困难么？');
                            }, 1000);

                            setTimeout(function() {
                                $instructions.html("<strong style='color:#FF0000'>==========见证奇迹的时刻到了==========</strong>");
                            }, 3000);

                            setTimeout(function() {
                                window.location = 'http://www.baidu.com/s?tn=mybookmark.cn&ch=3&ie=utf-8&wd=' + encodeURIComponent(kw);
                                teaching = false;
                            }, 4000);
                        })
                    }
                }, delay);
            });

        }, 1000);
    }
});
