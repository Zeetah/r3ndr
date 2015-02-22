describe('R3ndr', function() {

  var R       = require('../index'),
      expect  = require('chai').expect;

  it('should initialize itself', function() {
    expect(R).to.exists;
  });

  it('should expose render method', function() {
    expect(R.render).not.to.exists;
    expect(R).to.throw('Template must be set.');
    expect(R('<div></div>').render).to.exists;
  });

  it('should render one elem correctly', function() {
    var expected = '<div id="content">hi there</div>',
        template = '<div id="content"></div>',
        data = {
          content: {
            text: 'hi there'
          }
        },
        rendered = R(template).render(data, {
          content: {
            text: function() {
              return this.text;
            }
          }
        });

    expect(rendered).to.be.eql(expected);
  });

  it('should render multiple elems correctly', function() {
    var expected = '<div class="root"><div class="content">Hello</div><div class="content">World</div></div>',
        template = '<div class="root"><div class="content"></div></div>',
        data = {
          content: [
            {
              text: 'Hello'
            },
            {
              text: 'World'
            }
          ]
        },
        rendered = R(template).render(data, {
          content: {
            text: function() {
              return this.text;
            }
          }
        });

    expect(rendered).to.be.eql(expected);
  });

  it('should render multiple elems correctly with id', function() {
    var expected = '<div class="root" id="rootId"><div class="content">Hello</div><div class="content">World</div></div>',
        template = '<div class="root"><div class="content"></div></div>',
        data = {
          content: [
            {
              text: 'Hello'
            },
            {
              text: 'World'
            }
          ]
        },
        rendered = R(template).render(data, {
          root: {
            id: function() {
              return 'rootId';
            }
          },
          content: {
            text: function() {
              return this.text;
            }
        }
        });

    expect(rendered).to.be.eql(expected);
  });

  it('should render multiple multi elems correctly', function() {
    var expected = '<div class="rootClass"><div class="content">Hello</div><div class="content">World</div><div class="content2">World of</div><div class="content2">Hello</div></div>',
        template = '<div class="root"><div class="content"></div><div class="content2"></div></div>',
        data = {
          content: [
            {
              text: 'Hello'
            },
            {
              text: 'World'
            }
          ],
          content2: [
            {
              text: 'World of'
            },
            {
              text: 'Hello'
            }
          ]
        },
        rendered = R(template).render(data, {
          class: function() {
            return 'rootClass';
          },
          content: {
            text: function() {
              return this.text;
            }
          },
          content2: {
            text: function() {
              return this.text;
            }
          }
        });

    expect(rendered).to.be.eql(expected);
  });

  it('should render navigation correctly', function() {
    var expected = '<ul class="categories level1"><li class="category"><a class="category-link" title="First title" href="url:First title"><span class="category-name">First title</span></a><ul class="categories level2"></ul></li><li class="category"><a class="category-link" title="Second title" href="url:Second title"><span class="category-name">Second title</span></a><ul class="categories level2"></ul></li></ul>',
        template = '<ul class="categories"><li class="category"><a class="category-link"><span class="category-name"></span></a><ul class="categories"></ul></li></ul>',
        data = [
          {title: 'First title'},
          {title: 'Second title'}
        ],
        rendered = R(template).render(data, {
          class: function (attributes) {
            return attributes.value + ' level1';
          },
          'category-link': {
            title: function (attributes) {
              return this.title;
            },
            href: function () {
              return 'url:' + this.title;
            }
          },
          'category-name': {
            text: function () {
              return this.title;
            }
          },
          'categories': {
            class: function (attributes) {
              return attributes.value + ' level2';
            }
          }
        });

    expect(rendered).to.be.eql(expected);
  });
});