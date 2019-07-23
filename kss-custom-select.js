(function ($) {
    "use strict";

    $.fn.KssCustomSelect = function (settings) {
        var defaults = {
            activeClass: 'active',
        };
        var options = $.extend({}, defaults, settings);

        var __deactivateAllItems = function (elements) {
            elements.removeClass(options.activeClass);
        };
        var __activateItem = function (currentElement) {
            $('.select-selected').html(currentElement.data('value'));
            currentElement.addClass(options.activeClass);
        };

        var __openClose = function (thisElement) {
            if (thisElement.hasClass('open')) {
                // close
                thisElement.removeClass('open');
                $('.select-selected').removeClass('select-arrow-active');
                $('.select-items').addClass('select-hide');
            }
            else {
                thisElement.addClass('open');
                $('.select-selected').addClass('select-arrow-active');
                $('.select-items').removeClass('select-hide');
            }
        };

        return this.each(function () {
            var thisElement = $(this);

            var selectElement = $('select', thisElement);
            if (selectElement && selectElement.length > 0) {
                //#! Display the selected option
                var $selectedOption = $('option:selected', selectElement);
                thisElement.append('<div class="select-selected" data-value="' + $selectedOption.val() + '">' + $selectedOption.text() + '</div>');

                //#! Wrap all select items in a div
                var $html = '';
                $('option', selectElement).each(function (index, el) {
                    var $this = $(el);
                    $html += '<div class="select-item" data-value="' + $this.val() + '" data-index="' + index + '">' + $this.text() + '</div>';
                });
                thisElement.append('<div class="select-items select-hide">' + $html + '</div>');

                //#! Setup hooks
                var selectableItems = $('.select-items .select-item', thisElement);
                selectableItems.on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var self = $(this),
                        selectedValue = $('.select-selected', thisElement).data('value');

                    //#! If this is the selected item, do nothing
                    if (self.data('value') === selectedValue) {
                        return false;
                    }
                    //#! Update the original select element and trigger change
                    else {
                        //#! Deactivate all active items
                        __deactivateAllItems(selectableItems);
                        //#! Activate the current item
                        __activateItem($(this));
                        //#! Close the dropdown
                        __openClose(thisElement);
                        //#! Update the corresponding value in the form select input
                        selectElement.val(self.data('value'));
                        selectElement.trigger('change');
                    }
                });

                //#! Hook the event listener to open the custom select
                thisElement.on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    //#! close any other open custom selects that maybe are open
                    __openClose(thisElement);
                });

                //#! Close dropdowns on document click
                $(document).on('click', function (e) {
                    thisElement.removeClass('open');
                    $('.select-selected').removeClass('select-arrow-active');
                    $('.select-items').addClass('select-hide');
                });
            }
        });
    };
})(jQuery);
