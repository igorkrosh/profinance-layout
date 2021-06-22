$(document).ready(Core);

function Core()
{
    InitOwlCarousel();

    SetTabSwitcher();
    SetModal();
    SetNavbar();
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
}

function InitOwlCarousel()
{
    let owlWhatYouGet = $('section.what_you_get .owl-carousel').owlCarousel({
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


    console.log(positionOwlActiveItem);
}
