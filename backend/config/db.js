import pg from 'pg';
var conString = "postgres://VEGA:VEGA@host:5432/TEST";
var pool = new pg.Pool(conString);
pool.connect();