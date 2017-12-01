// ==UserScript==
// @name        KissAnimeList
// @version     0.90.2
// @description Integrates MyAnimeList into various sites, with auto episode tracking.
// @author      lolamtisch@gmail.com
// @license 	CC-BY-4.0; https://creativecommons.org/licenses/by/4.0/legalcode
// @license 	MIT
// @supportURL  https://github.com/lolamtisch/KissAnimeList/issues
// @include     http://kissanime.ru/Anime/*
// @include     http://kissanime.to/Anime/*
// @include     http://kissanime.ru/BookmarkList
// @include     http://kissanime.to/BookmarkList
// @exclude     http://kissanime.ru/AnimeList*
//
// @include     http://kissmanga.com/manga/*
// @include     http://kissmanga.com/BookmarkList
// @exclude     http://kissmanga.com/MangaList*
//
// @include     https://myanimelist.net/anime/*
// @include     https://myanimelist.net/manga/*
// @include     https://myanimelist.net/animelist/*
// @include     https://myanimelist.net/anime.php?*id=*
// @include     https://myanimelist.net/manga.php?*id=*
//
// @include     https://www.masterani.me/anime/info/*
// @include     https://www.masterani.me/anime/watch/*
//
// @include     https://9anime.to/watch/*/*
// @include     /https?://9anime.to/watch/*/*/
//
// @include     https://9anime.is/watch/*/*
// @include     /https?://9anime.is/watch/*/*/
//
// @include     https://9anime.ru/watch/*/*
// @include     /https?://9anime.ru/watch/*/*/
//
// @include     http://www.crunchyroll.com/*
// @exclude     http://www.crunchyroll.com/videos*
// @exclude     http://www.crunchyroll.com/news*
// @exclude     http://www.crunchyroll.com/anime*
// @exclude     http://www.crunchyroll.com/forum*
// @exclude     http://www.crunchyroll.com/user*
// @exclude     http://www.crunchyroll.com/login*
// @exclude     http://www.crunchyroll.com/store*
// @exclude     http://www.crunchyroll.com/search*
// @exclude     http://www.crunchyroll.com/home*
// @exclude     http://www.crunchyroll.com/edit*
// @exclude     http://www.crunchyroll.com/acct*
// @exclude     http://www.crunchyroll.com/email*
// @exclude     http://www.crunchyroll.com/inbox*
// @exclude     http://www.crunchyroll.com/newprivate*
// @exclude     http://www.crunchyroll.com/outbox*
// @exclude     http://www.crunchyroll.com/pm*
// @exclude     http://www.crunchyroll.com/notifications*
// @exclude     http://www.crunchyroll.com/comics*
// @exclude     http://www.crunchyroll.com/order*
//
// @include     /https?://.*gogoanime\.tv/.*
// @exclude     /https?://.*gogoanime\.tv/.*\.html.*
// @exclude     /https?://.*gogoanime\.tv/genre/.*
// @exclude     /https?://.*gogoanime\.tv/sub-category/.*
// @include     /https?://.*gogoanime\.io/.*
// @exclude     /https?://.*gogoanime\.io/.*\.html*
// @exclude     /https?://.*gogoanime\.io/genre/.*
// @exclude     /https?://.*gogoanime\.io/sub-category/.*
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
