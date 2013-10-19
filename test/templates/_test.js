define(['<%= componentName %>'], function(<%= _.classify(componentName.replace(/\./g,'-')) %>) {

return function() {

    module('<%= _.humanize(name) %>');

    test('<%= _.humanize(name) %>', function() {
        ok(true);
    });

}
});
