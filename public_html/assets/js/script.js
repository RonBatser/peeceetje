/*
    THEMES
 */
const NUMPAD_MAX = 999999;
const THEMES = ['blue', 'yellow', 'white'];
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const FETCH_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
const SHORT_MONTH_NAMES = [
    'jan.', 'feb.', 'maart', 'apr.', 'mei', 'juni',
    'juli', 'aug.', 'sept.', 'okt.', 'nov.', 'dec.'
];

(function core() {
    Number.prototype.isLeapYear = function () {
        return ~~(this) === this && this % 400 === 0 || this % 4 === 0 && this % 100 !== 0;
    };
})();

/*
    FRAMEWORK
 */
const FRAMEWORK_GENERIC = function () {
    let eventHandlers = {
        disableSubmits: function (e) {
            let $form = $(this);
            disableSubmitsIn($form);
        }
        ,
        enableSubmits: function (e) {
            let $form = $(this);
            removeSpinIcon($form.find('.submitting-button'));
            $form.find('button[type="submit"][data-disabled-on-submit]:disabled, input[type="submit"][data-disabled-on-submit]:disabled')
                .prop("disabled", false).removeAttr("data-disabled-on-submit")
        }
        ,
        checkDateGroupChange: function (e) {
            let $dateGroup = $(this).closest('.date-group');
            let $monthSelect = $dateGroup.find('.date-group-month');
            let month = parseInt($monthSelect.val());
            showAllDateDayOptions($dateGroup);
            if (!isNaN(month)) {
                let $daySelect = $dateGroup.find('.date-group-day');
                let days = defineDateDaysByMonth(month, $dateGroup);
                hideUnavailableDayOptions($daySelect, days);
            }
        }
        ,
        prepareNewEntity: function (e) {
            e.preventDefault();
            let $products = $('.table-products');
            let $template = $('#new-entity-template');
            if ($products.length > 0 && $template.length > 0) {
                let $newRow = $template.clone().removeAttr('id').addClass('entity new');
                let $id = $newRow.find('input[type="hidden"][name="id[]"]');
                if ($id.length > 0) {
                    let id = $id.val().replace('{id}', Date.now());
                    $id.val(id);
                }
                let $actionRow = $products.find('.action-row');
                if ($actionRow.length > 0) {
                    $actionRow.before($newRow);
                } else {
                    $products.append($newRow)
                }
                let $focus = $newRow.find('[data-focus]');
                if ($focus.length > 0) {
                    $focus.focus();
                    $focus.removeAttr('data-focus');
                }
            }
        }
        ,
        resetModal: function (e) {
            let $id = $(this).find('input[type="hidden"][name="id"]');
            if ($id.length > 0) {
                $id.removeAttr('value');
            }
            let $pasteValues = $(this).find('.paste-value');
            if ($pasteValues.length > 0) {
                $pasteValues.html('');
            }
        }
        ,
        sortEntities: function (e) {
            let $sortBySelect = $(this);
            let target = $sortBySelect.attr("data-target");
            let $target = $(target);
            if ($target.length > 0) {
                let value = $sortBySelect.val();
                let selector = 'option[value="' + value + '"]';
                let $option = $(selector);
                let order = $option.attr('data-order');
                if (!order) {
                    order = 'asc';
                }
                let holder = $option.attr('data-holder');
                if (!holder) {
                    holder = 'text'
                }
                let options = {
                    sortBy: $option.attr('data-target'),
                    orderFactor: (order === 'asc') ? 1 : -1,
                    type: $option.attr('data-type'),
                    holder: holder
                };
                performSortEntities($target, options);
            }
        }
        ,
        toggleSlideTarget: function (e) {
            e.preventDefault();
            let $this = $(this);
            let target = $this.attr('data-target');
            let $target = $(target);
            if ($target.length > 0) {
                $target.slideToggle();
                let $icon = $this.find('i');
                if ($icon.length > 0) {
                    $icon.toggleClass('fa-chevron-down').toggleClass('fa-chevron-up')
                }
            }
        }
        ,
        clearClosest: function (e) {
            e.preventDefault();
            let target = $(this).attr('data-target');
            let $target = $(this).closest(target);
            if ($target.length > 0) {
                $target.remove()
            }
        }
        ,
        selectAllText: function (e) {
            $(this).select()
        }
        ,
        onKeyDownPriceComponent: function (e) {
            if (e.key === ',' || e.key === '.' || e.key === '+' || e.key === '-') {
                e.preventDefault();
            }
        }
        ,
        focusPriceCents: function (e) {
            eventHandlers.onKeyDownPriceComponent(e);
            if (e.key === ',' || e.key === '.') {
                e.preventDefault();
                let $cents = $(this).closest('.price-group').find('.cents');
                if ($cents.length > 0) {
                    $cents.select()
                }
            }
        }

        ,
        onActionTriggerEvent: function (e) {
            let target = $(this).attr('data-trigger-target');
            let $target = $(target);
            let event = $(this).attr('data-trigger');
            if ($target.length > 0 && event) {
                $target.trigger(event);
            }
        }
        ,
        incrementNumberFieldValue: function (e) {
            e.preventDefault();
            let $group = $(this).closest('.number-group');
            let $number = $group.find('.number-field');
            let attribs = getNumberFieldAttributes($number);
            let value = attribs.value + attribs.step;
            if (attribs.max && value > attribs.max) {
                value = attribs.max;
            }
            $number.val(Math.round(value));
            $(this).closest('.table-responsive').trigger("change");
            $number.val(Math.round(value)).trigger("input");
        }
        ,
        decrementNumberFieldValue: function (e) {
            e.preventDefault();
            let $group = $(this).closest('.number-group');
            let $number = $group.find('.number-field');
            let attribs = getNumberFieldAttributes($number);
            let value = attribs.value - attribs.step;
            if (attribs.min && value < attribs.min) {
                value = attribs.min;
            }
            $number.val(Math.round(value));
            $(this).closest('.table-responsive').trigger("change");
            $number.val(Math.round(value)).trigger("input");
        }
        ,
        prepareModalEntity: function (e) {
            e.preventDefault();
            let $entity = $(this).closest('.entity');
            if ($entity.length > 0) {
                let $currentId = $entity.find('input[type="hidden"][name="id[]"]');
                let currentId = $currentId.val();
                let modalId = $(this).attr('data-target');
                let $modal = $(modalId);
                if ($modal.length > 0) {
                    let $id = $modal.find('input[type="hidden"][name="id"]');
                    $id.val(currentId);
                    copyEntityDetails($entity, $modal);
                }
            }
        }
        ,
        expandAndShowMore: function (e) {
            e.preventDefault();
            $(this).closest('.expandable-parent').find('.expandable').addClass("expanded");
            $(this).prop("hidden", true);
            $(this).siblings('.show-less-button').removeAttr("hidden");
        }
        ,
        collapseAndShowLess: function (e) {
            e.preventDefault();
            $(this).closest('.expandable-parent').find('.expanded').removeClass("expanded");
            $(this).prop("hidden", true);
            $(this).siblings('.show-more-button').removeAttr("hidden");
        }
        ,
        allowDrop: function (e) {
            e.preventDefault();
        }
        ,
        toggleDropFeedback: function (e) {
            e.stopPropagation();
            $(this).toggleClass("dropme");
        }
        ,
        removeDropMe: function (e) {
            e.stopPropagation();
            $(this).removeClass("dropme")
        }
        ,
        onWindowResizeCheckExpandables: function (e) {
            let $parent = $('.expandable-parent');
            let $collapsed = $parent.find('.expandable').not('.expanded');
            let $expanded = $parent.find('.expandable.expanded');
            $.each($collapsed, function (index, item) {
                let $item = $(item);
                checkCollapsedItemHeight($item);
            });
            $.each($expanded, function (index, item) {
                let $item = $(item);
                checkExpandedItemHeight($item);
            });
        }
    };

    function disableSubmitsIn($form) {
        if ($form[0].checkValidity()) {
            setTimeout(function () {
                addSpinIcon($form.find('button[type="submit"], input[type="submit"]').first());
                $form.find('button[type="submit"], input[type="submit"]').prop("disabled", true)
                    .attr("data-disabled-on-submit", "true")
            }, 1);
        }
    }

    function addSpinIcon($button) {
        $button.addClass("submitting-button");
        let $icon = $button.find("i");
        $icon.attr("data-old-class", $icon.attr("class"));
        if ($icon.length > 0) {
            let fw = $icon.hasClass("fa-fw");
            $icon.removeClass().addClass("fa fa-spinner fa-spin");
            if (fw) {
                $icon.addClass("fa-fw");
            }
        }
    }

    function removeSpinIcon($button) {
        $button.removeClass("submitting-button");
        let $icon = $button.find("i");
        let oldIconClass = $icon.attr("data-old-class");
        $icon.removeClass().addClass(oldIconClass);
    }

    function showAllDateDayOptions($dateGroup) {
        let $invisibleDays = $dateGroup.find('.date-group-day option').not(':visible');
        $invisibleDays.show();
    }

    function defineDateDaysByMonth(month, $dateGroup) {
        let days = DAYS_IN_MONTH[month - 1];
        let selectedYear = parseInt($dateGroup.find('.date-group-year').val());
        if (month === 2 && !isNaN(selectedYear) && !selectedYear.isLeapYear()) {
            days--;
        }
        return days;
    }

    function hideUnavailableDayOptions($daySelect, days) {
        resetDateDaysIfWrongDaySelected($daySelect, days);
        for (let i = days + 1; i <= 31; i++) {
            let daySelector = 'option[value=' + i + ']';
            $daySelect.find(daySelector).hide();
        }
    }

    function resetDateDaysIfWrongDaySelected($daySelect, days) {
        let selectedDay = parseInt($daySelect.val());
        if (!isNaN(selectedDay) && selectedDay > days) {
            $daySelect.val('');
        }
    }

    function performSortEntities($target, options) {
        if (options.type === 'string') {
            sortEntitiesByStringValue($target, options)
        } else if (options.type === 'int' || options.type === 'float' || options.type === 'date') {
            sortEntitiesByNumericValue($target, options)
        }
    }

    function sortEntitiesByStringValue($target, options) {
        let $entities = $target.find('.entity');
        $entities.sort(function (a, b) {
            let valueA = getEntityValue($(a), options);
            let valueB = getEntityValue($(b), options);
            if (valueA > valueB) {
                return options.orderFactor
            }
            if (valueA < valueB) {
                return -1 * options.orderFactor
            }
            return 0
        }).prependTo($target);
    }

    function sortEntitiesByNumericValue($target, options) {
        let $entities = $target.find('.entity');
        $entities.sort(function (a, b) {
            let valueA = getEntityValue($(a), options);
            let valueB = getEntityValue($(b), options);
            return options.orderFactor * (valueA - valueB)
        }).prependTo($target);
    }

    function getEntityValue($entity, options) {
        let value;
        if (options.holder === 'text') {
            value = $entity.find(options.sortBy).text()
        } else if (options.holder === 'input') {
            value = $entity.find(options.sortBy).val()
        } else if (options.holder === 'time') {
            value = $entity.find(options.sortBy).attr('data-datetime')
        } else if (options.holder === 'order') {
            value = $entity.attr('data-order')
        }
        if (options.type === 'string') {
            return value.toLowerCase()
        } else if (options.type === 'int') {
            return parseInt(value)
        } else if (options.type === 'float') {
            return parseFloat(value)
        } else if (options.type === 'date') {
            return value
        }
        return value;
    }

    function getNumberFieldAttributes($field) {
        let min = parseFloat($field.attr('min'));
        if (isNaN(min)) {
            min = undefined;
        }
        let step = parseFloat($field.attr('step'));
        if (isNaN(step)) {
            step = 1;
        }
        let max = parseFloat($field.attr('max'));
        if (isNaN(max)) {
            max = undefined;
        }
        let value = parseFloatOrDefault($field.val());
        return {
            min: min,
            step: step,
            max: max,
            value: value
        }
    }

    function copyEntityDetails($entity, $owner) {
        copyHtmlToHtml($entity, $owner);
        copyHtmlToValue($entity, $owner);
        copyValueToHtml($entity, $owner);
        copyValueToValue($entity, $owner);
        copyValueToSelect($entity, $owner);
    }

    function copyHtmlToHtml($entity, $owner) {
        let $items = $entity.find('[data-html-to-html]');
        $.each($items, function (index, item) {
            let $item = $(item);
            let target = $item.attr('data-html-to-html');
            let value = $item.html();
            let $target = $owner.find(target);
            if ($target.length > 0) {
                $target.html(value);
            }
        })
    }

    function copyHtmlToValue($entity, $owner) {
        let $items = $entity.find('[data-html-to-value]');
        $.each($items, function (index, item) {
            let $item = $(item);
            let target = $item.attr('data-html-to-value');
            let value = $item.html();
            let $target = $owner.find(target);
            if ($target.length > 0) {
                $target.val(value);
            }
        })
    }

    function copyValueToSelect($entity, $owner) {
        let $items = $entity.find('[data-value-to-select]');
        $.each($items, function (index, item) {
            let $item = $(item);
            let target = $item.attr('data-value-to-select');
            let value = $item.val();
            let $select = $owner.find(target);
            let $selected = $select.find('option:selected');
            if ($selected.length > 0) {
                $selected.removeAttr('selected');
            }
            if ($select.length > 0) {
                if (value) {
                    $select.val(value);
                }
            }
        })
    }

    function copyValueToHtml($entity, $owner) {
        let $items = $entity.find('[data-value-to-html]');
        $.each($items, function (index, item) {
            let $item = $(item);
            let target = $item.attr('data-value-to-html');
            let value = $item.val();
            let $target = $owner.find(target);
            if ($target.length > 0) {
                $target.html(value);
            }
        })
    }

    function copyValueToValue($entity, $owner) {
        let $items = $entity.find('[data-value-to-value]');
        $.each($items, function (index, item) {
            let $item = $(item);
            let target = $item.attr('data-value-to-value');
            let value = $item.val();
            let $target = $owner.find(target);
            if ($target.length > 0) {
                $target.val(value);
            }
        })
    }

    function checkCollapsedItemHeight($item) {
        let $parent = $item.closest('.expandable-parent');
        let height = $item.height();
        let scrollHeight = $item[0].scrollHeight;
        if (height < scrollHeight) {
            $parent.find('.show-more-button[hidden]').removeAttr("hidden");
        }
    }

    function checkExpandedItemHeight($item) {
        let $parent = $item.closest('.expandable-parent');
        let maxHeight = parseInt($item.attr("data-less"));
        let height = $item.height();
        if (!isNaN(maxHeight) && height > maxHeight) {
            $parent.find('.show-less-button[hidden]').removeAttr("hidden");
        }
    }

    function addEventListeners() {
        $('[data-toggle="tooltip"]').tooltip();
        $('form:not(.custom-submit)').on("submit", eventHandlers.disableSubmits);
        $('form').on("submitted", eventHandlers.enableSubmits);
        $('.date-group-month').on("input propertychange", eventHandlers.checkDateGroupChange);
        $('select.date-group-year').on("input propertychange", eventHandlers.checkDateGroupChange);
        $('.new-entity-button').on("click", eventHandlers.prepareNewEntity);
        $('.dynamic-modal').on("hidden.bs.modal", eventHandlers.resetModal);
        $('#sort-by').on("change", eventHandlers.sortEntities);
        $('[data-toggle="slide-toggle"]').on("click", eventHandlers.toggleSlideTarget);

        $(document).on("click", '.clear-closest', eventHandlers.clearClosest);
        $(document).on("click", '.price-group input', eventHandlers.selectAllText)
            .on("keydown", '.price-group input.euros', eventHandlers.focusPriceCents)
            .on("keydown", '.price-group input', eventHandlers.onKeyDownPriceComponent)
            .on("click", '[data-trigger]', eventHandlers.onActionTriggerEvent)
            .on("click", ".number-group .increment-button", eventHandlers.incrementNumberFieldValue)
            .on("click", ".number-group .decrement-button", eventHandlers.decrementNumberFieldValue)
            .on("click", '.delete-button, .edit-button', eventHandlers.prepareModalEntity)
            .on("click", '.show-more-button', eventHandlers.expandAndShowMore)
            .on("click", '.show-less-button', eventHandlers.collapseAndShowLess);

        $(window).on("resize", eventHandlers.onWindowResizeCheckExpandables)
    }

    let addDroppableListeners = function () {
        $('.droppable')
            .on("dragover", eventHandlers.allowDrop)
            .on("dragenter", eventHandlers.toggleDropFeedback)
            .on("dragleave", eventHandlers.toggleDropFeedback)
            .on("drop", eventHandlers.removeDropMe);
    };

    let extend = function () {
        addEventListeners();
        addDroppableListeners();
    };

    return {
        extend: extend,
        copyEntityDetails: copyEntityDetails,
        checkCollapsedItemHeight: checkCollapsedItemHeight,
        checkExpandedItemHeight: checkExpandedItemHeight
    }
};

