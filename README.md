# tweets-remove-button
Remove tweets from Amazon dash button.

## Setup

Using Docker, you replace `sudo` with `docker exec`

### Preare

If you use with Docker, unnecessary it.
```
# Ubuntu and Debian
sudo apt-get install libpcap-dev
# Fedora and CentOS
sudo yum install libpcap-devel
```

### Get MAC Address of Your amazon dash button

```
# manual
sudo npm run scan

# Docker
docker run --rm --net=host sunya/tweets-remove-button npm run scan
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

## Run

```
# manual
sudo npm start

# Docker
docker run --env-file=.env --restart=always --net=host -d sunya/tweets-remove-button
```
