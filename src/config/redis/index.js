const redis = require('redis');
const client = redis.createClient({
    port: 18212,
    host: 'redis-18212.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com',
    password: 'oNJYcAlcqwgrhrNJLxn1kJQV6D2e0YaA'
});

client.ping((err, pong) => {
    console.log(pong);
})

client.on("error", function(err) {
    console.log(err);
});

client.on("connect", function(err) {
    console.log("connected");
});

client.on("ready", function(err) {
    console.log(`Redis to ready`);
});

module.exports = client