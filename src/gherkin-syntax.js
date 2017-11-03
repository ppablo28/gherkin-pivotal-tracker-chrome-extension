GherkinSyntax = (function () {
    var translations = {};

    function createButton(text) {
        let $button = $('<button><strong>' + text + '</strong></button>');

        $button.css({
            'width': 'auto',
            'background-color': 'rgb(238, 238, 238)',
            'font-weight': 'bolder',
            'outline': '0'
        });

        $button.hover(function () {
            $(this).css("background-color", "white")
        }, function () {
            $(this).css("background-color", "rgb(238, 238, 238)");
        });

        return $button;
    }

    function createFunctionButton($description) {
        return createButton(translations["function"])
            .css('margin-right', '5px')
            .addClass('gherkinFunction');
    }

    function createScenarioButton($description) {
        return createButton(translations["scenario"])
            .addClass('gherkinScenario');
    }

    function createActionButtons() {
        let $actionsBox = $('<div style=margin-top:10px></div>');

        let $functionBtn = createFunctionButton();
        let $scenarioBtn = createScenarioButton();

        $actionsBox.append($functionBtn);
        $actionsBox.append($scenarioBtn);

        return $actionsBox;
    }

    function bindSyntaxInsert($description, selector, text) {

        $(selector, $description).on('click', function () {
            let $textArea = $('textarea', $description);

            if ($textArea.length == 0) {
                let $renderedDescription = $('[data-aid=renderedDescription]', $description);
                $renderedDescription.click();
            }

            $textArea = $('textarea', $description);
            let textAreaContent = $textArea.val();
            $textArea.val(textAreaContent + text);

            $textArea.focus();
        });
    }

    function generateGherkinFunctionSyntax() {
        return ""
            + "**" + translations["function"] + ":** "
            + "\n"
            + "**" + translations["as"] + "** "
            + "\n"
            + "**" + translations["i_want_to"] + "** "
            + "\n"
            + "**" + translations["in_order_to"] + "** "
            + "\n";
    }

    function bindFunctionSyntaxInsert($description) {
        bindSyntaxInsert($description, '.gherkinFunction', generateGherkinFunctionSyntax());
    }

    function generateGherkinScenarioSyntax() {
        return "\n"
            + "**" + translations["scenario"] + ":** "
            + "\n"
            + "**" + translations["given"] + "** "
            + "\n"
            + "**" + translations["when"] + "** "
            + "\n"
            + "**" + translations["then"] + "** "
            + "\n";
    }

    function bindScenarioSyntaxInsert($description) {
        bindSyntaxInsert($description, '.gherkinScenario', generateGherkinScenarioSyntax());
    }

    function createGherkinActions(storyId) {
        let $actionsBox = createActionButtons();

        let $openedStory = $('.story[data-id=' + storyId + ']');
        let $description = $('.description', $openedStory);
        $description.append($actionsBox);

        bindFunctionSyntaxInsert($description);
        bindScenarioSyntaxInsert($description);
    }

    function loadTranslations(language) {
        if (language !== "pl") {
            language = "en";
        }

        let url = chrome.runtime.getURL('../resources/translations/' + language + ".json");
        $.get(url, function (gherkinTranslation) {
            translations = JSON.parse(gherkinTranslation);
        })
    }

    function renderGherkin() {
        loadTranslations("pl");

        $('#tracker').on('click', '.story .expander', function (e) {
            let $story = $(e.target).parents('.story');
            let storyId = $story.data('id');

            setTimeout(function () {
                createGherkinActions(storyId);
            }, 500);
        })
    }

    return {
        render: renderGherkin
    }
})();

$(document).ready(function () {
    GherkinSyntax.render();
});

