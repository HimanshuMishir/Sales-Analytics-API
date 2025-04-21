const startServer = require('./app');
console.log = function () {
 } ;

startServer().then(app => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.info(`Server ready at http://localhost:${PORT}/graphql`);
    });
});