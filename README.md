![alt tag](https://travis-ci.org/Zeetah/r3ndr.svg?branch=master)

# R3ndr

R3ndr is template engine for browser and backend (node). It maps data object to String templates by id and class data-bind attributes.


#####Load browser:

```
<script type="text/javascript" src="r3ndr.min.js"></script>
```

#####Load require:

```
var R = require('r3ndr');
```

#####Example usage:

```
var example = R('<div>Hello <span class="name"></span></div>').render({name: { text: 'Example'}}, {
  name: {
    text: function() {
      return '<span class="extended">Extended</span> ' + this.text;
    }
  }
});

console.log(example);
```
