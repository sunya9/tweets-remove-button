# tweets-remove-button
Remove tweets from Amazon dash button.

## Setup

### Install libpcap
```
# Ubuntu and Debian
sudo apt-get install libpcap-dev
# Fedora and CentOS
sudo yum install libpcap-devel
```

### Get MAC Address of Your amazon dash button

Require sudo.
```
sudo npm run scan
```

### Write .env

Require Twitter's API Key. Please use a tool like [TwiTokenGetter](https://ttg.unsweets.net/) and get Access token and Access token secret.
If you would like to set PROTECT_* to `false`, need empty.

e.g.
```
DASH_BUTTON_MAC_ADDRESS=
CONSUMER_KEY=
CONSUMER_SECRET=
ACCESS_TOKEN=
ACCESS_TOKEN_SECRET=
PROTECT_FAVORITE=true
PROTECT_RETWEET=true
PROTECT_REPLY=
```

### Run
Require sudo.
```
sudo npm start
```

## Docker version

```
docker run --env-file=.env --restart=always --net=host -d sunya/trb
```