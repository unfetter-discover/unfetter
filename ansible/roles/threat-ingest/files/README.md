## <u>Configuring Threat Ingest for your site</u>

The default deployment of Unfetter includes two generic feeds for threat report ingest: The DoD general news feed and DHS's alert feed. Neither of these feeds have anything that you would probably consider truly useful; they are included simply for demonstration.

In addition, the DoD News feed also gets a sample plugin included in the default distribution. This Typescript program illustrates how to write your own plugin for your own specific feed. If you open the plugin, you will note that your editor will probably flag errors, because it doesn't recognize any of its imports. But this file will be volume-mapped into the threat-ingest container and compiled into it. To write your own feed processor, it is recommended that you clone the unfetter-store repo, use your IDE to create and possibly test your processor in the unfetter-threat-ingest plugins directory, and, when ready, move the file to the plugins directory here, for distribution on your site.

The sample database configuration for your feeds is stored in the files/config/config.json. I recommend copying this file to preserve it, then editing it to provide a list of feeds you actively require.

If a feed you query requires user certs, store the certs in the config directory. They will be copied into the container, in directory /usr/share/unfetter-threat-ingest/config. Use the resulting path in your database configuration, by adding an options property to the feed:
```json
    {
        "name" : "My Report RSS Feed",
        "source" : "https://www.rssfeed.org/",
        "active" : true,
        "parser" : {
            "type" : "my-rss-feed",
            "root" : "feed",
            "articles" : "entry",
            "options" : {
                "key": "/usr/share/unfetter-threat-ingest/myuser.key.pem",
                "cert": "/usr/share/unfetter-threat-ingest/myuser.crt.pem"
            }
        }
    }
```

Using the above example, the filename for the plugin you write for this feed _must_ be named `threat-feed-my-rss-feed-parser.ts`.
