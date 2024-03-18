$(document).ready(function ()
{
    // Function to set the height of the target div
    function setDivHeight() {
        var viewportHeight = $(window).height(); // Get viewport height
        $('.banner').height(viewportHeight); // Apply it to the target div
    }

    setDivHeight();

    // Call the function whenever the window resizes
    $(window).resize(function() {
        setDivHeight();
    });

    // to give dynamic max-width to nav-bookmarks-wrapper
    // instead from css, max-width is applied through js because nav-bookmarks-wrapper requires fixed max-width in pixles to calculate width so that the right arrow gets hidden when scrolled till last
    function setMaxWidth()
    {
        var viewportWidth = $(window).width();
        var maxWidth;

        if (viewportWidth < 767)
        {
            maxWidth = viewportWidth - 60;
        } else
        {
            maxWidth = viewportWidth - 80;
        }
        $('.nav-bookmarks-wrapper').css('max-width', maxWidth + 'px');
    }

    // Set initial max-width
    setMaxWidth();

    // Update max-width on window resize
    $(window).resize(function ()
    {
        setMaxWidth();
    });


    var bookmarksSection = $('.nav-bookmarks-section');
    var pageSections = $('.page-sections');

    function isScrolledIntoView(elem)
    {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return (elemTop <= docViewBottom && elemBottom >= docViewTop);
    }

    // to make nav-bookmarks-section visible when page-sections section appears in the viewport
    function updateBookmarksVisibility()
    {
        var isVisible = false;

        pageSections.each(function ()
        {
            if (isScrolledIntoView(this))
            {
                isVisible = true;
                moveActiveLine();
                // to get the active line activated for the first nav item when the page loads and the navigation appears
                // or --
                // init();
            }
        });

        if (isVisible)
        {
            bookmarksSection.css('display', 'block').addClass('slideDown').removeClass('slideUp');
        } else
        {
            bookmarksSection.css('display', 'none').removeClass('slideDown').addClass('slideUp');

        }
    }

    // alternative, if we want to make nav-bookmarks-section visible after fixed pixels
    // function updateBookmarksVisibility()
    // {
    //     var scrollPosition = $(window).scrollTop();
    //     var isVisible = scrollPosition > 200;

    //     if (isVisible)
    //     {
    //         bookmarksSection.css('display', 'block').addClass('slideDown').removeClass('slideUp');
    //     } else
    //     {
    //         bookmarksSection.css('display', 'none').removeClass('slideDown').addClass('slideUp');
    //     }
    // }

    // Initial check
    updateBookmarksVisibility();

    // Check when scrolling
    $(window).on('scroll', function ()
    {
        updateBookmarksVisibility();
    });



    var bookmarksWrapper = $(".nav-bookmarks-wrapper");
    var bookmarksList = $(".nav-bookmarks");
    var leftArrow = $(".nav-bookmarks-left");
    var rightArrow = $(".nav-bookmarks-right");
    var sections = $("section");
    var viewportWidth = $(window).width();
    var scrollAmount;
    if (viewportWidth >= 1230)
    { // Desktop view
        scrollAmount = 300;
    } else if (viewportWidth >= 768)
    { // Tablet view
        scrollAmount = 200;
    } else
    { // Mobile view
        scrollAmount = 120;
    }

    bookmarksList.on('scroll', function ()
    {
        var scrollPosition = bookmarksList.scrollLeft();
        var maxScroll = bookmarksList.get(0).scrollWidth - bookmarksList.width();

        if (scrollPosition === 0)
        {
            leftArrow.css('display', 'none');
        } else
        {
            leftArrow.css('display', 'flex');
        }

        if (scrollPosition >= maxScroll)
        {
            rightArrow.hide();
        } else
        {
            rightArrow.css('display', 'flex');
        }
    });

    // Initially show the right arrow if there are elements on the right
    rightArrow.css('display', 'flex');

    // Scroll to the selected section when a bookmark link is clicked
    bookmarksList.on('click', 'a', function (event)
    {
        event.preventDefault();

        var dataIndex = $(this).data('index');
        var targetSection = $("#section" + dataIndex);

        $('html, body').animate({
            scrollTop: targetSection.offset().top - 40
        }, 800); // Adjust the scroll duration as needed
    });

    // Scroll right when right arrow is clicked
    rightArrow.on('click', function ()
    {
        bookmarksList.animate({
            scrollLeft: bookmarksList.scrollLeft() + scrollAmount // Adjust the scroll amount as needed
        }, 0); // Adjust the scroll duration as needed
    });

    // Scroll left when left arrow is clicked
    leftArrow.on('click', function ()
    {
        bookmarksList.animate({
            scrollLeft: bookmarksList.scrollLeft() - scrollAmount // Adjust the scroll amount as needed
        }, 0); // Adjust the scroll duration as needed
    });

    $(window).on('scroll', function ()
    {
        var scrollPosition = $(window).scrollTop();

        if (scrollPosition >= 300)
        {
            $('.top').css('display', 'flex');
        } else
        {
            $('.top').css('display', 'none');
        }

    });

    $('.top').click(function ()
    {
        $('html, body').animate({ scrollTop: 0 });
        return false;
    });

});


