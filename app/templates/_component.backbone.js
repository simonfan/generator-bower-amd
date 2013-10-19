define(<%= JSON.stringify( _.keys(dependencies) ) %>, function(<%= _(dependencies).keys().map(_.classify).value().join(', ') %>) {
    console.log('<%= name.classified %> running!')

<% if (componentType === 'backbone.model') {%>
    var <%= name.classified %> = Backbone.Model.extend({
        initialize: function(attributes, options) {

        },
    });
<%} else if (componentType === 'backbone.view') {%>
    var <%= name.classified %> = Backbone.View.extend({
        initialize: function(options) {

        },
    });
<%} else if (componentType === 'backbone.collection') {%>
    var <%= name.classified %> = Backbone.Collection.extend({
        initialize: function(models, options) {

        },
    });
<%} %>

    return <%= name.classified %>;
});
