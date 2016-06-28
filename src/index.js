const hyped = require( "hyped" )( {} );
const autohost = require( "autohost" );
const config = require( "configya" )( {
	file: "./config.json"
} );
const fount = require( "fount" );

if ( !config.docker.user || !config.docker.pass ) {
	throw new Error( "DOCKER_PASS or DOCKER_USER is not defined" );
}

const environments = require( "./data/nedb/environment" );
fount.register( "environment", environments );


const slack = require( "./slack" )( config.slack.token, environments );
fount.register( "slack", slack );

const dockerhub = require( "./dockerhub" )(config.docker.user, config.docker.pass)
fount.register( "dockerhub", dockerhub );


const host = hyped.createHost( autohost, {
	port: config.host.port,
	fount: fount,
	noSession: true,
	session: null,
	handleRouteErrors: true
} );
host.start();
