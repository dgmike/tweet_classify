package com.github.dgmike.tweetclassify.api.repositories;

import com.github.dgmike.tweetclassify.api.entities.TweetsByHour;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "tweets_by_hours", path = "tweets_by_hours")
public interface TweetsByHoursRepository extends MongoRepository<TweetsByHour, String> {
}
