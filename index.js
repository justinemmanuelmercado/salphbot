require('dotenv').config();
const { mailer } = require("./mailer");

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

let SUGGEST_A_LAPTOP = 'testingground4bots';
let PHILIPPINES = 'testingground4bots';
let POLL_TIME = 10000; // 10 minutes
let NUMBER_OF_RESULTS = 2;

if (process.env.ENVIRONMENT !== "testing") {
    SUGGEST_A_LAPTOP = "suggestalaptop";
    PHILIPPINES = "philippines";
    POLL_TIME = 1000 * 60 * 10;
    NUMBER_OF_RESULTS = 25;
}


const suggestALaptopCommentOpts = {
    subreddit: SUGGEST_A_LAPTOP,
    results: NUMBER_OF_RESULTS,
    pollTime: POLL_TIME
}
const suggestALaptopSubmissionOpts = suggestALaptopCommentOpts;

const philippineCommentOpts = {
    subreddit: PHILIPPINES,
    results: NUMBER_OF_RESULTS,
    pollTime: POLL_TIME
};
const philippineSubmissionOpts = philippineCommentOpts;

const suggestALaptopCommentStream = client.CommentStream(suggestALaptopCommentOpts);
const suggestALaptopSumissionStream = client.SubmissionStream(suggestALaptopSubmissionOpts);
const philippineCommentStream = client.CommentStream(philippineCommentOpts);
const philippineSubmissionStream = client.SubmissionStream(philippineSubmissionOpts);

const notifyMe = (subject, message) => {
    mailer({ subject, message });
    // console.log(subject, message);
}

/**
 * Subreddit: SuggestALaptop
 * On comment, check comment if contains the word Philippines
 */
suggestALaptopCommentStream.on('comment', (comment) => {
    if (comment.body.toLowerCase().includes('philippines')) {
        notifyMe(
            `SuggestALaptop Comment`,
            `Post title: ${comment.link_title}
            Comment Body: ${comment.body}
            Link: ${comment.link_permalink}`)
    }
});

/**
 * Subreddint: SuggestALaptop
 * On post submission, check selftext and title if they contain the word Philippines or the peso sign
 */
suggestALaptopSumissionStream.on('submission', (post) => {
    if (post.selftext.toLowerCase().includes('philippines') ||
        post.title.toLowerCase().includes('philippines')) {
        notifyMe(
            `SuggestALaptop Submission`,
            `Title: ${post.title}
             Selftext: ${post.selftext}
             Link: ${post.permalink}`
        );
    }
})

/**
 * Subreddit: Philippines
 * On comment, check if comment contains the word laptop
 */

philippineCommentStream.on('comment', (comment) => {
    if (comment.body.toLowerCase().includes('laptop')) {
        notifyMe(`Philippines comment`,
            `Post title: ${comment.link_title}
            Comment Body: ${comment.body}
            Link: ${comment.link_permalink}`)
    }
})

/**
 * Subreddit: Philippines
 * On submission, check selftext and title if they contain the word laptop
 */
philippineSubmissionStream.on('submission', (post) => {
    if (post.selftext.toLowerCase().includes('laptop') ||
        post.title.toLowerCase().includes('laptop')) {
        notifyMe(
            `Philippines Submission`,
            `Title: ${post.title}
                 Selftext: ${post.selftext}
                 Link: ${post.permalink}`
        );
    }
})

console.log(`Running in ${process.env.ENVIRONMENT}`);
console.log(`Crawling ${SUGGEST_A_LAPTOP} and ${PHILIPPINES}. Polling every ${POLL_TIME/1000} second/s for ${NUMBER_OF_RESULTS} results`);