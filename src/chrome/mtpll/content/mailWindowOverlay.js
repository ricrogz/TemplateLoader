function fillTemplateMenu() {
    var strBundleService = Components.classes["@mozilla.org/intl/stringbundle;1"].getService();
       strBundleService = strBundleService.QueryInterface(Components.interfaces.nsIStringBundleService);
    var extbundle = strBundleService.createBundle("chrome://mtpll/locale/mtpll.properties");
    var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsIFile);

    var filename;
    // Build the 9 items for the 9 extra templates
    for (i=1;i<10;i++) {
        filename = "";
        // If the pref of this index is equal to "", there is no item to build
        var btn = document.getElementById("BTLitem"+i);
        if (tempLoadPrefs.getPrefType("extensions.multitemplateloader.extra.file"+i) == 0) {
            document.getElementById("TLitem"+i).setAttribute("collapsed", "true");
            if (btn) btn.setAttribute("collapsed", "true");
            continue;
        }
        else {
            document.getElementById("TLitem"+i).removeAttribute("collapsed");
            if (btn) btn.removeAttribute("collapsed");
        }
        // If there is an error in nsIFile we skip this item
        try {
            var templatePath = tempLoadPrefs.getCharPref("extensions.multitemplateloader.extra.file"+i);
            if (templatePath.indexOf("http") < 0 && templatePath.indexOf("ftp") < 0) {
                file.initWithPath(templatePath);
                // Strip away the htm(l) extension
                filename = file.leafName.split(".htm");
                document.getElementById("TLitem"+i).label = i + ". " + filename[0];
                if (btn) btn.label = i + ". " + filename[0];
                if (! file.exists()) {
                    document.getElementById("TLitem"+i).setAttribute("style", "font-style: oblique");
                    document.getElementById("TLitem"+i).setAttribute("disabled", "true");
                    if (btn) {
                        btn.setAttribute("style", "font-style: oblique");
                        btn.setAttribute("disabled", "true");
                    }
                } else {
                    document.getElementById("TLitem"+i).removeAttribute("style");
                    document.getElementById("TLitem"+i).removeAttribute("disabled");
                    if (btn) {
                        btn.removeAttribute("style");
                        btn.removeAttribute("disabled");
                    }
                }
            } else {
                filename = templatePath.split("/");
                var filename_noext = filename[filename.length-1];
                filename_noext = filename_noext.substring(0,filename_noext.lastIndexOf("."));
                document.getElementById("TLitem"+i).label = i + ". [HTTP] "+filename_noext;
                if (btn) btn.label = i + ". [HTTP] "+filename_noext;
            }
        }
        catch(e) {
            document.getElementById("TLitem"+i).setAttribute("collapsed", "true");
            if (btn) btn.setAttribute("collapsed", "true");
        }
    }
}

function openExtraDialog(event) {
    openDialog("chrome://mtpll/content/extraOptions.xul", "", "chrome,modal");
    event.stopPropagation();
}

function NewMessageHTML() {
    var loadedFolder = GetFirstSelectedMsgFolder();
    // TB3 has not GetSelectedMessages function
    if ( typeof GetSelectedMessages  == "undefined" )
        var messageArray = gFolderDisplay.selectedMessageUris;
    else
        var messageArray = GetSelectedMessages();
    var mcType = Components.interfaces.nsIMsgCompType;
    ComposeMessage(mcType.New, 1, loadedFolder, messageArray);
}

function loadExternalFile(event, newCompose = true) {
    event.stopPropagation();
    runAsyncFilepicker(function(filePath) {
        if (filePath) {
            oldValue = tempLoadPrefs.getIntPref("extensions.multitemplateloader.load.extra");
            tempLoadPrefs.setCharPref("extensions.multitemplateloader.extra.file99", filePath);
            tempLoadPrefs.setIntPref("extensions.multitemplateloader.load.extra", 99);
            if (newCompose)
                NewMessageHTML();
            insertTemplate(99, false);
            tempLoadPrefs.setIntPref("extensions.multitemplateloader.load.extra", oldValue);
        }
    });
}

function runAsyncFilepicker(fn) {
    var nsIFilePicker = Components.interfaces.nsIFilePicker;
    var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
    fp.init(window, "Template", nsIFilePicker.modeOpen);
    fp.appendFilters(nsIFilePicker.filterHTML);
    fp.open(res => {
        if (res == nsIFilePicker.returnOK) {
            fn(fp.file.path);
        }
    });
}

function openTemplateDialog() {
    if (typeof GetSelectedFolderResource == "undefined")
        var msgFolder = gFolderDisplay.displayedFolder;
    else {
        var folderResource = GetSelectedFolderResource();
        var msgFolder = folderResource.QueryInterface(Components.interfaces.nsIMsgFolder);
    }
    var AccManager = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
    var identity = AccManager.getFirstIdentityForServer(msgFolder.server);
    if (! identity)
        identity = AccManager.defaultAccount.defaultIdentity;;
    window.openDialog("chrome://mtpll/content/mtpllOptions.xul", "", "chrome,modal,centerscreen", identity);
}

function ETLmigratePrefs() {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    if (! prefs.getBoolPref("extensions.multitemplateloader.migrate_prefs"))
        return;
    var branch = prefs.getBranch("extensions.multitemplateloader.");
    var oldPrefs = tempLoadPrefs.getChildList("template.", {});
    for (var i in oldPrefs) {
        var type = tempLoadPrefs.getPrefType(oldPrefs[i]);
        if (type == 32)
            branch.setCharPref(oldPrefs[i].replace("template.",""), prefs.getCharPref(oldPrefs[i]));
        else if (type == 64)
            branch.setIntPref(oldPrefs[i].replace("template.",""), prefs.getIntPref(oldPrefs[i]));
        else
            branch.setBoolPref(oldPrefs[i].replace("template.",""), prefs.getBoolPref(oldPrefs[i]));
        prefs.deleteBranch(oldPrefs[i]);
    }
    prefs.setBoolPref("extensions.multitemplateloader.migrate_prefs", false);
}

window.addEventListener("load", ETLmigratePrefs, false);
