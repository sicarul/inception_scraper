var casper = require('casper').create({
    pageSettings: {
        loadImages:  false,        // We don't need images
        loadPlugins: false
    
    },
    logLevel: 'debug'
});


casper.on('remote.message', function(message) {
    this.echo(message);
});

var fs = require('fs');
var filepath = casper.cli.args[0];

var editions;
casper.start('http://www.blu-ray.com/Inception/21950/', function() {
    
    editions = this.evaluate(function() {

        var elements = __utils__.findAll('h3');

        var rootNode;

        for(var i = 0; i < elements.length; i++){
            var el = elements[i];
            if(el.innerText == 'Blu-ray Editions'){
                rootNode = el.parentNode;
            }
        }

        var links = rootNode.querySelectorAll('a');
        

        var returnLinks = [];

        for(var i = 0; i < links.length; i++){
            
            var el = links[i];
            var newLink = {};
            newLink['edition_name'] = el.innerText;
            newLink['link'] = el.getAttribute('href');
            returnLinks.push(newLink);
        }

        return returnLinks;

    });

});

casper.run(function() {
    this.echo(editions);
    this.echo(JSON.stringify(editions)).exit();
});