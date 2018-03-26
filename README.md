# TweetTracker

## Overview
TweetTracker is a javascript app that tracks tweets with provided keywords and logs related data in a local MySQL database. 
This app utilizes the "twit" node package to capture tweets and the "mysql" node package to log that information to a local MySQL database. 

## Specifics
All passwords and sensitive twitter information have been removed from the tweettracker(nopasswords).js file. 
Tweets are searched based on the words provided inside the "searchCriteria" variable. Currently, "stats" and "statistics" are the only words tracked.
When a tweet containing a desired word is found, it is parsed and submitted to a local MySQL database. Each word is checked to ensure that is contains ascii 
characters within a certain range. This ensures that symbols like emojis are not tracked.
