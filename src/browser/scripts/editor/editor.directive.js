
export var EditorMarkdownItComponent = function () {
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
                var htmlText = md.render(scope.$eval(attrs.markdown) || '');
                element.html(htmlText);
            }

            scope.$watch(attrs.markdown, renderMarkdown);
            renderMarkdown();
        }
    };
};