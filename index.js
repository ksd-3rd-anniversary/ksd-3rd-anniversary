function css(e, styles) {
    for (var property in styles) {
        e.style[property] = styles[property];
    }
}

function appendNameElement(container, name) {
    var item = document.createElement("div");
    var span = document.createElement("span");
    span.textContent = name;
    item.classList.add("item");
    item.appendChild(span);
    container.appendChild(item);

    css(span, {
        'font-size': Math.min(((640 - 20) / name.length), 100) + 'px',
    });
}

var scene = document.querySelector("a-scene");
var camera = document.querySelector("a-entity");
var plane = document.querySelector("a-plane");
var loader = document.querySelector("#loader");
var target = document.querySelector("#target");

document.addEventListener("DOMContentLoaded", function () {
    if (scene.hasLoaded) {
        ready();
    } else {
        scene.addEventListener("renderstart", ready);
    }
    // ready();
});

function ready() {
    console.warn("ready");

    // 名前リストを DOM 上に配置する。
    var container = document.querySelector("#target .item-container");
    var nameCount = NAME_LIST.length;
    var pageCount = nameCount - Math.floor(nameCount / 2);
    for (var i = 0; i < pageCount; i++) {
        if (i * 2 < nameCount) {
            var name = NAME_LIST[i * 2];
            appendNameElement(container, name);
        } else {
            appendNameElement(container, "");
        }
    }
    appendNameElement(container, NAME_LIST[0]);
    for (var i = 0; i < pageCount; i++) {
        if (i * 2 + 1 < nameCount) {
            var name = NAME_LIST[i * 2 + 1];
            appendNameElement(container, name);
        } else {
            appendNameElement(container, "");
        }
    }
    appendNameElement(container, NAME_LIST[1]);

    // 必要な横幅を確保する。
    css(document.querySelector("#target .item-container"), {
        width: 640 * (pageCount + 1) + 'px',
    });

    // ランダムな位置からスタートする。
    var t = Math.floor(Math.random() * nameCount);
    var played = false;

    // 次の名前を表示するボタン。
    document.querySelector("#link-show-next").addEventListener('click', function() {
        t = Math.floor(t) + 1;
    });

    function render() {
        // カメラが表示されるタイミングで実行する。
        if (!played && document.querySelector("video")) {
            played = true;
            play();
        }

        function easeInOut(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }

        var TARGET_WIDTH = 640;

        // 位置計算をがんばルビィ。
        var u = t - Math.floor(t / pageCount) * pageCount; // 0 ... pageCount
        var v = u - Math.floor(u); // 0 ... 1
        var value = undefined;
        if (0.9 <= v && v < 1.0) {
            value = u - v + easeInOut(v - 0.9, 0, 1, 0.1);
        } else {
            value = u - v;
        }
        css(document.querySelector("#target .item-container"), {
            'margin-left': (-TARGET_WIDTH * value) + 'px',
        });

        t += 0.01;

        requestAnimationFrame(render);
    }

    render();
}

function play() {
    console.warn("play");

    loader.classList.add("hidden");
}
