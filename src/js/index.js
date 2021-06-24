$(document).ready(Core);

function Core()
{
    InitSimpleLightbox();
    InitOwlCarousel();
    InitNoUiSlider();
    InitWoW();

    SetTabSwitcher();
    SetModal();
    SetNavbar();
    SetCalculator();
}

function SetTabSwitcher()
{
    $('.btn__tab__switch').on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('active'))
        {
            return;
        }

        $('.btn__tab__switch').removeClass('active');
        $(this).addClass('active');

        let targetTab = $(this).attr('target');

        SwitchTab(targetTab)
    })
}

function SwitchTab(target)
{
    
    $('.tab.active').animate({
        opacity: 0
    }, 500, function() {
        $('.tab.active').removeClass('active');

        $(`[tab-name="${target}"]`).css('opacity', 0);
        $(`[tab-name="${target}"]`).addClass('active');
        
        let tabHeight = $(`[tab-name="${target}"]`)[0].clientHeight;
        $(`[tab-name="${target}"]`).closest('.tab__viewer').css('height', `${tabHeight}px`)

        $(`[tab-name="${target}"]`).animate({
            opacity: 1
        }, 500)
    })
}

function SetModal()
{
    $('[modal]').on('click', function()
    {
        let modalId = $(this).attr('modal');
        ShowModal(`#${modalId}`);
    });

    $('.modal__dialog').on('click', function(e) {
        e.stopPropagation();
    });

    $('.modal').on('click', function() {
        HideModal(`#${$(this).attr('id')}`);
    });

    $('.btn__modal__close').on('click', function ()
    {
        let modalId = $(this).closest('.modal').attr('id');
        HideModal(`#${modalId}`);
    });
}

function ShowModal(modalId)
{
    $(modalId + ' .modal__dialog').off('animationend');
    $(modalId).addClass('active');
    $('body').addClass('lock');
    $(modalId + ' .modal__dialog').addClass('fadeInDownBig')
    
    $('body').append('<div class="modal__backdrop"></div>');
    setTimeout(function() {
        $('.modal__backdrop').addClass('active');
    }, 50)
}

function HideModal(modalId)
{
    $(modalId + ' .modal__dialog').removeClass('fadeInDownBig');
    $(modalId + ' .modal__dialog').addClass('fadeOutDownBig');
    $('.modal__backdrop').removeClass('active');
    $('body').removeClass('lock');
    $(modalId + ' .modal__dialog').on('animationend', function() {
        if (!$(modalId).hasClass('active'))
        {
            return;
        }
        $(modalId).removeClass('active');
        $(modalId + ' .modal__dialog').removeClass('fadeOutDownBig');
        $('.modal__backdrop').remove();
    });
}

function SetNavbar()
{
    $(window).scroll(function () {
        let scrollY = this.scrollY
        let verticalSliderHeight = $('.first__section')[0].scrollHeight;
        
        if (scrollY > verticalSliderHeight / 5)
        {
            $('header').addClass('active')
        }
        else
        {
            $('header').removeClass('active')
        }
    })

    $('header .btn__menu').on('click', function () {
        if ($(this).hasClass('active'))
        {
            $(this).removeClass('active');
            $('.sidebar__menu').removeClass('active');
        }
        else
        {
            $(this).addClass('active');
            $('.sidebar__menu').addClass('active');
        }
    });
}

function InitOwlCarousel()
{
    $('section.what_you_get .owl-carousel').owlCarousel({
        items: 1,
        dots: true,
        dotsContainer: $('section.what_you_get .dots__wrapper .dots'),
        loop: true,
        onInitialized(event) {
            UpdateOwlWhatYouGet(event);
        },
        
        onTranslated(event) {
            UpdateOwlWhatYouGet(event);
        }
    });

    $('section.reviews .owl-carousel').owlCarousel({
        items: 3,
        dots: false,
        nav: false,
        loop: true,
        responsive: {
            992: {
                items: 3
            },
            576: {
                items: 2
            },
            0: {
                items: 1
            }
        }
    })
}

function UpdateOwlWhatYouGet(event)
{
    let current = event.page.index == -1 ? 1 : event.page.index + 1;
    
    let total = event.item.count;
    if (current < 10)
    {
        current = '0' + current;
    }

    if (total < 10)
    {
        total = '0' + total;
    }

    $('section.what_you_get .dots__wrapper .current .value').text(current);
    $('section.what_you_get .dots__wrapper .total__count').text(total);

    let positionOwlActiveItem = $('section.what_you_get .owl-item.active .text__wrapper').position();

    positionOwlActiveItem = positionOwlActiveItem != undefined ? positionOwlActiveItem.top : undefined;

    let heightOwlActiveItem = $('section.what_you_get .owl-item.active .text__wrapper').outerHeight();

    $('section.what_you_get .dots__wrapper').css(`top`, `${positionOwlActiveItem + heightOwlActiveItem + 40}px`)
}

function InitSimpleLightbox() 
{
    $('section.reviews .item').simpleLightbox();
}

