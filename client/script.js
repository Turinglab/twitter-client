currentChart = "list"
// Update with new data from server
function update() {

  var query = $('#query').val();
  var url = 'https://turing-twitter.herokuapp.com/' + query;

  var url = 'data.json';

  $.get(url,function(response){
    if (currentChart == "list") {
      showTweets(response.tweets);
    } else if (currentChart == "bar") {
      showBar(response);
    } else {
      showBubble(response);
    }
    // showRaw(response);
  })
}

function showBar(response) {

  var tweet;
  var tweets = response.tweets.sort((tweetA,tweetB) => tweetA.polarity - tweetB.polarity);
  var data = [];

  for (var i in tweets){
    tweet = tweets[i];

    if (tweet.polarity == 0) continue;

    data.push({
      text: tweet.text,
      y: tweet.polarity,
    });
  }

  var bar = new TuringBar('#bar',data);
  bar.axis({y:'Polarity'});
  bar.yLabels(function(){
    return `${Math.floor(this.value * 100)}%`
  })

}

function showBubble(response) {

  var tweet;
  var date;
  var data = [];

  for(var i in response.tweets){ 
    tweet = response.tweets[i];
    date = new Date(tweet.createdAt)

    console.log(typeof date);

    data.push({
      text: tweet.text,
      x: tweet.polarity,
      y: new Date(tweet.createdAt),
      z: tweet.text.length,
    });

  };

  var bubble = new TuringBubble('#bubble',data);
  bubble.axis({x:'Polarity',y:'Time'});
  bubble.xLabels(function(){
    return `${Math.floor(this.value * 100)}%`
  })

}

function handleRadio(selected) {
  if (selected.value == "bubble") {
    currentChart="bubble";
    $('#list').hide();
    $('#bubble').show();
    $('#bar').hide();
    update();
  } else if (selected.value == "bar") {
    currentChart="bar";
    $('#list').hide();
    $('#bubble').hide();
    $('#bar').show();
    update()
  } else {
    currentChart="list";
    $('#list').show();
    $('#bubble').hide();
    $('#bar').hide();
    update()
  }
}

// Display the raw data on the page
function showRaw(data){
  var string = JSON.stringify(data,null,2)
  $('#results').html(string).show();
}

// Create a list of tweets
function showTweets(tweets) {
  var list = $('#tweets');
  list.html('');

  // Loop through all tweets
  for (var i in tweets){

    // If the tweet has been retweeted then add a line to the list
    addTweet(list,tweets[i]);
  
  }

  // Show the list
  list.show();
}

// Add an individual tweet to the page
function addTweet(list, tweet) {

  // Create a new line element
  var line = $(document.createElement('li'));

  // Set the inner html of the line
  line.html(`${tweet.text} - <strong>${tweet.username}</strong>`);

  // Change the style of the tweet depending on polarity
  if (tweet.polarity < 0){
    line.addClass('negative tweet')
  } else {
    line.addClass('positive tweet')
  }

  var date = new Date(tweet.createdAt);
  console.log(date.getFullYear());

  // Add the line to the list
  list.append(line);
}

// When document loaded update data
// $(function(){
//     update('branding');
// });