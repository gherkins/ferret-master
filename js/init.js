Handlebars.registerHelper('for', function (from, to, incr, block) {
    var accum = '';
    for (var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});


var offsets = [0, 4, 11, 7, 2, 9, 4];

$(function () {

    var ferret = new Ferret();
    var combos;

    $('.fretboard').html(Handlebars.compile($("#fretboard-template").html()));

    //populate fret note-attributes
    $('.fret').each(function () {
        $(this).attr('data-note', function () {
            var offset = offsets[$(this).data('string')];
            var index = (offset + $(this).data('fret')) % 12;
            return ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"][index];
        });
    });

    //piano keys change
    $('.keys .key').on('click', function (e) {
        e.stopPropagation();
        $(this).toggleClass('active');
        showCombos();
    });

    function showCombos() {
        $('.fret span').remove();

        //get notes from active keys
        var notes = [];
        $('.keys .key.active').each(function () {
            notes.push($(this).data('note'));
        });

        //get playable combinations
        combos = ferret.getCombinations(notes);

        $('ul.combos').html('');
        $(combos).each(function (index) {
            $('<li><button data-index="' + index + '">' + (index + 1) + '</button></li>').appendTo($('ul.combos'));
        });
        $('ul.combos li:first-child button').click();


    }

    $('ul.combos').on('click', 'button', function (e) {
        e.preventDefault();
        $('ul.combos button').removeClass('active');
        $(this).addClass('active');
        showCombo($(this).data('index'));
    });

    function showCombo(index) {
        $('.fret span').remove();

        var root = combos[index][0];

        $('<span/>')
            .addClass('lowlight')
            .appendTo($('.fret[data-note="' + root.note + '"]'));


        $(combos[index]).each(function () {

            var span = $('<span></span>')
                .addClass('highlight');

            if (this.note == root.note) {
                span.addClass('root');
            }

            $('.fret[data-fret="' + this.fret + '"][data-string="' + this.string + '"]')
                .html('')
                .append(span);

        });
    }

    $(document).on('keydown', function (e) {
        $('.keys .key[data-key="' + e.which + '"]').click();
    });

    Mousetrap.bind(['right'], function () {
        $('.combos button').each(function (key) {
            if ($(this).hasClass('active')) {
                var buttons = $('.combos button');
                if (buttons[key + 1]) {
                    buttons[key + 1].click();
                }
                else {
                    buttons.first().click();
                }
                return false;
            }
            return true;
        });
    });

    Mousetrap.bind(['left'], function () {
        $('.combos button').each(function (key) {
            if ($(this).hasClass('active')) {
                var buttons = $('.combos button');
                if (buttons[key - 1]) {
                    buttons[key - 1].click();
                }
                else {
                    buttons.last().click();
                }
                return false;
            }
            return true;
        });
    });

    Mousetrap.bind(['esc'], function () {
        $('.keys .key').removeClass('active');
        showCombos();
    });

    showCombos();

});


$(function () {
    $('#share').sharrre({
        share: {
            googlePlus: true,
            facebook: true,
            twitter: true
        },
        buttons: {
            googlePlus: {
                size: 'tall',
                annotation: 'bubble'
            },
            facebook: {
                layout: 'box_count'
            },
            twitter: {
                count: 'vertical'
            }
        },
        url: 'http://web-development.cc/ferret-master/',
        enableHover: true,
        enableCounter: false,
        enableTracking: false
    });
});