function InitNoUiSlider()
{
    if (document.getElementById('nouislider') == null)
    {
        return;
    }

    let htmlSlider = document.getElementById('nouislider');

    noUiSlider.create(htmlSlider, {
        start: 0,
        range: {
            'min': [0, 10],
            '10%': [10, 20],
            '25%': [70, 30],
            '35%': [100, 50],
            '65%': [400, 100],
            'max': [1000]
        },
        connect: [true, false],
    })

    htmlSlider.noUiSlider.on('update', function(values) {
        $('.nouislider .text .value').text(parseInt(values[0]))
        CalculatePrice();
    })
}

function SetCalculator()
{
    $('form.calculator .plus__minus .plus').on('click', function(e) {
        e.preventDefault();

        let input = $(this).parent().find('input[type="number"]');
        let value = $(input).val();
        value++;
        $(input).val(value);
        CalculatePrice();
    })

    $('form.calculator .plus__minus .minus').on('click', function(e) {
        e.preventDefault();

        let input = $(this).parent().find('input[type="number"]');
        let value = $(input).val();
        value--;

        if (value <= 0)
        {
            return;
        }

        $(input).val(value);
        CalculatePrice();
    })

    $('form.calculator select[name="type-form"]').on('change', CalculatePrice)
    $('form.calculator input[name="type"]').on('change', CalculatePrice)
}

function CalculatePrice()
{
    let matrix = {
        'ooo_ysn_6': {
            0: 1000,
            10: 4000,
            30: 6000,
            50: 7000,
            70: 9000,
            100: 11000,
            150: 13000,
            200: 15000,
            250: 17000,
            300: 19000,
            350: 22000,
            400: 25000,
            500: 28000,
            600: 31000,
            700: 34000,
            800: 37000,
            900: 40000,
            1000: 43000
        },
        'ooo_ysn_15': {
            0: 1000,
            10: 5000,
            30: 7000,
            50: 9000,
            70: 11000,
            100: 13000,
            150: 15000,
            200: 17000,
            250: 19000,
            300: 22000,
            350: 25000,
            400: 28000,
            500: 31000,
            600: 34000,
            700: 37000,
            800: 40000,
            900: 43000,
            1000: 46000
        },
        'ooo_osn': {
            0: 1000,
            10: 7000,
            30: 9000,
            50: 11000,
            70: 13000,
            100: 15000,
            150: 17000,
            200: 19000,
            250: 22000,
            300: 25000,
            350: 28000,
            400: 31000,
            500: 34000,
            600: 37000,
            700: 40000,
            800: 43000,
            900: 46000,
            1000: 49000
        },
        'ip_psn': {
            0: 1000,
            10: 1500,
            30: 1500,
            50: 1500,
            70: 1500,
            100: 1500,
            150: 1500,
            200: 1500,
            250: 1500,
            300: 1500,
            350: 1500,
            400: 1500,
            500: 1500,
            600: 1500,
            700: 1500,
            800: 1500,
            900: 1500,
            1000: 1500
        },
        'ip_ysn_6': {
            0: 1000,
            10: 1500,
            30: 2000,
            50: 2000,
            70: 2000,
            100: 2000,
            150: 2000,
            200: 2000,
            250: 2000,
            300: 2000,
            350: 2000,
            400: 2000,
            500: 2000,
            600: 2000,
            700: 2000,
            800: 2000,
            900: 2000,
            1000: 2000
        },
        'ip_ysn_15': {
            0: 1000,
            10: 4500,
            30: 6500,
            50: 8500,
            70: 10500,
            100: 12500,
            150: 14500,
            200: 16500,
            250: 18500,
            300: 21500,
            350: 24500,
            400: 27500,
            500: 30500,
            600: 33500,
            700: 36500,
            800: 39500,
            900: 42500,
            1000: 45500
        }
    }
    let workerPrice = 500;
    let cateringModifier = 2;
    let manufactureModifier = 1.5;

    let typeForm = $('form.calculator select[name="type-form"]').val();
    let workersCount = parseInt($('form.calculator input[name="workers-count"]').val());
    let operationsCount = parseInt($('form.calculator .nouislider .text .value').text());
    let type = $('form.calculator input[name="type"]:checked').val();
    
    let result = 0;

    result = matrix[typeForm][operationsCount];

    if (typeForm == 'ooo_ysn_6' || typeForm == 'ooo_ysn_15' || typeForm == 'ooo_osn')
    {
        if (workersCount > 3)
        {
            result = result + (workersCount - 3) * workerPrice;
        }
    }
    else
    {
        if (workersCount > 1)
        {
            result = result + (workersCount - 1) * workerPrice;
        }
    }

    if (type == 'catering')
    {
        result = result * cateringModifier;
    }
    else
    {
        result = result * manufactureModifier;
    }

    $('form.calculator .result__wrapper .result .value').text(new Intl.NumberFormat('ru-RU').format(result))    
}

function InitWoW()
{
    let wow = new WOW({
        animateClass: 'animate__animated',
    })
    wow.init();
}
