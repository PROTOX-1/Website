import {html, dom, dashToCamelCase, Polymer, dedupingMixin} from "chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js";
import {mojo} from "chrome://resources/mojo/mojo/public/js/bindings.js";
import {css, CrLitElement, html as html$1, nothing} from "chrome://resources/lit/v3_0/lit.rollup.js";
import {TimeDeltaSpec} from "chrome://resources/mojo/mojo/public/mojom/base/time.mojom-webui.js";
import "./strings.m.js";
import {loadTimeData} from "chrome://resources/js/load_time_data.js";
import {PageHandlerRemote, PageCallbackRouter, PageHandlerFactory} from "./new_tab_page.mojom-webui.js";
// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const isMac = /Mac/.test(navigator.platform);
const isWindows = /Win/.test(navigator.platform);
const isAndroid = /Android/.test(navigator.userAgent);
const isIOS = /CriOS/.test(navigator.userAgent);
// Copyright 2016 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getSupportedScaleFactors() {
    const supportedScaleFactors = [];
    if (!isIOS) {
        supportedScaleFactors.push(1)
    }
    if (!isIOS && !isAndroid) {
        supportedScaleFactors.push(2)
    } else {
        supportedScaleFactors.push(window.devicePixelRatio)
    }
    return supportedScaleFactors
}
function getUrlForCss(s) {
    const s2 = s.replace(/(\(|\)|\,|\s|\'|\"|\\)/g, "\\$1");
    return `url("${s2}")`
}
function getImageSet(path) {
    const supportedScaleFactors = getSupportedScaleFactors();
    const replaceStartIndex = path.indexOf("SCALEFACTOR");
    if (replaceStartIndex < 0) {
        return getUrlForCss(path)
    }
    let s = "";
    for (let i = 0; i < supportedScaleFactors.length; ++i) {
        const scaleFactor = supportedScaleFactors[i];
        const pathWithScaleFactor = path.substr(0, replaceStartIndex) + scaleFactor + path.substr(replaceStartIndex + "scalefactor".length);
        s += getUrlForCss(pathWithScaleFactor) + " " + scaleFactor + "x";
        if (i !== supportedScaleFactors.length - 1) {
            s += ", "
        }
    }
    return "image-set(" + s + ")"
}
function getBaseFaviconUrl() {
    const faviconUrl = new URL("chrome://favicon2/");
    faviconUrl.searchParams.set("size", "16");
    faviconUrl.searchParams.set("scaleFactor", "SCALEFACTORx");
    return faviconUrl
}
function getFaviconForPageURL(url, isSyncedUrlForHistoryUi, remoteIconUrlForUma="", size=16, forceLightMode=false) {
    const faviconUrl = getBaseFaviconUrl();
    faviconUrl.searchParams.set("size", size.toString());
    faviconUrl.searchParams.set("pageUrl", url);
    const fallback = isSyncedUrlForHistoryUi ? "1" : "0";
    faviconUrl.searchParams.set("allowGoogleServerFallback", fallback);
    if (isSyncedUrlForHistoryUi) {
        faviconUrl.searchParams.set("iconUrl", remoteIconUrlForUma)
    }
    if (forceLightMode) {
        faviconUrl.searchParams.set("forceLightMode", "true")
    }
    return getImageSet(faviconUrl.toString())
}
const sheet = new CSSStyleSheet;
sheet.replaceSync(`html{--google-blue-50-rgb:232,240,254;--google-blue-50:rgb(var(--google-blue-50-rgb));--google-blue-100-rgb:210,227,252;--google-blue-100:rgb(var(--google-blue-100-rgb));--google-blue-200-rgb:174,203,250;--google-blue-200:rgb(var(--google-blue-200-rgb));--google-blue-300-rgb:138,180,248;--google-blue-300:rgb(var(--google-blue-300-rgb));--google-blue-400-rgb:102,157,246;--google-blue-400:rgb(var(--google-blue-400-rgb));--google-blue-500-rgb:66,133,244;--google-blue-500:rgb(var(--google-blue-500-rgb));--google-blue-600-rgb:26,115,232;--google-blue-600:rgb(var(--google-blue-600-rgb));--google-blue-700-rgb:25,103,210;--google-blue-700:rgb(var(--google-blue-700-rgb));--google-blue-800-rgb:24,90,188;--google-blue-800:rgb(var(--google-blue-800-rgb));--google-blue-900-rgb:23,78,166;--google-blue-900:rgb(var(--google-blue-900-rgb));--google-green-50-rgb:230,244,234;--google-green-50:rgb(var(--google-green-50-rgb));--google-green-200-rgb:168,218,181;--google-green-200:rgb(var(--google-green-200-rgb));--google-green-300-rgb:129,201,149;--google-green-300:rgb(var(--google-green-300-rgb));--google-green-400-rgb:91,185,116;--google-green-400:rgb(var(--google-green-400-rgb));--google-green-500-rgb:52,168,83;--google-green-500:rgb(var(--google-green-500-rgb));--google-green-600-rgb:30,142,62;--google-green-600:rgb(var(--google-green-600-rgb));--google-green-700-rgb:24,128,56;--google-green-700:rgb(var(--google-green-700-rgb));--google-green-800-rgb:19,115,51;--google-green-800:rgb(var(--google-green-800-rgb));--google-green-900-rgb:13,101,45;--google-green-900:rgb(var(--google-green-900-rgb));--google-grey-50-rgb:248,249,250;--google-grey-50:rgb(var(--google-grey-50-rgb));--google-grey-100-rgb:241,243,244;--google-grey-100:rgb(var(--google-grey-100-rgb));--google-grey-200-rgb:232,234,237;--google-grey-200:rgb(var(--google-grey-200-rgb));--google-grey-300-rgb:218,220,224;--google-grey-300:rgb(var(--google-grey-300-rgb));--google-grey-400-rgb:189,193,198;--google-grey-400:rgb(var(--google-grey-400-rgb));--google-grey-500-rgb:154,160,166;--google-grey-500:rgb(var(--google-grey-500-rgb));--google-grey-600-rgb:128,134,139;--google-grey-600:rgb(var(--google-grey-600-rgb));--google-grey-700-rgb:95,99,104;--google-grey-700:rgb(var(--google-grey-700-rgb));--google-grey-800-rgb:60,64,67;--google-grey-800:rgb(var(--google-grey-800-rgb));--google-grey-900-rgb:32,33,36;--google-grey-900:rgb(var(--google-grey-900-rgb));--google-grey-900-white-4-percent:#292a2d;--google-purple-200-rgb:215,174,251;--google-purple-200:rgb(var(--google-purple-200-rgb));--google-purple-900-rgb:104,29,168;--google-purple-900:rgb(var(--google-purple-900-rgb));--google-red-100-rgb:244,199,195;--google-red-100:rgb(var(--google-red-100-rgb));--google-red-300-rgb:242,139,130;--google-red-300:rgb(var(--google-red-300-rgb));--google-red-500-rgb:234,67,53;--google-red-500:rgb(var(--google-red-500-rgb));--google-red-600-rgb:217,48,37;--google-red-600:rgb(var(--google-red-600-rgb));--google-red-700-rgb:197,57,41;--google-red-700:rgb(var(--google-red-700-rgb));--google-yellow-50-rgb:254,247,224;--google-yellow-50:rgb(var(--google-yellow-50-rgb));--google-yellow-100-rgb:254,239,195;--google-yellow-100:rgb(var(--google-yellow-100-rgb));--google-yellow-200-rgb:253,226,147;--google-yellow-200:rgb(var(--google-yellow-200-rgb));--google-yellow-300-rgb:253,214,51;--google-yellow-300:rgb(var(--google-yellow-300-rgb));--google-yellow-400-rgb:252,201,52;--google-yellow-400:rgb(var(--google-yellow-400-rgb));--google-yellow-500-rgb:251,188,4;--google-yellow-500:rgb(var(--google-yellow-500-rgb));--google-yellow-700-rgb:240,147,0;--google-yellow-700:rgb(var(--google-yellow-700-rgb));--cr-card-background-color:white;--cr-shadow-key-color_:color-mix(in srgb, var(--cr-shadow-color) 30%, transparent);--cr-shadow-ambient-color_:color-mix(in srgb, var(--cr-shadow-color) 15%, transparent);--cr-elevation-1:var(--cr-shadow-key-color_) 0 1px 2px 0,var(--cr-shadow-ambient-color_) 0 1px 3px 1px;--cr-elevation-2:var(--cr-shadow-key-color_) 0 1px 2px 0,var(--cr-shadow-ambient-color_) 0 2px 6px 2px;--cr-elevation-3:var(--cr-shadow-key-color_) 0 1px 3px 0,var(--cr-shadow-ambient-color_) 0 4px 8px 3px;--cr-elevation-4:var(--cr-shadow-key-color_) 0 2px 3px 0,var(--cr-shadow-ambient-color_) 0 6px 10px 4px;--cr-elevation-5:var(--cr-shadow-key-color_) 0 4px 4px 0,var(--cr-shadow-ambient-color_) 0 8px 12px 6px;--cr-card-shadow:var(--cr-elevation-2);--cr-focused-item-color:var(--google-grey-300);--cr-form-field-label-color:var(--google-grey-700);--cr-hairline-rgb:0,0,0;--cr-iph-anchor-highlight-color:rgba(var(--google-blue-600-rgb), 0.1);--cr-menu-background-color:white;--cr-menu-background-focus-color:var(--google-grey-400);--cr-menu-shadow:var(--cr-elevation-2);--cr-separator-color:rgba(0, 0, 0, .06);--cr-title-text-color:rgb(90, 90, 90);--scrollable-border-color:var(--google-grey-300)}@media (prefers-color-scheme:dark){html{--cr-card-background-color:var(--google-grey-900-white-4-percent);--cr-focused-item-color:var(--google-grey-800);--cr-form-field-label-color:var(--dark-secondary-color);--cr-hairline-rgb:255,255,255;--cr-iph-anchor-highlight-color:rgba(var(--google-grey-100-rgb), 0.1);--cr-menu-background-color:var(--google-grey-900);--cr-menu-background-focus-color:var(--google-grey-700);--cr-menu-background-sheen:rgba(255, 255, 255, .06);--cr-menu-shadow:rgba(0, 0, 0, .3) 0 1px 2px 0,rgba(0, 0, 0, .15) 0 3px 6px 2px;--cr-separator-color:rgba(255, 255, 255, .1);--cr-title-text-color:var(--cr-primary-text-color);--scrollable-border-color:var(--google-grey-700)}}@media (forced-colors:active){html{--cr-focus-outline-hcm:2px solid transparent;--cr-border-hcm:2px solid transparent}}html{--cr-button-edge-spacing:12px;--cr-controlled-by-spacing:24px;--cr-default-input-max-width:264px;--cr-icon-ripple-size:36px;--cr-icon-ripple-padding:8px;--cr-icon-size:20px;--cr-icon-button-margin-start:16px;--cr-icon-ripple-margin:calc(var(--cr-icon-ripple-padding) * -1);--cr-section-min-height:48px;--cr-section-two-line-min-height:64px;--cr-section-padding:20px;--cr-section-vertical-padding:12px;--cr-section-indent-width:40px;--cr-section-indent-padding:calc(\n      var(--cr-section-padding) + var(--cr-section-indent-width));--cr-section-vertical-margin:21px;--cr-centered-card-max-width:680px;--cr-centered-card-width-percentage:0.96;--cr-hairline:1px solid rgba(var(--cr-hairline-rgb), .14);--cr-separator-height:1px;--cr-separator-line:var(--cr-separator-height) solid var(--cr-separator-color);--cr-toolbar-overlay-animation-duration:150ms;--cr-toolbar-height:56px;--cr-container-shadow-height:6px;--cr-container-shadow-margin:calc(-1 * var(--cr-container-shadow-height));--cr-container-shadow-max-opacity:1;--cr-card-border-radius:8px;--cr-disabled-opacity:.38;--cr-form-field-bottom-spacing:16px;--cr-form-field-label-font-size:.625rem;--cr-form-field-label-height:1em;--cr-form-field-label-line-height:1}html{--cr-fallback-color-outline:rgb(116, 119, 117);--cr-fallback-color-primary:rgb(11, 87, 208);--cr-fallback-color-on-primary:rgb(255, 255, 255);--cr-fallback-color-primary-container:rgb(211, 227, 253);--cr-fallback-color-on-primary-container:rgb(4, 30, 73);--cr-fallback-color-secondary-container:rgb(194, 231, 255);--cr-fallback-color-on-secondary-container:rgb(0, 29, 53);--cr-fallback-color-neutral-container:rgb(242, 242, 242);--cr-fallback-color-neutral-outline:rgb(199, 199, 199);--cr-fallback-color-surface:rgb(255, 255, 255);--cr-fallback-color-surface1:rgb(248, 250, 253);--cr-fallback-color-surface2:rgb(243, 246, 252);--cr-fallback-color-on-surface-rgb:31,31,31;--cr-fallback-color-on-surface:rgb(var(--cr-fallback-color-on-surface-rgb));--cr-fallback-color-surface-variant:rgb(225, 227, 225);--cr-fallback-color-on-surface-variant:rgb(68, 71, 70);--cr-fallback-color-on-surface-subtle:rgb(71, 71, 71);--cr-fallback-color-inverse-primary:rgb(168, 199, 250);--cr-fallback-color-inverse-surface:rgb(48, 48, 48);--cr-fallback-color-inverse-on-surface:rgb(242, 242, 242);--cr-fallback-color-tonal-container:rgb(211, 227, 253);--cr-fallback-color-on-tonal-container:rgb(4, 30, 73);--cr-fallback-color-tonal-outline:rgb(168, 199, 250);--cr-fallback-color-error:rgb(179, 38, 30);--cr-fallback-color-divider:rgb(211, 227, 253);--cr-fallback-color-state-hover-on-prominent_:rgba(253, 252, 251, .1);--cr-fallback-color-state-on-subtle-rgb_:31,31,31;--cr-fallback-color-state-hover-on-subtle_:rgba(\n      var(--cr-fallback-color-state-on-subtle-rgb_), .06);--cr-fallback-color-state-ripple-neutral-on-subtle_:rgba(\n      var(--cr-fallback-color-state-on-subtle-rgb_), .08);--cr-fallback-color-state-ripple-primary-rgb_:124,172,248;--cr-fallback-color-state-ripple-primary_:rgba(\n      var(--cr-fallback-color-state-ripple-primary-rgb_), 0.32);--cr-fallback-color-base-container:rgb(236, 239, 247);--cr-fallback-color-disabled-background:rgba(\n      var(--cr-fallback-color-on-surface-rgb), .12);--cr-fallback-color-disabled-foreground:rgba(\n      var(--cr-fallback-color-on-surface-rgb), var(--cr-disabled-opacity));--cr-hover-background-color:var(--color-sys-state-hover,\n      rgba(var(--cr-fallback-color-on-surface-rgb), .08));--cr-hover-on-prominent-background-color:var(\n      --color-sys-state-hover-on-prominent,\n      var(--cr-fallback-color-state-hover-on-prominent_));--cr-hover-on-subtle-background-color:var(\n      --color-sys-state-hover-on-subtle,\n      var(--cr-fallback-color-state-hover-on-subtle_));--cr-active-background-color:var(--color-sys-state-pressed,\n      rgba(var(--cr-fallback-color-on-surface-rgb), .12));--cr-active-on-primary-background-color:var(\n      --color-sys-state-ripple-primary,\n      var(--cr-fallback-color-state-ripple-primary_));--cr-active-neutral-on-subtle-background-color:var(\n      --color-sys-state-ripple-neutral-on-subtle,\n      var(--cr-fallback-color-state-ripple-neutral-on-subtle_));--cr-focus-outline-color:var(--color-sys-state-focus-ring,\n      var(--cr-fallback-color-primary));--cr-primary-text-color:var(--color-primary-foreground,\n      var(--cr-fallback-color-on-surface));--cr-secondary-text-color:var(--color-secondary-foreground,\n      var(--cr-fallback-color-on-surface-variant));--cr-link-color:var(--color-link-foreground-default,\n      var(--cr-fallback-color-primary));--cr-button-height:36px;--cr-shadow-color:var(--color-sys-shadow, rgb(0, 0, 0));--cr-checked-color:var(\n      --color-checkbox-foreground-checked,\n      var(--cr-fallback-color-primary))}@media (prefers-color-scheme:dark){html{--cr-fallback-color-outline:rgb(142, 145, 143);--cr-fallback-color-primary:rgb(168, 199, 250);--cr-fallback-color-on-primary:rgb(6, 46, 111);--cr-fallback-color-primary-container:rgb(8, 66, 160);--cr-fallback-color-on-primary-container:rgb(211, 227, 253);--cr-fallback-color-secondary-container:rgb(0, 74, 119);--cr-fallback-color-on-secondary-container:rgb(194, 231, 255);--cr-fallback-color-neutral-container:rgb(40, 40, 40);--cr-fallback-color-neutral-outline:rgb(117, 117, 117);--cr-fallback-color-surface:rgb(31, 31, 31);--cr-fallback-color-surface1:rgb(39, 40, 42);--cr-fallback-color-surface2:rgb(45, 47, 49);--cr-fallback-color-on-surface-rgb:227,227,227;--cr-fallback-color-surface-variant:rgb(68, 71, 70);--cr-fallback-color-on-surface-variant:rgb(196, 199, 197);--cr-fallback-color-on-surface-subtle:rgb(199, 199, 199);--cr-fallback-color-inverse-primary:rgb(11, 87, 208);--cr-fallback-color-inverse-surface:rgb(227, 227, 227);--cr-fallback-color-inverse-on-surface:rgb(31, 31, 31);--cr-fallback-color-tonal-container:rgb(0, 74, 119);--cr-fallback-color-on-tonal-container:rgb(194, 231, 255);--cr-fallback-color-tonal-outline:rgb(4, 125, 183);--cr-fallback-color-error:rgb(242, 184, 181);--cr-fallback-color-divider:rgb(94, 94, 94);--cr-fallback-color-state-hover-on-prominent_:rgba(31, 31, 31, .06);--cr-fallback-color-state-on-subtle-rgb_:253,252,251;--cr-fallback-color-state-hover-on-subtle_:rgba(\n        var(--cr-fallback-color-state-on-subtle-rgb_), .10);--cr-fallback-color-state-ripple-neutral-on-subtle_:rgba(\n        var(--cr-fallback-color-state-on-subtle-rgb_), .16);--cr-fallback-color-state-ripple-primary-rgb_:76,141,246;--cr-fallback-color-base-container:rgba(40, 40, 40, 1)}}@media (forced-colors:active){html{--cr-fallback-color-disabled-background:Canvas;--cr-fallback-color-disabled-foreground:GrayText}}`);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
const styleMod = document.createElement("dom-module");
styleMod.appendChild(html`
  <template>
    <style>
:host([hidden]),[hidden]{display:none!important}
    </style>
  </template>
`.content);
styleMod.register("cr-hidden-style");
// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function assert(value, message) {
    if (value) {
        return
    }
    throw new Error("Assertion failed" + (message ? `: ${message}` : ""))
}
function assertInstanceof(value, type, message) {
    if (value instanceof type) {
        return
    }
    throw new Error(`Value ${value} is not of type ${type.name || typeof type}`)
}
function assertNotReached(message="Unreachable code hit") {
    assert(false, message)
}
// Copyright 2012 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function sanitizeInnerHtmlInternal(rawString, opts) {
    opts = opts || {};
    const html = parseHtmlSubset(`<b>${rawString}</b>`, opts.tags, opts.attrs).firstElementChild;
    return html.innerHTML
}
let sanitizedPolicy = null;
function sanitizeInnerHtml(rawString, opts) {
    assert(window.trustedTypes);
    if (sanitizedPolicy === null) {
        sanitizedPolicy = window.trustedTypes.createPolicy("sanitize-inner-html", {
            createHTML: sanitizeInnerHtmlInternal,
            createScript: () => assertNotReached(),
            createScriptURL: () => assertNotReached()
        })
    }
    return sanitizedPolicy.createHTML(rawString, opts)
}
const allowAttribute = (_node, _value) => true;
const allowedAttributes = new Map([["href", (node, value) => node.tagName === "A" && (value.startsWith("chrome://") || value.startsWith("https://") || value === "#")], ["target", (node, value) => node.tagName === "A" && value === "_blank"]]);
const allowedOptionalAttributes = new Map([["class", allowAttribute], ["id", allowAttribute], ["is", (_node, value) => value === "action-link" || value === ""], ["role", (_node, value) => value === "link"], ["src", (node, value) => node.tagName === "IMG" && value.startsWith("chrome://")], ["tabindex", allowAttribute], ["aria-description", allowAttribute], ["aria-hidden", allowAttribute], ["aria-label", allowAttribute], ["aria-labelledby", allowAttribute]]);
const allowedTags = new Set(["A", "B", "I", "BR", "DIV", "EM", "KBD", "P", "PRE", "SPAN", "STRONG"]);
const allowedOptionalTags = new Set(["IMG", "LI", "UL"]);
let unsanitizedPolicy;
function mergeTags(optTags) {
    const clone = new Set(allowedTags);
    optTags.forEach((str => {
        const tag = str.toUpperCase();
        if (allowedOptionalTags.has(tag)) {
            clone.add(tag)
        }
    }
    ));
    return clone
}
function mergeAttrs(optAttrs) {
    const clone = new Map(allowedAttributes);
    optAttrs.forEach((key => {
        if (allowedOptionalAttributes.has(key)) {
            clone.set(key, allowedOptionalAttributes.get(key))
        }
    }
    ));
    return clone
}
function walk(n, f) {
    f(n);
    for (let i = 0; i < n.childNodes.length; i++) {
        walk(n.childNodes[i], f)
    }
}
function assertElement(tags, node) {
    if (!tags.has(node.tagName)) {
        throw Error(node.tagName + " is not supported")
    }
}
function assertAttribute(attrs, attrNode, node) {
    const n = attrNode.nodeName;
    const v = attrNode.nodeValue || "";
    if (!attrs.has(n) || !attrs.get(n)(node, v)) {
        throw Error(node.tagName + "[" + n + '="' + v + '"] is not supported')
    }
}
function parseHtmlSubset(s, extraTags, extraAttrs) {
    const tags = extraTags ? mergeTags(extraTags) : allowedTags;
    const attrs = extraAttrs ? mergeAttrs(extraAttrs) : allowedAttributes;
    const doc = document.implementation.createHTMLDocument("");
    const r = doc.createRange();
    r.selectNode(doc.body);
    if (window.trustedTypes) {
        if (!unsanitizedPolicy) {
            unsanitizedPolicy = window.trustedTypes.createPolicy("parse-html-subset", {
                createHTML: untrustedHTML => untrustedHTML,
                createScript: () => assertNotReached(),
                createScriptURL: () => assertNotReached()
            })
        }
        s = unsanitizedPolicy.createHTML(s)
    }
    const df = r.createContextualFragment(s);
    walk(df, (function(node) {
        switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            assertElement(tags, node);
            const nodeAttrs = node.attributes;
            for (let i = 0; i < nodeAttrs.length; ++i) {
                assertAttribute(attrs, nodeAttrs[i], node)
            }
            break;
        case Node.COMMENT_NODE:
        case Node.DOCUMENT_FRAGMENT_NODE:
        case Node.TEXT_NODE:
            break;
        default:
            throw Error("Node type " + node.nodeType + " is not supported")
        }
    }
    ));
    return df
}
let instance$h = null;
function getCss$d() {
    return instance$h || (instance$h = [...[], css`:host([hidden]),[hidden]{display:none!important}`])
}
let instance$g = null;
function getCss$c() {
    return instance$g || (instance$g = [...[getCss$d()], css`:host{align-items:center;display:inline-flex;justify-content:center;position:relative;vertical-align:middle;fill:var(--iron-icon-fill-color,currentcolor);stroke:var(--iron-icon-stroke-color,none);width:var(--iron-icon-width,24px);height:var(--iron-icon-height,24px)}`])
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
let iconsetMap = null;
class IconsetMap extends EventTarget {
    constructor() {
        super(...arguments);
        this.iconsets_ = new Map
    }
    static getInstance() {
        return iconsetMap || (iconsetMap = new IconsetMap)
    }
    static resetInstanceForTesting(instance) {
        iconsetMap = instance
    }
    get(id) {
        return this.iconsets_.get(id) || null
    }
    set(id, iconset) {
        assert(!this.iconsets_.has(id), "Tried to add a second iconset with id " + id);
        this.iconsets_.set(id, iconset);
        this.dispatchEvent(new CustomEvent("cr-iconset-added",{
            detail: id
        }))
    }
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class CrIconElement extends CrLitElement {
    constructor() {
        super(...arguments);
        this.icon = "";
        this.iconsetName_ = "";
        this.iconName_ = "";
        this.iconset_ = null
    }
    static get is() {
        return "cr-icon"
    }
    static get styles() {
        return getCss$c()
    }
    static get properties() {
        return {
            icon: {
                type: String
            }
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("icon")) {
            const [iconsetName,iconName] = this.icon.split(":");
            this.iconName_ = iconName || "";
            this.iconsetName_ = iconsetName || "";
            this.updateIcon_()
        }
    }
    updateIcon_() {
        if (this.iconName_ === "" && this.iconset_) {
            this.iconset_.removeIcon(this)
        } else if (this.iconsetName_) {
            const iconsetMap = IconsetMap.getInstance();
            this.iconset_ = iconsetMap.get(this.iconsetName_);
            assert(this.iconset_, `Could not find iconset for: '${this.iconsetName_}:${this.iconName_}'`);
            this.iconset_.applyIcon(this, this.iconName_)
        }
    }
}
customElements.define(CrIconElement.is, CrIconElement);
// Copyright 2011 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class EventTracker {
    listeners_ = [];
    add(target, eventType, listener, capture=false) {
        const h = {
            target: target,
            eventType: eventType,
            listener: listener,
            capture: capture
        };
        this.listeners_.push(h);
        target.addEventListener(eventType, listener, capture)
    }
    remove(target, eventType) {
        this.listeners_ = this.listeners_.filter((listener => {
            if (listener.target === target && (!eventType || listener.eventType === eventType)) {
                EventTracker.removeEventListener(listener);
                return false
            }
            return true
        }
        ))
    }
    removeAll() {
        this.listeners_.forEach((listener => EventTracker.removeEventListener(listener)));
        this.listeners_ = []
    }
    static removeEventListener(entry) {
        entry.target.removeEventListener(entry.eventType, entry.listener, entry.capture)
    }
}
let instance$f = null;
function getCss$b() {
    return instance$f || (instance$f = [...[], css`:host{bottom:0;display:block;left:0;overflow:hidden;pointer-events:none;position:absolute;right:0;top:0;transform:translate3d(0,0,0)}.ripple{background-color:currentcolor;left:0;opacity:var(--paper-ripple-opacity,.25);pointer-events:none;position:absolute;will-change:height,transform,width}.ripple,:host(.circle){border-radius:50%}`])
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const MAX_RADIUS_PX = 300;
const MIN_DURATION_MS = 800;
function distance(x1, y1, x2, y2) {
    const xDelta = x1 - x2;
    const yDelta = y1 - y2;
    return Math.sqrt(xDelta * xDelta + yDelta * yDelta)
}
class CrRippleElement extends CrLitElement {
    constructor() {
        super(...arguments);
        this.holdDown = false;
        this.recenters = false;
        this.noink = false;
        this.ripples_ = [];
        this.eventTracker_ = new EventTracker
    }
    static get is() {
        return "cr-ripple"
    }
    static get styles() {
        return getCss$b()
    }
    static get properties() {
        return {
            holdDown: {
                type: Boolean
            },
            recenters: {
                type: Boolean
            },
            noink: {
                type: Boolean
            }
        }
    }
    connectedCallback() {
        super.connectedCallback();
        assert(this.parentNode);
        const keyEventTarget = this.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? this.parentNode.host : this.parentElement;
        this.eventTracker_.add(keyEventTarget, "pointerdown", (e => this.uiDownAction(e)));
        this.eventTracker_.add(keyEventTarget, "pointerup", ( () => this.uiUpAction()));
        this.eventTracker_.add(keyEventTarget, "keydown", (e => {
            if (e.defaultPrevented) {
                return
            }
            if (e.key === "Enter") {
                this.onEnterKeydown_();
                return
            }
            if (e.key === " ") {
                this.onSpaceKeydown_()
            }
        }
        ));
        this.eventTracker_.add(keyEventTarget, "keyup", (e => {
            if (e.defaultPrevented) {
                return
            }
            if (e.key === " ") {
                this.onSpaceKeyup_()
            }
        }
        ))
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.eventTracker_.removeAll()
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("holdDown")) {
            this.holdDownChanged_(this.holdDown, changedProperties.get("holdDown"))
        }
    }
    uiDownAction(e) {
        if (e !== undefined && e.button !== 0) {
            return
        }
        if (!this.noink) {
            this.downAction_(e)
        }
    }
    downAction_(e) {
        if (this.ripples_.length && this.holdDown) {
            return
        }
        this.showRipple_(e)
    }
    clear() {
        this.hideRipple_();
        this.holdDown = false
    }
    showAndHoldDown() {
        this.ripples_.forEach((ripple => {
            ripple.remove()
        }
        ));
        this.ripples_ = [];
        this.holdDown = true
    }
    showRipple_(e) {
        const rect = this.getBoundingClientRect();
        const roundedCenterX = function() {
            return Math.round(rect.width / 2)
        };
        const roundedCenterY = function() {
            return Math.round(rect.height / 2)
        };
        let x = 0;
        let y = 0;
        const centered = !e;
        if (centered) {
            x = roundedCenterX();
            y = roundedCenterY()
        } else {
            x = Math.round(e.clientX - rect.left);
            y = Math.round(e.clientY - rect.top)
        }
        const corners = [{
            x: 0,
            y: 0
        }, {
            x: rect.width,
            y: 0
        }, {
            x: 0,
            y: rect.height
        }, {
            x: rect.width,
            y: rect.height
        }];
        const cornerDistances = corners.map((function(corner) {
            return Math.round(distance(x, y, corner.x, corner.y))
        }
        ));
        const radius = Math.min(MAX_RADIUS_PX, Math.max.apply(Math, cornerDistances));
        const startTranslate = `${x - radius}px, ${y - radius}px`;
        let endTranslate = startTranslate;
        if (this.recenters && !centered) {
            endTranslate = `${roundedCenterX() - radius}px, ${roundedCenterY() - radius}px`
        }
        const ripple = document.createElement("div");
        ripple.classList.add("ripple");
        ripple.style.height = ripple.style.width = 2 * radius + "px";
        this.ripples_.push(ripple);
        this.shadowRoot.appendChild(ripple);
        ripple.animate({
            transform: [`translate(${startTranslate}) scale(0)`, `translate(${endTranslate}) scale(1)`]
        }, {
            duration: Math.max(MIN_DURATION_MS, Math.log(radius) * radius) || 0,
            easing: "cubic-bezier(.2, .9, .1, .9)",
            fill: "forwards"
        })
    }
    uiUpAction() {
        if (!this.noink) {
            this.upAction_()
        }
    }
    upAction_() {
        if (!this.holdDown) {
            this.hideRipple_()
        }
    }
    hideRipple_() {
        if (this.ripples_.length === 0) {
            return
        }
        this.ripples_.forEach((function(ripple) {
            const opacity = ripple.computedStyleMap().get("opacity");
            if (opacity === null) {
                ripple.remove();
                return
            }
            const animation = ripple.animate({
                opacity: [opacity.value, 0]
            }, {
                duration: 150,
                fill: "forwards"
            });
            animation.finished.then(( () => {
                ripple.remove()
            }
            ))
        }
        ));
        this.ripples_ = []
    }
    onEnterKeydown_() {
        this.uiDownAction();
        window.setTimeout(( () => {
            this.uiUpAction()
        }
        ), 1)
    }
    onSpaceKeydown_() {
        this.uiDownAction()
    }
    onSpaceKeyup_() {
        this.uiUpAction()
    }
    holdDownChanged_(newHoldDown, oldHoldDown) {
        if (oldHoldDown === undefined) {
            return
        }
        if (newHoldDown) {
            this.downAction_()
        } else {
            this.upAction_()
        }
    }
}
customElements.define(CrRippleElement.is, CrRippleElement);
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const CrRippleMixin = superClass => {
    class CrRippleMixin extends superClass {
        constructor() {
            super(...arguments);
            this.noink = false;
            this.rippleContainer = null;
            this.ripple_ = null
        }
        static get properties() {
            return {
                noink: {
                    type: Boolean
                }
            }
        }
        updated(changedProperties) {
            super.updated(changedProperties);
            if (changedProperties.has("noink") && this.hasRipple()) {
                assert(this.ripple_);
                this.ripple_.noink = this.noink
            }
        }
        ensureRippleOnPointerdown() {
            this.addEventListener("pointerdown", ( () => this.ensureRipple()), {
                capture: true
            })
        }
        ensureRipple() {
            if (this.hasRipple()) {
                return
            }
            this.ripple_ = this.createRipple();
            this.ripple_.noink = this.noink;
            const rippleContainer = this.rippleContainer || this.shadowRoot;
            assert(rippleContainer);
            rippleContainer.appendChild(this.ripple_)
        }
        getRipple() {
            this.ensureRipple();
            assert(this.ripple_);
            return this.ripple_
        }
        hasRipple() {
            return Boolean(this.ripple_)
        }
        createRipple() {
            const ripple = document.createElement("cr-ripple");
            ripple.id = "ink";
            return ripple
        }
    }
    return CrRippleMixin
}
;
let instance$e = null;
function getCss$a() {
    return instance$e || (instance$e = [...[], css`:host{--cr-icon-button-fill-color:currentColor;--cr-icon-button-icon-start-offset:0;--cr-icon-button-icon-size:20px;--cr-icon-button-size:32px;--cr-icon-button-height:var(--cr-icon-button-size);--cr-icon-button-transition:150ms ease-in-out;--cr-icon-button-width:var(--cr-icon-button-size);-webkit-tap-highlight-color:transparent;border-radius:50%;color:var(--cr-icon-button-stroke-color,var(--cr-icon-button-fill-color));cursor:pointer;display:inline-flex;flex-shrink:0;height:var(--cr-icon-button-height);margin-inline-end:var(--cr-icon-button-margin-end,var(--cr-icon-ripple-margin));margin-inline-start:var(--cr-icon-button-margin-start);outline:0;overflow:hidden;position:relative;user-select:none;vertical-align:middle;width:var(--cr-icon-button-width)}:host(:hover){background-color:var(--cr-icon-button-hover-background-color,var(--cr-hover-background-color))}:host(:focus-visible:focus){box-shadow:inset 0 0 0 2px var(--cr-icon-button-focus-outline-color,var(--cr-focus-outline-color))}@media (forced-colors:active){:host(:focus-visible:focus){outline:var(--cr-focus-outline-hcm)}}#ink{--paper-ripple-opacity:1;color:var(--cr-icon-button-active-background-color,var(--cr-active-background-color))}:host([disabled]){cursor:initial;opacity:var(--cr-disabled-opacity);pointer-events:none}:host(.no-overlap){--cr-icon-button-margin-end:0;--cr-icon-button-margin-start:0}:host-context([dir=rtl]):host(:not([suppress-rtl-flip]):not([multiple-icons_])){transform:scaleX(-1)}:host-context([dir=rtl]):host(:not([suppress-rtl-flip])[multiple-icons_]) cr-icon{transform:scaleX(-1)}:host(:not([iron-icon])) #maskedImage{-webkit-mask-image:var(--cr-icon-image);-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:var(--cr-icon-button-icon-size);-webkit-transform:var(--cr-icon-image-transform,none);background-color:var(--cr-icon-button-fill-color);height:100%;transition:background-color var(--cr-icon-button-transition);width:100%}@media (forced-colors:active){:host(:not([iron-icon])) #maskedImage{background-color:ButtonText}}#icon{align-items:center;border-radius:4px;display:flex;height:100%;justify-content:center;padding-inline-start:var(--cr-icon-button-icon-start-offset);position:relative;width:100%}cr-icon{--iron-icon-fill-color:var(--cr-icon-button-fill-color);--iron-icon-stroke-color:var(--cr-icon-button-stroke-color, none);--iron-icon-height:var(--cr-icon-button-icon-size);--iron-icon-width:var(--cr-icon-button-icon-size);transition:fill var(--cr-icon-button-transition),stroke var(--cr-icon-button-transition)}@media (prefers-color-scheme:dark){:host{--cr-icon-button-fill-color:var(--google-grey-500)}}`])
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getHtml$7() {
    return html$1`
<div id="icon">
  <div id="maskedImage"></div>
</div>`
}
// Copyright 2018 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const CrIconbuttonElementBase = CrRippleMixin(CrLitElement);
class CrIconButtonElement extends CrIconbuttonElementBase {
    static get is() {
        return "cr-icon-button"
    }
    static get styles() {
        return getCss$a()
    }
    render() {
        return getHtml$7.bind(this)()
    }
    static get properties() {
        return {
            disabled: {
                type: Boolean,
                reflect: true
            },
            ironIcon: {
                type: String,
                reflect: true
            },
            suppressRtlFlip: {
                type: Boolean,
                value: false,
                reflect: true
            },
            multipleIcons_: {
                type: Boolean,
                reflect: true
            }
        }
    }
    constructor() {
        super();
        this.disabled = false;
        this.multipleIcons_ = false;
        this.spaceKeyDown_ = false;
        this.addEventListener("blur", this.onBlur_.bind(this));
        this.addEventListener("click", this.onClick_.bind(this));
        this.addEventListener("keydown", this.onKeyDown_.bind(this));
        this.addEventListener("keyup", this.onKeyUp_.bind(this));
        this.ensureRippleOnPointerdown()
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("ironIcon")) {
            const icons = (this.ironIcon || "").split(",");
            this.multipleIcons_ = icons.length > 1
        }
    }
    firstUpdated() {
        if (!this.hasAttribute("role")) {
            this.setAttribute("role", "button")
        }
        if (!this.hasAttribute("tabindex")) {
            this.setAttribute("tabindex", "0")
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("disabled")) {
            this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
            this.disabledChanged_(this.disabled, changedProperties.get("disabled"))
        }
        if (changedProperties.has("ironIcon")) {
            this.onIronIconChanged_()
        }
    }
    disabledChanged_(newValue, oldValue) {
        if (!newValue && oldValue === undefined) {
            return
        }
        if (this.disabled) {
            this.blur()
        }
        this.setAttribute("tabindex", String(this.disabled ? -1 : 0))
    }
    onBlur_() {
        this.spaceKeyDown_ = false
    }
    onClick_(e) {
        if (this.disabled) {
            e.stopImmediatePropagation()
        }
    }
    async onIronIconChanged_() {
        this.shadowRoot.querySelectorAll("cr-icon").forEach((el => el.remove()));
        if (!this.ironIcon) {
            return
        }
        const icons = (this.ironIcon || "").split(",");
        icons.forEach((async icon => {
            const crIcon = document.createElement("cr-icon");
            crIcon.icon = icon;
            this.$.icon.appendChild(crIcon);
            await crIcon.updateComplete;
            crIcon.shadowRoot.querySelectorAll("svg, img").forEach((child => child.setAttribute("role", "none")))
        }
        ))
    }
    onKeyDown_(e) {
        if (e.key !== " " && e.key !== "Enter") {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) {
            return
        }
        if (e.key === "Enter") {
            this.click()
        } else if (e.key === " ") {
            this.spaceKeyDown_ = true
        }
    }
    onKeyUp_(e) {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation()
        }
        if (this.spaceKeyDown_ && e.key === " ") {
            this.spaceKeyDown_ = false;
            this.click()
        }
    }
}
customElements.define(CrIconButtonElement.is, CrIconButtonElement);
/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
class IronSelection {
    constructor(selectCallback) {
        this.selection = [];
        this.selectCallback = selectCallback
    }
    get() {
        return this.multi ? this.selection.slice() : this.selection[0]
    }
    clear(excludes) {
        this.selection.slice().forEach((function(item) {
            if (!excludes || excludes.indexOf(item) < 0) {
                this.setItemSelected(item, false)
            }
        }
        ), this)
    }
    isSelected(item) {
        return this.selection.indexOf(item) >= 0
    }
    setItemSelected(item, isSelected) {
        if (item != null) {
            if (isSelected !== this.isSelected(item)) {
                if (isSelected) {
                    this.selection.push(item)
                } else {
                    var i = this.selection.indexOf(item);
                    if (i >= 0) {
                        this.selection.splice(i, 1)
                    }
                }
                if (this.selectCallback) {
                    this.selectCallback(item, isSelected)
                }
            }
        }
    }
    select(item) {
        if (this.multi) {
            this.toggle(item)
        } else if (this.get() !== item) {
            this.setItemSelected(this.get(), false);
            this.setItemSelected(item, true)
        }
    }
    toggle(item) {
        this.setItemSelected(item, !this.isSelected(item))
    }
}
/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const IronSelectableBehavior = {
    properties: {
        attrForSelected: {
            type: String,
            value: null
        },
        selected: {
            type: String,
            notify: true
        },
        selectedItem: {
            type: Object,
            readOnly: true,
            notify: true
        },
        activateEvent: {
            type: String,
            value: "tap",
            observer: "_activateEventChanged"
        },
        selectable: String,
        selectedClass: {
            type: String,
            value: "iron-selected"
        },
        selectedAttribute: {
            type: String,
            value: null
        },
        fallbackSelection: {
            type: String,
            value: null
        },
        items: {
            type: Array,
            readOnly: true,
            notify: true,
            value: function() {
                return []
            }
        },
        _excludedLocalNames: {
            type: Object,
            value: function() {
                return {
                    template: 1,
                    "dom-bind": 1,
                    "dom-if": 1,
                    "dom-repeat": 1
                }
            }
        }
    },
    observers: ["_updateAttrForSelected(attrForSelected)", "_updateSelected(selected)", "_checkFallback(fallbackSelection)"],
    created: function() {
        this._bindFilterItem = this._filterItem.bind(this);
        this._selection = new IronSelection(this._applySelection.bind(this))
    },
    attached: function() {
        this._observer = this._observeItems(this);
        this._addListener(this.activateEvent)
    },
    detached: function() {
        if (this._observer) {
            dom(this).unobserveNodes(this._observer)
        }
        this._removeListener(this.activateEvent)
    },
    indexOf: function(item) {
        return this.items ? this.items.indexOf(item) : -1
    },
    select: function(value) {
        this.selected = value
    },
    selectPrevious: function() {
        var length = this.items.length;
        var index = length - 1;
        if (this.selected !== undefined) {
            index = (Number(this._valueToIndex(this.selected)) - 1 + length) % length
        }
        this.selected = this._indexToValue(index)
    },
    selectNext: function() {
        var index = 0;
        if (this.selected !== undefined) {
            index = (Number(this._valueToIndex(this.selected)) + 1) % this.items.length
        }
        this.selected = this._indexToValue(index)
    },
    selectIndex: function(index) {
        this.select(this._indexToValue(index))
    },
    forceSynchronousItemUpdate: function() {
        if (this._observer && typeof this._observer.flush === "function") {
            this._observer.flush()
        } else {
            this._updateItems()
        }
    },
    get _shouldUpdateSelection() {
        return this.selected != null
    },
    _checkFallback: function() {
        this._updateSelected()
    },
    _addListener: function(eventName) {
        this.listen(this, eventName, "_activateHandler")
    },
    _removeListener: function(eventName) {
        this.unlisten(this, eventName, "_activateHandler")
    },
    _activateEventChanged: function(eventName, old) {
        this._removeListener(old);
        this._addListener(eventName)
    },
    _updateItems: function() {
        var nodes = dom(this).queryDistributedElements(this.selectable || "*");
        nodes = Array.prototype.filter.call(nodes, this._bindFilterItem);
        this._setItems(nodes)
    },
    _updateAttrForSelected: function() {
        if (this.selectedItem) {
            this.selected = this._valueForItem(this.selectedItem)
        }
    },
    _updateSelected: function() {
        this._selectSelected(this.selected)
    },
    _selectSelected: function(selected) {
        if (!this.items) {
            return
        }
        var item = this._valueToItem(this.selected);
        if (item) {
            this._selection.select(item)
        } else {
            this._selection.clear()
        }
        if (this.fallbackSelection && this.items.length && this._selection.get() === undefined) {
            this.selected = this.fallbackSelection
        }
    },
    _filterItem: function(node) {
        return !this._excludedLocalNames[node.localName]
    },
    _valueToItem: function(value) {
        return value == null ? null : this.items[this._valueToIndex(value)]
    },
    _valueToIndex: function(value) {
        if (this.attrForSelected) {
            for (var i = 0, item; item = this.items[i]; i++) {
                if (this._valueForItem(item) == value) {
                    return i
                }
            }
        } else {
            return Number(value)
        }
    },
    _indexToValue: function(index) {
        if (this.attrForSelected) {
            var item = this.items[index];
            if (item) {
                return this._valueForItem(item)
            }
        } else {
            return index
        }
    },
    _valueForItem: function(item) {
        if (!item) {
            return null
        }
        if (!this.attrForSelected) {
            var i = this.indexOf(item);
            return i === -1 ? null : i
        }
        var propValue = item[dashToCamelCase(this.attrForSelected)];
        return propValue != undefined ? propValue : item.getAttribute(this.attrForSelected)
    },
    _applySelection: function(item, isSelected) {
        if (this.selectedClass) {
            this.toggleClass(this.selectedClass, isSelected, item)
        }
        if (this.selectedAttribute) {
            this.toggleAttribute(this.selectedAttribute, isSelected, item)
        }
        this._selectionChange();
        this.fire("iron-" + (isSelected ? "select" : "deselect"), {
            item: item
        })
    },
    _selectionChange: function() {
        this._setSelectedItem(this._selection.get())
    },
    _observeItems: function(node) {
        return dom(node).observeNodes((function(mutation) {
            this._updateItems();
            this._updateSelected();
            this.fire("iron-items-changed", mutation, {
                bubbles: false,
                cancelable: false
            })
        }
        ))
    },
    _activateHandler: function(e) {
        var t = e.target;
        var items = this.items;
        while (t && t != this) {
            var i = items.indexOf(t);
            if (i >= 0) {
                var value = this._indexToValue(i);
                this._itemActivate(value, t);
                return
            }
            t = t.parentNode
        }
    },
    _itemActivate: function(value, item) {
        if (!this.fire("iron-activate", {
            selected: value,
            item: item
        }, {
            cancelable: true
        }).defaultPrevented) {
            this.select(value)
        }
    }
};
/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const IronMultiSelectableBehaviorImpl = {
    properties: {
        multi: {
            type: Boolean,
            value: false,
            observer: "multiChanged"
        },
        selectedValues: {
            type: Array,
            notify: true,
            value: function() {
                return []
            }
        },
        selectedItems: {
            type: Array,
            readOnly: true,
            notify: true,
            value: function() {
                return []
            }
        }
    },
    observers: ["_updateSelected(selectedValues.splices)"],
    select: function(value) {
        if (this.multi) {
            this._toggleSelected(value)
        } else {
            this.selected = value
        }
    },
    multiChanged: function(multi) {
        this._selection.multi = multi;
        this._updateSelected()
    },
    get _shouldUpdateSelection() {
        return this.selected != null || this.selectedValues != null && this.selectedValues.length
    },
    _updateAttrForSelected: function() {
        if (!this.multi) {
            IronSelectableBehavior._updateAttrForSelected.apply(this)
        } else if (this.selectedItems && this.selectedItems.length > 0) {
            this.selectedValues = this.selectedItems.map((function(selectedItem) {
                return this._indexToValue(this.indexOf(selectedItem))
            }
            ), this).filter((function(unfilteredValue) {
                return unfilteredValue != null
            }
            ), this)
        }
    },
    _updateSelected: function() {
        if (this.multi) {
            this._selectMulti(this.selectedValues)
        } else {
            this._selectSelected(this.selected)
        }
    },
    _selectMulti: function(values) {
        values = values || [];
        var selectedItems = (this._valuesToItems(values) || []).filter((function(item) {
            return item !== null && item !== undefined
        }
        ));
        this._selection.clear(selectedItems);
        for (var i = 0; i < selectedItems.length; i++) {
            this._selection.setItemSelected(selectedItems[i], true)
        }
        if (this.fallbackSelection && !this._selection.get().length) {
            var fallback = this._valueToItem(this.fallbackSelection);
            if (fallback) {
                this.select(this.fallbackSelection)
            }
        }
    },
    _selectionChange: function() {
        var s = this._selection.get();
        if (this.multi) {
            this._setSelectedItems(s);
            this._setSelectedItem(s.length ? s[0] : null)
        } else {
            if (s !== null && s !== undefined) {
                this._setSelectedItems([s]);
                this._setSelectedItem(s)
            } else {
                this._setSelectedItems([]);
                this._setSelectedItem(null)
            }
        }
    },
    _toggleSelected: function(value) {
        var i = this.selectedValues.indexOf(value);
        var unselected = i < 0;
        if (unselected) {
            this.push("selectedValues", value)
        } else {
            this.splice("selectedValues", i, 1)
        }
    },
    _valuesToItems: function(values) {
        return values == null ? null : values.map((function(value) {
            return this._valueToItem(value)
        }
        ), this)
    }
};
const IronMultiSelectableBehavior = [IronSelectableBehavior, IronMultiSelectableBehaviorImpl];
/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
Polymer({
    is: "iron-selector",
    behaviors: [IronMultiSelectableBehavior]
});
// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const I18nMixin = dedupingMixin((superClass => {
    class I18nMixin extends superClass {
        i18nRaw_(id, ...varArgs) {
            return varArgs.length === 0 ? loadTimeData.getString(id) : loadTimeData.getStringF(id, ...varArgs)
        }
        i18n(id, ...varArgs) {
            const rawString = this.i18nRaw_(id, ...varArgs);
            return parseHtmlSubset(`<b>${rawString}</b>`).firstChild.textContent
        }
        i18nAdvanced(id, opts) {
            opts = opts || {};
            const rawString = this.i18nRaw_(id, ...opts.substitutions || []);
            return sanitizeInnerHtml(rawString, opts)
        }
        i18nDynamic(_locale, id, ...varArgs) {
            return this.i18n(id, ...varArgs)
        }
        i18nRecursive(locale, id, ...varArgs) {
            let args = varArgs;
            if (args.length > 0) {
                args = args.map((str => this.i18nExists(str) ? loadTimeData.getString(str) : str))
            }
            return this.i18nDynamic(locale, id, ...args)
        }
        i18nExists(id) {
            return loadTimeData.valueExists(id)
        }
    }
    return I18nMixin
}
));
// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getDeepActiveElement() {
    let a = document.activeElement;
    while (a && a.shadowRoot && a.shadowRoot.activeElement) {
        a = a.shadowRoot.activeElement
    }
    return a
}
function isRTL() {
    return document.documentElement.dir === "rtl"
}
function hasKeyModifiers(e) {
    return !!(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
}
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const AUTO_SRC = "auto-src";
const CLEAR_SRC = "clear-src";
const IS_GOOGLE_PHOTOS = "is-google-photos";
const STATIC_ENCODE = "static-encode";
const ENCODE_TYPE = "encode-type";
class CrAutoImgElement extends HTMLImageElement {
    static get observedAttributes() {
        return [AUTO_SRC, IS_GOOGLE_PHOTOS, STATIC_ENCODE, ENCODE_TYPE]
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name !== AUTO_SRC && name !== IS_GOOGLE_PHOTOS && name !== STATIC_ENCODE && name !== ENCODE_TYPE) {
            return
        }
        if (name === IS_GOOGLE_PHOTOS && oldValue === null === (newValue === null)) {
            return
        }
        if (this.hasAttribute(CLEAR_SRC)) {
            this.removeAttribute("src")
        }
        let url = null;
        try {
            url = new URL(this.getAttribute(AUTO_SRC) || "")
        } catch (_) {}
        if (!url || url.protocol === "chrome-untrusted:") {
            this.removeAttribute("src");
            return
        }
        if (url.protocol === "data:" || url.protocol === "chrome:") {
            this.src = url.href;
            return
        }
        if (!this.hasAttribute(IS_GOOGLE_PHOTOS) && !this.hasAttribute(STATIC_ENCODE) && !this.hasAttribute(ENCODE_TYPE)) {
            this.src = "chrome://image?" + url.href;
            return
        }
        this.src = `chrome://image?url=${encodeURIComponent(url.href)}`;
        if (this.hasAttribute(IS_GOOGLE_PHOTOS)) {
            this.src += `&isGooglePhotos=true`
        }
        if (this.hasAttribute(STATIC_ENCODE)) {
            this.src += `&staticEncode=true`
        }
        if (this.hasAttribute(ENCODE_TYPE)) {
            this.src += `&encodeType=${this.getAttribute(ENCODE_TYPE)}`
        }
    }
    set autoSrc(src) {
        this.setAttribute(AUTO_SRC, src)
    }
    get autoSrc() {
        return this.getAttribute(AUTO_SRC) || ""
    }
    set clearSrc(_) {
        this.setAttribute(CLEAR_SRC, "")
    }
    get clearSrc() {
        return this.getAttribute(CLEAR_SRC) || ""
    }
    set isGooglePhotos(enabled) {
        if (enabled) {
            this.setAttribute(IS_GOOGLE_PHOTOS, "")
        } else {
            this.removeAttribute(IS_GOOGLE_PHOTOS)
        }
    }
    get isGooglePhotos() {
        return this.hasAttribute(IS_GOOGLE_PHOTOS)
    }
    set staticEncode(enabled) {
        if (enabled) {
            this.setAttribute(STATIC_ENCODE, "")
        } else {
            this.removeAttribute(STATIC_ENCODE)
        }
    }
    get staticEncode() {
        return this.hasAttribute(STATIC_ENCODE)
    }
    set encodeType(type) {
        if (type) {
            this.setAttribute(ENCODE_TYPE, type)
        } else {
            this.removeAttribute(ENCODE_TYPE)
        }
    }
    get encodeType() {
        return this.getAttribute(ENCODE_TYPE) || ""
    }
}
customElements.define("cr-auto-img", CrAutoImgElement, {
    extends: "img"
});
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const CommandSpec = {
    $: mojo.internal.Enum()
};
var Command;
(function(Command) {
    Command[Command["MIN_VALUE"] = 0] = "MIN_VALUE";
    Command[Command["MAX_VALUE"] = 15] = "MAX_VALUE";
    Command[Command["kUnknownCommand"] = 0] = "kUnknownCommand";
    Command[Command["kOpenSafetyCheck"] = 1] = "kOpenSafetyCheck";
    Command[Command["kOpenSafeBrowsingEnhancedProtectionSettings"] = 2] = "kOpenSafeBrowsingEnhancedProtectionSettings";
    Command[Command["kOpenFeedbackForm"] = 3] = "kOpenFeedbackForm";
    Command[Command["kOpenPrivacyGuide"] = 4] = "kOpenPrivacyGuide";
    Command[Command["kStartTabGroupTutorial"] = 5] = "kStartTabGroupTutorial";
    Command[Command["kOpenPasswordManager"] = 6] = "kOpenPasswordManager";
    Command[Command["kNoOpCommand"] = 7] = "kNoOpCommand";
    Command[Command["kOpenPerformanceSettings"] = 8] = "kOpenPerformanceSettings";
    Command[Command["kOpenNTPAndStartCustomizeChromeTutorial"] = 9] = "kOpenNTPAndStartCustomizeChromeTutorial";
    Command[Command["kStartPasswordManagerTutorial"] = 10] = "kStartPasswordManagerTutorial";
    Command[Command["kStartSavedTabGroupTutorial"] = 11] = "kStartSavedTabGroupTutorial";
    Command[Command["kOpenAISettings"] = 12] = "kOpenAISettings";
    Command[Command["kOpenSafetyCheckFromWhatsNew"] = 13] = "kOpenSafetyCheckFromWhatsNew";
    Command[Command["kOpenPaymentsSettings"] = 14] = "kOpenPaymentsSettings";
    Command[Command["KOpenHistorySearchSettings"] = 15] = "KOpenHistorySearchSettings"
}
)(Command || (Command = {}));
class CommandHandlerFactoryPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "browser_command.mojom.CommandHandlerFactory", scope)
    }
}
class CommandHandlerFactoryRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(CommandHandlerFactoryPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    createBrowserCommandHandler(handler) {
        this.proxy.sendMessage(555237892, CommandHandlerFactory_CreateBrowserCommandHandler_ParamsSpec.$, null, [handler])
    }
}
class CommandHandlerFactory {
    static get $interfaceName() {
        return "browser_command.mojom.CommandHandlerFactory"
    }
    static getRemote() {
        let remote = new CommandHandlerFactoryRemote;
        remote.$.bindNewPipeAndPassReceiver().bindInBrowser();
        return remote
    }
}
class CommandHandlerPendingReceiver {
    handle;
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "browser_command.mojom.CommandHandler", scope)
    }
}
class CommandHandlerRemote {
    proxy;
    $;
    onConnectionError;
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(CommandHandlerPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    canExecuteCommand(commandId) {
        return this.proxy.sendMessage(1044404101, CommandHandler_CanExecuteCommand_ParamsSpec.$, CommandHandler_CanExecuteCommand_ResponseParamsSpec.$, [commandId])
    }
    executeCommand(commandId, clickInfo) {
        return this.proxy.sendMessage(81074410, CommandHandler_ExecuteCommand_ParamsSpec.$, CommandHandler_ExecuteCommand_ResponseParamsSpec.$, [commandId, clickInfo])
    }
}
const ClickInfoSpec = {
    $: {}
};
const CommandHandlerFactory_CreateBrowserCommandHandler_ParamsSpec = {
    $: {}
};
const CommandHandler_CanExecuteCommand_ParamsSpec = {
    $: {}
};
const CommandHandler_CanExecuteCommand_ResponseParamsSpec = {
    $: {}
};
const CommandHandler_ExecuteCommand_ParamsSpec = {
    $: {}
};
const CommandHandler_ExecuteCommand_ResponseParamsSpec = {
    $: {}
};
mojo.internal.Struct(ClickInfoSpec.$, "ClickInfo", [mojo.internal.StructField("middleButton", 0, 0, mojo.internal.Bool, false, false, 0), mojo.internal.StructField("altKey", 0, 1, mojo.internal.Bool, false, false, 0), mojo.internal.StructField("ctrlKey", 0, 2, mojo.internal.Bool, false, false, 0), mojo.internal.StructField("metaKey", 0, 3, mojo.internal.Bool, false, false, 0), mojo.internal.StructField("shiftKey", 0, 4, mojo.internal.Bool, false, false, 0)], [[0, 16]]);
mojo.internal.Struct(CommandHandlerFactory_CreateBrowserCommandHandler_ParamsSpec.$, "CommandHandlerFactory_CreateBrowserCommandHandler_Params", [mojo.internal.StructField("handler", 0, 0, mojo.internal.InterfaceRequest(CommandHandlerPendingReceiver), null, false, 0)], [[0, 16]]);
mojo.internal.Struct(CommandHandler_CanExecuteCommand_ParamsSpec.$, "CommandHandler_CanExecuteCommand_Params", [mojo.internal.StructField("commandId", 0, 0, CommandSpec.$, 0, false, 0)], [[0, 16]]);
mojo.internal.Struct(CommandHandler_CanExecuteCommand_ResponseParamsSpec.$, "CommandHandler_CanExecuteCommand_ResponseParams", [mojo.internal.StructField("canExecute", 0, 0, mojo.internal.Bool, false, false, 0)], [[0, 16]]);
mojo.internal.Struct(CommandHandler_ExecuteCommand_ParamsSpec.$, "CommandHandler_ExecuteCommand_Params", [mojo.internal.StructField("commandId", 0, 0, CommandSpec.$, 0, false, 0), mojo.internal.StructField("clickInfo", 8, 0, ClickInfoSpec.$, null, false, 0)], [[0, 24]]);
mojo.internal.Struct(CommandHandler_ExecuteCommand_ResponseParamsSpec.$, "CommandHandler_ExecuteCommand_ResponseParams", [mojo.internal.StructField("commandExecuted", 0, 0, mojo.internal.Bool, false, false, 0)], [[0, 16]]);
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
let instance$d = null;
class BrowserCommandProxy {
    static getInstance() {
        return instance$d || (instance$d = new BrowserCommandProxy)
    }
    static setInstance(newInstance) {
        instance$d = newInstance
    }
    handler;
    constructor() {
        this.handler = new CommandHandlerRemote;
        const factory = CommandHandlerFactory.getRemote();
        factory.createBrowserCommandHandler(this.handler.$.bindNewPipeAndPassReceiver())
    }
}
// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function isValidArray(arr) {
    if (arr instanceof Array && Object.isFrozen(arr)) {
        return true
    }
    return false
}
function getStaticString(literal) {
    const isStaticString = isValidArray(literal) && !!literal.raw && isValidArray(literal.raw) && literal.length === literal.raw.length && literal.length === 1;
    assert(isStaticString, "static_types.js only allows static strings");
    return literal.join("")
}
function createTypes(_ignore, literal) {
    return getStaticString(literal)
}
const rules = {
    createHTML: createTypes,
    createScript: createTypes,
    createScriptURL: createTypes
};
let staticPolicy;
if (window.trustedTypes) {
    staticPolicy = window.trustedTypes.createPolicy("static-types", rules)
} else {
    staticPolicy = rules
}
function getTrustedHTML(literal) {
    return staticPolicy.createHTML("", literal)
}
function getTrustedScriptURL(literal) {
    return staticPolicy.createScriptURL("", literal)
}
// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
let instance$c = null;
class WindowProxy {
    static getInstance() {
        return instance$c || (instance$c = new WindowProxy)
    }
    static setInstance(newInstance) {
        instance$c = newInstance
    }
    navigate(href) {
        window.location.href = href
    }
    open(url) {
        window.open(url, "_blank")
    }
    setTimeout(callback, duration) {
        return window.setTimeout(callback, duration)
    }
    clearTimeout(id) {
        window.clearTimeout(id !== null ? id : undefined)
    }
    random() {
        return Math.random()
    }
    createIframeSrc(src) {
        return src
    }
    matchMedia(query) {
        return window.matchMedia(query)
    }
    now() {
        return Date.now()
    }
    waitForLazyRender() {
        return new Promise((resolve => {
            requestIdleCallback(( () => resolve()), {
                timeout: 500
            })
        }
        ))
    }
    postMessage(iframe, message, targetOrigin) {
        iframe.contentWindow.postMessage(message, targetOrigin)
    }
    get url() {
        return new URL(window.location.href)
    }
    get onLine() {
        return window.navigator.onLine
    }
}
// Copyright 2012 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const CLASS_NAME = "focus-outline-visible";
const docsToManager = new Map;
class FocusOutlineManager {
    focusByKeyboard_ = true;
    classList_;
    constructor(doc) {
        this.classList_ = doc.documentElement.classList;
        doc.addEventListener("keydown", (e => this.onEvent_(true, e)), true);
        doc.addEventListener("mousedown", (e => this.onEvent_(false, e)), true);
        this.updateVisibility()
    }
    onEvent_(focusByKeyboard, e) {
        if (this.focusByKeyboard_ === focusByKeyboard) {
            return
        }
        if (e instanceof KeyboardEvent && e.repeat) {
            return
        }
        this.focusByKeyboard_ = focusByKeyboard;
        this.updateVisibility()
    }
    updateVisibility() {
        this.visible = this.focusByKeyboard_
    }
    set visible(visible) {
        this.classList_.toggle(CLASS_NAME, visible)
    }
    get visible() {
        return this.classList_.contains(CLASS_NAME)
    }
    static forDocument(doc) {
        let manager = docsToManager.get(doc);
        if (!manager) {
            manager = new FocusOutlineManager(doc);
            docsToManager.set(doc, manager)
        }
        return manager
    }
}
let instance$b = null;
function getCss$9() {
    return instance$b || (instance$b = [...[getCss$d()], css`:host{--cr-button-background-color:transparent;--cr-button-border-color:var(--color-button-border,
      var(--cr-fallback-color-tonal-outline));--cr-button-text-color:var(--color-button-foreground,
      var(--cr-fallback-color-primary));--cr-button-ripple-opacity:1;--cr-button-ripple-color:var(--cr-active-background-color);--cr-button-disabled-background-color:transparent;--cr-button-disabled-border-color:var(--color-button-border-disabled,
      var(--cr-fallback-color-disabled-background));--cr-button-disabled-text-color:var(--color-button-foreground-disabled,
      var(--cr-fallback-color-disabled-foreground))}:host(.action-button){--cr-button-background-color:var(--color-button-background-prominent,
      var(--cr-fallback-color-primary));--cr-button-text-color:var(--color-button-foreground-prominent,
      var(--cr-fallback-color-on-primary));--cr-button-ripple-color:var(--cr-active-on-primary-background-color);--cr-button-border:none;--cr-button-disabled-background-color:var(
      --color-button-background-prominent-disabled,
      var(--cr-fallback-color-disabled-background));--cr-button-disabled-text-color:var(--color-button-foreground-disabled,
      var(--cr-fallback-color-disabled-foreground));--cr-button-disabled-border:none}:host(.floating-button),:host(.tonal-button){--cr-button-background-color:var(--color-button-background-tonal,
      var(--cr-fallback-color-secondary-container));--cr-button-text-color:var(--color-button-foreground-tonal,
      var(--cr-fallback-color-on-tonal-container));--cr-button-border:none;--cr-button-disabled-background-color:var(
      --color-button-background-tonal-disabled,
      var(--cr-fallback-color-disabled-background));--cr-button-disabled-text-color:var(--color-button-foreground-disabled,
      var(--cr-fallback-color-disabled-foreground));--cr-button-disabled-border:none}:host{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:5.14em;height:var(--cr-button-height);padding:8px 16px;outline-width:0;overflow:hidden;position:relative;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;border:var(--cr-button-border,1px solid var(--cr-button-border-color));border-radius:100px;background:var(--cr-button-background-color);color:var(--cr-button-text-color);font-weight:500;line-height:20px;isolation:isolate}@media (forced-colors:active){:host{forced-color-adjust:none}}:host(.floating-button){border-radius:8px;height:40px;transition:box-shadow 80ms linear}:host(.floating-button:hover){box-shadow:var(--cr-elevation-3)}:host([has-prefix-icon_]),:host([has-suffix-icon_]){--iron-icon-height:20px;--iron-icon-width:20px;--icon-block-padding-large:16px;--icon-block-padding-small:12px;gap:8px;padding-block-end:8px;padding-block-start:8px}:host([has-prefix-icon_]){padding-inline-end:var(--icon-block-padding-large);padding-inline-start:var(--icon-block-padding-small)}:host([has-suffix-icon_]){padding-inline-end:var(--icon-block-padding-small);padding-inline-start:var(--icon-block-padding-large)}:host-context(.focus-outline-visible):host(:focus){box-shadow:none;outline:2px solid var(--cr-focus-outline-color);outline-offset:2px}#background{border-radius:inherit;inset:0;pointer-events:none;position:absolute}#content{display:inline}#hoverBackground{content:'';display:none;inset:0;pointer-events:none;position:absolute;z-index:1}:host(:hover) #hoverBackground{background:var(--cr-hover-background-color);display:block}:host(.action-button:hover) #hoverBackground{background:var(--cr-hover-on-prominent-background-color)}:host([disabled]){background:var(--cr-button-disabled-background-color);border:var(--cr-button-disabled-border,1px solid var(--cr-button-disabled-border-color));color:var(--cr-button-disabled-text-color);cursor:auto;pointer-events:none}:host(.cancel-button){margin-inline-end:8px}:host(.action-button),:host(.cancel-button){line-height:154%}#ink{color:var(--cr-button-ripple-color);--paper-ripple-opacity:var(--cr-button-ripple-opacity)}#background{z-index:0}#hoverBackground,cr-ripple{z-index:1}#content,::slotted(*){z-index:2}`])
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getHtml$6() {
    return html$1`
<div id="background"></div>
<slot id="prefixIcon" name="prefix-icon"
    @slotchange="${this.onPrefixIconSlotChanged_}">
</slot>
<span id="content"><slot></slot></span>
<slot id="suffixIcon" name="suffix-icon"
    @slotchange="${this.onSuffixIconSlotChanged_}">
</slot>
<div id="hoverBackground" part="hoverBackground"></div>`
}
// Copyright 2019 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const CrButtonElementBase = CrRippleMixin(CrLitElement);
class CrButtonElement extends CrButtonElementBase {
    static get is() {
        return "cr-button"
    }
    static get styles() {
        return getCss$9()
    }
    render() {
        return getHtml$6.bind(this)()
    }
    static get properties() {
        return {
            disabled: {
                type: Boolean,
                reflect: true
            },
            hasPrefixIcon_: {
                type: Boolean,
                reflect: true
            },
            hasSuffixIcon_: {
                type: Boolean,
                reflect: true
            }
        }
    }
    constructor() {
        super();
        this.disabled = false;
        this.hasPrefixIcon_ = false;
        this.hasSuffixIcon_ = false;
        this.spaceKeyDown_ = false;
        this.timeoutIds_ = new Set;
        this.addEventListener("blur", this.onBlur_.bind(this));
        this.addEventListener("click", this.onClick_.bind(this));
        this.addEventListener("keydown", this.onKeyDown_.bind(this));
        this.addEventListener("keyup", this.onKeyUp_.bind(this));
        this.ensureRippleOnPointerdown()
    }
    firstUpdated() {
        if (!this.hasAttribute("role")) {
            this.setAttribute("role", "button")
        }
        if (!this.hasAttribute("tabindex")) {
            this.setAttribute("tabindex", "0")
        }
        FocusOutlineManager.forDocument(document)
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("disabled")) {
            this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
            this.disabledChanged_(this.disabled, changedProperties.get("disabled"))
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.timeoutIds_.forEach(clearTimeout);
        this.timeoutIds_.clear()
    }
    setTimeout_(fn, delay) {
        if (!this.isConnected) {
            return
        }
        const id = setTimeout(( () => {
            this.timeoutIds_.delete(id);
            fn()
        }
        ), delay);
        this.timeoutIds_.add(id)
    }
    disabledChanged_(newValue, oldValue) {
        if (!newValue && oldValue === undefined) {
            return
        }
        if (this.disabled) {
            this.blur()
        }
        this.setAttribute("tabindex", String(this.disabled ? -1 : 0))
    }
    onBlur_() {
        this.spaceKeyDown_ = false;
        this.setTimeout_(( () => this.getRipple().uiUpAction()), 100)
    }
    onClick_(e) {
        if (this.disabled) {
            e.stopImmediatePropagation()
        }
    }
    onPrefixIconSlotChanged_() {
        this.hasPrefixIcon_ = this.$.prefixIcon.assignedElements().length > 0
    }
    onSuffixIconSlotChanged_() {
        this.hasSuffixIcon_ = this.$.suffixIcon.assignedElements().length > 0
    }
    onKeyDown_(e) {
        if (e.key !== " " && e.key !== "Enter") {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) {
            return
        }
        this.getRipple().uiDownAction();
        if (e.key === "Enter") {
            this.click();
            this.setTimeout_(( () => this.getRipple().uiUpAction()), 100)
        } else if (e.key === " ") {
            this.spaceKeyDown_ = true
        }
    }
    onKeyUp_(e) {
        if (e.key !== " " && e.key !== "Enter") {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        if (this.spaceKeyDown_ && e.key === " ") {
            this.spaceKeyDown_ = false;
            this.click();
            this.getRipple().uiUpAction()
        }
    }
}
customElements.define(CrButtonElement.is, CrButtonElement);
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const CrScrollObserverMixinLit = superClass => {
    class CrScrollObserverMixinLit extends superClass {
        constructor() {
            super(...arguments);
            this.intersectionObserver_ = null;
            this.topProbe_ = null;
            this.bottomProbe_ = null
        }
        connectedCallback() {
            super.connectedCallback();
            const container = this.getContainer();
            this.topProbe_ = document.createElement("div");
            this.bottomProbe_ = document.createElement("div");
            container.prepend(this.topProbe_);
            container.append(this.bottomProbe_);
            this.enableScrollObservation(true)
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this.enableScrollObservation(false)
        }
        getContainer() {
            const container = this.shadowRoot.querySelector("#container");
            assert(container);
            return container
        }
        getIntersectionObserver_() {
            const callback = entries => {
                const container = this.getContainer();
                for (const entry of entries) {
                    const target = entry.target;
                    if (target === this.topProbe_) {
                        container.classList.toggle("scrolled-to-top", entry.intersectionRatio !== 0);
                        const canScroll = entry.intersectionRatio === 0 || !container.classList.contains("scrolled-to-bottom");
                        container.classList.toggle("can-scroll", canScroll)
                    }
                    if (target === this.bottomProbe_) {
                        container.classList.toggle("scrolled-to-bottom", entry.intersectionRatio !== 0);
                        const canScroll = entry.intersectionRatio === 0 || !container.classList.contains("scrolled-to-top");
                        container.classList.toggle("can-scroll", canScroll)
                    }
                }
            }
            ;
            return new IntersectionObserver(callback,{
                root: this.getContainer(),
                threshold: 0
            })
        }
        enableScrollObservation(enable) {
            if (enable === !!this.intersectionObserver_) {
                return
            }
            if (!enable) {
                this.intersectionObserver_.disconnect();
                this.intersectionObserver_ = null;
                return
            }
            this.intersectionObserver_ = this.getIntersectionObserver_();
            window.setTimeout(( () => {
                if (!this.isConnected) {
                    return
                }
                if (this.intersectionObserver_) {
                    assert(this.topProbe_);
                    assert(this.bottomProbe_);
                    this.intersectionObserver_.observe(this.topProbe_);
                    this.intersectionObserver_.observe(this.bottomProbe_)
                }
            }
            ))
        }
    }
    return CrScrollObserverMixinLit
}
;
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var CrContainerShadowSide;
(function(CrContainerShadowSide) {
    CrContainerShadowSide["TOP"] = "top";
    CrContainerShadowSide["BOTTOM"] = "bottom"
}
)(CrContainerShadowSide || (CrContainerShadowSide = {}));
const CrContainerShadowMixinLit = superClass => {
    const superClassBase = CrScrollObserverMixinLit(superClass);
    class CrContainerShadowMixinLit extends superClassBase {
        constructor() {
            super(...arguments);
            this.dropShadows_ = new Map;
            this.sides_ = []
        }
        connectedCallback() {
            super.connectedCallback();
            const container = this.shadowRoot.querySelector("#container");
            assert(container);
            const hasBottomShadow = container.hasAttribute("show-bottom-shadow");
            this.sides_ = hasBottomShadow ? [CrContainerShadowSide.TOP, CrContainerShadowSide.BOTTOM] : [CrContainerShadowSide.TOP];
            this.sides_.forEach((side => {
                const shadow = document.createElement("div");
                shadow.id = `cr-container-shadow-${side}`;
                shadow.classList.add("cr-container-shadow");
                this.dropShadows_.set(side, shadow)
            }
            ));
            container.parentNode.insertBefore(this.dropShadows_.get(CrContainerShadowSide.TOP), container);
            if (hasBottomShadow) {
                container.parentNode.insertBefore(this.dropShadows_.get(CrContainerShadowSide.BOTTOM), container.nextSibling)
            }
        }
        setForceDropShadows(enabled) {
            assert(this.sides_.length > 0);
            for (const side of this.sides_) {
                this.dropShadows_.get(side).classList.toggle("force-shadow", enabled)
            }
        }
    }
    return CrContainerShadowMixinLit
}
;
let instance$a = null;
function getCss$8() {
    return instance$a || (instance$a = [...[], css`.icon-arrow-back{--cr-icon-image:url(//resources/images/icon_arrow_back.svg)}.icon-arrow-dropdown{--cr-icon-image:url(//resources/images/icon_arrow_dropdown.svg)}.icon-arrow-drop-down-cr23{--cr-icon-image:url(//resources/images/icon_arrow_drop_down_cr23.svg)}.icon-arrow-drop-up-cr23{--cr-icon-image:url(//resources/images/icon_arrow_drop_up_cr23.svg)}.icon-cancel{--cr-icon-image:url(//resources/images/icon_cancel.svg)}.icon-clear{--cr-icon-image:url(//resources/images/icon_clear.svg)}.icon-copy-content{--cr-icon-image:url(//resources/images/icon_copy_content.svg)}.icon-delete-gray{--cr-icon-image:url(//resources/images/icon_delete_gray.svg)}.icon-edit{--cr-icon-image:url(//resources/images/icon_edit.svg)}.icon-file{--cr-icon-image:url(//resources/images/icon_filetype_generic.svg)}.icon-folder-open{--cr-icon-image:url(//resources/images/icon_folder_open.svg)}.icon-picture-delete{--cr-icon-image:url(//resources/images/icon_picture_delete.svg)}.icon-expand-less{--cr-icon-image:url(//resources/images/icon_expand_less.svg)}.icon-expand-more{--cr-icon-image:url(//resources/images/icon_expand_more.svg)}.icon-external{--cr-icon-image:url(//resources/images/open_in_new.svg)}.icon-more-vert{--cr-icon-image:url(//resources/images/icon_more_vert.svg)}.icon-refresh{--cr-icon-image:url(//resources/images/icon_refresh.svg)}.icon-search{--cr-icon-image:url(//resources/images/icon_search.svg)}.icon-settings{--cr-icon-image:url(//resources/images/icon_settings.svg)}.icon-visibility{--cr-icon-image:url(//resources/images/icon_visibility.svg)}.icon-visibility-off{--cr-icon-image:url(//resources/images/icon_visibility_off.svg)}.subpage-arrow{--cr-icon-image:url(//resources/images/arrow_right.svg)}.cr-icon{-webkit-mask-image:var(--cr-icon-image);-webkit-mask-position:center;-webkit-mask-repeat:no-repeat;-webkit-mask-size:var(--cr-icon-size);background-color:var(--cr-icon-color,var(--google-grey-700));flex-shrink:0;height:var(--cr-icon-ripple-size);margin-inline-end:var(--cr-icon-ripple-margin);margin-inline-start:var(--cr-icon-button-margin-start);user-select:none;width:var(--cr-icon-ripple-size)}:host-context([dir=rtl]) .cr-icon{transform:scaleX(-1)}.cr-icon.no-overlap{margin-inline-end:0;margin-inline-start:0}@media (prefers-color-scheme:dark){.cr-icon{background-color:var(--cr-icon-color,var(--google-grey-500))}}`])
}
let instance$9 = null;
function getCss$7() {
    return instance$9 || (instance$9 = [...[getCss$d(), getCss$8()], css`dialog{--scroll-border-color:var(--google-grey-300);--scroll-border:1px solid var(--scroll-border-color);background-color:var(--cr-dialog-background-color,#fff);border:0;border-radius:var(--cr-dialog-border-radius,8px);bottom:50%;box-shadow:0 0 16px rgba(0,0,0,.12),0 16px 16px rgba(0,0,0,.24);color:inherit;max-height:initial;max-width:initial;overflow-y:hidden;padding:0;position:absolute;top:50%;width:var(--cr-dialog-width,512px)}@media (prefers-color-scheme:dark){dialog{--scroll-border-color:var(--google-grey-700);background-color:var(--cr-dialog-background-color,var(--google-grey-900));background-image:linear-gradient(rgba(255,255,255,.04),rgba(255,255,255,.04))}}@media (forced-colors:active){dialog{border:var(--cr-border-hcm)}}dialog[open] #content-wrapper{display:flex;flex-direction:column;max-height:100vh;overflow:auto}.top-container,:host ::slotted([slot=button-container]),:host ::slotted([slot=footer]){flex-shrink:0}dialog::backdrop{background-color:rgba(0,0,0,.6);bottom:0;left:0;position:fixed;right:0;top:0}:host ::slotted([slot=body]){color:var(--cr-secondary-text-color);padding:0 var(--cr-dialog-body-padding-horizontal,20px)}:host ::slotted([slot=title]){color:var(--cr-primary-text-color);flex:1;font-family:var(--cr-dialog-font-family,inherit);font-size:var(--cr-dialog-title-font-size,calc(15 / 13 * 100%));line-height:1;padding-bottom:var(--cr-dialog-title-slot-padding-bottom,16px);padding-inline-end:var(--cr-dialog-title-slot-padding-end,20px);padding-inline-start:var(--cr-dialog-title-slot-padding-start,20px);padding-top:var(--cr-dialog-title-slot-padding-top,20px)}:host ::slotted([slot=button-container]){display:flex;justify-content:flex-end;padding-bottom:var(--cr-dialog-button-container-padding-bottom,16px);padding-inline-end:var(--cr-dialog-button-container-padding-horizontal,16px);padding-inline-start:var(--cr-dialog-button-container-padding-horizontal,16px);padding-top:var(--cr-dialog-button-container-padding-top,16px)}:host ::slotted([slot=footer]){border-bottom-left-radius:inherit;border-bottom-right-radius:inherit;border-top:1px solid #dbdbdb;margin:0;padding:16px 20px}:host([hide-backdrop]) dialog::backdrop{opacity:0}@media (prefers-color-scheme:dark){:host ::slotted([slot=footer]){border-top-color:var(--cr-separator-color)}}.body-container{box-sizing:border-box;display:flex;flex-direction:column;min-height:1.375rem;overflow:auto}:host{--transparent-border:1px solid transparent}#cr-container-shadow-top{border-bottom:var(--cr-dialog-body-border-top,var(--transparent-border))}#cr-container-shadow-bottom{border-bottom:var(--cr-dialog-body-border-bottom,var(--transparent-border))}#container.can-scroll:not(.scrolled-to-bottom)+#cr-container-shadow-bottom,#cr-container-shadow-top:has(+#container.can-scroll:not(.scrolled-to-top)){border-bottom:var(--scroll-border)}.top-container{align-items:flex-start;display:flex;min-height:var(--cr-dialog-top-container-min-height,31px)}.title-container{display:flex;flex:1;font-size:inherit;font-weight:inherit;margin:0;outline:0}#close{align-self:flex-start;margin-inline-end:4px;margin-top:4px}`])
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getHtml$5() {
    return html$1`
<dialog id="dialog" @close="${this.onNativeDialogClose_}"
    @cancel="${this.onNativeDialogCancel_}" part="dialog"
    aria-labelledby="title"
    aria-description="${this.ariaDescriptionText || nothing}">
<!-- This wrapper is necessary, such that the "pulse" animation is not
    erroneously played when the user clicks on the outer-most scrollbar. -->
  <div id="content-wrapper" part="wrapper">
    <div class="top-container">
      <h2 id="title" class="title-container" tabindex="-1">
        <slot name="title"></slot>
      </h2>
      ${this.showCloseButton ? html$1`
        <cr-icon-button id="close" class="icon-clear"
            aria-label="${this.closeText || nothing}"
            @click="${this.cancel}" @keypress="${this.onCloseKeypress_}">
        </cr-icon-button>
       ` : ""}
    </div>
    <slot name="header"></slot>
    <div class="body-container" id="container" show-bottom-shadow
        part="body-container">
      <slot name="body"></slot>
    </div>
    <slot name="button-container"></slot>
    <slot name="footer"></slot>
  </div>
</dialog>`
}
// Copyright 2016 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const CrDialogElementBase = CrContainerShadowMixinLit(CrScrollObserverMixinLit(CrLitElement));
class CrDialogElement extends CrDialogElementBase {
    constructor() {
        super(...arguments);
        this.consumeKeydownEvent = false;
        this.ignoreEnterKey = false;
        this.ignorePopstate = false;
        this.noCancel = false;
        this.open = false;
        this.showCloseButton = false;
        this.showOnAttach = false;
        this.mutationObserver_ = null;
        this.boundKeydown_ = null
    }
    static get is() {
        return "cr-dialog"
    }
    static get styles() {
        return getCss$7()
    }
    render() {
        return getHtml$5.bind(this)()
    }
    static get properties() {
        return {
            open: {
                type: Boolean,
                reflect: true
            },
            closeText: {
                type: String
            },
            ignorePopstate: {
                type: Boolean
            },
            ignoreEnterKey: {
                type: Boolean
            },
            consumeKeydownEvent: {
                type: Boolean
            },
            noCancel: {
                type: Boolean
            },
            showCloseButton: {
                type: Boolean
            },
            showOnAttach: {
                type: Boolean
            },
            ariaDescriptionText: {
                type: String
            }
        }
    }
    firstUpdated() {
        window.addEventListener("popstate", ( () => {
            if (!this.ignorePopstate && this.$.dialog.open) {
                this.cancel()
            }
        }
        ));
        if (!this.ignoreEnterKey) {
            this.addEventListener("keypress", this.onKeypress_.bind(this))
        }
        this.addEventListener("pointerdown", (e => this.onPointerdown_(e)))
    }
    connectedCallback() {
        super.connectedCallback();
        const mutationObserverCallback = () => {
            if (this.$.dialog.open) {
                this.enableScrollObservation(true);
                this.addKeydownListener_()
            } else {
                this.enableScrollObservation(false);
                this.removeKeydownListener_()
            }
        }
        ;
        this.mutationObserver_ = new MutationObserver(mutationObserverCallback);
        this.mutationObserver_.observe(this.$.dialog, {
            attributes: true,
            attributeFilter: ["open"]
        });
        mutationObserverCallback();
        if (this.showOnAttach) {
            this.showModal()
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeKeydownListener_();
        if (this.mutationObserver_) {
            this.mutationObserver_.disconnect();
            this.mutationObserver_ = null
        }
    }
    addKeydownListener_() {
        if (!this.consumeKeydownEvent) {
            return
        }
        this.boundKeydown_ = this.boundKeydown_ || this.onKeydown_.bind(this);
        this.addEventListener("keydown", this.boundKeydown_);
        document.body.addEventListener("keydown", this.boundKeydown_)
    }
    removeKeydownListener_() {
        if (!this.boundKeydown_) {
            return
        }
        this.removeEventListener("keydown", this.boundKeydown_);
        document.body.removeEventListener("keydown", this.boundKeydown_);
        this.boundKeydown_ = null
    }
    async showModal() {
        if (this.showOnAttach) {
            const element = this.querySelector("[autofocus]");
            if (element && element instanceof CrLitElement && !element.shadowRoot) {
                element.ensureInitialRender()
            }
        }
        this.$.dialog.showModal();
        assert(this.$.dialog.open);
        this.open = true;
        await this.updateComplete;
        this.fire("cr-dialog-open")
    }
    cancel() {
        this.fire("cancel");
        this.$.dialog.close();
        assert(!this.$.dialog.open);
        this.open = false
    }
    close() {
        this.$.dialog.close("success");
        assert(!this.$.dialog.open);
        this.open = false
    }
    setTitleAriaLabel(title) {
        this.$.dialog.removeAttribute("aria-labelledby");
        this.$.dialog.setAttribute("aria-label", title)
    }
    onCloseKeypress_(e) {
        e.stopPropagation()
    }
    onNativeDialogClose_(e) {
        if (e.target !== this.getNative()) {
            return
        }
        this.fire("close")
    }
    async onNativeDialogCancel_(e) {
        if (e.target !== this.getNative()) {
            return
        }
        if (this.noCancel) {
            e.preventDefault();
            return
        }
        this.open = false;
        await this.updateComplete;
        this.fire("cancel")
    }
    getNative() {
        return this.$.dialog
    }
    onKeypress_(e) {
        if (e.key !== "Enter") {
            return
        }
        const accept = e.target === this || e.composedPath().some((el => el.tagName === "CR-INPUT" && el.type !== "search"));
        if (!accept) {
            return
        }
        const actionButton = this.querySelector(".action-button:not([disabled]):not([hidden])");
        if (actionButton) {
            actionButton.click();
            e.preventDefault()
        }
    }
    onKeydown_(e) {
        assert(this.consumeKeydownEvent);
        if (!this.getNative().open) {
            return
        }
        if (this.ignoreEnterKey && e.key === "Enter") {
            return
        }
        e.stopPropagation()
    }
    onPointerdown_(e) {
        if (e.button !== 0 || e.composedPath()[0].tagName !== "DIALOG") {
            return
        }
        this.$.dialog.animate([{
            transform: "scale(1)",
            offset: 0
        }, {
            transform: "scale(1.02)",
            offset: .4
        }, {
            transform: "scale(1.02)",
            offset: .6
        }, {
            transform: "scale(1)",
            offset: 1
        }], {
            duration: 180,
            easing: "ease-in-out",
            iterations: 1
        });
        e.preventDefault()
    }
    focus() {
        const titleContainer = this.shadowRoot.querySelector(".title-container");
        assert(titleContainer);
        titleContainer.focus()
    }
}
customElements.define(CrDialogElement.is, CrDialogElement);
let instance$8 = null;
function getCss$6() {
    return instance$8 || (instance$8 = [...[getCss$d(), getCss$8()], css`[actionable]{cursor:pointer}.hr{border-top:var(--cr-separator-line)}iron-list.cr-separators>:not([first]){border-top:var(--cr-separator-line)}[scrollable]{border-color:transparent;border-style:solid;border-width:1px 0;overflow-y:auto}[scrollable].is-scrolled{border-top-color:var(--scrollable-border-color)}[scrollable].can-scroll:not(.scrolled-to-bottom){border-bottom-color:var(--scrollable-border-color)}[scrollable] iron-list>:not(.no-outline):focus,[selectable]:focus,[selectable]>:focus{background-color:var(--cr-focused-item-color);outline:0}.scroll-container{display:flex;flex-direction:column;min-height:1px}[selectable]>*{cursor:pointer}.cr-centered-card-container{box-sizing:border-box;display:block;height:inherit;margin:0 auto;max-width:var(--cr-centered-card-max-width);min-width:550px;position:relative;width:calc(100% * var(--cr-centered-card-width-percentage))}.cr-container-shadow{box-shadow:inset 0 5px 6px -3px rgba(0,0,0,.4);height:var(--cr-container-shadow-height);left:0;margin:0 0 var(--cr-container-shadow-margin);opacity:0;pointer-events:none;position:relative;right:0;top:0;transition:opacity .5s;z-index:1}#cr-container-shadow-bottom{margin-bottom:0;margin-top:var(--cr-container-shadow-margin);transform:scaleY(-1)}#container.can-scroll:not(.scrolled-to-bottom)+#cr-container-shadow-bottom,#cr-container-shadow-bottom.force-shadow,#cr-container-shadow-top.force-shadow,#cr-container-shadow-top:has(+#container.can-scroll:not(.scrolled-to-top)){opacity:var(--cr-container-shadow-max-opacity)}.cr-row{align-items:center;border-top:var(--cr-separator-line);display:flex;min-height:var(--cr-section-min-height);padding:0 var(--cr-section-padding)}.cr-row.continuation,.cr-row.first{border-top:none}.cr-row-gap{padding-inline-start:16px}.cr-button-gap{margin-inline-start:8px}cr-tooltip::part(tooltip),paper-tooltip::part(tooltip){border-radius:var(--paper-tooltip-border-radius,2px);font-size:92.31%;font-weight:500;max-width:330px;min-width:var(--paper-tooltip-min-width,200px);padding:var(--paper-tooltip-padding,10px 8px)}.cr-padded-text{padding-block-end:var(--cr-section-vertical-padding);padding-block-start:var(--cr-section-vertical-padding)}.cr-title-text{color:var(--cr-title-text-color);font-size:107.6923%;font-weight:500}.cr-secondary-text{color:var(--cr-secondary-text-color);font-weight:400}.cr-form-field-label{color:var(--cr-form-field-label-color);display:block;font-size:var(--cr-form-field-label-font-size);font-weight:500;letter-spacing:.4px;line-height:var(--cr-form-field-label-line-height);margin-bottom:8px}.cr-vertical-tab{align-items:center;display:flex}.cr-vertical-tab::before{border-radius:0 3px 3px 0;content:'';display:block;flex-shrink:0;height:var(--cr-vertical-tab-height,100%);width:4px}.cr-vertical-tab.selected::before{background:var(--cr-vertical-tab-selected-color,var(--cr-checked-color))}:host-context([dir=rtl]) .cr-vertical-tab::before{transform:scaleX(-1)}.iph-anchor-highlight{background-color:var(--cr-iph-anchor-highlight-color)}`])
}
let instance$7 = null;
function getCss$5() {
    return instance$7 || (instance$7 = [...[], css`:host{--cr-input-background-color:var(--color-textfield-filled-background,
      var(--cr-fallback-color-surface-variant));--cr-input-border-bottom:1px solid var(--color-textfield-filled-underline,
          var(--cr-fallback-color-outline));--cr-input-border-radius:8px 8px 0 0;--cr-input-color:var(--cr-primary-text-color);--cr-input-error-color:var(--color-textfield-filled-error,
      var(--cr-fallback-color-error));--cr-input-focus-color:var(--color-textfield-filled-underline-focused,
      var(--cr-fallback-color-primary));--cr-input-hover-background-color:var(--cr-hover-background-color);--cr-input-label-color:var(--color-textfield-foreground-label,
      var(--cr-fallback-color-on-surface-subtle));--cr-input-padding-bottom:10px;--cr-input-padding-end:10px;--cr-input-padding-start:10px;--cr-input-padding-top:10px;--cr-input-placeholder-color:var(--color-textfield-foreground-placeholder,
          var(--cr-fallback-on-surface-subtle));display:block;isolation:isolate;outline:0}:host([readonly]){--cr-input-border-radius:8px 8px}#label{color:var(--cr-input-label-color);font-size:11px;line-height:16px}:host([focused_]:not([readonly]):not([invalid])) #label{color:var(--cr-input-focus-label-color,var(--cr-input-label-color))}#input-container{border-radius:var(--cr-input-border-radius,4px);overflow:hidden;position:relative;width:var(--cr-input-width,100%)}:host([focused_]) #input-container{outline:var(--cr-input-focus-outline,none)}#inner-input-container{background-color:var(--cr-input-background-color);box-sizing:border-box;padding:0}#inner-input-content ::slotted(*){--cr-icon-button-fill-color:var(--color-textfield-foreground-icon,
      var(--cr-fallback-color-on-surface-subtle));--cr-icon-button-icon-size:16px;--cr-icon-button-size:24px;--cr-icon-button-margin-start:0;--cr-icon-color:var(--color-textfield-foreground-icon,
      var(--cr-fallback-color-on-surface-subtle))}#inner-input-content ::slotted([slot=inline-prefix]){--cr-icon-button-margin-start:-8px}#inner-input-content ::slotted([slot=inline-suffix]){--cr-icon-button-margin-end:-4px}:host([invalid]) #inner-input-content ::slotted(*){--cr-icon-color:var(--cr-input-error-color);--cr-icon-button-fill-color:var(--cr-input-error-color)}#hover-layer{background-color:var(--cr-input-hover-background-color);display:none;inset:0;pointer-events:none;position:absolute;z-index:0}:host(:not([readonly]):not([disabled])) #input-container:hover #hover-layer{display:block}#input{-webkit-appearance:none;background-color:transparent;border:none;box-sizing:border-box;caret-color:var(--cr-input-focus-color);color:var(--cr-input-color);font-family:inherit;font-size:var(--cr-input-font-size,12px);font-weight:inherit;line-height:16px;min-height:var(--cr-input-min-height,auto);outline:0;padding:0;text-align:inherit;text-overflow:ellipsis;width:100%}#inner-input-content{padding-bottom:var(--cr-input-padding-bottom);padding-inline-end:var(--cr-input-padding-end);padding-inline-start:var(--cr-input-padding-start);padding-top:var(--cr-input-padding-top)}#underline{border-bottom:2px solid var(--cr-input-focus-color);border-radius:var(--cr-input-underline-border-radius,0);bottom:0;box-sizing:border-box;display:var(--cr-input-underline-display);height:var(--cr-input-underline-height,0);left:0;margin:auto;opacity:0;position:absolute;right:0;transition:opacity 120ms ease-out,width 0s linear 180ms;width:0}:host([focused_]) #underline,:host([force-underline]) #underline,:host([invalid]) #underline{opacity:1;transition:opacity 120ms ease-in,width 180ms ease-out;width:100%}#underline-base{display:none}:host([readonly]) #underline{display:none}:host(:not([readonly])) #underline-base{border-bottom:var(--cr-input-border-bottom);bottom:0;display:block;left:0;position:absolute;right:0}:host([disabled]){color:var(--color-textfield-foreground-disabled,var(--cr-fallback-color-disabled-foreground));--cr-input-border-bottom:1px solid currentColor;--cr-input-placeholder-color:currentColor;--cr-input-color:currentColor;--cr-input-background-color:var(--color-textfield-background-disabled,
      var(--cr-fallback-color-disabled-background))}:host([disabled]) #inner-input-content ::slotted(*){--cr-icon-color:currentColor;--cr-icon-button-fill-color:currentColor}:host(.stroked){--cr-input-background-color:transparent;--cr-input-border:1px solid var(--color-side-panel-textfield-border,
      var(--cr-fallback-color-neutral-outline));--cr-input-border-bottom:none;--cr-input-border-radius:8px;--cr-input-padding-bottom:9px;--cr-input-padding-end:9px;--cr-input-padding-start:9px;--cr-input-padding-top:9px;--cr-input-underline-display:none;--cr-input-min-height:36px;line-height:16px}:host(.stroked[focused_]){--cr-input-border:2px solid var(--cr-focus-outline-color);--cr-input-padding-bottom:8px;--cr-input-padding-end:8px;--cr-input-padding-start:8px;--cr-input-padding-top:8px}:host(.stroked[invalid]){--cr-input-border:1px solid var(--cr-input-error-color)}:host(.stroked[focused_][invalid]){--cr-input-border:2px solid var(--cr-input-error-color)}`])
}
let instance$6 = null;
function getCss$4() {
    return instance$6 || (instance$6 = [...[getCss$d(), getCss$5(), getCss$6()], css`:host([disabled]) :-webkit-any(#label,#error,#input-container){opacity:var(--cr-disabled-opacity);pointer-events:none}:host([disabled]) :is(#label,#error,#input-container){opacity:1}:host ::slotted(cr-button[slot=suffix]){margin-inline-start:var(--cr-button-edge-spacing)!important}:host([invalid]) #label{color:var(--cr-input-error-color)}#input{border-bottom:none;letter-spacing:var(--cr-input-letter-spacing)}#input-container{border:var(--cr-input-border,none)}#input::placeholder{color:var(--cr-input-placeholder-color,var(--cr-secondary-text-color));letter-spacing:var(--cr-input-placeholder-letter-spacing)}:host([invalid]) #input{caret-color:var(--cr-input-error-color)}:host([readonly]) #input{opacity:var(--cr-input-readonly-opacity,.6)}:host([invalid]) #underline{border-color:var(--cr-input-error-color)}#error{color:var(--cr-input-error-color);display:var(--cr-input-error-display,block);font-size:11px;min-height:var(--cr-form-field-label-height);line-height:16px;margin:4px 10px;visibility:hidden;white-space:var(--cr-input-error-white-space);height:auto;overflow:hidden;text-overflow:ellipsis}:host([invalid]) #error{visibility:visible}#inner-input-content,#row-container{align-items:center;display:flex;justify-content:space-between;position:relative}#inner-input-content{gap:4px;height:16px;z-index:1}#input[type=search]::-webkit-search-cancel-button{display:none}:host-context([dir=rtl]) #input[type=url]{text-align:right}#input[type=url]{direction:ltr}`])
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getHtml$4() {
    return html$1`
<div id="label" class="cr-form-field-label" ?hidden="${!this.label}"
    aria-hidden="true">
  ${this.label}
</div>
<div id="row-container" part="row-container">
  <div id="input-container">
    <div id="inner-input-container">
      <div id="hover-layer"></div>
      <div id="inner-input-content">
        <slot name="inline-prefix"></slot>
        <input id="input" ?disabled="${this.disabled}"
            ?autofocus="${this.autofocus}"
            .value="${this.internalValue_}" tabindex="${this.inputTabindex}"
            .type="${this.type}"
            ?readonly="${this.readonly}" maxlength="${this.maxlength}"
            pattern="${this.pattern || nothing}" ?required="${this.required}"
            minlength="${this.minlength}" inputmode="${this.inputmode}"
            aria-description="${this.ariaDescription || nothing}"
            aria-errormessage="${this.getAriaErrorMessage_() || nothing}"
            aria-label="${this.getAriaLabel_()}"
            aria-invalid="${this.getAriaInvalid_()}"
            .max="${this.max || nothing}" .min="${this.min || nothing}"
            @focus="${this.onInputFocus_}"
            @blur="${this.onInputBlur_}" @change="${this.onInputChange_}"
            @input="${this.onInput_}"
            part="input"
            autocomplete="off">
        <slot name="inline-suffix"></slot>
      </div>
    </div>
    <div id="underline-base"></div>
    <div id="underline"></div>
  </div>
  <slot name="suffix"></slot>
</div>
<div id="error" role="${this.getErrorRole_() || nothing}"
    aria-live="assertive">${this.getErrorMessage_()}</div>`
}
// Copyright 2018 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const SUPPORTED_INPUT_TYPES = new Set(["number", "password", "search", "text", "url"]);
class CrInputElement extends CrLitElement {
    constructor() {
        super(...arguments);
        this.ariaDescription = null;
        this.ariaLabel = "";
        this.autofocus = false;
        this.autoValidate = false;
        this.disabled = false;
        this.errorMessage = "";
        this.inputTabindex = 0;
        this.invalid = false;
        this.label = "";
        this.placeholder = null;
        this.readonly = false;
        this.required = false;
        this.type = "text";
        this.value = "";
        this.internalValue_ = "";
        this.focused_ = false
    }
    static get is() {
        return "cr-input"
    }
    static get styles() {
        return getCss$4()
    }
    render() {
        return getHtml$4.bind(this)()
    }
    static get properties() {
        return {
            ariaDescription: {
                type: String
            },
            ariaLabel: {
                type: String
            },
            autofocus: {
                type: Boolean,
                reflect: true
            },
            autoValidate: {
                type: Boolean
            },
            disabled: {
                type: Boolean,
                reflect: true
            },
            errorMessage: {
                type: String
            },
            errorRole_: {
                type: String
            },
            displayErrorMessage_: {
                type: String
            },
            focused_: {
                type: Boolean,
                reflect: true
            },
            invalid: {
                type: Boolean,
                notify: true,
                reflect: true
            },
            max: {
                type: Number,
                reflect: true
            },
            min: {
                type: Number,
                reflect: true
            },
            maxlength: {
                type: Number,
                reflect: true
            },
            minlength: {
                type: Number,
                reflect: true
            },
            pattern: {
                type: String,
                reflect: true
            },
            inputmode: {
                type: String
            },
            label: {
                type: String
            },
            placeholder: {
                type: String
            },
            readonly: {
                type: Boolean,
                reflect: true
            },
            required: {
                type: Boolean,
                reflect: true
            },
            inputTabindex: {
                type: Number
            },
            type: {
                type: String
            },
            value: {
                type: String,
                notify: true
            },
            internalValue_: {
                type: String,
                state: true
            }
        }
    }
    firstUpdated() {
        assert(!this.hasAttribute("tabindex"))
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("value")) {
            this.internalValue_ = this.value === undefined || this.value === null ? "" : this.value
        }
        if (changedProperties.has("inputTabindex")) {
            assert(this.inputTabindex === 0 || this.inputTabindex === -1)
        }
        if (changedProperties.has("type")) {
            assert(SUPPORTED_INPUT_TYPES.has(this.type))
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("value")) {
            const previous = changedProperties.get("value");
            if ((!!this.value || !!previous) && this.autoValidate) {
                this.invalid = !this.inputElement.checkValidity()
            }
        }
        if (changedProperties.has("placeholder")) {
            if (this.placeholder === null || this.placeholder === undefined) {
                this.inputElement.removeAttribute("placeholder")
            } else {
                this.inputElement.setAttribute("placeholder", this.placeholder)
            }
        }
    }
    get inputElement() {
        return this.$.input
    }
    focus() {
        this.focusInput()
    }
    focusInput() {
        if (this.shadowRoot.activeElement === this.inputElement) {
            return false
        }
        this.inputElement.focus();
        return true
    }
    async onInputChange_(e) {
        await this.updateComplete;
        this.fire("change", {
            sourceEvent: e
        })
    }
    onInput_(e) {
        this.internalValue_ = e.target.value;
        this.value = this.internalValue_
    }
    onInputFocus_() {
        this.focused_ = true
    }
    onInputBlur_() {
        this.focused_ = false
    }
    getAriaLabel_() {
        return this.ariaLabel || this.label || this.placeholder
    }
    getAriaInvalid_() {
        return this.invalid ? "true" : "false"
    }
    getErrorMessage_() {
        return this.invalid ? this.errorMessage : ""
    }
    getErrorRole_() {
        return this.invalid ? "alert" : ""
    }
    getAriaErrorMessage_() {
        return this.invalid ? "error" : ""
    }
    select(start, end) {
        this.inputElement.focus();
        if (start !== undefined && end !== undefined) {
            this.inputElement.setSelectionRange(start, end)
        } else {
            assert(start === undefined && end === undefined);
            this.inputElement.select()
        }
    }
    validate() {
        this.performUpdate();
        this.invalid = !this.inputElement.checkValidity();
        this.performUpdate();
        return !this.invalid
    }
}
customElements.define(CrInputElement.is, CrInputElement);
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function skColorToRgba(skColor) {
    const a = skColor.value >> 24 & 255;
    const r = skColor.value >> 16 & 255;
    const g = skColor.value >> 8 & 255;
    const b = skColor.value & 255;
    return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`
}
function hexColorToSkColor(hexColor) {
    if (!/^#[0-9a-f]{6}$/.test(hexColor)) {
        return {
            value: 0
        }
    }
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    return {
        value: 4278190080 + (r << 16) + (g << 8) + b
    }
}
// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
let instance$5 = null;
class NewTabPageProxy {
    static getInstance() {
        if (!instance$5) {
            const handler = new PageHandlerRemote;
            const callbackRouter = new PageCallbackRouter;
            PageHandlerFactory.getRemote().createPageHandler(callbackRouter.$.bindNewPipeAndPassRemote(), handler.$.bindNewPipeAndPassReceiver());
            instance$5 = new NewTabPageProxy(handler,callbackRouter)
        }
        return instance$5
    }
    static setInstance(handler, callbackRouter) {
        instance$5 = new NewTabPageProxy(handler,callbackRouter)
    }
    constructor(handler, callbackRouter) {
        this.handler = handler;
        this.callbackRouter = callbackRouter
    }
}
let instance$4 = null;
function getCss$3() {
    return instance$4 || (instance$4 = [...[], css`:host{display:none}`])
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getHtml$3() {
    return html$1`
<svg id="baseSvg" xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${this.size} ${this.size}"
     preserveAspectRatio="xMidYMid meet" focusable="false"
     style="pointer-events: none; display: block; width: 100%; height: 100%;">
 </svg>
<slot></slot>
`
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const APPLIED_ICON_CLASS = "cr-iconset-svg-icon_";
class CrIconsetElement extends CrLitElement {
    constructor() {
        super(...arguments);
        this.name = "";
        this.size = 24
    }
    static get is() {
        return "cr-iconset"
    }
    static get styles() {
        return getCss$3()
    }
    render() {
        return getHtml$3.bind(this)()
    }
    static get properties() {
        return {
            name: {
                type: String
            },
            size: {
                type: Number
            }
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("name")) {
            assert(changedProperties.get("name") === undefined);
            IconsetMap.getInstance().set(this.name, this)
        }
    }
    applyIcon(element, iconName) {
        this.removeIcon(element);
        const svg = this.cloneIcon_(iconName);
        if (svg) {
            svg.classList.add(APPLIED_ICON_CLASS);
            element.shadowRoot.insertBefore(svg, element.shadowRoot.childNodes[0]);
            return svg
        }
        return null
    }
    createIcon(iconName) {
        return this.cloneIcon_(iconName)
    }
    removeIcon(element) {
        const oldSvg = element.shadowRoot.querySelector(`.${APPLIED_ICON_CLASS}`);
        if (oldSvg) {
            oldSvg.remove()
        }
    }
    cloneIcon_(id) {
        const sourceSvg = this.querySelector(`g[id="${id}"]`);
        if (!sourceSvg) {
            return null
        }
        const svgClone = this.$.baseSvg.cloneNode(true);
        const content = sourceSvg.cloneNode(true);
        content.removeAttribute("id");
        const contentViewBox = content.getAttribute("viewBox");
        if (contentViewBox) {
            svgClone.setAttribute("viewBox", contentViewBox)
        }
        svgClone.appendChild(content);
        return svgClone
    }
}
customElements.define(CrIconsetElement.is, CrIconsetElement);
const div$1 = document.createElement("div");
div$1.innerHTML = getTrustedHTML`
<cr-iconset name="cr20" size="20">
  <svg>
    <defs>
      
      <g id="block">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM2 10C2 5.58 5.58 2 10 2C11.85 2 13.55 2.63 14.9 3.69L3.69 14.9C2.63 13.55 2 11.85 2 10ZM5.1 16.31C6.45 17.37 8.15 18 10 18C14.42 18 18 14.42 18 10C18 8.15 17.37 6.45 16.31 5.1L5.1 16.31Z">
        </path>
      </g>
      <g id="cloud-off">
        <path d="M16 18.125L13.875 16H5C3.88889 16 2.94444 15.6111 2.16667 14.8333C1.38889 14.0556 1 13.1111 1 12C1 10.9444 1.36111 10.0347 2.08333 9.27083C2.80556 8.50694 3.6875 8.09028 4.72917 8.02083C4.77083 7.86805 4.8125 7.72222 4.85417 7.58333C4.90972 7.44444 4.97222 7.30555 5.04167 7.16667L1.875 4L2.9375 2.9375L17.0625 17.0625L16 18.125ZM5 14.5H12.375L6.20833 8.33333C6.15278 8.51389 6.09722 8.70139 6.04167 8.89583C6 9.07639 5.95139 9.25694 5.89583 9.4375L4.83333 9.52083C4.16667 9.57639 3.61111 9.84028 3.16667 10.3125C2.72222 10.7708 2.5 11.3333 2.5 12C2.5 12.6944 2.74306 13.2847 3.22917 13.7708C3.71528 14.2569 4.30556 14.5 5 14.5ZM17.5 15.375L16.3958 14.2917C16.7153 14.125 16.9792 13.8819 17.1875 13.5625C17.3958 13.2431 17.5 12.8889 17.5 12.5C17.5 11.9444 17.3056 11.4722 16.9167 11.0833C16.5278 10.6944 16.0556 10.5 15.5 10.5H14.125L14 9.14583C13.9028 8.11806 13.4722 7.25694 12.7083 6.5625C11.9444 5.85417 11.0417 5.5 10 5.5C9.65278 5.5 9.31944 5.54167 9 5.625C8.69444 5.70833 8.39583 5.82639 8.10417 5.97917L7.02083 4.89583C7.46528 4.61806 7.93056 4.40278 8.41667 4.25C8.91667 4.08333 9.44444 4 10 4C11.4306 4 12.6736 4.48611 13.7292 5.45833C14.7847 6.41667 15.375 7.59722 15.5 9C16.4722 9 17.2986 9.34028 17.9792 10.0208C18.6597 10.7014 19 11.5278 19 12.5C19 13.0972 18.8611 13.6458 18.5833 14.1458C18.3194 14.6458 17.9583 15.0556 17.5 15.375Z">
        </path>
      </g>
      <g id="delete">
        <path d="M 5.832031 17.5 C 5.375 17.5 4.984375 17.335938 4.65625 17.011719 C 4.328125 16.683594 4.167969 16.292969 4.167969 15.832031 L 4.167969 5 L 3.332031 5 L 3.332031 3.332031 L 7.5 3.332031 L 7.5 2.5 L 12.5 2.5 L 12.5 3.332031 L 16.667969 3.332031 L 16.667969 5 L 15.832031 5 L 15.832031 15.832031 C 15.832031 16.292969 15.671875 16.683594 15.34375 17.011719 C 15.015625 17.335938 14.625 17.5 14.167969 17.5 Z M 14.167969 5 L 5.832031 5 L 5.832031 15.832031 L 14.167969 15.832031 Z M 7.5 14.167969 L 9.167969 14.167969 L 9.167969 6.667969 L 7.5 6.667969 Z M 10.832031 14.167969 L 12.5 14.167969 L 12.5 6.667969 L 10.832031 6.667969 Z M 5.832031 5 L 5.832031 15.832031 Z M 5.832031 5 ">
        </path>
      </g>
      <g id="domain">
        <path d="M2,3 L2,17 L11.8267655,17 L13.7904799,17 L18,17 L18,7 L12,7 L12,3 L2,3 Z M8,13 L10,13 L10,15 L8,15 L8,13 Z M4,13 L6,13 L6,15 L4,15 L4,13 Z M8,9 L10,9 L10,11 L8,11 L8,9 Z M4,9 L6,9 L6,11 L4,11 L4,9 Z M12,9 L16,9 L16,15 L12,15 L12,9 Z M12,11 L14,11 L14,13 L12,13 L12,11 Z M8,5 L10,5 L10,7 L8,7 L8,5 Z M4,5 L6,5 L6,7 L4,7 L4,5 Z">
        </path>
      </g>
      <g id="kite">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.6327 8.00094L10.3199 2L16 8.00094L10.1848 16.8673C10.0995 16.9873 10.0071 17.1074 9.90047 17.2199C9.42417 17.7225 8.79147 18 8.11611 18C7.44076 18 6.80806 17.7225 6.33175 17.2199C5.85545 16.7173 5.59242 16.0497 5.59242 15.3371C5.59242 14.977 5.46445 14.647 5.22275 14.3919C4.98104 14.1369 4.66825 14.0019 4.32701 14.0019H4V12.6667H4.32701C5.00237 12.6667 5.63507 12.9442 6.11137 13.4468C6.58768 13.9494 6.85071 14.617 6.85071 15.3296C6.85071 15.6896 6.97867 16.0197 7.22038 16.2747C7.46209 16.5298 7.77488 16.6648 8.11611 16.6648C8.45735 16.6648 8.77014 16.5223 9.01185 16.2747C9.02396 16.2601 9.03607 16.246 9.04808 16.2319C9.08541 16.1883 9.12176 16.1458 9.15403 16.0947L9.55213 15.4946L4.6327 8.00094ZM10.3199 13.9371L6.53802 8.17116L10.3199 4.1814L14.0963 8.17103L10.3199 13.9371Z">
        </path>
      </g>
      <g id="menu">
        <path d="M2 4h16v2H2zM2 9h16v2H2zM2 14h16v2H2z"></path>
      </g>
      <g id="password">
        <path d="M5.833 11.667c.458 0 .847-.16 1.167-.479.333-.333.5-.729.5-1.188s-.167-.847-.5-1.167a1.555 1.555 0 0 0-1.167-.5c-.458 0-.854.167-1.188.5A1.588 1.588 0 0 0 4.166 10c0 .458.16.854.479 1.188.333.319.729.479 1.188.479Zm0 3.333c-1.389 0-2.569-.486-3.542-1.458C1.319 12.569.833 11.389.833 10c0-1.389.486-2.569 1.458-3.542C3.264 5.486 4.444 5 5.833 5c.944 0 1.813.243 2.604.729a4.752 4.752 0 0 1 1.833 1.979h7.23c.458 0 .847.167 1.167.5.333.319.5.708.5 1.167v3.958c0 .458-.167.854-.5 1.188A1.588 1.588 0 0 1 17.5 15h-3.75a1.658 1.658 0 0 1-1.188-.479 1.658 1.658 0 0 1-.479-1.188v-1.042H10.27a4.59 4.59 0 0 1-1.813 2A5.1 5.1 0 0 1 5.833 15Zm3.292-4.375h4.625v2.708H15v-1.042a.592.592 0 0 1 .167-.438.623.623 0 0 1 .458-.188c.181 0 .327.063.438.188a.558.558 0 0 1 .188.438v1.042H17.5V9.375H9.125a3.312 3.312 0 0 0-1.167-1.938 3.203 3.203 0 0 0-2.125-.77 3.21 3.21 0 0 0-2.354.979C2.827 8.298 2.5 9.083 2.5 10s.327 1.702.979 2.354a3.21 3.21 0 0 0 2.354.979c.806 0 1.514-.25 2.125-.75.611-.514 1-1.167 1.167-1.958Z"></path>
      </g>
      
  </defs></svg>
</cr-iconset>


<cr-iconset name="cr" size="24">
  <svg>
    <defs>
      
      <g id="account-child-invert" viewBox="0 0 48 48">
        <path d="M24 4c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6z"></path>
        <path fill="none" d="M0 0h48v48H0V0z"></path>
        <circle fill="none" cx="24" cy="26" r="4"></circle>
        <path d="M24 18c-6.16 0-13 3.12-13 7.23v11.54c0 2.32 2.19 4.33 5.2 5.63 2.32 1 5.12 1.59 7.8 1.59.66 0 1.33-.06 2-.14v-5.2c-.67.08-1.34.14-2 .14-2.63 0-5.39-.57-7.68-1.55.67-2.12 4.34-3.65 7.68-3.65.86 0 1.75.11 2.6.29 2.79.62 5.2 2.15 5.2 4.04v4.47c3.01-1.31 5.2-3.31 5.2-5.63V25.23C37 21.12 30.16 18 24 18zm0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z">
        </path>
      </g>
      <g id="add">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </g>
      <g id="arrow-back">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z">
        </path>
      </g>
      <g id="arrow-drop-up">
        <path d="M7 14l5-5 5 5z"></path>
      </g>
      <g id="arrow-drop-down">
        <path d="M7 10l5 5 5-5z"></path>
      </g>
      <g id="arrow-forward">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z">
        </path>
      </g>
      <g id="arrow-right">
        <path d="M10 7l5 5-5 5z"></path>
      </g>
      
      <g id="cancel">
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z">
        </path>
      </g>
      <g id="check">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
      </g>
      <g id="check-circle">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z">
        </path>
      </g>
      <g id="chevron-left">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
      </g>
      <g id="chevron-right">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
      </g>
      <g id="clear">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
        </path>
      </g>
      <g id="chrome-product" viewBox="0 -960 960 960">
        <path d="M336-479q0 60 42 102t102 42q60 0 102-42t42-102q0-60-42-102t-102-42q-60 0-102 42t-42 102Zm144 216q11 0 22.5-.5T525-267L427-99q-144-16-237.5-125T96-479q0-43 9.5-84.5T134-645l160 274q28 51 78 79.5T480-263Zm0-432q-71 0-126.5 42T276-545l-98-170q53-71 132.5-109.5T480-863q95 0 179 45t138 123H480Zm356 72q15 35 21.5 71t6.5 73q0 155-100 260.5T509-96l157-275q14-25 22-52t8-56q0-40-15-77t-41-67h196Z">
        </path>
      </g>
      <g id="close">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
        </path>
      </g>
      <g id="computer">
        <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z">
        </path>
      </g>
      <g id="create">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z">
        </path>
      </g>
      <g id="delete" viewBox="0 -960 960 960">
        <path d="M309.37-135.87q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.5h-53.5v-83H378.5v-53.5h202.52v53.5h206.11v83h-53.5v474.07q0 35.21-24.26 59.32t-58.74 24.11H309.37Zm341.26-557.5H309.37v474.5h341.26v-474.5ZM379.7-288.24h77.5v-336h-77.5v336Zm123.1 0h77.5v-336h-77.5v336ZM309.37-693.37v474.5-474.5Z">
        </path>
      </g>
      <g id="domain">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z">
        </path>
      </g>
      <g id="error">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z">
        </path>
      </g>
      <g id="error-outline">
        <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z">
        </path>
      </g>
      <g id="expand-less">
        <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
      </g>
      <g id="expand-more">
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
      </g>
      <g id="extension">
        <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z">
        </path>
      </g>
      <g id="file-download" viewBox="0 -960 960 960">
        <path d="M480-336 288-528l51-51 105 105v-342h72v342l105-105 51 51-192 192ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72h432v-72h72v72q0 29.7-21.16 50.85Q725.68-192 695.96-192H263.72Z"></path>
      </g>
      
      <g id="fullscreen">
        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z">
        </path>
      </g>
      <g id="group">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z">
        </path>
      </g>
      <g id="help-outline">
        <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z">
        </path>
      </g>
      <g id="history">
        <path d="M12.945312 22.75 C 10.320312 22.75 8.074219 21.839844 6.207031 20.019531 C 4.335938 18.199219 3.359375 15.972656 3.269531 13.34375 L 5.089844 13.34375 C 5.175781 15.472656 5.972656 17.273438 7.480469 18.742188 C 8.988281 20.210938 10.808594 20.945312 12.945312 20.945312 C 15.179688 20.945312 17.070312 20.164062 18.621094 18.601562 C 20.167969 17.039062 20.945312 15.144531 20.945312 12.910156 C 20.945312 10.714844 20.164062 8.855469 18.601562 7.335938 C 17.039062 5.816406 15.15625 5.054688 12.945312 5.054688 C 11.710938 5.054688 10.554688 5.339844 9.480469 5.902344 C 8.402344 6.46875 7.476562 7.226562 6.699219 8.179688 L 9.585938 8.179688 L 9.585938 9.984375 L 3.648438 9.984375 L 3.648438 4.0625 L 5.453125 4.0625 L 5.453125 6.824219 C 6.386719 5.707031 7.503906 4.828125 8.804688 4.199219 C 10.109375 3.566406 11.488281 3.25 12.945312 3.25 C 14.300781 3.25 15.570312 3.503906 16.761719 4.011719 C 17.949219 4.519531 18.988281 5.214844 19.875 6.089844 C 20.761719 6.964844 21.464844 7.992188 21.976562 9.167969 C 22.492188 10.34375 22.75 11.609375 22.75 12.964844 C 22.75 14.316406 22.492188 15.589844 21.976562 16.777344 C 21.464844 17.964844 20.761719 19.003906 19.875 19.882812 C 18.988281 20.765625 17.949219 21.464844 16.761719 21.976562 C 15.570312 22.492188 14.300781 22.75 12.945312 22.75 Z M 16.269531 17.460938 L 12.117188 13.34375 L 12.117188 7.527344 L 13.921875 7.527344 L 13.921875 12.601562 L 17.550781 16.179688 Z M 16.269531 17.460938">
        </path>
      </g>
      <g id="info">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z">
        </path>
      </g>
      <g id="info-outline">
        <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z">
        </path>
      </g>
      <g id="insert-drive-file">
        <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z">
        </path>
      </g>
      <g id="location-on">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z">
        </path>
      </g>
      <g id="mic">
        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z">
        </path>
      </g>
      <g id="more-vert">
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z">
        </path>
      </g>
      <g id="open-in-new" viewBox="0 -960 960 960">
        <path d="M216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h264v72H216v528h528v-264h72v264q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm171-192-51-51 357-357H576v-72h240v240h-72v-117L387-336Z">
        </path>
      </g>
      <g id="person">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z">
        </path>
      </g>
      <g id="phonelink">
        <path d="M4 6h18V4H4c-1.1 0-2 .9-2 2v11H0v3h14v-3H4V6zm19 2h-6c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm-1 9h-4v-7h4v7z">
        </path>
      </g>
      <g id="print">
        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z">
        </path>
      </g>
      <g id="schedule">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z">
        </path>
      </g>
      <g id="search">
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">
        </path>
      </g>
      <g id="security">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z">
        </path>
      </g>
      
      
      <g id="settings_icon">
        <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z">
        </path>
      </g>
      <g id="star">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z">
        </path>
      </g>
      <g id="sync" viewBox="0 -960 960 960">
        <path d="M216-192v-72h74q-45-40-71.5-95.5T192-480q0-101 61-177.5T408-758v75q-63 23-103.5 77.5T264-480q0 48 19.5 89t52.5 70v-63h72v192H216Zm336-10v-75q63-23 103.5-77.5T696-480q0-48-19.5-89T624-639v63h-72v-192h192v72h-74q45 40 71.5 95.5T768-480q0 101-61 177.5T552-202Z">
        </path>
      </g>
      <g id="thumbs-down">
        <path d="M6 3h11v13l-7 7-1.25-1.25a1.454 1.454 0 0 1-.3-.475c-.067-.2-.1-.392-.1-.575v-.35L9.45 16H3c-.533 0-1-.2-1.4-.6-.4-.4-.6-.867-.6-1.4v-2c0-.117.017-.242.05-.375s.067-.258.1-.375l3-7.05c.15-.333.4-.617.75-.85C5.25 3.117 5.617 3 6 3Zm9 2H6l-3 7v2h9l-1.35 5.5L15 15.15V5Zm0 10.15V5v10.15Zm2 .85v-2h3V5h-3V3h5v13h-5Z">
        </path>
      </g>
      <g id="thumbs-down-filled">
        <path d="M6 3h10v13l-7 7-1.25-1.25a1.336 1.336 0 0 1-.29-.477 1.66 1.66 0 0 1-.108-.574v-.347L8.449 16H3c-.535 0-1-.2-1.398-.602C1.199 15 1 14.535 1 14v-2c0-.117.012-.242.04-.375.022-.133.062-.258.108-.375l3-7.05c.153-.333.403-.618.75-.848A1.957 1.957 0 0 1 6 3Zm12 13V3h4v13Zm0 0">
        </path>
      </g>
      <g id="thumbs-up">
        <path d="M18 21H7V8l7-7 1.25 1.25c.117.117.208.275.275.475.083.2.125.392.125.575v.35L14.55 8H21c.533 0 1 .2 1.4.6.4.4.6.867.6 1.4v2c0 .117-.017.242-.05.375s-.067.258-.1.375l-3 7.05c-.15.333-.4.617-.75.85-.35.233-.717.35-1.1.35Zm-9-2h9l3-7v-2h-9l1.35-5.5L9 8.85V19ZM9 8.85V19 8.85ZM7 8v2H4v9h3v2H2V8h5Z">
        </path>
      </g>
      <g id="thumbs-up-filled">
        <path d="M18 21H8V8l7-7 1.25 1.25c.117.117.21.273.29.477.073.199.108.39.108.574v.347L15.551 8H21c.535 0 1 .2 1.398.602C22.801 9 23 9.465 23 10v2c0 .117-.012.242-.04.375a1.897 1.897 0 0 1-.108.375l-3 7.05a2.037 2.037 0 0 1-.75.848A1.957 1.957 0 0 1 18 21ZM6 8v13H2V8Zm0 0">
      </path></g>
      <g id="videocam" viewBox="0 -960 960 960">
        <path d="M216-192q-29 0-50.5-21.5T144-264v-432q0-29.7 21.5-50.85Q187-768 216-768h432q29.7 0 50.85 21.15Q720-725.7 720-696v168l144-144v384L720-432v168q0 29-21.15 50.5T648-192H216Zm0-72h432v-432H216v432Zm0 0v-432 432Z">
        </path>
      </g>
      <g id="warning">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path>
      </g>
    </defs>
  </svg>
</cr-iconset>
`;
const iconsets$1 = div$1.querySelectorAll("cr-iconset");
for (const iconset of iconsets$1) {
    document.head.appendChild(iconset)
}
const div = document.createElement("div");
div.innerHTML = getTrustedHTML`<cr-iconset name="iph" size="24">
  <svg>
    <defs>
      
      <g id="celebration">
        <path fill="none" d="M0 0h20v20H0z"></path>
        <path fill-rule="evenodd" d="m2 22 14-5-9-9-5 14Zm10.35-5.82L5.3 18.7l2.52-7.05 4.53 4.53ZM14.53 12.53l5.59-5.59a1.25 1.25 0 0 1 1.77 0l.59.59 1.06-1.06-.59-.59a2.758 2.758 0 0 0-3.89 0l-5.59 5.59 1.06 1.06ZM10.06 6.88l-.59.59 1.06 1.06.59-.59a2.758 2.758 0 0 0 0-3.89l-.59-.59-1.06 1.07.59.59c.48.48.48 1.28 0 1.76ZM17.06 11.88l-1.59 1.59 1.06 1.06 1.59-1.59a1.25 1.25 0 0 1 1.77 0l1.61 1.61 1.06-1.06-1.61-1.61a2.758 2.758 0 0 0-3.89 0ZM15.06 5.88l-3.59 3.59 1.06 1.06 3.59-3.59a2.758 2.758 0 0 0 0-3.89l-1.59-1.59-1.06 1.06 1.59 1.59c.48.49.48 1.29 0 1.77Z">
        </path>
      </g>
      <g id="lightbulb_outline">
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2 11.7V16h-4v-2.3C8.48 12.63 7 11.53 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.49-1.51 3.65-3 4.7z">
        </path>
      </g>
      <g id="lightbulb_outline_chrome_refresh" width="20" height="20" viewBox="0 -960 960 960">
        <path d="M479.779-81.413q-30.975 0-52.812-22.704-21.837-22.704-21.837-55.035h149.74q0 32.631-22.058 55.185-22.058 22.554-53.033 22.554ZM333.848-209.065v-75.587h292.304v75.587H333.848Zm-15-125.5Q254.696-374 219.282-440.533q-35.413-66.532-35.413-142.163 0-123.288 86.364-209.59 86.363-86.301 209.739-86.301t209.767 86.301q86.392 86.302 86.392 209.59 0 75.87-35.413 142.283Q705.304-374 641.152-334.565H318.848Zm26.348-83h269.608q37.283-30.522 57.805-73.566 20.521-43.043 20.521-91.512 0-89.424-61.812-151.184-61.813-61.76-151.087-61.76-89.274 0-151.318 61.76-62.043 61.76-62.043 151.184 0 48.469 20.521 91.512 20.522 43.044 57.805 73.566Zm134.804 0Z">
        </path>
      </g>
    </defs>
  </svg>
</cr-iconset>
`;
const iconsets = div.querySelectorAll("cr-iconset");
for (const iconset of iconsets) {
    document.head.appendChild(iconset)
}
let instance$3 = null;
function getCss$2() {
    return instance$3 || (instance$3 = [...[getCss$d()], css`:host{--help-bubble-background:var(--color-feature-promo-bubble-background,
      var(--google-blue-700));--help-bubble-foreground:var(--color-feature-promo-bubble-foreground,
      var(--google-grey-200));--help-bubble-border-radius:12px;--help-bubble-close-button-icon-size:16px;--help-bubble-close-button-size:20px;--help-bubble-element-spacing:8px;--help-bubble-padding:20px;--help-bubble-font-weight:400;border-radius:var(--help-bubble-border-radius);box-shadow:0 6px 10px 4px rgba(60,64,67,.15),0 2px 3px rgba(60,64,67,.3);box-sizing:border-box;position:absolute;z-index:1}#arrow{--help-bubble-arrow-size:11.3px;--help-bubble-arrow-size-half:calc(var(--help-bubble-arrow-size) / 2);--help-bubble-arrow-diameter:16px;--help-bubble-arrow-radius:calc(var(--help-bubble-arrow-diameter) / 2);--help-bubble-arrow-edge-offset:22px;--help-bubble-arrow-offset:calc(var(--help-bubble-arrow-edge-offset) +
                                   var(--help-bubble-arrow-radius));--help-bubble-arrow-border-radius:2px;position:absolute}#inner-arrow{background-color:var(--help-bubble-background);height:var(--help-bubble-arrow-size);left:calc(0px - var(--help-bubble-arrow-size-half));position:absolute;top:calc(0px - var(--help-bubble-arrow-size-half));transform:rotate(45deg);width:var(--help-bubble-arrow-size);z-index:-1}#arrow.bottom-edge{bottom:0}#arrow.bottom-edge #inner-arrow{border-bottom-right-radius:var(--help-bubble-arrow-border-radius)}#arrow.top-edge{top:0}#arrow.top-edge #inner-arrow{border-top-left-radius:var(--help-bubble-arrow-border-radius)}#arrow.right-edge{right:0}#arrow.right-edge #inner-arrow{border-top-right-radius:var(--help-bubble-arrow-border-radius)}#arrow.left-edge{left:0}#arrow.left-edge #inner-arrow{border-bottom-left-radius:var(--help-bubble-arrow-border-radius)}#arrow.top-position{top:var(--help-bubble-arrow-offset)}#arrow.vertical-center-position{top:50%}#arrow.bottom-position{bottom:var(--help-bubble-arrow-offset)}#arrow.left-position{left:var(--help-bubble-arrow-offset)}#arrow.horizontal-center-position{left:50%}#arrow.right-position{right:var(--help-bubble-arrow-offset)}#topContainer{display:flex;flex-direction:row}#progress{display:inline-block;flex:auto}#progress div{--help-bubble-progress-size:8px;background-color:var(--help-bubble-foreground);border:1px solid var(--help-bubble-foreground);border-radius:50%;display:inline-block;height:var(--help-bubble-progress-size);margin-inline-end:var(--help-bubble-element-spacing);margin-top:5px;width:var(--help-bubble-progress-size)}#progress .total-progress{background-color:var(--help-bubble-background)}#mainBody,#topBody{flex:1;font-size:14px;font-style:normal;font-weight:var(--help-bubble-font-weight);letter-spacing:.3px;line-height:20px;margin:0}#title{flex:1;font-size:18px;font-style:normal;font-weight:500;line-height:24px;margin:0}.help-bubble{--cr-focus-outline-color:var(--help-bubble-foreground);background-color:var(--help-bubble-background);border-radius:var(--help-bubble-border-radius);box-sizing:border-box;color:var(--help-bubble-foreground);display:flex;flex-direction:column;justify-content:space-between;max-width:340px;min-width:260px;padding:var(--help-bubble-padding);position:relative}#main{display:flex;flex-direction:row;justify-content:flex-start;margin-top:var(--help-bubble-element-spacing)}#middleRowSpacer{margin-inline-start:32px}cr-button,cr-icon-button{--help-bubble-button-foreground:var(--help-bubble-foreground);--help-bubble-button-background:var(--help-bubble-background);--help-bubble-button-hover-alpha:10%}cr-button.default-button{--help-bubble-button-foreground:var(
      --color-feature-promo-bubble-default-button-foreground,
      var(--help-bubble-background));--help-bubble-button-background:var(
      --color-feature-promo-bubble-default-button-background,
      var(--help-bubble-foreground));--help-bubble-button-hover-alpha:6%}@media (prefers-color-scheme:dark){cr-button,cr-icon-button{--help-bubble-button-hover-alpha:6%}cr-button.default-button{--help-bubble-button-hover-alpha:10%}}#buttons cr-button:hover,cr-icon-button:hover{background-color:color-mix(in srgb,var(--help-bubble-button-foreground) var(--help-bubble-button-hover-alpha),var(--help-bubble-button-background))}cr-icon-button{--cr-icon-button-fill-color:var(--help-bubble-button-foreground);--cr-icon-button-icon-size:var(--help-bubble-close-button-icon-size);--cr-icon-button-size:var(--help-bubble-close-button-size);--cr-icon-button-stroke-color:var(--help-bubble-button-foreground);box-sizing:border-box;display:block;flex:none;float:right;height:var(--cr-icon-button-size);margin:0;margin-inline-start:var(--help-bubble-element-spacing);order:2;width:var(--cr-icon-button-size)}cr-icon-button:focus-visible:focus{box-shadow:inset 0 0 0 1px var(--cr-focus-outline-color)}#bodyIcon{--help-bubble-body-icon-image-size:18px;--help-bubble-body-icon-size:24px;--iron-icon-height:var(--help-bubble-body-icon-image-size);--iron-icon-width:var(--help-bubble-body-icon-image-size);background-color:var(--help-bubble-foreground);border-radius:50%;box-sizing:border-box;color:var(--help-bubble-background);height:var(--help-bubble-body-icon-size);margin-inline-end:var(--help-bubble-element-spacing);padding:calc((var(--help-bubble-body-icon-size) - var(--help-bubble-body-icon-image-size))/ 2);text-align:center;width:var(--help-bubble-body-icon-size)}#bodyIcon cr-icon{display:block}#buttons{display:flex;flex-direction:row;justify-content:flex-end;margin-top:16px}#buttons cr-button{--cr-button-border-color:var(--help-bubble-foreground);--cr-button-text-color:var(--help-bubble-button-foreground);--cr-button-background-color:var(--help-bubble-button-background)}#buttons cr-button:focus{box-shadow:none;outline:2px solid var(--cr-focus-outline-color);outline-offset:1px}#buttons cr-button:not(:first-child){margin-inline-start:var(--help-bubble-element-spacing)}`])
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getHtml$2() {
    return html$1`
<link rel="stylesheet" href="chrome://theme/colors.css?sets=ui,chrome&shadow_host=true">
<div class="help-bubble" role="alertdialog" aria-modal="true"
    aria-labelledby="title" aria-describedby="body" aria-live="assertive"
    @keydown="${this.onKeyDown_}" @click="${this.blockPropagation_}">
  <div id="topContainer">
    <div id="bodyIcon" ?hidden="${!this.shouldShowBodyIcon_()}"
        role="image" aria-label="${this.bodyIconAltText}">
      <cr-icon icon="iph:${this.bodyIconName}"></cr-icon>
    </div>
    <div id="progress" ?hidden="${!this.progress}" role="progressbar"
        aria-valuenow="${this.progress ? this.progress.current : nothing}"
        aria-valuemin="1"
        aria-valuemax="${this.progress ? this.progress.total : nothing}">
      ${this.progressData_.map(( (_item, index) => html$1`
        <div class="${this.getProgressClass_(index)}"></div>`))}
    </div>
    <h1 id="title"
        ?hidden="${!this.shouldShowTitleInTopContainer_()}">
      ${this.titleText}
    </h1>
    <p id="topBody"
        ?hidden="${!this.shouldShowBodyInTopContainer_()}">
      ${this.bodyText}
    </p>
    <cr-icon-button id="close" iron-icon="cr:close"
        aria-label="${this.closeButtonAltText}" @click="${this.dismiss_}"
        tabindex="${this.closeButtonTabIndex}">
    </cr-icon-button>
  </div>
  <div id="main" ?hidden="${!this.shouldShowBodyInMain_()}">
    <div id="middleRowSpacer" ?hidden="!${this.shouldShowBodyIcon_()}">
    </div>
    <p id="mainBody">${this.bodyText}</p>
  </div>
  <div id="buttons" ?hidden="${!this.buttons.length}">
    ${this.sortedButtons.map((item => html$1`
      <cr-button id="${this.getButtonId_(item)}"
          tabindex="${this.getButtonTabIndex_(item)}"
          class="${this.getButtonClass_(item.isDefault)}"
          @click="${this.onButtonClick_}"
          role="button" aria-label="${item.text}">${item.text}</cr-button>`))}
  </div>
  <div id="arrow" class="${this.getArrowClass_()}">
    <div id="inner-arrow"></div>
  </div>
</div>`
}
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const PointSpec = {
    $: {}
};
const PointFSpec = {
    $: {}
};
const Point3FSpec = {
    $: {}
};
const SizeSpec = {
    $: {}
};
const SizeFSpec = {
    $: {}
};
const RectSpec = {
    $: {}
};
const RectFSpec = {
    $: {}
};
const InsetsSpec = {
    $: {}
};
const InsetsFSpec = {
    $: {}
};
const Vector2dSpec = {
    $: {}
};
const Vector2dFSpec = {
    $: {}
};
const Vector3dFSpec = {
    $: {}
};
const QuaternionSpec = {
    $: {}
};
const QuadFSpec = {
    $: {}
};
mojo.internal.Struct(PointSpec.$, "Point", [mojo.internal.StructField("x", 0, 0, mojo.internal.Int32, 0, false, 0), mojo.internal.StructField("y", 4, 0, mojo.internal.Int32, 0, false, 0)], [[0, 16]]);
mojo.internal.Struct(PointFSpec.$, "PointF", [mojo.internal.StructField("x", 0, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("y", 4, 0, mojo.internal.Float, 0, false, 0)], [[0, 16]]);
mojo.internal.Struct(Point3FSpec.$, "Point3F", [mojo.internal.StructField("x", 0, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("y", 4, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("z", 8, 0, mojo.internal.Float, 0, false, 0)], [[0, 24]]);
mojo.internal.Struct(SizeSpec.$, "Size", [mojo.internal.StructField("width", 0, 0, mojo.internal.Int32, 0, false, 0), mojo.internal.StructField("height", 4, 0, mojo.internal.Int32, 0, false, 0)], [[0, 16]]);
mojo.internal.Struct(SizeFSpec.$, "SizeF", [mojo.internal.StructField("width", 0, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("height", 4, 0, mojo.internal.Float, 0, false, 0)], [[0, 16]]);
mojo.internal.Struct(RectSpec.$, "Rect", [mojo.internal.StructField("x", 0, 0, mojo.internal.Int32, 0, false, 0), mojo.internal.StructField("y", 4, 0, mojo.internal.Int32, 0, false, 0), mojo.internal.StructField("width", 8, 0, mojo.internal.Int32, 0, false, 0), mojo.internal.StructField("height", 12, 0, mojo.internal.Int32, 0, false, 0)], [[0, 24]]);
mojo.internal.Struct(RectFSpec.$, "RectF", [mojo.internal.StructField("x", 0, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("y", 4, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("width", 8, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("height", 12, 0, mojo.internal.Float, 0, false, 0)], [[0, 24]]);
mojo.internal.Struct(InsetsSpec.$, "Insets", [mojo.internal.StructField("top", 0, 0, mojo.internal.Int32, 0, false, 0), mojo.internal.StructField("left", 4, 0, mojo.internal.Int32, 0, false, 0), mojo.internal.StructField("bottom", 8, 0, mojo.internal.Int32, 0, false, 0), mojo.internal.StructField("right", 12, 0, mojo.internal.Int32, 0, false, 0)], [[0, 24]]);
mojo.internal.Struct(InsetsFSpec.$, "InsetsF", [mojo.internal.StructField("top", 0, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("left", 4, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("bottom", 8, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("right", 12, 0, mojo.internal.Float, 0, false, 0)], [[0, 24]]);
mojo.internal.Struct(Vector2dSpec.$, "Vector2d", [mojo.internal.StructField("x", 0, 0, mojo.internal.Int32, 0, false, 0), mojo.internal.StructField("y", 4, 0, mojo.internal.Int32, 0, false, 0)], [[0, 16]]);
mojo.internal.Struct(Vector2dFSpec.$, "Vector2dF", [mojo.internal.StructField("x", 0, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("y", 4, 0, mojo.internal.Float, 0, false, 0)], [[0, 16]]);
mojo.internal.Struct(Vector3dFSpec.$, "Vector3dF", [mojo.internal.StructField("x", 0, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("y", 4, 0, mojo.internal.Float, 0, false, 0), mojo.internal.StructField("z", 8, 0, mojo.internal.Float, 0, false, 0)], [[0, 24]]);
mojo.internal.Struct(QuaternionSpec.$, "Quaternion", [mojo.internal.StructField("x", 0, 0, mojo.internal.Double, 0, false, 0), mojo.internal.StructField("y", 8, 0, mojo.internal.Double, 0, false, 0), mojo.internal.StructField("z", 16, 0, mojo.internal.Double, 0, false, 0), mojo.internal.StructField("w", 24, 0, mojo.internal.Double, 0, false, 0)], [[0, 40]]);
mojo.internal.Struct(QuadFSpec.$, "QuadF", [mojo.internal.StructField("p1", 0, 0, PointFSpec.$, null, false, 0), mojo.internal.StructField("p2", 8, 0, PointFSpec.$, null, false, 0), mojo.internal.StructField("p3", 16, 0, PointFSpec.$, null, false, 0), mojo.internal.StructField("p4", 24, 0, PointFSpec.$, null, false, 0)], [[0, 40]]);
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const HelpBubbleArrowPositionSpec = {
    $: mojo.internal.Enum()
};
var HelpBubbleArrowPosition;
(function(HelpBubbleArrowPosition) {
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["MIN_VALUE"] = 0] = "MIN_VALUE";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["MAX_VALUE"] = 11] = "MAX_VALUE";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["TOP_LEFT"] = 0] = "TOP_LEFT";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["TOP_CENTER"] = 1] = "TOP_CENTER";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["TOP_RIGHT"] = 2] = "TOP_RIGHT";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["BOTTOM_LEFT"] = 3] = "BOTTOM_LEFT";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["BOTTOM_CENTER"] = 4] = "BOTTOM_CENTER";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["BOTTOM_RIGHT"] = 5] = "BOTTOM_RIGHT";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["LEFT_TOP"] = 6] = "LEFT_TOP";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["LEFT_CENTER"] = 7] = "LEFT_CENTER";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["LEFT_BOTTOM"] = 8] = "LEFT_BOTTOM";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["RIGHT_TOP"] = 9] = "RIGHT_TOP";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["RIGHT_CENTER"] = 10] = "RIGHT_CENTER";
    HelpBubbleArrowPosition[HelpBubbleArrowPosition["RIGHT_BOTTOM"] = 11] = "RIGHT_BOTTOM"
}
)(HelpBubbleArrowPosition || (HelpBubbleArrowPosition = {}));
const HelpBubbleClosedReasonSpec = {
    $: mojo.internal.Enum()
};
var HelpBubbleClosedReason;
(function(HelpBubbleClosedReason) {
    HelpBubbleClosedReason[HelpBubbleClosedReason["MIN_VALUE"] = 0] = "MIN_VALUE";
    HelpBubbleClosedReason[HelpBubbleClosedReason["MAX_VALUE"] = 2] = "MAX_VALUE";
    HelpBubbleClosedReason[HelpBubbleClosedReason["kPageChanged"] = 0] = "kPageChanged";
    HelpBubbleClosedReason[HelpBubbleClosedReason["kDismissedByUser"] = 1] = "kDismissedByUser";
    HelpBubbleClosedReason[HelpBubbleClosedReason["kTimedOut"] = 2] = "kTimedOut"
}
)(HelpBubbleClosedReason || (HelpBubbleClosedReason = {}));
class HelpBubbleHandlerFactoryPendingReceiver {
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "help_bubble.mojom.HelpBubbleHandlerFactory", scope)
    }
}
class HelpBubbleHandlerFactoryRemote {
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(HelpBubbleHandlerFactoryPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    createHelpBubbleHandler(client, handler) {
        this.proxy.sendMessage(1524761176, HelpBubbleHandlerFactory_CreateHelpBubbleHandler_ParamsSpec.$, null, [client, handler])
    }
}
class HelpBubbleHandlerFactory {
    static get $interfaceName() {
        return "help_bubble.mojom.HelpBubbleHandlerFactory"
    }
    static getRemote() {
        let remote = new HelpBubbleHandlerFactoryRemote;
        remote.$.bindNewPipeAndPassReceiver().bindInBrowser();
        return remote
    }
}
class HelpBubbleHandlerPendingReceiver {
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "help_bubble.mojom.HelpBubbleHandler", scope)
    }
}
class HelpBubbleHandlerRemote {
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(HelpBubbleHandlerPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    helpBubbleAnchorVisibilityChanged(nativeIdentifier, visible, rect) {
        this.proxy.sendMessage(343829053, HelpBubbleHandler_HelpBubbleAnchorVisibilityChanged_ParamsSpec.$, null, [nativeIdentifier, visible, rect])
    }
    helpBubbleAnchorActivated(nativeIdentifier) {
        this.proxy.sendMessage(1057493118, HelpBubbleHandler_HelpBubbleAnchorActivated_ParamsSpec.$, null, [nativeIdentifier])
    }
    helpBubbleAnchorCustomEvent(nativeIdentifier, customEventName) {
        this.proxy.sendMessage(1626413310, HelpBubbleHandler_HelpBubbleAnchorCustomEvent_ParamsSpec.$, null, [nativeIdentifier, customEventName])
    }
    helpBubbleButtonPressed(nativeIdentifier, buttonIndex) {
        this.proxy.sendMessage(1732921720, HelpBubbleHandler_HelpBubbleButtonPressed_ParamsSpec.$, null, [nativeIdentifier, buttonIndex])
    }
    helpBubbleClosed(nativeIdentifier, reason) {
        this.proxy.sendMessage(1731870330, HelpBubbleHandler_HelpBubbleClosed_ParamsSpec.$, null, [nativeIdentifier, reason])
    }
}
class HelpBubbleClientPendingReceiver {
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }
    bindInBrowser(scope="context") {
        mojo.internal.interfaceSupport.bind(this.handle, "help_bubble.mojom.HelpBubbleClient", scope)
    }
}
class HelpBubbleClientRemote {
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(HelpBubbleClientPendingReceiver,handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }
    showHelpBubble(params) {
        this.proxy.sendMessage(442994919, HelpBubbleClient_ShowHelpBubble_ParamsSpec.$, null, [params])
    }
    toggleFocusForAccessibility(nativeIdentifier) {
        this.proxy.sendMessage(1199328674, HelpBubbleClient_ToggleFocusForAccessibility_ParamsSpec.$, null, [nativeIdentifier])
    }
    hideHelpBubble(nativeIdentifier) {
        this.proxy.sendMessage(261496333, HelpBubbleClient_HideHelpBubble_ParamsSpec.$, null, [nativeIdentifier])
    }
    externalHelpBubbleUpdated(nativeIdentifier, shown) {
        this.proxy.sendMessage(157257426, HelpBubbleClient_ExternalHelpBubbleUpdated_ParamsSpec.$, null, [nativeIdentifier, shown])
    }
}
class HelpBubbleClientCallbackRouter {
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(HelpBubbleClientRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.showHelpBubble = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(442994919, HelpBubbleClient_ShowHelpBubble_ParamsSpec.$, null, this.showHelpBubble.createReceiverHandler(false));
        this.toggleFocusForAccessibility = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1199328674, HelpBubbleClient_ToggleFocusForAccessibility_ParamsSpec.$, null, this.toggleFocusForAccessibility.createReceiverHandler(false));
        this.hideHelpBubble = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(261496333, HelpBubbleClient_HideHelpBubble_ParamsSpec.$, null, this.hideHelpBubble.createReceiverHandler(false));
        this.externalHelpBubbleUpdated = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(157257426, HelpBubbleClient_ExternalHelpBubbleUpdated_ParamsSpec.$, null, this.externalHelpBubbleUpdated.createReceiverHandler(false));
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter()
    }
    removeListener(id) {
        return this.router_.removeListener(id)
    }
}
const HelpBubbleButtonParamsSpec = {
    $: {}
};
const ProgressSpec = {
    $: {}
};
const HelpBubbleParamsSpec = {
    $: {}
};
const HelpBubbleHandlerFactory_CreateHelpBubbleHandler_ParamsSpec = {
    $: {}
};
const HelpBubbleHandler_HelpBubbleAnchorVisibilityChanged_ParamsSpec = {
    $: {}
};
const HelpBubbleHandler_HelpBubbleAnchorActivated_ParamsSpec = {
    $: {}
};
const HelpBubbleHandler_HelpBubbleAnchorCustomEvent_ParamsSpec = {
    $: {}
};
const HelpBubbleHandler_HelpBubbleButtonPressed_ParamsSpec = {
    $: {}
};
const HelpBubbleHandler_HelpBubbleClosed_ParamsSpec = {
    $: {}
};
const HelpBubbleClient_ShowHelpBubble_ParamsSpec = {
    $: {}
};
const HelpBubbleClient_ToggleFocusForAccessibility_ParamsSpec = {
    $: {}
};
const HelpBubbleClient_HideHelpBubble_ParamsSpec = {
    $: {}
};
const HelpBubbleClient_ExternalHelpBubbleUpdated_ParamsSpec = {
    $: {}
};
mojo.internal.Struct(HelpBubbleButtonParamsSpec.$, "HelpBubbleButtonParams", [mojo.internal.StructField("text", 0, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("isDefault", 8, 0, mojo.internal.Bool, false, false, 0)], [[0, 24]]);
mojo.internal.Struct(ProgressSpec.$, "Progress", [mojo.internal.StructField("current", 0, 0, mojo.internal.Uint8, 0, false, 0), mojo.internal.StructField("total", 1, 0, mojo.internal.Uint8, 0, false, 0)], [[0, 16]]);
mojo.internal.Struct(HelpBubbleParamsSpec.$, "HelpBubbleParams", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("position", 8, 0, HelpBubbleArrowPositionSpec.$, HelpBubbleArrowPosition.TOP_CENTER, false, 0), mojo.internal.StructField("titleText", 16, 0, mojo.internal.String, null, true, 0), mojo.internal.StructField("bodyText", 24, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("closeButtonAltText", 32, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("bodyIconName", 40, 0, mojo.internal.String, null, true, 0), mojo.internal.StructField("bodyIconAltText", 48, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("progress", 56, 0, ProgressSpec.$, null, true, 0), mojo.internal.StructField("buttons", 64, 0, mojo.internal.Array(HelpBubbleButtonParamsSpec.$, false), null, false, 0), mojo.internal.StructField("focus_on_show_hint_$flag", 12, 0, mojo.internal.Bool, false, false, 0, {
    isPrimary: true,
    linkedValueFieldName: "focus_on_show_hint_$value",
    originalFieldName: "focusOnShowHint"
}), mojo.internal.StructField("focus_on_show_hint_$value", 12, 1, mojo.internal.Bool, false, false, 0, {
    isPrimary: false,
    originalFieldName: "focusOnShowHint"
}), mojo.internal.StructField("timeout", 72, 0, TimeDeltaSpec.$, null, true, 0)], [[0, 88]]);
mojo.internal.Struct(HelpBubbleHandlerFactory_CreateHelpBubbleHandler_ParamsSpec.$, "HelpBubbleHandlerFactory_CreateHelpBubbleHandler_Params", [mojo.internal.StructField("client", 0, 0, mojo.internal.InterfaceProxy(HelpBubbleClientRemote), null, false, 0), mojo.internal.StructField("handler", 8, 0, mojo.internal.InterfaceRequest(HelpBubbleHandlerPendingReceiver), null, false, 0)], [[0, 24]]);
mojo.internal.Struct(HelpBubbleHandler_HelpBubbleAnchorVisibilityChanged_ParamsSpec.$, "HelpBubbleHandler_HelpBubbleAnchorVisibilityChanged_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("visible", 8, 0, mojo.internal.Bool, false, false, 0), mojo.internal.StructField("rect", 16, 0, RectFSpec.$, null, false, 0)], [[0, 32]]);
mojo.internal.Struct(HelpBubbleHandler_HelpBubbleAnchorActivated_ParamsSpec.$, "HelpBubbleHandler_HelpBubbleAnchorActivated_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0)], [[0, 16]]);
mojo.internal.Struct(HelpBubbleHandler_HelpBubbleAnchorCustomEvent_ParamsSpec.$, "HelpBubbleHandler_HelpBubbleAnchorCustomEvent_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("customEventName", 8, 0, mojo.internal.String, null, false, 0)], [[0, 24]]);
mojo.internal.Struct(HelpBubbleHandler_HelpBubbleButtonPressed_ParamsSpec.$, "HelpBubbleHandler_HelpBubbleButtonPressed_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("buttonIndex", 8, 0, mojo.internal.Uint8, 0, false, 0)], [[0, 24]]);
mojo.internal.Struct(HelpBubbleHandler_HelpBubbleClosed_ParamsSpec.$, "HelpBubbleHandler_HelpBubbleClosed_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("reason", 8, 0, HelpBubbleClosedReasonSpec.$, 0, false, 0)], [[0, 24]]);
mojo.internal.Struct(HelpBubbleClient_ShowHelpBubble_ParamsSpec.$, "HelpBubbleClient_ShowHelpBubble_Params", [mojo.internal.StructField("params", 0, 0, HelpBubbleParamsSpec.$, null, false, 0)], [[0, 16]]);
mojo.internal.Struct(HelpBubbleClient_ToggleFocusForAccessibility_ParamsSpec.$, "HelpBubbleClient_ToggleFocusForAccessibility_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0)], [[0, 16]]);
mojo.internal.Struct(HelpBubbleClient_HideHelpBubble_ParamsSpec.$, "HelpBubbleClient_HideHelpBubble_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0)], [[0, 16]]);
mojo.internal.Struct(HelpBubbleClient_ExternalHelpBubbleUpdated_ParamsSpec.$, "HelpBubbleClient_ExternalHelpBubbleUpdated_Params", [mojo.internal.StructField("nativeIdentifier", 0, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("shown", 8, 0, mojo.internal.Bool, false, false, 0)], [[0, 24]]);
// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const ACTION_BUTTON_ID_PREFIX = "action-button-";
const HELP_BUBBLE_DISMISSED_EVENT = "help-bubble-dismissed";
const HELP_BUBBLE_TIMED_OUT_EVENT = "help-bubble-timed-out";
const HELP_BUBBLE_SCROLL_ANCHOR_OPTIONS = {
    behavior: "smooth",
    block: "center"
};
function debounceEnd(fn, time=50) {
    let timerId;
    return () => {
        clearTimeout(timerId);
        timerId = setTimeout(fn, time)
    }
}
class HelpBubbleElement extends CrLitElement {
    constructor() {
        super(...arguments);
        this.nativeId = "";
        this.bodyText = "";
        this.titleText = "";
        this.closeButtonAltText = "";
        this.closeButtonTabIndex = 0;
        this.position = HelpBubbleArrowPosition.TOP_CENTER;
        this.buttons = [];
        this.sortedButtons = [];
        this.progress = null;
        this.bodyIconName = null;
        this.bodyIconAltText = "";
        this.timeoutMs = null;
        this.timeoutTimerId = null;
        this.debouncedUpdate = null;
        this.padding = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };
        this.fixed = false;
        this.focusAnchor = false;
        this.buttonListObserver_ = null;
        this.anchorElement_ = null;
        this.progressData_ = [];
        this.resizeObserver_ = null
    }
    static get is() {
        return "help-bubble"
    }
    static get styles() {
        return getCss$2()
    }
    render() {
        return getHtml$2.bind(this)()
    }
    static get properties() {
        return {
            nativeId: {
                type: String,
                reflect: true
            },
            position: {
                type: HelpBubbleArrowPosition,
                reflect: true
            },
            bodyIconName: {
                type: String
            },
            bodyIconAltText: {
                type: String
            },
            progress: {
                type: Object
            },
            titleText: {
                type: String
            },
            bodyText: {
                type: String
            },
            buttons: {
                type: Array
            },
            sortedButtons: {
                type: Array
            },
            closeButtonAltText: {
                type: String
            },
            closeButtonTabIndex: {
                type: Number
            },
            progressData_: {
                type: Array,
                state: true
            }
        }
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("buttons")) {
            this.sortedButtons = this.buttons.toSorted(this.buttonSortFunc_)
        }
    }
    show(anchorElement) {
        this.anchorElement_ = anchorElement;
        if (this.progress) {
            this.progressData_ = new Array(this.progress.total);
            this.progressData_.fill(true)
        } else {
            this.progressData_ = []
        }
        this.closeButtonTabIndex = this.buttons.length ? this.buttons.length + 2 : 1;
        assert(this.anchorElement_, "Tried to show a help bubble but anchorElement does not exist");
        this.style.display = "block";
        this.style.position = this.fixed ? "fixed" : "absolute";
        this.removeAttribute("aria-hidden");
        this.updatePosition_();
        this.debouncedUpdate = debounceEnd(( () => {
            if (this.anchorElement_) {
                this.updatePosition_()
            }
        }
        ), 50);
        this.buttonListObserver_ = new MutationObserver(this.debouncedUpdate);
        this.buttonListObserver_.observe(this.$.buttons, {
            childList: true
        });
        window.addEventListener("resize", this.debouncedUpdate);
        if (this.timeoutMs !== null) {
            const timedOutCallback = () => {
                this.dispatchEvent(new CustomEvent(HELP_BUBBLE_TIMED_OUT_EVENT,{
                    detail: {
                        nativeId: this.nativeId
                    }
                }))
            }
            ;
            this.timeoutTimerId = setTimeout(timedOutCallback, this.timeoutMs)
        }
        if (this.offsetParent && !this.fixed) {
            this.resizeObserver_ = new ResizeObserver(( () => {
                this.updatePosition_();
                this.anchorElement_?.scrollIntoView(HELP_BUBBLE_SCROLL_ANCHOR_OPTIONS)
            }
            ));
            this.resizeObserver_.observe(this.offsetParent)
        }
    }
    hide() {
        if (this.resizeObserver_) {
            this.resizeObserver_.disconnect();
            this.resizeObserver_ = null
        }
        this.style.display = "none";
        this.setAttribute("aria-hidden", "true");
        this.anchorElement_ = null;
        if (this.timeoutTimerId !== null) {
            clearInterval(this.timeoutTimerId);
            this.timeoutTimerId = null
        }
        if (this.buttonListObserver_) {
            this.buttonListObserver_.disconnect();
            this.buttonListObserver_ = null
        }
        if (this.debouncedUpdate) {
            window.removeEventListener("resize", this.debouncedUpdate);
            this.debouncedUpdate = null
        }
    }
    getAnchorElement() {
        return this.anchorElement_
    }
    getButtonForTesting(buttonIndex) {
        return this.$.buttons.querySelector(`[id="${ACTION_BUTTON_ID_PREFIX + buttonIndex}"]`)
    }
    focus() {
        const defaultButton = this.$.buttons.querySelector("cr-button.default-button") || this.$.buttons.querySelector("cr-button");
        if (defaultButton) {
            defaultButton.focus();
            return
        }
        this.$.close.focus();
        if (this.anchorElement_ && this.focusAnchor) {
            this.anchorElement_.focus()
        }
    }
    static isDefaultButtonLeading() {
        return isWindows
    }
    dismiss_() {
        assert(this.nativeId, "Dismiss: expected help bubble to have a native id.");
        this.dispatchEvent(new CustomEvent(HELP_BUBBLE_DISMISSED_EVENT,{
            detail: {
                nativeId: this.nativeId,
                fromActionButton: false
            }
        }))
    }
    onKeyDown_(e) {
        if (e.key === "Escape") {
            e.stopPropagation();
            this.dismiss_()
        }
    }
    blockPropagation_(e) {
        e.stopPropagation()
    }
    getProgressClass_(index) {
        return index < this.progress.current ? "current-progress" : "total-progress"
    }
    shouldShowTitleInTopContainer_() {
        return !!this.titleText && !this.progress
    }
    shouldShowBodyInTopContainer_() {
        return !this.progress && !this.titleText
    }
    shouldShowBodyInMain_() {
        return !!this.progress || !!this.titleText
    }
    shouldShowBodyIcon_() {
        return this.bodyIconName !== null && this.bodyIconName !== ""
    }
    onButtonClick_(e) {
        assert(this.nativeId, "Action button clicked: expected help bubble to have a native ID.");
        const index = parseInt(e.target.id.substring(ACTION_BUTTON_ID_PREFIX.length));
        this.dispatchEvent(new CustomEvent(HELP_BUBBLE_DISMISSED_EVENT,{
            detail: {
                nativeId: this.nativeId,
                fromActionButton: true,
                buttonIndex: index
            }
        }))
    }
    getButtonId_(item) {
        const index = this.buttons.indexOf(item);
        assert(index > -1);
        return ACTION_BUTTON_ID_PREFIX + index
    }
    getButtonClass_(isDefault) {
        return isDefault ? "default-button focus-outline-visible" : "focus-outline-visible"
    }
    getButtonTabIndex_(item) {
        const index = this.buttons.indexOf(item);
        assert(index > -1);
        return item.isDefault ? 1 : index + 2
    }
    buttonSortFunc_(button1, button2) {
        if (button1.isDefault) {
            return isWindows ? -1 : 1
        }
        if (button2.isDefault) {
            return isWindows ? 1 : -1
        }
        return 0
    }
    getArrowClass_() {
        let classList = "";
        switch (this.position) {
        case HelpBubbleArrowPosition.TOP_LEFT:
        case HelpBubbleArrowPosition.TOP_CENTER:
        case HelpBubbleArrowPosition.TOP_RIGHT:
            classList = "top-edge ";
            break;
        case HelpBubbleArrowPosition.BOTTOM_LEFT:
        case HelpBubbleArrowPosition.BOTTOM_CENTER:
        case HelpBubbleArrowPosition.BOTTOM_RIGHT:
            classList = "bottom-edge ";
            break;
        case HelpBubbleArrowPosition.LEFT_TOP:
        case HelpBubbleArrowPosition.LEFT_CENTER:
        case HelpBubbleArrowPosition.LEFT_BOTTOM:
            classList = "left-edge ";
            break;
        case HelpBubbleArrowPosition.RIGHT_TOP:
        case HelpBubbleArrowPosition.RIGHT_CENTER:
        case HelpBubbleArrowPosition.RIGHT_BOTTOM:
            classList = "right-edge ";
            break;
        default:
            assertNotReached("Unknown help bubble position: " + this.position)
        }
        switch (this.position) {
        case HelpBubbleArrowPosition.TOP_LEFT:
        case HelpBubbleArrowPosition.BOTTOM_LEFT:
            classList += "left-position";
            break;
        case HelpBubbleArrowPosition.TOP_CENTER:
        case HelpBubbleArrowPosition.BOTTOM_CENTER:
            classList += "horizontal-center-position";
            break;
        case HelpBubbleArrowPosition.TOP_RIGHT:
        case HelpBubbleArrowPosition.BOTTOM_RIGHT:
            classList += "right-position";
            break;
        case HelpBubbleArrowPosition.LEFT_TOP:
        case HelpBubbleArrowPosition.RIGHT_TOP:
            classList += "top-position";
            break;
        case HelpBubbleArrowPosition.LEFT_CENTER:
        case HelpBubbleArrowPosition.RIGHT_CENTER:
            classList += "vertical-center-position";
            break;
        case HelpBubbleArrowPosition.LEFT_BOTTOM:
        case HelpBubbleArrowPosition.RIGHT_BOTTOM:
            classList += "bottom-position";
            break;
        default:
            assertNotReached("Unknown help bubble position: " + this.position)
        }
        return classList
    }
    updatePosition_() {
        assert(this.anchorElement_, "Update position: expected valid anchor element.");
        const ANCHOR_OFFSET = 16;
        const ARROW_WIDTH = 16;
        const ARROW_OFFSET_FROM_EDGE = 22 + ARROW_WIDTH / 2;
        const anchorRect = this.anchorElement_.getBoundingClientRect();
        const anchorRectCenter = {
            x: anchorRect.left + anchorRect.width / 2,
            y: anchorRect.top + anchorRect.height / 2
        };
        const helpBubbleRect = this.getBoundingClientRect();
        let offsetX = this.anchorElement_.offsetLeft;
        let offsetY = this.anchorElement_.offsetTop;
        switch (this.position) {
        case HelpBubbleArrowPosition.TOP_LEFT:
        case HelpBubbleArrowPosition.TOP_CENTER:
        case HelpBubbleArrowPosition.TOP_RIGHT:
            offsetY += anchorRect.height + ANCHOR_OFFSET + this.padding.bottom;
            break;
        case HelpBubbleArrowPosition.BOTTOM_LEFT:
        case HelpBubbleArrowPosition.BOTTOM_CENTER:
        case HelpBubbleArrowPosition.BOTTOM_RIGHT:
            offsetY -= helpBubbleRect.height + ANCHOR_OFFSET + this.padding.top;
            break;
        case HelpBubbleArrowPosition.LEFT_TOP:
        case HelpBubbleArrowPosition.LEFT_CENTER:
        case HelpBubbleArrowPosition.LEFT_BOTTOM:
            offsetX += anchorRect.width + ANCHOR_OFFSET + this.padding.right;
            break;
        case HelpBubbleArrowPosition.RIGHT_TOP:
        case HelpBubbleArrowPosition.RIGHT_CENTER:
        case HelpBubbleArrowPosition.RIGHT_BOTTOM:
            offsetX -= helpBubbleRect.width + ANCHOR_OFFSET + this.padding.left;
            break;
        default:
            assertNotReached()
        }
        switch (this.position) {
        case HelpBubbleArrowPosition.TOP_LEFT:
        case HelpBubbleArrowPosition.BOTTOM_LEFT:
            if (anchorRect.left + ARROW_OFFSET_FROM_EDGE > anchorRectCenter.x) {
                offsetX += anchorRect.width / 2 - ARROW_OFFSET_FROM_EDGE
            }
            break;
        case HelpBubbleArrowPosition.TOP_CENTER:
        case HelpBubbleArrowPosition.BOTTOM_CENTER:
            offsetX += anchorRect.width / 2 - helpBubbleRect.width / 2;
            break;
        case HelpBubbleArrowPosition.TOP_RIGHT:
        case HelpBubbleArrowPosition.BOTTOM_RIGHT:
            if (anchorRect.right - ARROW_OFFSET_FROM_EDGE < anchorRectCenter.x) {
                offsetX += anchorRect.width / 2 - helpBubbleRect.width + ARROW_OFFSET_FROM_EDGE
            } else {
                offsetX += anchorRect.width - helpBubbleRect.width
            }
            break;
        case HelpBubbleArrowPosition.LEFT_TOP:
        case HelpBubbleArrowPosition.RIGHT_TOP:
            if (anchorRect.top + ARROW_OFFSET_FROM_EDGE > anchorRectCenter.y) {
                offsetY += anchorRect.height / 2 - ARROW_OFFSET_FROM_EDGE
            }
            break;
        case HelpBubbleArrowPosition.LEFT_CENTER:
        case HelpBubbleArrowPosition.RIGHT_CENTER:
            offsetY += anchorRect.height / 2 - helpBubbleRect.height / 2;
            break;
        case HelpBubbleArrowPosition.LEFT_BOTTOM:
        case HelpBubbleArrowPosition.RIGHT_BOTTOM:
            if (anchorRect.bottom - ARROW_OFFSET_FROM_EDGE < anchorRectCenter.y) {
                offsetY += anchorRect.height / 2 - helpBubbleRect.height + ARROW_OFFSET_FROM_EDGE
            } else {
                offsetY += anchorRect.height - helpBubbleRect.height
            }
            break;
        default:
            assertNotReached()
        }
        this.style.top = offsetY.toString() + "px";
        this.style.left = offsetX.toString() + "px"
    }
}
customElements.define(HelpBubbleElement.is, HelpBubbleElement);
// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const ANCHOR_HIGHLIGHT_CLASS = "help-anchor-highlight";
function isRtlLang(element) {
    return window.getComputedStyle(element).direction === "rtl"
}
function reflectArrowPosition(position) {
    switch (position) {
    case HelpBubbleArrowPosition.TOP_LEFT:
        return HelpBubbleArrowPosition.TOP_RIGHT;
    case HelpBubbleArrowPosition.TOP_RIGHT:
        return HelpBubbleArrowPosition.TOP_LEFT;
    case HelpBubbleArrowPosition.BOTTOM_LEFT:
        return HelpBubbleArrowPosition.BOTTOM_RIGHT;
    case HelpBubbleArrowPosition.BOTTOM_RIGHT:
        return HelpBubbleArrowPosition.BOTTOM_LEFT;
    case HelpBubbleArrowPosition.LEFT_TOP:
        return HelpBubbleArrowPosition.RIGHT_TOP;
    case HelpBubbleArrowPosition.LEFT_CENTER:
        return HelpBubbleArrowPosition.RIGHT_CENTER;
    case HelpBubbleArrowPosition.LEFT_BOTTOM:
        return HelpBubbleArrowPosition.RIGHT_BOTTOM;
    case HelpBubbleArrowPosition.RIGHT_TOP:
        return HelpBubbleArrowPosition.LEFT_TOP;
    case HelpBubbleArrowPosition.RIGHT_CENTER:
        return HelpBubbleArrowPosition.LEFT_CENTER;
    case HelpBubbleArrowPosition.RIGHT_BOTTOM:
        return HelpBubbleArrowPosition.LEFT_BOTTOM;
    default:
        return position
    }
}
class HelpBubbleController {
    constructor(nativeId, root) {
        this.anchor_ = null;
        this.bubble_ = null;
        this.options_ = {
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            fixed: false
        };
        this.isBubbleShowing_ = false;
        this.isAnchorVisible_ = false;
        this.lastAnchorBounds_ = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
        this.isExternal_ = false;
        assert(nativeId, "HelpBubble: nativeId was not defined when registering help bubble");
        assert(root, "HelpBubble: shadowRoot was not defined when registering help bubble");
        this.nativeId_ = nativeId;
        this.root_ = root
    }
    isBubbleShowing() {
        return this.isBubbleShowing_
    }
    canShowBubble() {
        return this.hasAnchor()
    }
    hasBubble() {
        return !!this.bubble_
    }
    getBubble() {
        return this.bubble_
    }
    hasAnchor() {
        return !!this.anchor_
    }
    getAnchor() {
        return this.anchor_
    }
    getNativeId() {
        return this.nativeId_
    }
    getPadding() {
        return this.options_.padding
    }
    getAnchorVisibility() {
        return this.isAnchorVisible_
    }
    getLastAnchorBounds() {
        return this.lastAnchorBounds_
    }
    updateAnchorVisibility(isVisible, bounds) {
        const changed = isVisible !== this.isAnchorVisible_ || bounds.x !== this.lastAnchorBounds_.x || bounds.y !== this.lastAnchorBounds_.y || bounds.width !== this.lastAnchorBounds_.width || bounds.height !== this.lastAnchorBounds_.height;
        this.isAnchorVisible_ = isVisible;
        this.lastAnchorBounds_ = bounds;
        return changed
    }
    isAnchorFixed() {
        return this.options_.fixed
    }
    isExternal() {
        return this.isExternal_
    }
    updateExternalShowingStatus(isShowing) {
        this.isExternal_ = true;
        this.isBubbleShowing_ = isShowing;
        this.setAnchorHighlight_(isShowing)
    }
    track(trackable, options) {
        assert(!this.anchor_);
        let anchor = null;
        if (typeof trackable === "string") {
            anchor = this.root_.querySelector(trackable)
        } else if (Array.isArray(trackable)) {
            anchor = this.deepQuery(trackable)
        } else if (trackable instanceof HTMLElement) {
            anchor = trackable
        } else {
            assertNotReached("HelpBubble: anchor argument was unrecognized when registering " + "help bubble")
        }
        if (!anchor) {
            return false
        }
        anchor.dataset["nativeId"] = this.nativeId_;
        this.anchor_ = anchor;
        this.options_ = options;
        return true
    }
    deepQuery(selectors) {
        let cur = this.root_;
        for (const selector of selectors) {
            if (cur.shadowRoot) {
                cur = cur.shadowRoot
            }
            const el = cur.querySelector(selector);
            if (!el) {
                return null
            } else {
                cur = el
            }
        }
        return cur
    }
    show() {
        this.isExternal_ = false;
        if (!(this.bubble_ && this.anchor_)) {
            return
        }
        this.bubble_.show(this.anchor_);
        this.isBubbleShowing_ = true;
        this.setAnchorHighlight_(true)
    }
    hide() {
        if (!this.bubble_) {
            return
        }
        this.bubble_.hide();
        this.bubble_.remove();
        this.bubble_ = null;
        this.isBubbleShowing_ = false;
        this.setAnchorHighlight_(false)
    }
    createBubble(params) {
        assert(this.anchor_, "HelpBubble: anchor was not defined when showing help bubble");
        assert(this.anchor_.parentNode, "HelpBubble: anchor element not in DOM");
        this.bubble_ = document.createElement("help-bubble");
        this.bubble_.nativeId = this.nativeId_;
        this.bubble_.position = isRtlLang(this.anchor_) ? reflectArrowPosition(params.position) : params.position;
        this.bubble_.closeButtonAltText = params.closeButtonAltText;
        this.bubble_.bodyText = params.bodyText;
        this.bubble_.bodyIconName = params.bodyIconName || null;
        this.bubble_.bodyIconAltText = params.bodyIconAltText;
        this.bubble_.titleText = params.titleText || "";
        this.bubble_.progress = params.progress || null;
        this.bubble_.buttons = params.buttons;
        this.bubble_.padding = this.options_.padding;
        this.bubble_.focusAnchor = params.focusOnShowHint === false;
        if (params.timeout) {
            this.bubble_.timeoutMs = Number(params.timeout.microseconds / 1000n);
            assert(this.bubble_.timeoutMs > 0)
        }
        assert(!this.bubble_.progress || this.bubble_.progress.total >= this.bubble_.progress.current);
        assert(this.root_);
        if (getComputedStyle(this.anchor_).getPropertyValue("position") === "fixed") {
            this.bubble_.fixed = true
        }
        this.anchor_.parentNode.insertBefore(this.bubble_, this.anchor_);
        return this.bubble_
    }
    setAnchorHighlight_(highlight) {
        assert(this.anchor_, "Set anchor highlight: expected valid anchor element.");
        this.anchor_.classList.toggle(ANCHOR_HIGHLIGHT_CLASS, highlight);
        if (highlight) {
            (this.bubble_ || this.anchor_).focus();
            this.anchor_.scrollIntoView(HELP_BUBBLE_SCROLL_ANCHOR_OPTIONS)
        }
    }
}
// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class HelpBubbleProxyImpl {
    constructor() {
        this.callbackRouter_ = new HelpBubbleClientCallbackRouter;
        this.handler_ = new HelpBubbleHandlerRemote;
        const factory = HelpBubbleHandlerFactory.getRemote();
        factory.createHelpBubbleHandler(this.callbackRouter_.$.bindNewPipeAndPassRemote(), this.handler_.$.bindNewPipeAndPassReceiver())
    }
    static getInstance() {
        return instance$2 || (instance$2 = new HelpBubbleProxyImpl)
    }
    static setInstance(obj) {
        instance$2 = obj
    }
    getHandler() {
        return this.handler_
    }
    getCallbackRouter() {
        return this.callbackRouter_
    }
}
let instance$2 = null;
// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function recordDuration(metricName, durationMs) {
    chrome.metricsPrivate.recordValue({
        metricName: metricName,
        type: chrome.metricsPrivate.MetricTypeType.HISTOGRAM_LOG,
        min: 1,
        max: 6e4,
        buckets: 100
    }, Math.floor(durationMs))
}
function recordLoadDuration(metricName, msSinceEpoch) {
    recordDuration(metricName, msSinceEpoch - loadTimeData.getValue("navigationStartTime"))
}
function recordPerdecage(metricName, value) {
    chrome.metricsPrivate.recordValue({
        metricName: metricName,
        type: chrome.metricsPrivate.MetricTypeType.HISTOGRAM_LINEAR,
        min: 1,
        max: 11,
        buckets: 12
    }, value)
}
function recordOccurence(metricName) {
    chrome.metricsPrivate.recordValue({
        metricName: metricName,
        type: chrome.metricsPrivate.MetricTypeType.HISTOGRAM_LINEAR,
        min: 1,
        max: 1,
        buckets: 1
    }, 1)
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const CrSelectableMixin = superClass => {
    class CrSelectableMixin extends superClass {
        constructor() {
            super(...arguments);
            this.attrForSelected = null;
            this.selectedAttribute = null;
            this.selectOnClick = true;
            this.items_ = [];
            this.selectedItem_ = null
        }
        static get properties() {
            return {
                attrForSelected: {
                    type: String
                },
                selected: {
                    type: String,
                    notify: true
                },
                selectedAttribute: {
                    type: String
                },
                selectable: {
                    type: String
                }
            }
        }
        firstUpdated(changedProperties) {
            super.firstUpdated(changedProperties);
            if (this.selectOnClick) {
                this.addEventListener("click", (e => this.onClick_(e)))
            }
            this.observeItems()
        }
        observeItems() {
            this.getSlot().addEventListener("slotchange", ( () => this.itemsChanged()))
        }
        connectedCallback() {
            super.connectedCallback();
            this.updateItems_()
        }
        willUpdate(changedProperties) {
            super.willUpdate(changedProperties);
            if (changedProperties.has("attrForSelected")) {
                if (this.selectedItem_) {
                    assert(this.attrForSelected);
                    const value = this.selectedItem_.getAttribute(this.attrForSelected);
                    assert(value !== null);
                    this.selected = value
                }
            }
        }
        updated(changedProperties) {
            super.updated(changedProperties);
            if (changedProperties.has("selected")) {
                this.updateSelectedItem_()
            }
        }
        select(value) {
            this.selected = value
        }
        selectPrevious() {
            const length = this.items_.length;
            let index = length - 1;
            if (this.selected !== undefined) {
                index = (this.valueToIndex_(this.selected) - 1 + length) % length
            }
            this.selected = this.indexToValue_(index)
        }
        selectNext() {
            const index = this.selected === undefined ? 0 : (this.valueToIndex_(this.selected) + 1) % this.items_.length;
            this.selected = this.indexToValue_(index)
        }
        getItemsForTest() {
            return this.items_
        }
        getSlot() {
            const slot = this.shadowRoot.querySelector("slot");
            assert(slot);
            return slot
        }
        queryItems() {
            const selectable = this.selectable === undefined ? "*" : this.selectable;
            return Array.from(this.querySelectorAll(`:scope > ${selectable}`))
        }
        queryMatchingItem(selector) {
            const selectable = this.selectable || "*";
            return this.querySelector(`:scope > :is(${selectable})${selector}`)
        }
        updateItems_() {
            this.items_ = this.queryItems();
            this.items_.forEach(( (item, index) => item.setAttribute("data-selection-index", index.toString())))
        }
        get selectedItem() {
            return this.selectedItem_
        }
        updateSelectedItem_() {
            if (!this.items_) {
                return
            }
            const item = this.selected == null ? null : this.items_[this.valueToIndex_(this.selected)];
            if (!!item && this.selectedItem_ !== item) {
                this.setItemSelected_(this.selectedItem_, false);
                this.setItemSelected_(item, true)
            } else if (!item) {
                this.setItemSelected_(this.selectedItem_, false)
            }
        }
        setItemSelected_(item, isSelected) {
            if (!item) {
                return
            }
            item.classList.toggle("selected", isSelected);
            if (this.selectedAttribute) {
                item.toggleAttribute(this.selectedAttribute, isSelected)
            }
            this.selectedItem_ = isSelected ? item : null;
            this.fire("iron-" + (isSelected ? "select" : "deselect"), {
                item: item
            })
        }
        valueToIndex_(value) {
            if (!this.attrForSelected) {
                return Number(value)
            }
            const match = this.queryMatchingItem(`[${this.attrForSelected}="${value}"]`);
            return match ? Number(match.dataset["selectionIndex"]) : -1
        }
        indexToValue_(index) {
            if (!this.attrForSelected) {
                return index
            }
            const item = this.items_[index];
            if (!item) {
                return index
            }
            return item.getAttribute(this.attrForSelected) || index
        }
        itemsChanged() {
            this.updateItems_();
            this.updateSelectedItem_();
            this.fire("iron-items-changed")
        }
        onClick_(e) {
            let element = e.target;
            while (element && element !== this) {
                const idx = this.items_.indexOf(element);
                if (idx >= 0) {
                    const value = this.indexToValue_(idx);
                    assert(value !== null);
                    this.fire("iron-activate", {
                        item: element,
                        selected: value
                    });
                    this.select(value);
                    return
                }
                element = element.parentNode
            }
        }
    }
    return CrSelectableMixin
}
;
let instance$1 = null;
function getCss$1() {
    return instance$1 || (instance$1 = [...[], css`:host{display:block}:host(:not([show-all]))>::slotted(:not(slot):not(.selected)){display:none!important}`])
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function getHtml$1() {
    return html$1`<slot></slot>`
}
// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const CrPageSelectorElementBase = CrSelectableMixin(CrLitElement);
class CrPageSelectorElement extends CrPageSelectorElementBase {
    static get is() {
        return "cr-page-selector"
    }
    static get styles() {
        return getCss$1()
    }
    static get properties() {
        return {
            hasNestedSlots: {
                type: Boolean
            }
        }
    }
    render() {
        return getHtml$1.bind(this)()
    }
    constructor() {
        super();
        this.hasNestedSlots = false;
        this.selectOnClick = false
    }
    queryItems() {
        return this.hasNestedSlots ? Array.from(this.getSlot().assignedElements({
            flatten: true
        })) : super.queryItems()
    }
    queryMatchingItem(selector) {
        if (this.hasNestedSlots) {
            const match = this.queryItems().find((el => el.matches(selector)));
            return match ? match : null
        }
        return super.queryMatchingItem(selector)
    }
    observeItems() {
        if (this.hasNestedSlots) {
            this.addEventListener("slotchange", ( () => this.itemsChanged()))
        }
        super.observeItems()
    }
}
customElements.define(CrPageSelectorElement.is, CrPageSelectorElement);
let instance = null;
function getCss() {
    return instance || (instance = [...[getCss$8()], css`:host{--receiving-audio-color:var(--google-red-500);--speak-shown-duration:2s}.display-stack{display:grid}.display-stack>*{grid-column-start:1;grid-row-start:1}#dialog{align-items:center;background-color:var(--color-new-tab-page-overlay-background);border:none;display:flex;height:100%;justify-content:center;left:0;margin:0;max-height:initial;max-width:initial;padding:0;top:0;width:100%}#closeButton{--cr-icon-button-fill-color:var(--color-new-tab-page-overlay-secondary-foreground);margin:0;position:absolute;top:16px}:host-context([dir=ltr]) #closeButton{right:16px}:host-context([dir=rtl]) #closeButton{left:16px}#content{align-items:center;display:flex;flex-direction:row;width:660px}#texts{color:var(--color-new-tab-page-overlay-secondary-foreground);flex-grow:1;font-size:32px;text-align:start}[text]{transition-delay:.2s;transition-duration:.5s;transition-property:opacity,padding-inline-start;transition-timing-function:ease-out;visibility:hidden;width:100%}[text=speak],[text=waiting]{opacity:0;overflow-x:hidden;padding-inline-start:50px}[text][visible]{opacity:1;padding-inline-start:0;visibility:visible}[text=speak][visible] #speak{opacity:0;transition:opacity 0s var(--speak-shown-duration)}[text=speak] #listening{opacity:0}[text=speak][visible] #listening{opacity:1;transition:opacity 750ms ease-out var(--speak-shown-duration)}#finalResult{color:var(--color-new-tab-page-overlay-foreground)}#errorLinks,#errors{display:inline}#errorLinks a{color:var(--cr-link-color);font-size:18px;font-weight:500;margin-inline-start:.25em}#micContainer{--mic-button-size:165px;--mic-container-size:300px;align-items:center;flex-shrink:0;height:var(--mic-container-size);justify-items:center;width:var(--mic-container-size)}#micVolume{--mic-volume-size:calc(var(--mic-button-size) +
      var(--mic-volume-level) * (var(--mic-container-size) -
          var(--mic-button-size)));align-items:center;background-color:var(--color-new-tab-page-border);border-radius:50%;display:flex;height:var(--mic-volume-size);justify-content:center;transition-duration:var(--mic-volume-duration);transition-property:height,width;transition-timing-function:ease-in-out;width:var(--mic-volume-size)}#micVolumeCutout{background-color:var(--color-new-tab-page-overlay-background);border-radius:50%;height:var(--mic-button-size);width:var(--mic-button-size)}#micIconContainer{align-items:center;border:1px solid var(--color-new-tab-page-mic-border-color);border-radius:50%;display:flex;height:var(--mic-button-size);justify-content:center;transition:background-color .2s ease-in-out;width:var(--mic-button-size)}.receiving #micIconContainer{background-color:var(--receiving-audio-color);border-color:var(--receiving-audio-color)}#micIcon{-webkit-mask-image:url(icons/mic.svg);-webkit-mask-repeat:no-repeat;-webkit-mask-size:100%;background-color:var(--color-new-tab-page-mic-icon-color);height:80px;transition:background-color .2s ease-in-out;width:80px}.listening #micIcon{background-color:var(--receiving-audio-color)}.receiving #micIcon{background-color:#fff}`])
}
function getHtml() {
    return html$1`<!--_html_template_start_--><dialog id="dialog" @close="${this.onOverlayClose_}" @click="${this.onOverlayClick_}" @keydown="${this.onOverlayKeydown_}">
  <div id="content" tabindex="-1">
    <iron-selector id="texts" selected="${this.getText_()}" attr-for-selected="text" fallback-selection="none" aria-live="polite" selected-attribute="visible" class="display-stack">
      <div text="none"></div>
      <div text="waiting">Waiting…</div>
      <div text="speak" class="display-stack">
        <div id="speak">Speak now</div>
        <div id="listening">Listening…</div>
      </div>
      <div text="result" aria-hidden="true">
        <span id="finalResult">${this.finalResult_}</span>
        <span>${this.interimResult_}</span>
      </div>
      <div text="error">
        <cr-page-selector id="errors" selected="${this.getErrorText_()}" attr-for-selected="error">
          <span error="no-speech">Please check your microphone and audio levels.</span>
          <span error="audio-capture">Please check your microphone.</span>
          <span error="network">No Internet connection.</span>
          <span error="not-allowed">Voice search has been turned off.</span>
          <span error="language-not-supported">Voice search in your language is not available.</span>
          <span error="no-match">Didn&#39;t get that.</span>
          <span error="other">Unknown error.</span>
        </cr-page-selector>
        <cr-page-selector id="errorLinks" selected="${this.getErrorLink_()}" attr-for-selected="link">
          <span link="none"></span>
          <a link="learn-more" target="_blank" href="${this.helpUrl_}" @click="${this.onLearnMoreClick_}" @keydown="${this.onLinkKeydown_}" aria-label="Learn more about using a microphone">Learn more
          </a>
          <a link="details" target="_blank" href="${this.helpUrl_}" @keydown="${this.onLinkKeydown_}" aria-label="Learn more about using a microphone">Details
          </a>
          <a link="try-again" id="retryLink" href="#" @click="${this.onTryAgainClick_}" @keydown="${this.onLinkKeydown_}">Try again
          </a>
        </cr-page-selector>
      </div>
    </iron-selector>
    <div id="micContainer" class="${this.getMicClass_()} display-stack">
      <div id="micVolume" .style="--mic-volume-level: ${this.micVolumeLevel_};
                --mic-volume-duration: ${this.micVolumeDuration_}ms;">
        <div id="micVolumeCutout">
        </div>
      </div>
      <div id="micIconContainer">
        <div id="micIcon"></div>
      </div>
    </div>
  </div>
  <cr-icon-button id="closeButton" class="icon-clear" title="Close">
  </cr-icon-button>
</dialog>
<!--_html_template_end_-->`
}
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const RECOGNITION_CONFIDENCE_THRESHOLD = .5;
const QUERY_LENGTH_LIMIT = 120;
const IDLE_TIMEOUT_MS = 8e3;
const ERROR_TIMEOUT_SHORT_MS = 9e3;
const ERROR_TIMEOUT_LONG_MS = 24e3;
const VOLUME_ANIMATION_DURATION_MIN_MS = 170;
const VOLUME_ANIMATION_DURATION_RANGE_MS = 10;
var State;
(function(State) {
    State[State["UNINITIALIZED"] = -1] = "UNINITIALIZED";
    State[State["STARTED"] = 0] = "STARTED";
    State[State["AUDIO_RECEIVED"] = 1] = "AUDIO_RECEIVED";
    State[State["SPEECH_RECEIVED"] = 2] = "SPEECH_RECEIVED";
    State[State["RESULT_RECEIVED"] = 3] = "RESULT_RECEIVED";
    State[State["ERROR_RECEIVED"] = 4] = "ERROR_RECEIVED";
    State[State["RESULT_FINAL"] = 5] = "RESULT_FINAL"
}
)(State || (State = {}));
var Action;
(function(Action) {
    Action[Action["ACTIVATE_SEARCH_BOX"] = 0] = "ACTIVATE_SEARCH_BOX";
    Action[Action["ACTIVATE_KEYBOARD"] = 1] = "ACTIVATE_KEYBOARD";
    Action[Action["CLOSE_OVERLAY"] = 2] = "CLOSE_OVERLAY";
    Action[Action["QUERY_SUBMITTED"] = 3] = "QUERY_SUBMITTED";
    Action[Action["SUPPORT_LINK_CLICKED"] = 4] = "SUPPORT_LINK_CLICKED";
    Action[Action["TRY_AGAIN_LINK"] = 5] = "TRY_AGAIN_LINK";
    Action[Action["TRY_AGAIN_MIC_BUTTON"] = 6] = "TRY_AGAIN_MIC_BUTTON"
}
)(Action || (Action = {}));
var Error$1;
(function(Error) {
    Error[Error["ABORTED"] = 0] = "ABORTED";
    Error[Error["AUDIO_CAPTURE"] = 1] = "AUDIO_CAPTURE";
    Error[Error["BAD_GRAMMAR"] = 2] = "BAD_GRAMMAR";
    Error[Error["LANGUAGE_NOT_SUPPORTED"] = 3] = "LANGUAGE_NOT_SUPPORTED";
    Error[Error["NETWORK"] = 4] = "NETWORK";
    Error[Error["NO_MATCH"] = 5] = "NO_MATCH";
    Error[Error["NO_SPEECH"] = 6] = "NO_SPEECH";
    Error[Error["NOT_ALLOWED"] = 7] = "NOT_ALLOWED";
    Error[Error["OTHER"] = 8] = "OTHER";
    Error[Error["SERVICE_NOT_ALLOWED"] = 9] = "SERVICE_NOT_ALLOWED"
}
)(Error$1 || (Error$1 = {}));
function recordVoiceAction(action) {
    chrome.metricsPrivate.recordEnumerationValue("NewTabPage.VoiceActions", action, Object.keys(Action).length)
}
function toError(webkitError) {
    switch (webkitError) {
    case "aborted":
        return Error$1.ABORTED;
    case "audio-capture":
        return Error$1.AUDIO_CAPTURE;
    case "language-not-supported":
        return Error$1.LANGUAGE_NOT_SUPPORTED;
    case "network":
        return Error$1.NETWORK;
    case "no-speech":
        return Error$1.NO_SPEECH;
    case "not-allowed":
        return Error$1.NOT_ALLOWED;
    case "service-not-allowed":
        return Error$1.SERVICE_NOT_ALLOWED;
    case "bad-grammar":
        return Error$1.BAD_GRAMMAR;
    default:
        return Error$1.OTHER
    }
}
function getErrorTimeout(error) {
    switch (error) {
    case Error$1.AUDIO_CAPTURE:
    case Error$1.NO_SPEECH:
    case Error$1.NOT_ALLOWED:
    case Error$1.NO_MATCH:
        return ERROR_TIMEOUT_LONG_MS;
    default:
        return ERROR_TIMEOUT_SHORT_MS
    }
}
class VoiceSearchOverlayElement extends CrLitElement {
    static get is() {
        return "ntp-voice-search-overlay"
    }
    static get styles() {
        return getCss()
    }
    render() {
        return getHtml.bind(this)()
    }
    static get properties() {
        return {
            interimResult_: {
                type: String
            },
            finalResult_: {
                type: String
            },
            state_: {
                type: Number
            },
            error_: {
                type: Number
            },
            helpUrl_: {
                type: String
            },
            micVolumeLevel_: {
                type: Number
            },
            micVolumeDuration_: {
                type: Number
            }
        }
    }
    constructor() {
        super();
        this.state_ = State.UNINITIALIZED;
        this.helpUrl_ = `https://support.google.com/chrome/?p=ui_voice_search&hl=${window.navigator.language}`;
        this.micVolumeLevel_ = 0;
        this.micVolumeDuration_ = VOLUME_ANIMATION_DURATION_MIN_MS;
        this.timerId_ = null;
        this.pageHandler_ = NewTabPageProxy.getInstance().handler;
        this.voiceRecognition_ = new window.webkitSpeechRecognition;
        this.voiceRecognition_.continuous = false;
        this.voiceRecognition_.interimResults = true;
        this.voiceRecognition_.lang = window.navigator.language;
        this.voiceRecognition_.onaudiostart = this.onAudioStart_.bind(this);
        this.voiceRecognition_.onspeechstart = this.onSpeechStart_.bind(this);
        this.voiceRecognition_.onresult = this.onResult_.bind(this);
        this.voiceRecognition_.onend = this.onEnd_.bind(this);
        this.voiceRecognition_.onerror = e => {
            this.onError_(toError(e.error))
        }
        ;
        this.voiceRecognition_.onnomatch = () => {
            this.onError_(Error$1.NO_MATCH)
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.$.dialog.showModal();
        this.start()
    }
    start() {
        this.voiceRecognition_.start();
        this.state_ = State.STARTED;
        this.resetIdleTimer_()
    }
    onOverlayClose_() {
        this.voiceRecognition_.abort();
        this.dispatchEvent(new Event("close"))
    }
    onOverlayClick_() {
        this.$.dialog.close();
        recordVoiceAction(Action.CLOSE_OVERLAY)
    }
    onOverlayKeydown_(e) {
        if (["Enter", " "].includes(e.key) && this.finalResult_) {
            this.onFinalResult_()
        } else if (e.key === "Escape") {
            this.onOverlayClick_()
        }
    }
    onLinkKeydown_(e) {
        if (!["Enter", " "].includes(e.key)) {
            return
        }
        e.stopPropagation();
        e.preventDefault();
        e.target.click()
    }
    onLearnMoreClick_() {
        recordVoiceAction(Action.SUPPORT_LINK_CLICKED)
    }
    onTryAgainClick_(e) {
        e.stopPropagation();
        this.start();
        recordVoiceAction(Action.TRY_AGAIN_LINK)
    }
    resetIdleTimer_() {
        WindowProxy.getInstance().clearTimeout(this.timerId_);
        this.timerId_ = WindowProxy.getInstance().setTimeout(this.onIdleTimeout_.bind(this), IDLE_TIMEOUT_MS)
    }
    onIdleTimeout_() {
        if (this.state_ === State.RESULT_FINAL) {
            return
        }
        if (this.finalResult_) {
            this.onFinalResult_();
            return
        }
        this.voiceRecognition_.abort();
        this.onError_(Error$1.NO_MATCH)
    }
    resetErrorTimer_(duration) {
        WindowProxy.getInstance().clearTimeout(this.timerId_);
        this.timerId_ = WindowProxy.getInstance().setTimeout(( () => {
            this.$.dialog.close()
        }
        ), duration)
    }
    onAudioStart_() {
        this.resetIdleTimer_();
        this.state_ = State.AUDIO_RECEIVED
    }
    onSpeechStart_() {
        this.resetIdleTimer_();
        this.state_ = State.SPEECH_RECEIVED;
        this.animateVolume_()
    }
    onResult_(e) {
        this.resetIdleTimer_();
        switch (this.state_) {
        case State.STARTED:
            this.onAudioStart_();
            this.onSpeechStart_();
            break;
        case State.AUDIO_RECEIVED:
            this.onSpeechStart_();
            break;
        case State.SPEECH_RECEIVED:
        case State.RESULT_RECEIVED:
            break;
        default:
            return
        }
        const results = e.results;
        if (results.length === 0) {
            return
        }
        this.state_ = State.RESULT_RECEIVED;
        this.interimResult_ = "";
        this.finalResult_ = "";
        const finalResult = results[e.resultIndex];
        if (finalResult.isFinal) {
            this.finalResult_ = finalResult[0].transcript;
            this.onFinalResult_();
            return
        }
        for (let j = 0; j < results.length; j++) {
            const result = results[j][0];
            if (result.confidence > RECOGNITION_CONFIDENCE_THRESHOLD) {
                this.finalResult_ += result.transcript
            } else {
                this.interimResult_ += result.transcript
            }
        }
        if (this.interimResult_.length > QUERY_LENGTH_LIMIT) {
            this.onFinalResult_()
        }
    }
    onFinalResult_() {
        if (!this.finalResult_) {
            this.onError_(Error$1.NO_MATCH);
            return
        }
        this.state_ = State.RESULT_FINAL;
        const searchParams = new URLSearchParams;
        searchParams.append("q", this.finalResult_);
        searchParams.append("gs_ivs", "1");
        const queryUrl = new URL("/search",loadTimeData.getString("googleBaseUrl"));
        queryUrl.search = searchParams.toString();
        recordVoiceAction(Action.QUERY_SUBMITTED);
        WindowProxy.getInstance().navigate(queryUrl.href)
    }
    onEnd_() {
        switch (this.state_) {
        case State.STARTED:
            this.onError_(Error$1.AUDIO_CAPTURE);
            return;
        case State.AUDIO_RECEIVED:
            this.onError_(Error$1.NO_SPEECH);
            return;
        case State.SPEECH_RECEIVED:
        case State.RESULT_RECEIVED:
            this.onError_(Error$1.NO_MATCH);
            return;
        case State.ERROR_RECEIVED:
        case State.RESULT_FINAL:
            return;
        default:
            this.onError_(Error$1.OTHER);
            return
        }
    }
    onError_(error) {
        chrome.metricsPrivate.recordEnumerationValue("NewTabPage.VoiceErrors", error, Object.keys(Error$1).length);
        if (error === Error$1.ABORTED) {
            return
        }
        this.error_ = error;
        this.state_ = State.ERROR_RECEIVED;
        this.resetErrorTimer_(getErrorTimeout(error))
    }
    animateVolume_() {
        this.micVolumeLevel_ = 0;
        this.micVolumeDuration_ = VOLUME_ANIMATION_DURATION_MIN_MS;
        if (this.state_ !== State.SPEECH_RECEIVED && this.state_ !== State.RESULT_RECEIVED) {
            return
        }
        this.micVolumeLevel_ = WindowProxy.getInstance().random();
        this.micVolumeDuration_ = Math.round(VOLUME_ANIMATION_DURATION_MIN_MS + WindowProxy.getInstance().random() * VOLUME_ANIMATION_DURATION_RANGE_MS);
        WindowProxy.getInstance().setTimeout(this.animateVolume_.bind(this), this.micVolumeDuration_)
    }
    getText_() {
        switch (this.state_) {
        case State.STARTED:
            return "waiting";
        case State.AUDIO_RECEIVED:
        case State.SPEECH_RECEIVED:
            return "speak";
        case State.RESULT_RECEIVED:
        case State.RESULT_FINAL:
            return "result";
        case State.ERROR_RECEIVED:
            return "error";
        default:
            return "none"
        }
    }
    getErrorText_() {
        switch (this.error_) {
        case Error$1.NO_SPEECH:
            return "no-speech";
        case Error$1.AUDIO_CAPTURE:
            return "audio-capture";
        case Error$1.NETWORK:
            return "network";
        case Error$1.NOT_ALLOWED:
        case Error$1.SERVICE_NOT_ALLOWED:
            return "not-allowed";
        case Error$1.LANGUAGE_NOT_SUPPORTED:
            return "language-not-supported";
        case Error$1.NO_MATCH:
            return "no-match";
        case Error$1.ABORTED:
        case Error$1.OTHER:
        default:
            return "other"
        }
    }
    getErrorLink_() {
        switch (this.error_) {
        case Error$1.NO_SPEECH:
        case Error$1.AUDIO_CAPTURE:
            return "learn-more";
        case Error$1.NOT_ALLOWED:
        case Error$1.SERVICE_NOT_ALLOWED:
            return "details";
        case Error$1.NO_MATCH:
            return "try-again";
        default:
            return "none"
        }
    }
    getMicClass_() {
        switch (this.state_) {
        case State.AUDIO_RECEIVED:
            return "listening";
        case State.SPEECH_RECEIVED:
        case State.RESULT_RECEIVED:
            return "receiving";
        default:
            return ""
        }
    }
}
customElements.define(VoiceSearchOverlayElement.is, VoiceSearchOverlayElement);
// Copyright 2023 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function checkTransparency(buffer) {
    const view = new DataView(buffer);
    return isTransparentPNG(view) || isTransparentBMP(view) || isTransparentWebP(view)
}
function getUint8FromView(view, offset) {
    try {
        return view.getUint8(offset)
    } catch {
        return null
    }
}
function getUint16FromView(view, offset) {
    try {
        return view.getUint16(offset)
    } catch {
        return null
    }
}
function getUint32FromView(view, offset) {
    try {
        return view.getUint32(offset)
    } catch {
        return null
    }
}
function isPNG(view) {
    return getUint32FromView(view, 0) === 2303741511 && getUint32FromView(view, 4) === 218765834
}
function isTransparentPNG(view) {
    if (!isPNG(view)) {
        return false
    }
    const type = getUint8FromView(view, 25);
    return type === 4 || type === 6
}
function isWebP(view) {
    return getUint32FromView(view, 0) === 1380533830 && getUint32FromView(view, 8) === 1464156752
}
function isTransparentWebP(view) {
    if (!isWebP(view)) {
        return false
    }
    const format = getUint8FromView(view, 15);
    return format === 88 || format === 76
}
function isBMP(view) {
    return getUint16FromView(view, 0) === 16973
}
function isTransparentBMP(view) {
    if (!isBMP(view)) {
        return false
    }
    return getUint16FromView(view, 28) === 50
}
// Copyright 2023 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const SUPPORTED_FILE_TYPES = ["image/bmp", "image/heic", "image/heif", "image/jpeg", "image/png", "image/tiff", "image/webp", "image/x-icon"];
const MIME_TYPE_TO_EXTENSION_MAP = new Map([["image/png", ".png"], ["image/webp", ".webp"], ["image/bmp", ".bmp"], ["image/heif", ".heif"], ["image/jpeg", ".jpg"], ["image/tiff", ".tif"], ["image/heic", ".heic"], ["image/x-icon", ".ico"]]);
const MAX_LONGEST_EDGE_PIXELS = 1e3;
const TRANSPARENCY_FILL_BG_COLOR = "#ffffff";
const JPEG_QUALITY = .4;
const DEFAULT_MIME_TYPE = "image/jpeg";
async function processFile(file, maxLongestEdgePixels=MAX_LONGEST_EDGE_PIXELS) {
    const image = await readImageFile(file);
    if (!image) {
        return {
            processedFile: file
        }
    }
    const originalImageWidth = image.width;
    const originalImageHeight = image.height;
    const hasTransparency = checkTransparency(await file.arrayBuffer());
    const blobInfo = await processImage(image, DEFAULT_MIME_TYPE, hasTransparency, maxLongestEdgePixels);
    if (!blobInfo || !blobInfo.blob) {
        return {
            processedFile: file,
            imageWidth: originalImageWidth,
            imageHeight: originalImageHeight
        }
    }
    const processedImage = blobInfo.blob;
    let imageWidth = blobInfo.imageWidth;
    let imageHeight = blobInfo.imageHeight;
    const lastDot = file.name.lastIndexOf(".");
    const fileName = `${lastDot > 0 ? file.name.slice(0, lastDot) : file.name}${MIME_TYPE_TO_EXTENSION_MAP.get(processedImage.type)}`;
    let processedFile = new File([processedImage],fileName,{
        lastModified: Date.now(),
        type: processedImage.type
    });
    if (processedFile.size > file.size) {
        processedFile = file;
        imageWidth = originalImageWidth;
        imageHeight = originalImageHeight
    }
    return {
        processedFile: processedFile,
        imageWidth: imageWidth,
        imageHeight: imageHeight
    }
}
async function readImageFile(file) {
    const dataUrl = await readAsDataURL(file);
    if (!dataUrl || dataUrl instanceof ArrayBuffer) {
        return null
    }
    return createImageFromDataUrl(dataUrl)
}
function processImage(image, mimeType, hasTransparency, maxLongestEdgePixels) {
    const [width,height] = getDimensions(image, maxLongestEdgePixels);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true
    });
    if (!context) {
        return null
    }
    if (hasTransparency) {
        fillBackground(context, canvas.width, canvas.height, TRANSPARENCY_FILL_BG_COLOR)
    }
    context.drawImage(image, 0, 0, width, height);
    return toBlob(canvas, mimeType, JPEG_QUALITY, width, height)
}
function getDimensions(image, maxLongestEdgePixels) {
    let width = image.width;
    let height = image.height;
    if (maxLongestEdgePixels && (width > maxLongestEdgePixels || height > maxLongestEdgePixels)) {
        const downscaleRatio = Math.min(maxLongestEdgePixels / width, maxLongestEdgePixels / height);
        width *= downscaleRatio;
        height *= downscaleRatio
    }
    return [Math.floor(width), Math.floor(height)]
}
function fillBackground(context, canvasWidth, canvasHeight, backgroundColor) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvasWidth, canvasHeight)
}
function toBlob(canvas, type, encodingCompressionRatio, imageWidth, imageHeight) {
    return new Promise((resolve => {
        canvas.toBlob((result => {
            if (result) {
                resolve({
                    blob: result,
                    imageWidth: imageWidth,
                    imageHeight: imageHeight
                })
            } else {
                resolve({
                    blob: null,
                    imageWidth: imageWidth,
                    imageHeight: imageHeight
                })
            }
        }
        ), type, encodingCompressionRatio)
    }
    ))
}
function readAsDataURL(file) {
    const fileReader = new FileReader;
    const promise = new Promise((resolve => {
        fileReader.onloadend = () => {
            resolve(fileReader.result)
        }
        ;
        fileReader.onerror = () => {
            resolve(null)
        }
    }
    ));
    fileReader.readAsDataURL(file);
    return promise
}
function createImageFromDataUrl(dataUrl) {
    const image = new Image;
    const promise = new Promise((resolve => {
        image.onload = () => {
            resolve(image)
        }
        ;
        image.onerror = () => {
            resolve(null)
        }
    }
    ));
    image.src = dataUrl;
    return promise
}
export {Action as A, BrowserCommandProxy as B, Command as C, isPNG as D, EventTracker as E, FocusOutlineManager as F, isWebP as G, HelpBubbleProxyImpl as H, I18nMixin as I, Error$1 as J, parseHtmlSubset as K, assertInstanceof as L, isRTL as M, NewTabPageProxy as N, isIOS as O, getDeepActiveElement as P, isWindows as Q, isMac as R, CrRippleMixin as S, SUPPORTED_FILE_TYPES as T, VoiceSearchOverlayElement as V, WindowProxy as W, assertNotReached as a, assert as b, getCss$d as c, skColorToRgba as d, debounceEnd as e, HelpBubbleController as f, getFaviconForPageURL as g, hasKeyModifiers as h, HELP_BUBBLE_DISMISSED_EVENT as i, HELP_BUBBLE_TIMED_OUT_EVENT as j, HelpBubbleClosedReason as k, getCss$6 as l, getCss$8 as m, recordVoiceAction as n, recordLoadDuration as o, hexColorToSkColor as p, getTrustedScriptURL as q, recordDuration as r, sanitizeInnerHtml as s, CrAutoImgElement as t, getTrustedHTML as u, processFile as v, recordOccurence as w, recordPerdecage as x, checkTransparency as y, isBMP as z};
