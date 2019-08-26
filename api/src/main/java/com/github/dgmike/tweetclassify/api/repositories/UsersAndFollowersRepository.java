package com.github.dgmike.tweetclassify.api.repositories;

import com.github.dgmike.tweetclassify.api.entities.UsersAndFollowers;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "users_and_followers", path = "users_and_followers")
public interface UsersAndFollowersRepository  extends MongoRepository<UsersAndFollowers, String> {
}
