//Start Google Tag Manager //
(function(w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != "dataLayer" ? "&l=" + l : "";
  j.async = true;
  j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-MRCPQ65");
//End Google Tag Manager //

$(document).ready(function() {
  var pathname = window.location.pathname;

  $(document).on("view:HomePage", function() {
    console.info("Homepage has been tracked");
  });

  $(document).on("view:ProductPage", function() {
    console.info("Product page has been tracked");
  });

  $(document).on("view:Basket", function() {
    console.info("Basket page has been tracked");
  });

  $(document).on("view:Checkout", function() {
    console.info("Checkout page has been tracked");
  });

  $(document).on("view:Delivery", function() {
    console.info("Delivery page has been tracked");
  });

  $(document).on("view:Payment", function() {
    console.info("Payment page has been tracked");
  });

  /*Events to trigger when on each of the page*/

  $('.box-footer [type="submit"]').click(function() {
    $(document).trigger("conversion");
  });

  $(function() {
    function getPageName() {
      var pathname = window.location.pathname;
      if (pathname.indexOf("/index.html") > -1) {
        return "Homepage";
      } else if (pathname.indexOf("detail.html") > -1) {
        return "ProductPage";
      } else if (pathname.indexOf("checkout4.html") > -1) {
        return "Checkout4";
      } else if (pathname.indexOf("basket.html") > -1) {
        return "Basket";
      }
    }

    /*PRODUCT INFORMATION*/
    function getProductInfo() {
      return {
        productName: $("#productMain h1.text-center").text(),
        productPrice: $("#productMain .price").text()
      };
    }

    function generateUniqueId(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    function getCartInfo() {
      var productInfoEls = $("#checkout table tbody tr");
      var result = {};

      result.actionField = {
        id: generateUniqueId(16),
        revenue: $("#checkout table tfoot th")
          .eq(1)
          .text()
          .match(/\d+/g)
          .join(".")
      };

      result.products = [];

      /*result.totalPurchase = $("#checkout table tfoot tr")
        .eq(1)
        .text();
      result.userAgent = navigator.userAgent;
      result.productList = [];*/

      $.each(productInfoEls, function(index, el) {
        result.products.push({
          name: $(el)
            .children()
            .eq(1)
            .text(),
          quantity: $(el)
            .children()
            .eq(2)
            .text(),
          price: $(el)
            .children()
            .eq(3)
            .text()
            .match(/\d+/g)
            .join("."),
          discount: $(el)
            .children()
            .eq(4)
            .text()
        });
      });
      return result;
    }

    function getParam() {
      var pageName = getPageName();
      var result = null;

      if (pageName === "ProductPage") {
        result = getProductInfo();
        return result;
      } else if (pageName === "Checkout4") {
        //get order information and addfiund information to the result
        result = getCartInfo();
        return result;
      }
      return result;
    }

    function triggerPageEvent() {
      var pageName = getPageName();
      var params = getParam();

      if (pageName === "Checkout4") {
        window.dataLayer.push({
          ecommerce: {
            purchase: getCartInfo()
          }
        });
        // specific event listener for checkout4 Page
        $("#checkout button").on("click", function() {
          $(document).trigger("conversion", params);
        });
      } else {
        if (pageName === "Basket") {
          window.dataLayer.push({
            ecommerce: {
              checkout: {
                actionField: {
                  step: 1
                }
              }
            }
          });
        }
        $(document).trigger("view:" + pageName, params);
      }
    }

    $(document).on("view:ProductPage", function(event, params) {
      console.log("The first parameter that I received is: ");
      console.log(event);

      console.log("The second parameter that I received is: ");
      console.log(params);
    });
    triggerPageEvent();

    $(".shop-detail-carousel").owlCarousel({
      items: 1,
      thumbs: true,
      nav: false,
      dots: false,
      loop: true,
      autoplay: true,
      thumbsPrerendered: true
    });

    $("#main-slider").owlCarousel({
      items: 1,
      nav: false,
      dots: true,
      autoplay: true,
      autoplayHoverPause: true,
      dotsSpeed: 400
    });

    $("#get-inspired").owlCarousel({
      items: 1,
      nav: false,
      dots: true,
      autoplay: true,
      autoplayHoverPause: true,
      dotsSpeed: 400
    });

    $(".product-slider").owlCarousel({
      items: 1,
      dots: true,
      nav: false,
      responsive: {
        480: {
          items: 1
        },
        765: {
          items: 2
        },
        991: {
          items: 3
        },
        1200: {
          items: 5
        }
      }
    });

    // productDetailGallery(4000);
    utils();

    // ------------------------------------------------------ //
    // For demo purposes, can be deleted
    // ------------------------------------------------------ //

    var stylesheet = $("link#theme-stylesheet");
    $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
    var alternateColour = $("link#new-stylesheet");

    if ($.cookie("theme_csspath")) {
      alternateColour.attr("href", $.cookie("theme_csspath"));
    }

    $("#colour").change(function() {
      if ($(this).val() !== "") {
        var theme_csspath = "css/style." + $(this).val() + ".css";

        alternateColour.attr("href", theme_csspath);

        $.cookie("theme_csspath", theme_csspath, {
          expires: 365,
          path: document.URL.substr(0, document.URL.lastIndexOf("/"))
        });
      }

      return false;
    });
  });

  $(window).on("load", function() {
    $(this).alignElementsSameHeight();
  });

  $(window).resize(function() {
    setTimeout(function() {
      $(this).alignElementsSameHeight();
    }, 150);
  });

  /* product detail gallery */

  // function productDetailGallery(confDetailSwitch) {
  //     $('.thumb:first').addClass('active');
  //     timer = setInterval(autoSwitch, confDetailSwitch);
  //     $(".thumb").click(function(e) {
  //
  // 	switchImage($(this));
  // 	clearInterval(timer);
  // 	timer = setInterval(autoSwitch, confDetailSwitch);
  // 	e.preventDefault();
  //     }
  //     );
  //     $('#mainImage').hover(function() {
  // 	clearInterval(timer);
  //     }, function() {
  // 	timer = setInterval(autoSwitch, confDetailSwitch);
  //     });
  //
  //     function autoSwitch() {
  // 	var nextThumb = $('.thumb.active').closest('div').next('div').find('.thumb');
  // 	if (nextThumb.length == 0) {
  // 	    nextThumb = $('.thumb:first');
  // 	}
  // 	switchImage(nextThumb);
  //     }
  //
  //     function switchImage(thumb) {
  //
  // 	$('.thumb').removeClass('active');
  // 	var bigUrl = thumb.attr('href');
  // 	thumb.addClass('active');
  // 	$('#mainImage img').attr('src', bigUrl);
  //     }
  // }

  function utils() {
    /* click on the box activates the radio */

    $("#checkout").on(
      "click",
      ".box.shipping-method, .box.payment-method",
      function(e) {
        var radio = $(this).find(":radio");
        radio.prop("checked", true);
      }
    );
    /* click on the box activates the link in it */

    $(".box.clickable").on("click", function(e) {
      window.location = $(this)
        .find("a")
        .attr("href");
    });
    /* external links in new window*/

    $(".external").on("click", function(e) {
      e.preventDefault();
      window.open($(this).attr("href"));
    });
    /* animated scrolling */

    $(".scroll-to, .scroll-to-top").click(function(event) {
      var full_url = this.href;
      var parts = full_url.split("#");
      if (parts.length > 1) {
        scrollTo(full_url);
        event.preventDefault();
      }
    });

    function scrollTo(full_url) {
      var parts = full_url.split("#");
      var trgt = parts[1];
      var target_offset = $("#" + trgt).offset();
      var target_top = target_offset.top - 100;
      if (target_top < 0) {
        target_top = 0;
      }

      $("html, body").animate(
        {
          scrollTop: target_top
        },
        1000
      );
    }
  }

  $.fn.alignElementsSameHeight = function() {
    $(".same-height-row").each(function() {
      var maxHeight = 0;

      var children = $(this).find(".same-height");

      children.height("auto");

      if ($(document).width() > 768) {
        children.each(function() {
          if ($(this).innerHeight() > maxHeight) {
            maxHeight = $(this).innerHeight();
          }
        });

        children.innerHeight(maxHeight);
      }

      maxHeight = 0;
      children = $(this).find(".same-height-always");

      children.height("auto");

      children.each(function() {
        if ($(this).innerHeight() > maxHeight) {
          maxHeight = $(this).innerHeight();
        }
      });

      children.innerHeight(maxHeight);
    });
  };
});
