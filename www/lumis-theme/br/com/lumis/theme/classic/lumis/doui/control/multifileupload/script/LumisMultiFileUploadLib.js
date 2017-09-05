// $Revision: 15812 $ $Date: 2013-08-26 15:10:41 -0300 (Mon, 26 Aug 2013) $
var LumisMultiFileUploadLib = new LumisMultiFileUploadLib();

function LumisMultiFileUploadLib()
{
    var listOfId = "";
    var listOfName = "";
    var listOfFiles = "";
    var GUIDs = "";
    var files = "";
    
    var cancelImgPathForInnerHTML = "";

    this.listOfId = listOfId;
    this.listOfName = listOfName;
    this.listOfFiles = listOfFiles;
    this.GUIDs = GUIDs;
    this.files = files;
    
    this.deleteFile = deleteFile;
	this.getFiles = getFiles;
	this.localize = localize;
	this.addFileNameGuidMapping = addFileNameGuidMapping;
	this.getFileNameByGuid = getFileNameByGuid;
	this.addDynamicFields = addDynamicFields;
	this.initialize = initialize;
	this.deleteAddedFile = deleteAddedFile;
	this.initializeVersion = initializeVersion;

	
	var $_lumFileNameByGuid = new Array();
    var $_lumAddedFiles = new Array();
	
	/**
	 * Adds a file name-guid mapping.
	 * @param {String} id the id of the control.
	 * @param {String} guid the guid of the file.
	 * @param {String} fileName the file name.
	 */
	function addFileNameGuidMapping(id, guid, fileName)
	{
		var arr = $_lumFileNameByGuid[id];
		if(!arr)
		{
			arr = new Array();
			$_lumFileNameByGuid[id] = arr;
		}
		arr[guid] = fileName;
	}
	
	/**
	 * Returns the file name mapped by the given guid.
	 * @param {String} id the control id.
	 * @param {String} guid the file guid.
	 */
	function getFileNameByGuid(id, guid)
	{
		var arr = $_lumFileNameByGuid[id];
		if(!arr)
			return false;
		
		return arr[guid];
	}
	
	/**
	 * Returns whether the given array contains an element equal to the given item. 
	 * @param {String} item
	 * @param {Array} array
	 * @return whether the given array contains an element equal to the given item.
	 */
	function itemExistsInArray(item, array)
	{
		if(typeof array.indexOf == 'function')
		{
			return array.indexOf(item) != -1;
		}
		
		for(var i = 0; i < array.length; i++)
		{
			if(array[i] == item)
				return true;
		}
		return false;
	}
    
	/**
	 * Adds a file (file name) in the file names array.
	 * @param {String} id the control id.
	 * @param {String} fileName the file name.
	 */
    function addFile(id, fileName)
    {
    	var arr = $_lumAddedFiles[id];
    	if(!arr)
    	{
    		arr = new Array();
    		$_lumAddedFiles[id] = arr;
    	}
    	
		if(!itemExistsInArray(fileName, arr))
	    	arr.push(fileName);
    }
    
	/**
	 * Delete a file from the array of file names.
	 * @param {String} id the control id.
	 * @param {String} fileName the file name.
	 */
    function deleteFile(id, fileName)
    {
    	var arr = $_lumAddedFiles[id];
    	if(!arr)
    		return;
    	
		var newArray = new Array();
		for(var i = 0; i < arr.length; i++)
		{
			if(arr[i] == fileName)
				continue;
			newArray.push(arr[i]);
		}
		$_lumAddedFiles[id] = newArray;
    }
    
	/**
	 * Returns the list of added files of the given control.
	 * @param {String} id the control id.
	 * @return the list of added files of the given control.
	 */
    function getFiles(id)
    {
    	var arr = $_lumAddedFiles[id];
    	if(!arr)
    		arr = new Array();
    	return arr;
    }
	
	/**
	 * Clears the file names array of the given control.
	 * @param {String} id the control id.
	 */
	function clear(id)
	{
		$_lumAddedFiles[id] = null;
	}
	
	/**
	 * Localizes a string with the given parameters extracting the localized string from the given string table.
	 * @param {Object} stringId the string id.
	 * @param {Object} params the parameters.
	 * @param {Object} stringTable the string table.
	 */
	function localize(stringId, params, stringTable)
	{
		if (params == null)
		{
			// construct params by spliting stringId by ;
			var arrStringIds = stringId.split(";");
			params = new Array();
			for (var i=1; i<arrStringIds.length; i++)
				params[i-1] = arrStringIds[i];
			stringId = arrStringIds[0];
		}

		var localizedString = stringTable[stringId];
		if (localizedString == null)
			return stringId;

		for (var i = 0; i < params.length; i++)
		{
			var localizedTerm = stringTable[params[i]];
			if (localizedTerm == null)
				localizedTerm = params[i];
			localizedString = localizedString.replace(new RegExp("%" + (i+1), "gm"), localizedTerm);
		}	
		return localizedString;
	}
	
	
    /**
     * JQuery objects cache.
     */
    var $_lumJQObj = new Array();

	/**
	 * Caches the given JQuery object.
	 * @param selector the JQuery selector.
	 * @return the cached object.
	 */
	function cacheJQueryOjb(selector, array)
	{
		var obj = $(selector);
		array[selector] = obj;
		return obj;
	}
	
    /**
     * Gets JQuery objects and caches it.
     * @param selector the JQuery selector.
     * @return JQuery objects.
     */
	function getJQueryObj(selector, array)
	{
		if(!array)
			array = $_lumJQObj;
		var obj = array[selector];
		if(obj != null && obj != undefined)
			return obj;
		
		return cacheJQueryOjb(selector, array);
	}
	
	function clearJQueryObjCache()
	{
		$_lumJQObj = new Array();
	}
    
	function deleteAddedFile(id, inputHiddenElementMultiFileUploadListOfFilesAddedId, controlId)
	{
		// delete the added GUIDs;
		var value = getJQueryObj("#"+controlId+"_addedGUIDs").val();
		var arrValues = value.split(";");
		value = "";
		for(var x = 0; x<arrValues.length-1; x++)
		{
			if(arrValues[x].indexOf(id)<0)
			{
				value += arrValues[x] + ";";
			}
		}
		getJQueryObj("#"+controlId+"_addedGUIDs").val(value);

		// delete the added files;
		value = getJQueryObj("#"+inputHiddenElementMultiFileUploadListOfFilesAddedId).val();
		arrValues = value.split(";");
		value = "";
		for(var x = 0; x<arrValues.length-1; x++)
		{
			if(arrValues[x].indexOf(id)<0)
			{
				value += arrValues[x] + ";";
			}
		}
		getJQueryObj("#"+inputHiddenElementMultiFileUploadListOfFilesAddedId).val(value);
	}
	
	function addDynamicFields(id, formName, interfaceInstanceId, dynamicFieldId, elementContainer, inputHiddenElementCounterDynamicFields, prehref)
	{
		if (elementContainer.replace(id,"") != "")
		{
			var oldGUIDs = getJQueryObj("#"+id+"_addedGUIDs").val();
			getJQueryObj("#"+id+"_addedGUIDs").val(oldGUIDs+elementContainer.replace(id,"")+":"+getJQueryObj("#"+inputHiddenElementCounterDynamicFields).val()+";");
		}
		
		var tempDiv = document.createElement('div');
		tempDiv.id = "lumParentDynamicContentFields_" + dynamicFieldId + "_" + document.getElementById(inputHiddenElementCounterDynamicFields).value;
		var tempDivChildren = document.createElement('div');
		tempDivChildren.id = dynamicFieldId + "_" + document.getElementById(inputHiddenElementCounterDynamicFields).value;;
		tempDivChildren.innerHTML = '<img src="' + prehref + 'lumis/portal/client/images/Loading.gif" />';
		tempDiv.appendChild(tempDivChildren);
		document.getElementById(elementContainer).appendChild(tempDiv);

		document.getElementById(id+'_renderAction').value = 'false';
		document.forms[formName].elements['doui_renderAction'].value='none';
		document.forms[formName].elements['doui_renderControlId'].value=dynamicFieldId + "_" + document.getElementById(inputHiddenElementCounterDynamicFields).value;
		LumisPortal.onSubmitForm(formName, interfaceInstanceId, null, false,null, tempDiv.id );
		document.forms[formName].elements['doui_renderControlId'].value='';
		document.getElementById(inputHiddenElementCounterDynamicFields).value = Number(document.getElementById(inputHiddenElementCounterDynamicFields).value) + 1;
		document.getElementById(id+'_renderAction').value = 'true';
		return true;
	}
	
	function replaceInvalidCharacters(value)
	{
		var rExp = new RegExp("[^\\w\\d \\.\\-]","g");
		return value.replace(rExp,"_");
	}
	
	function createUploadify(id, cancelImgPath, folderPath, extensions, filesDesc, buttonImg, buttonText, formName, sii, fileId, lumUserSessionId, successMessage, errorMessage, prehref)
	{
		if(extensions == '')
			extensions = null;
		
		cancelImgPathForInnerHTML = cancelImgPath;
		getJQueryObj('#'+id).uploadify(
			{
			  'uploader'       : prehref+'lumis/doui/control/multifileupload/script/uploadify.swf',
			  'script'         : prehref+'lumis/doui/control/multifileupload/multiFileUpload.jsp',
			  'checkScript'    : prehref+'lumis/doui/control/multifileupload/multiFileUploadCheck.jsp',
			  'cancelImg'      : prehref+cancelImgPath,
			  'folder'         : folderPath,
			  'auto'           : true,
			  'multi'          : true,
			  'scriptData'	   : {'lumUserSessionId':lumUserSessionId,'fileId':fileId,'Cookie':document.cookie,'supportedType':'flash'},
			  'fileExt'        : extensions,
			  'fileDesc'       : filesDesc,
			  'hideButton'     : true,
			  'wmode'          : 'transparent',
			  'height'         : 16,
			  'buttonText'     : buttonText,
			  'queueID'        : 'queue_'+id,
			  'removeCompleted': false,
			  'onInit'		: function() 
			  	{
				  LumisMultiFileUploadLib.GUIDs = "";
				  LumisMultiFileUploadLib.files = "";
				  LumisMultiFileUploadLib.listOfFiles = "";
						reloadUploadify(id, id+'_multiFileUploadListOfFilesAdded','queue_'+id, successMessage, prehref);	
				},
			  'onSelect'	: function(event,ID,fileObj) 
			  	{
					 if (LumisMultiFileUploadLib.GUIDs != "")
					 {
						 LumisMultiFileUploadLib.GUIDs += ";";
						 LumisMultiFileUploadLib.files += ";"; 
					 }
					 fileObj.name = replaceInvalidCharacters(fileObj.name);
			  		addFile(id, fileObj.name);
					addFileNameGuidMapping(id, ID, fileObj.name);
				      var hash_fileName_ampersand_fileSize_semicolon = "#"+fileObj.name+"&"+fileObj.size+";";
				      
				      if (getJQueryObj("#"+id+"_multiFileUploadListOfFilesAdded").val().indexOf(hash_fileName_ampersand_fileSize_semicolon) != -1)
				      {
				       	 return false;
					   }
				      else
				      {
				    	  LumisMultiFileUploadLib.GUIDs += ID;		
				    	  LumisMultiFileUploadLib.files += fileObj.name;
				    	  LumisMultiFileUploadLib.listOfFiles += ID + hash_fileName_ampersand_fileSize_semicolon;
				      }
			    },
			  'onSelectOnce'	: function(event,data) 
			  {
				  var arrGUIDs = LumisMultiFileUploadLib.GUIDs.split(";");
				  var arrFiles = LumisMultiFileUploadLib.files.split(";");
				  var cont = 0;
			      for(cont = 0; cont < arrGUIDs.length; cont++)
			      {
			    	  if(arrGUIDs[cont]!="")
			    	  {
			    		  LumisMultiFileUploadLib.addDynamicFields(id, formName, sii,  id+'_dynamicFields', id+arrGUIDs[cont], id+'_numberOfAddedFiles', prehref);
			    	  }
			      }
			      LumisMultiFileUploadLib.GUIDs = "";    
			      LumisMultiFileUploadLib.files = "";	
			      getJQueryObj("#"+id+"_multiFileUploadListOfFilesAdded").val(getJQueryObj("#"+id+"_multiFileUploadListOfFilesAdded").val()+LumisMultiFileUploadLib.listOfFiles);
			      LumisMultiFileUploadLib.listOfFiles = "";
			    },
			  'onCancel'	: function(event,guid,fileObj,data) 
			  {
			    	LumisMultiFileUploadLib.deleteAddedFile(guid,id+'_multiFileUploadListOfFilesAdded',id);
					deleteFile(id,getFileNameByGuid(id, guid));
			    },
			  'onCheck'		: function(event,guid,fileObj,data) 
			  {
			    	return false;
			    },
			  'onComplete'  : function(event, guid, fileObj, response, data) 
			  {
			        var tempDiv = document.createElement('span');
			        $(tempDiv).addClass("cLumMultiFileUploadCompletedMessage");
			        $(tempDiv).html(" - "+successMessage);
					clearJQueryObjCache();
			        getJQueryObj("#"+id+guid+" .fileName").append(tempDiv);
			      },
			  'onClearQueue' : function(event) 
			  {
					  LumisMultiFileUploadLib.GUIDs = "";
					  LumisMultiFileUploadLib.files = "";
					  LumisMultiFileUploadLib.listOfFiles = "";
			    	getJQueryObj("#"+id+"_addedGUIDs").val("");
			    	getJQueryObj("#"+id+"_multiFileUploadListOfFilesAdded").val("");
					clear(id);
			    },
				'onError' : function(event,ID,fileObj,errorObj) 
				{
					var upload = getJQueryObj("#" + id + ID);
					upload.find('.percentage').text(errorMessage);
					upload.find('.uploadifyProgress').hide();
					upload.addClass('uploadifyError');
					upload.addClass('uploadifyError' + id);
					return false;
				}
			});
	}
	
	function reloadUploadify(idContainer, inputHiddenElementOfAddedFiles, queueId, successMessage, prehref)
	{
		if (getJQueryObj("#"+inputHiddenElementOfAddedFiles).val() != "" && getJQueryObj("#"+inputHiddenElementOfAddedFiles).val() != undefined)
		{
			listOfFiles = getJQueryObj("#"+inputHiddenElementOfAddedFiles).val();
			// rebuild the content of the uploadify queue list
			var arrFiles = getJQueryObj("#"+inputHiddenElementOfAddedFiles).val().split(";");
			var arrGUIDs = getJQueryObj("#"+idContainer+"_addedGUIDs").val().split(";");
 		    var cont = 0;
	        for(cont = 0; cont < arrFiles.length; cont++)
	        {
	        	if(arrFiles[cont]!="")
	        	{
		        	var arrItens = arrFiles[cont].split("#");
		        	var id = arrItens[0];
		        	
		        	var arrNameAndSize =arrItens[1].split("&");
		        	var name = arrNameAndSize[0];
		        	
		        	var size = arrNameAndSize[1];
		        	var formatedSize = calculateSize(size);
					var item = document.createElement('div');
					item.id = idContainer + id;
					if (name.length > 20)
					{
						name = name.substr(0,20) + "...";
					}
					
					item.innerHTML ='<div class="cancel"><a href="javascript:jQuery(\'#'+idContainer+'\').uploadifyCancel(\''+ id +'\')">' +
									'<img border="0" src="'+ prehref+cancelImgPathForInnerHTML +'" /></a>' +
									'</div><span class="fileName">' + name + ' (' + formatedSize + ' )</span><span class="cLumMultiFileUploadCompletedMessage" style="display:inline !important;"> - '+successMessage+'</span>';
			  		getJQueryObj("#"+queueId).append(item);
					getJQueryObj("#"+item.id).addClass("uploadifyQueueItem completed");
					// find the hidden into the main DIV that stores all sub
					// controls.
					var idDynamicSubControls = arrGUIDs[cont].replace(id+":","");
					getJQueryObj("#"+item.id).append(getJQueryObj("#"+idContainer+"_dynamicFields_"+idDynamicSubControls));
	        	}
	        }
		}
	}
	
	function createUploadFileHTML5(id, cancelImgPath, folderPath, extensions, filesDesc, buttonImg, buttonText, formName, sii, fileId, lumUserSessionId, prehref)
	{
		$(function () 
			{
		    'use strict';
		    if(extensions == null || extensions == undefined)
		    	extensions = "";
		    	
		    extensions = extensions.replace(/[\*\.]/g,"").replace(/;/g,"|");
		    var acceptedTypes;
		    if(extensions != '')
		    	acceptedTypes = new RegExp("\.("+extensions+")$");
		    else
		    	acceptedTypes = /.+/;
		    
			// Initialize the jQuery File Upload widget:
		    getJQueryObj('#'+id+'_fileupload').fileupload(
		    {
				autoUpload: true,
				sequentialUploads: true,
				forceIframeTransport: false,
				replaceFileInput: true,
				previewAsCanvas: false,
				acceptFileTypes:acceptedTypes,
				url: prehref+"lumis/doui/control/multifileupload/multiFileUpload.jsp",
	            uploadTemplate: getJQueryObj('#'+id+'_template-upload'),
	            downloadTemplate: getJQueryObj('#'+id+'_template-download'),
				formData: [{name: "folder" , value : folderPath}, {name : 'supportedType', value : 'HTML5'}, {name : 'lumUserSessionId', value : lumUserSessionId}],
	            
				add: function (e, data) 
				{
	                var that = $(this).data('fileupload');
	                var files = data.files;
	                for (var x = 0; x<files.length;x++)
	                {
		                var isValidated = that._hasError(files[x]);
						var name = files[x].name;
		                var fileExistsOnTheList = getJQueryObj("#"+id+"_multiFileUploadListOfFilesAdded").val().indexOf(name+'&'+files[x].size);
		                if (isValidated || fileExistsOnTheList != -1)
		                {
		                	data.files.splice(x,1);
		                }
	                }
	                if (files.length < 1)
	                {
	                	return false;
	                }
	                that._adjustMaxNumberOfFiles(-data.files.length);
	                data.isAdjusted = true;
	                data.isValidated = true;
	                data.context = that._renderUpload(data.files)
						.appendTo($(this).find('.files')).fadeIn(function () 
	                	{
	                        // Fix for IE7 and lower:
	                        $(this).show();
	                    }).data('data', data);
	                if ((that.options.autoUpload || data.autoUpload) && data.isValidated) 
	                {
	                    data.jqXHR = data.submit();
	                }
	            },
	            // Callback for the start of each file upload request:
	            send: function (e, data) 
	            {
	                if (!data.isValidated) 
	                {
	                    var that = $(this).data('fileupload');
	                    if (!data.isAdjusted) 
	                    {
	                        that._adjustMaxNumberOfFiles(-data.files.length);
	                    }
	                    if (!that._validate(data.files)) 
	                    {
	                        return false;
	                    }
	                }
	                if (data.context && data.dataType && 
							data.dataType.substr(0, 6) === 'iframe') 
	                {
	                    // Iframe Transport does not support progress events.
	                    // In lack of an indeterminate progress bar, we set
	                    // the progress to 100%, showing the full animated bar:
	                    data.context.find('.ui-progressbar').progressbar(
	                        'value',
	                        parseInt(100, 10)
	                    );
	                }
	            },
           
	            done: function (e, data) 
	            {
	                var that = $(this).data('fileupload');
	                if (data.context) 
	                {
	                    data.context.each(function (index) 
	                    {
	                        var file = ($.isArray(data.result) &&
	                                data.result[index]) || {error: 'emptyResult'};
	                        if (file.error) 
	                        {
	                            that._adjustMaxNumberOfFiles(1);
	                        }
							addFileNameGuidMapping(id, file.GUID, file.name);
							addFile(id, file.name);
	                        $(this).fadeOut(function () 
	                        		{
	                            that._renderDownload([file])
	                                .css('display', 'none')
	                                .replaceAll(this)
	                                .fadeIn(function () 
	                                		{
	                                    // Fix for IE7 and lower:
	                                    $(this).show();
	            				    	if(document.getElementById(id+file.GUID)!=null)
	            				    	{
	            				    		var oldValue = getJQueryObj("#"+id+"_multiFileUploadListOfFilesAdded").val();
	            				    		oldValue += file.GUID + "#"+file.name+"&"+file.size+";";
	            				    		getJQueryObj("#"+id+"_multiFileUploadListOfFilesAdded").val(oldValue);
	            				    		LumisMultiFileUploadLib.addDynamicFields(id, formName, sii,  id+'_dynamicFields', id+ file.GUID, id+'_numberOfAddedFiles', prehref);
	            				    	}
	            				    });
	                        });
	                    });
	                } 
	                else 
	                {
	                    that._renderDownload(data.result)
	                        .css('display', 'none')
	                        .appendTo($(this).find('.files'))
	                        .fadeIn(function () 
	                        		{
	                            // Fix for IE7 and lower:
	                            $(this).show();
	                        });
	                }
	            },
	            drop: function (e, data) 
	            {
	            	getJQueryObj('#'+id+'_fileupload').fileupload('add', data.files);
	            }
	     });
    		reloadUploadFileHTML5(id, id+'_multiFileUploadListOfFilesAdded','queue_'+id);

		    // Load existing files:
		    $.getJSON(getJQueryObj('#'+id+'_fileupload form').prop('action'), function (files) 
		    		{
		        var fu = getJQueryObj('#'+id+'_fileupload').data('fileupload');
		        fu._adjustMaxNumberOfFiles(-files.length);
		        fu._renderDownload(files)
		            .appendTo(getJQueryObj('#'+id+'_fileupload .files'))
		            .fadeIn(function () 
		            		{
		                // Fix for IE7 and lower:
		                $(this).show();
		            });
		    });

		    // Open download dialogs via iframes,
		    // to prevent aborting current uploads:
		    getJQueryObj('#'+id+'_fileupload .files a:not([target^=_blank])').live('click', function (e) 
		    		{
		        e.preventDefault();
		        $('<iframe style="display:none;"></iframe>')
		            .prop('src', this.href)
		            .appendTo('body');
		    });
		});
	}
	
	function reloadUploadFileHTML5(idContainer, inputHiddenElementOfAddedFiles, queueId)
	{
		if (getJQueryObj("#"+inputHiddenElementOfAddedFiles).val() != "" && getJQueryObj("#"+inputHiddenElementOfAddedFiles).val() != undefined)
		{
			listOfFiles = getJQueryObj("#"+inputHiddenElementOfAddedFiles).val();
			// rebuild the content of the uploadify queue list
			var arrFiles = getJQueryObj("#"+inputHiddenElementOfAddedFiles).val().split(";");
			var arrGUIDs = getJQueryObj("#"+idContainer+"_addedGUIDs").val().split(";");
 		    var cont = 0;
 		    
	        for(cont = 0; cont < arrFiles.length; cont++)
	        {
	        	if(arrFiles[cont]!="")
	        	{
		        	var arrItens = arrFiles[cont].split("#");
		        	var id = arrItens[0];
		        	
		        	var arrNameAndSize =arrItens[1].split("&");
		        	var name = arrNameAndSize[0];
		        	
		        	var size = Number(arrNameAndSize[1]);
		        	var sizeInKB = calculateSize(size);
		        	// format xxx.xx
		        	var values = [{ GUID: id, name: name, sizef: sizeInKB}];

		        	$.tmpl( getJQueryObj("#"+idContainer+"_template-download"), values ).appendTo("#"+queueId);

		        	var idDynamicSubControls = arrGUIDs[cont].replace(id+":","");
					getJQueryObj("#"+idContainer+id).append(getJQueryObj("#"+idContainer+"_dynamicFields_"+idDynamicSubControls));
	        	}
	        }
		}
	}
	
	function calculateSize(size)
	{
        if (Number(size) >= 1000000000) 
        {
            return (Number(size) / 1000000000).toFixed(2) + ' GB';
        }
        if (Number(size) >= 1000000) 
        {
            return (Number(size) / 1000000).toFixed(2) + ' MB';
        }
        return (Number(size) / 1000).toFixed(2) + ' KB';
	}
	
	function initialize(id, cancelImgPath, folderPath, extensions, filesDesc, buttonImg, buttonText, formName, sii, fileId, lumUserSessionId, validateMultiUploadFormFunction, successMessage, errorMessage, prehref)
	{
		clear(id);
		if (Modernizr.input.multiple && (getJQueryObj("#"+id+"_supportedType").val() == "html5" || getJQueryObj("#"+id+"_supportedType").val() == "") )
		{
			getJQueryObj("#container_"+id).html(getJQueryObj("#"+id+"_template-fileupload").html());
			clearJQueryObjCache();
			getJQueryObj("#"+id+"_supportedType").val("html5");
			createUploadFileHTML5(id, cancelImgPath, folderPath, extensions, filesDesc, buttonImg, buttonText, formName, sii, fileId, lumUserSessionId, prehref);
		}
		else if(FlashDetect.versionAtLeast(9, 0, 24)&& (getJQueryObj("#"+id+"_supportedType").val() == "flash" || getJQueryObj("#"+id+"_supportedType").val() == "") )
		{
			getJQueryObj("#container_"+id).html(getJQueryObj("#"+id+"_template-uploadify").html());
			clearJQueryObjCache();
			getJQueryObj("#"+id+"_supportedType").val("flash");
			createUploadify(id, cancelImgPath, folderPath, extensions, filesDesc, buttonImg, buttonText, formName, sii, fileId, lumUserSessionId, successMessage, errorMessage, prehref);
			var height = 28;//$("#"+id+"_multiFileUploadAddButtonFlash").outerHeight(true);
			var width = 80;//$("#"+id+"_multiFileUploadAddButtonFlash").outerWidth(true);
			var pos = $("#"+id+"_multiFileUploadAddButtonFlash").position();
			setTimeout("$('#"+id+"Uploader').css({'position':'absolute','top':'"+pos.top+"px','left':'"+pos.left+"px','height':'"+height+"px','width':'"+width+"px','z-index':'9999'})",10);
			var addButton = $("#" + id + "_multiFileUploadAddButtonFlash");
			var posAddButton = addButton.position();
			setTimeout("$('#" + id + "_multiFileUploadClearButtonFlash').css({'position':'absolute','top':'"+posAddButton.top+"px','left':'"+(posAddButton.left + 83)+"px'})",0);
		}
		else
		{
			getJQueryObj("#container_"+id).html(getJQueryObj("#"+id+"_template-html4").html());
			clearJQueryObjCache();
			getJQueryObj("#"+id+"_numberOfAddedFiles").val("0");
			getJQueryObj("#"+id+"_dynamicFields_0").remove();
			getJQueryObj("#"+id+"_supportedType").val("html4");
			getJQueryObj("#"+id).change(function()
					{
				clear(id);
				addFile(id, $(this).val());
				getJQueryObj("#"+id+"_multiFileUploadListOfFilesAdded").val("#"+$(this).val()+"&;");
				if (getJQueryObj("#"+id+"_numberOfAddedFiles").val() == "0")
				{
					LumisMultiFileUploadLib.addDynamicFields(id, formName, sii,  id+'_dynamicFields', "inputFileContainer_"+id, id+'_numberOfAddedFiles', prehref);
				}
			});
		}
		if (!Modernizr.input.multiple)
		{
			getJQueryObj("#"+id+"_multiFileUploadLinkHTML5Version").css("display","none");
		}
		if(!FlashDetect.versionAtLeast(9, 0, 24))
		{
			getJQueryObj("#"+id+"_multiFileUploadLinkFlashVersion").css("display","none");
		}
	}

	function initializeVersion(id, cancelImgPath, folderPath, extensions, filesDesc, buttonImg, buttonText, formName, sii, fileId, lumUserSessionId, validateMultiUploadFormFunction, successMessage, errorMessage, version, prehref)
	{
		clear(id);
		if (getJQueryObj("#"+id+"_supportedType").val()!= version)
		{
			getJQueryObj("#"+id+"_numberOfAddedFiles").val("0");
			getJQueryObj("#"+id+"_addedGUIDs").val("");
			getJQueryObj("#"+id+"_multiFileUploadListOfFilesAdded").val("");
			if (version == "html5")
			{
				getJQueryObj("#container_"+id).html(getJQueryObj("#"+id+"_template-fileupload").html());
				clearJQueryObjCache();
				getJQueryObj("#"+id+"_supportedType").val("html5");
				createUploadFileHTML5(id, cancelImgPath, folderPath, extensions, filesDesc, buttonImg, buttonText, formName, sii, fileId, lumUserSessionId, prehref);
			}
			else if(version == "flash" && FlashDetect.versionAtLeast(9, 0, 24))
			{
				getJQueryObj("#container_"+id).html(getJQueryObj("#"+id+"_template-uploadify").html());
				clearJQueryObjCache();
				getJQueryObj("#"+id+"_supportedType").val("flash");
				createUploadify(id, cancelImgPath, folderPath, extensions, filesDesc, buttonImg, buttonText, formName, sii, fileId, lumUserSessionId, successMessage, errorMessage, prehref);
				var height = 28;//$("#"+id+"_multiFileUploadAddButtonFlash").outerHeight(true);
				var width = 80;//$("#"+id+"_multiFileUploadAddButtonFlash").outerWidth(true);
				var pos = $("#"+id+"_multiFileUploadAddButtonFlash").offset();
				setTimeout("$('#"+id+"Uploader').css({'position':'absolute','top':'" + pos.top + "px','left':'" + pos.left + "px','height':'"+height+"px','width':'"+width+"px','z-index':'9999'})",10);
			}
			else if (version == "html4")
			{
				getJQueryObj("#container_"+id).html(getJQueryObj("#"+id+"_template-html4").html());
				clearJQueryObjCache();
				getJQueryObj("#"+id+"_numberOfAddedFiles").val("0");
				getJQueryObj("#"+id+"_dynamicFields_0").remove();
				getJQueryObj("#"+id+"_supportedType").val("html4");
				getJQueryObj("#"+id).change(function()
						{
					clear(id);
					addFile(id, $(this).val());
					getJQueryObj("#"+id+"_multiFileUploadListOfFilesAdded").val("#"+$(this).val()+"&;");
					if (getJQueryObj("#"+id+"_numberOfAddedFiles").val() == "0")
					{
						LumisMultiFileUploadLib.addDynamicFields(id, formName, sii,  id+'_dynamicFields', "inputFileContainer_"+id, id+'_numberOfAddedFiles', prehref);
					}
				});
			}
			if (!Modernizr.input.multiple)
			{
				getJQueryObj("#"+id+"_multiFileUploadLinkHTML5Version").css("display","none");
			}
			if(!FlashDetect.versionAtLeast(9, 0, 24))
			{
				getJQueryObj("#"+id+"_multiFileUploadLinkFlashVersion").css("display","none");
			}
		}
	}
}

function MultiFileUploadOptions(id, cancelImagePath, folderPath, extensions, filesDescription, buttonImage, formName, serviceInstaceId, lumUserSessionId, fileId, validateMultiUploadFormFunction, successMessage, errorMessage, prehref)
{
	 this.id = id;
	 this.cancelImagePath = cancelImagePath;
	 this.folderPath = folderPath;
	 this.extensions = extensions;
	 this.filesDescription = filesDescription;
	 this.buttonImage = buttonImage;
	 this.formName = formName;
	 this.serviceInstaceId = serviceInstaceId;
	 this.lumUserSessionId = lumUserSessionId;
	 this.fileId = fileId;
	 this.validateMultiUploadFormFunction = validateMultiUploadFormFunction;
	 this.successMessage = successMessage;
	 this.errorMessage = errorMessage;
	 this.prehref = prehref;
}	