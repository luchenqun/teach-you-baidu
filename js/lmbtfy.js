/**
 * Created by bangbang on 14/10/10.
 */
$(document).ready(function() {
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
        var ky = $('#kw').val();
        if (ky) {
            var link = 'http://let-me-teach-you-baidu.luchenqun.com/?' + encodeURIComponent(ky);
            $.get('https://auth.bangbang93.com/sina/short_url.php?url=' + link, function(data) {
                if (data) {
                    link = data['url_short'];
                    $('#link').show();
                    $('#instructions').text('复制下面的地址');
                    $('#short_url').val(link).focus().select();
                } else {
                    toastr.error('获取短地址出错。', "提示");
                }
            });
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
        var kw = decodeURIComponent(window.location.search.substr(1));
        var $instructions = $('#instructions');
        var $arrow = $('#arrow');
        setTimeout(function() {

            $instructions.text('1、把鼠标放到输入框上');
            var styles = {
                left: $kw.offset().left + 10 + 'px',
                top: ($kw.offset().top + $kw.height() / 2) + 'px'
            }

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
                            $instructions.html('这对你而言就是这么困难么？');

                            setTimeout(function() {
                                $instructions.html("<strong style='color:#FF0000'>==========见证奇迹的时刻到了==========</strong>");
                            }, 1000);

                            setTimeout(function() {
                                window.location = 'http://www.baidu.com/s?tn=mybookmark.cn&ch=3&ie=utf-8&wd=' + encodeURIComponent(kw);
                            }, 2000);
                        })
                    }
                }, delay);
            });

        }, 1000);
    }
});
