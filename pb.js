const PushBullet = require("pushbullet");
const axios = require("axios");
const { PB_KEY, IDEN } = process.env;

const key = PB_KEY;
const iden = IDEN;
const pbBase = "https://api.pushbullet.com"

const pb = new PushBullet(key);
module.exports = {
    notify: async (title, body, url) => {
        await axios.post(`${pbBase}/v2/pushes`,
            {
                "body": body,
                "title": title,
                "type": "link",
                "url": url,
                "sender_iden": iden
            },
            {
                headers: {
                    "Access-Token": key
                }
            });
        // await pb.link()
        // return devices;
    }
}