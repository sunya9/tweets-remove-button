const DashButton = require('dash-button')
const Twitter = require('twitter')
const ProgressBar = require('progress')

class TweetsRemoveButton {
  constructor() {
    this._beginRemoveTask = this._beginRemoveTask.bind(this)
    this._getTweets = this._getTweets.bind(this)
    this._filterRemovableTweets = this._filterRemovableTweets.bind(this)
    this._getTweetIds = this._getTweetIds.bind(this)
    this._removeTweets = this._removeTweets.bind(this)

    const dashButton = new DashButton(process.env.DASH_BUTTON_MAC_ADDRESS)
    dashButton.addListener(this._beginRemoveTask)
    this._twitter = new Twitter({
      consumer_key: process.env.CONSUMER_KEY,
      consumer_secret: process.env.CONSUMER_SECRET,
      access_token_key: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET
    })
  }

  _beginRemoveTask() {
    this._getTweets()
      .then(this._filterRemovableTweets)
      .then(this._getTweetIds)
      .then(this._removeTweets)
      .then(console.log.bind(null, 'Removed %d tweets!'))
      .catch(console.error)
  }

  async _getTweets() {
    console.log('Getting all tweets...')
    const options = {
      count: 200,
      trim_user: true
    }
    const allTweets = []
    while(true) {
      try {
        const tweets = await this._twitter.get('statuses/user_timeline', options)
        if(options.max_id) { // exclude first request
          tweets.shift()
        }
        if(tweets.length > 0) {
          console.log('Got %d tweets.', tweets.length)
          allTweets.push(...tweets)
          options.max_id = tweets[tweets.length - 1].id_str
        } else {
          break
        }
      } catch(e) {
        console.error(e)
        break
      }
    }
    console.log('Get %d tweets.', allTweets.length)
    return Promise.resolve(allTweets)
  }

  _filterRemovableTweets(tweets) {
    const filteredTweets = tweets.filter(tweet => {
      const protectedReply = !!process.env.PROTECT_REPLY && tweet.in_reply_to_screen_name
      const protectedFavorite = !!process.env.PROTECT_FAVORITE && tweet.favorite_count > 0
      const protectedRetweet = !!process.env.PROTECT_RETWEET && tweet.retweet_count > 0
      return !protectedReply && !protectedFavorite && !protectedRetweet
    })
    console.log('Filtered: Target is %d tweets.', filteredTweets.length)
    return filteredTweets
  }

  _getTweetIds(tweets) {
    return tweets.map(tweet => tweet.id_str)
  }

  async _removeTweets(tweetIds) {
    const bar = new ProgressBar('[:bar] :current/:total :etas', {
      total: tweetIds.length,
      width: 20
    })
    return await tweetIds.reduce(async (count, tweetId) => {
      try {
        await this._twitter.post(`/statuses/destroy/${tweetId}`, {})
        bar.tick()
        count++
      } catch(e) {
        console.error(e)
      }
      return count
    }, 0)
  }
}

module.exports = TweetsRemoveButton
