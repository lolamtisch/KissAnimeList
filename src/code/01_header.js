// ==UserScript==
// @name        KissAnimeList
// @version     0.91.4
// @description Integrates MyAnimeList into various sites, with auto episode tracking.
// @author      lolamtisch@gmail.com
// @license 	CC-BY-4.0; https://creativecommons.org/licenses/by/4.0/legalcode
// @license 	MIT
// @supportURL  https://github.com/lolamtisch/KissAnimeList/issues
// @homepageURL https://github.com/lolamtisch/KissAnimeList
// @iconURL     https://raw.githubusercontent.com/lolamtisch/KissAnimeList/dev/Screenshots/KAL_Logo.png
// @downloadURL https://greasyfork.org/scripts/27564-kissanimelist/code/KissAnimeList.user.js
// @updateURL	https://greasyfork.org/scripts/27564-kissanimelist/code/KissAnimeList.meta.js
//
// @include     /^https?:\/\/kissanime\.ru\/(Anime\/|BookmarkList)/
// @include     /^https?:\/\/kissanime\.to\/(Anime\/|BookmarkList)/
//
// @include     /^https?:\/\/kissmanga\.com\/(manga\/|BookmarkList)/
//
// @include     /^https?:\/\/myanimelist.net\/((anime(list)?|manga)(.php?id=|\/)|character|people|search)/
//
// @include     /^https?://www.masterani.me\/anime\/(info|watch)\//
//
// @include     /^https?:\/\/9anime\.to\/watch\//
// @include     /^https?:\/\/9anime\.is\/watch\//
// @include     /^https?:\/\/9anime\.ru\/watch\//
// @include     /^https?:\/\/9anime\.ch\/watch\//
//
// @include     /^https?:\/\/(www\.)?crunchyroll.com\//
// @exclude     /^https?:\/\/(www\.)?crunchyroll.com\/($|acct|anime|comics|edit|email|forum|home|inbox|library|login|manga|newprivate|news|notifications|order|outbox|pm|search|store|user|videos)/
//
// @include     /^https?:\/\/(w+.?\.)?gogoanime\.tv\/([^/]+$|category\/)/
// @include     /^https?:\/\/(w+.?\.)?gogoanime\.io\/([^/]+$|category\/)/
// @exclude     /^https?:\/\/(w+.?\.)?gogoanime\.(tv|io)\/(.*.html|anime-List)/
//
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @resource    materialCSS https://code.getmdl.io/1.3.0/material.indigo-pink.min.css
// @resource    materialFont https://fonts.googleapis.com/icon?family=Material+Icons
// @resource    materialjs https://code.getmdl.io/1.3.0/material.min.js
// @resource    simpleBarCSS https://unpkg.com/simplebar@latest/dist/simplebar.css
// @resource    simpleBarjs https://unpkg.com/simplebar@latest/dist/simplebar.js
//
// @connect     www.google.com
// @connect     ipv4.google.com
// @connect     myanimelist.net
// @connect     kissanimelist.firebaseio.com
// @connect     *
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @run-at      document-start
// @namespace https://greasyfork.org/users/92233
// ==/UserScript==

(function() {
    'use strict';
