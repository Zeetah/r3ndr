# R3ndr

R3ndr is template engine for browser and backend (node). It maps data object to String templates by id and class data-bind attributes.


#####Example usage:

```
var example = R.render('<div>Hello <span class="name"></span></div>', {name: { text: 'Example'}}, {
  name: {
    text: function() {
      return '<span class="extended">Extended</span> ' + this.text;
    }
  }
});

console.log(example);
```
