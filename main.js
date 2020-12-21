import m from 'mithril';
import tagl from 'tagl-mithril';

// prettier-ignore
const { address, aside, footer, header, h1, h2, h3, h4, h5, h6, hgroup, main, nav, section, article, blockquote, dd, dir, div, dl, dt, figcaption, figure, hr, li, ol, p, pre, ul, a, abbr, b, bdi, bdo, br, cite, code, data, dfn, em, i, kdm, mark, q, rb, rp, rt, rtc, ruby, s, samp, small, span, strong, sub, sup, time, tt, u, wbr, area, audio, img, map, track, video, embed, iframe, noembed, object, param, picture, source, canvas, noscript, script, del, ins, caption, col, colgroup, table, tbody, td, tfoot, th, thead, tr, button, datalist, fieldset, form, formfield, input, label, legend, meter, optgroup, option, output, progress, select, textarea, details, dialog, menu, menuitem, summary, content, element, slot, template } = tagl(m);


let text = 'Bitte lass mich was verschlüsseln';

const range = (S, N, r = []) => S === N ? r : range(S + (N > S ? 1 : -1), N, [...r, S]);
const use = (v, fn) => fn(v);

const logistic = (x, r) => r * x * (1 - x);

const key = (N, x = .4, R = 3.57) => range(0, N).map(i => x = logistic(x, R)).map(e => e * 1000000).map(e => Math.trunc(e) % 255);

let keyStr = '(N, x = .4) => range(0, N).map(i => x = logistic(x, 3.58)).map(e => e * 1000000).map(e => Math.trunc(e) % 255)';

const chunk = (arr, n) => use(arr.map(e => e), copy => {
    let r = [];
    while (copy.length)
        r.push(copy.splice(0, n));
    return r;
});

const toInt = s => range(0, s.length)
    .map(i => s.charCodeAt(i));

const toHex = n => n.map(e => use(e.toString(16), s => (s.length === 1 ? '0' : '') + s)).join('');

const fromHex = n => chunk(n.split(''), 2)
    .map(e => e.join(''))
    .map(e => parseInt(e, 16))
    .map(e => String.fromCharCode(e))
    .join('');

const encrypt = (text = '', keyFn = key) => toHex(use(keyFn(text.length),
    k => toInt(text).map((e, i) => e ^ k[i])));

const decrypt = (cypher = '', keyFn = key) =>
    use(keyFn(cypher.length * 2),
        k => toInt(fromHex(cypher))
        .map((e, i) => e ^ k[i])
        .map(e => String.fromCharCode(e)).join(''));

let cypher = '';
let keyInput = .4;

m.mount(document.body, {
    view: vnode => [
        h1('geheim'),
        label('Klartext'),
        input({ value: text, oninput: e => text = e.target.value }),
        input({ type: 'number', oninput: e => keyInput = Number('0.' + e.target.value) }),
        pre(encrypt(text, N => key(N, keyInput))),
        label('Schiffrat'),
        input({ oninput: e => cypher = e.target.value }),
        pre(decrypt(cypher, N => key(N, keyInput)))
    ]
})