/**
 * Numpad functionality
 */
(function numpad() {
    const eventHandlers = {
        applyValue: function (e) {
            let $thisNumpad = $(this).closest('.modal-numpad');
            let $display = $thisNumpad.find('.display');
            let $clearButton = $thisNumpad.find('.clear-button');
            let initial = $display.hasClass('initial');
            let value = parseInt($display.text());
            if (isNaN(value)) {
                value = 0;
            }
            if (initial) {
                value = parseInt($(this).text());
                $display.removeClass('initial');
            } else {
                value = parseInt(value + $(this).text());
            }
            if (isNaN(value)) {
                $clearButton.trigger("click");
            } else {
                if (value <= NUMPAD_MAX) {
                    $display.text(value)
                }
            }
        }
        ,
        applyBackspace: function (e) {
            let $thisNumpad = $(this).closest('.modal-numpad');
            let $display = $thisNumpad.find('.display');
            let value = parseInt($display.text());
            if (isNaN(value)) {
                value = 0;
            } else {
                value = ~~(value / 10)
            }
            $display.text(value)
        }
        ,
        clearNumpadScreen: function (e) {
            let $thisNumpad = $(this).closest('.modal-numpad');
            $thisNumpad.find('.display').text('0')
        }
        ,
        resetNumpad: function (e) {
            let $thisNumpad = $(this).closest('.modal-numpad');
            $thisNumpad.find('.display').addClass('initial').text('0');
            $thisNumpad.find('input[name="id"]').removeAttr("value");
            removeDispatchNumpadKeydownListenerFrom($thisNumpad);
        }
        ,
        addDispatchNumpadKeydownListener: function (e) {
            addDispatchNumpadKeydownListenerFrom($(this));
        }
        ,
        dispatchNumpadKeydown: function (e) {
            let $thisNumpad = $(this);
            if (isNumeric(e.key)) {
                let selector = '.value-button.button-' + e.key;
                $thisNumpad.find(selector).trigger("click").focus();
            } else if (e.key === 'c' || e.key === 'C') {
                $thisNumpad.find('.clear-button').trigger("click").focus();
            } else if (e.key === 'Backspace') {
                $thisNumpad.find('.backspace-button').trigger("click").focus()
            }
        }
    };

    function addDispatchNumpadKeydownListenerFrom($anyNumpad) {
        $anyNumpad.on("keydown", eventHandlers.dispatchNumpadKeydown);
    }

    function removeDispatchNumpadKeydownListenerFrom($anyNumpad) {
        $anyNumpad.off("keydown", eventHandlers.dispatchNumpadKeydown);
    }

    let $numpad = $('.modal-numpad');
    if ($numpad.length > 0) {
        $numpad.on("show.bs.modal", eventHandlers.addDispatchNumpadKeydownListener)
            .on("hidden.bs.modal", eventHandlers.resetNumpad);

        $numpad.find('.value-button').on("click", eventHandlers.applyValue);
        $numpad.find('.clear-button').on("click", eventHandlers.clearNumpadScreen);
        $numpad.find('.backspace-button').on("click", eventHandlers.applyBackspace);
    }
})();

