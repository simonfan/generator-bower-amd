define(['<%= componentName %>'], function(<%= _.classify(componentName.replace(/\./g,'-')) %>) {

return function() {

    QUnit.module('<%= _.humanize(name) %>');

    test('<%= _.humanize(name) %>', function() {
        ok(true);
    });

}
});
