(function (window) {
  var APP_SLUGS = {
    'yourway-recruitment': true,
    'empower-recruitment': true,
    'fleur-recruitment': true,
  };

  var WEBSHOP_SLUGS = {
    'knallert-market': true,
    'autolak-online': true,
  };

  function slugFromArticle(article) {
    var dataUrl = article.getAttribute('data-url');
    if (dataUrl) {
      return dataUrl;
    }

    var link = article.querySelector('a[href*="portfolio/"]');
    if (!link) {
      return '';
    }

    var match = link.getAttribute('href').match(/portfolio\/([^/.]+)/);
    return match ? match[1] : '';
  }

  function getWebsiteType(article) {
    var preset = article.getAttribute('data-website-type');
    if (preset) {
      return preset;
    }

    var slug = slugFromArticle(article);
    if (APP_SLUGS[slug]) {
      return '1';
    }
    if (WEBSHOP_SLUGS[slug]) {
      return '2';
    }

    var text = (
      (article.querySelector('h3') && article.querySelector('h3').textContent) ||
      ''
    ).toLowerCase();
    var title = (
      (article.querySelector('a[title]') && article.querySelector('a[title]').getAttribute('title')) ||
      ''
    ).toLowerCase();
    var combined = text + ' ' + title + ' ' + slug;

    if (/webshop|e-commerce|ecommerce/.test(combined)) {
      return '2';
    }
    if (/recruitment|platform|applicatie|app/.test(combined)) {
      return '1';
    }

    return '3';
  }

  function getArticles() {
    return Array.prototype.slice.call(document.querySelectorAll('.portfoliowrapper'));
  }

  function applyPortfolioFilter() {
    var websiteTypeSelect = document.querySelector('.js-website-type-select');
    var branchSelect = document.querySelector('.js-branch-select');
    var searchInput = document.querySelector('.js-portfolio-search');
    var websiteType = websiteTypeSelect ? websiteTypeSelect.value : '0';
    var branch = branchSelect ? branchSelect.value : '0';
    var query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    getArticles().forEach(function (article) {
      var type = getWebsiteType(article);
      var slug = slugFromArticle(article);
      var visible = true;

      if (websiteType !== '0' && type !== websiteType) {
        visible = false;
      }

      if (query) {
        var haystack = (article.textContent + ' ' + slug).toLowerCase();
        if (haystack.indexOf(query) === -1) {
          visible = false;
        }
      }

      if (branch !== '0' && article.getAttribute('data-branch') && article.getAttribute('data-branch') !== branch) {
        visible = false;
      }

      article.style.display = visible ? '' : 'none';
    });

    Array.prototype.slice.call(document.querySelectorAll('.js-portfoliowrapper-row')).forEach(function (row) {
      var hasVisible = Array.prototype.slice.call(row.querySelectorAll('.portfoliowrapper')).some(function (article) {
        return article.style.display !== 'none';
      });
      row.style.display = hasVisible ? '' : 'none';
    });

    var loadButton = document.querySelector('.js-portfolio-load-button');
    var loader = document.querySelector('.js-portfolio-loader');
    if (loadButton) {
      loadButton.style.display = 'none';
    }
    if (loader) {
      loader.style.display = 'none';
    }

    if (typeof window.reinitPortfolioStickyRows === 'function') {
      window.reinitPortfolioStickyRows(false);
    }
  }

  function patchPortfolioOverview() {
    if (!window.PortfolioOverview) {
      return;
    }

    window.PortfolioOverview.loadItems = function () {
      applyPortfolioFilter();
    };
    window.PortfolioOverview.changeFilters = function () {
      applyPortfolioFilter();
    };
    window.PortfolioOverview.changeSorting = function () {
      applyPortfolioFilter();
    };
    window.PortfolioOverview.search = function () {
      if (window.PortfolioOverview.executeSearchTimeout) {
        clearTimeout(window.PortfolioOverview.executeSearchTimeout);
      }
      window.PortfolioOverview.executeSearchTimeout = setTimeout(applyPortfolioFilter, 300);
    };
    window.PortfolioOverview.load = function () {
      applyPortfolioFilter();
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    patchPortfolioOverview();
    applyPortfolioFilter();
  });
})(window);