/**
 * Fetch API Functionality
 * @type {module}
 */
const FETCH = {
    json: function (response) {
        return response.json();
    }
    ,
    post: function (data, options) {
        return fetch(options.action, {
            headers: FETCH_HEADERS,
            method: options.method,
            body: JSON.stringify(data)
        });
    }
    ,
    events: function () {
        const url = '/FacebookEvents';
        return fetch(url)
    }
};

/**
 * Cookies Functionality
 * @type {module}
 */
const COOKIES = {
    keys: {
        theme: 'theme'
    }
    ,
    age: 4/*years*/ * 365.25/*days*/
    ,
    set: function (cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    ,
    get: function (cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
};

/**
 * Storage Functionality
 * @type {module}
 */
const STORAGE = {
    isAvailable: function () {
        return (typeof Storage) !== void (0)
    }
    ,
    get: function (key) {
        let item = localStorage.getItem(key);
        return (item != null) ? JSON.parse(item) : item;
    }
    ,
    set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    ,
    remove: function (key) {
        localStorage.removeItem(key);
    }
    ,
    keys: {
        products: 'products',
        cart: 'cart'
    }
};

/**
 * General Functionality
 * @constructor
 */
const GENERAL = function () {
    let defaultTheme = THEMES[0];
    let eventHandlers = {
        applyTheme: function (e) {
            e.preventDefault();
            let theme = $(this).attr("data-theme");
            if (THEMES.includes(theme)) {
                if (navigator.cookieEnabled) {
                    COOKIES.set(COOKIES.keys.theme, theme, COOKIES.age);
                }
                setSelectedThemeActive(theme);
            }
        }
    };

   function loadThemeFromCookies() {
        let theme;
        if (navigator.cookieEnabled) {
            let cookieTheme = COOKIES.get(COOKIES.keys.theme);
            if (!cookieTheme) {
                COOKIES.set(COOKIES.keys.theme, theme, COOKIES.age);
            } else if (THEMES.includes(cookieTheme)) {
                theme = cookieTheme;
                cookieTheme = defaultTheme;
                COOKIES.set(COOKIES.keys.theme, defaultTheme, COOKIES.age);
            }
            setSelectedThemeActive(cookieTheme);
        }
        setSelectedThemeActive(theme);
   }

    function setSelectedThemeActive(theme) {
        let $body = $('body');
        $body.removeClass();
        if (theme && theme !== 'white') {
            $body.addClass(theme);
        }
        $('.theme-list-item.active').removeClass('active');
        let themeButtonSelector = '.theme-button.theme-' + theme;
        $('.theme-list').find(themeButtonSelector).closest('.theme-list-item').addClass('active');
    }

    function addEventListeners() {
        $('.theme-list').on("click", '.theme-list-item:not(.active) .theme-button', eventHandlers.applyTheme);
    }

    const init = function () {
        addEventListeners();
        loadThemeFromCookies();
    };

    return {
        init: init
    }
};

/**
 * Events Functionality
 * @returns {{init: init}}
 * @constructor
 */
const EVENTS = function () {
    const $events = $('#facebook-events');
    const Core = FRAMEWORK_GENERIC();

    const eventHandlers = {
        handleFetchFacebookEvents: function (data) {
            let $currentEvents = $('.current-events .events');
            let $archivedEvents = $('.archived-events .events');
            let archivedEvents = 0;
            data.forEach(function (event) {
                let endDate = new Date(event.end_time);
                let startDate = new Date(event.start_time);
                let currentDate = new Date();
                let currentEvent = endDate >= currentDate;
                let $eventArticle = buildEventArticle(event, startDate, currentEvent);
                if (currentEvent) {
                    insertEventInto($currentEvents, $eventArticle, true);
                } else {
                    if (archivedEvents <= 5) insertEventInto($archivedEvents, $eventArticle);
            archivedEvents++;
                }
                Core.checkCollapsedItemHeight($eventArticle.find('.expandable'));
            });
            handleAfterFetchEvents([$currentEvents, $archivedEvents]);
        }
        ,
        handleFetchFacebookEventsFailed: function (error) {
            console.error(error);
            let $currentEvents = $('.current-events .events');
            let $archivedEvents = $('.archived-events .events');
            handleAfterFetchEvents([$currentEvents, $archivedEvents]);
        }
    };


    function insertEventInto($events, $event, prepend) {
        if ($events.find('.event').length > 0) {
            if (prepend) {
                $events.prepend($('<hr>')).prepend($event);
            } else {
                $events.append($event).append($('<hr>'));
            }

        } else {
            $events.html($event);
        }
    }


    function handleAfterFetchEvents($eventHolders) {
        $eventHolders.forEach(function ($events) {
            $events.find('.before-fetch').remove();
            if ($events.find('.event').length > 0) {
                $events.find('.no-events').remove()
            } else {
                $events.find('.no-events').removeAttr("hidden")
            }
        });
    }

    function buildEventArticle(event, eventDate, currentEvent) {
        let $eventArticle = $('#event-template').clone().removeAttr("id").removeAttr("hidden");
        if (currentEvent) {
            $eventArticle.attr("data-less", "144")
        } else {
            $eventArticle.attr("data-less", "96")
        }
        let $eventDateAndTime = buildEventDateAndTime(eventDate, currentEvent);
        $eventArticle.find('.event-date').html($eventDateAndTime.date).append($eventDateAndTime.time);
        let $eventDetail = $eventArticle.find('.detail');
        let $eventLink = $eventDetail.find('.title');
        let href = $eventLink.attr("href") + event.id;
        $eventLink.attr("href", href).find('.name').text(event.name);
        let $paragraphs = splitEventDescription(event.description);
        $paragraphs.forEach(function ($p) {
            $eventDetail.find('.detail-text').append($p);
        });
        return $eventArticle;
    }

    function buildEventDateAndTime(eventDate, currentEvent) {
        let date = eventDate.getFullYear() + '-' + (eventDate.getMonth() + 1 + '').padStart(2, '0') + '-' + (eventDate.getDate() + '').padStart(2, '0');
        let time = (eventDate.getHours() + '').padStart(2, '0') + ':' + (eventDate.getMinutes() + '').padStart(2, '0');
        let datetime = date + ' ' + time;
        let $eventDay = $('<span class="day">').text(eventDate.getDate());
        let $eventMonth = $('<span class="month">').text(SHORT_MONTH_NAMES[eventDate.getMonth()].replace('.', ''));
        let dateClass = (currentEvent) ? "bg-primary" : "bg-secondary";
        return {
            date: $('<time class="badge-date">').addClass(dateClass).attr("datetime", date).html($eventDay).append($eventMonth),
            time: $('<time class="badge badge-md badge-dark">').attr("datetime", datetime).text(time)
        };
    }

    function splitEventDescription(description) {
        let $paragraphs = [];
        if (description) {
            let paragraphs = description.split(/[\r\n]{2,}/g);
            paragraphs.forEach(function (p) {
                let lines = p.split(/[\r\n]+/g);
                $paragraphs.push($('<p>').html(lines.join("<br>")))
            })
        }
        return $paragraphs;
    }

    function isAvailable() {
        return $events.length > 0
    }

    const init = function () {
        if (isAvailable()) {
            FETCH.events()
                .then(FETCH.json)
                .then(eventHandlers.handleFetchFacebookEvents)
                .catch(eventHandlers.handleFetchFacebookEventsFailed);
        }
    };

    return {
        init: init
    }
};

/**
 * Inventory Functionality
 * @returns {{init: init}}
 * @constructor
 */
const INVENTORY = function () {
    const $formInventory = $('#form-inventory');

    const eventHandlers = {
        updateInventory: function (e) {
            e.preventDefault();
            let $products = $('.table-products');
            if ($products.length > 0) {
                updateProducts($products)
            }
        }
        ,
        handleUpdateProductsFeedback: function (data) {
            $formInventory.trigger("submitted");
            let $products = $('.table-products');
            $products.find('.entity.recent').removeClass("recent");
            data.forEach(function (product) {
                let selector = 'input[name="id[]"][value="' + product.id + '"]';
                let $id = $(selector);
                if ($id.length > 0) {
                    let $productRow = $id.closest('.entity.new');
                    if (product.id !== product.newId) {
                        applyProductRow($productRow, product);
                    } else {
                        invalidateProductRow($productRow);
                    }
                }
            });
            $('#sort-by').trigger("change");
        }
    };

    function updateProducts($products) {
        let products = buildProducts($products);
        let options = getFormOptions($formInventory);
        FETCH.post(products, options)
            .then(FETCH.json)
            .then(eventHandlers.handleUpdateProductsFeedback)
            .catch(console.error)
    }

    function buildProducts($products) {
        let products = [];
        $.each($products.find('tbody tr.entity'), function (index, data) {
            let $productRow = $(data);
            let product = buildProductFrom($productRow);
            products.push(product);
        });
        return products;
    }

    function buildProductFrom($productRow) {
        let $id = $productRow.find('input[name="id[]"]');
        let id = 0;
        if ($id.length > 0) {
            id = $id.val();
            if (id.indexOf('new') !== 0) {
                id = parseIntOrDefault(id);
            }
        }
        let lastOrderDate = parseInt($productRow.find('.last-order-date').attr('datetime'));
        let name = $productRow.hasClass('new') ? $productRow.find('input[name="name[]"]').val() : $productRow.find('.name').text();
        let cents = $productRow.find('input.cents').val();
        let price = parseIntOrDefault($productRow.find('input.euros').val()) + parseIntOrDefault(cents) / Math.pow(10, cents.length);
        price = Math.round(price * 100) / 100;
        return {
            id: id,
            name: name,
            lastOrderDate: (!isNaN(lastOrderDate)) ? new Date(lastOrderDate) : null,
            count: parseIntOrDefault($productRow.find('input[name="count[]"]').val()),
            credits: parseIntOrDefault($productRow.find('input[name="credits[]"]').val()),
            costInCredits: parseIntOrDefault($productRow.find('input[name="cost-in-credits[]"]').val()),
            price: price
        }
    }


    function applyProductRow($productRow, product) {
        $productRow.removeClass("new").addClass("recent");
        $productRow.find('input[name="name[]"]').remove();
        $productRow.find('input[name="id[]"]').val(product.newId);
        let $name = $('<span class="name">').text(product.name);
        $productRow.find('th').append($name);
        let $deleteButton = $('#delete-button-template').clone().removeAttr("id").removeAttr("hidden");
        $productRow.find('input[name="price[]"]').val(product.price);
        $productRow.find('.action-cell').html($deleteButton);
        let lastOrderDate = new Date(product.lastOrderDate);
        let $lastOrderDate = $('<time class="badge badge-info last-order-date">')
            .attr({
                "data-datetime": lastOrderDate.getTime(),
                "datetime": lastOrderDate.getFullYear() + '-' + (lastOrderDate.getMonth() + 1 + '').padStart(2, '0') + '-' + (lastOrderDate.getDate() + '').padStart(2, '0')
            })
            .text(lastOrderDate.getDate() + ' ' + SHORT_MONTH_NAMES[lastOrderDate.getMonth()] + ' ' + lastOrderDate.getFullYear());
        $productRow.find('.date-cell').html($lastOrderDate);
    }

    function invalidateProductRow($productRow) {
        $productRow.find('input').not('[type="hidden"]').not('.is-invalid').addClass("is-invalid");
    }

    function isAvailable() {
        return $formInventory.length > 0
    }

    function addEventListeners() {
        $formInventory.on("submit", eventHandlers.updateInventory);
    }

    const init = function () {
        if (isAvailable()) {
            addEventListeners();
        }
    };

    return {
        init: init
    }
};

const MEMBERS = function () {
    const $membersTable = $('.table-users');

    const eventHandlers = {
        filterMembersList: function (e) {
            let $form = $(this).closest('form');
            let name = $form.find('input[name="username-or-firstname"]').val().trim().toLowerCase();
            let surname = $form.find('input[name="surname"]').val().trim().toLowerCase();
            let $membersTable = $('.table-users');
            let $members = $membersTable.find('.entity');
            if ($members.length > 0) {
                $.each($members, function (index, member) {
                    let $member = $(member);
                    let _username = $member.find('.username').text().toLowerCase();
                    let _firstname = $member.find('.firstname').text().toLowerCase();
                    let _surname = $member.find('.surname').text().toLowerCase();
                    let memberFound = (_username.indexOf(name) >= 0
                        || _firstname.indexOf(name) >= 0)
                        && _surname.indexOf(surname) >= 0;
                    if (memberFound && $member.is(":hidden")) {
                        $member.show()
                    } else if (!memberFound) {
                        $member.hide()
                    }
                });

                let $emptyRow = $membersTable.find('.empty-row');
                let visibleMembers = $membersTable.find('.entity:visible');
                toggleEmptyRow($emptyRow, visibleMembers.length === 0);
            }
        }
        ,
        resetMembersFilterAndSortingForm: function (e) {
            e.preventDefault();
            let $inputs = $('#form-filter-and-sorting input[type="text"]');
            $inputs.val('');
            $($inputs[0]).trigger('input');
            $('#sort-by').val('default').trigger("change");
        }
    };

    function toggleEmptyRow($emptyRow, show) {
        if (show && $emptyRow.hasClass('hidden')) {
            $emptyRow.removeClass('hidden')
        } else if (!show && !$emptyRow.hasClass('hidden')) {
            $emptyRow.addClass('hidden')
        }
    }

    function isAvailable() {
        return $membersTable.length > 0
    }

    function addEventListeners() {
        $('.members-filter-and-sorting input[name="username-or-firstname"], .members-filter-and-sorting input[name="surname"]')
            .on("input propertychange", eventHandlers.filterMembersList);
        $('#form-filter-and-sorting .reset-button').on("click", eventHandlers.resetMembersFilterAndSortingForm);
    }

    const init = function () {
        if (isAvailable()) {
            addEventListeners();
        }
    };

    return {
        init: init
    }
};

/**
 * Profile Functionality
 * @returns {{init: init}}
 * @constructor
 */
const PROFILE = function () {
    const eventHandlers = {
        changePassword: function (e) {
            e.preventDefault();
            let $form = $(this);
            if (passwordsMatch()) {
                setTimeout(function () {
                    disableSubmitsIn($form);
                }, 1);
                this.submit();
            }
        }
    };

    const passwordsMatch = function () {
        let $password = $("#new-password");
        let $confirm = $('#new-password-confirm');
        if ($password.val() !== $confirm.val()) {
            $password.addClass("is-invalid");
            $confirm.addClass("is-invalid");
            $("#invalid-new-password").removeAttr("hidden");
            $('#form-change-password').trigger("submitted");
            return false;
        }
        return true;
    };

    function isAvailable() {
        return true
    }

    function addEventListeners() {
        $('#form-change-password').on("submit", eventHandlers.changePassword);
    }

    const init = function () {
        if (isAvailable()) {
            addEventListeners();
        }
    };

    return {
        init: init
    }
};

/**
 * CashDesk functionality
 * @returns {{init: init}}
 * @constructor
 */
const CASHDESK = async function () {
    const $cashDesk = $('.desk');
    const $cart = $('#cart');
    const $orderForm = $('#form-order');
    const $username = $('#outputData');
    const $userCredits = $('#user-credits');
    const $applyOrderButton = $('.apply-order-button');
    const $finalizeOrderButton = $('.finalize-order-button');
    const $cartTable = $('.table-cart');
    const $creditsTable = $('.table-credits');
    const $orderlineContainers = $('.orderline-container');
    const $orderlineContainerTables = $orderlineContainers.find('.table');
    const $cartToolbar = $cart.find('.cart-toolbar');
    const $cartDetailsModal = $('#modal-cart-details');
    const $applyOrderModal = $('#modal-apply-order');
    const $productList = $('.product-list');
    const $numpad = $('#modal-numpad');
    const $saveNumpadButton = $numpad.find('.save-button');
    const $applyNumpadButton = $numpad.find('.apply-button');
    const $cartWrapper = $('#table-cart-wrapper');
    const $creditsWrapper = $('#table-credits-wrapper');
    const $userInfoModal = $('#modal-user-info');
    const $userInfoModalHeader = $userInfoModal.find('.modal-header');
    const $noUserInfoMessage = $userInfoModal.find('.no-user-info');
    const $userInfoMessage = $userInfoModal.find('.user-info');
    const $userInfoUsername = $userInfoMessage.find('.username');
    const $userInfoCredits = $userInfoMessage.find('.credits');
    const $grandTotalCredits = $cart.find('.grand-total-credits');
    const $grandTotalCreditsRow = $('#grand-total-row-credits');
    const Core = FRAMEWORK_GENERIC();

    const eventHandlers = {
        initNumpad: function (e) {
            let $entity = $(this).closest('.product');
            Core.copyEntityDetails($entity, $numpad);
        }
        ,
        addProductToCart: function (e) {
            e.preventDefault();
            let $product = $(this).closest('.product');
            let product = readProductInfo($product);
            addProductTo(product, $cartTable, $product);
        }
        ,
        addProductToCredits: function (e) {
            e.preventDefault();
            let $product = $(this).closest('.product');
            let product = readProductInfo($product);
            addProductTo(product, $creditsTable, $product);
        }
        ,
        resetCart: function (e) {
            e.preventDefault();
            clearCart();
            STORAGE.remove(STORAGE.keys.cart);
        }
        ,
        loadCartDetailsModal: function (e) {
            e.preventDefault();
            let $cart = $cartWrapper.find('.table-cart-body');
            let $credits = $creditsWrapper.find('.table-credits-body');
            $cartDetailsModal.find('.table-cart-wrapper').html($cart);
            $cartDetailsModal.find('.table-credits-wrapper').html($credits);
        }
        ,
        unloadCartDetailsModal: function (e) {
            let $cart = $cartDetailsModal.find('.table-cart-body');
            let $credits = $cartDetailsModal.find('.table-credits-body');
            if ($cart.length > 0) {
                $cartWrapper.html($cart);
                $creditsWrapper.html($credits);
            }
        }
        ,
        loadApplyOrderModal: function (e) {
            e.preventDefault();
            let $totalRow = $cart.find('.details-body .total-row:first').clone();
            $applyOrderModal.find('.modal-body').append($totalRow);
        }
        ,
        resetApplyOrderModal: function (e) {
            $username.val("").trigger("input");
            $userCredits.val("");
            $(this).modal("hide");
        }
        ,
        showApplyOrderModal: function (e) {
            e.preventDefault();
            $applyOrderModal.modal()
        }
        ,
        updateGrandTotalRow: function (e) {
            let $productRows = $(this).find('.entity');
            let grandTotals = calculateGrandTotalValues($productRows);
            updateGrandTotalValues(grandTotals, $(this));
            updateCartInStorage($(this));
        }
        ,
        checkUserInfo: function (e) {
            let userCredits = $userCredits.val();
            if (isNumeric(userCredits)) {
                validateUserInfo(parseIntOrDefault(userCredits));
            } else {
                resetUserInfo();
            }
        }
        ,
        closeAndKeepAlert: function (e) {
            e.preventDefault();
            let $alerts = $(this).closest('.alerts');
            $(this).closest('.alert').hide();
            $alerts.append($alert);
        }
        ,
        changeProductCount: function (e) {
            let $table = $(this).closest('.table');
            $table.trigger("change");
        }
        ,
        submitOrder: function (e) {
            e.preventDefault();
            let username = $(this).find('input[name="username"]').val();
            if (username) {
                const options = getFormOptions($(this));
                placeOrder(username, options);
            }
        }
        ,
        closeOrder: function (e) {
            $applyOrderModal.trigger("reset");
            clearCart();
            $('.alert.order-success:hidden').show();
        }
        ,
        checkOrderFormState: function (e) {
            let username = $(this).val().trim();
            setOrderFormState(username.length > 0);
        }
        ,
        handleFetchApplyOrderFeedback: function (data) {
            if (data.success) {
                $orderForm.trigger("submitted");
            } else {
                $('.alert.order-fail:hidden').show();
                STORAGE.set(STORAGE.keys.cart, data);
                $applyOrderModal.modal("hide");
                loadCartFromLocalStorage();
                showUserInfoModalIfInvalid(data);
            }
        }
        ,
        moveOneProduct: function (e) {
            e.preventDefault();
            const target = $(this).attr("data-target");
            const $target = $(target);
            const $origin = $(this).closest(".table");
            const $productRow = $(this).closest("tr");
            const $count = $productRow.find('input[name="count[]"]');
            const count = parseIntOrDefault($count.val());
            if (count > 1) {
                $count.val(count - 1).trigger("input");
            } else {
                $productRow.remove();
                $origin.trigger("change");
            }
            if (count >= 1) {
                let id = parseIntOrDefault($productRow.find('input[type="hidden"][name="id[]"]').val());
                let $product = findProductById(id);
                let product = readProductInfo($product, 1);
                addProductTo(product, $target, $product);
            }
        }
        ,
        handleDragProduct: function (e) {
            const dataString = getDataString();
            e.dataTransfer = e.originalEvent.dataTransfer;
            let $product = $(this);
            const product = readProductInfo($product);
            e.dataTransfer.setData(dataString, JSON.stringify(product));
        }
        ,
        handleDragProductRow: function (e) {
            const dataString = getDataString();
            e.dataTransfer = e.originalEvent.dataTransfer;
            let $productRow = $(this);
            let selector = 'input[type="hidden"][name="id[]"]';
            let id = parseIntOrDefault($productRow.find(selector).val());
            const $product = findProductById(id);
            let $count = $productRow.find('input[name="count[]"]');
            const count = parseIntOrDefault($count.val());
            const product = readProductInfo($product, count);
            product.containerClass = $productRow.closest('.droppable').attr("data-container-class");
            e.dataTransfer.setData(dataString, JSON.stringify(product));
        }
        ,
        handleDropProduct: function (e) {
            e.stopPropagation();
            const dataString = getDataString();
            e.dataTransfer = e.originalEvent.dataTransfer;
            let product = JSON.parse(e.dataTransfer.getData(dataString));
            let $target = $(this).find('.table');
            let sameOrigin = $target.hasClass(product.containerClass);
            if (!product.containerClass || sameOrigin === false) {
                addProductTo(product, $target);
                if (product.containerClass !== undefined && sameOrigin === false) {
                    removeProductFromOrigin(product)
                }
            }
        }
        ,
        saveNumpadProductCount: function (e) {
            let id = parseIntOrDefault($numpad.find('input[name="id"]').val());
            let count = parseIntOrDefault($numpad.find('.count').text());
            if (count === 0) {
                count = 1;
            }
            const $product = findProductById(id);
            $product.find('.count').text(count);
            $numpad.modal('hide');
        }
        ,
        applyNumpad: function (e) {
            const target = $(this).attr("data-target");
            let $target = $(target);
            if ($target.length > 0) {
                let id = parseIntOrDefault($numpad.find('input[name="id"]').val());
                const $product = findProductById(id);
                let count = parseIntOrDefault($numpad.find('.count').text());
                const product = readProductInfo($product, count);
                if (id > 0 && product.count > 0) {
                    addProductTo(product, $target, $product);
                }
            }
            $numpad.modal('hide');
        }
        ,
        resetNumpad: function (e) {
            removeDispatchNumpadKeydownListener();

        }
        ,
        addDispatchNumpadKeydownListener: function (e) {
            addDispatchNumpadKeydownListener();
        }
        ,
        dispatchNumpadKeydown: function (e) {
            if (e.key === 'o' || e.key === 'O') {
                $numpad.find('.save-button').trigger("click").focus()
            } else if (e.key === 'Enter' || e.key === 'v' || e.key === 'V') {
                $numpad.find('.apply-cart-button').trigger("click").focus()
            } else if (e.key === 'k' || e.key === 'K') {
                $numpad.find('.apply-credits-button').trigger("click").focus()
            }
        }
    };

    function readProductInfo($product, count) {
        return {
            id: parseIntOrDefault($product.find('input[name="id[]"]').val()),
            count: (!count) ? parseIntOrDefault($product.find('.count').text()) : count,
            name: $product.find('.name').text(),
            price: parseFloatOrDefault($product.find('input[name="price[]"]').val()),
            costInCredits: parseIntOrDefault($product.find('input[name="cost-in-credits[]"]').val())
        }
    }

    function addProductTo(product, $targetScope, $product, skipTriggerChange) {
        hideAlerts();
        if (!$product) {
            $product = findProductById(product.id);
        }
        if ($product.length > 0) {
            let $productRow = findOrCreateProductRowIn($targetScope, product.id);
            if ($productRow.length > 0) {
                updateProductRow($productRow, product);
            }
            if (!skipTriggerChange) {
                $targetScope.trigger("change");
            }
        }
    }

    function findProductById(id) {
        const selector = '.desk .product[data-id="' + id + '"]';
        return $(selector);
    }

    function findOrCreateProductRowIn($targetScope, id) {
        const selector = '.entity[data-id="' + id + '"]';
        let $productRow = $targetScope.find(selector);
        if ($productRow.length === 0) {
            $productRow = createNewRowInside($targetScope, id);
        }
        return $productRow;
    }

    function createNewRowInside($targetScope, id) {
        const templateId = $targetScope.attr("data-template");
        const $template = $(templateId);
        if ($template.length > 0) {
            let $newRow = $template.clone().removeAttr("id");
            $newRow.find('input[name="id[]"]').val(id);
            $newRow.attr("data-id", id);
            let $empty = $targetScope.find("tr.empty");
            let emptyHiddenAttr = $empty.attr('hidden');
            if (!emptyHiddenAttr) {
                $empty.prop('hidden', true);
            }
            $empty.before($newRow);
        }
        return $newRow;
    }

    function updateProductRow($productRow, product) {
        let $count = $productRow.find('input[name="count[]"]');
        let count = parseIntOrDefault($count.val());
        let newCount = count + product.count;
        $count.val(newCount);
        $productRow.find('.name').text(product.name);
        $productRow.find('input[name="cost-in-credits[]"]').val(product.costInCredits);
        let $price = $productRow.find('input[name="price[]"]');
        if ($price.length > 0) {
            $price.val(product.price);
        }
    }

    function placeOrder(username, options) {
        let data = {
            username: username,
            orderLines: readProductInfoFrom($cartTable),
            creditLines: readProductInfoFrom($creditsTable)
        };
        $orderForm.find('.ajax-holder').show();
        STORAGE.remove(STORAGE.keys.cart);
        FETCH.post(data, options)
            .then(FETCH.json)
            .then(eventHandlers.handleFetchApplyOrderFeedback)
            .catch(console.error);
    }

    function setOrderFormState(ready) {
        $finalizeOrderButton.prop("disabled", !ready);
        const $orderFormHeader = $orderForm.find('.modal-header');
        const $finalizeOrderButtonIcon = $finalizeOrderButton.find('i');
        $orderFormHeader.removeClass("bg-warning bg-success");
        $finalizeOrderButtonIcon.removeClass("fa-exclamation-circle fa-check-circle");
        $applyOrderButton.removeClass("btn-success btn-warning");
        if (ready) {
            $orderFormHeader.addClass("bg-success");
            $finalizeOrderButtonIcon.addClass("fa-check-circle");
            $applyOrderButton.addClass("btn-success")
        } else {
            $orderFormHeader.addClass("bg-warning");
            $finalizeOrderButtonIcon.addClass("fa-exclamation-circle");
            $applyOrderButton.addClass("btn-warning");
        }
    }

    function calculateGrandTotalValues($productRows) {
        let grandTotals = {
            price: .0,
            credits: 0,
            count: 0
        };
        $.each($productRows, function (index, row) {
            const $productRow = $(row);
            let count = parseIntOrDefault($productRow.find('input[name="count[]"]').val());
            let totalPrice = count * parseFloatOrDefault(parseFloat($productRow.find('input[name="price[]"]').val()));
            let totalCredits = count * parseInt($productRow.find('input[name="cost-in-credits[]"]').val());
            $productRow.find('.total-price .price').text(totalPrice.toFixed(2).replace(".", ","));
            $productRow.find('.credits').text(totalCredits);
            grandTotals.count += parseIntOrDefault($productRow.find('input[name="count[]"]').val());
            grandTotals.price += totalPrice;
            grandTotals.credits += totalCredits;
        });
        return grandTotals;
    }

    function removeProductFromOrigin(product) {
        const originSelector = '.' + product.containerClass;
        const idSelector = 'input[type="hidden"][name="id[]"][value="' + product.id + '"]';
        let $origin = $(originSelector);
        if ($origin.length > 0) {
            let $originId = $origin.find(idSelector);
            if ($originId.length > 0) {
                $originId.closest("tr").remove();
                $origin.trigger("change");
            }
        }
    }

    function updateGrandTotalValues(grandTotals, $scopeTable) {
        let $scope;
        if ($scopeTable.hasClass('table-cart')) {
            $scope = $('.grand-total-row-cart');
        } else if ($scopeTable.hasClass('table-credits')) {
            $scope = $('.grand-total-row-credits');
        }
        if ($scope.length > 0) {
            let $grandTotalPrice = $scope.find('.grand-total-price .price');
            let $grandTotalCredits = $scope.find('.grand-total-credits .credits');
            let $grandCount = $scope.find('.grand-count');
            $grandCount.text(grandTotals.count);
            if ($grandTotalPrice.length > 0) {
                $grandTotalPrice.text(grandTotals.price.toFixed(2).replace(".", ","));
            }
            if ($grandTotalCredits.length > 0) {
                $grandTotalCredits.text(grandTotals.credits);
                $grandTotalCreditsRow.trigger("change");
            }
            $cartToolbar.find('a.hidable, button.hidable')
                .prop("hidden", $orderlineContainerTables.find('.entity').length === 0);
        }

    }


    function isAvailable() {
        return $cashDesk.length > 0 && $cart.length > 0
    }

    function addEventListeners() {
        $cashDesk.on("click", '.show-numpad-button', eventHandlers.initNumpad)
            .on("click", '.product-to-cart-button', eventHandlers.addProductToCart)
            .on("click", '.product-to-credits-button', eventHandlers.addProductToCredits);

        $cartToolbar.on("click", '.clear-cart-button', eventHandlers.resetCart)
            .on("click", '.show-cart-details-button', eventHandlers.loadCartDetailsModal)
            .on("click", '.apply-order-button', eventHandlers.loadApplyOrderModal);
        $cartDetailsModal.on("hidden.bs.modal", eventHandlers.unloadCartDetailsModal);

        $applyOrderModal.on("reset", eventHandlers.resetApplyOrderModal);

        $cart.on("submit", eventHandlers.showApplyOrderModal)
            .on("input propertychange", '.number-group .number-field', eventHandlers.changeProductCount)
            .on("click", '[data-toggle="move-one-product"]', eventHandlers.moveOneProduct)
            .on("change", '.orderline-container > .table', eventHandlers.updateGrandTotalRow);

        $orderForm.on("submit", eventHandlers.submitOrder)
            .on("submitted", eventHandlers.closeOrder);

        $username.on("input propertychange", eventHandlers.checkOrderFormState);
        $grandTotalCreditsRow.on("change", eventHandlers.checkUserInfo);
        $('.alert.order-success .close').on("click", eventHandlers.closeAndKeepAlert);
    }

    function addDragAndDropEventListeners() {
        const $droppable = $cart.find('.droppable');

        $productList.on("dragstart", 'li.product', eventHandlers.handleDragProduct);

        $droppable.on("drop", eventHandlers.handleDropProduct)
            .on("dragstart", '.entity', eventHandlers.handleDragProductRow);
    }

    function addDispatchNumpadKeydownListener() {
        $numpad.on("keydown", eventHandlers.dispatchNumpadKeydown);
    }

    function removeDispatchNumpadKeydownListener() {
        $numpad.off("keydown", eventHandlers.dispatchNumpadKeydown);
    }

    function addNumpadListeners() {
        $numpad.on("show.bs.modal", eventHandlers.addDispatchNumpadKeydownListener)
            .on("hidden.bs.modal", eventHandlers.resetNumpad);

        $saveNumpadButton.on("click", eventHandlers.saveNumpadProductCount);
        $applyNumpadButton.on("click", eventHandlers.applyNumpad);
    }

    function showUserInfoModalIfInvalid(data) {
        if (isNumeric(data.userCredits) && data.creditLines && data.creditLines.length > 0) {
            let totalCredits = parseIntOrDefault($grandTotalCredits.find(".credits").text());
            if (data.userCredits < totalCredits) {
                $userInfoModal.modal('show');
            }
        }
    }

    function loadCartFromLocalStorage() {
        const cart = getCartFromStorage();
        clearCart();
        cart.orderLines.forEach(function (item) {
            let $product = findProductById(item.id);
            let product = readProductInfo($product, item.count);
            addProductTo(product, $cartTable, $product, false);
        });
        cart.creditLines.forEach(function (item) {
            let $product = findProductById(item.id);
            let product = readProductInfo($product, item.count);
            addProductTo(product, $creditsTable, $product, false);
        });
        fillUserInfo(cart);
    }

    function fillUserInfo(cart) {
        let username = (cart.username);
        let userCredits = (cart.userCredits);
        $username.val("");
        $userCredits.val("");
        if (username) {
            $username.val(username).trigger("input")
        }
        if (userCredits) {
            $userCredits.val(userCredits).trigger("input")
        }
        setUserInfo(cart);
    }

    function clearCart() {
        hideAlerts();
        $orderlineContainerTables.find(".entity").remove();
        $orderlineContainerTables.trigger("change");
    }

    function hideAlerts() {
        $('.alerts .alert:visible').hide();
    }

    function resetUserInfo() {
        $userInfoModalHeader.removeClass("bg-success bg-danger");
        $noUserInfoMessage.show();
        $userInfoMessage.hide();
        $grandTotalCredits.removeClass("text-success text-danger")
    }

    function setUserInfo(data) {
        if (data) {
            let username = data.username;
            let userCredits = data.userCredits;
            $userInfoUsername.text((username) ? username : "Het lid");
            $userInfoCredits.text((userCredits) ? userCredits : "0");
        }
        if (userCredits) {
            $noUserInfoMessage.hide();
            $userInfoMessage.show();
            validateUserInfo(userCredits)
        } else {
            resetUserInfo();
        }
    }

    function validateUserInfo(userCredits) {
        const totalCostInCredits = $grandTotalCreditsRow.find('.credits').text();
        let valid = isNumeric(totalCostInCredits);
        if (valid) {
            const costInCredits = parseIntOrDefault(totalCostInCredits);
            valid = userCredits >= costInCredits;
        }
        $userInfoModalHeader.removeClass("bg-success bg-danger")
            .addClass((valid) ? "bg-success" : "bg-danger");
        $grandTotalCredits.removeClass("text-success text-danger").addClass((valid) ? "text-success" : "text-danger");
    }

    function updateCartInStorage($targetScope) {
        const propertyName = getCartStoragePropertyName($targetScope);
        if (propertyName) {
            let cart = getCartFromStorage();
            let key = STORAGE.keys.cart;
            STORAGE.remove(key);
            cart[propertyName] = readProductInfoFrom($targetScope);
            STORAGE.set(key, cart);
        }
    }

    function getCartStoragePropertyName($targetScope) {
        if ($targetScope.hasClass("table-cart"))
            return 'orderLines';
        if ($targetScope.hasClass("table-credits"))
            return 'creditLines';
    }

    function getCartFromStorage() {
        const cart = STORAGE.get(STORAGE.keys.cart);
        return (cart !== null) ? cart : {orderLines: [], creditLines: []};
    }

    function readProductInfoFrom($targetScope) {
        let products = [];
        $.each($targetScope.find(".entity"), function (index, row) {
            let $productRow = $(row);
            let product = {
                id: parseIntOrDefault($productRow.find('input[name="id[]"]').val()),
                count: parseIntOrDefault($productRow.find('input[name="count[]"]').val())
            };
            if (product.id > 0 && product.count > 0) {
                products.push(product)
            }
        });
        return products;
    }

    const init = async function () {
        if (isAvailable()) {
            addEventListeners();
            addDragAndDropEventListeners();
            addNumpadListeners();
            resetUserInfo();
            if (STORAGE.isAvailable()) {
                loadCartFromLocalStorage();
            }
        }
    };

    return {
        init: init
    }
};

const CAMERA = function () {
    const $orderForm = $('#form-order');
    const $outputContainer = $('#output');
    const $videoContainer = $("#video");
    const $loadingMessage = $('#loadingMessage');
    const $outputMessage = $('#outputMessage');
    const $outputData = $('#outputData');
    const $resetQRScannerButton = $('#reset-qrscanner-button');
    const $toggleCamera = $('#toggleCamera');
    const $applyOrderModal = $('#modal-apply-order');
    let video = document.createElement('video');

    const tick = function () {
        $loadingMessage.text("Loading video...");
        let $canvas = $videoContainer.find('#camera-canvas');
        if ($canvas.length > 0) {
            let canvas = $canvas[0];
            let context = canvas.getContext("2d");
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                initVideoReadyState(canvas, context);
                let code = readCode(canvas, context);
                if (code) {
                    handleDetectedCode(context, code);
                    return;
                } else {
                    $outputMessage.show();
                    $resetQRScannerButton.hide();
                }
            }
            requestAnimationFrame(tick);
        }
    };

    const eventHandlers = {
        initWebcam: function (e) {
            let $canvas = $('<canvas id="camera-canvas">');
            let cameraFacingMode = $toggleCamera.is(":checked") ? "user" : "environment";
            $videoContainer.html($canvas);
            navigator.mediaDevices.getUserMedia({video: {facingMode: cameraFacingMode}}).then(function (stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.play();
                requestAnimationFrame(tick);
            });
        }
        ,
        destroyWebcam: function (e) {
            let $canvas = $videoContainer.find('#canvas');
            $canvas.remove();
            $(this).find('.total-row').remove();
            video.srcObject.getTracks().forEach(function (track) {
                track.stop();
            });
        }
        ,
        resetOrderForm: function (e) {
            $outputData.val("").trigger("input");
            eventHandlers.initWebcam(e);
        }
    };

    function initVideoReadyState(canvas, context) {
        $loadingMessage.hide();
        canvas.hidden = false;
        $outputContainer.show();
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    function readCode(canvas, context) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        return jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
    }

    function handleDetectedCode(context, code) {
        drawDetectedCode(context, code);
        $resetQRScannerButton.show();
        $outputMessage.hide();
        $outputData.val(code.data).trigger("input");
        if (code.data.length > 0) {
            $orderForm.trigger("submit");
        }
    }

    function drawDetectedCode(context, code) {
        drawLine(context, code.location.topLeftCorner, code.location.topRightCorner, "#005587");
        drawLine(context, code.location.topRightCorner, code.location.bottomRightCorner, "#005587");
        drawLine(context, code.location.bottomRightCorner, code.location.bottomLeftCorner, "#005587");
        drawLine(context, code.location.bottomLeftCorner, code.location.topLeftCorner, "#005587");
    }

    function drawLine(context, begin, end, color) {
        context.beginPath();
        context.moveTo(begin.x, begin.y);
        context.lineTo(end.x, end.y);
        context.lineWidth = 4;
        context.strokeStyle = color;
        context.stroke();
    }

    function isAvailable() {
        return $videoContainer.length > 0 && $orderForm.length > 0;
    }

    function addEventListeners() {
        $applyOrderModal.on("show.bs.modal", eventHandlers.initWebcam)
            .on("hidden.bs.modal", eventHandlers.destroyWebcam);
        $resetQRScannerButton.on("click", eventHandlers.resetOrderForm);
        $toggleCamera.on("change", eventHandlers.initWebcam);
    }

    const init = function () {
        if (isAvailable()) {
            addEventListeners();
        }
    };

    return {
        init: init
    };
};


// DEPRECATED : TODO CHECK TO DELETE
let swRegistration = null;
let deferredPrompt;

function registerSW() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('../../sw-min.js')
            .then(function (swReg) {
                swRegistration = swReg;
            })
            .catch(console.error);
    }
}

