/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {
	config.allowedContent = true;
	config.dialog_backgroundCoverColor =  'rgb(0, 0, 0)';
	config.baseFloatZIndex = 10005;
};

// Disable CKEditor from removing empty tags of any type
CKEDITOR.dtd.$removeEmpty = {};