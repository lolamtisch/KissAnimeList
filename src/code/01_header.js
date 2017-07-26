// ==UserScript==
// @name        KissAnimeList
// @version     0.87.3
// @description Integrates MyAnimeList into diverse sites, with auto episode tracking.
// @author      lolamtisch@gmail.com
// @license     Creative Commons; http://creativecommons.org/licenses/by/4.0/
// @include     /https?://kissanime.ru/Anime/*/
// @include     /https?://kissanime.to/Anime/*/
// @include     /https?://kissanime.ru/BookmarkList
// @include     /https?://kissanime.to/BookmarkList
// @exclude     /https?://kissanime.ru/AnimeList*
//
// @include     /https?://kissmanga.com/manga/*/
// @include     /https?://kissmanga.com/BookmarkList
// @exclude     /https?://kissmanga.com/MangaList*
//
// @include     /https?://myanimelist.net/anime/*
// @include     /https?://myanimelist.net/anime/*/
// @include     /https?://myanimelist.net/manga/*
// @include     /https?://myanimelist.net/manga/*/
// @include     /https?://myanimelist.net/animelist/*/
//
// @include     /https?://www.masterani.me/anime/info/*/
// @include     /https?://www.masterani.me/anime/watch/*/
//
// @include     /https?://9anime.to/watch/*/*/
//
// @include     /http://www.crunchyroll.com/*/
// @exclude     /http://www.crunchyroll.com/videos*
// @exclude     /http://www.crunchyroll.com/news*
// @exclude     /http://www.crunchyroll.com/anime*
// @exclude     /http://www.crunchyroll.com/forum*
// @exclude     /http://www.crunchyroll.com/user*
// @exclude     /http://www.crunchyroll.com/login*
// @exclude     /http://www.crunchyroll.com/store*
// @exclude     /http://www.crunchyroll.com/search*
// @exclude     /http://www.crunchyroll.com/home*
// @exclude     /http://www.crunchyroll.com/edit*
// @exclude     /http://www.crunchyroll.com/acct*
// @exclude     /http://www.crunchyroll.com/email*
// @exclude     /http://www.crunchyroll.com/inbox*
// @exclude     /http://www.crunchyroll.com/newprivate*
// @exclude     /http://www.crunchyroll.com/outbox*
// @exclude     /http://www.crunchyroll.com/pm*
// @exclude     /http://www.crunchyroll.com/notifications*
// @exclude     /http://www.crunchyroll.com/comics*
// @exclude     /http://www.crunchyroll.com/order*
//
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @resource    materialCSS https://code.getmdl.io/1.3.0/material.indigo-pink.min.css
// @resource    materialFont https://fonts.googleapis.com/icon?family=Material+Icons
// @resource    materialjs https://code.getmdl.io/1.3.0/material.min.js
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
