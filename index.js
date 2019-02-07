require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

const { CLIENT_ID: clientId,
    CLIENT_SECRET: clientSecret,
    REDDIT_USER: username,
    REDDIT_PASS: password,
    REDDIT_USER_AGENT: userAgent } = process.env;

const bot = new Snoowrap({
    userAgent,
    clientId,
    clientSecret,
    username,
    password
});

const client = new Snoostorm(bot);

const SUGGEST_A_LAPTOP = 'testingground4bots'

const suggestALaptopCommentOpts = {
    subreddit: SUGGEST_A_LAPTOP,
    results: 5,
    pollTime: 10000
}

const suggestALaptopPostOpts = suggestALaptopCommentOpts;

const suggestALaptopComments = client.CommentStream(suggestALaptopCommentOpts);
const suggestALaptopPosts = client.SubmissionStream(suggestALaptopPostOpts);

/**
 * To be used with posts outside of /r/suggestalaptops
 */

const stringsToDetect = ["avocado", "orange"];
// const stringsToDetect = ["laptop", "philippines"];

const detectStrings = (input) => {

}


const notifyMe = (message) => {
    console.log(message);
}

suggestALaptopComments.on('comment', (comment) => {
    stringsToDetect.some(string => {
        if (comment.body.includes(string)) {
            console.log(`Post title: ${comment.link_title}`)
            console.log(`Comment Body: ${comment.body}`)
            return true;
        } else {
            return false;
        }
    })
});

suggestALaptopPosts.on('submission', (post) => {
    stringsToDetect.some(string => {
        if (post.selftext.includes(string) || post.title.includes(string)) {
            console.log(`Title: ${post.title}`);
            console.log(`Selftext: ${post.selftext}`);
            return true;
        } else {
            return false;
        }
    })
})
