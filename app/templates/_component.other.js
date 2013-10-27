define(<%= JSON.stringify( _.keys(dependencies) ) %>, function(<%= _(dependencies).keys().map(_.classify).value().join(', ') %>) {
	console.log('<%= name.classified %> running!')

	

});
