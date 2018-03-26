var Twit = require('twit');
var T = new Twit({
      consumer_key:         'consumer key',
      consumer_secret:      'consumer secret',
      access_token:         'access token', 
      access_token_secret:  'access token secret',
      timeout_ms:           50 * 1000,
});

var mysql = require('mysql');

var count = 0;

var con = mysql.createConnection({
  host: "localhost",
  user: "jbranham123",
  password: "password",
  database: "tweetanalysis",
  charset: "utf8mb4",
  multipleStatements: true
});

var searchCriteria = 'stats, statistics';

var stream = T.stream('statuses/filter', { track: searchCriteria, language: 'en'});

stream.on('tweet', function (tweet) {

        var words = [];
       
        var tweetDetails = {};
        tweetDetails.fullTweet = validateField(tweet.text);
        tweetDetails.userName = validateField(tweet.user.name);
        tweetDetails.userScreenName = validateField(tweet.user.screen_name);
        tweetDetails.userLocation = validateField(tweet.user.location);
        tweetDetails.userDescription = validateField(tweet.user.description);
        tweetDetails.userFollowers = tweet.user.followers_count;

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        tweetDetails.tweetDate = year + "/" + month + "/" + day;
    
        tweetDetails.searchCriteria = searchCriteria;
        
    
        var wordsArray = tweetDetails.fullTweet.split(' ');
        var i;
        for (i = 0; i < wordsArray.length; i++){
            if (wordsArray[i] != ''){
                var word = [];
                word[0] = wordsArray[i];
                word[1] =  tweetDetails.userLocation;
                word[2] =  tweetDetails.tweetDate; 
                word[3] =  tweetDetails.searchCriteria;
                word[4] = 1;
                words.push(word);
            }
        }
    
    
        var query = con.query('INSERT INTO tweetdetails SET ?; INSERT INTO tweetwords VALUES ? ON DUPLICATE KEY UPDATE count = count + 1', [tweetDetails, words], function(err, result){
            if (err){
                console.log(query);
                throw err;  
            } 
        });
});


function validateField(field){
    var returnString = ''
    if (field === null || field === ''){
        returnString = 'Unknown';
    }
    else{
        returnString = field.replace(/[^\x20-\x7E]+/g, '');
        
    }
    if (returnString === null || returnString === ''){
        returnString = 'Invalid Characters';
    }
    return returnString;
}