define(['<%= componentName %>'], function(<%= _.classify(componentName.replace(/\./g,'-')) %>) {

    console.log('<%= _.humanize(name) %> demo running.');

    alert('<%= _.humanize(name) %>');
});
