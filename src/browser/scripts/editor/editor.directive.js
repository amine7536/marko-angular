'use-strict';

var EditorMarkdownItComponent = function (coreService) {
    // Because highlight.js is a bit awkward at times
    var languageOverrides = {
        js: 'javascript',
        html: 'xml'
    };

    // HighlightJS
    //var hljs = window.hljs;


    // MarkDown-IT
    var md = markdownit({
        html: true,
        highlight: function (code, lang) {
            if (languageOverrides[lang]) lang = languageOverrides[lang];
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(lang, code).value;
                } catch (e) {
                }
            }
            return '';
        }
    }).use(markdownitFootnote);

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            function renderMarkdown() {

                var docbuffer = scope.$eval(attrs.markdown) || '';

                /**
                 *
                 * Keep ngModel in sync with currentBrowserWindow bufferdoc
                 *
                 * **/
                var browserWindow = coreService.browserWindow;
                browserWindow.bufferdoc.content = docbuffer;

                var htmlText = md.render(docbuffer);
                element.html(htmlText);
            }

            scope.$watch(attrs.markdown, renderMarkdown);
            renderMarkdown();
        }
    };
};

EditorMarkdownItComponent.$inject = ['coreService'];

export { EditorMarkdownItComponent };