window.addEventListener('beforeinstallprompt', (e) => {
    console.log("beforeinstallprompt");
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can add to home screen
});


// END DEPRECATED


/**
 *
 * @param value
 * @returns {number}
 */
function parseIntOrDefault(value, defaultValue) {
    const result = parseInt(value);
    if (isNumeric(result)) {
        return result;
    }
    if (isNaN(result)) {
        return 0;
    }
    return result;
}

function parseFloatOrDefault(value, defaultValue) {
    let result = parseFloat(value);
    if (isNumeric(result)) {
        return result;
    }
    if (!defaultValue || !isNumeric(defaultValue)) {
        return .0;
    }
    return 1.0 * defaultValue;
}

/**
 * Core functionality (extend)
 * @param n
 * @returns {boolean}
 */
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Extends jQuery Functionality
 * @param $form
 * @returns form options
 */
function getFormOptions($form) {
    let method = $form.attr("method");
    method = (!method) ? "GET" : method.toUpperCase();
    return {
        action: $form.attr("action"),
        method: method.toUpperCase()
    };
}

/**
 * Native drag/drop data-string
 * @returns {string}
 */
function getDataString() {
    let userAgent = window.navigator.userAgent,
        msie = userAgent.indexOf('MSIE '),       // IE
        trident = userAgent.indexOf('Trident/'); // IE 11 / Edge
    if (msie > 0 || trident > 0) {
        return 'Text';
    }
    return 'text/html';
}
function showDownloadPrompt() {
    $('#btnAdd').hide();
    // btnAdd.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
}
const init = async function () {
     registerSW();
     $("body").on("click", "#btnAdd", showDownloadPrompt);
    // $('.show-cache-button').prop("hidden", !storageHasItems());
    FRAMEWORK_GENERIC().extend();
    GENERAL().init();
    EVENTS().init();
    INVENTORY().init();
    MEMBERS().init();
    PROFILE().init();
    let cashDesk = await CASHDESK();
    await cashDesk.init();
    CAMERA().init();
};


$(document).ready(init);
