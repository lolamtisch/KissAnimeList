// ==UserScript==
// @name        KissAnimeList
// @version     0.91.3
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
// @include     /http://kissanime.ru\/(Anime|BookmarkList)\/*/
// @include     /http://kissanime.to\/(Anime|BookmarkList)\/*/
// @exclude     /http:\/\/(kissanime\/.(ru|to)\/AnimeList*/
//
// @include     /http:\/\/kissmanga.com\/(manga|BookmarkList)\/*/
// @exclude     /http:/\/\kissmanga.com\/MangaList*/
//
// @include     /^https?:\/\/myanimelist.net\/(anime|animelist|character|manga|people|search)(\.php\?id=|\/).*/
//
// @include     /https:\/\/www.masterani.me/anime\/(info|watch)\/*/
//
// @include     /https?:\/\/9anime.to/watch\/*\/*\/?/
// @include     /https?:\/\/9anime.is/watch\/*\/*\/?/
// @include     /https?:\/\/9anime.ru/watch\/*\/*\/?/
//
// @include     /http://www.crunchyroll.com/*\/?/
// @exclude     /http://www.crunchyroll.com\/(acct|anime|comics|edit|email|forum|home|inbox|login|manga|newprivate|news|notifications|order|outbox|pm|search|store|user|videos)\*/
//
// @include     /http://www3.gogoanime.tv/.*/
// @include     /http://www3.gogoanime.io/.*/
// @exclude     /http://www3.gogoanime\.(tv|io)/.*\.html.*/
// @exclude     /http://www3.gogoanime\.(tv|io)\/(genre|sub-category)/.*/
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
