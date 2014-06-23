$(function(){
var resize = function() {
    var winw = window.innerWidth, w; //, width_thresholds = [680, 780];
    w = window.__post_grid_width;

    if ( (w !== undefined) &&
        ( (w === 680 && winw < 680) ||
            (w === 780 && winw >= 680 && winw < 780) ||
            (w === 10000 && winw >= 780)
            )
        )
    {
        // console.log('noop w:', w+ ', winw:', winw);
        return;
    } else {
        window.__post_grid_width = w =
            winw > 780 ? 10000 :
                winw > 680 ? 780 :
                    680;
        // console.log('op w:', w);
    }

    var posts = document.getElementById('recent-posts');
    var child_nodes = posts.childNodes, k, node, h,
        col_width, col0_y, col1_y, col1_x,
        origin = {x:0, y:0}, node_count = 0, is_col0, row0_max_y;

    posts.style.position = (window.__post_grid_width <= 680) ? null : 'relative';

    for (k in child_nodes) {
        node = child_nodes[k];
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.className === 'breaker') {
                if (window.__post_grid_width <= 680) {
                    node.style.height = null;
                } else {
                    node.style.height = (Math.max(col0_y, col1_y) - row0_max_y) + 'px';
                }
                break;
            }
            if (col0_y === undefined) {
                origin.x = node.offsetLeft;
                origin.y = node.offsetTop;
                col_width = node.clientWidth;
                col0_y = origin.y + node.clientHeight;
                row0_max_y = col0_y;
            } else {
                if (col1_y === undefined) {
                    col1_y = origin.y + node.clientHeight;
                    col1_x = origin.x + node.clientWidth;
                    if (col1_y > row0_max_y) {
                        row0_max_y = col1_y;
                    }
                } else {
                    if (window.__post_grid_width <= 680) {
                        // console.log('Clear');
                        node.style.position = null;
                        node.style.width = null;
                        node.style.left = null;
                        node.style.top = null;
                    } else {
                        is_col0 = (node_count % 2) === 0;
                        node.style.position = 'absolute';
                        node.style.width = col_width + 'px';
                        if (is_col0) {
                            node.style.left = origin.x + 'px';
                            node.style.top = col0_y + 'px';
                            col0_y += node.clientHeight;
                        } else {
                            node.style.left = col1_x + 'px';
                            node.style.top = col1_y + 'px';
                            col1_y += node.clientHeight;
                        }
                    }
                    // console.dir(node);
                }
            }
            ++node_count;
        }
    }
}

resize();
$('window').resize(resize);
});