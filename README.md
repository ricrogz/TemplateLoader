[![GitHub license](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://raw.githubusercontent.com/mmistakes/minimal-mistakes/master/LICENSE.txt)

# MultiTemplateLoader

A Thunderbird plugin to manage message templates. Forked from https://freeshell.de/~kaosmos/templateloader-en.html (which seems it is not longer in development)

Made it some time ago to easen email sending and replying (it is useful to be able to create templates and use them with a few keystrokes). I can't remember the features, but it seems that I added the possibility of choosing from multiple templates, and also I seem to recall that I implemented shorcut keys.

**Extension is now working in Thunderbird 45.2.0**

Link to official Mozilla addon page: https://addons.mozilla.org/es/firefox/addon/multitemplateloader/

# Main features

- A default template may be configured for each identity (email account) to be used as default template when composing a new message.
- Up to 9 templates may be configured for quick usage.
- HTML templates can be used from local files or from HTTP or FTP links.
- Shortcut keys for quick template loading.
- HTML templates may include fields for quoting text (replies, forwards), attachments and default cursor positioning.

# Documentation

(To be done)

You can select a default template for the identity under the "Tools" menu item. Also, be sure to add the "Templates" button to your compose message window toolbar, from there you will be able to configure and use the templates.

Templates should be in the form of html files or online links (http or ftp, according to original template's documentation). See the documentation for the original extension, either in the included file or the [web site of the original extension](https://freeshell.de/~kaosmos/templateloader-en.html) to know more about the format and the allowed options (like attachments).

Also, shortcut keys in the from of Control + F-num keys are available from the compose message window.

# TO DO

- Improve the documentation.
- Include sample template files.