const sectionsContainer = document.querySelector('.page-sections');
const sections = document.querySelectorAll('.page-section');
const nav = document.querySelector('.nav-sections');
const menu = nav.querySelector('.menu');
const links = nav.querySelectorAll('.menu-item-link');
const activeLine = nav.querySelector('.active-line');
const sectionOffset = nav.offsetHeight + 24;
const activeClass = 'active';
let activeIndex = 0;
let isScrolling = true;
let userScroll = true;

const setActiveClass = () =>
{
    links[activeIndex].classList.add(activeClass);
};

const removeActiveClass = () =>
{
    links[activeIndex].classList.remove(activeClass);
};

const moveActiveLine = () =>
{
    const link = links[activeIndex];
    const linkX = link.getBoundingClientRect().x;
    const menuX = menu.getBoundingClientRect().x;

    activeLine.style.transform = `translateX(${menu.scrollLeft - menuX + linkX}px)`;
    activeLine.style.width = `${link.offsetWidth}px`;
};

const setMenuLeftPosition = position =>
{
    menu.scrollTo({
        left: position,
        behavior: 'smooth'
    });

};

const checkMenuOverflow = () =>
{
    const activeLink = links[activeIndex].getBoundingClientRect();
    // const offset = 500;

    var viewportWidth = $(window).width();
    var offset;
    if (viewportWidth >= 1230)
    { // Desktop view
        offset = 500;
    } else if (viewportWidth >= 768)
    { // Tablet view
        offset = 250;
    } else
    { // Mobile view
        offset = 70;
    }

    // console.log("Offset is set to:", offset);

    if (Math.floor(activeLink.right) > window.innerWidth)
    {
        setMenuLeftPosition(menu.scrollLeft + activeLink.right - window.innerWidth + offset);
    } else if (activeLink.left < 0)
    {
        setMenuLeftPosition(menu.scrollLeft + activeLink.left - offset);
    }
};

const handleActiveLinkUpdate = current =>
{
    removeActiveClass();
    activeIndex = current;
    checkMenuOverflow();
    setActiveClass();
    moveActiveLine();
};

const init = () =>
{
    moveActiveLine(links[0]);
    document.documentElement.style.setProperty('--section-offset', sectionOffset);
};

links.forEach((link, index) => link.addEventListener('click', () =>
{
    userScroll = false;
    handleActiveLinkUpdate(index);
}));

window.addEventListener("scroll", () =>
{
    const currentIndex = sectionsContainer.getBoundingClientRect().top < 0 ?
        sections.length - 1 - [...sections].reverse().findIndex(section => window.scrollY >= section.offsetTop - sectionOffset * 2) :
        0;

    if (userScroll && activeIndex !== currentIndex)
    {
        handleActiveLinkUpdate(currentIndex);
    } else
    {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => userScroll = true, 100);
    }
});

init();